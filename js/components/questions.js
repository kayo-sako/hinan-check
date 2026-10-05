/* =========================================================
   ② 分岐質問（自宅の状況） / ③ 避難先の選択
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  /* ② 自宅に大きな損壊はあるか */
  H.DamageQuestion = function (state) {
    const opt = (val, label, sub, color, icon) => {
      const on = state.damaged === val;
      return `<button type="button" data-action="damage" data-value="${val}" aria-pressed="${on}"
        class="btn-press w-full flex items-center gap-3 text-left rounded-2xl border-2 px-4 py-4
        ${on ? `border-${color} bg-${color}/10` : `border-${color}/30 bg-${color}/5 hover:border-${color}/60`}">
        <span class="grid place-items-center w-11 h-11 rounded-xl bg-surface text-${color} border border-${color}/30">${H.icon(icon, 'w-6 h-6')}</span>
        <span class="min-w-0 flex-1">
          <span class="block font-display font-bold text-${color} text-[1.05rem]">${label}</span>
          <span class="block text-xs text-muted mt-0.5">${sub}</span>
        </span>
        ${H.icon('right', `w-5 h-5 text-${color}`)}
      </button>`;
    };

    return `
    <section class="screen-in">
      ${H.ui.progress(1)}
      <h2 class="font-display font-bold text-xl sm:text-2xl text-center" style="text-wrap:balance">自宅に大きな損壊はありますか？</h2>
      <p class="text-center text-sm text-muted mt-1">（倒壊・大きな破損・浸水など）</p>

      <div class="my-5 mx-auto max-w-[260px] text-muted">
        <svg viewBox="0 0 200 130" class="w-full h-auto" role="img" aria-label="損壊した家のイラスト">
          <rect x="0" y="112" width="200" height="18" rx="2" fill="rgb(var(--line))"/>
          <path d="M40 112V62l10-2 6 10 8-4 6 6V112Z" fill="rgb(var(--surface))" stroke="rgb(var(--ink)/0.75)" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M120 112V64h40v48Z" fill="rgb(var(--surface))" stroke="rgb(var(--ink)/0.75)" stroke-width="2.5"/>
          <path d="M28 66 L98 22 L172 66" fill="none" stroke="rgb(var(--shelter))" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M98 22 L108 40 L96 50 L110 62" fill="none" stroke="rgb(var(--ink)/0.75)" stroke-width="2.5" stroke-linecap="round"/>
          <rect x="132" y="76" width="16" height="14" fill="rgb(var(--car)/0.2)" stroke="rgb(var(--ink)/0.75)" stroke-width="2"/>
          <path d="M132 76l16 14" stroke="rgb(var(--ink)/0.75)" stroke-width="1.5"/>
          <rect x="74" y="84" width="20" height="28" fill="rgb(var(--ink)/0.65)"/>
          <g fill="rgb(var(--muted))"><circle cx="22" cy="108" r="6"/><circle cx="34" cy="110" r="4"/><circle cx="172" cy="108" r="5"/><rect x="178" y="102" width="12" height="8" rx="2"/></g>
          <path d="M0 120c20-5 30 5 50 0s30-5 50 0 30 5 50 0 30-5 50 0" fill="none" stroke="rgb(var(--car)/0.6)" stroke-width="3"/>
        </svg>
      </div>

      <div class="grid gap-3">
        ${opt('yes', 'はい、大きな損壊がある', '自宅にとどまるのは危険です。避難先を選びましょう', 'shelter', 'houseBroken')}
        ${opt('no', 'いいえ、ほとんど損壊はない', '自宅で待機することも選べます', 'home', 'house')}
      </div>
      <div class="mt-6">${H.ui.back()}</div>
    </section>`;
  };

  /* ③ 避難先の選択 */
  H.RouteSelect = function (state) {
    const damaged = state.damaged === 'yes';
    const card = (r) => {
      const disabled = damaged && r.id === 'home';
      const on = state.route === r.id;
      return `<button type="button" data-action="route" data-value="${r.id}" ${disabled ? 'disabled aria-disabled="true"' : ''} aria-pressed="${on}"
        class="btn-press w-full flex items-center gap-4 text-left rounded-2xl border-2 px-4 py-4
        ${disabled ? 'border-line bg-bg opacity-60 cursor-not-allowed' : on ? `border-${r.color} bg-${r.color}/10` : `border-${r.color}/30 bg-${r.color}/5 hover:border-${r.color}/60`}">
        <span class="grid place-items-center w-14 h-14 rounded-2xl bg-surface border border-${r.color}/30 text-${r.color}">${H.icon(r.icon, 'w-8 h-8')}</span>
        <span class="min-w-0 flex-1">
          <span class="block font-display font-bold text-${r.color} leading-snug">${r.no} ${r.name}</span>
          <span class="block text-xs text-muted mt-1 leading-relaxed">${disabled ? '自宅に大きな損壊があるため選べません。安全な場所へ避難しましょう。' : r.desc}</span>
        </span>
        ${disabled ? '' : H.icon('right', `w-5 h-5 text-${r.color}`)}
      </button>`;
    };

    return `
    <section class="screen-in">
      ${H.ui.progress(2)}
      <h2 class="font-display font-bold text-xl sm:text-2xl text-center" style="text-wrap:balance">あなたの災害時に避難する場所は？</h2>
      <p class="text-center text-sm text-muted mt-1">（または、どこで過ごしたいですか？）</p>
      ${damaged ? `<p class="mt-4 flex gap-2 rounded-xl bg-shelter/10 text-shelter px-3 py-2.5 text-sm font-medium">
        ${H.icon('alert', 'w-5 h-5 mt-0.5')}<span>倒壊の恐れがある建物には絶対に入らないでください。</span></p>` : ''}
      <div class="grid gap-3 mt-5">${H.routes.map(card).join('')}</div>
      <div class="mt-6">${H.ui.back()}</div>
    </section>`;
  };
})(window.Hinan);
