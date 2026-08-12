import type { ProjektCard } from "@/sanity/lib/types";

// Stockholm-stadsdelar som har egna /omraden/-sidor. Värdet är samma
// sträng som vi väntar oss att hitta i `title` på Sanity-projekt med
// `ort = "Stockholm"`. Slug-nyckeln måste matcha det vi använder i
// lib/omraden.ts.
const STOCKHOLM_STADSDELAR: Record<string, string> = {
  bromma: "Bromma",
  hasselby: "Hässelby",
  vallingby: "Vällingby",
  spanga: "Spånga",
  enskede: "Enskede",
  farsta: "Farsta",
  alvsjo: "Älvsjö",
  hagersten: "Hägersten",
  skarpnack: "Skarpnäck",
  kungsholmen: "Kungsholmen",
  sodermalm: "Södermalm",
};

/**
 * Filter the global Sanity projekt list down to the ones relevant for
 * a given /omraden/[slug] page.
 *
 * Match rules:
 *   1. Direct: projekt.ort === ortName (case-sensitive, matches the
 *      string redaktörer fyller i i Studion).
 *   2. Stockholm-stadsdel: om slug-orten är en stadsdel under Stockholm
 *      (t.ex. bromma, hasselby), inkludera även projekt där ort ==
 *      "Stockholm" och title innehåller stadsdelens namn. Detta täcker
 *      fall som "Sörgårdsvägen, Bromma" där redaktören har lagt ort =
 *      Stockholm men adressen ligger i en stadsdel.
 */
export function matchProjektForOrt(
  projekt: ProjektCard[],
  ortSlug: string,
  ortName: string
): ProjektCard[] {
  const stadsdel = STOCKHOLM_STADSDELAR[ortSlug];
  const stadsdelsOrter = Object.values(STOCKHOLM_STADSDELAR);
  return projekt.filter((p) => {
    if (p.ort === ortName) return true;
    if (
      stadsdel &&
      p.ort === "Stockholm" &&
      p.title?.includes(stadsdel)
    ) {
      return true;
    }
    // Stockholmssidan äger alla stadsdelar, även projekt där redaktören
    // har lagt ort = "Bromma" i stället för ort = "Stockholm".
    if (ortSlug === "stockholm" && p.ort && stadsdelsOrter.includes(p.ort)) {
      return true;
    }
    return false;
  });
}

/**
 * Projekt från grannkommunerna, i grannlistans ordning och utan dubbletter.
 * Används som fallback på ortssidor där vi ännu inte har egna referenser,
 * och ska alltid presenteras som projekt *nära* orten.
 */
export function matchProjektForGrannar(
  projekt: ProjektCard[],
  grannar: { slug: string; name: string }[],
  limit = 3
): ProjektCard[] {
  const perGranne = grannar.map((g) =>
    matchProjektForOrt(projekt, g.slug, g.name)
  );
  const sedda = new Set<string>();
  const ut: ProjektCard[] = [];
  const djupast = Math.max(0, ...perGranne.map((l) => l.length));
  // Ett projekt per granne i taget, så en granne med många referenser inte
  // äter upp hela listan.
  for (let i = 0; i < djupast && ut.length < limit; i++) {
    for (const lista of perGranne) {
      const p = lista[i];
      if (!p) continue;
      const key = p.slug ?? p.title ?? "";
      if (!key || sedda.has(key)) continue;
      sedda.add(key);
      ut.push(p);
      if (ut.length >= limit) break;
    }
  }
  return ut;
}
