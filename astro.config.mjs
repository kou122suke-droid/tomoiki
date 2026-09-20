// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/*
 * 公開先に合わせて環境変数で切り替える。
 *
 *   SITE_URL   公開URL。canonical と OGP の絶対URLに使う。
 *   BASE_PATH  サブディレクトリ公開時のパス（例: /fes2026）。ルート公開なら未設定のまま。
 *
 * 例）さくらのレンタルサーバのルートに置く場合
 *   SITE_URL=https://example.jp npm run release
 *
 * 例）https://example.jp/fes2026/ に置く場合
 *   SITE_URL=https://example.jp BASE_PATH=/fes2026 npm run release
 */
const site = process.env.SITE_URL || 'https://orusuku-fes-2026.example.com';
const base = process.env.BASE_PATH || undefined;

export default defineConfig({
  site,
  base,
  // ディレクトリ形式（/schools/mek/index.html）で出力する。
  // Apache でも Netlify でもそのまま動く。
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
