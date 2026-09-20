# さくらサーバーへの公開手順

このサイトは静的HTMLです。**`dist/` の中身をサーバーに置くだけ**で公開できます。

---

## 全体の流れ

```
① ビルド          → dist/ フォルダができる
② FTPでつなぐ      → さくらサーバーに接続
③ 中身をコピー     → /home/アカウント名/www/ に置く
④ ブラウザで確認   → 完了
```

---

## ① ビルド

```bash
npm install                                   # 初回のみ
SITE_URL=https://公開するドメイン npm run release
```

`dist/` に公開ファイル一式ができます（`release/` の中に同じ内容のzipもできます）。

> **`SITE_URL` は必ず指定してください。**
> 忘れるとSNSでシェアしたときにバナー画像が出ません。
> サブディレクトリに置く場合は `BASE_PATH=/フォルダ名` も追加します。

---

## ② FTPでつなぐ

FileZilla などのFTPソフトで接続します。

| 項目 | 値 |
| --- | --- |
| ホスト | `アカウント名.sakura.ne.jp` |
| ユーザー名 | アカウント名 |
| パスワード | サーバーパスワード |
| 暗号化 | FTPS（明示的なTLS） |

さくらのコントロールパネル →「ファイルマネージャー」でも同じことができます。

---

## ③ 中身をコピー

`/home/アカウント名/www/` を開き、**`dist/` の中身**をアップロードします。

```
www/
├── index.html      ← dist の中身が直接ここに来る
├── 404.html        （dist フォルダごと置かない）
├── .htaccess
├── _astro/
├── privacy/
└── schools/
```

> **`.htaccess` を忘れずに。** 隠しファイルなのでFTPソフトの初期設定では見えません。
> FileZilla なら「サーバー」→「強制的に隠しファイルを表示する」をON。
> これが無いと画像が表示されないことがあります。

---

## ④ 確認

- トップページが出る
- `/schools/tatenoito/` が開く
- `/privacy/` が開く
- 申し込みボタンがPeatixに飛ぶ

---

## 更新するとき

```
原稿・画像を直す → ① ビルド → ③ 上書きアップロード
```

---

## 補足

**コマンドで差分だけ転送したい場合**（スタンダードプラン以上）

```bash
cp .env.sakura.example .env.sakura   # 初回のみ。中身を書き換える
npm run build
./scripts/deploy-sakura.sh --dry-run # 確認
./scripts/deploy-sakura.sh           # 実行
```

**常時SSL（https化）**
コントロールパネルから無料SSLを設定したあと、`.htaccess` の先頭に追記します。

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

**うまくいかないとき**

| 症状 | 原因 |
| --- | --- |
| 画像が出ない | `.htaccess` がアップロードされていない |
| リンクが404 | `dist` フォルダごと置いている（中身だけを置く） |
| SNSで画像が出ない | ビルド時に `SITE_URL` を指定していない |
| CSSが効かない | サブディレクトリなのに `BASE_PATH` を指定していない |
