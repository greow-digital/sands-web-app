/**
 * Komprimerar hero-bilder utan att ändra dimensioner.
 * Sänker filstorlek från 0.5-1.7 MB till ~120-250 KB med visuellt
 * acceptabel JPEG-kvalitet (mozjpeg, q=78, progressive).
 *
 * Original skrivs över - git fångar förändringen så vi kan revert om
 * kvalitén ser dålig ut.
 *
 * Användning:
 *   npx tsx scripts/compress-hero-images.ts
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");

// Hero-bilder som visas above-the-fold på respektive sida
const HEROS = [
  "hero-house.jpg",
  "hero-sands-construction.jpg",
  "hero-offert.jpg",
  "hero-priser.jpg",
];

async function compress(filename: string) {
  const fullPath = path.join(PUBLIC_IMAGES, filename);
  const before = (await fs.stat(fullPath)).size;
  const buffer = await fs.readFile(fullPath);

  // mozjpeg + q=78 ger bra balans mellan storlek och kvalitet på fotografier
  // progressive: streaming-render i browser
  // chromaSubsampling 4:2:0: ~10-15% mindre filstorlek, knappt synlig på foto
  const optimized = await sharp(buffer)
    .jpeg({
      quality: 78,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();

  await fs.writeFile(fullPath, optimized);
  const after = optimized.length;
  const reduction = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `${filename}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (-${reduction}%)`
  );
}

async function main() {
  for (const f of HEROS) {
    try {
      await compress(f);
    } catch (err) {
      console.error(`✗ ${f}: ${(err as Error).message}`);
    }
  }
}

main();
