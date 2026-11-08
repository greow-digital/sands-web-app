/*
  Konkurrenterna som SEO-loopen följer (beslut 8 nov 2026).

  Loopen läser deras sitemaps varje vecka, sparar en ögonblicksbild i
  seo/konkurrenter/<domän>.json och jämför med förra veckan: nya, borttagna
  och ändrade sidor. Nya och ändrade sidor om tak läses (titel,
  beskrivning, rubriker) och jämförs med våra ämnen i seo/regler.mjs.

  Sajterna måste vara tillåtna i miljöns nätverk. Environmentet
  "sands-web-app" tillåter dem.
*/
export const KONKURRENTER = [
  { namn: "Vesivek", bas: "https://www.vesivek.se" },
  { namn: "Villatakexperten", bas: "https://villatakexperten.se" },
  { namn: "Takhero", bas: "https://www.takhero.se" },
];

/** Bara sidor vars adress handlar om tak läses i detalj. */
export const RELEVANT = /tak|tegel|betong|plåt|plat|papp|eternit|hängrän|hangran|stupr|skorsten|läck|lack|besikt|renover|reparat|pris|kostnad|omdöm|omdom|stockholm/;

/** Högst så här många sidor läses per konkurrent och varv. */
export const MAX_SIDOR = 25;

/** Paus mellan anrop till samma sajt, i millisekunder. */
export const PAUS_MS = 1500;

/** Hur loopen presenterar sig. Ingen personlig e-post. */
export const USER_AGENT = "SandsSEOLoop/1.0 (veckovis kontroll av sitemap)";
