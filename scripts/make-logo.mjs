/**
 * 支給されたASJロゴ（白背景PNG）から、Webで使う派生素材を生成する。
 *
 *   src/assets/logo-asj.png        … 紺（ヘッダー用・背景透過）
 *   src/assets/logo-asj-white.png  … 白抜き（濃紺背景のフッター用）
 *   public/favicon.png             … 48px ファビコン
 *   public/apple-touch-icon.png    … 180px
 *
 * 2色ロゴなので、画素ごとに「紺」「星のオレンジ」を判定し、
 * 白地からの被覆率をアルファとして復元している（縁のギザつきを出さないため）。
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.env.ASJ_LOGO_SRC ?? path.join(root, "src/assets/logo-asj-source.png");

const NAVY = [0x1e, 0x3f, 0x61];
const ORANGE = [0xc9, 0x42, 0x16];
const WHITE = [0xff, 0xff, 0xff];

const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
const LUM_NAVY = lum(NAVY);
const LUM_ORANGE = lum(ORANGE);

/** 白地に乗った2色ロゴを、指定色＋アルファに置き換える */
async function extract(darkColor) {
  const { data, info } = await sharp(SRC)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;

  for (let p = 0, q = 0; p < data.length; p += info.channels, q += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const isOrange = r - b > 25;
    const target = isOrange ? ORANGE : darkColor;
    const lumTarget = isOrange ? LUM_ORANGE : LUM_NAVY;
    const alpha = Math.max(0, Math.min(1, (255 - lum([r, g, b])) / (255 - lumTarget)));

    out[q] = target[0];
    out[q + 1] = target[1];
    out[q + 2] = target[2];
    out[q + 3] = Math.round(alpha * 255);

    if (alpha > 0.08) {
      const i = q / 4;
      const x = i % info.width, y = (i / info.width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
}

// ヘッダー用（紺）／フッター用（白抜き）
const navyMark = await (await extract(NAVY)).png().toBuffer();
const whiteMark = await (await extract(WHITE)).png().toBuffer();

await sharp(navyMark).resize({ height: 420 }).png().toFile(path.join(root, "src/assets/logo-asj.png"));
await sharp(whiteMark).resize({ height: 420 }).png().toFile(path.join(root, "src/assets/logo-asj-white.png"));

/** 角丸の紺タイルに白抜きロゴを載せたアイコンを作る（小サイズでも視認できるように） */
async function icon(size) {
  const pad = Math.round(size * 0.09);
  const mark = await sharp(whiteMark)
    .resize({ height: size - pad * 2, fit: "inside" })
    .toBuffer();
  const { width: mw, height: mh } = await sharp(mark).metadata();
  const radius = Math.round(size * 0.22);
  const tile = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#1e3f61"/></svg>`
  );
  return sharp(tile)
    .composite([{ input: mark, left: Math.round((size - mw) / 2), top: Math.round((size - mh) / 2) }])
    .png()
    .toBuffer();
}

await sharp(await icon(48)).toFile(path.join(root, "public/favicon.png"));
await sharp(await icon(180)).toFile(path.join(root, "public/apple-touch-icon.png"));

console.log("ロゴ素材を生成しました: logo-asj.png / logo-asj-white.png / favicon.png / apple-touch-icon.png");
