/**********************************************************************
 * STELLAR LAB · 통합과학2 게임형 수행평가 웹앱 (Google Apps Script 백엔드)
 * --------------------------------------------------------------------
 * · 화면(Index.html) + 백엔드 + DB(스프레드시트)를 한 프로젝트로 서비스
 * · 학생별 진행상황/답안이 선생님 스프레드시트에 자동 집계됩니다.
 *
 * ▶ 콘텐츠(미션·등급·상점)는 이 파일에서만 수정하세요. 화면은 자동 반영됩니다.
 **********************************************************************/

/* ===================== 교사 설정 ===================== */
var CFG = {
  APP_TITLE: 'STELLAR LAB · 통합과학2 연구실',
  STUDENT_SHEET: '학생진행',
  ANSWER_SHEET : '답안',
  SUMMARY_SHEET: '요약',
  LEADERBOARD_TOP: 10,      // 앱 내 랭킹 표시 인원
  SHOW_REAL_NAME_ON_BOARD: false // true면 랭킹에 실명, false면 '홍*동' 마스킹
};

/* ===================== 등급(레벨) ===================== */
var RANKS = [
  {lv:1, xp:0,   name:'견습 관찰자',   sym:'⬡'},
  {lv:2, xp:70,  name:'주니어 탐구자', sym:'⬢'},
  {lv:3, xp:160, name:'실험 연구원',   sym:'✦'},
  {lv:4, xp:280, name:'데이터 분석가', sym:'✧'},
  {lv:5, xp:400, name:'수석 연구원',   sym:'★'},
  {lv:6, xp:520, name:'통합과학 마스터', sym:'🏆'}
];

/* ===================== 영역 ===================== */
var AREAS = [
  {id:'a4', name:'Ⅳ. 변화와 다양성',    color:'#0d8f88', dark:'#35d0c0'},
  {id:'a5', name:'Ⅴ. 환경과 에너지',    color:'#c47d10', dark:'#f2b544'},
  {id:'a6', name:'Ⅵ. 과학과 미래 사회', color:'#6b52d6', dark:'#a595f7'}
];

/* ===================== 미션 =====================
 * min = 최소 글자수, xp/coin = 완료 보상. 여기만 고치면 됩니다. */
var MISSIONS = [
  {id:'m1', area:'a4', type:'자료 해석', xp:40, coin:40, min:120,
   title:'지질 시대와 생물 다양성',
   prompt:'고생대·중생대·신생대의 대표 표준화석과 대멸종 사건을 조사하고, 환경 변화가 생물 다양성에 어떤 영향을 주었는지 시대의 흐름에 따라 서술하세요.\n\n· 표준화석 예시를 시대별로 최소 1개씩 제시\n· 대멸종의 원인과 결과를 연결해 설명'},
  {id:'m2', area:'a4', type:'탐구 활동', xp:45, coin:45, min:120,
   title:'철의 부식과 산화·환원',
   prompt:'철 못이 녹스는 과정을 관찰(또는 자료 조사)하고, 이 변화를 \'전자의 이동\' 관점에서 산화·환원 반응으로 설명하세요.\n\n· 무엇이 산화되고 무엇이 환원되는지 명시\n· 부식을 늦추는 방법 1가지와 그 과학적 이유'},
  {id:'m3', area:'a4', type:'문제 해결', xp:45, coin:45, min:120,
   title:'산성화를 막는 중화 반응 설계',
   prompt:'산성비로 산성화된 토양이나 호수를 되살리는 방안을 중화 반응을 이용해 설계하세요.\n\n· 사용할 물질(염기)과 중화 반응식(말로 설명 가능)\n· 지나친 중화가 생태계에 줄 수 있는 문제도 함께 고려'},
  {id:'m4', area:'a4', type:'논술', xp:50, coin:50, min:150,
   title:'생물 다양성 보전 제안서',
   prompt:'생물 다양성이 감소하는 원인을 3가지 이상 분석하고, 우리 지역 또는 학교에서 실천할 수 있는 보전 방안을 제안하세요. 근거를 들어 설득력 있게 쓰세요.'},

  {id:'m5', area:'a5', type:'자료 해석', xp:40, coin:40, min:120,
   title:'기후 변화 그래프 읽기',
   prompt:'지구 평균 기온 변화와 대기 중 이산화 탄소 농도 그래프(교과서·기상청 자료)를 해석하고, 두 자료 사이의 관계와 기후 변화의 원인을 분석하세요.\n\n· 두 그래프의 공통된 경향 서술\n· 인간 활동과의 관련성 설명'},
  {id:'m6', area:'a5', type:'탐구 활동', xp:45, coin:45, min:120,
   title:'에너지 전환과 효율 추적',
   prompt:'하나의 에너지가 여러 형태로 전환되는 과정(예: 태양광 → 전기 → 빛·열)을 추적해 나타내고, 이 과정에서 \'에너지 효율\'이 왜 100%가 될 수 없는지 설명하세요.\n\n· 전환 과정을 화살표로 표현\n· 손실되는 에너지의 형태 언급'},
  {id:'m7', area:'a5', type:'설계·기획', xp:50, coin:50, min:150,
   title:'우리 학교 신재생에너지 제안서',
   prompt:'태양광·풍력·지열 등 신재생 에너지 중 하나를 골라 우리 학교에 도입하는 제안서를 작성하세요.\n\n· 선택한 에너지원과 그 이유\n· 기대 효과와 예상되는 한계(비용·입지 등)'},
  {id:'m8', area:'a5', type:'비교·토론', xp:45, coin:45, min:120,
   title:'발전 방식 장단점 비교',
   prompt:'화력·원자력·신재생 발전의 장단점을 에너지 효율·환경 영향·안전성 측면에서 비교하고, 우리 지역에 가장 적합한 발전 방식을 근거를 들어 주장하세요.'},

  {id:'m9', area:'a6', type:'조사·발표', xp:35, coin:35, min:100,
   title:'문명을 바꾼 과학기술',
   prompt:'인류 문명의 흐름을 바꾼 과학기술 사례(예: 전기, 반도체, 백신 등) 하나를 선택해 조사하고, 그것이 사회를 어떻게 변화시켰는지 발표 개요 형태로 정리하세요.'},
  {id:'m10', area:'a6', type:'비평·성찰', xp:50, coin:50, min:150,
   title:'미래 기술과 과학 윤리',
   prompt:'인공지능·유전자 편집·자율주행 중 하나를 골라, 그 기술이 주는 혜택과 위험을 함께 분석하고 \'과학 윤리\' 관점에서 우리가 지켜야 할 원칙을 제안하세요.'},
  {id:'m11', area:'a6', type:'프로젝트', xp:55, coin:55, min:150,
   title:'미래 사회 문제 해결 아이디어',
   prompt:'미래 사회가 마주할 문제(에너지·환경·고령화 등) 하나를 정하고, 과학기술(적정기술 포함)을 활용한 해결 아이디어를 기획하세요.\n\n· 문제 정의 → 아이디어 → 기대 효과의 흐름으로 작성'}
];

/* ===================== 상점(꾸미기) ===================== */
var SHOP = {
  avatar: [
    {id:'av_micro',   glyph:'🔬', nm:'현미경',     price:0},
    {id:'av_tube',    glyph:'🧪', nm:'시험관',     price:80},
    {id:'av_sat',     glyph:'🛰️', nm:'인공위성',   price:100},
    {id:'av_dna',     glyph:'🧬', nm:'DNA',        price:120},
    {id:'av_volcano', glyph:'🌋', nm:'화산',       price:120},
    {id:'av_tele',    glyph:'🔭', nm:'망원경',     price:150},
    {id:'av_atom',    glyph:'⚛️', nm:'원자',       price:180, lv:3},
    {id:'av_dino',    glyph:'🦖', nm:'공룡',       price:160}
  ],
  theme: [
    {id:'th_default',  glyph:'🩵', nm:'청록 (기본)', price:0,   skin:''},
    {id:'th_amethyst', glyph:'💜', nm:'자수정',      price:120, skin:'amethyst'},
    {id:'th_coral',    glyph:'🧡', nm:'산호',        price:120, skin:'coral'},
    {id:'th_lime',     glyph:'💚', nm:'라임',        price:150, skin:'lime'},
    {id:'th_rose',     glyph:'🌸', nm:'로즈',        price:220, skin:'rose', lv:4}
  ],
  title: [
    {id:'ti_curious', glyph:'🔎', nm:'호기심 대장', price:100},
    {id:'ti_earth',   glyph:'🌏', nm:'지구 지킴이', price:120},
    {id:'ti_exp',     glyph:'⚗️', nm:'실험의 달인', price:160, lv:3},
    {id:'ti_future',  glyph:'🚀', nm:'미래 설계자', price:220, lv:5}
  ]
};
var STARTER_AVATARS = ['🔬','🧪','🛰️','🧬','🔭'];

/* ==================================================================
 *  웹앱 진입점
 * ================================================================== */
function doGet(e) {
  var t = HtmlService.createTemplateFromFile('Index');
  t.CONFIG = JSON.stringify({
    appTitle: CFG.APP_TITLE,
    areas: AREAS, missions: MISSIONS, ranks: RANKS,
    shop: SHOP, starters: STARTER_AVATARS,
    leaderboardTop: CFG.LEADERBOARD_TOP
  });
  return t.evaluate()
    .setTitle(CFG.APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ==================================================================
 *  클라이언트 API (google.script.run 으로 호출)
 * ================================================================== */

/** 학생 진행 불러오기 (없으면 found:false) */
function loadProgress(id) {
  id = normId_(id);
  if (!id) return {found:false};
  var sh = getSheet_(CFG.STUDENT_SHEET);
  var row = findRow_(sh, id);
  if (row < 0) return {found:false};
  var json = sh.getRange(row, 9).getValue(); // STATE_JSON 열
  try {
    var state = JSON.parse(json);
    return {found:true, state:state};
  } catch (err) {
    return {found:false};
  }
}

/**
 * 진행 저장 (upsert). payload = JSON 문자열.
 * 성적 반영 XP/코인은 서버가 완료 미션 기준으로 재계산 → 브라우저 조작 방지.
 */
function saveProgress(payload) {
  var s;
  try { s = JSON.parse(payload); } catch (e) { return {ok:false, msg:'형식 오류'}; }
  var id = normId_(s.id);
  if (!id) return {ok:false, msg:'학번이 필요합니다'};
  var name = String(s.name || '').slice(0, 30);

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // --- 서버 권위 계산: 완료된 미션만 인정 ---
    var completed = (s.completed && typeof s.completed === 'object') ? s.completed : {};
    var earnedXp = 0, earnedCoin = 0, doneCount = 0;
    var answerRows = [];
    for (var i = 0; i < MISSIONS.length; i++) {
      var m = MISSIONS[i];
      var c = completed[m.id];
      if (c && c.response && String(c.response).trim().length >= m.min) {
        earnedXp += m.xp; earnedCoin += m.coin; doneCount++;
        answerRows.push([id, name, areaName_(m.area), m.id, m.title, m.type, m.xp,
                         String(c.response).trim(), new Date()]);
      }
    }
    var rank = rankFor_(earnedXp);

    // --- 학생진행 시트 upsert ---
    var sh = getSheet_(CFG.STUDENT_SHEET);
    var row = findRow_(sh, id);
    // 저장용 state(코인 잔액/보유/착용은 클라이언트 신뢰: 꾸미기 전용)
    var stateToStore = {
      id:id, name:name, xp:earnedXp, coin: clampCoin_(s.coin, earnedCoin),
      completed: completed, owned: (s.owned||{}), equipped: (s.equipped||{})
    };
    var values = [id, name, rank.lv, rank.name, earnedXp,
                  stateToStore.coin, doneCount, new Date(),
                  JSON.stringify(stateToStore)];
    if (row < 0) sh.appendRow(values);
    else sh.getRange(row, 1, 1, values.length).setValues([values]);

    // --- 답안 시트 동기화 (학번+미션ID upsert) ---
    syncAnswers_(id, answerRows);

    return {ok:true, savedAt:(new Date()).toISOString(),
            xp:earnedXp, coin:stateToStore.coin, level:rank.lv, rankName:rank.name,
            doneCount:doneCount};
  } finally {
    lock.releaseLock();
  }
}

/** 랭킹 (상위 N명) */
function getLeaderboard() {
  var sh = getSheet_(CFG.STUDENT_SHEET);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var data = sh.getRange(2, 1, last-1, 7).getValues(); // 학번,이름,레벨,등급명,XP,코인,완료수
  data.sort(function(a,b){ return (b[4]-a[4]) || (b[6]-a[6]); });
  var out = [];
  for (var i=0; i<data.length && i<CFG.LEADERBOARD_TOP; i++){
    var nm = String(data[i][1]||'');
    out.push({
      rank:i+1,
      name: CFG.SHOW_REAL_NAME_ON_BOARD ? nm : maskName_(nm),
      level:data[i][2], rankName:data[i][3], xp:data[i][4], done:data[i][6]
    });
  }
  return out;
}

/* ==================================================================
 *  교사용: 스프레드시트 메뉴
 * ================================================================== */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🛰️ STELLAR LAB')
    .addItem('📊 요약(랭킹) 새로고침', 'buildSummary')
    .addToUi();
}

/** 요약 시트: XP 내림차순 정렬된 학생 현황 */
function buildSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var src = getSheet_(CFG.STUDENT_SHEET);
  var last = src.getLastRow();
  var out = ss.getSheetByName(CFG.SUMMARY_SHEET) || ss.insertSheet(CFG.SUMMARY_SHEET);
  out.clear();
  var header = ['순위','학번','이름','레벨','등급','누적XP','완료미션','최근수정'];
  out.getRange(1,1,1,header.length).setValues([header])
     .setFontWeight('bold').setBackground('#12222a').setFontColor('#ffffff');
  if (last >= 2) {
    var d = src.getRange(2,1,last-1,8).getValues();
    d.sort(function(a,b){ return (b[4]-a[4]) || (b[6]-a[6]); });
    var rows = d.map(function(r,i){ return [i+1, r[0], r[1], r[2], r[3], r[4], r[6], r[7]]; });
    out.getRange(2,1,rows.length,header.length).setValues(rows);
  }
  out.autoResizeColumns(1, header.length);
  out.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('요약을 새로고침했습니다. (총 ' + Math.max(0,last-1) + '명)');
}

/* ==================================================================
 *  내부 헬퍼
 * ================================================================== */
function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (name === CFG.STUDENT_SHEET) {
      sh.appendRow(['학번','이름','레벨','등급','누적XP','코인','완료미션','최근수정','STATE_JSON']);
      sh.getRange(1,1,1,9).setFontWeight('bold');
      sh.getRange('A:A').setNumberFormat('@'); // 학번을 텍스트로 고정(선행 0/자동 숫자변환 방지)
      sh.setFrozenRows(1);
    } else if (name === CFG.ANSWER_SHEET) {
      sh.appendRow(['학번','이름','영역','미션ID','미션명','유형','배점XP','답안','제출시각']);
      sh.getRange(1,1,1,9).setFontWeight('bold');
      sh.getRange('A:A').setNumberFormat('@');
      sh.setFrozenRows(1);
    }
  }
  return sh;
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0;i<ids.length;i++){ if (String(ids[i][0]) === id) return i+2; }
  return -1;
}

/** 답안 시트: (학번,미션ID) 기준 upsert */
function syncAnswers_(id, answerRows) {
  var sh = getSheet_(CFG.ANSWER_SHEET);
  var last = sh.getLastRow();
  var index = {}; // "학번|미션ID" -> row
  if (last >= 2) {
    var keys = sh.getRange(2,1,last-1,4).getValues(); // 학번..미션ID
    for (var i=0;i<keys.length;i++){
      if (String(keys[i][0]) === id) index[id+'|'+keys[i][3]] = i+2;
    }
  }
  var appends = [];
  for (var j=0;j<answerRows.length;j++){
    var r = answerRows[j];
    var key = id+'|'+r[3];
    if (index[key]) sh.getRange(index[key],1,1,r.length).setValues([r]);
    else appends.push(r);
  }
  if (appends.length) sh.getRange(sh.getLastRow()+1,1,appends.length,appends[0].length).setValues(appends);
}

function rankFor_(xp) {
  var r = RANKS[0];
  for (var i=0;i<RANKS.length;i++){ if (xp >= RANKS[i].xp) r = RANKS[i]; }
  return r;
}
function areaName_(id){ for (var i=0;i<AREAS.length;i++){ if (AREAS[i].id===id) return AREAS[i].name; } return id; }
function normId_(id){ return String(id==null?'':id).trim().slice(0,30); }
function clampCoin_(coin, earned){
  coin = Number(coin);
  if (!isFinite(coin) || coin < 0) coin = earned; // 비정상 값이면 획득 코인으로 보정
  if (coin > earned + 5) coin = earned;           // 획득 이상 보유 불가(약간의 여유)
  return Math.round(coin);
}
function maskName_(nm){
  nm = String(nm);
  if (nm.length <= 1) return nm;
  if (nm.length === 2) return nm[0] + '*';
  return nm[0] + '*'.repeat(nm.length-2) + nm[nm.length-1];
}
