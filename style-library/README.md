# 🎨 style-library

앱을 만들 때 골라 쓰는 **디자인 스타일 카탈로그 + 레이아웃 템플릿**입니다.
서로 완전히 다른 4가지 디자인 "결"을 번호로 정리해 두어서,
앞으로 **"N번 느낌으로 만들어줘"** 한마디로 원하는 무드의 앱을 시작할 수 있습니다.

## 🔢 디자인 결 카탈로그 (번호로 요청)

| 번호 | 이름 | 느낌 | 어울리는 곳 |
|---|---|---|---|
| **01** | 뉴 브루탈리즘 | 두꺼운 검은 테두리·하드 그림자·쨍한 원색, 각지고 강한 개성 | 캠페인·이벤트·포스터 |
| **02** | 에디토리얼 / 스위스 | 세리프 대형 헤드라인·헤어라인·흑백+포인트 한 색, 잡지 절제미 | 소개·아카이브·읽을거리 |
| **03** | 레트로 터미널 / 사이버 | 어두운 배경·모노스페이스·네온·스캔라인, CRT 감성 | 게임·개발도구·해커 무드 |
| **04** | 따뜻한 오가닉 | 흙빛·크림·세이지 자연색·부드러운 세리프·둥근 형태 | 교육·도서·라이프스타일 |

> 예시 요청: **"3번 느낌으로 퀴즈 앱 만들어줘"**, **"1번 스타일 대시보드"**, **"4번 톤으로 학습지"**

## 📁 구성

```
style-library/
├── index.html                     # 스타일 카탈로그 (여기부터 열어보세요)
├── styles/                        # ▶ 디자인 결 4종 (번호별 테마 + 쇼케이스)
│   ├── 01-brutalism/  theme.css · showcase.html
│   ├── 02-editorial/  theme.css · showcase.html
│   ├── 03-terminal/   theme.css · showcase.html
│   └── 04-organic/    theme.css · showcase.html
├── css/
│   └── library.css                # 스타일 무관 중립 컴포넌트 (기본 템플릿용)
└── templates/                     # ▶ 구조 위주의 중립 레이아웃
    ├── dashboard.html · landing.html · form.html
    └── quiz.html · worksheet.html · card-game.html
```

- **styles/** = "어떤 무드로 보일까" (색·글꼴·질감). 각 폴더의 `showcase.html`이 그 스타일의 전체 견본입니다.
- **templates/** = "어떤 구조로 배치할까" (대시보드·폼·랜딩 등). 스타일과 조합해서 씁니다.

## 🚀 사용법

1. `index.html`(카탈로그)을 열어 원하는 **스타일 번호**를 고릅니다.
2. 그 스타일 폴더의 `theme.css` + `showcase.html`을 복사해 시작점으로 씁니다.
3. `<link rel="stylesheet" href="theme.css">` 경로만 맞추면 끝.

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
