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

- `src/styles`
	- `index.css` 글로벌 스타일

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