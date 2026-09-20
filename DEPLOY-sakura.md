# さくらのレンタルサーバへの公開手順

このサイトは静的HTMLです。`dist/` の中身をそのまま公開ディレクトリに置けば動きます。
PHPやデータベースは不要です。

---

## 0. 事前に決めること

**どのURLで公開するか**でビルドコマンドが変わります。

| 公開先 | ビルドコマンド |
| --- | --- |
| ドメイン直下（例 `https://example.jp/`） | `SITE_URL=https://example.jp npm run release` |
| サブディレクトリ（例 `https://example.jp/fes2026/`） | `SITE_URL=https://example.jp BASE_PATH=/fes2026 npm run release` |

`SITE_URL` は canonical と OGP画像の絶対URLに使われます。**指定を忘れるとSNSシェア時に
画像が出ません**ので必ず指定してください。

---

## 1. ビルドする

```bash
npm install                                   # 初回のみ
SITE_URL=https://example.jp npm run release
```

`dist/` に公開ファイル一式、`release/orusuku-fes-2026-netlify.zip` に同じ内容のzipができます。

---

## 2. 公開ディレクトリを確認する

さくらのレンタルサーバの公開ディレクトリは **`/home/<アカウント名>/www/`** です。

独自ドメインを追加している場合は、コントロールパネルの
「ドメイン/SSL」→ 対象ドメインの設定で、どのフォルダに割り当てているかを確認してください。
`www` 直下ではなく `www/fes2026` のようなサブフォルダに割り当てているケースがよくあります。

---

## 3. アップロードする

### 方法A：ファイルマネージャー（一番手軽・プラン不問）

1. サーバコントロールパネルにログイン
2. 「ファイルマネージャー」を開く
3. 公開ディレクトリへ移動し、`dist/` の**中身**をドラッグ＆ドロップ
   - `dist` フォルダごとではなく、`index.html` や `_astro` が直下に来るようにします

> 画像を含めて100ファイル以上あるため、ブラウザ経由は時間がかかります。
> 初回はFTPソフト（方法B）のほうが確実です。

### 方法B：FTPソフト（FileZilla / Cyberduck など）

| 項目 | 値 |
| --- | --- |
| ホスト | `<アカウント名>.sakura.ne.jp` |
| ユーザー名 | `<アカウント名>` |
| パスワード | サーバパスワード |
| 暗号化 | **FTPS（明示的なTLS）** を選ぶ |
| 転送先 | `/home/<アカウント名>/www/` |

`dist/` の中身をすべてアップロードします。**隠しファイルの `.htaccess` も必ず含めてください**
（FileZillaは初期設定で隠しファイルを表示しません。「サーバー」→「強制的に隠しファイルを表示」をON）。

### 方法C：コマンドで差分同期（推奨・スタンダードプラン以上）

SSHが使えるプラン（スタンダード以上）なら、変更分だけを転送できます。

```bash
cp .env.sakura.example .env.sakura   # 初回のみ。中身を自分の値に書き換える
npm run build
./scripts/deploy-sakura.sh --dry-run # まず内容を確認
./scripts/deploy-sakura.sh           # 実行
```

ライトプランはSSH非対応です。`.env.sakura` に `METHOD=ftp` と `SAKURA_PASS` を設定すると
`lftp` でのFTPS同期に切り替わります。

> `--delete` が付いているため、**公開ディレクトリは `dist/` と完全に同じ内容になります**。
> 同じフォルダに他のサイトのファイルが同居している場合は消えてしまうので、
> まず必ず `--dry-run` で確認してください。

---

## 4. 公開後の確認

- [ ] トップページが表示される
- [ ] スクール個別ページが開く（例 `/schools/tatenoito/`）
- [ ] プライバシーポリシー `/privacy/` が開く
- [ ] 申し込みボタンがPeatixに飛ぶ
- [ ] 存在しないURLで404ページが出る
- [ ] スマホで横スクロールが出ない

---

## 補足

### 同梱している設定ファイル

| ファイル | 役割 |
| --- | --- |
| `.htaccess` | Apache用。MIMEタイプ（AVIF/WebP）、圧縮、キャッシュ、セキュリティヘッダ、404設定 |
| `_headers` / `netlify.toml` | Netlify用。さくらでは無視されます（`.htaccess` で外部から読めないようにしてあります） |

サブディレクトリ公開にした場合は、`.htaccess` 末尾の
`ErrorDocument 404 /404.html` を `/fes2026/404.html` のように書き換えてください。

### 常時SSL

さくらのコントロールパネルから無料SSL（Let's Encrypt）を設定できます。
設定後、HTTPからHTTPSへリダイレクトしたい場合は `.htaccess` の先頭に以下を追加します。

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</IfModule>
```

### 更新のたびにやること

1. 原稿や画像を直す
2. `SITE_URL=... npm run release`
3. 方法A〜Cのいずれかで再アップロード

`_astro/` のファイル名にはハッシュが入るため、更新しても古いキャッシュが残りません。
