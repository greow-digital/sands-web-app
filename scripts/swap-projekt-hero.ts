/**
 * Swappar huvudbild ↔ gallery[newHeroIdx] för utvalda projekt.
 *
 * Strategi (icke-destruktiv):
 *   - Ny huvudbild = gammal gallery[newHeroIdx] (utan _key)
 *   - Gallery[newHeroIdx] ersätts av gamla huvudbilden (med nytt _key + alt)
 *   - Gallery-ordning och storlek bevaras
 *
 * Användning:
 *   npx tsx scripts/swap-projekt-hero.ts
 *
 * Kräver SANITY_WRITE_TOKEN i .env.local.
 */
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET + SANITY_WRITE_TOKEN required."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-05-27",
  useCdn: false,
});

type Swap = { slug: string; newHeroIdx: number; reason: string };

const SWAPS: Swap[] = [
  {
    slug: "nytorpsvagen-koping",
    newHeroIdx: 4,
    reason: "Tidigare hero = tomt rum; idx-4 = vit villa med rött tegeltak",
  },
  {
    slug: "norrangsvagen-huddinge",
    newHeroIdx: 2,
    reason: "Tidigare hero = vitt kök; idx-2 = rött hus med rött tegeltak",
  },
];

type Img = {
  _key?: string;
  _type?: "image";
  asset?: { _type?: "reference"; _ref?: string };
  alt?: string | null;
};

async function main() {
  for (const sw of SWAPS) {
    console.log(`\n→ ${sw.slug} (idx ${sw.newHeroIdx})`);
    console.log(`  ${sw.reason}`);

    const doc = await client.fetch<{
      _id: string;
      title: string;
      huvudbild: Img;
      bilder: Img[];
    } | null>(
      `*[_type == "projekt" && slug.current == $slug][0]{ _id, title, huvudbild, bilder }`,
      { slug: sw.slug }
    );

    if (!doc) {
      console.error(`  ✗ Projekt ${sw.slug} not found`);
      continue;
    }

    if (!doc.bilder || sw.newHeroIdx >= doc.bilder.length) {
      console.error(
        `  ✗ idx ${sw.newHeroIdx} out of range (gallery length ${doc.bilder?.length ?? 0})`
      );
      continue;
    }

    const oldHero = doc.huvudbild;
    const newHeroFromGallery = doc.bilder[sw.newHeroIdx];

    if (!oldHero?.asset?._ref || !newHeroFromGallery?.asset?._ref) {
      console.error(`  ✗ Missing asset ref on one of the images`);
      continue;
    }

    // Ny huvudbild: kopia av gallery-bilden men utan _key (huvudbild är inte i array)
    const newHero: Img = {
      _type: "image",
      asset: { _type: "reference", _ref: newHeroFromGallery.asset._ref },
      alt: newHeroFromGallery.alt ?? doc.title,
    };

    // Gallery-bilden ersätts av gamla huvudbilden (behåll _key och _type)
    const replacedGalleryEntry: Img = {
      _key: newHeroFromGallery._key ?? randomUUID().slice(0, 12),
      _type: "image",
      asset: { _type: "reference", _ref: oldHero.asset._ref },
      alt: oldHero.alt ?? `${doc.title}, bild ${sw.newHeroIdx + 1}`,
    };

    const newBilder = doc.bilder.map((b, i) =>
      i === sw.newHeroIdx ? replacedGalleryEntry : b
    );

    try {
      await client
        .patch(doc._id)
        .set({ huvudbild: newHero, bilder: newBilder })
        .commit();
      console.log(`  ✓ Patched ${doc._id}`);
    } catch (err) {
      console.error(`  ✗ Patch failed:`, (err as Error).message);
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
