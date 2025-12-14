import { setCookie, getCookie, deleteCookie } from "./cookies";

// Access/Refresh 토큰 단순 보관 및 삭제 유틸
export const setAuthTokens = (
  accessToken: string,
  refreshToken?: string,
  {
    accessTokenDays = 7,
    refreshTokenDays = 30,
  }: { accessTokenDays?: number; refreshTokenDays?: number } = {}
) => {
  setCookie("accessToken", accessToken, accessTokenDays);
  if (refreshToken) {
    setCookie("refreshToken", refreshToken, refreshTokenDays);
  }
};

export const removeAuthTokens = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};

export const getAccessToken = () => getCookie("accessToken");
export const getRefreshToken = () => getCookie("refreshToken");
