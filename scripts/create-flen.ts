/**
 * Skapar projektet Takomläggning, Flen i Sanity.
 *
 * ANONYMISERAT PROJEKT. Kunden har begärt att varken namn eller adress
 * publiceras, bara kommunen. Skriv därför aldrig in gata, fastighets-
 * beteckning eller ort under kommunnivå i titel, beskrivning, taggar
 * eller alt-texter här. Bilderna är beskurna så att registreringsskyltar
 * och identifierbara personer inte syns, och sparas om utan metadata.
 *
 *  - Laddar upp 9 bilder som assets
 *  - Skapar projekt-dokumentet (publicerat direkt)
 *  - Idempotent: skippar om slug redan finns
 *
 * Källa: offert D4440.
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

const IMG_DIR = path.join(process.cwd(), "scripts/cache/flen-ready");

const SLUG = "takomlaggning-flen";

type Roll = "hero" | "efter" | "fore" | "galleri";

const IMAGES: { file: string; alt: string; roll: Roll }[] = [
  {
    file: "flen-1-efter-tak-drone.jpg",
    alt: "Nytt betongtak i svart kulör på villa i Flen, sett från drönare snett ovanifrån",
    roll: "hero",
  },
  {
    file: "flen-2-efter-oversikt.jpg",
    alt: "Villa i Flen efter takomläggning, hela taket och uthuset med nya svarta betongpannor",
    roll: "efter",
  },
  {
    file: "flen-7-fore-drone.jpg",
    alt: "Samma villa i Flen före takomläggningen, med gamla mossbelagda takpannor",
    roll: "fore",
  },
  {
    file: "flen-3-efter-entre.jpg",
    alt: "Entrésidan på villan i Flen efter takbytet, med nytt svart betongtak och nya vindskivor",
    roll: "galleri",
  },
  {
    file: "flen-4-efter-takkupa.jpg",
    alt: "Takkupa och takfot med nytt svart betongtak och svarta hängrännor efter omläggningen i Flen",
    roll: "galleri",
  },
  {
    file: "flen-5-efter-gavel.jpg",
    alt: "Gaveln på villan i Flen med nytt betongtak, nya vindskivor och nytt regnvattensystem",
    roll: "galleri",
  },
  {
    file: "flen-6-efter-uthus.jpg",
    alt: "Uthuset i Flen med nytt svart betongtak, hängrännor och stuprör",
    roll: "galleri",
  },
  {
    file: "flen-8-fore-mossa.jpg",
    alt: "Taket i Flen före omläggningen, med kraftig mossbeläggning och slitna betongpannor",
    roll: "galleri",
  },
  {
    file: "flen-9-fore-ovanifran.jpg",
    alt: "Det gamla taket i Flen rakt ovanifrån, där mossan täcker hela takytan",
    roll: "galleri",
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

  console.log(`↑ Laddar upp ${IMAGES.length} bilder...`);
  const uploaded: Array<{ assetId: string; alt: string; roll: Roll }> = [];
  for (const img of IMAGES) {
    const id = await uploadImage(img.file, img.alt);
    console.log(`  ✓ ${img.file}`);
    uploaded.push({ assetId: id, alt: img.alt, roll: img.roll });
  }

  const bild = (roll: Roll) => uploaded.find((u) => u.roll === roll)!;
  const hero = bild("hero");
  const efter = bild("efter");
  const fore = bild("fore");
  // Galleriet visar allt utom huvudbilden, i den ordning de står i IMAGES.
  const gallery = uploaded.filter((u) => u.roll !== "hero");

  const bildFalt = (u: { assetId: string; alt: string }) => ({
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: u.assetId },
    alt: u.alt,
  });

  const doc = {
    _type: "projekt" as const,
    _id: randomUUID(),
    title: "Takomläggning, Flen",
    slug: { _type: "slug" as const, current: SLUG },
    ort: "Flen",
    typ: "Betongtak",
    tjanster: ["taklaggning", "betongtak", "hangrannorstupror", "taksakerhet"],
    kvm: 160,
    ar: 2026,
    material: "Monier Aerlox tvåkupig betongtakpanna i svart kulör",
    beskrivning:
      "Villan i Flen hade ett tak där mossan täckte hela ytan och pannorna var uttjänta. 2026 lades 160 m² tak om från grunden, med 15 års tät takgaranti på yttertaket.\n\nDet gamla taket revs och sorterades enligt avfallsförordningen, och ny råspont monterades med målade utsprång i önskad kulör. Underlagspapp är Icopal Flexilight Prima med 30 års produktgaranti och dold infästning med rostfria klammer. Ny ströläkt och bärläkt (25×48 mm) monterades och förbereddes för framtida solpaneler. Taket lades med Monier Aerlox tvåkupig betongtakpanna i svart kulör.\n\nI omläggningen ingick ränndalsplåtar, takfotsremsa mot kondens, fotplåt och fågellister vid takfoten, ny nockregel med ventilerat nocktätningsband samt dubbla vindskivor med vindskivebeslag i svart kulör. Nytt regnvattensystem med 125 mm hängrännor och 90 mm stuprör i svart kulör monterades enligt Plannjas anvisningar. Det befintliga takfönstret återmonterades med nya tillbehör, huven höjdes och målades svart, och taksteg med glidskydd monterades enligt gällande krav.",
    taggar: ["takomläggning", "betongtak", "Monier Aerlox", "Flen"],
    huvudbild: bildFalt(hero),
    bilder: gallery.map((g) => ({
      _key: randomUUID().slice(0, 12),
      ...bildFalt(g),
    })),
    foreImage: bildFalt(fore),
    efterImage: bildFalt(efter),
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
