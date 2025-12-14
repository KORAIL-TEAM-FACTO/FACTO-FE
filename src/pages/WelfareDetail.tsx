import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { instance2 } from "../apis/client";

interface WelfareDetail {
  service_id: string;
  service_name: string;
  service_summary: string;
  ai_summary: string;
  ctpv_nm: string;
  sgg_nm: string;
  biz_chr_dept_nm: string;
  support_type: string;
  support_cycle: string;
  application_method: string;
  support_target_content: string;
  selection_criteria: string;
  service_content: string;
  application_method_content: string;
  inquiry_count: number;
  detail_link: string;
  last_modified_date: string;
  service_type: string;
  service_url: string;
  site: string;
  contact: string;
  department: string;
  organization: string;
  base_year: number;
  organization_name: string;
  project_start_date: string;
  project_end_date: string;
  required_documents: string;
  etc: string;
  household_status: string;
}

export default function WelfareDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [welfareData, setWelfareData] = useState<WelfareDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWelfareDetail = async () => {
      if (!serviceId) {
        setError("서비스 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await instance2.get(`/welfare-services/${serviceId}`);
        setWelfareData(response.data);

        // 로그인한 사용자라면 최근 본 목록에 추가
        try {
          await instance2.post(`/recent-views/${serviceId}`);
        } catch (err) {
          console.log("최근 본 목록 추가 실패 (로그인 필요):", err);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWelfareDetail();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-[15px]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !welfareData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-gray-900 text-[17px] font-bold mb-2">
            오류가 발생했습니다
          </p>
          <p className="text-gray-600 text-[15px] mb-6">
            {error || "복지 서비스 정보를 찾을 수 없습니다."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-900"
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
          <h1 className="text-[19px] font-bold text-gray-900">복지 서비스</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-[25px] font-bold text-gray-900 leading-tight">
                {welfareData.service_name}
              </h2>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[13px] font-medium whitespace-nowrap">
                {welfareData.service_type === "LOCAL" ? "지자체" : "중앙"}
              </span>
            </div>
            <p className="text-[17px] text-gray-700 mb-4">
              {welfareData.ai_summary}
            </p>
            <div className="flex items-center gap-2 text-[15px] text-gray-600">
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
              <span>조회수 {welfareData.inquiry_count.toLocaleString()}회</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-700 mb-2">
                지역
              </h3>
              <p className="text-[17px] text-gray-900">
                {welfareData.ctpv_nm} {welfareData.sgg_nm}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-700 mb-2">
                지원 형태
              </h3>
              <p className="text-[17px] text-gray-900">
                {welfareData.support_type} · {welfareData.support_cycle}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-700 mb-2">
                신청 방법
              </h3>
              <p className="text-[17px] text-gray-900">
                {welfareData.application_method}
              </p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-3">
                지원 대상
              </h3>
              <p className="text-[17px] text-gray-700 leading-relaxed whitespace-pre-line">
                {welfareData.support_target_content}
              </p>
            </div>

            <div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-3">
                선정 기준
              </h3>
              <p className="text-[17px] text-gray-700 leading-relaxed whitespace-pre-line">
                {welfareData.selection_criteria}
              </p>
            </div>

            <div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-3">
                지원 내용
              </h3>
              <p className="text-[17px] text-gray-700 leading-relaxed whitespace-pre-line">
                {welfareData.service_content}
              </p>
            </div>

            <div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-3">
                신청 방법 안내
              </h3>
              <p className="text-[17px] text-gray-700 leading-relaxed whitespace-pre-line">
                {welfareData.application_method_content}
              </p>
            </div>

            {welfareData.required_documents && (
              <div>
                <h3 className="text-[19px] font-bold text-gray-900 mb-3">
                  필요 서류
                </h3>
                <p className="text-[17px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {welfareData.required_documents}
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3">
                문의처
              </h3>
              <div className="space-y-2 text-[15px] text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">담당 부서:</span>
                  <span>{welfareData.biz_chr_dept_nm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">연락처:</span>
                  <span>{welfareData.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">기관:</span>
                  <span>{welfareData.organization}</span>
                </div>
              </div>
            </div>

            <div className="text-[13px] text-gray-500">
              <p>사업 기간: {welfareData.project_start_date} ~ {welfareData.project_end_date}</p>
              <p>최종 수정일: {welfareData.last_modified_date}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {welfareData.detail_link && (
              <a
                href={welfareData.detail_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-[17px] text-center hover:bg-blue-600 transition-colors"
              >
                상세 정보 보기
              </a>
            )}
            {welfareData.service_url && (
              <a
                href={welfareData.service_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold text-[17px] text-center hover:bg-gray-200 transition-colors border border-gray-200"
              >
                신청 사이트 바로가기
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
