import NavBar from '../components/NavBar'

export default function Home() {
  const services = [
    {
      title: '청년 월세 지원금',
      description: '만 19~34세 청년 대상',
      amount: '최대 월 20만원',
      tag: '인기'
    },
    {
      title: '아동수당',
      description: '만 8세 미만 아동',
      amount: '월 10만원',
      tag: '신청가능'
    },
    {
      title: '기초생활보장',
      description: '소득인정액 기준 충족 가구',
      amount: '맞춤형 지원',
      tag: '상시모집'
    },
    {
      title: '국민취업지원제도',
      description: '구직활동 중인 청년·중장년',
      amount: '최대 300만원',
      tag: '신청가능'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[25px] font-bold text-gray-900 mb-2">
                홍길동님 반가워요,
              </h1>
              <p className="text-[17px] text-gray-700">
                받을 수 있는 복지 혜택이 <span className="font-bold text-blue-600">2개</span> 있어요
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
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

        {/* Recommended Services - Horizontal Scroll */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="font-bold text-[19px] text-gray-900">받을 수 있는 혜택</h2>
            <button className="text-[15px] text-blue-600 font-medium">전체보기</button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4 pb-2">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border border-gray-200 flex-shrink-0 w-[280px]"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-bold text-[17px] text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-[15px] text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[17px] text-blue-600 font-bold">{service.amount}</p>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services - Horizontal Scroll */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="font-bold text-[19px] text-gray-900">인기있는 복지 서비스를 알아보세요</h2>
            <button className="text-[15px] text-blue-600 font-medium">전체보기</button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4 pb-2">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border border-gray-200 flex-shrink-0 w-[280px]"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-bold text-[17px] text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-[15px] text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[17px] text-blue-600 font-bold">{service.amount}</p>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <NavBar />
    </div>
  )
}
