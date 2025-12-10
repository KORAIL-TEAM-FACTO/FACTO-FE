import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCalling])

  const handleNumberClick = (num: string) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num)
    }
  }

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      setIsCalling(true)
      setCallDuration(0)
    }
  }

  const handleEndCall = () => {
    setIsCalling(false)
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

  // 통화 중 화면
  if (isCalling) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
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
            <p className="text-lg text-gray-500 mb-16">{formatDuration(callDuration)}</p>

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
          <div className="text-center mb-2">
            <div className="text-4xl font-light text-gray-900 min-h-[50px] flex items-center justify-center tracking-wider">
              {phoneNumber.length > 0 ? formatPhoneNumber(phoneNumber) : ''}
            </div>
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
          <div className="grid grid-cols-3 gap-4 items-center mt-8">
            {/* Empty Space */}
            <div></div>

            {/* Call Button */}
            <button
              onClick={handleCall}
              disabled={phoneNumber.length === 0}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${
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

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={phoneNumber.length === 0}
              className={`ml-auto mr-4 transition-opacity ${
                phoneNumber.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
