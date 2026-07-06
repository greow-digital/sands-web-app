/**
 * Patchar projekt 1:1 mot Jimdo-källan:
 *   - beskrivning (rikare text från Jimdo med material/modell)
 *   - huvudbild via swap mot gallery[heroIdx] när nuvarande hero är fel
 *
 * Beskrivningar är transkriberade ordagrant från Jimdo-skärmdump.
 * Om Jimdo har faktafel (t.ex. "Takomläggning i Tumba" under
 * Huddinge-projekt) kopieras det 1:1 — felet ligger hos källan.
 *
 * Användning:
 *   npx tsx scripts/patch-projekt-from-jimdo.ts
 */
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing env.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-05-27",
  useCdn: false,
});

type Patch = {
  slug: string;
  beskrivning: string;
  heroSwapIdx?: number;
  heroSwapReason?: string;
};

const PATCHES: Patch[] = [
  {
    slug: "fagerasen-vrena",
    beskrivning:
      "Takomläggning i Fageråsen, Vrena. Kund har valt att lägga om taket med tegelröda betongpannor ifrån Monier, modell Jönåker elegant.",
  },
  {
    slug: "solfagravagen-huddinge",
    beskrivning:
      "Takomläggning i Huddinge. Gamla betongpannor ersätts med nya ifrån Monier, kunden har valt Jönåker Elegant i svart kulör.",
  },
  {
    slug: "skrattmasvagen-farsta",
    beskrivning:
      "Takomläggning av två fastigheter i Farsta. Gamla betongpannor ersätts med nya ifrån Monier, kunden har valt Jönåker Elegant i svart kulör.",
  },
  {
    slug: "plommonvagen-bromma",
    beskrivning:
      "Takomläggning på Plommonvägen i Bromma. Kund har valt att lägga om taket med tegelröda betongpannor ifrån Monier, modell Jönåker elegant.",
  },
  {
    slug: "sorgardsvagen-bromma",
    beskrivning:
      "Ommålning av fasadpanel i Bromma. Här kommer även takfotsuthäng, gaveluthäng och vindskivor att målas om.",
  },
  {
    slug: "vartavagen-taby",
    beskrivning:
      "Takomläggning med målning av takutsprång i Täby. Gamla betongpannor ersätts med nya ifrån Monier, kunden har valt Jönåker Elegant i svart kulör. Här kommer vi även att montera snörasskydd från CW Lundbergs.",
  },
  {
    slug: "hakevagen-djursholm",
    beskrivning:
      "Takomläggning med takutsprång i Djursholm. Gammalt taktegel ersätts med nytt taktegel. Här har kunden valt att lägga om taket med svart taktegel, modell Monier Hollander.",
  },
  {
    slug: "kastanjetunet-lidingo",
    beskrivning:
      "Takomläggning på Kastanjetunet, Lidingö. Här har kunden valt betongpannor ifrån Benders, modell Palema.",
  },
  {
    slug: "nytorpsvagen-koping",
    beskrivning:
      "Takomläggning med målning av takutsprång i Köping. Gamla betongpannor ersätts med nya ifrån Monier, kunden har valt Jönåker Elegant i svart kulör.",
    heroSwapIdx: 4,
    heroSwapReason: "Nuvarande hero = tomt rum; idx-4 = vit villa med rött tegeltak",
  },
  {
    slug: "timmerbacken-tumba",
    beskrivning:
      "Takomläggning på Timmerbacken i Tumba. Kund har valt att lägga om taket med Monier Jönåker Elegant, tegelröda.",
  },
  {
    slug: "prastgardsvagen-tumba",
    beskrivning:
      "Takomläggning i Tumba. Gammalt tak skall bytas mot betongpannor. Totalt är det sju radhus som har valt betongpannor ifrån Monier, modell Jönåker Protector 2.0 ifrån Monier.",
  },
  {
    slug: "norrangsvagen-huddinge",
    beskrivning:
      "Takomläggning i Tumba. Gammalt tak skall bytas mot betongpannor. Totalt är det tre grannar som valt att lägga om taket.",
    heroSwapIdx: 2,
    heroSwapReason: "Nuvarande hero = vitt kök; idx-2 = rött hus med rött tegeltak",
  },
  {
    slug: "skovelvagen-alvsjo",
    beskrivning:
      "Takomläggning på Skovelvägen i Älvsjö. Kund har valt att lägga om taket med tvåkupigt lertegel ifrån Monier.",
  },
  {
    slug: "skacklingevagen-tumba",
    beskrivning:
      "Takomläggning i Tumba. Gammalt tak skall bytas mot betongpannor. Kunden har valt Monier Protector 2.0 ifrån Monier.",
  },
  {
    slug: "alstromervagen-skarholmen",
    beskrivning:
      "Takomläggning av shingeltak ifrån Icopal. Arbetet påbörjas med rivning av gammal eternit. Asbestsaneringen samt rivningsarbetet utför Stockholm Riv & Asbestsanering. Här kommer vi även montera nytt vattensystem.",
    // Ingen heroSwap — alla 3 galleri-bilder är interiör/nybyggnation
  },
];

type Img = {
  _key?: string;
  _type?: "image";
  asset?: { _type?: "reference"; _ref?: string };
  alt?: string | null;
};

async function main() {
  let patched = 0;
  let failed = 0;

  for (const p of PATCHES) {
    console.log(`\n→ ${p.slug}`);

    const doc = await client.fetch<{
      _id: string;
      title: string;
      huvudbild: Img;
      bilder: Img[];
    } | null>(
      `*[_type == "projekt" && slug.current == $slug][0]{ _id, title, huvudbild, bilder }`,
      { slug: p.slug }
    );

    if (!doc) {
      console.error(`  ✗ not found`);
      failed++;
      continue;
    }

    const patchPayload: Record<string, unknown> = { beskrivning: p.beskrivning };

    if (p.heroSwapIdx !== undefined) {
      console.log(`  swap hero ↔ idx-${p.heroSwapIdx}: ${p.heroSwapReason}`);

      if (!doc.bilder || p.heroSwapIdx >= doc.bilder.length) {
        console.error(`  ✗ idx ${p.heroSwapIdx} out of range`);
        failed++;
        continue;
      }

      const oldHero = doc.huvudbild;
      const newHeroFromGallery = doc.bilder[p.heroSwapIdx];

      if (!oldHero?.asset?._ref || !newHeroFromGallery?.asset?._ref) {
        console.error(`  ✗ Missing asset ref`);
        failed++;
        continue;
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
        alt: oldHero.alt ?? `${doc.title}, bild ${p.heroSwapIdx + 1}`,
      };

      patchPayload.huvudbild = newHero;
      patchPayload.bilder = doc.bilder.map((b, i) =>
        i === p.heroSwapIdx ? replacedGalleryEntry : b
      );
    }

    try {
      await client.patch(doc._id).set(patchPayload).commit();
      console.log(`  ✓ patched ${doc._id}`);
      patched++;
    } catch (err) {
      console.error(`  ✗ patch failed:`, (err as Error).message);
      failed++;
    }
  }

  console.log(`\n──────────────────────────────`);
  console.log(`✓ Patched: ${patched}`);
  console.log(`✗ Failed:  ${failed}`);
  console.log(`──────────────────────────────\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
