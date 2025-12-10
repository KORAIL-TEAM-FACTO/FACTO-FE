import NavBar from '../components/NavBar'

export default function Phone() {
  const contacts = [
    { name: '김철수', phone: '010-1234-5678', avatar: '👨' },
    { name: '이영희', phone: '010-2345-6789', avatar: '👩' },
    { name: '박민수', phone: '010-3456-7890', avatar: '👨‍💼' },
    { name: '정수진', phone: '010-4567-8901', avatar: '👩‍💼' },
    { name: '최동욱', phone: '010-5678-9012', avatar: '👦' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">연락처</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="검색..."
              className="w-full bg-blue-500 text-white placeholder-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Contact List */}
        <div className="divide-y divide-gray-200">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="text-4xl mr-4">{contact.avatar}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.phone}</p>
              </div>
              <button className="text-blue-600 p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <NavBar />
    </div>
  )
}
