# tomoiki

一般社団法人ともに生きる実践ラボ 公式サイト（https://tomoiki-lab.org）

`public/` の中身がそのままサーバーの公開ディレクトリにアップロードされるファイルです。

```
public/
├── index.html      トップページ
├── privacy.html    プライバシーポリシー
├── support.js      ページ描画ランタイム
├── vendor/         React（CDN に依存しないよう同梱）
├── assets/         画像
└── .htaccess       www なし統一・キャッシュ設定
```

## DNS（お名前.com・設定済み）

| タイプ | ホスト名 | 値 |
| --- | --- | --- |
| A | tomoiki-lab.org | 160.251.71.53 |
| A | www.tomoiki-lab.org | 160.251.71.53 |
| MX | tomoiki-lab.org | mail50.onamae.ne.jp（優先度 10） |
| TXT | tomoiki-lab.org | v=spf1 include:_spf.onamae.ne.jp ~all |
| TXT | default._domainkey | DKIM 公開鍵 |

Web は `160.251.71.53`（お名前.com レンタルサーバー）、メールは `mail50.onamae.ne.jp` を向いており、
DNS 側の追加作業は不要です。

## 公開方法 A：GitHub から自動アップロード（おすすめ）

`main` ブランチの `public/` が更新されると、GitHub Actions が FTP でサーバーへアップロードします。
最初に一度だけ、GitHub リポジトリの **Settings → Secrets and variables → Actions** で次を登録してください。

**Secrets**（コントロールパネル「FTP・SSHアカウント」に記載の値）

| 名前 | 値の例 |
| --- | --- |
| `FTP_SERVER` | FTP サーバー名（コントロールパネルに表示されるホスト名、または `160.251.71.53`） |
| `FTP_USERNAME` | FTP アカウント名 |
| `FTP_PASSWORD` | FTP パスワード |

**Variables**（必要な場合のみ）

| 名前 | 既定値 | 説明 |
| --- | --- | --- |
| `FTP_SERVER_DIR` | `/public_html/` | tomoiki-lab.org の公開フォルダ。コントロールパネル「ドメイン」画面の「公開フォルダ」と同じにする（例：`/public_html/tomoiki-lab.org/`）。末尾は `/` |
| `FTP_PROTOCOL` | `ftps` | 接続に失敗する場合は `ftp` |

登録後、**Actions → Deploy to お名前.com レンタルサーバー → Run workflow** で手動実行もできます。

## 公開方法 B：手動アップロード

FileZilla などの FTP ソフト、またはコントロールパネルの「ファイルマネージャー」で、
`public/` の **中身**（`index.html` など。`public` フォルダ自体ではない）を公開フォルダへアップロードします。
`.htaccess` は隠しファイルなので、表示設定で隠しファイルを表示してからアップロードしてください。

## 公開後

1. http://tomoiki-lab.org で表示を確認
2. コントロールパネルで無料独自SSLを tomoiki-lab.org / www.tomoiki-lab.org に設定
3. SSL が有効になったら `public/.htaccess` の https 統一の 2 行のコメントを外して再アップロード
