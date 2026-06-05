import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";
import sharp from "sharp";

loadEnvConfig(process.cwd());

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2026-05-27",
  useCdn: false,
});

const SRC = "/Users/wherkligheten/Sands-web/sandsab-bilder/Viksjö tak";
const TMP = path.join(process.cwd(), "scripts/cache/viksjo-ready");
const SLUG = "viksjo-jarfalla";

const IMAGES = [
  { src: "viksjö efter.jpg", out: "viksjo-1-efter.jpg", alt: "Viksjö, Järfälla, efter takomläggning med röda tegelpannor", role: "hero-and-efter" },
  { src: "viksjo-fore.jpg", out: "viksjo-2-fore.jpg", alt: "Viksjö, Järfälla, före takomläggning med slitna pannor", role: "fore" },
  { src: "PHOTO-2026-05-07-17-49-28 (2).jpg", out: "viksjo-3-pagaende.jpg", alt: "Viksjö, Järfälla, pågående takarbete med rivning och nya pannor", role: "gallery" },
  { src: "PHOTO-2026-05-07-17-49-28 (3).jpg", out: "viksjo-4-gammalt.jpg", alt: "Viksjö, Järfälla, närbild av gamla slitna takpannor", role: "gallery" },
  { src: "PHOTO-2026-05-07-17-49-28 (4).jpg", out: "viksjo-5-laggning.jpg", alt: "Viksjö, Järfälla, nya tegelpannor läggs på läkter", role: "gallery" },
];

async function compress(srcFile: string, outFile: string) {
  const buf = await fs.promises.readFile(path.join(SRC, srcFile));
  const out = await sharp(buf)
    .jpeg({ quality: 78, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" })
    .toBuffer();
  await fs.promises.writeFile(path.join(TMP, outFile), out);
  console.log(`  ${outFile}: ${(buf.length / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB`);
}

async function uploadImage(filename: string, alt: string) {
  const stream = fs.createReadStream(path.join(TMP, filename));
  const asset = await client.assets.upload("image", stream, { filename, label: alt });
  return asset._id;
}

async function main() {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "projekt" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG }
  );
  if (existing) {
    console.log(`⏭  ${SLUG} finns redan`);
    return;
  }

  await fs.promises.mkdir(TMP, { recursive: true });
  console.log("Komprimerar...");
  for (const img of IMAGES) await compress(img.src, img.out);

  console.log("\n↑ Laddar upp...");
  const uploaded: Array<{ assetId: string; alt: string; role: string }> = [];
  for (const img of IMAGES) {
    const id = await uploadImage(img.out, img.alt);
    console.log(`  ✓ ${img.out}`);
    uploaded.push({ assetId: id, alt: img.alt, role: img.role });
  }

  const heroAndEfter = uploaded.find((u) => u.role === "hero-and-efter")!;
  const fore = uploaded.find((u) => u.role === "fore")!;
  const gallery = uploaded.filter((u) => u.role === "gallery");

  const doc = {
    _type: "projekt" as const,
    _id: randomUUID(),
    title: "Viksjö, Järfälla",
    slug: { _type: "slug" as const, current: SLUG },
    ort: "Järfälla",
    typ: "Tegeltak",
    kvm: 220,
    ar: 2026,
    material: "Tegelpannor från BMI Icopal",
    beskrivning:
      "Komplett takomläggning i Viksjö, Järfälla. Gamla slitna pannor ersätts med nya röda tegelpannor från BMI Icopal. Två sammanhängande huskroppar med totalt cirka 220 kvm takyta lagdes om för ett hållbart och vackert slutresultat.",
    taggar: ["Tegeltak", "Järfälla", "Viksjö", "Takomläggning", "BMI Icopal"],
    huvudbild: {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: heroAndEfter.assetId },
      alt: heroAndEfter.alt,
    },
    bilder: gallery.map((g) => ({
      _key: randomUUID().slice(0, 12),
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: g.assetId },
      alt: g.alt,
    })),
    foreImage: {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: fore.assetId },
      alt: fore.alt,
    },
    efterImage: {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: heroAndEfter.assetId },
      alt: heroAndEfter.alt,
    },
  };

  const created = await client.create(doc);
  console.log(`\n✓ Skapat ${created._id}`);
  console.log(`  URL: https://sandsab.se/projekt/${SLUG}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
