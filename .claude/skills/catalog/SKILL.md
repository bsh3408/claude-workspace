---
name: catalog
description: 스타일/디자인 라이브러리 카탈로그를 폰에서 볼 수 있게 게시(펼치기)한다. 사용자가 "카탈로그 펼쳐봐", "카탈로그 열어줘", "카탈로그 보여줘", "스타일 카탈로그", "디자인 카탈로그 띄워줘", "라이브러리 카탈로그" 처럼 style-library 카탈로그를 보고 싶다고 할 때 사용한다. claude-workspace 레포의 style-library/catalog-mobile.html 을 Artifact로 게시해 링크를 준다.
---

# 카탈로그 펼치기 (catalog)

`bsh3408/claude-workspace` 레포의 **style-library** 카탈로그(스타일·디자인 라이브러리·애니메이션·템플릿 모음)를
폰에서 열 수 있는 단일 파일 Artifact로 게시하고 링크를 돌려준다.

## 실행 순서

1. **레포 확보**
   - 세션에 `bsh3408/claude-workspace` 가 없으면 `add_repo` 로 추가한 뒤 안내대로 clone 한다.
   - `style-library/catalog-mobile.html` 파일이 있는지 확인한다. (이 파일이 미리 빌드된 카탈로그다)

2. **게시용 본문 파일 생성** — 레포 루트에서:
   ```
   node style-library/tools/make-artifact-file.js /tmp/catalog-artifact.html
   ```
   (Artifact는 문서 껍데기를 자동으로 감싸므로 `<style>`+`<body>` 본문만 필요하다. 위 스크립트가 그걸 만들어 준다.)

3. **Artifact로 게시** — `Artifact` 툴 호출:
   - `file_path`: 방금 만든 `/tmp/catalog-artifact.html`
   - `url`: `https://claude.ai/code/artifact/a509798a-742f-4f60-a548-6ee894da2e42`
     (이 URL을 넘겨 **같은 링크로 갱신**한다. 링크가 유지돼야 사용자가 늘 같은 주소로 연다.)
   - `title`: `디자인 카탈로그 (모바일)`
   - `description`: `스타일 · 라이브러리 · 애니메이션 · 템플릿을 폰에서 넘겨보고 카드를 눌러 실제 화면까지 확인하는 카탈로그`
   - `favicon`: `🎨`

4. **응답** — 게시된 링크를 크게 안내하고, 한 줄 요약(현재 항목 수)을 덧붙인다.
   항목 수는 `style-library/index.html` 의 STYLES/FRAMEWORKS/ANIM 배열 길이나 README로 확인할 수 있다.

## 참고

- **카드를 눌러 실제 화면**까지 보이는 자체 완결(오프라인) 단일 파일이다.
- 새 라이브러리/스타일을 추가한 뒤 **다시 빌드**해야 최신 내용이 반영된다:
  ```
  node style-library/tools/build-mobile.js
  ```
  (playwright 필요. 각 쇼케이스 썸네일을 다시 캡처해 `catalog-mobile.html` 을 갱신한다.)
  빌드가 불가능한 세션이면, 이미 커밋된 `catalog-mobile.html` 을 그대로 게시하면 된다(2~3단계만).
- Artifact는 기본 **비공개**다. 공유하려면 사용자가 아티팩트 페이지의 공유 메뉴에서 링크를 열면 된다.
