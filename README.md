kakao-assignment-2/todo-react/
│
├── index.html                        # HTML 진입점
│
├── vite.config.js                    # Vite 빌드 설정
├── postcss.config.js              # PostCSS 설정 (@tailwindcss/postcss)
├── eslint.config.js
├── package.json                   # 의존성 (react, tailwindcss, vite 등)
│
└── src/
    ├── main.jsx                      
    ├── index.css                     # Tailwind 진입점 + body 스타일 + @keyframes slideIn
    ├── App.css                       # Tailwind로 대체됨 (비어있음)
    ├── App.jsx                       # 앱 루트 — 전체 상태 관리
    │
    ├── components/
    │   ├── WeekView.jsx              # 주간 캘린더 뷰
    │   ├── MonthView.jsx            # 월별 캘린더
    │   ├── TodoInput.jsx              # 할 일 입력 폼
    │   ├── FilterTabs.jsx               # 전체 / 진행 중 / 완료 필터
    │   ├── TodoList.jsx                 # Todo 목록 렌더링
    │   └── TodoItem.jsx               # Todo 단일 항목
    │
    └── utils/
        └── dateUtils.js              # 날짜 계산 유틸 함수
