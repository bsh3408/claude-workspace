# 🔐 API 키 안전하게 쓰기 (세션 간 공유)

`claude-workspace`는 **공개 레포**입니다. **API 키를 파일/코드/커밋/채팅에 절대 넣지 마세요.**
노출되면 GitHub 스캐너에 잡히고 OpenAI가 키를 자동 폐기합니다.

## ✅ 권장: 환경 변수(시크릿)로 등록

Claude Code 웹(코드) 환경 설정에서 **환경 변수/시크릿**으로 등록하면,
그 환경의 **모든 세션**에서 코드가 `process.env.OPENAI_API_KEY` 로 바로 읽습니다. 레포엔 아무것도 안 남습니다.

1. claude.ai/code → 이 환경(Environment) 설정 열기
2. **Environment variables / Secrets** 에 추가:
   - 이름: `OPENAI_API_KEY`
   - 값: (본인 키)
3. 저장 → 이후 새 세션부터 자동 적용
   - 문서: https://code.claude.com/docs/en/claude-code-on-the-web

### 확인 (값은 출력하지 않기)
```bash
[ -n "$OPENAI_API_KEY" ] && echo "OPENAI_API_KEY: 설정됨" || echo "없음"
```

### 코드에서 쓰기 (키를 하드코딩하지 않음)
```js
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error("OPENAI_API_KEY 환경변수를 설정하세요");
// fetch("https://api.openai.com/v1/...", { headers: { Authorization: `Bearer ${key}` } })
```
```python
import os
key = os.environ["OPENAI_API_KEY"]  # 없으면 에러
```

## 🟡 차선: 로컬 `.env` (이 환경에서만)

`.env` 파일에 넣고 쓰되, `.gitignore`가 커밋을 막습니다(이미 설정됨). 다른 환경엔 공유되지 않습니다.
```
OPENAI_API_KEY=본인키
```

## ❌ 하지 말 것
- 소스/설정/마크다운에 키 붙여넣기, 커밋, PR, 채팅창 붙여넣기
- 이미 한 번이라도 커밋했다면 **그 키는 폐기하고 새로 발급**하세요 (히스토리에서 못 지움)
