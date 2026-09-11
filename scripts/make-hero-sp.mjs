/**
 * スマホ用のメインビジュアルを生成する。
 * 横長バナー(1737x766)のままだとスマホでは文字が小さくなりすぎるため、
 * タイトル周りを中央トリミングした縦長寄りのバリエーションを作る。
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/assets");
const src = path.join(dir, "hero-banner.jpg");
const out = path.join(dir, "hero-banner-sp.jpg");

// タイトル・日付・Zoom表記がすべて収まる中央部分
const CROP = { left: 388, top: 0, width: 975, height: 766 };

await sharp(src).extract(CROP).jpeg({ quality: 95, chromaSubsampling: "4:4:4" }).toFile(out);
console.log(`src/assets/hero-banner-sp.jpg を生成しました (${CROP.width}x${CROP.height})`);
