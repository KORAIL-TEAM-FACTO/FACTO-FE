import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRegister,
  type HouseholdStatus,
  type InterestTheme,
  type LifeCycle,
} from "../apis";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [showError, setShowError] = useState(false);
  const { mutate: register } = useRegister();
  // Form data
  const [name, setName] = useState("");
  const [lifecycle, setLifecycle] = useState("");
  const [householdSituation, setHouseholdSituation] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const koreanRegex = /^[\uAC00-\uD7A3]+$/; // Korean characters only
  const sigunguRegex = /^[\uAC00-\uD7A3]+구$/; // Korean only and must end with '구'

  const lifecycleOptions = [
    { code: "001", label: "영유아" },
    { code: "002", label: "아동" },
    { code: "003", label: "청소년" },
    { code: "004", label: "청년" },
    { code: "005", label: "중장년" },
    { code: "006", label: "노년" },
    { code: "007", label: "임신·출산" },
  ];

  const householdOptions = [
    { code: "010", label: "다문화·탈북민" },
    { code: "020", label: "다자녀" },
    { code: "030", label: "보훈대상자" },
    { code: "040", label: "장애인" },
    { code: "050", label: "저소득" },
    { code: "060", label: "한부모·조손" },
    { code: "null", label: "해당사항 없음" },
  ];

  const interestOptions = [
    { code: "010", label: "신체건강" },
    { code: "020", label: "정신건강" },
    { code: "030", label: "생활지원" },
    { code: "040", label: "주거" },
    { code: "050", label: "일자리" },
    { code: "060", label: "문화·여가" },
    { code: "070", label: "안전·위기" },
    { code: "080", label: "임신·출산" },
    { code: "090", label: "보육" },
    { code: "100", label: "교육" },
    { code: "110", label: "입양·위탁" },
    { code: "120", label: "보호·돌봄" },
    { code: "130", label: "서민금융" },
    { code: "140", label: "법률" },
    { code: "null", label: "해당사항 없음" },
  ];

  const sidoOptions = [
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "인천광역시",
    "광주광역시",
    "대전광역시",
    "울산광역시",
    "세종특별자치시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주특별자치도",
  ];

  const toggleMultiSelect = (
    value: string,
    setter: (prev: string[]) => void,
    current: string[]
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!isStepValid()) {
      setShowError(true);
      return;
    }

    // 코드를 레이블로 변환하는 함수들
    const getLifecycleLabel = (code: string) => {
      return lifecycleOptions.find((opt) => opt.code === code)?.label || code;
    };

    const getHouseholdLabels = (codes: string[]) => {
      // "해당사항 없음"(null을 문자열 "null"로 저장)이 선택되면 빈 배열 반환
      if (codes.includes("null")) {
        return [];
      }
      return codes.map(
        (code) =>
          householdOptions.find((opt) => opt.code === code)?.label || code
      );
    };

    const getInterestLabels = (codes: string[]) => {
      // "해당사항 없음"이 선택되면 빈 배열 반환
      if (codes.includes("null")) {
        return [];
      }
      return codes.map(
        (code) =>
          interestOptions.find((opt) => opt.code === code)?.label || code
      );
    };

    // 회원가입 데이터
    const registerData = {
      email: email.trim(),
      password,
      name: name.trim(),
      life_cycle: getLifecycleLabel(lifecycle) as LifeCycle,
      household_status: getHouseholdLabels(
        householdSituation
      ) as HouseholdStatus[],
      interest_theme: getInterestLabels(interests) as InterestTheme[],
      age: Number(age),
      sido_name: sido,
      sigungu_name: sigungu.trim(),
    };
    register(registerData, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: () => {
        setShowError(true);
      },
    });
  };

  const getStepError = () => {
    switch (currentStep) {
      case 1:
        if (name.trim().length === 0) return "이름을 입력해주세요";
        if (!koreanRegex.test(name.trim()))
          return "이름은 한글만 입력 가능합니다";
        if (name.trim().length < 2 || name.trim().length >= 10)
          return "이름은 2글자 이상 10글자 미만으로 입력해주세요";
        return "";
      case 2:
        return lifecycle.length === 0 ? "생애주기를 선택해주세요" : "";
      case 3: {
        // "해당사항 없음"(null)이 선택되면 유효한 것으로 간주
        const hasNoOption = householdSituation.includes("null");
        const hasOtherOptions = householdSituation.some(
          (code) => code !== "null"
        );
        return hasNoOption || householdSituation.length === 0
          ? ""
          : householdSituation.length === 0
          ? "가구상황을 한 가지 이상 선택해주세요"
          : "";
      }
      case 4:
        // "해당사항 없음" 허용
        return interests.includes("null") || interests.length > 0
          ? ""
          : "관심주제를 한 가지 이상 선택해주세요";
      case 5: {
        if (!age.trim()) return "나이를 입력해주세요";
        const ageNumber = Number(age);
        if (Number.isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 150)
          return "0 ~ 150 사이의 숫자를 입력해주세요";
        return "";
      }
      case 6:
        if (!sido) return "시도를 선택해주세요";
        if (!sigungu.trim()) return "시군구를 입력해주세요";
        if (!sigunguRegex.test(sigungu.trim()))
          return "시군구는 한글로 입력하고 '구'로 끝나야 합니다";
        return "";
      case 7:
        if (!email.trim()) return "이메일을 입력해주세요";
        if (!emailRegex.test(email)) return "유효한 이메일을 입력해주세요";
        if (!password) return "비밀번호를 입력해주세요";
        if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다";
        return "";
      default:
        return "";
    }
  };

  const isStepValid = () => {
    return getStepError() === "";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col px-6 pt-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => (currentStep === 1 ? navigate(-1) : handlePrev())}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Step Counter */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {currentStep} / {totalSteps}
            </span>
          </div>
        </div>

        <div className="flex-1">
          {/* Step 1: 이름 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                이름을 입력해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">실명을 입력해주세요</p>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (showError) setShowError(false);
                }}
                className="w-full px-4 py-4 text-base border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400"
                autoFocus
              />
              {!showError &&
                name.trim() &&
                (!koreanRegex.test(name.trim()) ||
                  name.trim().length < 2 ||
                  name.trim().length >= 10) && (
                  <p className="mt-2 text-sm text-red-500">
                    이름은 한글 2~9자로 입력해주세요
                  </p>
                )}
              {showError && getStepError() && (
                <p className="mt-2 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 2: 생애주기 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                생애주기를 선택해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                해당하는 항목을 선택해주세요
              </p>
              <div className="space-y-3">
                {lifecycleOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLifecycle(option.code)}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      lifecycle === option.code
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {showError && getStepError() && (
                <p className="mt-4 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 3: 가구상황 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                가구상황을 선택해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">중복 선택 가능합니다</p>
              <div className="space-y-3">
                {householdOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() =>
                      toggleMultiSelect(
                        option.code,
                        setHouseholdSituation,
                        householdSituation
                      )
                    }
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      householdSituation.includes(option.code)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {showError && getStepError() && (
                <p className="mt-4 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 4: 관심주제 */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                관심주제를 선택해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">중복 선택 가능합니다</p>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {interestOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() =>
                      toggleMultiSelect(option.code, setInterests, interests)
                    }
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                      interests.includes(option.code)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {showError && getStepError() && (
                <p className="mt-4 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 5: 나이 */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                나이를 입력해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                만 나이를 입력해주세요
              </p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 25"
                value={age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    const num = Number(value);
                    if (value === "" || num <= 150) {
                      setAge(value);
                    }
                  }
                  if (showError) setShowError(false);
                }}
                className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                  showError && getStepError()
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                autoFocus
              />
              {showError && getStepError() && (
                <p className="mt-2 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 6: 시도명, 시군구명 */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                거주지를 선택해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                시도와 시군구를 입력해주세요
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    시도
                  </label>
                  <select
                    value={sido}
                    onChange={(e) => {
                      setSido(e.target.value);
                      if (showError) setShowError(false);
                    }}
                    className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors bg-white ${
                      showError && getStepError()
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  >
                    <option value="">선택해주세요</option>
                    {sidoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    시군구
                  </label>
                  <input
                    type="text"
                    placeholder="예: 강남구"
                    value={sigungu}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSigungu(value);
                      if (showError) setShowError(false);
                    }}
                    className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                      showError && getStepError()
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {!showError &&
                    sigungu.trim() &&
                    !sigunguRegex.test(sigungu.trim()) && (
                      <p className="mt-2 text-sm text-red-500">
                        시군구는 한글로 입력하고 '구'로 끝나야 합니다
                      </p>
                    )}
                </div>
              </div>
              {showError && getStepError() && (
                <p className="mt-2 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}

          {/* Step 7: 이메일, 비밀번호 */}
          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                계정 정보를 입력해주세요
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                로그인에 사용할 정보입니다
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="example@moboc.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (showError) setShowError(false);
                    }}
                    className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                      showError &&
                      getStepError() &&
                      getStepError().includes("이메일")
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    autoFocus
                  />
                  {email && !emailRegex.test(email) && !showError && (
                    <p className="mt-2 text-xs text-gray-500">
                      올바른 이메일을 입력해주세요
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="8자 이상 입력해주세요"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (showError) setShowError(false);
                    }}
                    className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                      showError &&
                      getStepError() &&
                      getStepError().includes("비밀번호")
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {password && password.length < 8 && !showError && (
                    <p className="mt-2 text-xs text-gray-500">
                      비밀번호는 8자 이상이어야 합니다
                    </p>
                  )}
                </div>
              </div>
              {showError && getStepError() && (
                <p className="mt-4 text-sm text-red-500">{getStepError()}</p>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={!isStepValid()}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              isStepValid()
                ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === totalSteps ? "가입하기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
