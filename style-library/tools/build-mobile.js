// 세션/경로에 무관하게 동작: 이 파일 위치(style-library/tools) 기준으로 ROOT를 계산
const fs = require('fs');
const path = require('path');
let chromium;
try { chromium = require('playwright').chromium; }
catch { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
const ROOT = path.resolve(__dirname, '..');            // = .../style-library
const OUT = path.join(ROOT, 'catalog-mobile.html');
// 크로미움 실행 파일 자동 탐색 (버전 폴더가 바뀌어도 동작)
function findChromium() {
  const base = '/opt/pw-browsers';
  try {
    const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-'));
    if (dir) { const p = path.join(base, dir, 'chrome-linux', 'chrome'); if (fs.existsSync(p)) return p; }
  } catch {}
  return undefined; // playwright 기본값 사용
}

const ENTRIES = [
  // section, dir, file, name, desc, chips, viewport
  ['styles','01 뉴 브루탈리즘','styles/01-brutalism/showcase.html','두꺼운 테두리·하드 그림자·쨍한 원색',['강렬','장난기'],1100,760],
  ['styles','02 에디토리얼','styles/02-editorial/showcase.html','세리프 헤드라인·헤어라인·흑백+포인트',['고급','절제'],1100,760],
  ['styles','03 레트로 터미널','styles/03-terminal/showcase.html','모노스페이스·네온·스캔라인 CRT',['테크','게임'],1100,760],
  ['styles','04 따뜻한 오가닉','styles/04-organic/showcase.html','흙빛·크림·세이지·부드러운 세리프',['따뜻','교육'],1100,760],
  ['styles','05 모던 SaaS','styles/05-saas/showcase.html','다크·보라 글로우·글래스 내비',['세련','스타트업'],1120,800],
  ['styles','06 미니멀 프로덕트','styles/06-apple/showcase.html','순백·초대형 타이포·넉넉한 여백',['미니멀','제품'],1120,820],
  ['styles','07 스트리밍 다크','styles/07-stream/showcase.html','사이드바+앨범 그리드+재생바',['미디어','앱'],1200,760],
  ['styles','08 핀테크/토스','styles/08-toss/showcase.html','순백·블루·폰 목업·큰 버튼',['금융','모바일'],1080,760],
  ['styles','09 소셜 피드','styles/09-social/showcase.html','폰 프레임·스토리·피드·하단탭',['소셜','모바일'],540,900],
  ['styles','10 게이미피케이션','styles/10-playful/showcase.html','쨍한 그린·3D 버튼·진행 경로',['학습','게임'],1000,820],
  ['frameworks','Bootstrap 5','frameworks/bootstrap/showcase.html','가장 널리 쓰는 표준·기업용',['표준','기업'],1200,820],
  ['frameworks','Bulma','frameworks/bulma/showcase.html','Flexbox 순수 CSS·깔끔 모던',['모던','CSS'],1200,820],
  ['frameworks','Pico.css','frameworks/pico/showcase.html','클래스 거의 없이 시맨틱·우아',['미니멀','시맨틱'],900,820],
  ['frameworks','NES.css','frameworks/nes/showcase.html','8비트 픽셀 아트 UI',['8비트','게임'],900,900],
  ['frameworks','98.css','frameworks/win98/showcase.html','Windows 98 재현·창·타이틀바',['레트로','향수'],1000,680],
  ['frameworks','Simple.css','frameworks/simple/showcase.html','클래스 0개·시맨틱 HTML만',['클래스리스','문서'],900,860],
  ['frameworks','Tailwind + DaisyUI','frameworks/daisyui/showcase.html','유틸리티+컴포넌트·테마 30종 (인기)',['인기','테마'],1200,1000],
  ['frameworks','Beer CSS','frameworks/beer/showcase.html','구글 머티리얼 디자인 3',['머티리얼','구글'],1100,1000],
  ['frameworks','Water.css','frameworks/water/showcase.html','클래스리스·자동 다크모드',['클래스리스','경량'],900,1000],
  ['frameworks','PaperCSS','frameworks/paper/showcase.html','손으로 그린 듯 삐뚤빼뚤·유쾌',['손그림','교육'],900,1000],
  ['frameworks','XP.css','frameworks/xp/showcase.html','Windows XP 재현',['레트로','윈도우'],1000,720],
  ['frameworks','7.css','frameworks/win7/showcase.html','Windows 7 Aero 글래스',['레트로','에어로'],900,640],
  ['frameworks','Sakura','frameworks/sakura/showcase.html','클래스 0개·단정한 글 페이지',['클래스리스','미니멀'],820,1000],
  ['frameworks','MVP.css','frameworks/mvp/showcase.html','클래스 0개·시맨틱만으로',['클래스리스','프로토타입'],1000,1000],
  ['frameworks','Spectre.css','frameworks/spectre/showcase.html','경량 컴포넌트 프레임워크',['경량','컴포넌트'],1100,1000],
  ['frameworks','Tachyons','frameworks/tachyons/showcase.html','원자적 유틸리티·Tailwind 원조',['유틸리티','원자적'],1100,1000],
  ['frameworks','Chota','frameworks/chota/showcase.html','단 ~3KB 마이크로 프레임워크',['초경량','마이크로'],1000,1000],
  ['frameworks','Pure.css','frameworks/pure/showcase.html','야후·모듈러 초경량(5.7KB)',['야후','경량'],1000,900],
  ['frameworks','UIkit','frameworks/uikit/showcase.html','세련된 컴포넌트·실무 인기',['세련','컴포넌트'],1100,1000],
  ['frameworks','Foundation','frameworks/foundation/showcase.html','엔터프라이즈급 반응형',['엔터프라이즈','견고'],1100,1000],
  ['frameworks','Milligram','frameworks/milligram/showcase.html','2KB 초미니멀',['미니멀','경량'],900,900],
  ['frameworks','Skeleton','frameworks/skeleton/showcase.html','고전 미니멀 12칼럼',['클래식','뼈대'],900,900],
  ['frameworks','Halfmoon','frameworks/halfmoon/showcase.html','부트스트랩5·세련된 다크모드',['다크','부트스트랩'],1000,900],
  ['frameworks','Primer CSS','frameworks/primer/showcase.html','GitHub 디자인 시스템',['깃허브','디자인시스템'],960,1000],
  ['frameworks','Open Props','frameworks/openprops/showcase.html','디자인 토큰(색·그림자·그라데이션)',['토큰','변수'],860,1000],
  ['animations','Animate.css','frameworks/animate/showcase.html','가장 유명한 CSS 애니메이션·눌러서 재생',['애니메이션','인기'],900,1000],
  ['animations','AOS (스크롤)','frameworks/aos/showcase.html','스크롤하면 부드럽게 등장',['애니메이션','스크롤'],900,900],
  ['templates','대시보드','templates/dashboard.html','사이드바+상단바+통계+표',['앱','구조'],1280,800],
  ['templates','랜딩','templates/landing.html','히어로+특징+가격+CTA',['소개','구조'],1200,820],
  ['templates','폼/입력','templates/form.html','로그인+설문+모달',['입력','구조'],820,900],
  ['templates','퀴즈','templates/quiz.html','문제 카드+진행바+결과',['교육','구조'],760,700],
  ['templates','학습지','templates/worksheet.html','머리글+표+서명란 (A4)',['교육','인쇄'],900,860],
  ['templates','게임/카드','templates/card-game.html','스탯 바+카드+좌우 선택',['게임','구조'],560,820],
];

function inlineCss(html, fileRelDir) {
  return html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
    const m = tag.match(/href=["']([^"']+)["']/);
    if (!m) return tag;
    const href = m[1];
    if (/^https?:/i.test(href)) return tag;
    const p = path.join(ROOT, fileRelDir, href);
    let css = fs.readFileSync(p, 'utf8');
    // 98.css: inline pixel fonts as data URIs
    if (/98\.css$/.test(href)) {
      const dir = path.dirname(p);
      for (const f of ['ms_sans_serif.woff2','ms_sans_serif_bold.woff2']) {
        const fp = path.join(dir, f);
        if (fs.existsSync(fp)) {
          const b64 = fs.readFileSync(fp).toString('base64');
          css = css.split('url(' + f + ')').join('url(data:font/woff2;base64,' + b64 + ')');
        }
      }
    }
    return '<style>\n' + css + '\n</style>';
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: findChromium() });
  const data = [];
  for (const [section, name, rel, desc, chips, vw, vh] of ENTRIES) {
    const fileRelDir = path.dirname(rel);
    let html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    html = inlineCss(html, fileRelDir);
    html = html.split('../../index.html').join('#').split('../index.html').join('#');
    // thumbnail
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    await page.goto('file://' + path.join(ROOT, rel), { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const buf = await page.screenshot({ type: 'jpeg', quality: 70 });
    await page.close();
    data.push({ section, name, desc, chips, thumb: 'data:image/jpeg;base64,' + buf.toString('base64'), doc: html });
    console.log('built', name);
  }
  await browser.close();

  const json = JSON.stringify(data).replace(/<\//g, '<\\/');
  const out = PAGE.replace('/*__DATA__*/', 'const DATA = ' + json + ';');
  fs.writeFileSync(OUT, out);
  console.log('WROTE', OUT, (fs.statSync(OUT).size/1024/1024).toFixed(2)+'MB');
})().catch(e => { console.error(e); process.exit(1); });

const PAGE = `<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>스타일 카탈로그 · 모바일</title>
<style>
:root{
  --bg:#0d0e12; --bg-2:#141620; --panel:#171a24; --line:#262a38;
  --text:#eceef4; --muted:#8b93a3; --hi:#e8c17a; --hi-2:#d9a94e;
  --sans:"Pretendard","Apple SD Gothic Neo","Malgun Gothic","Helvetica Neue",system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent}
html,body{background:var(--bg)}
body{font-family:var(--sans);color:var(--text);line-height:1.6;
  background-image:radial-gradient(120% 60% at 50% -10%,rgba(232,193,122,.10),transparent 55%);
  padding:0 0 env(safe-area-inset-bottom);-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin-inline:auto;padding:22px 16px 60px}
header{padding:8px 2px 6px}
.kick{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--hi);font-weight:700}
h1{font-size:clamp(1.7rem,7vw,2.4rem);letter-spacing:-.02em;margin:8px 0}
.sub{color:var(--muted);font-size:.95rem}
.tip{margin-top:14px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:.85rem;color:var(--muted)}
.tip b{color:var(--hi)}

.tabs{position:sticky;top:0;z-index:5;display:flex;gap:6px;padding:12px 0;margin-top:10px;overflow-x:auto;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;
  background:linear-gradient(var(--bg),var(--bg) 70%,transparent)}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:none;white-space:nowrap;text-align:center;padding:9px 15px;border-radius:999px;border:1px solid var(--line);
  background:var(--panel);color:var(--muted);font-weight:700;font-size:.82rem;cursor:pointer}
.tab.on{background:var(--hi);color:#1b1400;border-color:var(--hi)}

.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(max-width:460px){.grid{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;
  cursor:pointer;transition:transform .12s,border-color .12s;
  opacity:0;animation:rise .5s cubic-bezier(.2,.7,.2,1) forwards}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.card{opacity:1;animation:none}}
.card:active{transform:scale(.98)}
.card:hover{border-color:var(--hi)}
.thumb{aspect-ratio:16/10;overflow:hidden;background:#0c0e12;border-bottom:1px solid var(--line)}
.thumb img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.meta{padding:11px 13px 13px}
.meta h3{font-size:1rem;letter-spacing:-.01em}
.meta p{color:var(--muted);font-size:.8rem;margin-top:3px}
.chips{margin-top:9px;display:flex;gap:5px;flex-wrap:wrap}
.chip{font-size:.66rem;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:2px 8px}
.section-label{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:var(--hi);margin:26px 2px 12px}
footer{margin-top:34px;text-align:center;color:var(--muted);font-size:.8rem}

/* 전체화면 뷰어 */
.viewer{position:fixed;inset:0;z-index:50;background:var(--bg);display:flex;flex-direction:column;
  transform:translateY(100%);transition:transform .28s cubic-bezier(.4,0,.2,1);visibility:hidden}
.viewer.open{transform:translateY(0);visibility:visible}
.vbar{display:flex;align-items:center;gap:10px;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top));
  background:var(--bg-2);border-bottom:1px solid var(--line);flex:none}
.vback{background:var(--panel);border:1px solid var(--line);color:var(--text);font-family:inherit;
  font-weight:700;font-size:.9rem;padding:9px 14px;border-radius:10px;cursor:pointer}
.vtitle{font-weight:700;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.viewer iframe{flex:1;width:100%;border:0;background:#fff}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <p class="kick">Style Catalog · Mobile</p>
    <h1>디자인 카탈로그</h1>
    <p class="sub">카드를 눌러 실제 화면을 보세요. 스타일 10 · 라이브러리 25 · 애니메이션 2 · 템플릿 6.</p>
    <div class="tip">💡 마음에 드는 걸 고른 뒤 <b>"08번 톤으로 앱 만들어줘"</b> 또는 <b>"NES.css로 게임"</b> 처럼 알려주세요.</div>
  </header>

  <nav class="tabs">
    <div class="tab on" data-f="all">전체</div>
    <div class="tab" data-f="styles">스타일 10</div>
    <div class="tab" data-f="frameworks">라이브러리 25</div>
    <div class="tab" data-f="animations">애니메이션 2</div>
    <div class="tab" data-f="templates">템플릿 6</div>
  </nav>

  <div id="list"></div>
  <footer>style-library · claude-workspace</footer>
</div>

<div class="viewer" id="viewer">
  <div class="vbar">
    <button class="vback" id="vback">‹ 뒤로</button>
    <span class="vtitle" id="vtitle"></span>
  </div>
  <iframe id="vframe" sandbox="allow-scripts allow-popups" title="showcase"></iframe>
</div>

<script>
/*__DATA__*/
const LABELS = { styles:"손수 만든 스타일", frameworks:"설치한 실제 라이브러리", animations:"애니메이션 라이브러리", templates:"구조 템플릿" };
const list = document.getElementById('list');
const viewer = document.getElementById('viewer');
const vframe = document.getElementById('vframe');
const vtitle = document.getElementById('vtitle');
let filter = 'all';

function render(){
  const order = ['styles','frameworks','animations','templates'];
  let html = '';
  for (const sec of order){
    if (filter!=='all' && filter!==sec) continue;
    const items = DATA.filter(d=>d.section===sec);
    if (!items.length) continue;
    html += '<div class="section-label">'+LABELS[sec]+'</div><div class="grid">';
    let n = 0;
    for (const d of items){
      const i = DATA.indexOf(d);
      html += '<div class="card" style="animation-delay:'+((n++%4)*70)+'ms" data-i="'+i+'">'+
        '<div class="thumb"><img loading="lazy" src="'+d.thumb+'" alt="'+d.name+'"></div>'+
        '<div class="meta"><h3>'+d.name+'</h3><p>'+d.desc+'</p>'+
        '<div class="chips">'+d.chips.map(c=>'<span class="chip">'+c+'</span>').join('')+'</div></div></div>';
    }
    html += '</div>';
  }
  list.innerHTML = html;
}
function open(i){
  const d = DATA[i];
  vtitle.textContent = d.name;
  vframe.srcdoc = d.doc;
  viewer.classList.add('open');
  document.body.style.overflow='hidden';
  history.pushState({v:1},'');
}
function close(){
  viewer.classList.remove('open');
  document.body.style.overflow='';
  setTimeout(()=>{ vframe.srcdoc='about:blank'; }, 300);
}
list.addEventListener('click', e=>{
  const c = e.target.closest('.card'); if(!c) return;
  open(+c.dataset.i);
});
document.getElementById('vback').addEventListener('click', ()=>{ if(history.state&&history.state.v){history.back();}else{close();} });
window.addEventListener('popstate', ()=>{ if(viewer.classList.contains('open')) close(); });
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  t.classList.add('on'); filter=t.dataset.f; render();
}));
render();
</script>
</body>
</html>`;
