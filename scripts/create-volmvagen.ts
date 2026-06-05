/**
 * Skapar projektet Volmvägen, Järfälla i Sanity.
 *  - Laddar upp 4 bilder som assets
 *  - Skapar projekt-dokumentet (publicerat direkt)
 *  - Idempotent: skippar om slug redan finns
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

loadEnvConfig(process.cwd());

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2026-05-27",
  useCdn: false,
});

const IMG_DIR = path.join(process.cwd(), "scripts/cache/volmvagen-ready");

const SLUG = "volmvagen-jarfalla";

const IMAGES = [
  {
    file: "volmvagen-1-efter-framsida.jpg",
    alt: "Volmvägen 6 efter fasadrenovering, framsidan med ny gråmålad panel",
    isHero: true,
  },
  {
    file: "volmvagen-2-fore-framsida.jpg",
    alt: "Volmvägen 6 före renovering, framsidan med vit panel och rött räcke",
    isHero: false,
  },
  {
    file: "volmvagen-3-process-baksida.jpg",
    alt: "Volmvägen 6 under pågående fasadrenovering, baksidan",
    isHero: false,
  },
  {
    file: "volmvagen-4-efter-baksida.jpg",
    alt: "Volmvägen 6 efter fasadrenovering, baksidan med terrass",
    isHero: false,
  },
];

async function uploadImage(filename: string, alt: string) {
  const filePath = path.join(IMG_DIR, filename);
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload("image", stream, {
    filename,
    label: alt,
  });
  return asset._id;
}

async function main() {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "projekt" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG }
  );
  if (existing) {
    console.log(`⏭  ${SLUG} finns redan (${existing._id}). Avbryter.`);
    return;
  }

  console.log("↑ Laddar upp 4 bilder...");
  const uploaded: Array<{ assetId: string; alt: string; isHero: boolean }> = [];
  for (const img of IMAGES) {
    const id = await uploadImage(img.file, img.alt);
    console.log(`  ✓ ${img.file}`);
    uploaded.push({ assetId: id, alt: img.alt, isHero: img.isHero });
  }

  const hero = uploaded.find((u) => u.isHero)!;
  const gallery = uploaded.filter((u) => !u.isHero);

  const doc = {
    _type: "projekt" as const,
    _id: randomUUID(),
    title: "Volmvägen, Järfälla",
    slug: { _type: "slug" as const, current: SLUG },
    ort: "Järfälla",
    typ: "Fasadrenovering",
    kvm: 118,
    ar: 2026,
    material: "Z-panel/enkelfaspanel 22x120 + västkustskiva",
    beskrivning:
      "Helhetsentreprenad i Järfälla med fasaduppgradering, garagerenovering och nytt garagetak. Ny Z-panel och västkustskiva på gavlar, ny lockpanel på garaget med målning, nytt tätskikt (papp på papp) med svarta hängrännor och stuprör, samt balkongrenovering med byte av bärande balkar och inklädnad med plåt. Demontering och återmontering av markiser ingår.",
    taggar: ["Fasadrenovering", "Järfälla", "Helhetsentreprenad", "Garagerenovering"],
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
  console.log(`  Slug: ${SLUG}`);
  console.log(`  URL: https://sandsab.se/projekt/${SLUG}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
