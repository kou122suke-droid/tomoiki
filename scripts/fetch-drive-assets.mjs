/**
 * 各校から提出された素材（Google Drive）を src/assets/schools/<slug>/ に取り込む。
 *
 *   node scripts/fetch-drive-assets.mjs            # 未取得のものだけDL
 *   node scripts/fetch-drive-assets.mjs --force    # 既存ファイルも上書き
 *   node scripts/fetch-drive-assets.mjs --only=frasco,mek
 *   node scripts/fetch-drive-assets.mjs --list     # DL せず対応表だけ表示
 *
 * 前提: Driveフォルダが「リンクを知っている全員が閲覧可」になっていること。
 * 共有設定が限定されている場合はブラウザから手動でDLし、下の対応表どおりに配置してください。
 */
import { mkdirSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = path.join(root, "src/assets/schools");

const args = process.argv.slice(2);
const force = args.includes("--force");
const listOnly = args.includes("--list");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice(7).split(",").map((s) => s.trim()) : null;

// schools.ts から media 定義を読み出す（TSを実行せず正規表現で抽出）
const source = await import("node:fs").then((fs) =>
  fs.readFileSync(path.join(root, "src/data/schools.ts"), "utf8")
);

const entries = [];
const blockRe = /slug:\s*"([^"]+)"[\s\S]*?media:\s*\{([\s\S]*?)\n    \},/g;
for (const [, slug, mediaBlock] of source.matchAll(blockRe)) {
  const grab = (key) => {
    const m = mediaBlock.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
  };
  entries.push({ slug, logo: grab("logo"), photos: grab("photos"), people: grab("people") });
}

/** 保存先ファイル名（拡張子はDL時のContent-Typeで決める） */
function plan(entry) {
  const jobs = [];
  entry.logo.forEach((id, i) => jobs.push({ id, base: i === 0 ? "logo" : `logo-alt-${i}` }));
  entry.photos.forEach((id, i) => jobs.push({ id, base: `photo-${i + 1}` }));
  entry.people.forEach((id, i) =>
    jobs.push({ id, base: entry.people.length === 1 ? "person" : `person-${i + 1}` })
  );
  return jobs;
}

const EXT = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

async function download(id) {
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const type = (res.headers.get("content-type") || "").split(";")[0].trim();
  const buf = Buffer.from(await res.arrayBuffer());

  // 大きいファイルはウイルススキャン確認ページが返ることがある
  if (type.startsWith("text/html")) {
    const html = buf.toString("utf8");
    const confirm = html.match(/confirm=([\w-]+)/)?.[1];
    if (!confirm) throw new Error("共有設定が非公開の可能性があります（HTMLが返りました）");
    const res2 = await fetch(`${url}&confirm=${confirm}`, { redirect: "follow" });
    if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
    const type2 = (res2.headers.get("content-type") || "").split(";")[0].trim();
    return { type: type2, buf: Buffer.from(await res2.arrayBuffer()) };
  }
  return { type, buf };
}

let ok = 0;
let skipped = 0;
const failed = [];

for (const entry of entries) {
  if (only && !only.includes(entry.slug)) continue;
  const dir = path.join(assetsRoot, entry.slug);
  const jobs = plan(entry);

  if (listOnly) {
    console.log(`\n■ ${entry.slug}`);
    for (const job of jobs) {
      console.log(`  src/assets/schools/${entry.slug}/${job.base}.*  ←  https://drive.google.com/file/d/${job.id}/view`);
    }
    continue;
  }

  mkdirSync(dir, { recursive: true });
  const existing = readdirSync(dir);

  for (const job of jobs) {
    if (!force && existing.some((f) => f.startsWith(`${job.base}.`))) {
      skipped++;
      continue;
    }
    try {
      const { type, buf } = await download(job.id);
      const ext = EXT[type];
      if (!ext) throw new Error(`未対応の形式: ${type || "不明"}`);
      const dest = path.join(dir, job.base + ext);
      writeFileSync(dest, buf);
      console.log(`✓ ${path.relative(root, dest)} (${(buf.length / 1024).toFixed(0)} KB)`);
      ok++;
    } catch (e) {
      failed.push(`${entry.slug}/${job.base} (${job.id}): ${e.message}`);
    }
  }
}

if (!listOnly) {
  console.log(`\n取得 ${ok} 件 / スキップ（既存） ${skipped} 件 / 失敗 ${failed.length} 件`);
  if (failed.length) {
    console.log("\n失敗したファイル（ブラウザから手動でDLし、上記の名前で配置してください）:");
    failed.forEach((f) => console.log(`  - ${f}`));
    process.exitCode = 1;
  }
}
