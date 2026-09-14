# オルスクフェス2026 @ONLINE — イベントLP

全国13校のオルタナティブスクールが集まるオンラインイベント
「オルスクフェス2026 @ONLINE」のランディングページです。

## 技術スタック

| 項目 | 採用技術 | 理由 |
| --- | --- | --- |
| フレームワーク | **Astro 7**（静的出力） | LPはコンテンツ主体。JSゼロ配信を基本にしつつ、必要な箇所だけ島状にスクリプトを置ける |
| スタイル | **Tailwind CSS v4**（`@theme` トークン） | 配色・角丸・影をトークン化し、ポップな世界観をブレずに再利用 |
| メインビジュアル | 支給バナー（1737x766）を AVIF/WebP/JPEG で多解像度配信 | `astro:assets` の `getImage()` で最適化。スマホは中央トリミング版に差し替えるアートディレクション対応 |
| イラスト | **インラインSVG（自前実装）** | 参加校カード等は外部画像リクエストゼロ。パレット+モチーフの組み合わせで描き分け |
| フォント | Zen Maru Gothic / M PLUS Rounded 1c（Google Fonts） | 丸ゴシックで親しみやすさを出す。未読込時はシステム丸ゴシックにフォールバック |
| ホスティング | **Netlify** | `netlify.toml` 同梱。Git連携／zipドラッグ&ドロップの両方に対応 |

## セットアップ

```bash
npm install
npm run dev      # http://localhost:4321
```

## ビルドと公開用zipの作成

```bash
npm run release  # build → 未参照アセットの削除 → zip 作成 までを一括実行
```

個別に実行する場合:

```bash
npm run build    # dist/ に静的サイトを出力
npm run prune    # dist/_astro 内の未参照ファイルを削除
npm run zip      # release/orusuku-fes-2026-netlify.zip を作成
```

### Netlify で公開する（2通り）

**A. zipをドラッグ&ドロップ（最短）**

1. `release/orusuku-fes-2026-netlify.zip` を用意する
2. https://app.netlify.com/drop を開く
3. zipをドロップすると即座に公開URLが発行される

> zipの直下に `index.html` が入る構造にしてあるため、解凍せずそのまま投げ込めます。

**B. GitHub連携（継続的デプロイ）**

Netlifyでリポジトリを選ぶと `netlify.toml` が読まれ、以下が自動設定されます。

- build command: `npm run build`
- publish directory: `dist`
- Node.js: 22

## 参加スクールの情報

各校のアンケート回答（Googleフォーム「ASJオンラインフェス2026｜LP掲載素材アンケート回答」）を
`src/data/schools.ts` に転記しています。ここを直せば個別ページとトップの一覧に反映されます。

個別ページは `/schools/<slug>/` に自動生成されます（`src/pages/schools/[slug].astro`）。

### スクール素材（ロゴ・写真）の取り込み

素材は `src/assets/schools/<slug>/` に下記の命名で置くと自動で反映されます。
置かれていない場合は自動生成イラストにフォールバックするので、素材が揃う前でもビルドは通ります。

```
src/assets/schools/<slug>/
├── logo.png          # 学校ロゴ（png / jpg / webp / svg）
├── photo-1.jpg       # 掲載写真（ファイル名順に表示。photo-1 が大きく出ます）
├── photo-2.jpg
├── ...
└── person.jpg        # 登壇者・代表者写真（代表メッセージ欄に表示）
```

Drive からの取り込みはスクリプトで一括実行できます。

```bash
node scripts/fetch-drive-assets.mjs --list      # DriveファイルID と 配置先の対応表を表示
node scripts/fetch-drive-assets.mjs             # 未取得のものだけダウンロード
node scripts/fetch-drive-assets.mjs --force     # 既存ファイルも上書き
node scripts/fetch-drive-assets.mjs --only=frasco,mek
```

Drive フォルダが「リンクを知っている全員が閲覧可」になっている必要があります。
共有設定が限定されている場合は `--list` の対応表を見ながら手動で配置してください。
各ファイルの Drive ファイルIDは `src/data/schools.ts` の `media` フィールドに控えてあります。

## ディレクトリ構成

```
src/
├── data/site.ts           # イベント全体の原稿
├── data/schools.ts        # 参加スクール個別情報（アンケート回答の転記）
├── lib/schoolMedia.ts     # src/assets/schools/ の画像を解決
├── pages/index.astro      # トップページ
├── pages/schools/[slug].astro # スクール個別ページ（各校ぶん自動生成）
├── layouts/Base.astro     # <head>・OGP・構造化データ・スクロール演出
├── components/
│   ├── Header.astro       # 追従ヘッダー + モバイルメニュー
│   ├── Hero.astro         # ファーストビュー
│   ├── Worries.astro      # 共感パート（吹き出し）
│   ├── Features.astro     # できる3つのこと
│   ├── Schools.astro      # 参加スクール13校
│   ├── Program.astro      # タイムテーブル
│   ├── Overview.astro     # イベント概要 + CTA
│   ├── Recommend.astro    # こんな方におすすめ
│   ├── Faq.astro          # よくある質問（details/summary）
│   ├── News.astro         # お知らせ
│   ├── FinalCta.astro     # 最終CTA
│   ├── Footer.astro       # フッター
│   ├── StickyCta.astro    # スマホ用の追従CTA
│   ├── SchoolLogo.astro   # 学校ロゴ（無ければ非表示）
│   ├── SchoolGallery.astro # 写真ギャラリー（無ければイラスト）
│   ├── VideoEmbed.astro   # クリックするまで通信しないYouTube埋め込み
│   ├── SchoolScene.astro  # スクールカードのSVGイラスト
│   ├── FeatureScene.astro # 3つのことのSVGイラスト
│   ├── LineFigure.astro   # 線画の人物アイコン
│   └── Icon.astro         # 面アイコン
└── styles/global.css      # デザイントークン + 共通クラス
src/assets/
├── hero-banner.jpg        # メインビジュアル原本（1737x766・これが解像度の上限）
└── hero-banner-sp.jpg     # スマホ用の中央トリミング版（自動生成）
scripts/
├── fetch-drive-assets.mjs # 各校提出素材をDriveから取り込み
├── make-hero-sp.mjs       # スマホ用トリミングを生成
├── make-og-image.mjs      # メインビジュアルからOGP画像(1200x630)を生成
├── prune-assets.mjs       # dist内の未参照アセットを削除
└── make-zip.mjs           # Netlify公開用zipを作成
```

## メインビジュアルの差し替え

1. `src/assets/hero-banner.jpg` を新しいバナーに置き換える
2. `npm run hero:sp` でスマホ用トリミングを再生成
   （トリミング範囲は `scripts/make-hero-sp.mjs` の `CROP` で調整）
3. `npm run ogp` でOGP画像を再生成
4. `npm run release`

配信解像度は原本の幅が上限です。現在の原本は1737pxのため、
それ以上に大きい画面では引き伸ばしになります。より高精細にしたい場合は
原本をより大きいサイズで差し替えてください。

## 実装しているポイント

- **レスポンシブ**：360px〜ワイドまで検証。横スクロールが出ない設計
- **アクセシビリティ**：本文へスキップリンク、`:focus-visible` のアウトライン、装飾SVGの `aria-hidden`、ロゴ/SNSの代替テキスト
- **モーション配慮**：`prefers-reduced-motion: reduce` でフェードイン・浮遊アニメを無効化
- **SEO / SNS**：`description`、canonical、OGP/Twitter Card、schema.org の `Event` 構造化データ
- **表示速度**：画像はすべてインラインSVG。外部リクエストはWebフォントのみ

## 文言の差し替え

`src/data/site.ts` に日付・参加校・タイムテーブル・FAQなどをまとめています。
申し込みボタンのリンク先は同ファイルの `event.applyUrl` と
`src/components/FinalCta.astro` の `href` を実際のフォームURLに変更してください。

## OGP画像の再生成

`src/data/site.ts` の内容を変えたあと、文言を反映したい場合:

```bash
node scripts/make-og-image.mjs   # public/ogp.png を更新
```
