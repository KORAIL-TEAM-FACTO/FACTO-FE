import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import { webrtcService, type VADStatus } from '../services/webrtcService'

const AI_CALL_NUMBER = import.meta.env.VITE_AI_CALL_NUMBER || '070-8247-3916'

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [vadStatus, setVadStatus] = useState<VADStatus>({
    volume: -100,
    isSpeaking: false,
    isAIResponding: false,
    audioSentCount: 0,
    aiResponseCount: 0,
  })
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const ringbackToneRef = useRef<{
    audioContext: AudioContext | null
    oscillator: OscillatorNode | null
    gainNode: GainNode | null
    intervalId: ReturnType<typeof setInterval> | null
  }>({
    audioContext: null,
    oscillator: null,
    gainNode: null,
    intervalId: null,
  })

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCalling])

  // 연결음 재생 함수
  const playRingbackTone = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 440 // A4 음 (440Hz)
    gainNode.gain.value = 0

    oscillator.start()

    ringbackToneRef.current = {
      audioContext,
      oscillator,
      gainNode,
      intervalId: null,
    }

    // 뚜- 뚜- 패턴 (0.5초 재생, 0.7초 쉼)
    const playBeep = () => {
      if (!ringbackToneRef.current.gainNode) return

      // 소리 켜기 (페이드인)
      ringbackToneRef.current.gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      ringbackToneRef.current.gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02)

      // 0.5초 후 소리 끄기 (페이드아웃)
      setTimeout(() => {
        if (!ringbackToneRef.current.gainNode) return
        ringbackToneRef.current.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.02)
      }, 500)
    }

    // 즉시 첫 번째 beep 재생
    playBeep()

    // 1.2초마다 반복 (0.5초 재생 + 0.7초 쉼)
    ringbackToneRef.current.intervalId = setInterval(playBeep, 1200)
  }

  // 연결음 중지 함수
  const stopRingbackTone = () => {
    if (ringbackToneRef.current.intervalId) {
      clearInterval(ringbackToneRef.current.intervalId)
      ringbackToneRef.current.intervalId = null
    }
    if (ringbackToneRef.current.oscillator) {
      ringbackToneRef.current.oscillator.stop()
      ringbackToneRef.current.oscillator = null
    }
    if (ringbackToneRef.current.gainNode) {
      ringbackToneRef.current.gainNode = null
    }
    if (ringbackToneRef.current.audioContext) {
      ringbackToneRef.current.audioContext.close()
      ringbackToneRef.current.audioContext = null
    }
  }

  // 컴포넌트 언마운트 시 연결음 정리
  useEffect(() => {
    return () => {
      stopRingbackTone()
    }
  }, [])

  const handleNumberClick = (num: string) => {
    // 1번 클릭 시 AI 번호로 자동 설정
    if (num === '1' && phoneNumber === '') {
      setPhoneNumber(AI_CALL_NUMBER.replace(/-/g, ''))
      // 자동으로 통화 시작
      setTimeout(() => {
        handleCall()
      }, 500)
      return
    }

    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num)
    }
  }

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const handleCall = async () => {
    if (phoneNumber.length === 0) return

    // 02-5213-5213으로 전화할 때만 WebRTC 연결
    const normalizedNumber = phoneNumber.replace(/-/g, '')
    const aiNumber = AI_CALL_NUMBER.replace(/-/g, '')

    if (normalizedNumber === aiNumber) {
      try {
        setIsConnecting(true)

        // 연결음 재생
        playRingbackTone()

        // VAD 상태 콜백 설정
        webrtcService.setVADStatusCallback((status) => {
          setVadStatus(status)
        })

        // 첫 AI 응답 시 연결음 중지 및 통화 화면 전환
        webrtcService.setFirstAIResponseCallback(() => {
          console.log('🎉 첫 AI 응답 수신 - 연결음 중지 및 통화 시작')
          stopRingbackTone()
          setIsCalling(true)
          setCallDuration(0)
          setIsConnecting(false)
        })

        // WebRTC 통화 시작
        await webrtcService.startCall(phoneNumber)

        // 서버 연결
        await webrtcService.connectToServer((remoteStream) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream
          }
        })

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🔌 WebRTC 연결 완료, AI 인사말 대기 중...')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      } catch (error) {
        console.error('통화 연결 실패:', error)
        stopRingbackTone()
        setIsConnecting(false)
        alert('통화 연결에 실패했습니다. 서버가 실행 중인지 확인하세요.')
      }
    } else {
      // 일반 전화 (시뮬레이션)
      setIsCalling(true)
      setCallDuration(0)
    }
  }

  const handleEndCall = async () => {
    // 연결음 중지
    stopRingbackTone()

    // WebRTC 연결이 활성화되어 있으면 종료
    if (webrtcService.isConnected()) {
      try {
        await webrtcService.endCall()
        console.log('WebRTC 통화 종료')
      } catch (error) {
        console.error('통화 종료 중 오류:', error)
      }
    }

    setIsCalling(false)
    setIsConnecting(false)
    setCallDuration(0)
    setPhoneNumber('')
  }

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) return number
    if (number.length <= 7) return `${number.slice(0, 3)}-${number.slice(3)}`
    if (number.length <= 11) return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`
    return number
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const keypadButtons = [
    { value: '1', sub: '' },
    { value: '2', sub: 'ABC' },
    { value: '3', sub: 'DEF' },
    { value: '4', sub: 'GHI' },
    { value: '5', sub: 'JKL' },
    { value: '6', sub: 'MNO' },
    { value: '7', sub: 'PQRS' },
    { value: '8', sub: 'TUV' },
    { value: '9', sub: 'WXYZ' },
    { value: '*', sub: '' },
    { value: '0', sub: '+' },
    { value: '#', sub: '' },
  ]

  // 연결 중 화면
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-8 animate-pulse">
              <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-normal mb-2 text-gray-900">{formatPhoneNumber(phoneNumber)}</h2>
            <p className="text-lg text-blue-600 mb-16">연결 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 통화 중 화면
  if (isCalling) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          {/* Hidden Audio Element for Remote Stream */}
          <audio ref={remoteAudioRef} autoPlay />

          {/* Call Status */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-8">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Phone Number */}
            <h2 className="text-3xl font-normal mb-2 text-gray-900">{formatPhoneNumber(phoneNumber)}</h2>

            {/* Call Status */}
            <p className="text-lg text-gray-500 mb-4">{formatDuration(callDuration)}</p>

            {/* VAD Status - AI 통화인 경우에만 표시 */}
            {phoneNumber.replace(/-/g, '') === AI_CALL_NUMBER.replace(/-/g, '') && (
              <div className="mb-12 w-full max-w-sm">
                {/* VAD 상태 표시 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">음량</span>
                    <span className="text-lg font-bold text-gray-900">
                      {vadStatus.volume > -100 ? `${vadStatus.volume.toFixed(1)} dB` : '-∞'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">상태</span>
                    <span className="text-lg font-bold">
                      {vadStatus.isAIResponding ? '🤖 AI 응답 중' :
                       vadStatus.isSpeaking ? '🗣️ 말하는 중' : '💤 대기 중'}
                    </span>
                  </div>
                </div>

                {/* 전송/응답 카운터 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-blue-600 mb-1">전송 횟수</div>
                    <div className="text-xl font-bold text-blue-600">{vadStatus.audioSentCount}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600 mb-1">AI 응답</div>
                    <div className="text-xl font-bold text-green-600">{vadStatus.aiResponseCount}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-8 w-full max-w-sm mb-12">
              {/* Mute */}
              <button className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">음소거</span>
              </button>

              {/* Keypad */}
              <button className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">키패드</span>
              </button>

              {/* Speaker */}
              <button className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-700">스피커</span>
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
            >
              <svg className="w-8 h-8 text-white transform rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 키패드 화면
  return (
    <div className="min-h-screen bg-white pb-20 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="px-6 pb-4">
          {/* Phone Number Display */}
          <div className="flex items-center justify-center mb-2 relative">
            <div className="text-4xl font-light text-gray-900 min-h-[50px] flex items-center justify-center tracking-wider flex-1">
              {phoneNumber.length > 0 ? formatPhoneNumber(phoneNumber) : ''}
            </div>
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={phoneNumber.length === 0}
              className={`transition-opacity ${
                phoneNumber.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>

          {/* Add Number Label */}
          {phoneNumber.length === 0 && (
            <div className="text-center">
              <span className="text-gray-500 text-lg">번호 입력</span>
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 max-w-xs mx-auto">
            {keypadButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => handleNumberClick(button.value)}
                className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors"
              >
                <span className="text-3xl font-light text-gray-900">{button.value}</span>
                {button.sub && (
                  <span className="text-[9px] text-gray-500 tracking-widest mt-0.5">{button.sub}</span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="flex justify-center items-center mt-8">
            {/* Call Button */}
            <button
              onClick={handleCall}
              disabled={phoneNumber.length === 0}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                phoneNumber.length > 0
                  ? 'bg-green-500 hover:bg-green-600 active:scale-95'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              <svg
                className={`w-8 h-8 ${phoneNumber.length > 0 ? 'text-white' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
