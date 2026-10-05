# 災害時 避難方法チェック

公開URL：https://kayo-sako.github.io/hinan-check/

いくつかの質問に答えて、自分に合った避難方法と、起こりうる問題・備えのポイントを確認できるサイトです。

## 構成（コンポーネント単位）
- index.html …… ページ本体（Tailwind CDN 読み込み・設定）
- css/style.css …… 色・フォントのデザイントークン（ライト/ダーク）
- js/config.js …… 公開URL（QRコードの中身）・サイト名
- js/data/routes.js …… 3つの避難方法・備えチェック項目とヒント
- js/data/problems.js …… Excel資料から生成した「問題点への対処方法」
- js/components/ …… 画面ごとの部品
  - top.js（①トップ） / questions.js（②自宅の状況・③避難先） / problemList.js（④問題点の確認）
  - checklist.js（⑤備えチェック） / result.js（⑥結果・スコア） / hints.js（⑦備えのヒント）
  - layout.js（ヘッダー・流れパネル・QRモーダル・フッター） / ui.js（共通ボタン等） / icons.js / qrcode.js（QR生成）
- js/app.js …… 状態管理と画面切り替え

## 内容を更新するには
ファイルを編集して main ブランチに保存すると、1〜2分でサイトに反映されます。
公開URLを変える場合は js/config.js の SITE_URL も書き換えてください。
