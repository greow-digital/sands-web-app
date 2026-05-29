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
  return projekt.filter((p) => {
    if (p.ort === ortName) return true;
    if (
      stadsdel &&
      p.ort === "Stockholm" &&
      p.title?.includes(stadsdel)
    ) {
      return true;
    }
    return false;
  });
}
