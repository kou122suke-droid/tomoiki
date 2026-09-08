# site/

Netlify に公開する静的ファイルのルート（`netlify.toml` の `publish` 先）。

```
site/
├── index.html          ← 「トップページ デザイン.dc.html」から実装済み
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

画像は長辺2000px程度に縮小してから置くことを推奨します
（元のバンドルは合計約300MBあり、そのままでは表示が重すぎます）。

## 公開方法

Netlify にこのリポジトリを接続すると、push のたびに自動で反映されます。
ZIP でのドラッグ&ドロップ公開が必要な場合は、リポジトリルートで
`./make-zip.sh` を実行すると `dist/tomoiki-site.zip` が生成されます。
