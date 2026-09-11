// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://orusuku-fes-2026.example.com',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Netlify のドラッグ&ドロップ公開でも壊れないよう、CSS/JS は 1 ファイルにまとめる
    inlineStylesheets: 'auto',
  },
});
