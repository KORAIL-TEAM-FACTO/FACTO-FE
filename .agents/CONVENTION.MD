# Coding Conventions

본 문서는 프로젝트의 일관된 코드 스타일과 컨벤션을 정의합니다.

## Table of Contents
- [Naming Conventions](#naming-conventions)
- [File Structure](#file-structure)
- [Import Style](#import-style)
- [Component Patterns](#component-patterns)
- [TypeScript Guidelines](#typescript-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [State Management](#state-management)
- [Event Handling](#event-handling)

---

## Naming Conventions

### Variables & Functions
- **camelCase** 사용
```typescript
const userEmail = 'user@example.com'
const isButtonActive = true
const handleLogin = () => {}
```

### Components
- **PascalCase** 사용
- 파일명과 컴포넌트명 일치
```typescript
// NavBar.tsx
export default function NavBar() {}

// WelfareSearch.tsx
export default function WelfareSearch() {}
```

### Constants
- 컴포넌트 내부 상수: **camelCase**
```typescript
const notices = [...]
const categories = [...]
const services = [...]
```

### Types & Interfaces
- **PascalCase** 사용 (향후 타입 정의 시)
```typescript
type UserData = {
  email: string
  password: string
}

interface ServiceItem {
  title: string
  description: string
}
```

---

## File Structure

### Directory Organization
```
src/
├── pages/           # 페이지 컴포넌트 (PascalCase.tsx)
├── components/      # 재사용 가능한 컴포넌트 (PascalCase.tsx)
├── hooks/          # 커스텀 훅 (useCamelCase.ts) [향후]
├── utils/          # 유틸리티 함수 (camelCase.ts) [향후]
├── types/          # 타입 정의 (camelCase.ts) [향후]
├── constants/      # 상수 정의 (UPPER_CASE.ts) [향후]
└── assets/         # 정적 리소스
```

### File Naming
- **Components**: PascalCase (예: `NavBar.tsx`, `WelfareSearch.tsx`)
- **Utilities**: camelCase (예: `formatDate.ts`)
- **Hooks**: camelCase with 'use' prefix (예: `useKeyboard.ts`)

---

## Import Style

### Import Order
1. React 관련 import
2. 외부 라이브러리
3. 내부 컴포넌트
4. 유틸리티/헬퍼
5. 타입 정의
6. 스타일

```typescript
// ✅ Good
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoSend } from 'react-icons/io5'
import NavBar from '../components/NavBar'

// ❌ Bad - 순서 없이 섞여있음
import NavBar from '../components/NavBar'
import { useState } from 'react'
import { IoSend } from 'react-icons/io5'
```

### Import Style
- Named imports는 중괄호 사용
- Default imports는 중괄호 없이 사용
- 상대 경로는 `../` 형식 사용

```typescript
// ✅ Good
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'

// ❌ Bad
import * as React from 'react'
```

---

## Component Patterns

### Component Declaration
- **Function Component** 사용 (Class Component 사용 안 함)
- **export default** 패턴 사용
- 컴포넌트명과 파일명 일치

```typescript
// ✅ Good
export default function Home() {
  return <div>...</div>
}

// ❌ Bad
const Home = () => {
  return <div>...</div>
}
export default Home
```

### Component Structure
```typescript
export default function ComponentName() {
  // 1. Hooks
  const [state, setState] = useState('')
  const navigate = useNavigate()

  // 2. Derived state / computed values
  const isActive = state.length > 0

  // 3. Data / Constants
  const items = [...]

  // 4. Event handlers
  const handleClick = () => {}

  // 5. Effects
  useEffect(() => {}, [])

  // 6. Render
  return <div>...</div>
}
```

### JSX Style
- 한 줄에 하나의 prop이 들어가도록 포맷팅 (긴 경우)
- 자식이 있는 경우 여는 태그와 닫는 태그를 별도 라인에
- Self-closing 태그 사용 (자식이 없을 때)

```typescript
// ✅ Good - 긴 props
<Link
  to="/welfare-search"
  className="flex flex-col items-center"
>
  Content
</Link>

// ✅ Good - Self-closing
<input
  type="text"
  placeholder="검색"
  className="w-full"
/>

// ❌ Bad
<Link to="/welfare-search" className="flex flex-col items-center"><span>Content</span></Link>
```

---

## TypeScript Guidelines

### Type Annotations
- 함수 매개변수에 타입 명시
- 이벤트 핸들러에 React 타입 사용
- 가능하면 타입 추론 활용

```typescript
// ✅ Good
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault()
}

const [email, setEmail] = useState('') // string으로 추론됨
const [count, setCount] = useState<number>(0) // 명시적 타입

// ❌ Bad - any 사용
const handleClick = (e: any) => {}
```

### Props Typing
```typescript
// ✅ Good - 인라인 타입
export default function Button({
  onClick,
  children
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return <button onClick={onClick}>{children}</button>
}

// ✅ Better - 타입 분리 (복잡한 경우)
type ButtonProps = {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

---

## Styling Guidelines

### Tailwind CSS Usage
- Tailwind 유틸리티 클래스 우선 사용
- Template literals를 사용한 동적 클래스

```typescript
// ✅ Good - 동적 클래스
<button
  className={`w-full py-4 rounded-xl ${
    isActive
      ? 'bg-blue-500 text-white'
      : 'bg-gray-100 text-gray-400'
  }`}
>
  로그인
</button>

// ✅ Good - 긴 클래스는 줄바꿈
<div className="min-h-screen bg-white pb-32 relative">
  ...
</div>
```

### Color Scheme
프로젝트에서 사용하는 주요 색상:
- **Primary**: `blue-500`, `blue-600` (액션 버튼, 강조)
- **Secondary**: `purple-600` (보조 액션, 그라디언트)
- **Success**: `green-600`
- **Warning**: `orange-600`
- **Danger**: `red-600`
- **Text**: `gray-900` (주요 텍스트), `gray-600`, `gray-500` (보조 텍스트)
- **Background**: `gray-50`, `gray-100`
- **Border**: `gray-200`, `gray-100`

### Font Sizes
- 큰 제목: `text-[25px]` 또는 `text-3xl`
- 중간 제목: `text-[19px]` 또는 `text-lg`
- 본문: `text-[17px]` 또는 `text-base`
- 보조 텍스트: `text-[15px]` 또는 `text-sm`
- 작은 텍스트: `text-[13px]` 또는 `text-xs`

### Spacing
- 패딩: `px-4`, `py-4`, `p-6` 등 4의 배수 사용
- 마진: `mb-6`, `mt-4` 등 4의 배수 사용
- 간격: `space-y-3`, `space-y-4`, `gap-2`, `gap-3`

### Border Radius
- 작은 요소: `rounded-lg` (8px)
- 중간 요소: `rounded-xl` (12px)
- 큰 요소/카드: `rounded-2xl` (16px)
- 원형: `rounded-full`

---

## State Management

### useState Hook
- 초기값을 명확하게 설정
- 상태명은 명확하고 의미있게

```typescript
// ✅ Good
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isLoading, setIsLoading] = useState(false)
const [keyboardHeight, setKeyboardHeight] = useState(0)

// ❌ Bad
const [e, setE] = useState('')
const [data, setData] = useState()
```

### Derived State
- 계산된 값은 별도 변수로 선언
- 불필요한 useState 사용 지양

```typescript
// ✅ Good
const isButtonActive = email.length > 0 && password.length > 0

// ❌ Bad - 불필요한 state
const [isButtonActive, setIsButtonActive] = useState(false)
useEffect(() => {
  setIsButtonActive(email.length > 0 && password.length > 0)
}, [email, password])
```

### useEffect Hook
- 의존성 배열을 명확하게 설정
- cleanup 함수 작성 (이벤트 리스너 등)

```typescript
// ✅ Good
useEffect(() => {
  const handleResize = () => {
    // 로직
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

---

## Event Handling

### Naming Convention
- 이벤트 핸들러: `handle` prefix 사용
- Props로 전달되는 콜백: `on` prefix 사용

```typescript
// ✅ Good
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault()
}

const handleClick = () => {}

// Props
<Button onClick={handleClick} onSubmit={handleSubmit} />

// ❌ Bad
const login = () => {}
const clickHandler = () => {}
```

### Event Type
- React의 이벤트 타입 사용

```typescript
// ✅ Good
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value)
}

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // 로직
}
```

---

## Code Organization

### Data Arrays
- 컴포넌트 상단에 정의
- 타입이 복잡한 경우 별도 파일로 분리 고려

```typescript
// ✅ Good
export default function Home() {
  const notices = [
    { title: '공지사항', date: '2024.12.10', badge: 'NEW' },
    // ...
  ]

  const services = [
    { title: '서비스', description: '설명', amount: '금액', tag: '태그' },
    // ...
  ]

  return <div>...</div>
}
```

### Function Helpers
- 간단한 유틸리티는 컴포넌트 내부에
- 재사용되는 로직은 별도 파일로 분리

```typescript
// ✅ Good - 간단한 헬퍼
export default function NavBar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return <nav>...</nav>
}
```

---

## Comments & Documentation

### 코드 주석
- 복잡한 로직에만 주석 작성
- TODO 주석 사용 가능
- 한글 주석 허용

```typescript
// ✅ Good
// 모바일에서 키보드가 올라오면 visualViewport 높이가 변경됨
if (window.visualViewport) {
  const viewportHeight = window.visualViewport.height
}

// TODO: 백엔드 API 연동 필요
const handleLogin = () => {}
```

---

## Best Practices

### Accessibility
- 시맨틱 HTML 사용
- 버튼에는 `<button>` 태그 사용
- 폼에는 적절한 `type` 속성 사용

```typescript
// ✅ Good
<button onClick={handleClick}>클릭</button>
<input type="email" />
<input type="password" />

// ❌ Bad
<div onClick={handleClick}>클릭</div>
```

### Performance
- 불필요한 리렌더링 방지
- key prop 사용 (리스트 렌더링)
- 이미지 최적화

```typescript
// ✅ Good
{services.map((service, index) => (
  <div key={index}>
    {service.title}
  </div>
))}
```

### Error Handling
- 폼 제출 시 검증
- Optional chaining 사용

```typescript
// ✅ Good
if (email && password) {
  navigate('/')
}

// Optional chaining
const height = window.visualViewport?.height
```

---

## Git Commit Convention

### Commit Message Format
```
type: subject

body (optional)
```

### Types
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `design`: UI 디자인 변경
- `chore`: 빌드 업무 수정, 패키지 설치 등
- `docs`: 문서 수정

### Examples
```
feat: 로그인 페이지 구현
fix: 네비게이션 바 활성 상태 버그 수정
refactor: Home 컴포넌트 구조 개선
design: 버튼 스타일 변경
chore: React Router 패키지 추가
```

---

## Summary

이 컨벤션을 따라 코드를 작성하면:
- 팀원 간 코드 이해도 향상
- 유지보수성 증가
- 코드 품질 향상
- 일관된 프로젝트 구조 유지

새로운 패턴이나 컨벤션이 필요한 경우 팀과 논의 후 이 문서를 업데이트하세요.
