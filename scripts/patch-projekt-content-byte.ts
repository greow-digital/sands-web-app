/**
 * Patchar content (title, ort, typ, beskrivning) för 4 Sanity-projekt
 * där bilderna kommer från ett helt annat projekt än vad nuvarande
 * title/typ säger. Slug behålls för SEO/URL-bevarande.
 *
 * Använder Erik's strategi: behåll bilderna, anpassa content så det
 * "blir" det rätta Jimdo-projektet.
 *
 * Användning:
 *   npx tsx scripts/patch-projekt-content-byte.ts
 */
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

type ContentSwap = {
  slug: string;
  title: string;
  ort: string;
  typ: string;
  beskrivning: string;
  material: string;
};

const SWAPS: ContentSwap[] = [
  {
    slug: "takomlaggning-skokloster",
    title: "Köksrenovering, Spånga",
    ort: "Stockholm",
    typ: "Köksrenovering",
    beskrivning:
      "Köksrenovering i Spånga. Köket levereras av Vedum, modell Bianca.",
    material: "Vedum köksluckor, modell Bianca",
  },
  {
    slug: "takrenovering-sollentuna",
    title: "Kontorsombyggnation, Sollentuna",
    ort: "Sollentuna",
    typ: "Lokalrenovering",
    beskrivning:
      "Företagskund anlitade oss för ombyggnationen av deras nya kontor i Sollentuna.",
    material: "Gipsväggar, fast inredning och armatur",
  },
  {
    slug: "takomlaggning-upplands-vasby",
    title: "Lägenhetsrenovering, Upplands Väsby",
    ort: "Upplands Väsby",
    typ: "Lägenhetsrenovering",
    beskrivning: "Lägenhetsrenovering i Upplands Väsby.",
    material: "Helhetsrenovering inkl. badrum, kök och ytskikt",
  },
  {
    slug: "alstromervagen-skarholmen",
    title: "Bagarfruvägen, Sköndal",
    ort: "Stockholm",
    typ: "Totalentreprenad",
    beskrivning:
      "Sands i samverkan med Framfest Entreprenad. Komplett byggprojekt med grund, ytskikt och inredning.",
    material: "Helhetsentreprenad",
  },
];

async function main() {
  let ok = 0;
  let fail = 0;
  for (const s of SWAPS) {
    const doc = await client.fetch<{ _id: string; title?: string } | null>(
      `*[_type == "projekt" && slug.current == $slug][0]{ _id, title }`,
      { slug: s.slug }
    );
    if (!doc) {
      console.error(`✗ ${s.slug}: not found`);
      fail++;
      continue;
    }
    try {
      await client
        .patch(doc._id)
        .set({
          title: s.title,
          ort: s.ort,
          typ: s.typ,
          beskrivning: s.beskrivning,
          material: s.material,
        })
        .commit();
      console.log(`✓ ${s.slug}: "${doc.title}" → "${s.title}"`);
      ok++;
    } catch (err) {
      console.error(`✗ ${s.slug}:`, (err as Error).message);
      fail++;
    }
  }
  console.log(`\n──────────────────`);
  console.log(`✓ Patched: ${ok}`);
  console.log(`✗ Failed:  ${fail}`);
  console.log(`──────────────────\n`);
}
main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
