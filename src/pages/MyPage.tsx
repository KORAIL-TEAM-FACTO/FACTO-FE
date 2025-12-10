import NavBar from '../components/NavBar'

export default function MyPage() {
  const menuItems = [
    { icon: '📋', title: '주문 내역', desc: '주문 및 배송 조회' },
    { icon: '❤️', title: '찜 목록', desc: '관심 상품 모아보기' },
    { icon: '🎟️', title: '쿠폰', desc: '사용 가능한 쿠폰' },
    { icon: '💰', title: '포인트', desc: '2,500 P' },
    { icon: '⚙️', title: '설정', desc: '앱 설정 및 관리' },
    { icon: '📞', title: '고객센터', desc: '1:1 문의 및 FAQ' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Profile Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mr-4">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold">홍길동</h2>
              <p className="text-blue-100 text-sm">hong@example.com</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around bg-white/20 rounded-lg p-3 mt-4">
            <div className="text-center">
              <div className="font-bold text-lg">12</div>
              <div className="text-xs text-blue-100">주문</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">3</div>
              <div className="text-xs text-blue-100">리뷰</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">8</div>
              <div className="text-xs text-blue-100">찜</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="text-3xl mr-4">{item.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
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
          <button className="w-full mt-6 bg-red-50 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-100 transition-colors">
            로그아웃
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
