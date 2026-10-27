/*
  Leadet som backofficet ser det. Arket är masterfilen och kolumnerna heter
  som i arket, så översättningen mellan rubrik och fält görs bara här.
*/

export type Lead = {
  id: string;
  /** Lokal tid i Stockholm, "yyyy-MM-dd HH:mm:ss". */
  tidpunkt: string;
  namn: string;
  telefon: string;
  epost: string;
  taktyp: string;
  yta: string;
  meddelande: string;
  kalla: string;
  gclid: string;
  kanal: string;
  transkript: string;
  bokad: boolean;
  offertSkickad: boolean;
  offertAccepterad: boolean;
  offertNekad: boolean;
  projektAvslutat: boolean;
  startdatum: string;
  adress: string;
  offertvarde: string;
  anteckning: string;
  /** "yyyy-MM-dd" eller tomt. */
  paminnelse: string;
  logg: LoggRad[];
  arkiverad: boolean;
};

export type LoggRad = { tid: string; vem: string; text: string };

/** Fältnamn i backofficet mot rubrik i arket. */
export const RUBRIK = {
  id: "ID",
  tidpunkt: "Tidpunkt",
  namn: "Namn",
  telefon: "Telefon",
  epost: "E-post",
  taktyp: "Taktyp",
  yta: "Yta m²",
  meddelande: "Meddelande",
  kalla: "Källa",
  gclid: "gclid",
  kanal: "Kanal",
  transkript: "Transkript",
  bokad: "Bokad",
  offertSkickad: "Offert skickad",
  // Stavfelet finns i arket och används av Ads-skriptet. Rätta inte här.
  offertAccepterad: "Offet accepterad",
  offertNekad: "Offert nekad",
  projektAvslutat: "Projekt avslutat",
  startdatum: "Planerat startdatum",
  adress: "Adress (fyll ut)",
  offertvarde: "Offertvärde",
  anteckning: "Anteckning",
  paminnelse: "Påminnelse",
  logg: "Logg",
  arkiverad: "Arkiverad",
} as const satisfies Record<keyof Lead, string>;

export type Falt = keyof typeof RUBRIK;

/** Fält som går att ändra i backofficet. Samma lista finns i backoffice.gs. */
export const SKRIVBARA = [
  "namn",
  "telefon",
  "epost",
  "bokad",
  "offertSkickad",
  "offertAccepterad",
  "offertNekad",
  "projektAvslutat",
  "startdatum",
  "adress",
  "offertvarde",
  "anteckning",
  "paminnelse",
  "arkiverad",
] as const satisfies readonly Falt[];

export type SkrivbartFalt = (typeof SKRIVBARA)[number];

export const KRYSSRUTOR = [
  "bokad",
  "offertSkickad",
  "offertAccepterad",
  "offertNekad",
  "projektAvslutat",
  "arkiverad",
] as const satisfies readonly SkrivbartFalt[];

const LOGG_RE = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ([^·]+?) · (.+)$/;

export function tolkaLogg(cell: unknown): LoggRad[] {
  return String(cell ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => {
      const m = r.match(LOGG_RE);
      return m ? { tid: m[1], vem: m[2], text: m[3] } : { tid: "", vem: "", text: r };
    });
}

export function loggRad(vem: string, text: string, nu = new Date()): string {
  return `${stockholmTid(nu)} · ${vem.replace(/·/g, "")} · ${text.replace(/\n/g, " ")}`;
}

function sant(v: unknown) {
  return v === true || String(v).trim().toUpperCase() === "TRUE";
}

function text(v: unknown) {
  return v == null ? "" : String(v).trim();
}

/** En rad från arket (rubrik som nyckel) till ett Lead. */
export function franRad(rad: Record<string, unknown>): Lead {
  return {
    id: text(rad[RUBRIK.id]),
    tidpunkt: text(rad[RUBRIK.tidpunkt]),
    namn: text(rad[RUBRIK.namn]),
    telefon: text(rad[RUBRIK.telefon]),
    epost: text(rad[RUBRIK.epost]),
    taktyp: text(rad[RUBRIK.taktyp]),
    yta: text(rad[RUBRIK.yta]),
    meddelande: text(rad[RUBRIK.meddelande]),
    kalla: text(rad[RUBRIK.kalla]),
    gclid: text(rad[RUBRIK.gclid]),
    kanal: text(rad[RUBRIK.kanal]),
    transkript: text(rad[RUBRIK.transkript]),
    bokad: sant(rad[RUBRIK.bokad]),
    offertSkickad: sant(rad[RUBRIK.offertSkickad]),
    offertAccepterad: sant(rad[RUBRIK.offertAccepterad]),
    offertNekad: sant(rad[RUBRIK.offertNekad]),
    projektAvslutat: sant(rad[RUBRIK.projektAvslutat]),
    startdatum: text(rad[RUBRIK.startdatum]),
    adress: text(rad[RUBRIK.adress]),
    offertvarde: text(rad[RUBRIK.offertvarde]),
    anteckning: text(rad[RUBRIK.anteckning]),
    paminnelse: text(rad[RUBRIK.paminnelse]).slice(0, 10),
    logg: tolkaLogg(rad[RUBRIK.logg]),
    arkiverad: sant(rad[RUBRIK.arkiverad]),
  };
}

/* Tid. Arket och loggen räknar i Stockholmstid, och flödena räknar i hela dagar. */

const STOCKHOLM = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "yyyy-MM-dd HH:mm" i Stockholmstid. */
export function stockholmTid(d = new Date()): string {
  const p = Object.fromEntries(STOCKHOLM.formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export function idag(nu = new Date()): string {
  return stockholmTid(nu).slice(0, 10);
}

/** Hela dagar från datumet (första tio tecknen) till idag. */
export function dagarSedan(tid: string, nu = new Date()): number {
  const fran = Date.parse(tid.slice(0, 10) + "T00:00:00Z");
  const till = Date.parse(idag(nu) + "T00:00:00Z");
  return Number.isNaN(fran) ? Infinity : Math.round((till - fran) / 864e5);
}

/** Senaste loggraden vars text börjar med prefixet. */
export function senaste(lead: Lead, prefix: string): LoggRad | undefined {
  for (let i = lead.logg.length - 1; i >= 0; i--) {
    if (lead.logg[i].text.startsWith(prefix)) return lead.logg[i];
  }
  return undefined;
}

/* Status. Härleds från kryssrutorna i arket, som är det Sands redan använder. */

export type Status = "ny" | "kontaktad" | "bokad" | "offert" | "vunnen" | "forlorad" | "avslutad" | "arkiverad";

export const STATUS_NAMN: Record<Status, string> = {
  ny: "Ny",
  kontaktad: "Kontaktad",
  bokad: "Takkontroll bokad",
  offert: "Offert skickad",
  vunnen: "Offert accepterad",
  forlorad: "Offert nekad",
  avslutad: "Projekt avslutat",
  arkiverad: "Arkiverad",
};

/** Namnet i loggen när kunden själv gjort något, t.ex. bokat en tid på /tack. */
export const KUNDEN = "Kunden";

/** Rader i loggen som Sands skrivit, inte kunden. */
export function sandsLogg(lead: Lead): LoggRad[] {
  return lead.logg.filter((r) => r.vem !== KUNDEN);
}

export function status(lead: Lead): Status {
  if (lead.arkiverad) return "arkiverad";
  if (lead.projektAvslutat) return "avslutad";
  if (lead.offertNekad) return "forlorad";
  if (lead.offertAccepterad) return "vunnen";
  if (lead.offertSkickad) return "offert";
  if (lead.bokad) return "bokad";
  // Att kunden själv bokat eller bett om ett samtal betyder inte att någon pratat med dem.
  if (sandsLogg(lead).length || lead.anteckning) return "kontaktad";
  return "ny";
}

export function fornamn(lead: Pick<Lead, "namn">): string {
  const f = lead.namn.split(/\s+/)[0] ?? "";
  // "Leif.claus@,live.se" i namnfältet ska inte bli "Hej Leif.claus@,live.se".
  if (!f || /[@\d]/.test(f)) return "";
  return f.charAt(0).toUpperCase() + f.slice(1);
}

/** Telefonnummer som tel:-länk. Arket tappar ofta den inledande nollan. */
export function telHref(nr: string): string {
  let s = nr.replace(/[^\d+]/g, "");
  if (/^[1-9]\d{6,8}$/.test(s)) s = "0" + s;
  return s ? `tel:${s}` : "";
}
