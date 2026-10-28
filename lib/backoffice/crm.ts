/*
  Säljvyns beräkningar: Att göra, pipeline, nyckeltal och tid i klartext.
  Bara rena funktioner över Lead, så att översikten, listan och pipelinen
  räknar likadant.
*/
import { foreslagna, orörda, paminnelserIdag, type Flode } from "./floden";
import { dagarSedan, idag, sandsLogg, status, stockholmTid, type Lead, type SkrivbartFalt, type Status } from "./lead";

/* Att göra. Samma urval som i sammanfattningsmejlet, plus nya från i dag. */

export type Orsak =
  | { typ: "paminnelse"; text: string }
  | { typ: "ny"; text: string }
  | { typ: "orord"; text: string }
  | { typ: "mejl"; text: string; flode: Flode };

export function attGora(leads: Lead[], nu = new Date()): Map<string, Orsak[]> {
  const orsaker = new Map<string, Orsak[]>();
  const lagg = (l: Lead, o: Orsak) => orsaker.set(l.id, [...(orsaker.get(l.id) ?? []), o]);
  const dag = idag(nu);
  paminnelserIdag(leads, nu).forEach((l) =>
    lagg(l, { typ: "paminnelse", text: l.paminnelse < dag ? `Påminnelse ${l.paminnelse}, försenad` : "Påminnelse i dag" })
  );
  // Nya från i dag ska ringas samma dag.
  leads.filter((l) => status(l) === "ny" && l.tidpunkt.startsWith(dag)).forEach((l) => lagg(l, { typ: "ny", text: "Ny i dag" }));
  orörda(leads, nu).forEach((l) => lagg(l, { typ: "orord", text: "Ingen har rört den" }));
  foreslagna(leads, nu).forEach(({ lead, flode }) => lagg(lead, { typ: "mejl", text: `Föreslaget mejl: ${flode.namn}`, flode }));
  return orsaker;
}

/** Ordning i Att göra: nya först (snabb kontakt vinner affärer), sedan försenat. */
const VIKT: Record<Orsak["typ"], number> = { ny: 0, paminnelse: 1, orord: 2, mejl: 3 };

export function prioritet(orsaker: Orsak[] = []): number {
  return Math.min(9, ...orsaker.map((o) => VIKT[o.typ]));
}

/* Pipeline. Stegen motsvarar kryssrutorna i arket. */

export const PIPELINE = ["ny", "kontaktad", "bokad", "offert", "vunnen"] as const satisfies readonly Status[];
export type Steg = (typeof PIPELINE)[number] | "forlorad" | "avslutad";

export const STEG_KORT: Record<Steg, string> = {
  ny: "Ny",
  kontaktad: "Kontaktad",
  bokad: "Takkontroll",
  offert: "Offert",
  vunnen: "Accepterad",
  forlorad: "Nekad",
  avslutad: "Avslutat",
};

const KRYSS = ["bokad", "offertSkickad", "offertAccepterad", "offertNekad", "projektAvslutat"] as const;

/** Kryssrutorna som är i för varje steg. Alla andra i kedjan är ur. */
const MAL: Record<Exclude<Steg, "ny">, SkrivbartFalt[]> = {
  kontaktad: [],
  bokad: ["bokad"],
  offert: ["bokad", "offertSkickad"],
  vunnen: ["bokad", "offertSkickad", "offertAccepterad"],
  forlorad: ["bokad", "offertSkickad", "offertNekad"],
  avslutad: ["bokad", "offertSkickad", "offertAccepterad", "projektAvslutat"],
};

/**
 * Kryssrutorna som ska ändras för att flytta leaden till steget. Framåt
 * kryssas tidigare steg i kedjan också i, bakåt kryssas senare steg ur.
 */
export function flytt(lead: Lead, till: Exclude<Steg, "ny">): Partial<Record<SkrivbartFalt, boolean>> {
  const andrat: Partial<Record<SkrivbartFalt, boolean>> = {};
  for (const falt of KRYSS) {
    const ska = MAL[till].includes(falt);
    if (Boolean(lead[falt]) !== ska) andrat[falt] = ska;
  }
  return andrat;
}

/*
  Belopp. Offertvärdet är fritext i arket: tal, "180 000", "192 799,00",
  "180 000 kr" och ibland en kommentar ("inget svar"), som räknas som 0.
*/

export function varde(lead: Lead): number {
  const s = lead.offertvarde
    .toLowerCase()
    .replace(/\s|kr|sek|:-/g, "")
    // Ören bort ("192799,00"). Tre siffror efter skiljetecknet är tusental ("180.000").
    .replace(/[.,]\d{1,2}$/, "")
    .replace(/[.,]/g, "");
  return /^\d+$/.test(s) ? Number(s) : 0;
}

const KR = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });

export function kronor(n: number): string {
  if (n >= 1e7) return `${(n / 1e6).toLocaleString("sv-SE", { maximumFractionDigits: 1 })} mkr`;
  return `${KR.format(n)} kr`;
}

/* Tid. Arket räknar i Stockholmstid utan zon, så båda sidor tolkas som UTC. */

function minuter(tid: string): number {
  return Date.parse(tid.slice(0, 16).replace(" ", "T") + ":00Z") / 6e4;
}

export function minuterSedan(tid: string, nu = new Date()): number {
  return Math.max(0, Math.round(minuter(stockholmTid(nu)) - minuter(tid)));
}

/** "nyss", "12 min", "3 h", "i går", "4 d", "12 okt". */
export function relativ(tid: string, nu = new Date()): string {
  if (!tid) return "";
  const m = minuterSedan(tid, nu);
  if (Number.isNaN(m)) return tid.slice(0, 10);
  if (m < 2) return "nyss";
  if (m < 60) return `${m} min`;
  const d = dagarSedan(tid, nu);
  if (d === 0) return `${Math.floor(m / 60)} h`;
  if (d === 1) return "i går";
  if (d < 7) return `${d} d`;
  return datum(tid);
}

const MANAD = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** "12 okt", med år om det inte är i år. */
export function datum(tid: string, nu = new Date()): string {
  const [a, m, d] = tid.slice(0, 10).split("-");
  if (!d) return tid;
  const ar = a === idag(nu).slice(0, 4) ? "" : ` ${a}`;
  return `${Number(d)} ${MANAD[Number(m) - 1]}${ar}`;
}

/** Datum n dagar fram, "yyyy-MM-dd". */
export function omDagar(n: number, nu = new Date()): string {
  return idag(new Date(nu.getTime() + n * 864e5));
}

export function senasteAktivitet(lead: Lead): string {
  for (let i = lead.logg.length - 1; i >= 0; i--) if (lead.logg[i].tid) return lead.logg[i].tid;
  return lead.tidpunkt;
}

/* Nyckeltal till översikten. */

export function nyckeltal(leads: Lead[], nu = new Date()) {
  const aktiva = leads.filter((l) => !l.arkiverad);
  const inom = (l: Lead, fran: number, till: number) => {
    const d = dagarSedan(l.tidpunkt, nu);
    return d >= fran && d < till;
  };
  const vecka = aktiva.filter((l) => inom(l, 0, 7)).length;
  const forraVeckan = aktiva.filter((l) => inom(l, 7, 14)).length;

  const offerter = aktiva.filter((l) => status(l) === "offert");
  const vunna = aktiva.filter((l) => ["vunnen", "avslutad"].includes(status(l)));
  const nekade = aktiva.filter((l) => status(l) === "forlorad");

  // Svarstid: från att leaden kom in till första raden i loggen, senaste 30 dagarna.
  const svar = aktiva
    .map((l) => ({ l, forsta: sandsLogg(l)[0]?.tid }))
    .filter(({ l, forsta }) => inom(l, 0, 30) && forsta)
    .map(({ l, forsta }) => minuter(forsta!) - minuter(l.tidpunkt))
    .filter((m) => m >= 0)
    .sort((a, b) => a - b);
  const median = svar.length ? svar[Math.floor(svar.length / 2)] : null;

  // Inkomna per dag, de senaste 14 dagarna, äldst först.
  const perDag = Array.from({ length: 14 }, (_, i) => {
    const dag = omDagar(i - 13, nu);
    return { dag, antal: aktiva.filter((l) => l.tidpunkt.startsWith(dag)).length };
  });

  return {
    vecka,
    forraVeckan,
    offerter: { antal: offerter.length, varde: offerter.reduce((s, l) => s + varde(l), 0) },
    vunna: { antal: vunna.length, varde: vunna.reduce((s, l) => s + varde(l), 0) },
    vinstandel: vunna.length + nekade.length ? Math.round((100 * vunna.length) / (vunna.length + nekade.length)) : null,
    svarstidMinuter: median,
    perDag,
  };
}

/*
  Konverteringstratten. Ett steg räknas som nått om det eller något senare
  steg är ikryssat, eftersom arket ibland bara har den sista rutan ikryssad.
  Arkiverade leads som aldrig blev bokade är skräp och räknas inte.
*/

export type TrattSteg = { namn: string; antal: number; andel: number | null };

export function tratt(leads: Lead[], dagar?: number, nu = new Date()): TrattSteg[] {
  const accepterad = (l: Lead) => l.offertAccepterad || l.projektAvslutat;
  const offert = (l: Lead) => l.offertSkickad || l.offertNekad || accepterad(l);
  const bokad = (l: Lead) => l.bokad || offert(l);
  const urval = leads.filter((l) => (!l.arkiverad || bokad(l)) && (dagar == null || dagarSedan(l.tidpunkt, nu) < dagar));

  const antal = [urval.length, urval.filter(bokad).length, urval.filter(offert).length, urval.filter(accepterad).length];
  const namn = ["Leads", "Takkontroll bokad", "Offert skickad", "Offert accepterad"];
  return antal.map((n, i) => ({
    namn: namn[i],
    antal: n,
    // Andel av föregående steg, i procent.
    andel: i === 0 ? null : antal[i - 1] ? Math.round((100 * n) / antal[i - 1]) : null,
  }));
}

/** Fördelning per källa (sidan leaden kom från), senaste 30 dagarna. */
export function kallor(leads: Lead[], nu = new Date()) {
  const antal = new Map<string, number>();
  for (const l of leads) {
    if (l.arkiverad || dagarSedan(l.tidpunkt, nu) >= 30) continue;
    const k = kallaNamn(l.kalla);
    antal.set(k, (antal.get(k) ?? 0) + 1);
  }
  return [...antal].sort((a, b) => b[1] - a[1]).map(([namn, n]) => ({ namn, antal: n }));
}

export function kallaNamn(kalla: string): string {
  const s = kalla.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
  if (!s || s === "/") return "Startsidan";
  if (s.startsWith("/lp")) return "Annonssidor";
  if (s.startsWith("/omraden")) return "Områdessidor";
  if (s.startsWith("/tjanster")) return "Tjänstesidor";
  if (s.startsWith("/blogg")) return "Bloggen";
  if (/röst|telefon|agent/i.test(s)) return "Röstagenten";
  return s.replace(/^\//, "").replace(/[-/]/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function initialer(lead: Pick<Lead, "namn" | "epost">): string {
  const ord = lead.namn.split(/\s+/).filter((o) => /^\p{L}/u.test(o));
  if (ord.length) return (ord[0][0] + (ord.length > 1 ? ord[ord.length - 1][0] : "")).toUpperCase();
  return (lead.epost[0] ?? "?").toUpperCase();
}

export function visningsnamn(lead: Pick<Lead, "namn" | "epost" | "telefon">): string {
  return lead.namn || lead.epost || lead.telefon || "Utan namn";
}
