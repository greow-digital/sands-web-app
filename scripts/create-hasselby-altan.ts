/**
 * Skapar Hässelby Altanbygge i Sanity + kopierar video.
 */
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

const SRC = "/Users/wherkligheten/Sands-web/sandsab-bilder/Hässelby Altanbygge";
const TMP = path.join(process.cwd(), "scripts/cache/hasselby-altan-ready");
const SLUG = "altanbygge-hasselby";

const IMAGES = [
  {
    src: "WhatsApp Image 2026-06-05 at 09.07.07.jpeg",
    out: "altanbygge-hasselby-1-hero.jpg",
    alt: "Altanbygge i Hässelby, översiktsvy med ny träaltan",
    isHero: true,
  },
  {
    src: "WhatsApp Image 2026-06-05 at 09.07.07 (1).jpeg",
    out: "altanbygge-hasselby-2.jpg",
    alt: "Altanbygge i Hässelby, bredd vy av träaltan",
    isHero: false,
  },
  {
    src: "WhatsApp Image 2026-06-05 at 09.07.07 (2).jpeg",
    out: "altanbygge-hasselby-3.jpg",
    alt: "Altanbygge i Hässelby, hörndetalj av träaltan",
    isHero: false,
  },
];

async function compress(srcFile: string, outFile: string) {
  const buf = await fs.promises.readFile(path.join(SRC, srcFile));
  const optimized = await sharp(buf)
    .jpeg({ quality: 78, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" })
    .toBuffer();
  await fs.promises.writeFile(path.join(TMP, outFile), optimized);
  console.log(`  ${outFile}: ${(buf.length / 1024).toFixed(0)} KB → ${(optimized.length / 1024).toFixed(0)} KB`);
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
    console.log(`⏭  ${SLUG} finns redan (${existing._id})`);
    return;
  }

  await fs.promises.mkdir(TMP, { recursive: true });

  console.log("Komprimerar bilder...");
  for (const img of IMAGES) await compress(img.src, img.out);

  console.log("\n↑ Laddar upp bilder...");
  const uploaded: Array<{ assetId: string; alt: string; isHero: boolean }> = [];
  for (const img of IMAGES) {
    const id = await uploadImage(img.out, img.alt);
    console.log(`  ✓ ${img.out}`);
    uploaded.push({ assetId: id, alt: img.alt, isHero: img.isHero });
  }

  const hero = uploaded.find((u) => u.isHero)!;
  const gallery = uploaded.filter((u) => !u.isHero);

  const doc = {
    _type: "projekt" as const,
    _id: randomUUID(),
    title: "Altanbygge, Hässelby",
    slug: { _type: "slug" as const, current: SLUG },
    ort: "Stockholm",
    typ: "Altanbygge",
    kvm: 70,
    ar: 2026,
    material: "Tryckimpregnerad trätrall",
    beskrivning:
      "Vi utförde ett altanbygge i Hässelby där kunden ville bygga ut sin nuvarande altan med runt 70 kvm. Vi var med och designade det och skapade tillsammans med kund en fantastisk uteplats med små detaljer och smart design för att de ska kunna njuta av den maximalt.",
    taggar: ["Altanbygge", "Hässelby", "Stockholm", "Snickeri", "Uteplats"],
    huvudbild: {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: hero.assetId },
      alt: hero.alt,
    },
    bilder: gallery.map((g) => ({
      _key: randomUUID().slice(0, 12),
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: g.assetId },
      alt: g.alt,
    })),
  };

  const created = await client.create(doc);
  console.log(`\n✓ Skapat projekt ${created._id}`);
  console.log(`  URL: https://sandsab.se/projekt/${SLUG}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
