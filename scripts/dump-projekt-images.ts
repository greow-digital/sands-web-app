/**
 * Dumpar alla projekt-dokument från Sanity som JSON med URLer till
 * huvudbild + galleribilder, plus _key för varje bild så vi kan
 * peka tillbaka när vi senare patchar huvudbilden.
 *
 * Användning:
 *   npx tsx scripts/dump-projekt-images.ts > scripts/cache/projekt.json
 */
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-27",
  useCdn: true,
});

type Img = {
  _key?: string;
  asset?: { _ref?: string; url?: string };
  alt?: string | null;
};

type Projekt = {
  _id: string;
  title: string;
  slug: string;
  ort?: string;
  typ?: string;
  kvm?: number;
  ar?: number;
  huvudbild?: Img;
  bilder?: Img[];
};

function assetIdToUrl(ref?: string): string | null {
  if (!ref) return null;
  const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-([a-z]+)$/);
  if (!m) return null;
  const [, id, dim, ext] = m;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dim}.${ext}`;
}

async function main() {
  const projekt = await client.fetch<Projekt[]>(
    `*[_type == "projekt"] | order(ar desc, title asc) {
      _id, title, "slug": slug.current, ort, typ, kvm, ar,
      huvudbild { _key, asset->{ _id, url }, alt },
      bilder[] { _key, asset->{ _id, url }, alt }
    }`
  );

  const out = projekt.map((p) => ({
    _id: p._id,
    slug: p.slug,
    title: p.title,
    ort: p.ort,
    typ: p.typ,
    kvm: p.kvm,
    ar: p.ar,
    huvudbild: {
      url:
        p.huvudbild?.asset?.url ??
        assetIdToUrl(p.huvudbild?.asset?._ref),
    },
    bilder: (p.bilder ?? []).map((b, i) => ({
      idx: i,
      _key: b._key,
      url: b.asset?.url ?? assetIdToUrl(b.asset?._ref),
    })),
  }));

  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
