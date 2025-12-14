import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { instance2 } from "../apis/client";

interface WelfareService {
  service_id: string;
  service_name: string;
  ai_summary: string;
  ctpv_nm: string;
  sgg_nm: string;
  support_type: string;
  service_type: string;
  inquiry_count: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [customizedServices, setCustomizedServices] = useState<
    WelfareService[]
  >([]);
  const [trendingServices, setTrendingServices] = useState<WelfareService[]>(
    []
  );
  const [isLoadingCustom, setIsLoadingCustom] = useState(true);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [userName, setUserName] = useState("홍길동");

  useEffect(() => {
    const fetchCustomizedServices = async () => {
      try {
        const response = await instance2.get("/welfare-services", {
          params: { limit: 10 },
        });

        setCustomizedServices(response.data);

        // 사용자 정보 가져오기
        try {
          const userResponse = await instance2.get("/users/me");
          setUserName(userResponse.data.name);
        } catch (userError) {
          console.log("사용자 정보 조회 실패 (로그인 필요):", userError);
        }
      } catch (error) {
        console.error("맞춤형 복지 서비스 조회 실패:", error);
      } finally {
        setIsLoadingCustom(false);
      }
    };

    const fetchTrendingServices = async () => {
      try {
        const response = await instance2.get("/recent-views/trending", {
          params: { days: 7, limit: 10 },
        });

        const trendingData = response.data;

        // trending 데이터에서 service_id만 받으므로 상세 정보를 가져와야 함
        const detailedServices = await Promise.all(
          trendingData.map(async (item: { welfare_service_id: string }) => {
            try {
              const detailResponse = await instance2.get(
                `/welfare-services/${item.welfare_service_id}`
              );
              return detailResponse.data;
            } catch {
              return null;
            }
          })
        );

        setTrendingServices(
          detailedServices.filter((service) => service !== null)
        );
      } catch (error) {
        console.error("인기 복지 서비스 조회 실패:", error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchCustomizedServices();
    fetchTrendingServices();
  }, []);

  const handleServiceClick = (serviceId: string) => {
    navigate(`/welfare/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[25px] font-bold text-gray-900 mb-2">
                {userName}님 반가워요,
              </h1>
              <p className="text-[17px] text-gray-700">
                받을 수 있는 복지 혜택이{" "}
                <span className="font-bold text-blue-600">
                  {customizedServices.length}개
                </span>{" "}
                있어요
              </p>
            </div>
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
            <svg
              className="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
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

        {/* Recommended Services - Horizontal Scroll */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="font-bold text-[19px] text-gray-900">
              받을 수 있는 혜택
            </h2>
            <button className="text-[15px] text-blue-600 font-medium">
              전체보기
            </button>
          </div>
          {isLoadingCustom ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : customizedServices.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 px-4 pb-2">
                {customizedServices.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service.service_id)}
                    className="bg-white rounded-xl p-4 border border-gray-200 flex-shrink-0 w-[280px] cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[17px] text-gray-900 flex-1">
                          {service.service_name}
                        </h3>
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap">
                          {service.service_type === "LOCAL" ? "지자체" : "중앙"}
                        </span>
                      </div>
                      <p className="text-[15px] text-gray-600 mb-3 line-clamp-2">
                        {service.ai_summary}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-[15px] text-gray-500">
                          {service.ctpv_nm} {service.sgg_nm}
                        </p>
                        <div className="p-2">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-gray-600 text-[15px]">
                맞춤형 복지 서비스가 없습니다. 챗봇 AI를 통해 복지 서비스를
                찾아보세요!
              </p>
            </div>
          )}
        </div>

        {/* Popular Services - Horizontal Scroll */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="font-bold text-[19px] text-gray-900">
              인기있는 복지 서비스를 알아보세요
            </h2>
            <button className="text-[15px] text-blue-600 font-medium">
              전체보기
            </button>
          </div>
          {isLoadingTrending ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trendingServices.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 px-4 pb-2">
                {trendingServices.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service.service_id)}
                    className="bg-white rounded-xl p-4 border border-gray-200 flex-shrink-0 w-[280px] cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[17px] text-gray-900 flex-1">
                          {service.service_name}
                        </h3>
                        <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap">
                          인기
                        </span>
                      </div>
                      <p className="text-[15px] text-gray-600 mb-3 line-clamp-2">
                        {service.ai_summary}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[13px] text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{service.inquiry_count.toLocaleString()}</span>
                        </div>
                        <div className="p-2">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-gray-600 text-[15px]">
                인기 복지 서비스가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
