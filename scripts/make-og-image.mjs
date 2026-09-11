/**
 * OGP画像（1200x630 PNG）をメインビジュアルから生成して public/ogp.png に出力する。
 * 元バナー(1737x766 / 2.268:1)を OGP比率(1.905:1)に中央トリミングしてから縮小する。
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src/assets/hero-banner.jpg");
const out = path.join(root, "public/ogp.png");

const OG = { width: 1200, height: 630 };
const meta = await sharp(src).metadata();

// 高さいっぱいを使い、OGP比率になるよう左右を均等に落とす
const cropWidth = Math.round(meta.height * (OG.width / OG.height));
const left = Math.round((meta.width - cropWidth) / 2);

await sharp(src)
  .extract({ left, top: 0, width: cropWidth, height: meta.height })
  .resize(OG.width, OG.height, { kernel: "lanczos3" })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`public/ogp.png を生成しました (${OG.width}x${OG.height} / crop ${cropWidth}x${meta.height} @ x=${left})`);
