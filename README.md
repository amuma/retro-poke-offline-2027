# RETRO Poke OFFLINE 2027 — デザインサンプル

GitHub Pagesで公開できる、依存パッケージ不要の4ページ構成です。

- `index.html`：トップ、ABOUT US、お知らせ、オフ会一覧、ランキング概要
- `ranking/index.html`：部門切り替え、名前検索、ページ送り、獲得ポイント内訳
- `events/index.html`：オフ会・部門切り替え、全参加者の結果、優勝・準優勝者のパーティ、KP
- `guidelines/index.html`：参加ガイドライン、仮のポイント制度、ポイント計算機

## ローカルで見る

Node.js 22以降で `node scripts/serve.mjs`（npmを利用できる環境では `npm run dev`）を実行し、表示された `http://127.0.0.1:4173/` を開きます。インストール作業は不要です。停止は Ctrl+C。すでに4173番を利用中の場合はPORT環境変数で変更できます。

`node scripts/check.mjs`（または `npm run check`）で、サンプル成績の整合性、集計、静的リンクを確認できます。

## GitHub Pages

リポジトリ： https://github.com/amuma/retro-poke-offline-2027

Settings → Pages → Deploy from a branch から、配置先のブランチと `/ (root)` を選択します。`.nojekyll` を含むため静的ファイルとして配信できます。サイト内リンクはリポジトリ配下のURLにも対応しています。

## サンプルの範囲

日程、会場、主催者、選手名、全大会結果、パーティ、配点、ランキングは架空です。ポイントとKPは `assets/data.js` の同一データから計算し、各ページ間で整合させています。総合ランキング・配点・規模係数・端数処理・同点処理は正式制度ではありません。パーティは競技上の適法性を検証したものではありません。

各オフ会は `events/?event=tokyo-03` の形式で直接参照でき、`format=gsc` などで部門を指定できます。例：`events/?event=osaka-02&format=bw`。

Firebase認証、管理者画面、データベース、申込・問い合わせ送信、動画・記事の外部リンクは未接続です。今回はデザイン・掲載内容・操作感の確認に範囲を絞っています。

## デザイン

参考サイト： https://asone-official.studio.site/

黒背景、紫のアクセント、大きな英字見出し、広い余白を参考にしています。ロゴは同一プロジェクトで作成された透過PNG（`assets/logo.png`）を、トップ・共通ヘッダー・フッターで使用しています。テキストと携帯ゲーム機のSVGは独自に作成しています。参考サイトの画像・ロゴは使用していません。フォント・画像・スクリプトの外部配信への依存はありません。
