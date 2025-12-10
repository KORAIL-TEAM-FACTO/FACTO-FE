import NavBar from '../components/NavBar'

export default function Home() {
  const notices = [
    { title: '2024년 하반기 복지서비스 신청 안내', date: '2024.12.10', badge: 'NEW' },
    { title: '연말정산 지원금 신청하세요', date: '2024.12.08', badge: '마감임박' },
    { title: '청년 주거지원 프로그램 안내', date: '2024.12.05', badge: '' },
  ]

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

        {/* Recommended Services */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[19px] text-gray-900">받을 수 있는 혜택</h2>
            <button className="text-[15px] text-blue-600 font-medium">전체보기</button>
          </div>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[17px] text-gray-900">{service.title}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[13px] font-semibold rounded">
                        {service.tag}
                      </span>
                    </div>
                    <p className="text-[15px] text-gray-600 mb-2">{service.description}</p>
                    <p className="text-[17px] text-blue-600 font-bold">{service.amount}</p>
                  </div>
                  <button className="ml-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-[19px] mb-3 text-gray-900">최근 공지사항</h2>
          <div className="space-y-2">
            {notices.map((notice, index) => (
              <button
                key={index}
                className="w-full bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors text-left border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {notice.badge && (
                        <span className={`px-2 py-0.5 text-[13px] font-semibold rounded ${
                          notice.badge === 'NEW'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {notice.badge}
                        </span>
                      )}
                      <h3 className="font-medium text-gray-900 text-[15px]">{notice.title}</h3>
                    </div>
                    <p className="text-[13px] text-gray-500">{notice.date}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
