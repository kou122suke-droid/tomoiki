# site/

公開する静的ファイルのルート。このフォルダの中身が、そのままサイトの
ルートになります（Netlify なら `netlify.toml` の `publish` 先、
Cloudflare Pages なら Direct Upload でドラッグするフォルダ）。

```
site/
├── index.html          ← 「トップページ デザイン.dc.html」から実装済み
├── _headers            ← Cloudflare Pages 用のキャッシュ設定
└── assets/             ← ロゴ・写真・図版一式（30点／未配置）
```

## assets/ について

`index.html` は以下の30ファイルを `assets/` 直下から参照しています。
Claude Design のバンドルから、この名前のまま置いてください。

hero-village.png / hero-village-2.png / hero-village-4.png /
logo-mark.png / logo-color.png / tomoiki-mark.png /
purpose-house.png / philosophy-diagram-v3.png / six-elements.png /
book-cover-v2.png / robin-allison.jpg / earthsong-siteplan.png /
earthsong-members.png / map-figure-v2.png / reading-circle.png /
common-meal.jpg / site-visit.png / tomoiki-house.png / tomoiki-center.png /
members-group.jpg / event-session-visual-v2.png / sketch-family.png /
icon-mail.png / icon-phone.png /
member-takahashi.jpg / member-tsumura.jpg / member-ueda.jpg /
member-inoue.jpg / member-sagesaka.jpg / member-sadakata.jpg

画像は長辺2000px程度に縮小してから置いてください
（元のバンドルは合計約300MBあり、そのままでは表示が重すぎます）。

Cloudflare Pages に上げる場合、縮小は必須です。1ファイルあたり 25MiB の
上限があり、原寸のままだと超えるファイルが弾かれます。

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
