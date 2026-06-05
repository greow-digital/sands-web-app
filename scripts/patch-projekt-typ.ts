/**
 * Patchar typ-fältet för projekt där Jimdo-beskrivningen säger något
 * annat än Sanitys nuvarande värde. Baseras på Jimdo-källan (1:1) +
 * audit-resultat.
 *
 * Användning:
 *   npx tsx scripts/patch-projekt-typ.ts
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

type TypePatch = { slug: string; newTyp: string; reason: string };

const PATCHES: TypePatch[] = [
  // Tak-typer korrigerade enligt Jimdo-material
  { slug: "hakevagen-djursholm", newTyp: "Tegeltak", reason: "Jimdo: svart taktegel Monier Hollander" },
  { slug: "takomlaggning-farsta", newTyp: "Betongtak", reason: "Jimdo: Monier betongpannor Jönåker Elegant" },
  { slug: "takomlaggning-grodinge", newTyp: "Betongtak", reason: "Jimdo: Jönåker Elegant svart" },
  { slug: "skacklingevagen-tumba", newTyp: "Betongtak", reason: "Jimdo: Monier Protector 2.0 (betong)" },
  { slug: "norrangsvagen-huddinge", newTyp: "Betongtak", reason: "Jimdo: betongpannor" },
  { slug: "takomlaggning-nykoping", newTyp: "Tegeltak", reason: "Jimdo: Monier Vittinge tvåkupigt (tegel)" },
  { slug: "takomlaggning-upplands-bro", newTyp: "Plåttak", reason: "Jimdo: Plannja Royal plåttak" },
  { slug: "takomlaggning-hasselby", newTyp: "Tegeltak", reason: "Audit: bilden visar mörkt tegeltak" },
  { slug: "skovelvagen-alvsjo", newTyp: "Tegeltak", reason: "Jimdo: tvåkupigt lertegel" },
  { slug: "takomlaggning-skokloster", newTyp: "Betongtak", reason: "Jimdo: Jönåker Elegant tegelröd (betong)" },
  { slug: "alstromervagen-skarholmen", newTyp: "Papptak", reason: "Jimdo: shingeltak Icopal" },

  // Icke-tak-projekt: byter till rätt projektkategori
  { slug: "sorgardsvagen-bromma", newTyp: "Fasadrenovering", reason: "Jimdo: ommålning av fasadpanel" },
  { slug: "radhusslingan-strangnas", newTyp: "Finplanering", reason: "Jimdo: finplanering" },
  { slug: "enskededalen-stockholm", newTyp: "Lägenhetsrenovering", reason: "Jimdo: lägenhetsrenovering" },
  { slug: "haggvagen-jarfalla", newTyp: "Lägenhetsrenovering", reason: "Jimdo: lägenhetsrenovering" },
  { slug: "lagenhetsrenovering-kungsholmen", newTyp: "Lägenhetsrenovering", reason: "Jimdo: lägenhetsrenovering 2 rok → 3 rok" },
  { slug: "totalrenovering-jarfalla", newTyp: "Totalrenovering", reason: "Jimdo: totalrenovering radhus" },
  { slug: "nybyggnation-uttran", newTyp: "Nybyggnation", reason: "Jimdo: nybyggnation av entrébyggnad" },
  { slug: "finplanering-enkoping", newTyp: "Finplanering", reason: "Jimdo: finplanering ute i Bredsand" },
  { slug: "fasadmalning-vallingby", newTyp: "Fasadmålning", reason: "Jimdo: fasadmålning" },
  { slug: "badrumsrenovering-norsborg", newTyp: "Badrumsrenovering", reason: "Jimdo: badrumsrenovering" },
];

async function main() {
  let ok = 0;
  let fail = 0;
  let skip = 0;
  for (const p of PATCHES) {
    const doc = await client.fetch<{ _id: string; typ?: string } | null>(
      `*[_type == "projekt" && slug.current == $slug][0]{ _id, typ }`,
      { slug: p.slug }
    );
    if (!doc) {
      console.error(`✗ ${p.slug}: not found`);
      fail++;
      continue;
    }
    if (doc.typ === p.newTyp) {
      console.log(`⏭  ${p.slug}: already "${p.newTyp}"`);
      skip++;
      continue;
    }
    try {
      await client.patch(doc._id).set({ typ: p.newTyp }).commit();
      console.log(`✓ ${p.slug}: "${doc.typ}" → "${p.newTyp}"  (${p.reason})`);
      ok++;
    } catch (err) {
      console.error(`✗ ${p.slug}:`, (err as Error).message);
      fail++;
    }
  }
  console.log(`\n──────────────────`);
  console.log(`✓ Patched: ${ok}`);
  console.log(`⏭  Skipped: ${skip}`);
  console.log(`✗ Failed:  ${fail}`);
  console.log(`──────────────────\n`);
}
main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
