import NavBar from '../components/NavBar'
import { IoSend } from 'react-icons/io5'

export default function WelfareSearch() {

  return (
    <div className="min-h-screen bg-white pb-32 relative">
      {/* Chat Message */}
      <div className="px-4 py-6 flex justify-end">
        <div className="bg-gray-100 rounded-2xl px-5 py-4 max-w-[85%]">
          <p className="text-base text-gray-900">
            청년이고 이사할때 복지 혜택을 받고 싶어
          </p>
        </div>
      </div>

      {/* Response Section */}
      <div className="px-4 py-2 pb-24">
        <div className="space-y-4 text-gray-800">
          <p className="text-base leading-relaxed">
            안녕하세요. 청년 이사 관련 복지 혜택에 대해 문의 주셨군요. 이사는 청년들에게 큰 부담이 될 수 있어 이사비를 지원하는 지방자치단체(지자체) 사업들이 있습니다.
          </p>

          <p className="text-base leading-relaxed">
            <strong>**주요 지원 혜택은 주로 '청년 부동산 중개보수 및 이사비 지원사업'**</strong>의 형태이며, 지자체별로 지원 내용 및 자격 요건에 차이가 있습니다.
          </p>

          <p className="text-base leading-relaxed">
            일반적으로는 다음과 같은 내용을 지원받을 수 있습니다:
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-xl">🏠</span>
              <h3 className="text-lg font-bold text-gray-900">청년 이사비 지원사업 주요 내용</h3>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">• 지원 대상:</h4>
              <div className="pl-4 space-y-1 text-gray-700">
                <p>• 연령: 만 19세에서 39세 사이의 청년<br />
                <span className="text-sm text-gray-500">(지자체별로 연령 기준 상이)</span></p>
                <p>• 주택: 무주택자이며, 특정 보증금 또는 전월세 거래금액 이하의 주택에 거주하는 청년 (예: 보증금 1억원 이하 등)</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">• 지원 내용:</h4>
              <div className="pl-4 space-y-1 text-gray-700">
                <p>• 이사비용: 실비 지원 (예: 최대 30만원)</p>
                <p>• 중개보수: 부동산 중개 수수료 지원 (예: 최대 20만원)</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">• 신청 방법:</h4>
              <div className="pl-4 text-gray-700">
                <p>거주지 관할 지자체(구청, 시청 등)의 홈페이지 또는 방문 신청</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(147,51,234,0.3)] border border-gray-100">
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-400"
            />
            <button className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 hover:from-blue-600 hover:to-purple-700 transition-all">
              <IoSend className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
