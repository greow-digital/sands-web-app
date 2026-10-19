/*
  Frågor, poäng och prislogik för offertflödet, som slår ihop
  priskalkylatorn och taktestet (beslut 19 okt 2026). Samma flöde nås från
  /priser och /taktest, bara ingången skiljer.

  Priset kommer från lib/material.ts. Flödet hittar inte på nya prisnivåer:
  det visar samma spann som kalkylatorn alltid gjort och anger bara var i
  spannet just det här taket troligen hamnar, utifrån de faktorer sidan
  redan nämner (takform, kupor, ränndalar, genomföringar).

  Skicksbedömningen är taktestets, med samma tröskelvärden.
*/

import { KOMPLEX_MULTIPLIER, MATERIAL_LIST, type MaterialKey } from "./material";

export type Val = { value: string; label: string; poang?: number };

export const TAKMATERIAL = MATERIAL_LIST;

export const TAKFORM: Val[] = [
  { value: "sadel", label: "Sadeltak" },
  { value: "valmat", label: "Valmat tak", poang: 1 },
  { value: "pulpet", label: "Pulpettak" },
  { value: "mansard", label: "Mansardtak", poang: 2 },
  { value: "annan", label: "Platt eller annan" },
];

/** Det som kräver plåtarbete utöver ett rakt takfall. Flerval. */
export const DETALJER: Val[] = [
  { value: "kupor", label: "Takkupor", poang: 2 },
  { value: "ranndal", label: "Vinkel eller ränndal", poang: 1 },
  { value: "skorsten", label: "Skorsten", poang: 0.5 },
  { value: "takfonster", label: "Takfönster", poang: 0.5 },
  { value: "inget", label: "Inget av detta" },
];

export const ALDER: Val[] = [
  { value: "<15", label: "Yngre än 15 år", poang: 0 },
  { value: "15-30", label: "15–30 år", poang: 1 },
  { value: "30+", label: "Äldre än 30 år", poang: 3 },
  { value: "vet-ej", label: "Vet ej", poang: 1 },
];

/** Synliga tecken, flerval. Poängen är taktestets. */
export const TECKEN: Val[] = [
  { value: "lackage", label: "Läckage senaste åren", poang: 3 },
  { value: "fukt", label: "Fukt eller röta på vinden", poang: 3 },
  { value: "svackor", label: "Svackor i takfallet", poang: 3 },
  { value: "spruckna", label: "Spruckna eller trasiga pannor", poang: 2 },
  { value: "mossa", label: "Mossa, alg eller lav", poang: 1 },
  { value: "plat", label: "Lösa eller rostiga plåtdetaljer", poang: 1 },
  { value: "istappar", label: "Mycket istappar vintertid", poang: 1 },
  { value: "inget", label: "Inget av detta" },
];

export const TIDSPLAN: Val[] = [
  { value: "3man", label: "Inom 3 månader" },
  { value: "varen", label: "Till våren" },
  { value: "1-2ar", label: "Om 1–2 år" },
  { value: "nyfiken", label: "Vill bara veta priset" },
];

export type Svar = {
  material?: MaterialKey;
  kvm: number;
  takform?: string;
  detaljer: string[];
  alder?: string;
  tecken: string[];
  tidsplan?: string;
};

export const materialNamn = (key?: MaterialKey) =>
  (MATERIAL_LIST.find((m) => m.key === key)?.namn ?? "").toLowerCase();

export const label = (lista: Val[], value?: string) =>
  lista.find((v) => v.value === value)?.label ?? "";

const poang = (lista: Val[], value?: string) =>
  lista.find((v) => v.value === value)?.poang ?? 0;

const summa = (lista: Val[], values: string[]) =>
  values.reduce((s, v) => s + poang(lista, v), 0);

// ROT räknas på arbetskostnaden, samma antaganden som kalkylatorn hade.
const ROT_PROCENT = 0.3;
const ROT_TAK = 50000;
const ARBETE_KR_M2 = 875;

export function riktpris(material: MaterialKey, kvm: number) {
  const m = MATERIAL_LIST.find((x) => x.key === material)!;
  const undre = m.prisM2 * kvm;
  const ovre = undre * KOMPLEX_MULTIPLIER;
  const rot = Math.min(ARBETE_KR_M2 * kvm * ROT_PROCENT, ROT_TAK);
  return { undre, ovre, undreForeRot: undre + rot, ovreForeRot: ovre + rot };
}

/**
 * Var i spannet taket troligen hamnar, 0 = nedre kanten, 1 = övre.
 * Riktprisets nedre kant förutsätter sadeltak utan kupor, så varje sak som
 * kräver extra plåtarbete flyttar markören uppåt.
 */
export function lageISpannet(s: Svar) {
  const komplex = poang(TAKFORM, s.takform) + summa(DETALJER, s.detaljer);
  const lage = Math.min(0.12 + komplex * 0.16, 0.9);
  const text =
    lage < 0.34
      ? "Ett enkelt tak hamnar oftast nära den nedre delen av spannet, förutsatt att råsponten under pannorna är frisk."
      : lage < 0.62
        ? "Takets form och detaljer brukar placera priset kring mitten av spannet."
        : "Kupor, vinklar och genomföringar kräver mycket plåtarbete, så priset hamnar troligen i den övre delen av spannet.";
  return { lage, text };
}

export type Niva = {
  key: "hog" | "medel" | "lag";
  label: string;
  rubrik: string;
  color: string;
  bg: string;
};

export function skick(s: Svar): Niva {
  const p = poang(ALDER, s.alder) + summa(TECKEN, s.tecken) + (s.material === "papp" ? 1 : 0);
  if (p >= 7)
    return {
      key: "hog",
      label: "Hög angelägenhet",
      rubrik: "Taket visar flera tecken på att ett byte närmar sig.",
      color: "#C2410C",
      bg: "rgba(234,88,12,0.10)",
    };
  if (p >= 3)
    return {
      key: "medel",
      label: "Håll koll",
      rubrik: "Taket visar vissa tecken på slitage, men inget akut.",
      color: "#B45309",
      bg: "rgba(217,119,6,0.10)",
    };
  return {
    key: "lag",
    label: "Verkar i skick",
    rubrik: "Utifrån dina svar verkar taket vara i rimligt skick.",
    color: "#15803D",
    bg: "rgba(22,163,74,0.10)",
  };
}

/** Kort förklaring till bedömningen, högst två rader. Texterna är taktestets. */
export function insikter(s: Svar): string[] {
  const ut: string[] = [];
  if (s.tecken.includes("fukt") || s.tecken.includes("lackage"))
    ut.push("Fukt och läckage tyder på att vatten redan tagit sig förbi tätskiktet.");
  if (s.tecken.includes("svackor"))
    ut.push("Svackor kan bero på att läkt eller underliggande trä försvagats.");
  if (s.alder === "30+")
    ut.push("Ett tak över 30 år närmar sig slutet av sin tekniska livslängd, oavsett material.");
  if (s.tecken.includes("mossa") || s.tecken.includes("spruckna"))
    ut.push("Mossa och spruckna pannor släpper in fukt som fryser och spränger materialet.");
  if (s.tecken.includes("istappar"))
    ut.push("Mycket istappar kan tyda på bristande ventilation eller isolering.");
  return ut.slice(0, 2);
}

/**
 * Sammanfattning som följer med leaden som meddelande, så att Sands ser
 * allt kunden svarat utan att behöva ringa och fråga.
 */
/** niva utelämnas när skicket inte efterfrågats (ingången /priser). */
export function sammanfattning(s: Svar, prisText: string, niva?: Niva) {
  const delar = [
    `Från offertflödet: ${materialNamn(s.material)}, ${label(TAKFORM, s.takform).toLowerCase()}, ca ${s.kvm} m².`,
    s.detaljer.length && !s.detaljer.includes("inget")
      ? `Detaljer: ${s.detaljer.map((d) => label(DETALJER, d).toLowerCase()).join(", ")}.`
      : "",
    s.alder ? `Takets ålder: ${label(ALDER, s.alder).toLowerCase()}.` : "",
    s.tecken.length && !s.tecken.includes("inget")
      ? `Ser: ${s.tecken.map((t) => label(TECKEN, t).toLowerCase()).join(", ")}.`
      : "",
    s.tidsplan ? `Vill byta: ${label(TIDSPLAN, s.tidsplan).toLowerCase()}.` : "",
    `Riktpris: ${prisText}.`,
    niva ? `Skick: ${niva.label.toLowerCase()}.` : "",
  ];
  return delar.filter(Boolean).join(" ");
}
