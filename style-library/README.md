# 🎨 style-library

앱을 만들 때 골라 쓰는 **레이아웃 템플릿 모음**입니다.
모든 템플릿이 하나의 `css/library.css`(디자인 토큰 + 컴포넌트)를 공유해서,
색·글꼴만 바꿔도 전체 톤이 통일됩니다. 의존성 없는 순수 HTML/CSS/JS라 어떤 프로젝트에도 바로 붙습니다.

## 📁 구성

```
style-library/
├── index.html              # 전체 템플릿 갤러리 (여기부터 열어보세요)
├── css/
│   └── library.css         # 공용 디자인 토큰 + 컴포넌트 + 레이아웃 유틸
└── templates/
    ├── dashboard.html      # 대시보드 (사이드바 + 상단바 + 통계 + 표)
    ├── landing.html        # 랜딩/소개 페이지 (히어로 + 특징 + 가격 + CTA)
    ├── form.html           # 폼/입력 (로그인 + 설문 + 모달)
    ├── quiz.html           # 퀴즈 (교육 · 작동하는 예시 포함)
    ├── worksheet.html      # 학습지/문서 (교육·사무 · A4 인쇄 최적화)
    └── card-game.html      # 게임/카드 UI (스탯 바 + 카드 + 좌우 선택)
```

## 🚀 사용법

1. `index.html`을 브라우저로 열어 원하는 템플릿을 고릅니다.
2. 해당 HTML 파일을 복사해 새 앱의 시작점으로 씁니다.
3. `<link rel="stylesheet" href=".../css/library.css">` 경로만 맞춰줍니다.

## 🎨 커스터마이징

**색 바꾸기** — `:root`의 변수 한 줄만 덮어쓰면 전체가 따라옵니다.

```html
<style>
  :root { --brand: #e5484d; }   /* 브랜드 색만 바꿔도 버튼·배지·링크가 전부 바뀜 */
</style>
```

**다크모드** — `<html>` 태그의 속성으로 전환합니다. 지정 안 하면 기기 설정을 따릅니다.

```html
<html data-theme="dark">   <!-- 또는 data-theme="light" -->
```

각 템플릿 우상단의 🌙 버튼으로도 토글됩니다.

## 🧩 준비된 컴포넌트

버튼(`.btn` / `-secondary` `-ghost` `-danger` `-accent`), 카드(`.card`), 배지(`.badge`),
폼(`.input` `.select` `.textarea` `.check`), 표(`.table`), 알림(`.alert`),
통계 위젯(`.stat-card`), 진행바(`.progress`), 모달(`.modal`),
그리드(`.grid-2/3/4` `.grid-auto`), 사이드바 레이아웃(`.app-shell`) 등.

## 📌 메모

- 새 GitHub 레포로 분리하고 싶으면 이 `style-library/` 폴더를 그대로 옮기면 됩니다.
- 인쇄가 필요한 문서(`worksheet.html`)는 브라우저 인쇄 → "PDF로 저장"으로 바로 뽑을 수 있습니다.
