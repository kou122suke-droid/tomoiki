/**
 * dist/_astro 内の未参照ファイルを削除する。
 *
 * astro:assets は import しただけで元画像も dist に書き出すため、
 * getImage() 由来の最適化済みファイルだけを使う構成だと元画像が丸ごと残ってしまう。
 * HTML/CSS/JS から一度も参照されていないものだけを対象にする。
 */
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const assets = path.join(dist, "_astro");

/** dist 配下のテキストファイルを再帰的に集める */
function textFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return textFiles(full);
    return /\.(html|css|js|mjs|json|xml|txt)$/i.test(e.name) ? [full] : [];
  });
}

const haystack = textFiles(dist).map((f) => readFileSync(f, "utf8")).join("\n");

let removed = 0;
let bytes = 0;
for (const name of readdirSync(assets)) {
  if (haystack.includes(name)) continue;
  const full = path.join(assets, name);
  bytes += statSync(full).size;
  rmSync(full);
  removed++;
  console.log(`  - ${name}`);
}

console.log(
  removed
    ? `✓ 未参照アセット ${removed} 件 (${(bytes / 1024).toFixed(1)} KB) を削除しました`
    : "✓ 未参照アセットはありませんでした"
);
