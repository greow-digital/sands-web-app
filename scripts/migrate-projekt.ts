/**
 * One-shot migration: lib/projekt.ts → Sanity.
 *
 * For each projekt:
 *   1. Upload huvudbild (first image) as a Sanity asset.
 *   2. Upload gallery images (images[1..]) as Sanity assets.
 *   3. Create a published "projekt" document referencing those assets.
 *
 * Idempotent: skips projekt whose slug already exists in Sanity.
 *
 * Run from sands-web-app/ root:
 *   npx tsx scripts/migrate-projekt.ts
 *
 * Requires SANITY_WRITE_TOKEN in .env.local (Editor token).
 */

import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";
import { projekt as alla } from "../lib/projekt";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local."
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

const IMAGES_DIR = path.join(process.cwd(), "public", "images", "projekt");

async function uploadImage(relPath: string, altLabel: string): Promise<{
  assetId: string;
} | null> {
  const filename = path.basename(relPath);
  const absPath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠ Missing image file: ${filename}`);
    return null;
  }

  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload("image", stream, {
    filename,
    label: altLabel,
  });
  return { assetId: asset._id };
}

function buildImageField(assetId: string, alt: string) {
  return {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: assetId,
    },
    alt,
  };
}

async function getExistingSlugs(): Promise<Set<string>> {
  const slugs = await client.fetch<string[]>(
    '*[_type == "projekt" && defined(slug.current)].slug.current'
  );
  return new Set(slugs);
}

async function main() {
  console.log(`\n→ Sanity project ${projectId}, dataset ${dataset}`);
  console.log(`→ ${alla.length} projekt to migrate from lib/projekt.ts\n`);

  const existing = await getExistingSlugs();
  if (existing.size > 0) {
    console.log(`ℹ ${existing.size} projekt already in Sanity (will skip)\n`);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const [i, p] of alla.entries()) {
    const tag = `[${i + 1}/${alla.length}]`;

    if (existing.has(p.slug)) {
      console.log(`${tag} ⏭  ${p.slug} (already exists, skipping)`);
      skipped++;
      continue;
    }

    console.log(`${tag} ↑  ${p.slug} — ${p.title}`);

    try {
      // Upload main image
      const main = await uploadImage(p.image, p.title);
      if (!main) {
        console.error(`     ✗ Skipping projekt — main image missing`);
        failed++;
        continue;
      }
      console.log(`     ↑ main image ✓`);

      // Upload gallery images (all images except the first, which is the main)
      const gallerySources = (p.images ?? []).filter(
        (img) => img !== p.image
      );
      const gallery: Array<{
        _key: string;
        _type: "image";
        asset: { _type: "reference"; _ref: string };
        alt: string;
      }> = [];

      for (const [gi, src] of gallerySources.entries()) {
        const uploaded = await uploadImage(src, `${p.title}, bild ${gi + 2}`);
        if (!uploaded) continue;
        gallery.push({
          _key: randomUUID().slice(0, 12),
          ...buildImageField(uploaded.assetId, `${p.title}, bild ${gi + 2}`),
        });
      }
      if (gallery.length > 0) {
        console.log(`     ↑ ${gallery.length} gallery images ✓`);
      }

      // Create the published document (no "drafts." prefix)
      const doc = {
        _type: "projekt" as const,
        _id: randomUUID(),
        title: p.title,
        slug: { _type: "slug" as const, current: p.slug },
        ort: p.ort,
        typ: p.typ,
        kvm: p.kvm,
        ar: p.år,
        material: p.material,
        beskrivning: p.beskrivning,
        taggar: p.taggar ?? [],
        huvudbild: buildImageField(main.assetId, p.title),
        bilder: gallery,
      };

      await client.create(doc);
      console.log(`     ✓ document created\n`);
      created++;
    } catch (err) {
      console.error(`     ✗ Failed:`, (err as Error).message, "\n");
      failed++;
    }
  }

  const secs = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log(`\n──────────────────────────────`);
  console.log(`✓ Created:  ${created}`);
  console.log(`⏭  Skipped: ${skipped}`);
  console.log(`✗ Failed:  ${failed}`);
  console.log(`⏱  Time:    ${secs}s`);
  console.log(`──────────────────────────────\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
