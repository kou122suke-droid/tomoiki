# No Limit 公式サイト

株式会社No Limit のコーポレートサイト（静的HTML）。ビルド不要で、フォルダごとアップロードすれば公開できます（GitHub Pages / Netlify / Cloudflare Pages / 一般的なレンタルサーバー）。

## 構成

```
index.html        トップ
about.html        会社概要・ボードメンバー
training.html     法人向け研修
privacy.html      プライバシーポリシー
404.html          ページが見つからない時の表示
css/style.css     全ページ共通スタイル（レスポンシブ対応）
js/main.js        スマホメニュー / スクロール演出 / 実績スライダー / 動画自動再生
assets/           画像・動画
favicon.ico, favicon-32.png, apple-touch-icon.png, icon-512.png
```

ローカル確認: `python3 -m http.server` を実行して http://localhost:8000 を開く。

## 公開（エックスサーバー / https://no-limit.life）

README.md 以外のファイル一式を `no-limit.life/public_html/` 直下にアップロードする。
`.htaccess` で https・www なしへの統一、404ページ、キャッシュを設定済み。
別ドメインで公開する場合は、各HTMLの `canonical` / `og:url` / `og:image`、`.htaccess`、`robots.txt`、`sitemap.xml` の `no-limit.life` を置き換える。
