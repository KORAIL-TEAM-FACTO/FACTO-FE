export type LifeCycle =
  | "영유아"
  | "아동"
  | "청소년"
  | "청년"
  | "중장년"
  | "노년"
  | "임신·출산";

export type HouseholdStatus =
  | "다문화·탈북민"
  | "다자녀"
  | "보훈대상자"
  | "장애인"
  | "저소득"
  | "한부모·조손";

export type InterestTheme =
  | "신체건강"
  | "정신건강"
  | "생활지원"
  | "주거"
  | "일자리"
  | "문화·여가"
  | "안전·위기"
  | "임신·출산"
  | "보육"
  | "교육"
  | "입양·위탁"
  | "보호·돌봄"
  | "서민금융"
  | "법률";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  life_cycle: LifeCycle;
  household_status: HouseholdStatus[];
  interest_theme: InterestTheme[];
  age: number;
  sido_name: string;
  sigungu_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  life_cycle: LifeCycle;
  household_status: HouseholdStatus;
  interest_theme: InterestTheme;
  age: number;
  sido_name: string;
  sigungu_name: string;
  role: string;
}

export interface UpdateProfileRequest {
  name?: string;
  life_cycle?: LifeCycle;
  household_status?: HouseholdStatus;
  interest_theme?: InterestTheme;
  age?: number;
  sido_name?: string;
  sigungu_name?: string;
}
