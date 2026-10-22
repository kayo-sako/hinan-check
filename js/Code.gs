/**
 * 災害時 避難方法チェック － 結果の記録・集計用 Google Apps Script
 *
 * 使い方
 *  1. 新しい Google スプレッドシートを作り、「拡張機能」→「Apps Script」を開く
 *  2. このファイルの中身をすべて貼り付けて保存
 *  3. 関数「setup」を選んで「実行」（初回のみ権限の許可が必要）
 *     → 「回答」「集計」シートとグラフが作られます
 *  4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *     実行ユーザー：自分 ／ アクセスできるユーザー：全員 → デプロイ
 *  5. 表示された「ウェブアプリのURL」（…/exec）を js/config.js の RESULT_ENDPOINT に貼る
 */

const ANSWER_SHEET = '回答';
const SUMMARY_SHEET = '集計';

const ROUTES = ['指定避難所', '自宅待機', '車・倉庫・知人宅'];
const ITEMS = [
  ['water', '水'], ['food', '食料'], ['toilet', 'トイレ'], ['power', '電気・明かり'],
  ['info', '情報・通信'], ['hygiene', '衛生・健康'], ['climate', '防寒・暑さ'], ['other', '貴重品・その他'],
];
const HEADERS = ['日時', '回答ID', '自宅の損壊', '避難方法', '問題点の確認数']
  .concat(ITEMS.map(function (it) { return it[1]; }))
  .concat(['スコア', '端末']);

/* ---------- サイトから結果を受け取る ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse(e.postData.contents);
    var row = toRow_(d);
    if (!row) return text_('invalid');

    var sh = SpreadsheetApp.getActive().getSheetByName(ANSWER_SHEET);
    // 同じ回答IDの二重送信は記録しない（直近500件を確認）
    var last = sh.getLastRow();
    if (last > 1) {
      var from = Math.max(2, last - 499);
      var ids = sh.getRange(from, 2, last - from + 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (ids[i][0] === row[1]) return text_('duplicate');
    }
    sh.appendRow(row);
    return text_('ok');
  } catch (err) {
    return text_('error');
  } finally {
    lock.releaseLock();
  }
}

/* 動作確認用（ブラウザでウェブアプリURLを開くと表示） */
function doGet() {
  return text_('災害時 避難方法チェック：記録用URLは正しく動いています');
}

/* 受け取った値を決まった選択肢だけに絞って1行にする（不正な値・数式は記録しない） */
function toRow_(d) {
  var pick = function (v, list) { return list.indexOf(v) >= 0 ? v : null; };
  var num = function (v, max) { v = Number(v); return (isFinite(v) && v >= 0 && v <= max) ? Math.round(v) : null; };

  var runId = String(d.runId || '');
  if (!/^[a-z0-9]{6,20}$/.test(runId)) return null;
  var damaged = pick(d.damaged, ['あり', 'なし']);
  var route = pick(d.route, ROUTES);
  var confirmed = num(d.confirmed, 10);
  var score = num(d.score, 10);
  if (!damaged || !route || confirmed === null || score === null) return null;
  var marks = ITEMS.map(function (it) { return pick(d[it[0]], ['○', '△', '×']) || ''; });
  var device = pick(d.device, ['スマホ', 'PC・タブレット']) || '';

  return [new Date(), runId, damaged, route, confirmed].concat(marks).concat([score, device]);
}

function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }

/* ---------- 初回セットアップ：シート・集計式・グラフを作る ---------- */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone('Asia/Tokyo');

  // 回答シート
  var a = ss.getSheetByName(ANSWER_SHEET) || ss.insertSheet(ANSWER_SHEET, 0);
  a.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#1E854A').setFontColor('#FFFFFF');
  a.setFrozenRows(1);
  a.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm');
  a.setColumnWidth(1, 140);

  // 集計シート（作り直し）
  var old = ss.getSheetByName(SUMMARY_SHEET);
  if (old) ss.deleteSheet(old);
  var s = ss.insertSheet(SUMMARY_SHEET, 1);
  var A = "'" + ANSWER_SHEET + "'!";
  var col = function (n) { return String.fromCharCode(64 + n); }; // 1→A
  var scoreCol = col(HEADERS.length - 1); // スコア列
  var head = function (r, c, vals) {
    s.getRange(r, c, 1, vals.length).setValues([vals]).setFontWeight('bold').setBackground('#E7F2EA');
  };

  s.getRange('A1').setValue('災害時 避難方法チェック 集計').setFontSize(14).setFontWeight('bold');

  // 概要
  head(3, 1, ['項目', '値']);
  s.getRange('A4:A6').setValues([['回答数'], ['平均スコア（10点満点）'], ['問題点の平均確認数（10項目中）']]);
  s.getRange('B4').setFormula('=COUNTA(' + A + 'B2:B)');
  s.getRange('B5').setFormula('=IFERROR(ROUND(AVERAGE(' + A + scoreCol + '2:' + scoreCol + '),1),"-")');
  s.getRange('B6').setFormula('=IFERROR(ROUND(AVERAGE(' + A + 'E2:E),1),"-")');

  // 避難方法別
  head(8, 1, ['避難方法', '人数', '割合', '平均スコア']);
  ROUTES.forEach(function (r, i) {
    var row = 9 + i;
    s.getRange(row, 1).setValue(r);
    s.getRange(row, 2).setFormula('=COUNTIF(' + A + 'D2:D,A' + row + ')');
    s.getRange(row, 3).setFormula('=IFERROR(B' + row + '/$B$4,0)');
    s.getRange(row, 4).setFormula('=IFERROR(ROUND(AVERAGEIF(' + A + 'D2:D,A' + row + ',' + A + scoreCol + '2:' + scoreCol + '),1),"-")');
  });
  s.getRange('C9:C11').setNumberFormat('0%');

  // 自宅の損壊
  head(13, 1, ['自宅の損壊', '人数', '割合']);
  ['あり', 'なし'].forEach(function (v, i) {
    var row = 14 + i;
    s.getRange(row, 1).setValue(v);
    s.getRange(row, 2).setFormula('=COUNTIF(' + A + 'C2:C,A' + row + ')');
    s.getRange(row, 3).setFormula('=IFERROR(B' + row + '/$B$4,0)');
  });
  s.getRange('C14:C15').setNumberFormat('0%');

  // 備え別（○△×）
  head(17, 1, ['備え', '○ できている', '△ 少し不安', '× できていない', '×の割合']);
  ITEMS.forEach(function (it, i) {
    var row = 18 + i, c = col(6 + i); // 回答シートの F列〜M列
    s.getRange(row, 1).setValue(it[1]);
    s.getRange(row, 2).setFormula('=COUNTIF(' + A + c + '2:' + c + ',"○")');
    s.getRange(row, 3).setFormula('=COUNTIF(' + A + c + '2:' + c + ',"△")');
    s.getRange(row, 4).setFormula('=COUNTIF(' + A + c + '2:' + c + ',"×")');
    s.getRange(row, 5).setFormula('=IFERROR(D' + row + '/SUM(B' + row + ':D' + row + '),0)');
  });
  s.getRange('E18:E25').setNumberFormat('0%');

  // スコア分布
  head(27, 1, ['スコア', '人数']);
  for (var p = 0; p <= 10; p++) {
    var row = 28 + p;
    s.getRange(row, 1).setValue(p);
    s.getRange(row, 2).setFormula('=COUNTIF(' + A + scoreCol + '2:' + scoreCol + ',A' + row + ')');
  }

  // 日別の回答数
  head(3, 7, ['日付', '回答数']);
  s.getRange('G4').setFormula('=IFERROR(QUERY(' + A + 'A2:B,"select toDate(A), count(B) where A is not null group by toDate(A) order by toDate(A) desc label toDate(A) \'\', count(B) \'\'",0),"まだ回答はありません")');
  s.getRange('G4:G').setNumberFormat('yyyy/mm/dd');

  s.setColumnWidth(1, 210);
  s.setColumnWidths(2, 4, 110);
  s.setColumnWidth(7, 110);

  // グラフ
  var chart = function (type, range, title, r, c, opts) {
    var b = s.newChart().setChartType(type).addRange(s.getRange(range))
      .setPosition(r, c, 0, 0).setOption('title', title).setOption('width', 460).setOption('height', 280);
    Object.keys(opts || {}).forEach(function (k) { b = b.setOption(k, opts[k]); });
    s.insertChart(b.build());
  };
  chart(Charts.ChartType.PIE, 'A8:B11', '避難方法の割合', 3, 10, { colors: ['#CD3848', '#1E854A', '#2457B5'] });
  chart(Charts.ChartType.BAR, 'A17:D25', '備えのチェック結果', 19, 10, { isStacked: true, colors: ['#1E854A', '#D6920E', '#CD3848'] });
  chart(Charts.ChartType.COLUMN, 'A27:B38', 'スコア分布', 35, 10, { colors: ['#1E854A'], legend: { position: 'none' } });

  ss.setActiveSheet(s);
}

/* テスト用：ダミー回答を1件追加（動作確認後は回答シートの行を削除してください） */
function addTestRow() {
  var sh = SpreadsheetApp.getActive().getSheetByName(ANSWER_SHEET);
  var row = toRow_({
    runId: 'test' + Date.now().toString(36), damaged: 'なし', route: '自宅待機', confirmed: 7, score: 6,
    water: '○', food: '○', toilet: '△', power: '×', info: '○', hygiene: '△', climate: '○', other: '△', device: 'スマホ',
  });
  sh.appendRow(row);
}
