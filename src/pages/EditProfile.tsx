import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useMe, useUpdateMe } from "../apis";
import type {
  LifeCycle,
  HouseholdStatus,
  InterestTheme,
} from "../apis/users/types";

const LIFE_CYCLES: LifeCycle[] = [
  "영유아",
  "아동",
  "청소년",
  "청년",
  "중장년",
  "노년",
  "임신·출산",
];

const HOUSEHOLD_STATUSES: HouseholdStatus[] = [
  "다문화·탈북민",
  "다자녀",
  "보훈대상자",
  "장애인",
  "저소득",
  "한부모·조손",
];

const INTEREST_THEMES: InterestTheme[] = [
  "신체건강",
  "정신건강",
  "생활지원",
  "주거",
  "일자리",
  "문화·여가",
  "안전·위기",
  "임신·출산",
  "보육",
  "교육",
  "입양·위탁",
  "보호·돌봄",
  "서민금융",
  "법률",
];

const SIDO_LIST = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const { mutateAsync: updateMe, isPending } = useUpdateMe();

  const [name, setName] = useState("");
  const [lifeCycle, setLifeCycle] = useState<LifeCycle>("청년");
  const [householdStatus, setHouseholdStatus] = useState<HouseholdStatus[]>([]);
  const [interestTheme, setInterestTheme] = useState<InterestTheme[]>([]);
  const [age, setAge] = useState("");
  const [sidoName, setSidoName] = useState("");
  const [sigunguName, setSigunguName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLifeCycle(user.life_cycle || "청년");
      setHouseholdStatus(
        Array.isArray(user.household_status) ? user.household_status : []
      );
      setInterestTheme(
        Array.isArray(user.interest_theme) ? user.interest_theme : []
      );
      setAge(user.age ? String(user.age) : "");
      setSidoName(user.sido_name || "");
      setSigunguName(user.sigungu_name || "");
    }
  }, [user]);

  const toggleHouseholdStatus = (status: HouseholdStatus) => {
    setHouseholdStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleInterestTheme = (theme: InterestTheme) => {
    setInterestTheme((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("유효한 나이를 입력해주세요.");
      return;
    }

    if (!sidoName || !sigunguName) {
      setError("거주지를 선택해주세요.");
      return;
    }

    try {
      await updateMe({
        name: name.trim(),
        life_cycle: lifeCycle,
        household_status: householdStatus.length > 0 ? householdStatus : [],
        interest_theme: interestTheme.length > 0 ? interestTheme : [],
        age: ageNum,
        sido_name: sidoName,
        sigungu_name: sigunguName,
      });
      navigate("/mypage");
    } catch (err) {
      setError("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/mypage")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoArrowBack className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-[25px] font-bold text-gray-900">
                내 정보 수정
              </h1>
              <p className="text-[15px] text-gray-600">
                정보를 수정하고 저장하세요
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Life Cycle */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              생애주기 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LIFE_CYCLES.map((lc) => (
                <button
                  key={lc}
                  type="button"
                  onClick={() => setLifeCycle(lc)}
                  className={`py-2 px-3 rounded-lg text-[14px] font-medium transition-colors ${
                    lifeCycle === lc
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {lc}
                </button>
              ))}
            </div>
          </div>

          {/* Household Status */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              가구상황 (복수선택 가능)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HOUSEHOLD_STATUSES.map((hs) => (
                <button
                  key={hs}
                  type="button"
                  onClick={() => toggleHouseholdStatus(hs)}
                  className={`py-2 px-3 rounded-lg text-[14px] font-medium transition-colors ${
                    householdStatus.includes(hs)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {hs}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Theme */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              관심주제 (복수선택 가능)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {INTEREST_THEMES.map((it) => (
                <button
                  key={it}
                  type="button"
                  onClick={() => toggleInterestTheme(it)}
                  className={`py-2 px-2 rounded-lg text-[13px] font-medium transition-colors ${
                    interestTheme.includes(it)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {it}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              나이 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="나이를 입력하세요"
              min="1"
              max="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">
              거주지 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={sidoName}
                onChange={(e) => setSidoName(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">시/도 선택</option>
                {SIDO_LIST.map((sido) => (
                  <option key={sido} value={sido}>
                    {sido}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={sigunguName}
                onChange={(e) => setSigunguName(e.target.value)}
                placeholder="시/군/구"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-[14px] text-red-500">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-[17px] py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "저장 중..." : "저장하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
