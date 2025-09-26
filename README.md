# Plan-it Frontend
여행 일정 + 날씨 대시보드 (React + Vite)

## 실행 방법
1) 의존성 설치
```cmd
npm install
```
2) 개발 서버 실행

```cmd
npm run dev
```

3) OpenWeather API 키(선택)
- `./.env` 파일을 만들고 아래 키를 추가하면 실시간 날씨를 가져옵니다. 키가 없으면 목업 데이터가 표시됩니다.

```
VITE_OPEN_WEATHER_KEY=여기에_키_입력
```

## 폴더 구조 요약

- `src/components` 공용 컴포넌트
	- `Layout.jsx` 전체 레이아웃/네비게이션
	- `Card.jsx` 카드 UI
	- `CalMini.jsx` 미니 달력
	- `Popover.jsx` 팝오버(툴팁/모달)
	- `Protected.jsx` 보호 라우트(로그인 필요 페이지)
	- `WeatherWidget.jsx` 날씨 위젯

- `src/pages` 주요 페이지
	- `Home.jsx` 홈(대시보드)
	- `Trips.jsx` 여행 목록
	- `TripEdit.jsx` 여행 생성/수정
	- `Community.jsx` 커뮤니티(후기/댓글)
	- `Login.jsx` 로그인
	- `Profile.jsx` 프로필(사용자 정보)

- `src/services` 서비스/비즈니스 로직
	- `authService.js` 인증(로그인/로그아웃/프로필)
	- `communityService.js` 커뮤니티(게시글/댓글/좋아요)
	- `eventService.js` 여행 일정(이벤트)
	- `storageService.js` 여행 정보 CRUD
	- `weatherService.js` 날씨(OpenWeather 연동/목업)

- `src/styles` 스타일 파일
    - `index.css` 글로벌 스타일
    - `components/buttons.css` 버튼 & 배지 스타일
    - `components/layout.css` 레이아웃/그리드/사이드바
    - `components/forms.css` 폼 & 체크리스트
    - `components/calendar.css` 캘린더/달력 카드
    - `components/widgets.css` 위젯(날씨/여행지 카드)
    - `components/popover.css` 팝오버/알림
    - `components/profile-trips.css` 프로필 & 여행 목록
    - `components/memo-card.css` 메모 & 카드 확장
    - `components/community.css` 커뮤니티(게시글/업로더/댓글)
    - `components/pseudo.css` Pseudo 요소/장식
    - `components/responsive.css` 반응형(작은 화면)
    - `components/auth.css` 로그인/인증 화면

## 기능

- 홈: 날씨 위젯, 미니 캘린더, 인기 여행지 카드(목업)
- 여행: LocalStorage 기반 CRUD, 체크리스트
- 커뮤니티: 후기 작성(텍스트/사진 업로드), 좋아요, 댓글, 삭제
- 로그인: LocalStorage 기반 목업 인증(어떤 이메일/비밀번호도 로그인 가능), 보호 라우팅 적용

## 브라우저 지원

- 최신 크롬/엣지 권장

## 기술 스택
- React 18 + Vite
- React Router v6
- Axios
 - Tailwind CSS v4 (@layer theme/base/components/utilities + 임의 값 활용)

## Tailwind 전환 메모
이 프로젝트는 기존 커스텀 CSS 를 `src/styles/index.css` 하나로 통합하고 Tailwind v4의
`@layer components` + `@apply` 패턴으로 컴포넌트 토큰화 했습니다. 런타임 동적 스타일(예: 아바타 배경 이미지, Popover 위치)만 인라인으로 남겨두었고 나머지는 유틸리티/커스텀 클래스화 되어 있습니다.

### 결론
> ✅ 기존 커스텀 CSS 구조를 유지하면서 Tailwind v4 기반으로 안전하게 재구성 완료. Preflight/레이어/토큰 공존 형태이며, 향후 필요 시 유틸 완전 치환과 theme 확장은 추가적인 최적화 단계.

### 현재 상태 vs 이상형(100% Tailwind)
|                  항목                    |         현재 방식     vs          이상형(선택)            |           "비고"              |
|------------------------------------------|-----------------------|----------------------------------|-------------------------------|
| 컴포넌트 클래스<br>(.card, .sidebar 등)  | 남겨둔 추상 클래스      |     전부 JSX 유틸로 대체         | 유지가 더 읽기 쉬울 수도 있음  |
| raw CSS 속성<br>(gradient, shadow 등)   | 다수 직접 선언          |   theme.extend + arbitrary 유틸  |    기능 영향 없음             |
| 토큰<br>(:root 변수)                    | CSS 변수 유지           |      Tailwind theme로 흡수       |    추후 단계 최적화 가능      |
| 스타일 분리                             | 다수 파일 @import layer |     colocation 또는 plugin화     |      지금도 구조 선명         |

### 이번 전환에서 실제로 한 것
- Tailwind v4 도입: `@import "tailwindcss/preflight.css"`, `utilities`, `@layer theme/base/components` 적용
- 기존 커스텀 CSS를 `src/styles/index.css`에서 통합 관리하고, components 레이어로 파일 분리 유지
- 공통 스타일은 `@apply`로 추상 클래스화(예: `.btn`, `.card`, `.calendar-card`), JSX는 필요한 의미 클래스만 사용
- 동적/복잡 스타일(gradient, backdrop-filter 등)은 임의값 유틸 혹은 최소한의 raw 선언로 유지해 회귀 리스크 최소화
- Vite + PostCSS 설정으로 v4 JIT 동작, 스캔 경로는 `index.html`/`src/**/*`로 구성

### 나머지를 ‘선택’으로 둔 이유 (안전성/가독성/비용 대비)
- 회귀 리스크 최소화: 레이아웃/구조 클래스를 한 번에 유틸로 치환하면 레이아웃 붕괴 위험이 커짐
- 팀 가독성: 추상 클래스가 컴포넌트 의도를 드러내 유지보수에 유리할 때가 있음
- 비용 대비 효율: theme 확장/플러그인화는 필요성(재사용·일관성·번들 최적화)이 분명할 때 진행해도 늦지 않음
- 성능 관점: v4 JIT는 실제 사용하는 유틸만 출력하므로, "현재 구조도 과도한 CSS 증가 없이 운영 가능"

### 선택적 후속 최적화 아이디어 (원할 때 점진 적용)
- `tailwind.config.js`의 `theme.extend`로 색/그라디언트/그림자/반경을 토큰화하여 임의값 반복 제거
- `.app-shell`, `.sidebar`, `.grid` 등 구조 클래스를 JSX 유틸로 점진 치환 또는 파일별 colocation
- 버튼/카드/배지 등을 Tailwind plugin 또는 `@layer components` 유틸로 표준화(변형/상태 포함)
- Chrome DevTools Coverage로 미사용 컴포넌트 규칙 감축
