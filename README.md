# オルスクフェス2026 @ONLINE — イベントLP

全国13校のオルタナティブスクールが集まるオンラインイベント
「オルスクフェス2026 @ONLINE」のランディングページです。

## 技術スタック

| 項目 | 採用技術 | 理由 |
| --- | --- | --- |
| フレームワーク | **Astro 7**（静的出力） | LPはコンテンツ主体。JSゼロ配信を基本にしつつ、必要な箇所だけ島状にスクリプトを置ける |
| スタイル | **Tailwind CSS v4**（`@theme` トークン） | 配色・角丸・影をトークン化し、ポップな世界観をブレずに再利用 |
| イラスト | **インラインSVG（自前実装）** | 外部画像リクエストゼロ。13校ぶんの絵柄をパレット+モチーフの組み合わせで描き分け |
| フォント | Zen Maru Gothic / M PLUS Rounded 1c（Google Fonts） | 丸ゴシックで親しみやすさを出す。未読込時はシステム丸ゴシックにフォールバック |
| ホスティング | **Netlify** | `netlify.toml` 同梱。Git連携／zipドラッグ&ドロップの両方に対応 |

## セットアップ

```bash
npm install
npm run dev      # http://localhost:4321
```

## ビルドと公開用zipの作成

```bash
npm run build    # dist/ に静的サイトを出力
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

## ディレクトリ構成

```
src/
├── data/site.ts           # 全セクションの原稿（ここだけ直せば文言差し替え完了）
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
│   ├── SchoolScene.astro  # スクールカードのSVGイラスト
│   ├── FeatureScene.astro # 3つのことのSVGイラスト
│   ├── LineFigure.astro   # 線画の人物アイコン
│   └── Icon.astro         # 面アイコン
└── styles/global.css      # デザイントークン + 共通クラス
scripts/
├── make-og-image.mjs      # OGP画像(1200x630 PNG)を生成
└── make-zip.mjs           # Netlify公開用zipを作成
```

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
