import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7

  // Form data
  const [name, setName] = useState('')
  const [lifecycle, setLifecycle] = useState('')
  const [householdSituation, setHouseholdSituation] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [age, setAge] = useState('')
  const [sido, setSido] = useState('')
  const [sigungu, setSigungu] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const lifecycleOptions = [
    { code: '001', label: '영유아' },
    { code: '002', label: '아동' },
    { code: '003', label: '청소년' },
    { code: '004', label: '청년' },
    { code: '005', label: '중장년' },
    { code: '006', label: '노년' },
    { code: '007', label: '임신·출산' },
  ]

  const householdOptions = [
    { code: '010', label: '다문화·탈북민' },
    { code: '020', label: '다자녀' },
    { code: '030', label: '보훈대상자' },
    { code: '040', label: '장애인' },
    { code: '050', label: '저소득' },
    { code: '060', label: '한부모·조손' },
  ]

  const interestOptions = [
    { code: '010', label: '신체건강' },
    { code: '020', label: '정신건강' },
    { code: '030', label: '생활지원' },
    { code: '040', label: '주거' },
    { code: '050', label: '일자리' },
    { code: '060', label: '문화·여가' },
    { code: '070', label: '안전·위기' },
    { code: '080', label: '임신·출산' },
    { code: '090', label: '보육' },
    { code: '100', label: '교육' },
    { code: '110', label: '입양·위탁' },
    { code: '120', label: '보호·돌봄' },
    { code: '130', label: '서민금융' },
    { code: '140', label: '법률' },
  ]

  const sidoOptions = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
    '충청북도', '충청남도', '전라북도', '전라남도', '경상북도',
    '경상남도', '제주특별자치도'
  ]

  const toggleMultiSelect = (value: string, setter: (prev: string[]) => void, current: string[]) => {
    if (current.includes(value)) {
      setter(current.filter(item => item !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    // 회원가입 데이터
    const signUpData = {
      name,
      lifecycle,
      householdSituation,
      interests,
      age,
      sido,
      sigungu,
      email,
      password
    }
    console.log('회원가입 데이터:', signUpData)
    navigate('/login')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return name.trim().length > 0
      case 2: return lifecycle.length > 0
      case 3: return householdSituation.length > 0
      case 4: return interests.length > 0
      case 5: return age.trim().length > 0
      case 6: return sido.length > 0 && sigungu.trim().length > 0
      case 7: return email.trim().length > 0 && password.length >= 8
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col px-6 pt-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => currentStep === 1 ? navigate(-1) : handlePrev()}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Step Counter */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">{currentStep} / {totalSteps}</span>
          </div>
        </div>

        <div className="flex-1">
          {/* Step 1: 이름 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">이름을 입력해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">실명을 입력해주세요</p>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: 생애주기 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">생애주기를 선택해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">해당하는 항목을 선택해주세요</p>
              <div className="space-y-3">
                {lifecycleOptions.map(option => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLifecycle(option.code)}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      lifecycle === option.code
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 가구상황 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">가구상황을 선택해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">중복 선택 가능합니다</p>
              <div className="space-y-3">
                {householdOptions.map(option => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => toggleMultiSelect(option.code, setHouseholdSituation, householdSituation)}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      householdSituation.includes(option.code)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: 관심주제 */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">관심주제를 선택해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">중복 선택 가능합니다</p>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {interestOptions.map(option => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => toggleMultiSelect(option.code, setInterests, interests)}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      interests.includes(option.code)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: 나이 */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">나이를 입력해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">만 나이를 입력해주세요</p>
              <input
                type="number"
                placeholder="예: 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                autoFocus
              />
            </div>
          )}

          {/* Step 6: 시도명, 시군구명 */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">거주지를 선택해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">시도와 시군구를 입력해주세요</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">시도</label>
                  <select
                    value={sido}
                    onChange={(e) => setSido(e.target.value)}
                    className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors bg-white"
                  >
                    <option value="">선택해주세요</option>
                    {sidoOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">시군구</label>
                  <input
                    type="text"
                    placeholder="예: 강남구"
                    value={sigungu}
                    onChange={(e) => setSigungu(e.target.value)}
                    className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: 이메일, 비밀번호 */}
          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">계정 정보를 입력해주세요</h2>
              <p className="text-gray-600 text-sm mb-8">로그인에 사용할 정보입니다</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                  <input
                    type="email"
                    placeholder="example@moboc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                  <input
                    type="password"
                    placeholder="8자 이상 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                  />
                  {password && password.length < 8 && (
                    <p className="mt-2 text-xs text-red-500">비밀번호는 8자 이상이어야 합니다</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={!isStepValid()}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              isStepValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? '가입하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}
