/* =========================================================
   ⑥ 結果画面（避難方法・備えのスコア・詳細）
   スコア(10点満点) = 備えチェック 7点分 + 問題点の確認 3点分
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  H.calcScore = function (state) {
    const max = H.checklist.length * 2;
    const pts = H.checklist.reduce((s, it) => s + (H.marks.find((m) => m.v === state.checks[it.id])?.pts ?? 0), 0);
    const prep = (pts / max) * 7;
    const conf = (state.confirmed.length / 10) * 3;
    return { total: Math.round(prep + conf), prep: Math.round(prep * 10) / 10, conf: Math.round(conf * 10) / 10, pts, max };
  };

  const gauge = (v) => {
    // 半円ゲージ（0〜10）
    const r = 80, cx = 100, cy = 96, len = Math.PI * r;
    const color = v >= 8 ? 'home' : v >= 5 ? 'warn' : 'shelter';
    return `<svg viewBox="0 0 200 110" class="w-full max-w-[240px] h-auto mx-auto" role="img" aria-label="スコア ${v} / 10">
      <path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="rgb(var(--line))" stroke-width="16" stroke-linecap="round"/>
      <path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="rgb(var(--${color}))" stroke-width="16" stroke-linecap="round"
        stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - v / 10)}" class="gauge-arc"/>
      <text x="${cx - r}" y="${cy + 14}" text-anchor="middle" font-size="10" fill="rgb(var(--muted))">0</text>
      <text x="${cx + r}" y="${cy + 14}" text-anchor="middle" font-size="10" fill="rgb(var(--muted))">10</text>
    </svg>`;
  };

  H.Result = function (state) {
    const route = H.routes.find((r) => r.id === state.route);
    const c = route.color;
    const s = H.calcScore(state);
    const msg = s.total >= 8
      ? ['しっかり備えられています！', '定期的に期限や中身を見直して、この状態を保ちましょう。', 'home']
      : s.total >= 5
        ? ['あと少しで安心！', '×や△の項目を中心に、備えを見直しましょう。', 'warn']
        : ['備えを見直しましょう', 'まずは水・食料・トイレなど命を守る備えから始めましょう。', 'shelter'];

    const notes = {
      shelter: '原則は徒歩で、危険箇所を避けて避難所へ。持ち物はリュックに入れて両手を空けましょう。',
      home: '周辺で火災・浸水・土砂崩れの危険が出たら、自宅にとどまらず避難を最優先にしてください。',
      car: '燃料は半分を切る前に給油を。避難が難しくなったときに行く避難所も決めておきましょう。',
    };

    const weak = H.checklist.filter((it) => state.checks[it.id] !== 'ok');
    const unconfirmed = H.problemData[state.route].problems.map((p, i) => ({ ...p, i })).filter((p) => !state.confirmed.includes(p.i));

    const detail = state.showDetail ? `
      <div class="answer-in mt-4 rounded-2xl border border-line bg-surface p-4 text-sm grid gap-4">
        <div>
          <p class="font-bold mb-2">スコアの内訳</p>
          <dl class="grid grid-cols-[1fr_auto] gap-y-1.5 num">
            <dt class="text-muted">備えのチェック（${s.pts} / ${s.max} 点）</dt><dd class="font-bold">${s.prep} / 7</dd>
            <dt class="text-muted">問題点の確認（${state.confirmed.length} / 10 項目）</dt><dd class="font-bold">${s.conf} / 3</dd>
          </dl>
        </div>
        <div>
          <p class="font-bold mb-2">見直したい備え</p>
          ${weak.length ? `<ul class="flex flex-wrap gap-1.5">${weak.map((it) => {
            const m = H.marks.find((x) => x.v === state.checks[it.id]);
            return `<li class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-${m.color}/15 text-${m.color} font-medium text-xs">${m.sym} ${it.label}</li>`;
          }).join('')}</ul>` : '<p class="text-muted">すべて「できている」です。</p>'}
        </div>
        <div>
          <p class="font-bold mb-2">まだ確認していない問題点</p>
          ${unconfirmed.length ? `<ul class="grid gap-1 text-ink/85">${unconfirmed.map((p) => `<li class="flex gap-1.5"><span class="text-${c} font-bold num">${'①②③④⑤⑥⑦⑧⑨⑩'[p.i]}</span><span>${H.esc(p.q)}</span></li>`).join('')}</ul>
          <button type="button" data-action="goProblems" class="mt-2 text-${c} font-bold text-sm underline underline-offset-4">問題点の確認に戻る</button>` : '<p class="text-muted">10項目すべて確認済みです。</p>'}
        </div>
      </div>` : '';

    return `
    <section class="screen-in">
      ${H.ui.progress(5)}
      <p class="text-center font-display font-bold text-lg">あなたの避難方法</p>
      <div class="mt-3 rounded-2xl border-2 border-${c} overflow-hidden bg-surface">
        <div class="bg-${c} text-white text-center px-4 py-3 font-display font-bold text-xl leading-snug flex items-center justify-center gap-2">
          ${H.icon(route.icon, 'w-7 h-7')}<span>${route.no} ${route.name}</span>
        </div>
        <div class="px-4 py-3.5 text-sm leading-relaxed flex gap-2">
          ${H.icon('info', `w-5 h-5 text-${c} mt-0.5`)}<p>${notes[route.id]}</p>
        </div>
      </div>

      <div class="mt-5 rounded-2xl bg-surface border border-line px-4 pt-4 pb-5 text-center">
        <p class="font-bold">あなたの備えのスコア</p>
        <p class="num font-display font-black mt-1"><span class="text-5xl text-${msg[2]}">${s.total}</span><span class="text-2xl text-muted"> / 10</span></p>
        <div class="-mt-1">${gauge(s.total)}</div>
        <div class="mt-2 rounded-xl bg-${msg[2]}/15 px-3 py-2.5">
          <p class="font-bold text-${msg[2]}">${msg[0]}</p>
          <p class="text-xs text-ink/80 mt-0.5">${msg[1]}</p>
        </div>
        <button type="button" data-action="detail" aria-expanded="${state.showDetail}"
          class="btn-press mt-3 inline-flex items-center gap-1 rounded-full border-2 border-brand/40 px-4 py-2 text-sm font-bold text-brand hover:bg-brand/5">
          結果の詳細を${state.showDetail ? '閉じる' : '見る'}${H.icon('down', `w-4 h-4 transition-transform ${state.showDetail ? 'rotate-180' : ''}`)}
        </button>
      </div>
      ${detail}

      <div class="mt-5 grid grid-cols-2 gap-3">
        ${H.ui.outline('もう一度やり直す', 'restart', { iconLeft: 'refresh' })}
        <button type="button" data-action="hints"
          class="btn-press inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-white bg-brand">
          備えのヒントへ${H.icon('right', 'w-4 h-4')}
        </button>
      </div>
    </section>`;
  };
})(window.Hinan);
