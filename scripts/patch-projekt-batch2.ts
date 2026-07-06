/**
 * Patchar 19 av de återstående 25 projekten med Jimdo-beskrivningar.
 * Inkluderar inte takomlaggning-huddinge (Jimdo har bara titel),
 * takrenovering-sollentuna/taby (samma), takomlaggning-hasselby
 * och takomlaggning-upplands-vasby (behöver visuell verifikation),
 * eller skovelvagen-alvsjo-2 (ska tas bort).
 *
 * Användning:
 *   npx tsx scripts/patch-projekt-batch2.ts
 */
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

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

type Patch = { slug: string; beskrivning: string };

const PATCHES: Patch[] = [
  {
    slug: "takomlaggning-farsta",
    beskrivning:
      "Vi har fått förnyat förtroende i Farsta. 6 nya fastigheter som valt att lägga om sitt tak. Gamla betongpannor ersätts med nya från Monier, kunden har valt Jönåker Elegant i svart kulör.",
  },
  {
    slug: "takomlaggning-grodinge",
    beskrivning:
      "Takomläggning i Grödinge. Kund har valt Jönåker Elegant i svart kulör. Här installeras även ett nytt takfönster från Velux.",
  },
  {
    slug: "frotunagrand-upplands-vasby",
    beskrivning:
      "Takomläggning med takutsprång i Upplands Väsby. Gamla betongpannor ersätts med nya från Monier, kunden har valt Jönåker Protector 2.0 ifrån Monier. Här kommer vi även att montera snörasskydd från CW Lundbergs samt fasadrenovering.",
  },
  {
    slug: "stenvagen-vaxholm",
    beskrivning:
      "Takomläggning på Stenvägen, Vaxholm. Takpannorna byts samt fasadrenovering ingår i projektet.",
  },
  {
    slug: "takomlaggning-skokloster",
    beskrivning:
      "Takomläggning samt byte av masonit mot råspont. Kunden har valt att byta ut sina gamla betongpannor till Monier Jönåker Elegant i tegelröd kulör. Vi kommer även att renovera båtstugan.",
  },
  {
    slug: "badrumsrenovering-norsborg",
    beskrivning: "Badrumsrenovering på Norsborg.",
  },
  {
    slug: "enskededalen-stockholm",
    beskrivning:
      "Lägenhetsrenovering Enskededalen. Lägenheten totalrenoveras. Arbetet beräknas vara slutfört i mitten av juni 2017.",
  },
  {
    slug: "fasadmalning-vallingby",
    beskrivning: "Fasadmålning i Vällingby.",
  },
  {
    slug: "haggvagen-jarfalla",
    beskrivning:
      "Lägenhetsrenovering på Häggvägen, Järfälla. Lägenheten totalrenoveras. Kunden har valt Jönåker Elegant från Monier. Arbetet vara slutfört Mars 2017.",
  },
  {
    slug: "takomlaggning-enskede",
    beskrivning:
      "Takomläggning i Enskede. Kund har valt Monier Jönåker Elegant i tegelröd kulör.",
  },
  {
    slug: "takomlaggning-lidingo",
    beskrivning:
      "Takomläggning ute på Lidingö. Kunderna har valt Jönåker Elegant i svart kulör.",
  },
  {
    slug: "finplanering-enkoping",
    beskrivning:
      "Finplanering ute i Bredsand, Enköping. Här kommer markarbetet innefatta en ny garageuppfart samt gräsläggning.",
  },
  {
    slug: "nybyggnation-uttran",
    beskrivning: "Nybyggnation av entrébyggnad i Uttran.",
  },
  {
    slug: "radhusslingan-strangnas",
    beskrivning: "Finplanering vid Radhusslingan i Strängnäs.",
  },
  {
    slug: "totalrenovering-jarfalla",
    beskrivning:
      "Totalrenovering av radhus i Järfälla. Invändig och utvändig renovering.",
  },
  {
    slug: "lagenhetsrenovering-kungsholmen",
    beskrivning:
      "Lägenhetsrenovering på Kungsholmen. Här valde kunden att ändra planlösningen ifrån dagens 2 rok till 3 rok. Badrummet har byggts ut samt flytt av kök.",
  },
  {
    slug: "takomlaggning-nykoping",
    beskrivning:
      "Takomläggning samt plåtarbeten i Nyköping på en K-märkt fastighet. Monier Vittinge tvåkupigt är valt av kund.",
  },
  {
    slug: "takomlaggning-upplands-bro",
    beskrivning:
      "Takomläggning i Bro. Kund har valt nytt plåttak, modell Plannja Royal. Vi kommer även att byta ut två takfönster.",
  },
  {
    slug: "takomlaggning-gnesta",
    beskrivning:
      "Takomläggning i Gnesta. Kund har valt nya pannor från Monier, modell Jönåker Elegant i svart kulör.",
  },
];

async function main() {
  let ok = 0;
  let fail = 0;
  for (const p of PATCHES) {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "projekt" && slug.current == $slug][0]{ _id }`,
      { slug: p.slug }
    );
    if (!doc) {
      console.error(`✗ ${p.slug}: not found`);
      fail++;
      continue;
    }
    try {
      await client
        .patch(doc._id)
        .set({ beskrivning: p.beskrivning })
        .commit();
      console.log(`✓ ${p.slug}`);
      ok++;
    } catch (err) {
      console.error(`✗ ${p.slug}:`, (err as Error).message);
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
