/* =========================================================
   ① 入口・トップページ
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  /* まちと避難先のイラスト（自作SVG） */
  const townArt = `
  <svg viewBox="0 0 320 150" class="w-full h-auto" role="img" aria-label="家・避難所・車が並ぶまちのイラスト">
    <rect x="0" y="118" width="320" height="32" fill="rgb(var(--line))"/>
    <path d="M0 132h320" stroke="rgb(var(--surface))" stroke-width="3" stroke-dasharray="14 10"/>
    <!-- 山 -->
    <path d="M0 118 L60 60 L105 95 L150 50 L210 118Z" fill="rgb(var(--home)/0.16)"/>
    <!-- 避難所（学校） -->
    <g>
      <rect x="182" y="62" width="104" height="56" rx="3" fill="rgb(var(--surface))" stroke="rgb(var(--shelter))" stroke-width="2.5"/>
      <path d="M176 64 L234 36 L292 64Z" fill="rgb(var(--shelter))"/>
      <rect x="226" y="46" width="16" height="16" rx="8" fill="rgb(var(--surface))"/>
      <path d="M234 50v4l3 2" stroke="rgb(var(--ink))" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g fill="rgb(var(--car)/0.25)" stroke="rgb(var(--car))" stroke-width="1.5">
        <rect x="192" y="74" width="16" height="12" rx="1.5"/><rect x="214" y="74" width="16" height="12" rx="1.5"/>
        <rect x="238" y="74" width="16" height="12" rx="1.5"/><rect x="260" y="74" width="16" height="12" rx="1.5"/>
      </g>
      <rect x="225" y="96" width="18" height="22" fill="rgb(var(--ink)/0.7)"/>
      <path d="M296 118V40" stroke="rgb(var(--ink))" stroke-width="2"/>
      <path d="M296 41h16l-4 6 4 6h-16Z" fill="rgb(var(--warn))"/>
    </g>
    <!-- 家 -->
    <g>
      <rect x="28" y="82" width="58" height="36" fill="rgb(var(--surface))" stroke="rgb(var(--home))" stroke-width="2.5"/>
      <path d="M20 84 L57 56 L94 84Z" fill="rgb(var(--home))"/>
      <rect x="38" y="92" width="14" height="12" fill="rgb(var(--warn)/0.45)" stroke="rgb(var(--home))" stroke-width="1.5"/>
      <rect x="62" y="96" width="14" height="22" fill="rgb(var(--ink)/0.7)"/>
      <!-- 黄色い旗 -->
      <path d="M100 118V90" stroke="rgb(var(--ink))" stroke-width="2"/>
      <path d="M101 91h14l-3 5 3 5h-14Z" fill="rgb(var(--warn))"/>
    </g>
    <!-- 車 -->
    <g transform="translate(118 96)">
      <path d="M4 18v-7l7-9h28l8 9v7Z" fill="rgb(var(--car))"/>
      <path d="M14 4h11v8H8Z M28 4h10l6 8H28Z" fill="rgb(var(--surface)/0.85)"/>
      <circle cx="14" cy="20" r="5" fill="rgb(var(--ink))"/><circle cx="38" cy="20" r="5" fill="rgb(var(--ink))"/>
    </g>
  </svg>`;

  H.Top = function () {
    return `
    <section class="screen-in">
      <div class="rounded-3xl bg-sun border border-warn/40 p-5 sm:p-7 overflow-hidden">
        <p class="inline-flex items-center gap-2 rounded-full bg-warn/25 text-ink px-3 py-1 text-sm font-bold">
          ${H.icon('megaphone', 'w-5 h-5 text-shelter')}災害発生！
        </p>
        <h1 class="font-display font-black text-[2rem] sm:text-[2.4rem] leading-tight mt-3 text-ink" style="text-wrap:balance">
          あなたは<br>どう行動する？
        </h1>
        <p class="mt-3 text-[0.95rem] leading-relaxed text-ink/80 max-w-[30em]">
          いくつかの質問に答えて、あなたに合った避難方法と、
          そのとき起こりうる問題・備えのポイントを確認しましょう。
        </p>
        <div class="mt-4 -mx-1">${townArt}</div>
      </div>

      <div class="mt-5 grid gap-3">
        ${H.ui.primary('チェックを始める', 'start')}
        <p class="flex items-center justify-center gap-1.5 text-sm text-muted">
          ${H.icon('clock', 'w-4 h-4')} 所要時間：約3〜5分 ／ 質問は5ステップ
        </p>
      </div>

      <div class="mt-6 grid grid-cols-3 gap-2 text-center">
        ${H.routes.map((r) => `
          <div class="rounded-2xl border border-${r.color}/30 bg-${r.color}/5 px-2 py-3">
            <span class="mx-auto grid place-items-center w-10 h-10 rounded-full bg-${r.color}/15 text-${r.color}">${H.icon(r.icon, 'w-6 h-6')}</span>
            <p class="mt-1.5 text-xs font-bold text-${r.color} leading-snug">${r.no} ${r.short}</p>
          </div>`).join('')}
      </div>
      <p class="mt-2 text-xs text-muted text-center">3つの避難方法から、それぞれの問題点と対処方法を確認できます</p>
    </section>`;
  };
})(window.Hinan);
