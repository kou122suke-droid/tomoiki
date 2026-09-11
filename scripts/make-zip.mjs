/**
 * dist/ を Netlify のドラッグ&ドロップ公開用 zip にまとめる。
 * 出力: release/orusuku-fes-2026-netlify.zip
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const outDir = path.join(root, "release");
const outFile = path.join(outDir, "orusuku-fes-2026-netlify.zip");

if (!existsSync(dist)) {
  console.error("dist/ がありません。先に `npm run build` を実行してください。");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
rmSync(outFile, { force: true });

// dist の「中身」を zip 直下に入れる（Netlify Drop は zip 直下に index.html を要求する）
execSync(`zip -r -q -X "${outFile}" .`, { cwd: dist, stdio: "inherit" });

const kb = (statSync(outFile).size / 1024).toFixed(1);
console.log(`✓ ${path.relative(root, outFile)} を作成しました (${kb} KB)`);
