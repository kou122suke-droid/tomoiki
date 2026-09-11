/**
 * OGP 画像（1200x630 PNG）を SVG から生成して public/ogp.png に出力する。
 * 日本語グリフを含むシステムフォントを自動検出して埋め込む。
 */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import sharp from "sharp";

function jpFont() {
  try {
    const out = execSync("fc-match -f '%{family}' :lang=ja", { encoding: "utf8" }).trim();
    return out || "sans-serif";
  } catch {
    return "sans-serif";
  }
}
const FF = `${jpFont()}, sans-serif`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d9f0ff"/><stop offset="38%" stop-color="#fff3d9"/>
      <stop offset="68%" stop-color="#ffe3ef"/><stop offset="100%" stop-color="#e2f7e0"/>
    </linearGradient>
    <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2ea8ef"/><stop offset="50%" stop-color="#1a74e0"/><stop offset="100%" stop-color="#0d4696"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${[[70,110,"#ffd23f"],[1120,150,"#ef4b8d"],[160,540,"#5cbf4a"],[1050,520,"#21b6e8"],[600,70,"#f97316"]]
    .map(([x,y,c],i)=>`<rect x="${x}" y="${y}" width="26" height="16" rx="4" fill="${c}" transform="rotate(${i*27-30} ${x} ${y})" opacity=".85"/>`).join("")}
  <path d="M0 500 Q 300 432 600 492 T 1200 470 L1200 630 L0 630Z" fill="#8fd07a" opacity=".55"/>
  <path d="M0 548 Q 320 492 640 544 T 1200 528 L1200 630 L0 630Z" fill="#63b85c" opacity=".75"/>
  <g font-family="${FF}" text-anchor="middle">
    <text x="600" y="118" font-size="34" font-weight="bold" fill="#0f3a78">学校は、ひとつじゃない。学び方も、ひとつじゃない。</text>
    <text x="600" y="168" font-size="26" fill="#4a6480">全国13校のオルタナティブスクールと出会う2日間</text>
    <text x="600" y="300" font-size="104" font-weight="bold" fill="url(#t)" stroke="#ffffff" stroke-width="14" paint-order="stroke">オルスクフェス</text>
    <text x="540" y="418" font-size="112" font-weight="bold" fill="url(#t)" stroke="#ffffff" stroke-width="14" paint-order="stroke">2026</text>
    <rect x="700" y="352" width="200" height="60" rx="14" fill="#ef4b8d"/>
    <text x="800" y="396" font-size="38" font-weight="bold" fill="#ffffff">@ONLINE</text>
    <text x="600" y="492" font-size="56" font-weight="bold" fill="#0f59bd">9.26（土）/ 9.27（日）</text>
    <text x="600" y="560" font-size="28" font-weight="bold" fill="#ffffff">両日 9:00-12:00 ／ オンライン開催（Zoom）</text>
  </g>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(new URL("../public/ogp.png", import.meta.url), png);
console.log("public/ogp.png を生成しました");
