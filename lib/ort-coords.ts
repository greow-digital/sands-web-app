/**
 * Approximate center coordinates per ort/kommun.
 *
 * Used to position project pins on the public map without exposing
 * exact customer addresses. Each project gets a deterministic offset
 * from its ort center based on a slug hash, so the pins don't stack
 * but stay roughly where the work was done.
 *
 * Coordinates are public knowledge (kommun centers), not addresses.
 */

export const ortCoords: Record<string, { lat: number; lng: number }> = {
  // Stockholms län — kommuner
  Stockholm: { lat: 59.3293, lng: 18.0686 },
  Bromma: { lat: 59.342, lng: 17.939 },
  Täby: { lat: 59.439, lng: 18.072 },
  Sollentuna: { lat: 59.428, lng: 17.951 },
  Danderyd: { lat: 59.408, lng: 18.025 },
  Lidingö: { lat: 59.366, lng: 18.131 },
  Vallentuna: { lat: 59.535, lng: 18.077 },
  Vaxholm: { lat: 59.402, lng: 18.349 },
  Värmdö: { lat: 59.305, lng: 18.421 },
  Österåker: { lat: 59.48, lng: 18.297 },
  "Upplands Väsby": { lat: 59.518, lng: 17.911 },
  "Upplands-Bro": { lat: 59.518, lng: 17.658 },
  Sigtuna: { lat: 59.617, lng: 17.724 },
  Nacka: { lat: 59.31, lng: 18.164 },
  Huddinge: { lat: 59.236, lng: 17.982 },
  Tyresö: { lat: 59.244, lng: 18.226 },
  Haninge: { lat: 59.169, lng: 18.143 },
  Botkyrka: { lat: 59.2, lng: 17.832 },
  Nynäshamn: { lat: 58.904, lng: 17.948 },
  Salem: { lat: 59.2, lng: 17.778 },
  Järfälla: { lat: 59.421, lng: 17.84 },
  Solna: { lat: 59.36, lng: 18.0 },
  Sundbyberg: { lat: 59.361, lng: 17.972 },
  Ekerö: { lat: 59.282, lng: 17.808 },
  Norrtälje: { lat: 59.76, lng: 18.7 },
  Södertälje: { lat: 59.196, lng: 17.626 },
  Nykvarn: { lat: 59.182, lng: 17.421 },

  // Närliggande orter som finns i projekt-historiken
  Nyköping: { lat: 58.753, lng: 17.008 },
  Köping: { lat: 59.514, lng: 15.997 },
  Strängnäs: { lat: 59.378, lng: 17.038 },
  Enköping: { lat: 59.636, lng: 17.077 },
  Gnesta: { lat: 59.046, lng: 17.314 },
  Håbo: { lat: 59.625, lng: 17.46 },
  Uttran: { lat: 59.213, lng: 17.776 },
};

/**
 * Deterministic per-project offset from the ort center.
 * Same slug always produces the same offset, so positions are stable
 * across reloads/builds. Range is ~±500m at Sweden's latitude.
 */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const OFFSET_MAGNITUDE = 0.006;

export function coordForProjekt(
  ort: string,
  slug: string
): { lat: number; lng: number } | null {
  const base = ortCoords[ort];
  if (!base) return null;

  const hash = hashSlug(slug);
  const latOffset =
    ((hash % 1000) / 1000 - 0.5) * 2 * OFFSET_MAGNITUDE;
  const lngOffset =
    (((Math.floor(hash / 1000)) % 1000) / 1000 - 0.5) *
    2 *
    OFFSET_MAGNITUDE;

  return {
    lat: base.lat + latOffset,
    lng: base.lng + lngOffset,
  };
}
