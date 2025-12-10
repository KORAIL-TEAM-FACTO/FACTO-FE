import NavBar from '../components/NavBar'

export default function WelfareSearch() {
  const categories = [
    { icon: '💰', name: '생활지원', color: 'bg-blue-50 text-blue-600' },
    { icon: '🏠', name: '주거', color: 'bg-green-50 text-green-600' },
    { icon: '💼', name: '일자리', color: 'bg-purple-50 text-purple-600' },
    { icon: '🎓', name: '교육', color: 'bg-orange-50 text-orange-600' },
    { icon: '👶', name: '보육', color: 'bg-pink-50 text-pink-600' },
    { icon: '❤️', name: '건강', color: 'bg-red-50 text-red-600' },
    { icon: '🤝', name: '돌봄', color: 'bg-indigo-50 text-indigo-600' },
    { icon: '⚖️', name: '법률', color: 'bg-gray-50 text-gray-600' },
  ]

  const lifecycleOptions = [
    '영유아', '아동', '청소년', '청년', '중장년', '노년', '임신·출산'
  ]

  const householdOptions = [
    '다문화·탈북민', '다자녀', '보훈대상자', '장애인', '저소득', '한부모·조손'
  ]

  const popularServices = [
    { title: '청년 월세 지원금', tag: '인기' },
    { title: '기초생활보장', tag: '인기' },
    { title: '아동수당', tag: '인기' },
    { title: '국민취업지원제도', tag: '인기' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h1 className="text-[25px] font-bold text-gray-900 mb-2">복지 찾아보기</h1>
          <p className="text-[15px] text-gray-600">필요한 복지 서비스를 찾아보세요</p>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="복지서비스를 검색하세요"
              className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-6">
          <h2 className="font-bold text-[19px] mb-3 text-gray-900">복지 분야</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <div className="text-[13px] text-gray-700 font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lifecycle */}
        <div className="px-4 mb-6">
          <h2 className="font-bold text-[19px] mb-3 text-gray-900">생애주기</h2>
          <div className="flex flex-wrap gap-2">
            {lifecycleOptions.map((option, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white rounded-full text-[14px] font-medium text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Household Situation */}
        <div className="px-4 mb-6">
          <h2 className="font-bold text-[19px] mb-3 text-gray-900">가구상황</h2>
          <div className="flex flex-wrap gap-2">
            {householdOptions.map((option, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white rounded-full text-[14px] font-medium text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-[19px] mb-3 text-gray-900">많이 찾는 복지</h2>
          <div className="space-y-2">
            {popularServices.map((service, index) => (
              <button
                key={index}
                className="w-full bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors text-left border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[17px] font-medium text-gray-900">{service.title}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[13px] font-semibold rounded">
                    {service.tag}
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
