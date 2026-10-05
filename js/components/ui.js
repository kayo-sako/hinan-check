/* =========================================================
   UI 共通部品（ボタン・進捗バー・戻るボタン・本文整形）
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  H.esc = esc;

  H.ui = {
    /* 主ボタン */
    primary(label, action, { color = 'brand', icon = 'right', disabled = false, extra = '' } = {}) {
      return `<button type="button" data-action="${action}" ${extra} ${disabled ? 'disabled' : ''}
        class="btn-press w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-display font-bold text-base text-white bg-${color} shadow-[0_3px_0_rgb(var(--ink)/0.18)] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
        <span>${label}</span>${icon ? H.icon(icon, 'w-5 h-5') : ''}</button>`;
    },
    /* 枠線ボタン */
    outline(label, action, { color = 'brand', icon = '', iconLeft = '' } = {}) {
      return `<button type="button" data-action="${action}"
        class="btn-press inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-${color} bg-surface border-2 border-${color}/40 hover:bg-${color}/5">
        ${iconLeft ? H.icon(iconLeft, 'w-4 h-4') : ''}<span>${label}</span>${icon ? H.icon(icon, 'w-4 h-4') : ''}</button>`;
    },
    back(action = 'back') {
      return `<button type="button" data-action="${action}"
        class="btn-press inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-ink bg-surface border border-line hover:bg-bg">
        ${H.icon('left', 'w-4 h-4')}戻る</button>`;
    },
    /* 進捗バー：質問 n / 5 */
    progress(n, total = 5) {
      const pct = Math.round((n / total) * 100);
      return `<div class="mb-5" aria-label="進捗 ${n} / ${total}">
        <div class="flex items-baseline justify-between text-sm text-muted mb-1.5">
          <span class="font-medium">ステップ <span class="num font-bold text-ink">${n}</span> / ${total}</span>
          <span class="num text-xs">${pct}%</span>
        </div>
        <div class="h-2.5 rounded-full bg-line overflow-hidden">
          <div class="h-full rounded-full bg-brand transition-all duration-500" style="width:${pct}%"></div>
        </div>
      </div>`;
    },
    /* 資料の本文を段落・見出し・注記に整形 */
    richText(text) {
      return text.split(/\n{2,}/).map((para) => {
        const lines = para.split('\n').map((line) => {
          const t = line.trim();
          if (!t) return '';
          const head = t.match(/^『(.+)』$/);
          if (head) return `<span class="inline-block mt-1 mb-0.5 px-2 py-0.5 rounded-md bg-brand/10 text-brand font-bold text-[0.95em]">${esc(head[1])}</span>`;
          if (t.startsWith('※')) return `<span class="block text-[0.92em] text-shelter">${esc(t)}</span>`;
          // 「ラベル：内容」形式（全角スペース区切りの2組にも対応）
          if (/^[^：]{1,12}：/.test(t)) {
            return '<span class="block">' + t.split('　').map((seg) => {
              const m = seg.match(/^([^：]{1,12})：(.*)$/);
              return m ? `<span class="inline-block mr-3"><b class="text-ink">${esc(m[1])}</b>：${esc(m[2])}</span>` : esc(seg);
            }).join('') + '</span>';
          }
          return `<span class="block">${esc(t)}</span>`;
        }).join('');
        return `<p class="leading-relaxed">${lines}</p>`;
      }).join('');
    },
  };
})(window.Hinan);
