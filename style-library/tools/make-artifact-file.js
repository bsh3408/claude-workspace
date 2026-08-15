// catalog-mobile.html(완전한 문서)에서 <style>와 <body> 내용만 뽑아
// Artifact 게시용 본문 파일을 만든다. (Artifact는 문서 껍데기를 자동으로 감싸므로)
// 사용법: node tools/make-artifact-file.js [출력경로]
//   기본 출력: ./catalog-artifact.html (style-library 폴더 안)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'catalog-mobile.html'), 'utf8');
const style = (src.match(/<style>[\s\S]*?<\/style>/) || [''])[0];
const body = (src.match(/<body>([\s\S]*)<\/body>/) || ['', ''])[1];
const out = process.argv[2] || path.join(ROOT, 'catalog-artifact.html');
fs.writeFileSync(out, style + '\n' + body);
console.log('WROTE', out, (fs.statSync(out).size / 1024 / 1024).toFixed(2) + 'MB');
