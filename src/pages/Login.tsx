import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 간단한 로그인 처리 (실제로는 백엔드 연동 필요)
    if (email && password) {
      navigate('/')
    }
  }

  const isButtonActive = email.length > 0 && password.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col px-6 pt-12">
        {/* Logo/Title */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요,
          </h1>
          <h2 className="text-3xl font-bold text-gray-900">
            모복입니다
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex-1 flex flex-col">
          <div className="space-y-4 mb-6">
            <div>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-between text-sm mb-8">
            <button type="button" className="text-gray-500 hover:text-gray-700">
              이메일 찾기
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              비밀번호 재설정
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isButtonActive}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              isButtonActive
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            로그인
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600 text-sm">아직 회원이 아니신가요? </span>
            <Link
              to="/signup"
              className="text-blue-500 text-sm font-semibold hover:text-blue-600"
            >
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
