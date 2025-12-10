import NavBar from '../components/NavBar'

export default function Home() {
  const banners = [
    { title: '신상품 할인', color: 'from-pink-500 to-rose-500' },
    { title: '이벤트 진행중', color: 'from-blue-500 to-cyan-500' },
    { title: '특가 세일', color: 'from-purple-500 to-indigo-500' },
  ]

  const categories = [
    { icon: '🛒', name: '쇼핑' },
    { icon: '🍔', name: '음식' },
    { icon: '✈️', name: '여행' },
    { icon: '🎬', name: '영화' },
    { icon: '📚', name: '도서' },
    { icon: '💊', name: '헬스' },
    { icon: '🎮', name: '게임' },
    { icon: '🎵', name: '음악' },
  ]

  const products = [
    { name: '무선 이어폰', price: '89,000원', image: '🎧' },
    { name: '스마트워치', price: '129,000원', image: '⌚' },
    { name: '노트북', price: '1,290,000원', image: '💻' },
    { name: '카메라', price: '890,000원', image: '📷' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">홈</h1>
            <button className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full bg-white text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="flex overflow-x-auto gap-4 p-4 scrollbar-hide">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`min-w-[280px] h-32 rounded-lg bg-gradient-to-r ${banner.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
            >
              {banner.title}
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="px-4 mb-6">
          <h2 className="font-bold text-lg mb-3 text-gray-800">카테고리</h2>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-xs text-gray-700">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-lg mb-3 text-gray-800">인기 상품</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
                  <p className="text-blue-600 font-bold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
