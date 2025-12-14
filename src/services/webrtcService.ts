import { io, Socket } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000/signaling'

// VAD 설정
const VOLUME_THRESHOLD = -19 // dB (19 데시벨 이상만 감지)
const SILENCE_DURATION = 1000 // 1초
const CHECK_INTERVAL = 100 // 100ms
const MINIMUM_RECORDING_DURATION = 3000 // 3초 - 최소 녹음 시간

export interface CallData {
  id: string
  sessionId: string
  callerNumber: string
  status: string
  createdAt: string
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  iceCandidatePoolSize: number
  iceTransportPolicy: RTCIceTransportPolicy
  bundlePolicy: RTCBundlePolicy
  rtcpMuxPolicy: RTCRtcpMuxPolicy
}

export interface VADStatus {
  volume: number
  isSpeaking: boolean
  isAIResponding: boolean
  audioSentCount: number
  aiResponseCount: number
}

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private socket: Socket | null = null
  private callId: string | null = null
  private sessionId: string | null = null
  private peerId: string = `client-${Date.now()}`

  // VAD 관련
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private isRecording = false
  private isAIResponding = false
  private isWaitingForAIResponse = false // 요청 전송 후 응답 대기 중
  private lastSpeechTime = 0
  private isSpeaking = false
  private vadCheckInterval: ReturnType<typeof setInterval> | null = null
  private audioSentCount = 0
  private aiResponseCount = 0
  private lastAudioSentTime = 0 // 마지막 오디오 전송 시간
  private recordingStartTime = 0 // 녹음 시작 시간

  // 콜백
  private onVADStatusChange?: (status: VADStatus) => void
  private onAIResponse?: (audioBlob: Blob) => void
  private onFirstAIResponse?: () => void

  async getWebRTCConfig(): Promise<WebRTCConfig> {
    const response = await fetch(`${API_BASE_URL}/calls/config`)
    const data = await response.json()
    return data.data.config
  }

  async startCall(callerNumber: string): Promise<CallData> {
    const response = await fetch(`${API_BASE_URL}/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ callerNumber }),
    })

    const data = await response.json()
    this.callId = data.data.call.id
    this.sessionId = data.data.call.sessionId
    return data.data.call
  }

  setVADStatusCallback(callback: (status: VADStatus) => void): void {
    this.onVADStatusChange = callback
  }

  setAIResponseCallback(callback: (audioBlob: Blob) => void): void {
    this.onAIResponse = callback
  }

  setFirstAIResponseCallback(callback: () => void): void {
    this.onFirstAIResponse = callback
  }

  private getVolume(): number {
    if (!this.analyser) return -100

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)

    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i]
    }
    const rms = Math.sqrt(sum / dataArray.length)
    const db = 20 * Math.log10(rms / 255)

    return isFinite(db) ? db : -100
  }

  private emitVADStatus(): void {
    if (this.onVADStatusChange) {
      this.onVADStatusChange({
        volume: this.getVolume(),
        isSpeaking: this.isSpeaking,
        isAIResponding: this.isAIResponding,
        audioSentCount: this.audioSentCount,
        aiResponseCount: this.aiResponseCount,
      })
    }
  }

  private startVADChecking(): void {
    console.log(`🎤 VAD 체크 시작 (임계값: ${VOLUME_THRESHOLD}dB, 침묵: ${SILENCE_DURATION}ms)`)

    this.vadCheckInterval = setInterval(() => {
      if (!this.localStream) {
        this.emitVADStatus()
        return
      }

      // AI 응답 대기 중이거나 AI 응답 중이면 녹음하지 않음
      if (this.isAIResponding || this.isWaitingForAIResponse) {
        // AI 응답 대기/중이면 녹음 중지
        if (this.isRecording) {
          const elapsedSinceSent = this.lastAudioSentTime > 0
            ? ((Date.now() - this.lastAudioSentTime) / 1000).toFixed(2)
            : 'N/A'
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          console.log(`⚠️ ${this.isWaitingForAIResponse ? 'AI 응답 대기 중' : 'AI 응답 중'} - 녹음 강제 중지`)
          console.log(`   마지막 전송 후 경과: ${elapsedSinceSent}초`)
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          this.stopRecording()
          this.isSpeaking = false
        }
        this.emitVADStatus()
        return
      }

      const volume = this.getVolume()
      const now = Date.now()
      const silenceDuration = this.lastSpeechTime > 0 ? now - this.lastSpeechTime : 0

      // 디버깅용 - 1초마다 현재 상태 출력
      if (now % 1000 < CHECK_INTERVAL) {
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        console.log(`📊 [VAD 체크] ${new Date().toLocaleTimeString()}.${now % 1000}`)
        console.log(`   🔊 음량: ${volume.toFixed(1)}dB (임계값: ${VOLUME_THRESHOLD}dB)`)
        console.log(`   🎤 isSpeaking: ${this.isSpeaking}`)
        console.log(`   ⏺️  isRecording: ${this.isRecording}`)
        console.log(`   ⏱️  침묵 지속: ${this.isSpeaking ? (silenceDuration / 1000).toFixed(2) + '초' : 'N/A'}`)
        console.log(`   📊 상태: Waiting=${this.isWaitingForAIResponse}, Responding=${this.isAIResponding}`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      }

      // 음성 감지 (-19dB 이상)
      if (volume > VOLUME_THRESHOLD) {
        if (!this.isSpeaking) {
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          console.log(`🎙️ [음성 감지 시작] ${new Date().toLocaleTimeString()}.${now % 1000}`)
          console.log(`   🔊 음량: ${volume.toFixed(1)}dB > ${VOLUME_THRESHOLD}dB`)
          console.log(`   📊 상태 변경 전:`)
          console.log(`      - isSpeaking: ${this.isSpeaking} → true`)
          console.log(`      - isRecording: ${this.isRecording}`)
          console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse}`)
          console.log(`      - isAIResponding: ${this.isAIResponding}`)

          this.isSpeaking = true
          console.log(`   ✅ isSpeaking = true 설정 완료`)

          if (!this.isRecording) {
            console.log(`   🎬 녹음 시작 호출 (startRecording)`)
            this.startRecording()
          } else {
            console.log(`   ⚠️  이미 녹음 중 - startRecording 호출 안 함`)
          }
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        }
        this.lastSpeechTime = now
      } else {
        // 침묵 체크 (-19dB 이하가 1초 동안 지속)
        if (this.isSpeaking && silenceDuration > SILENCE_DURATION) {
          // 녹음 시간 체크 - 3초 미만이면 침묵 감지 무시하고 계속 녹음
          const currentRecordingDuration = this.recordingStartTime > 0 ? now - this.recordingStartTime : 0

          if (currentRecordingDuration < MINIMUM_RECORDING_DURATION) {
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            console.log(`⏳ [침묵 감지 무시] ${new Date().toLocaleTimeString()}.${now % 1000}`)
            console.log(`   🔊 음량: ${volume.toFixed(1)}dB <= ${VOLUME_THRESHOLD}dB`)
            console.log(`   ⏱️  침묵 지속: ${(silenceDuration / 1000).toFixed(2)}초`)
            console.log(`   ⏱️  녹음 시간: ${(currentRecordingDuration / 1000).toFixed(2)}초 < ${MINIMUM_RECORDING_DURATION / 1000}초`)
            console.log(`   ⚠️  최소 녹음 시간 미달 - 침묵 무시하고 계속 녹음`)
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            // 침묵 무시하고 계속 녹음 (isSpeaking 유지)
          } else {
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            console.log(`🔇 [침묵 감지] ${new Date().toLocaleTimeString()}.${now % 1000}`)
            console.log(`   🔊 음량: ${volume.toFixed(1)}dB <= ${VOLUME_THRESHOLD}dB`)
            console.log(`   ⏱️  침묵 지속 시간: ${(silenceDuration / 1000).toFixed(2)}초 > ${SILENCE_DURATION / 1000}초`)
            console.log(`   ⏱️  녹음 시간: ${(currentRecordingDuration / 1000).toFixed(2)}초 >= ${MINIMUM_RECORDING_DURATION / 1000}초`)
            console.log(`   📊 상태 변경 전:`)
            console.log(`      - isSpeaking: ${this.isSpeaking} → false`)
            console.log(`      - isRecording: ${this.isRecording}`)
            console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse}`)
            console.log(`      - isAIResponding: ${this.isAIResponding}`)

            this.isSpeaking = false
            console.log(`   ✅ isSpeaking = false 설정 완료`)

            if (this.isRecording) {
              console.log(`   🛑 녹음 중지 호출 (stopRecording)`)
              this.stopRecording()
            } else {
              console.log(`   ⚠️  녹음 중이 아님 - stopRecording 호출 안 함`)
            }
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          }
        }
      }

      this.emitVADStatus()
    }, CHECK_INTERVAL)
  }

  private startRecording(): void {
    const now = Date.now()
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`⏺️ [startRecording 호출] ${new Date().toLocaleTimeString()}.${now % 1000}`)
    console.log(`   📊 상태:`)
    console.log(`      - isRecording: ${this.isRecording}`)
    console.log(`      - localStream: ${this.localStream ? '✅ 있음' : '❌ 없음'}`)
    console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse}`)
    console.log(`      - isAIResponding: ${this.isAIResponding}`)

    if (this.isRecording || !this.localStream) {
      const reason = this.isRecording ? '이미 녹음 중' : 'localStream 없음'
      console.log(`   ⚠️  녹음 시작 불가: ${reason}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      return
    }

    console.log(`   ✅ 녹음 시작 조건 만족`)
    this.recordedChunks = []

    try {
      this.mediaRecorder = new MediaRecorder(this.localStream, {
        mimeType: 'audio/webm;codecs=opus',
      })
      console.log(`   ✅ MediaRecorder 생성 완료`)

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data)
          console.log(`📦 청크: ${(e.data.size / 1024).toFixed(1)}KB`)
        }
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
        const stopTime = Date.now()
        const recordingDuration = this.recordingStartTime > 0 ? stopTime - this.recordingStartTime : 0

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        console.log(`⏹️ [onstop 콜백] 녹음 완료`)
        console.log(`   🕐 완료 시간: ${new Date().toLocaleTimeString()}.${stopTime % 1000}`)
        console.log(`   ⏱️  녹음 시간: ${(recordingDuration / 1000).toFixed(2)}초`)
        console.log(`   📦 크기: ${(blob.size / 1024).toFixed(1)}KB`)
        console.log(`   📊 현재 상태:`)
        console.log(`      - isRecording: ${this.isRecording}`)
        console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse ? '⛔ true' : '✅ false'}`)
        console.log(`      - isAIResponding: ${this.isAIResponding ? '⛔ true' : '✅ false'}`)

        // AI 상태 체크 - AI 대기/응답 중이면 전송하지 않음
        if (this.isWaitingForAIResponse || this.isAIResponding) {
          const reason = this.isWaitingForAIResponse ? 'AI 응답 대기 중' : 'AI 응답 중'
          console.log(`❌ [onstop 차단] ${reason} - sendAudio 호출 안 함`)
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          return
        }

        console.log(`✅ [onstop 통과] 조건 만족 - sendAudio 호출`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        this.sendAudio(blob)
      }

      this.mediaRecorder.start()
      this.isRecording = true
      this.recordingStartTime = Date.now()
      console.log(`   ✅ MediaRecorder.start() 호출 완료`)
      console.log(`   🔒 isRecording = true 설정`)
      console.log(`   🕐 시작 시간: ${new Date().toLocaleTimeString()}.${this.recordingStartTime % 1000}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    } catch (e) {
      console.error('❌ 녹음 실패:', e)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    }
  }

  private stopRecording(): void {
    const now = Date.now()
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`🛑 [stopRecording 호출] ${new Date().toLocaleTimeString()}.${now % 1000}`)
    console.log(`   📊 상태:`)
    console.log(`      - isRecording: ${this.isRecording}`)
    console.log(`      - mediaRecorder: ${this.mediaRecorder ? '✅ 있음' : '❌ 없음'}`)
    console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse ? '⛔ true' : '✅ false'}`)
    console.log(`      - isAIResponding: ${this.isAIResponding ? '⛔ true' : '✅ false'}`)

    if (!this.isRecording || !this.mediaRecorder) {
      const reason = !this.isRecording ? '녹음 중이 아님' : 'mediaRecorder 없음'
      console.log(`   ⚠️  중지 불가: ${reason}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      return
    }

    console.log(`   ✅ 중지 조건 만족`)

    try {
      this.mediaRecorder.stop()
      this.isRecording = false
      const stopTime = Date.now()
      console.log(`   ✅ MediaRecorder.stop() 호출 완료`)
      console.log(`   🔓 isRecording = false 설정`)
      console.log(`   🕐 중지 시간: ${new Date().toLocaleTimeString()}.${stopTime % 1000}`)
      console.log(`   ⏱️  stop() 소요 시간: ${stopTime - now}ms`)
      console.log(`   ⏳ onstop 콜백 대기 중...`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    } catch (e) {
      console.error('❌ 중지 실패:', e)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    }
  }

  private sendAudio(blob: Blob): void {
    const now = Date.now()
    const timeSinceLastSent = this.lastAudioSentTime > 0 ? now - this.lastAudioSentTime : 0

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📤 [sendAudio 호출] 오디오 전송 시도`)
    console.log(`   🕐 호출 시간: ${new Date().toLocaleTimeString()}.${now % 1000}`)
    console.log(`   ⏱️  마지막 전송 후 경과: ${timeSinceLastSent > 0 ? (timeSinceLastSent / 1000).toFixed(3) + '초' : 'N/A'}`)
    console.log(`   📦 크기: ${(blob.size / 1024).toFixed(1)}KB`)
    console.log(`   📊 상태:`)
    console.log(`      - isRecording: ${this.isRecording}`)
    console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse ? '⛔ true' : '✅ false'}`)
    console.log(`      - isAIResponding: ${this.isAIResponding ? '⛔ true' : '✅ false'}`)
    console.log(`      - audioSentCount: ${this.audioSentCount}`)
    console.log(`      - aiResponseCount: ${this.aiResponseCount}`)

    // 첫 번째 체크: sendAudio 진입 시점
    if (this.isAIResponding || this.isWaitingForAIResponse) {
      const reason = this.isWaitingForAIResponse ? 'AI 응답 대기 중' : 'AI 응답 중'
      console.log(`❌ [차단 #1 - 진입시] ${reason} - 전송 즉시 취소`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      return
    }

    if (blob.size < 15000) {
      console.log(`⚠️ [차단 - 크기] 너무 작음: ${(blob.size / 1024).toFixed(1)}KB < 15KB`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      return
    }

    console.log(`   Socket: ${this.socket ? '✅ 연결됨' : '❌ 없음'}`)
    console.log(`   Session ID: ${this.sessionId ? '✅ ' + this.sessionId : '❌ 없음'}`)
    console.log(`   Call ID: ${this.callId ? '✅ ' + this.callId : '❌ 없음'}`)

    const reader = new FileReader()
    reader.onloadend = () => {
      const readerTime = Date.now()
      console.log(`   🔄 [FileReader 완료] 시간: ${new Date().toLocaleTimeString()}.${readerTime % 1000}`)
      console.log(`   ⏱️  FileReader 처리 시간: ${readerTime - now}ms`)

      // 두 번째 체크: FileReader 완료 후
      if (this.isAIResponding || this.isWaitingForAIResponse) {
        const reason = this.isWaitingForAIResponse ? 'AI 응답 대기 중' : 'AI 응답 중'
        console.log(`❌ [차단 #2 - FileReader 후] ${reason} - 전송 취소`)
        console.log(`   상태: isWaiting=${this.isWaitingForAIResponse}, isResponding=${this.isAIResponding}`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        return
      }

      if (this.socket && this.sessionId && this.callId) {
        const base64Data = (reader.result as string).split(',')[1]
        console.log(`   📝 Base64 길이: ${base64Data.length} chars`)

        // 세 번째 체크: emit 직전
        if (this.isAIResponding || this.isWaitingForAIResponse) {
          const reason = this.isWaitingForAIResponse ? 'AI 응답 대기 중' : 'AI 응답 중'
          console.log(`❌ [차단 #3 - emit 직전] ${reason} - 전송 취소`)
          console.log(`   상태: isWaiting=${this.isWaitingForAIResponse}, isResponding=${this.isAIResponding}`)
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          return
        }

        // 🔒 상태 변경 (전송 직전)
        const beforeEmit = Date.now()
        this.isWaitingForAIResponse = true
        this.lastAudioSentTime = beforeEmit
        console.log(`🔒 [상태 변경] isWaitingForAIResponse = true`)
        console.log(`   🕐 설정 시간: ${new Date().toLocaleTimeString()}.${beforeEmit % 1000}`)

        this.socket.emit('user-audio', {
          sessionId: this.sessionId,
          callId: this.callId,
          audioData: base64Data,
          mimeType: 'audio/webm',
        })

        this.audioSentCount++
        const afterEmit = Date.now()
        console.log(`✅ [전송 완료] 서버로 전송 성공! (#${this.audioSentCount})`)
        console.log(`   🕐 emit 완료 시간: ${new Date().toLocaleTimeString()}.${afterEmit % 1000}`)
        console.log(`   ⏱️  emit 소요 시간: ${afterEmit - beforeEmit}ms`)
        console.log(`⏳ AI 응답 대기 중... (isWaitingForAIResponse = true)`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        this.emitVADStatus()
      } else {
        console.error(`❌ 전송 실패! - 연결 정보 없음`)
        console.error(`   Socket: ${this.socket ? '있음' : '❌ 없음'}`)
        console.error(`   Session ID: ${this.sessionId || '❌ 없음'}`)
        console.error(`   Call ID: ${this.callId || '❌ 없음'}`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      }
    }
    reader.readAsDataURL(blob)
  }

  async connectToServer(onRemoteStream: (stream: MediaStream) => void): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Session ID가 없습니다. 먼저 startCall()을 호출하세요.')
    }

    // WebRTC 설정 가져오기
    const rtcConfig = await this.getWebRTCConfig()

    // Socket.IO 연결
    this.socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
    })

    // 로컬 오디오 스트림 가져오기
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
      },
      video: false,
    })

    // AudioContext 초기화
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.8
    const source = this.audioContext.createMediaStreamSource(this.localStream)
    source.connect(this.analyser)
    console.log('✅ AudioContext 초기화')

    // RTCPeerConnection 생성
    this.peerConnection = new RTCPeerConnection(rtcConfig)

    // 로컬 스트림 추가
    this.localStream.getTracks().forEach((track) => {
      if (this.peerConnection && this.localStream) {
        this.peerConnection.addTrack(track, this.localStream)
      }
    })

    // 원격 스트림 수신
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        onRemoteStream(event.streams[0])
      }
    }

    // ICE Candidate 처리
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.sessionId) {
        this.socket.emit('ice-candidate', {
          sessionId: this.sessionId,
          peerId: this.peerId,
          candidate: event.candidate,
        })
      }
    }

    // WebSocket 이벤트 리스너 설정
    this.setupSocketListeners()

    // 세션 참여
    this.socket.emit('join-session', {
      sessionId: this.sessionId,
      peerId: this.peerId,
    })

    // Offer 생성 및 전송
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)

    this.socket.emit('offer', {
      sessionId: this.sessionId,
      peerId: this.peerId,
      offer,
    })

    // 통화 연결
    if (this.callId) {
      await fetch(`${API_BASE_URL}/calls/${this.callId}/connect`, {
        method: 'POST',
      })
    }

    // 첫 AI 인사말 대기 상태로 시작
    this.isWaitingForAIResponse = true
    console.log('⏳ 첫 AI 인사말 대기 중...')

    // VAD 시작
    this.startVADChecking()
    console.log('✅ VAD 활성화')
  }

  private setupSocketListeners(): void {
    if (!this.socket) return

    this.socket.on('joined-session', ({ sessionId, peerId }) => {
      console.log('세션 참여 완료:', sessionId, peerId)
    })

    this.socket.on('peer-joined', ({ peerId }) => {
      console.log('피어 참여:', peerId)
    })

    this.socket.on('answer', async ({ answer }) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    this.socket.on('ice-candidate', async ({ candidate }) => {
      if (this.peerConnection && candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    this.socket.on('peer-left', ({ peerId }) => {
      console.log('피어 나감:', peerId)
    })

    this.socket.on('peer-disconnected', ({ peerId }) => {
      console.log('피어 연결 끊김:', peerId)
    })

    // AI 응답 수신
    this.socket.on('ai-audio-response', ({ audioData }) => {
      const responseTime = Date.now()
      const timeSinceLastSent = this.lastAudioSentTime > 0 ? responseTime - this.lastAudioSentTime : 0

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🤖 [AI 응답 수신] AI 오디오 응답 도착!')
      console.log(`   🕐 수신 시간: ${new Date().toLocaleTimeString()}.${responseTime % 1000}`)
      console.log(`   ⏱️  마지막 전송 후 경과: ${timeSinceLastSent > 0 ? (timeSinceLastSent / 1000).toFixed(3) + '초' : 'N/A'}`)
      console.log(`   📊 상태 (변경 전):`)
      console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse}`)
      console.log(`      - isAIResponding: ${this.isAIResponding}`)
      console.log(`      - audioSentCount: ${this.audioSentCount}`)
      console.log(`      - aiResponseCount: ${this.aiResponseCount}`)

      // 첫 AI 응답이면 콜백 호출 (연결음 중지용)
      if (this.aiResponseCount === 0 && this.onFirstAIResponse) {
        console.log(`   🎉 첫 AI 응답! - 연결음 중지 콜백 호출`)
        this.onFirstAIResponse()
      }

      // 대기 상태 해제 및 응답 중 상태로 전환
      this.isWaitingForAIResponse = false
      this.isAIResponding = true
      console.log(`🔓 [상태 변경] isWaitingForAIResponse = false`)
      console.log(`🔒 [상태 변경] isAIResponding = true`)
      console.log(`   ✅ AI 응답 대기 종료 → AI 응답 재생 시작`)
      this.emitVADStatus()

      try {
        // Base64 디코딩
        const binaryString = atob(audioData)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mp3' })

        // 콜백 호출
        if (this.onAIResponse) {
          this.onAIResponse(blob)
        }

        // 자동 재생
        const audio = new Audio(URL.createObjectURL(blob))
        const playStartTime = Date.now()

        audio.onended = () => {
          const endTime = Date.now()
          const playDuration = endTime - playStartTime

          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          console.log(`✅ [AI 응답 재생 완료] ${new Date().toLocaleTimeString()}.${endTime % 1000}`)
          console.log(`   ⏱️  재생 시간: ${(playDuration / 1000).toFixed(2)}초`)
          console.log(`   📊 상태 변경 전:`)
          console.log(`      - isAIResponding: ${this.isAIResponding} → false`)
          console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse}`)
          console.log(`      - isRecording: ${this.isRecording}`)
          console.log(`      - isSpeaking: ${this.isSpeaking}`)

          this.isAIResponding = false
          this.aiResponseCount++

          console.log(`   🔓 [상태 변경] isAIResponding = false`)
          console.log(`   📈 aiResponseCount = ${this.aiResponseCount}`)
          console.log(`   🎤 사용자 음성 입력 대기 시작!`)
          console.log(`   ✅ 이제 녹음 가능 상태`)
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          this.emitVADStatus()
        }

        audio.onerror = (e) => {
          const errorTime = Date.now()
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          console.log(`❌ [AI 재생 실패] ${new Date().toLocaleTimeString()}.${errorTime % 1000}`)
          console.error('   에러:', e)
          console.log(`   📊 상태 복구:`)
          console.log(`      - isAIResponding: ${this.isAIResponding} → false`)
          console.log(`      - isWaitingForAIResponse: ${this.isWaitingForAIResponse} → false`)

          this.isAIResponding = false
          this.isWaitingForAIResponse = false

          console.log(`   ✅ 상태 초기화 완료`)
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          this.emitVADStatus()
        }

        audio.play()
        console.log(`   🔊 [오디오 재생 시작] ${new Date().toLocaleTimeString()}.${playStartTime % 1000}`)
        console.log(`   ⏳ 재생 완료 대기 중...`)
      } catch (e) {
        this.isAIResponding = false
        console.error('❌ AI 응답 처리 실패:', e)
        this.emitVADStatus()
      }
    })
  }

  async endCall(): Promise<void> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🛑 통화 종료 시작')

    // VAD 중지
    if (this.vadCheckInterval) {
      clearInterval(this.vadCheckInterval)
      this.vadCheckInterval = null
      console.log('✅ VAD 중지')
    }

    // 녹음 중지
    if (this.isRecording && this.mediaRecorder) {
      this.mediaRecorder.stop()
      this.isRecording = false
      console.log('✅ 녹음 중지')
    }

    // AudioContext 종료
    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
      this.analyser = null
      console.log('✅ AudioContext 종료')
    }

    // 통화 종료 API 호출
    if (this.callId) {
      await fetch(`${API_BASE_URL}/calls/${this.callId}/end`, {
        method: 'POST',
      })
      console.log('✅ 통화 종료 API 호출')
    }

    // PeerConnection 종료
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
      console.log('✅ PeerConnection 종료')
    }

    // 로컬 스트림 종료
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
      console.log('✅ 로컬 스트림 종료')
    }

    // Socket 연결 종료
    if (this.socket && this.sessionId) {
      this.socket.emit('leave-session', {
        sessionId: this.sessionId,
        peerId: this.peerId,
      })
      this.socket.disconnect()
      this.socket = null
      console.log('✅ WebSocket 종료')
    }

    // 초기화
    this.callId = null
    this.sessionId = null
    this.audioSentCount = 0
    this.aiResponseCount = 0
    this.isSpeaking = false
    this.isAIResponding = false
    this.isWaitingForAIResponse = false
    this.isRecording = false

    console.log('✅ 리소스 정리 완료')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }

  getCallId(): string | null {
    return this.callId
  }

  getSessionId(): string | null {
    return this.sessionId
  }

  isConnected(): boolean {
    return this.peerConnection !== null && this.socket !== null
  }
}

export const webrtcService = new WebRTCService()
