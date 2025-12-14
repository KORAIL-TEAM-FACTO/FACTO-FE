# Project Architecture

## Overview
이 프로젝트는 React + TypeScript + Vite를 기반으로 한 복지 서비스 웹 애플리케이션입니다.

## Technology Stack

### Core
- **React**: 19.2.0 (UI 라이브러리)
- **TypeScript**: 5.9.3 (타입 안정성)
- **Vite**: 7.2.4 (빌드 도구 및 개발 서버)

### Styling
- **Tailwind CSS**: 4.1.17 (유틸리티 기반 CSS 프레임워크)
- **PostCSS**: 8.5.6 (CSS 후처리)
- **Autoprefixer**: 10.4.22 (벤더 프리픽스 자동 추가)

### Routing
- **React Router DOM**: 7.10.1 (클라이언트 사이드 라우팅)

### Icons & Assets
- **React Icons**: 5.5.0 (아이콘 라이브러리)

### Development Tools
- **ESLint**: 9.39.1 (코드 린팅)
- **TypeScript ESLint**: 8.46.4 (TypeScript 린팅)

## Directory Structure

```
factor/
├── src/
│   ├── pages/              # 페이지 컴포넌트 (라우트별 페이지)
│   │   ├── Home.tsx        # 메인 홈 페이지
│   │   ├── Login.tsx       # 로그인 페이지
│   │   ├── SignUp.tsx      # 회원가입 페이지
│   │   ├── WelfareSearch.tsx  # 복지 검색 페이지
│   │   ├── Phone.tsx       # 전화 관련 페이지
│   │   ├── MyPage.tsx      # 마이페이지
│   │   ├── About.tsx       # 소개 페이지
│   │   └── Contact.tsx     # 연락처 페이지
│   │
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── NavBar.tsx      # 네비게이션 바
│   │
│   ├── assets/             # 정적 리소스 (이미지, 아이콘 등)
│   │   └── react.svg
│   │
│   ├── App.tsx             # 메인 앱 컴포넌트 (라우팅 설정)
│   ├── main.tsx            # 애플리케이션 엔트리 포인트
│   ├── index.css           # 글로벌 CSS 스타일
│   └── App.css             # App 컴포넌트 스타일
│
├── .agents/                # 프로젝트 문서 및 가이드
│   ├── ARCH.MD             # 아키텍처 문서 (현재 파일)
│   └── CONVENTION.MD       # 코딩 컨벤션
│
├── .claude/                # Claude Code 설정
│   └── settings.local.json # Claude Code 로컬 설정
│
├── vite.config.ts          # Vite 빌드 설정
├── tsconfig.json           # TypeScript 메인 설정
├── tsconfig.app.json       # 앱용 TypeScript 설정
├── tsconfig.node.json      # Node용 TypeScript 설정
├── eslint.config.js        # ESLint 설정
├── package.json            # 프로젝트 의존성 및 스크립트
├── package-lock.json       # 의존성 잠금 파일
└── index.html              # HTML 템플릿
```

## Application Architecture

### Routing Structure
애플리케이션은 React Router를 사용한 SPA(Single Page Application) 구조입니다.

**정의 위치**: `src/App.tsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | 메인 홈 페이지 |
| `/login` | Login | 로그인 페이지 |
| `/signup` | SignUp | 회원가입 페이지 |
| `/welfare-search` | WelfareSearch | 복지 검색 페이지 |
| `/phone` | Phone | 전화 관련 페이지 |
| `/mypage` | MyPage | 사용자 마이페이지 |

### Component Architecture

#### 1. Entry Point (`src/main.tsx`)
- React 18+ StrictMode로 앱 렌더링
- DOM 루트 엘리먼트에 App 컴포넌트 마운트

#### 2. App Component (`src/App.tsx`)
- BrowserRouter로 라우팅 설정
- Routes와 Route를 사용한 페이지 매핑
- 각 페이지 컴포넌트 임포트 및 연결

#### 3. Pages
- 각 라우트에 대응하는 독립적인 페이지 컴포넌트
- 페이지별 비즈니스 로직 포함

#### 4. Components
- 재사용 가능한 UI 컴포넌트
- 현재 NavBar 컴포넌트 존재

### Design Patterns

#### Page-Based Architecture
- 페이지 단위로 컴포넌트 구조화
- `/pages` 디렉토리에 라우트별 페이지 컴포넌트 배치
- `/components` 디렉토리에 공통 컴포넌트 배치

#### Component Composition
- 작은 재사용 가능한 컴포넌트 조합
- Props를 통한 데이터 전달
- 컴포넌트 간 책임 분리

## Styling Strategy

### Tailwind CSS 유틸리티 우선 접근
- Tailwind CSS 클래스를 사용한 인라인 스타일링
- 커스텀 CSS는 최소화
- 반응형 디자인을 위한 Tailwind 브레이크포인트 활용

### CSS 파일
- `index.css`: Tailwind 디렉티브 및 글로벌 스타일
- `App.css`: App 컴포넌트 전용 스타일

## Build & Development

### Scripts
```json
{
  "dev": "vite",              // 개발 서버 실행
  "build": "tsc -b && vite build",  // TypeScript 컴파일 + 프로덕션 빌드
  "lint": "eslint .",         // 린팅 실행
  "preview": "vite preview"   // 빌드 결과 미리보기
}
```

### Development Workflow
1. `npm run dev` - 로컬 개발 서버 시작 (Hot Module Replacement 지원)
2. `npm run lint` - 코드 품질 검사
3. `npm run build` - 프로덕션 빌드
4. `npm run preview` - 빌드된 결과물 미리보기

### Build Configuration
- **Vite**: 빠른 개발 서버 및 최적화된 빌드
- **TypeScript**: 타입 체크 및 컴파일
- **ESLint**: 코드 품질 및 스타일 검사

## Future Architecture Considerations

### 확장 가능한 구조
필요에 따라 다음 디렉토리 추가 가능:
- `src/hooks/` - 커스텀 React Hooks
- `src/utils/` - 유틸리티 함수
- `src/services/` - API 통신 서비스
- `src/contexts/` - React Context (전역 상태)
- `src/types/` - TypeScript 타입 정의
- `src/constants/` - 상수 정의
- `src/layouts/` - 레이아웃 컴포넌트

### State Management
현재는 로컬 상태 관리만 사용하지만, 필요시 다음 도구 고려:
- React Context API (간단한 전역 상태)
- Zustand / Jotai (경량 상태 관리)
- Redux Toolkit (복잡한 상태 관리)

### API Integration
향후 백엔드 연동시 고려사항:
- Axios 또는 Fetch API
- React Query 또는 SWR (데이터 페칭 및 캐싱)
- API 서비스 레이어 분리

## Performance Optimization

### Vite의 기본 최적화
- 빠른 HMR (Hot Module Replacement)
- 최적화된 번들링
- 코드 스플리팅
- Tree-shaking

### 추가 최적화 고려사항
- React.lazy를 사용한 페이지별 코드 스플리팅
- 이미지 최적화
- 번들 크기 분석 및 최적화
