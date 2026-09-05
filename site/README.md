# site/

Netlify に公開する静的ファイルのルート（`netlify.toml` の `publish` 先）。

想定構成:

```
site/
├── index.html          ← 「トップページ デザイン.dc.html」から生成
└── assets/             ← ロゴ・写真・図版一式
```

ZIP を作る場合はリポジトリルートで `./make-zip.sh` を実行すると
`dist/tomoiki-site.zip` が生成されます。この ZIP を
https://app.netlify.com/drop にドラッグ&ドロップすれば公開できます。
