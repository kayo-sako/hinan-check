/* =========================================================
   計測コンポーネント
   1) Googleアナリティクス（GA4）：利用者数・画面ごとの到達数
   2) 結果の記録：結果画面に着いたとき、回答内容を1回だけ
      Google スプレッドシート（Apps Script）へ送信
   どちらも js/config.js の GA_ID / RESULT_ENDPOINT が空なら何もしません。
   名前・住所など個人を特定できる情報は送りません。
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  const cfg = H.config;

  /* ---------- 1) GA4 ---------- */
  const gaOn = /^G-[A-Z0-9]+$/.test(cfg.GA_ID || '');
  if (gaOn) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.GA_ID);
  }
  const ga = (name, params) => { if (gaOn && window.gtag) window.gtag('event', name, params || {}); };

  const STEP_NAMES = {
    top: '01_トップ', damage: '02_自宅の状況', route: '03_避難先の選択', problems: '04_問題点の確認',
    check: '05_備えのチェック', result: '06_結果', hints: '07_備えのヒント',
  };
  let lastStep = null;

  /* 画面が切り替わったときに呼ぶ */
  H.trackStep = function (state) {
    if (state.step === lastStep) return;
    lastStep = state.step;
    ga('step_view', { step: STEP_NAMES[state.step] || state.step });
  };

  /* ---------- 2) 結果の記録 ---------- */
  const SYM = { ok: '○', mid: '△', ng: '×' };

  H.buildResult = function (state) {
    const route = H.routes.find((r) => r.id === state.route);
    const s = H.calcScore(state);
    const row = {
      runId: state.runId,
      damaged: state.damaged === 'yes' ? 'あり' : 'なし',
      route: route ? route.short : '',
      confirmed: state.confirmed.length,
      score: s.total,
      device: window.matchMedia('(max-width: 767px)').matches ? 'スマホ' : 'PC・タブレット',
    };
    H.checklist.forEach((it) => { row[it.id] = SYM[state.checks[it.id]] || ''; });
    return row;
  };

  /* 結果画面に着いたときに呼ぶ。同じ回答IDでは1回だけ送る */
  H.sendResult = function (state) {
    if (!state.runId || state.sentRunId === state.runId) return false;
    const row = H.buildResult(state);
    ga('result_complete', {
      route: row.route, damaged: row.damaged, score: row.score, confirmed: row.confirmed,
    });
    if (/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{10,}\/exec$/.test(cfg.RESULT_ENDPOINT || '')) {
      try {
        // text/plain で送ると事前確認（CORS）なしで Apps Script に届きます
        fetch(cfg.RESULT_ENDPOINT, {
          method: 'POST', mode: 'no-cors', keepalive: true,
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(row),
        }).catch(() => {});
      } catch (e) { /* 送信できなくても画面の動作は続ける */ }
    }
    return true;
  };

  H.newRunId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
})(window.Hinan);
