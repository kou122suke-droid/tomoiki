# site/

公開する静的ファイルのルート。このフォルダの中身が、そのままサイトの
ルートになります（Netlify なら `netlify.toml` の `publish` 先、
Cloudflare Pages なら Direct Upload でドラッグするフォルダ）。

```
site/
├── index.html          ← 「トップページ デザイン.dc.html」から実装済み
├── privacy.html        ← 「プライバシーポリシー.dc.html」から実装済み
├── _headers            ← Cloudflare Pages 用のキャッシュ設定
└── assets/             ← ロゴ・写真・図版一式（27点／配置済み）
```

`privacy.html` はリポジトリルートの `build-privacy.py` が生成します。
スタイルシート・ヘッダー・フッター・スクリプトを `index.html` から
そのまま取り込むため、ヘッダーを直すと両ページに反映されます。
`index.html` を編集したら `python3 build-privacy.py` を再実行してください。

## assets/ について

2ページ合わせて以下の27ファイルを `assets/` 直下から参照しています。
現在はすべて配置済みで、`site/` をそのまま公開できます。

hero-village.png / hero-village-2.png / hero-village-4.png /
logo-mark.png / logo-color.png / tomoiki-mark.png /
purpose-house.png / philosophy-diagram-v3.png / six-elements-v2.png /
book-robin.png / map-figure-v2.png / reading-circle.png /
common-meal.jpg / site-visit.png / tomoiki-house.png / tomoiki-center.png /
members-group.jpg / event-session-visual-v2.png / sketch-family.png /
icon-mail.png / icon-phone.png /
member-takahashi.jpg / member-tsumura.jpg / member-ueda.jpg /
member-inoue.jpg / member-sagesaka.jpg / member-sadakata.jpg

旧版から `book-cover-v2.png` / `robin-allison.jpg` /
`earthsong-siteplan.png` / `earthsong-members.png` / `six-elements.png`
の5点が不要になり、`book-robin.png` と `six-elements-v2.png` が
新たに必要になりました。

配置済みの画像は、ブラウザが実際に描画する幅の2倍（Retina 相当）まで
縮小済みです（合計 約9.8MB）。デザインバンドルから差し替えた場合は、
リポジトリルートの `optimize-assets.py` を実行すると同じ基準に揃います。

    python3 optimize-assets.py site

このスクリプトはファイル名と拡張子を変えず、画素数と色空間だけを調整します。
`common-meal.jpg` は元が CMYK（印刷用の色空間）で、ブラウザによっては
色が崩れるか表示されないため、RGB に変換してあります。

## 公開方法

### Cloudflare Pages（Direct Upload）

dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets で、
この `site/` フォルダをドラッグします。`_headers` がキャッシュ設定として
読まれます（このファイル自体は配信されません）。

### Netlify

リポジトリを接続すると push のたびに自動で反映されます。`netlify.toml` の
`publish = "site"` が効くので、追加設定は不要です。ZIP でのドラッグ&ドロップ
公開が必要な場合は、リポジトリルートで `./make-zip.sh` を実行すると
`dist/tomoiki-site.zip` が生成されます。

`netlify.toml` と `_headers` は互いに無視し合うため、両方置いたままで
問題ありません。
