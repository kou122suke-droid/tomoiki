/**
 * サイト内リンクを組み立てる。
 *
 * サブディレクトリ公開（例: https://example.jp/fes2026/）に対応するため、
 * astro.config.mjs の base を前置する。base 未設定なら "/" なのでそのまま。
 *
 *   url("/")               -> "/"          … base 未設定
 *   url("/schools/mek/")   -> "/fes2026/schools/mek/"  … base="/fes2026"
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const url = (path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}` || "/";
};
