/**
 * Enda sanningskälla för takmaterialens priser och livslängder.
 *
 * Prismodellen är linjär: "från ca X kr/m² efter ROT-avdrag", samma som
 * /priser-sidan och priskalkylatorn. Rendera dessa siffror överallt
 * (kalkylator, takläggningssidan, prissidan) i stället för att hårdkoda
 * per sida, så att de inte spretar vid nästa prisjustering.
 *
 * Livslängderna är branschstandard och matchar jämförelsetabellen samt
 * faq-snippets.
 */

export type MaterialKey = "betong" | "tegel" | "plat" | "papp";

export interface Material {
  key: MaterialKey;
  namn: string;
  /** "från ca X kr/m²" efter ROT-avdrag */
  prisM2: number;
  /** Förväntad livslängd, branschstandard */
  livslangd: string;
}

export const MATERIAL: Record<MaterialKey, Material> = {
  betong: { key: "betong", namn: "Betongpannor", prisM2: 1200, livslangd: "40-60 år" },
  tegel: { key: "tegel", namn: "Tegeltak", prisM2: 1500, livslangd: "50-100 år" },
  plat: { key: "plat", namn: "Plåttak", prisM2: 1800, livslangd: "40-70 år" },
  papp: { key: "papp", namn: "Papptak", prisM2: 800, livslangd: "20-30 år" },
};

export const MATERIAL_LIST: Material[] = [
  MATERIAL.betong,
  MATERIAL.tegel,
  MATERIAL.plat,
  MATERIAL.papp,
];

/** Exempelpris efter ROT-avdrag, linjärt (prisM2 × yta). */
export function prisEfterRot(key: MaterialKey, kvm: number): number {
  return MATERIAL[key].prisM2 * kvm;
}

/** Övre prisintervall för komplexa tak (kupor, ränndalar, branta lutningar). */
export const KOMPLEX_MULTIPLIER = 1.3;

/**
 * Omläggning behåller befintliga pannor och landar därför under ett komplett
 * takbyte. 0,7 motsvarar de "25-35 % billigare" som copyn utlovar. Låg den
 * här, inte per sida, så omläggningspriserna följer med när kvadratmeter-
 * priserna justeras.
 */
export const OMLAGGNING_FAKTOR = 0.7;

/** Riktpris för omläggning efter ROT-avdrag, linjärt. */
export function omlaggningPrisEfterRot(key: MaterialKey, kvm: number): number {
  return prisEfterRot(key, kvm) * OMLAGGNING_FAKTOR;
}

/**
 * Standardformulering under pristabeller. Samma löfte som /priser ger i
 * heron: siffrorna är riktpriser, det bindande priset sätts vid takkontroll.
 * Använd den överallt så att inga siffror kan läsas som en offert.
 */
export const RIKTPRIS_NOT =
  "Riktpriser efter 30 % ROT-avdrag. Du får ett bindande fast pris efter kostnadsfri takkontroll.";

/**
 * Kanoniskt flaggskeppsexempel som används i copy, meta och stat-block:
 * betongtakbyte på 140 m² från ca 169 000 kr efter ROT.
 */
export const FLAGGSKEPP_PRIS = 169000;
export const FLAGGSKEPP_KVM = 140;
