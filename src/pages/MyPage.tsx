import NavBar from '../components/NavBar'

export default function MyPage() {
  const menuItems = [
    { icon: '📋', title: '신청 내역', desc: '복지 신청 및 진행 조회' },
    { icon: '❤️', title: '관심 복지', desc: '찜한 복지 서비스' },
    { icon: '🎟️', title: '받을 수 있는 혜택', desc: '맞춤 복지 정보' },
    { icon: '📞', title: '상담 내역', desc: 'AI 상담 기록 보기' },
    { icon: '⚙️', title: '설정', desc: '앱 설정 및 관리' },
    { icon: '💬', title: '고객센터', desc: '1:1 문의 및 FAQ' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h1 className="text-[25px] font-bold text-gray-900 mb-1">마이페이지</h1>
          <p className="text-[15px] text-gray-600">내 정보를 확인하세요</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 mb-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-gray-900">홍길동</h2>
                <p className="text-[15px] text-gray-600">hong@example.com</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-around bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-center">
              <div className="font-bold text-[19px] text-gray-900">5</div>
              <div className="text-[13px] text-gray-600">신청중</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="font-bold text-[19px] text-gray-900">12</div>
              <div className="text-[13px] text-gray-600">받는중</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="font-bold text-[19px] text-gray-900">8</div>
              <div className="text-[13px] text-gray-600">관심</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-[19px] text-gray-900 mb-3 px-1">서비스</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="text-2xl mr-4">{item.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[17px] text-gray-900">{item.title}</h3>
                  <p className="text-[15px] text-gray-600">{item.desc}</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button className="w-full mt-4 bg-white text-red-600 font-semibold text-[17px] py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
            로그아웃
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
