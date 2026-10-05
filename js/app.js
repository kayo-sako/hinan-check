/* =========================================================
   アプリ本体：状態管理・画面切り替え・イベント
   ========================================================= */
(function (H) {
  const SCREENS = {
    top: H.Top, damage: H.DamageQuestion, route: H.RouteSelect,
    problems: H.ProblemList, check: H.Checklist, result: H.Result, hints: H.Hints,
  };
  const PREV = { damage: 'top', route: 'damage', problems: 'route', check: 'problems', result: 'check', hints: 'result' };

  const initial = () => ({ step: 'top', damaged: null, route: null, confirmed: [], open: null, checks: {}, showDetail: false, qr: false });

  // 途中経過をこのブラウザに保存（使えない環境でも動作します）
  const load = () => {
    try { const s = JSON.parse(localStorage.getItem(H.config.STORAGE_KEY)); if (s && SCREENS[s.step]) return { ...initial(), ...s, qr: false }; } catch (e) { /* 無視 */ }
    return initial();
  };
  const save = () => { try { localStorage.setItem(H.config.STORAGE_KEY, JSON.stringify({ ...state, qr: false })); } catch (e) { /* 無視 */ } };

  let state = load();
  const $ = (sel) => document.querySelector(sel);

  function render(scroll = false) {
    $('#header').innerHTML = H.Header();
    $('#screen').innerHTML = SCREENS[state.step](state);
    $('#side').innerHTML = H.SidePanel(state);
    $('#footer').innerHTML = H.Footer();
    $('#modal').innerHTML = state.qr ? H.QrModal() : '';
    document.body.style.overflow = state.qr ? 'hidden' : '';
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    save();
  }
  const go = (step) => { state.step = step; state.open = null; state.showDetail = false; render(true); };

  const actions = {
    start: () => go('damage'),
    home: () => { state = { ...initial() }; render(true); },
    restart: () => { state = { ...initial(), step: 'damage' }; render(true); },
    back: () => go(PREV[state.step] || 'top'),
    damage: (el) => {
      state.damaged = el.dataset.value;
      if (state.damaged === 'yes' && state.route === 'home') state.route = null;
      go('route');
    },
    route: (el) => {
      if (state.route !== el.dataset.value) state.confirmed = [];
      state.route = el.dataset.value; go('problems');
    },
    toggle: (el) => {
      const i = +el.dataset.value; state.open = state.open === i ? null : i; render();
      if (state.open !== null) document.querySelector(`[data-action="toggle"][data-value="${i}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },
    confirm: (el) => {
      const i = +el.dataset.value;
      if (!state.confirmed.includes(i)) {
        state.confirmed.push(i);
        const nextI = [...Array(10).keys()].find((k) => k > i && !state.confirmed.includes(k));
        state.open = nextI ?? null;
      } else state.open = null;
      render();
      if (state.open !== null) document.querySelector(`[data-action="toggle"][data-value="${state.open}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    next: () => go(state.step === 'problems' ? 'check' : 'result'),
    check: (el) => { state.checks[el.dataset.id] = el.dataset.value; render(); },
    detail: () => { state.showDetail = !state.showDetail; render(); },
    goProblems: () => go('problems'),
    hints: () => go('hints'),
    qr: () => { state.qr = true; render(); },
    closeQr: () => { state.qr = false; render(); },
    copyUrl: () => {
      const input = $('#qr-url'); const msg = $('#copy-msg');
      const done = (t) => { if (msg) msg.textContent = t; };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(input.value).then(() => done('コピーしました'), () => { input.select(); done('選択しました。長押しでコピーしてください'); });
      } else { input.select(); done('選択しました。長押しでコピーしてください'); }
    },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.qr) actions.closeQr(); });

  render();
})(window.Hinan);
