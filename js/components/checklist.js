/* =========================================================
   ⑤ 備えのチェックリスト（共通）  ○：できている △：少し不安 ×：できていない
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  H.Checklist = function (state) {
    const answered = H.checklist.filter((it) => state.checks[it.id]).length;
    const left = H.checklist.length - answered;

    const row = (it) => `
      <li class="flex items-center gap-3 py-3 px-3 sm:px-4">
        <span class="grid place-items-center w-9 h-9 rounded-lg bg-bg text-muted">${H.icon(it.icon, 'w-5 h-5')}</span>
        <span class="min-w-0 flex-1 text-[0.93rem] font-medium">${it.label}</span>
        <span class="flex gap-1.5" role="radiogroup" aria-label="${it.label}">
          ${H.marks.map((m) => {
            const on = state.checks[it.id] === m.v;
            return `<button type="button" role="radio" aria-checked="${on}" aria-label="${m.label}" title="${m.label}"
              data-action="check" data-id="${it.id}" data-value="${m.v}"
              class="btn-press grid place-items-center w-10 h-10 rounded-full border-2 font-bold text-lg leading-none
              ${on ? `bg-${m.color} border-${m.color} text-white` : `border-${m.color}/45 text-${m.color} bg-surface hover:bg-${m.color}/10`}">${m.sym}</button>`;
          }).join('')}
        </span>
      </li>`;

    return `
    <section class="screen-in">
      ${H.ui.progress(4)}
      <h2 class="font-display font-bold text-xl sm:text-2xl text-center" style="text-wrap:balance">それぞれの項目について、<br>あなたの備えはできていますか？</h2>
      <div class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted">
        ${H.marks.map((m) => `<span><b class="text-${m.color} text-sm">${m.sym}</b>：${m.label}</span>`).join('')}
      </div>
      <ul class="mt-4 rounded-2xl border border-line bg-surface divide-y divide-line">${H.checklist.map(row).join('')}</ul>
      <p class="mt-3 text-center text-sm ${left ? 'text-muted' : 'text-home font-bold'}">
        ${left ? `あと <b class="num text-ink">${left}</b> 項目` : 'すべて回答しました'}
      </p>
      <div class="mt-4 flex items-center justify-between gap-3">
        ${H.ui.back()}
        <div class="w-44">${H.ui.primary('結果を見る', 'next', { disabled: left > 0 })}</div>
      </div>
    </section>`;
  };
})(window.Hinan);
