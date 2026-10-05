/* =========================================================
   ⑦ まとめ・備えのヒント
   ×→△→○ の順に並べ、見直したい備えを先頭に表示
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  H.Hints = function (state) {
    const order = { ng: 0, mid: 1, ok: 2, undefined: 1 };
    const items = [...H.checklist].sort((a, b) => order[state.checks[a.id]] - order[state.checks[b.id]]);

    const card = (it) => {
      const m = H.marks.find((x) => x.v === state.checks[it.id]);
      const col = m ? m.color : 'brand';
      return `
      <li class="rounded-2xl border border-${col}/35 bg-${col}/5 p-4 flex gap-3">
        <span class="grid place-items-center w-11 h-11 rounded-xl bg-surface border border-${col}/30 text-${col}">${H.icon(it.icon, 'w-6 h-6')}</span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-display font-bold text-${col}">${it.label}</h3>
            ${m ? `<span class="shrink-0 rounded-full bg-${col} text-white text-xs font-bold px-2 py-0.5">${m.sym} ${m.label}</span>` : ''}
          </div>
          <p class="text-sm leading-relaxed text-ink/85 mt-1">${it.hint}</p>
        </div>
      </li>`;
    };

    return `
    <section class="screen-in">
      <h2 class="font-display font-black text-2xl text-center">備えのヒント</h2>
      <p class="text-center text-sm text-muted mt-1">見直したい項目から順に表示しています</p>

      <ul class="mt-5 grid gap-3 sm:grid-cols-2">${items.map(card).join('')}</ul>

      <div class="mt-6 rounded-2xl border border-warn/50 bg-sun p-4">
        <h3 class="font-display font-bold flex items-center gap-2">${H.icon('phone', 'w-5 h-5 text-brand')}安否確認・居場所の伝え方</h3>
        <dl class="mt-3 grid gap-3 text-sm leading-relaxed">
          <div class="flex gap-3"><dt class="num shrink-0 w-[4.5rem] font-black text-brand text-lg leading-none pt-0.5">171</dt>
            <dd>災害用伝言ダイヤル。局番無しの171に電話し、音声ガイダンスに従って録音（1伝言30秒まで）。</dd></div>
          <div class="flex gap-3"><dt class="num shrink-0 w-[4.5rem] font-black text-brand text-lg leading-none pt-0.5">web171</dt>
            <dd>災害用伝言板。インターネットから家族の電話番号を入力して登録（100文字以内）。</dd></div>
          <div class="flex gap-3"><dt class="shrink-0 w-[4.5rem] pt-0.5">${H.icon('flag', 'w-6 h-6 text-warn')}</dt>
            <dd><b>黄色い旗</b>：有田川町では、家族の無事が確認できたら玄関先に黄色い旗を立てて周囲に知らせます。旗が無い場合は区長さん・自主防災組織役員さんに相談を。</dd></div>
          <div class="flex gap-3"><dt class="shrink-0 w-[4.5rem] pt-0.5">${H.icon('users', 'w-6 h-6 text-brand')}</dt>
            <dd><b>自主防災組織</b>：地区の役員に自分の居場所を伝えておきましょう。地区ごとの避難行動も確認を。</dd></div>
        </dl>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        ${H.ui.outline('結果に戻る', 'back', { iconLeft: 'left' })}
        ${H.ui.primary('トップに戻る', 'home', { icon: '' })}
      </div>
    </section>`;
  };
})(window.Hinan);
