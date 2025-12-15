import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import NavBar from "../components/NavBar";
import { useMe, logout } from "../apis";

export default function MyPage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h1 className="text-[25px] font-bold text-gray-900 mb-1">
            마이페이지
          </h1>
          <p className="text-[15px] text-gray-600">내 정보를 확인하세요</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 mb-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-10 h-10 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-gray-900">
                  {user?.name || "홍길동"}
                </h2>
                <p className="text-[15px] text-gray-600">
                  {user?.email || "hong@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/mypage/edit")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="정보 수정"
            >
              <FiEdit2 className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-[19px] text-gray-900 mb-3 px-1">
            내 정보
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* Life Cycle */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-gray-600">생애주기</span>
              <span className="text-[16px] font-semibold text-gray-900">
                {user?.life_cycle || "-"}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>

            {/* Household Status */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-gray-600">가구상황</span>
              <span className="text-[16px] font-semibold text-gray-900">
                {user?.household_status
                  ? Array.isArray(user.household_status) &&
                    user.household_status.length === 0
                    ? "해당사항 없음"
                    : user.household_status
                  : "해당사항 없음"}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>

            {/* Interest Theme */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-gray-600">관심주제</span>
              <span className="text-[16px] font-semibold text-gray-900">
                {user?.interest_theme
                  ? Array.isArray(user.interest_theme) &&
                    user.interest_theme.length === 0
                    ? "해당사항 없음"
                    : user.interest_theme
                  : "해당사항 없음"}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>

            {/* Age */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-gray-600">나이</span>
              <span className="text-[16px] font-semibold text-gray-900">
                {user?.age ? `${user.age}세` : "-"}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>

            {/* Location */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-gray-600">거주지</span>
              <span className="text-[16px] font-semibold text-gray-900">
                {user?.sido_name && user?.sigungu_name
                  ? `${user.sido_name} ${user.sigungu_name}`
                  : "-"}
              </span>
            </div>
          </div>

          {/* Stats */}
        </div>

        {/* Logout Section */}
        <div className="px-4 pb-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-white text-red-600 font-semibold text-[17px] py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
