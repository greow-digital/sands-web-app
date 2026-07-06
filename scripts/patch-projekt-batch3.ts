/**
 * Patchar de sista 2 tvetydiga + tar bort dubbletten skovelvagen-alvsjo-2.
 */
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

loadEnvConfig(process.cwd());

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2026-05-27",
  useCdn: false,
});

type Img = {
  _key?: string;
  _type?: "image";
  asset?: { _type?: "reference"; _ref?: string };
  alt?: string | null;
};

async function patchHasselby() {
  console.log("\n→ takomlaggning-hasselby");
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type == "projekt" && slug.current == "takomlaggning-hasselby"][0]{ _id }`
  );
  if (!doc) {
    console.error("  ✗ not found");
    return;
  }
  await client
    .patch(doc._id)
    .set({ beskrivning: "Takomläggning i Hässelby." })
    .commit();
  console.log(`  ✓ patched`);
}

async function patchUpplandsVasby() {
  console.log("\n→ takomlaggning-upplands-vasby (text + hero swap till idx-11)");
  const doc = await client.fetch<{
    _id: string;
    title: string;
    huvudbild: Img;
    bilder: Img[];
  } | null>(
    `*[_type == "projekt" && slug.current == "takomlaggning-upplands-vasby"][0]{ _id, title, huvudbild, bilder }`
  );
  if (!doc || !doc.bilder || doc.bilder.length <= 11) {
    console.error("  ✗ not found or gallery too short");
    return;
  }
  const oldHero = doc.huvudbild;
  const newHeroFromGallery = doc.bilder[11];
  if (!oldHero?.asset?._ref || !newHeroFromGallery?.asset?._ref) {
    console.error("  ✗ missing asset refs");
    return;
  }
  const newHero: Img = {
    _type: "image",
    asset: { _type: "reference", _ref: newHeroFromGallery.asset._ref },
    alt: newHeroFromGallery.alt ?? doc.title,
  };
  const replacedGalleryEntry: Img = {
    _key: newHeroFromGallery._key ?? randomUUID().slice(0, 12),
    _type: "image",
    asset: { _type: "reference", _ref: oldHero.asset._ref },
    alt: oldHero.alt ?? `${doc.title}, bild 12`,
  };
  const newBilder = doc.bilder.map((b, i) =>
    i === 11 ? replacedGalleryEntry : b
  );
  await client
    .patch(doc._id)
    .set({
      beskrivning:
        "Takomläggning i Upplands Väsby. Två fastigheter som valt att byta ut sitt gamla tak.",
      huvudbild: newHero,
      bilder: newBilder,
    })
    .commit();
  console.log(`  ✓ patched`);
}

async function deleteSkovelvagen2() {
  console.log("\n→ skovelvagen-alvsjo-2 (delete duplicate)");
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type == "projekt" && slug.current == "skovelvagen-alvsjo-2"][0]{ _id }`
  );
  if (!doc) {
    console.error("  ✗ not found");
    return;
  }
  await client.delete(doc._id);
  console.log(`  ✓ deleted ${doc._id}`);
}

async function main() {
  await patchHasselby();
  await patchUpplandsVasby();
  await deleteSkovelvagen2();
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
