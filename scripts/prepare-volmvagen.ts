/**
 * Komprimerar + döper om utvalda Volmvägen-bilder.
 * 4 bilder: 1 efter (huvudbild) + 1 före + 1 process + 1 efter.
 * Sparar till scripts/cache/volmvagen-ready/.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "/Users/wherkligheten/Sands-web/sandsab-bilder/projekt volmvägen 6";
const OUT = path.join(process.cwd(), "scripts/cache/volmvagen-ready");

const SELECTION = [
  {
    src: "WhatsApp Image 2026-06-02 at 16.38.08 (2).jpeg",
    out: "volmvagen-1-efter-framsida.jpg",
    alt: "Volmvägen, Järfälla, efter fasadrenovering framsida",
  },
  {
    src: "WhatsApp Image 2026-06-02 at 16.38.08.jpeg",
    out: "volmvagen-2-fore-framsida.jpg",
    alt: "Volmvägen, Järfälla, före fasadrenovering framsida",
  },
  {
    src: "WhatsApp Image 2026-06-02 at 16.38.08 (1).jpeg",
    out: "volmvagen-3-process-baksida.jpg",
    alt: "Volmvägen, Järfälla, under pågående fasadrenovering baksida",
  },
  {
    src: "WhatsApp Image 2026-06-02 at 16.38.08 (4).jpeg",
    out: "volmvagen-4-efter-baksida.jpg",
    alt: "Volmvägen, Järfälla, efter fasadrenovering baksida",
  },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const s of SELECTION) {
    const buf = await fs.readFile(path.join(SRC, s.src));
    const before = buf.length;
    // 1200x1600 originalstorlek - behåll dim, bara komprimera
    const out = await sharp(buf)
      .jpeg({
        quality: 78,
        mozjpeg: true,
        progressive: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();
    await fs.writeFile(path.join(OUT, s.out), out);
    const red = (((before - out.length) / before) * 100).toFixed(1);
    console.log(
      `${s.out}: ${(before / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB (-${red}%)`
    );
  }
}
main();
