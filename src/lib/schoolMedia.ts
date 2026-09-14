import type { ImageMetadata } from "astro";

/**
 * src/assets/schools/<slug>/ に置かれた画像を拾う。
 * 置かれていなければ undefined / 空配列を返し、呼び出し側でイラストにフォールバックする。
 *
 *   logo.png | logo.jpg | logo.webp | logo.svg   … 学校ロゴ
 *   photo-1.jpg 〜 photo-9.jpg                   … 掲載写真（ファイル名順に表示）
 *   person.jpg | person-1.jpg …                  … 登壇者・代表者写真
 *
 * import.meta.glob はビルド時に静的解析されるため、
 * パターンとオプションは必ずリテラルで書くこと（変数に切り出すと動かない）。
 */

type Bitmap = Record<string, ImageMetadata>;

const logoBitmaps = import.meta.glob("/src/assets/schools/*/logo.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Bitmap;

const logoSvgs = import.meta.glob("/src/assets/schools/*/logo.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const photoBitmaps = import.meta.glob("/src/assets/schools/*/photo-*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Bitmap;

const personBitmaps = import.meta.glob("/src/assets/schools/*/person*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Bitmap;

const inSlug = (path: string, slug: string) => path.includes(`/schools/${slug}/`);

function pickImages(map: Bitmap, slug: string): ImageMetadata[] {
  return Object.entries(map)
    .filter(([path]) => inSlug(path, slug))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, img]) => img)
    .filter(Boolean);
}

export type Logo = { kind: "image"; src: ImageMetadata } | { kind: "url"; src: string };

export function logoFor(slug: string): Logo | undefined {
  const bitmap = pickImages(logoBitmaps, slug)[0];
  if (bitmap) return { kind: "image", src: bitmap };

  const svg = Object.entries(logoSvgs).find(([path]) => inSlug(path, slug));
  return svg ? { kind: "url", src: svg[1] } : undefined;
}

export const hasLogo = (slug: string) => logoFor(slug) !== undefined;

export const photosFor = (slug: string) => pickImages(photoBitmaps, slug);
export const personFor = (slug: string) => pickImages(personBitmaps, slug)[0];
