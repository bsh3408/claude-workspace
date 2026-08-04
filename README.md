# claude-workspace

폰↔데스크탑 공유 작업 공간. Claude Code로 데스크탑에서 작업하고 GitHub에 push하면,
claude.ai/code(폰)에서 이어서 작업할 수 있다.

## 동기화 방법
- 데스크탑: 작업 후 `git add -A && git commit -m "..." && git push`
- 폰: claude.ai/code 에서 이 레포 연결 → 작업 → 커밋
- 데스크탑 복귀 시: `git pull`
