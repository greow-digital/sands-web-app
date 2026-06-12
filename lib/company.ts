/**
 * Enda sanningskälla för företagsuppgifter, kontaktinfo, volymsiffror
 * och garantiformulering. Rendera dessa överallt istället för att
 * hårdkoda per sida, så att siffrorna inte spretar vid uppdatering.
 *
 * Vid ändring: uppdatera här, inte i enskilda sidor/komponenter.
 */

export const company = {
  namn: "Sands Entreprenad Stockholm AB",
  orgNr: "559063-8135",
  grundades: "2016",
  anstallda: "6",
} as const;

export const telefon = {
  /** Visad form i text och knappar */
  display: "08-28 38 88",
  /** href-värde för tel:-länkar (utan formattecken) */
  href: "tel:08283888",
  /** Internationell form för structured data */
  intl: "+468283888",
} as const;

export const nap = {
  email: "info@sandsab.se",
  gata: "Spjutvägen 5A",
  postnr: "175 61",
  ort: "Järfälla",
  region: "Stockholms län",
  land: "SE",
} as const;

/**
 * Verifierade trust-siffror. "kunder" och "tak" mäter olika saker:
 * kunder = antal uppdragsgivare, tak = antal utförda takarbeten.
 */
export const stats = {
  kunder: "500+",
  tak: "2 500+",
  omdomen: "54",
  betyg: "4,8",
  kommuner: "27+",
} as const;

/**
 * Moniers Tätt tak-garanti är "upp till 30 år", aldrig en platt
 * utlovad 30 år. Använd dessa fält i copy, stat-block och badges.
 */
export const garanti = {
  /** Stor siffra i stat-block */
  ar: "30 år",
  /** Korrekt fras i brödtext och badges */
  fras: "upp till 30 års garanti",
  /** Label som inte överlovar i stat-block */
  label: "Monier-garanti (upp till)",
} as const;

export const svarslofte = "Svar samma vardag, fast prisförslag inom 24 h";
