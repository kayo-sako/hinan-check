/* =========================================================
   レイアウト部品：ヘッダー / 流れ（サイドパネル） / QRモーダル / フッター
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  H.siteUrl = function () {
    const u = H.config.SITE_URL;
    if (u) return u;
    return /^https?:/.test(location.href) ? location.href.split('#')[0] : '';
  };

  /* ヘッダー */
  H.Header = function () {
    return `
    <header class="sticky z-30 bg-surface/90 backdrop-blur border-b border-line" style="top:env(safe-area-inset-top,0px)">
      <div class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-3">
        <button type="button" data-action="home" class="flex items-center gap-2 min-w-0 text-left">
          <span class="grid place-items-center w-8 h-8 rounded-lg bg-brand text-white">${H.icon('shelter', 'w-5 h-5')}</span>
          <span class="font-display font-black text-[1.05rem] truncate">${H.config.SITE_NAME}</span>
        </button>
        <button type="button" data-action="qr" class="btn-press shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-bold hover:bg-bg" aria-label="QRコードを表示">
          ${H.icon('qr', 'w-5 h-5 text-brand')}<span class="hidden sm:inline">QRコード</span><span class="sm:hidden">QR</span>
        </button>
      </div>
    </header>`;
  };

  /* 流れ（PC表示のサイドパネル） */
  const FLOW = [
    ['top', '入口・トップ'], ['damage', '自宅の状況'], ['route', '避難先の選択'],
    ['problems', '起こりうる問題'], ['check', '備えのチェック'], ['result', '結果'], ['hints', '備えのヒント'],
  ];
  H.SidePanel = function (state) {
    const cur = FLOW.findIndex(([k]) => k === state.step);
    const url = H.siteUrl();
    return `
    <div class="grid gap-4">
      <nav aria-label="チェックの流れ" class="rounded-2xl border border-line bg-surface p-4">
        <p class="text-xs font-bold tracking-wider text-muted mb-3">チェックの流れ</p>
        <ol class="grid gap-1">
          ${FLOW.map(([k, label], i) => `
            <li class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 ${i === cur ? 'bg-brand/10 text-brand font-bold' : i < cur ? 'text-ink' : 'text-muted'}">
              <span class="num grid place-items-center w-6 h-6 rounded-full text-xs font-bold
                ${i < cur ? 'bg-brand text-white' : i === cur ? 'border-2 border-brand' : 'border border-line'}">${i < cur ? H.icon('check', 'w-3.5 h-3.5') : i + 1}</span>
              <span class="text-sm">${label}</span>
            </li>`).join('')}
        </ol>
      </nav>
      ${url ? `
      <div class="rounded-2xl border border-line bg-surface p-4 text-center">
        <p class="text-sm font-bold mb-2">スマートフォンで開く</p>
        <div class="mx-auto w-36 rounded-lg overflow-hidden border border-line">${H.qrSvg(url, { size: 144 })}</div>
        <p class="text-xs text-muted mt-2">カメラで読み取ってください</p>
      </div>` : ''}
    </div>`;
  };

  /* QRコードモーダル */
  H.QrModal = function () {
    const url = H.siteUrl();
    return `
    <div class="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-title">
      <div class="absolute inset-0 bg-ink/50" data-action="closeQr"></div>
      <div class="answer-in relative w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-xl">
        <button type="button" data-action="closeQr" aria-label="閉じる" class="absolute right-3 top-3 grid place-items-center w-9 h-9 rounded-full hover:bg-bg">${H.icon('x', 'w-5 h-5')}</button>
        <h2 id="qr-title" class="font-display font-bold text-lg">このサイトのQRコード</h2>
        <p class="text-sm text-muted mt-1">スマートフォンのカメラで読み取ると、このチェックを開けます。</p>
        ${url ? `
          <div class="mx-auto mt-4 w-60 max-w-full rounded-xl overflow-hidden border border-line">${H.qrSvg(url, { size: 240 })}</div>
          <div class="mt-4 flex items-center gap-2 rounded-lg bg-bg px-3 py-2">
            <input id="qr-url" readonly value="${H.esc(url)}" class="min-w-0 flex-1 bg-transparent text-xs text-muted outline-none" aria-label="サイトのURL">
            <button type="button" data-action="copyUrl" class="shrink-0 text-xs font-bold text-brand">コピー</button>
          </div>
          <p id="copy-msg" class="h-4 mt-1 text-xs text-home" aria-live="polite"></p>`
        : '<p class="mt-4 text-sm text-shelter">公開URLが設定されていません。js/config.js の SITE_URL を設定してください。</p>'}
      </div>
    </div>`;
  };

  /* フッター（注意書き） */
  H.Footer = function () {
    return `
    <footer class="mx-auto max-w-6xl px-4 pb-10">
      <div class="flex gap-3 rounded-2xl bg-sun border border-warn/40 px-4 py-4 text-sm leading-relaxed">
        ${H.icon('bulb', 'w-6 h-6 text-warn mt-0.5')}
        <p>このチェックはあくまで目安です。実際の<b class="text-shelter">災害時</b>は、自治体や防災機関の<b class="text-brand">情報</b>を確認し、安全を最優先に行動してください。</p>
      </div>
    </footer>`;
  };
})(window.Hinan);
