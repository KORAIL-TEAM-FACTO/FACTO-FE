import axios from "axios";
import { getCookie, deleteCookie } from "../utils/cookies";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/",
  headers: {
    "Content-Type": "application/json",
  },
});
export const instance2 = axios.create({
  baseURL: import.meta.env.VITE_PARK_URL || "/",
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_REQUIRED_PATHS = [/^\/users\/me/, /^\/bookmarks/, /^\/recent-views/];

const isAuthRequired = (url?: string): boolean => {
  if (!url) return false;
  try {
    const path = new URL(url, instance2.defaults.baseURL).pathname;
    return AUTH_REQUIRED_PATHS.some((pattern) => pattern.test(path));
  } catch (error) {
    console.log(error);
    return false;
  }
};

// 요청 인터셉터: 토큰 추가 및 인증 필요 시 리다이렉트
instance.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    console.log("🔑 [instance] Request to:", config.url);
    console.log("🔑 [instance] Token exists:", !!token);
    console.log("🔑 [instance] Auth required:", isAuthRequired(config.url));

    if (!token && isAuthRequired(config.url)) {
      console.log("❌ [instance] No token, redirecting to login");
      window.location.assign("/login");
      return Promise.reject(new Error("Authentication required"));
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [instance] Token added to request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401, 500 처리 및 리다이렉트
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "❌ [instance] Response error:",
      error.response?.status,
      error.response?.data
    );
    if (
      error.response?.status === 401 ||
      error.response?.status === 500 ||
      error.response?.status === 502 ||
      error.response?.status === 400
    ) {
      console.log(
        "🚪 [instance] Redirecting to login due to error:",
        error.response?.status
      );
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// 요청 인터셉터: 토큰 추가 및 인증 필요 시 리다이렉트
instance2.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    console.log("🔑 [instance2] Request to:", config.url);
    console.log("🔑 [instance2] Token exists:", !!token);
    console.log("🔑 [instance2] Auth required:", isAuthRequired(config.url));

    if (!token && isAuthRequired(config.url)) {
      console.log("❌ [instance2] No token, redirecting to login");
      window.location.assign("/login");
      return Promise.reject(new Error("Authentication required"));
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [instance2] Token added to request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401, 500 처리 및 리다이렉트
instance2.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "❌ [instance2] Response error:",
      error.response?.status,
      error.response?.data
    );
    if (
      error.response?.status === 401 ||
      error.response?.status === 500 ||
      error.response?.status === 502 ||
      error.response?.status === 400
    ) {
      console.log(
        "🚪 [instance2] Redirecting to login due to error:",
        error.response?.status
      );
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);
