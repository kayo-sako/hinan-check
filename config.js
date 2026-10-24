/* =========================================================
   サイト設定
   SITE_URL：QRコードに埋め込む公開URL。
   空のままにすると、表示中のページのURLを自動で使います。
   別のサーバー（GitHub Pages など）に置いた場合は、そのURLに書き換えてください。

   GA_ID：Googleアナリティクスの測定ID（例 'G-ABC123XYZ9'）。
          空のままなら利用者数の計測はしません。
   RESULT_ENDPOINT：結果を記録する Google Apps Script のウェブアプリURL
          （https://script.google.com/macros/s/……/exec）。
          空のままなら結果の記録はしません。
   ========================================================= */
window.Hinan = window.Hinan || {};

window.Hinan.config = {
  SITE_URL: "https://kayo-sako.github.io/hinan-check/",
  SITE_NAME: "災害時 避難方法チェック",
  STORAGE_KEY: "hinan-check-v1",
  GA_ID: "G-CZ8XSYE45L",
  RESULT_ENDPOINT: "https://script.google.com/macros/s/AKfycbwcSjLe69fK3X5mkgzJU9WQtMN0lTeUBWBvmuAGTfuVJm993xPnUkf48ysH84raRXan/exec",
};
