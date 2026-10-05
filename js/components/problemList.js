/* =========================================================
   ④ 起こりうる問題の確認（ルート別：①避難所 ②自宅 ③車・知人宅）
   各問題をタップすると対処方法（資料の本文）を表示
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  H.ProblemList = function (state) {
    const route = H.routes.find((r) => r.id === state.route);
    const data = H.problemData[state.route];
    const c = route.color;
    const done = state.confirmed.length;

    const item = (p, i) => {
      const open = state.open === i;
      const ok = state.confirmed.includes(i);
      return `
      <li class="rounded-xl border ${open ? `border-${c}/60` : 'border-line'} bg-surface overflow-hidden">
        <button type="button" data-action="toggle" data-value="${i}" aria-expanded="${open}" aria-controls="ans-${i}"
          class="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-${c}/5">
          <span class="relative grid place-items-center w-9 h-9 rounded-lg bg-${c}/10 text-${c}">
            ${H.icon(H.iconForProblem(p.q), 'w-5 h-5')}
            ${ok ? `<span class="absolute -right-1 -bottom-1 grid place-items-center w-4 h-4 rounded-full bg-home text-white">${H.icon('check', 'w-3 h-3')}</span>` : ''}
          </span>
          <span class="min-w-0 flex-1 text-[0.93rem] font-medium leading-snug">
            <span class="num text-${c} font-bold mr-1">${'①②③④⑤⑥⑦⑧⑨⑩'[i]}</span>${H.esc(p.q)}
          </span>
          ${H.icon('down', `w-5 h-5 text-muted transition-transform ${open ? 'rotate-180' : ''}`)}
        </button>
        ${open ? `
        <div id="ans-${i}" class="answer-in border-t border-line bg-${c}/[0.04] px-4 py-4">
          <p class="text-xs font-bold text-${c} mb-2 tracking-wider">対処方法</p>
          <div class="grid gap-3 text-[0.92rem] text-ink/90">${H.ui.richText(p.a)}</div>
          <button type="button" data-action="confirm" data-value="${i}"
            class="btn-press mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold
            ${ok ? 'bg-home/15 text-home' : `bg-${c} text-white`}">
            ${H.icon('check', 'w-4 h-4')}${ok ? '確認しました' : '確認した・次の項目へ'}
          </button>
        </div>` : ''}
      </li>`;
    };

    return `
    <section class="screen-in">
      ${H.ui.progress(3)}
      <div class="rounded-2xl bg-${c} text-white px-4 py-3 flex items-center gap-3">
        ${H.icon(route.icon, 'w-7 h-7')}
        <h2 class="font-display font-bold text-lg leading-snug">${route.no} ${route.name}場合</h2>
      </div>

      <div class="mt-3 rounded-2xl border border-${c}/30 bg-${c}/5 px-4 py-3.5">
        <p class="text-xs font-bold text-${c} tracking-wider mb-1">${H.esc(data.heading)}</p>
        <div class="text-sm leading-relaxed text-ink/90">${H.ui.richText(data.intro)}</div>
      </div>

      <div class="mt-5 flex items-end justify-between gap-2">
        <h3 class="font-display font-bold text-lg">起こりうる問題を確認しましょう</h3>
        <span class="num shrink-0 text-sm text-muted"><b class="text-${c} text-base">${done}</b> / 10 確認</span>
      </div>
      <p class="text-xs text-muted mt-0.5">項目をタップすると対処方法が表示されます</p>

      <ol class="mt-3 grid gap-2">${data.problems.map(item).join('')}</ol>

      <div class="mt-6 grid gap-3">
        ${H.ui.primary('次へ進む（備えのチェック）', 'next', { color: c })}
        <div>${H.ui.back()}</div>
      </div>
    </section>`;
  };
})(window.Hinan);
