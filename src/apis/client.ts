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
    const path = new URL(url, instance.defaults.baseURL).pathname;
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
    if (!token && isAuthRequired(config.url)) {
      window.location.assign("/login");
      return Promise.reject(new Error("Authentication required"));
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 및 리다이렉트
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);
