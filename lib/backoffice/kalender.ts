/*
  Kalendern för takkontroller. Backofficet pratar bara med gränssnittet
  här, så att Google Kalender kan bytas mot något annat senare.

  Mötet kopplas till leaden med lead-ID:t i extendedProperties.private.leadId,
  så arket behöver ingen ny kolumn. Kalendern är facit för när mötet är,
  arket har bara kryssrutan Bokad och loggraden.

  Implementationer:
  - Google Kalender: GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET,
    GOOGLE_CALENDAR_REFRESH_TOKEN och (valfritt) GOOGLE_CALENDAR_ID, se
    docs/GOOGLE_KALENDER.md.
  - Minneskalender i demoläget (BACKOFFICE_DEMO=1), nollställs vid omstart.

  Används bara på servern, nycklarna får aldrig hamna i klientkoden.
*/
import { cache } from "react";
import { demolage } from "./ark";
import { visningsnamn } from "./crm";
import { idag, stockholmTid, type Lead } from "./lead";

export type Mote = {
  id: string;
  leadId: string;
  titel: string;
  /** ISO-tid. */
  start: string;
  slut: string;
  /** Länk till händelsen i kalendern, om det finns en. */
  lank?: string;
};

/** Vilken händelse som helst i kalendern, för kalendervyn. */
export type Handelse = {
  id: string;
  titel: string;
  /** ISO-tid, eller "yyyy-MM-dd" för heldagshändelser. */
  start: string;
  /** Heldag: dagen efter sista dagen, som i Google Kalender. */
  slut: string;
  heldag: boolean;
  /** Satt om händelsen är en takkontroll bokad från backofficet. */
  leadId?: string;
  plats?: string;
  lank?: string;
};

export type Pass = { start: string; slut: string };

type Upptagen = { start: number; slut: number };

interface Kalender {
  upptaget(fran: Date, till: Date): Promise<Upptagen[]>;
  skapa(h: { leadId: string; titel: string; beskrivning: string; plats: string; start: Date; slut: Date }): Promise<Mote>;
  lista(fran: Date, till: Date, leadId?: string): Promise<Mote[]>;
  alla(fran: Date, till: Date): Promise<Handelse[]>;
}

/* Arbetstider för takkontroller. Pass om en timme, vardagar. */

const FORSTA_TIMME = 8;
const SISTA_TIMME = 16; // sista passet börjar 16:00
const PASS_MIN = 60;
/** Så här långt framåt visar väljaren lediga tider. */
export const DAGAR_FRAM = 14;

/* Google Kalender */

function googleInstalld() {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID && process.env.GOOGLE_CALENDAR_CLIENT_SECRET && process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
  );
}

const API = "https://www.googleapis.com/calendar/v3";
let atkomst: { token: string; giltig: number } | null = null;

async function token(): Promise<string> {
  if (atkomst && atkomst.giltig > Date.now() + 60_000) return atkomst.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CALENDAR_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.access_token) {
    throw new Error(`Google-inloggningen misslyckades: ${data?.error_description ?? data?.error ?? res.status}`);
  }
  atkomst = { token: data.access_token, giltig: Date.now() + Number(data.expires_in ?? 3600) * 1000 };
  return atkomst.token;
}

async function google<T>(sokvag: string, init: { method?: string; body?: unknown; query?: Record<string, string> } = {}): Promise<T> {
  const url = new URL(API + sokvag);
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.append(k, v);
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`Google Kalender svarade: ${data?.error?.message ?? res.status}`);
  return data as T;
}

type GoogleHandelse = {
  id: string;
  summary?: string;
  htmlLink?: string;
  status?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  extendedProperties?: { private?: Record<string, string> };
};

function franGoogle(h: GoogleHandelse): Mote | null {
  const leadId = h.extendedProperties?.private?.leadId;
  const start = h.start?.dateTime;
  if (!leadId || !start || h.status === "cancelled") return null;
  return { id: h.id, leadId, titel: h.summary ?? "", start, slut: h.end?.dateTime ?? start, lank: h.htmlLink };
}

function handelseFranGoogle(h: GoogleHandelse): Handelse | null {
  if (h.status === "cancelled") return null;
  const heldag = !h.start?.dateTime;
  const start = h.start?.dateTime ?? h.start?.date;
  if (!start) return null;
  return {
    id: h.id,
    titel: h.summary ?? "(utan titel)",
    start,
    slut: h.end?.dateTime ?? h.end?.date ?? start,
    heldag,
    leadId: h.extendedProperties?.private?.leadId,
    plats: h.location,
    lank: h.htmlLink,
  };
}

function googleKalender(): Kalender {
  const kalender = process.env.GOOGLE_CALENDAR_ID || "primary";
  const sokvag = `/calendars/${encodeURIComponent(kalender)}/events`;
  return {
    async upptaget(fran, till) {
      const svar = await google<{ calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }> }>(
        "/freeBusy",
        { method: "POST", body: { timeMin: fran.toISOString(), timeMax: till.toISOString(), timeZone: "Europe/Stockholm", items: [{ id: kalender }] } }
      );
      const k = Object.values(svar.calendars ?? {})[0];
      if (!k || k.errors?.length) throw new Error(`Google Kalender svarade: ${k?.errors?.[0]?.reason ?? "ingen kalender"}`);
      return (k.busy ?? []).map((b) => ({ start: Date.parse(b.start), slut: Date.parse(b.end) }));
    },
    async skapa(h) {
      const skapad = await google<GoogleHandelse>(sokvag, {
        method: "POST",
        body: {
          summary: h.titel,
          description: h.beskrivning,
          location: h.plats || undefined,
          start: { dateTime: h.start.toISOString(), timeZone: "Europe/Stockholm" },
          end: { dateTime: h.slut.toISOString(), timeZone: "Europe/Stockholm" },
          extendedProperties: { private: { leadId: h.leadId } },
        },
      });
      const mote = franGoogle(skapad);
      if (!mote) throw new Error("Google Kalender skapade inte händelsen");
      return mote;
    },
    async lista(fran, till, leadId) {
      return (await hamta(fran, till, leadId)).map(franGoogle).filter((m): m is Mote => m !== null);
    },
    async alla(fran, till) {
      return (await hamta(fran, till)).map(handelseFranGoogle).filter((h): h is Handelse => h !== null);
    },
  };

  async function hamta(fran: Date, till: Date, leadId?: string): Promise<GoogleHandelse[]> {
    const handelser: GoogleHandelse[] = [];
    let sida: string | undefined;
    do {
      const query: Record<string, string> = {
        timeMin: fran.toISOString(),
        timeMax: till.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "250",
      };
      // Utan lead-ID hämtas alla händelser. lista() sorterar bort de utan leadId.
      if (leadId) query.privateExtendedProperty = `leadId=${leadId}`;
      if (sida) query.pageToken = sida;
      const svar = await google<{ items?: GoogleHandelse[]; nextPageToken?: string }>(sokvag, { query });
      handelser.push(...(svar.items ?? []));
      sida = svar.nextPageToken;
    } while (sida);
    return handelser;
  }
}

/* Minneskalender för demoläget */

let demoData: { moten: Mote[]; upptaget: (Upptagen & { titel: string })[]; heldag: Handelse[] } | null = null;

/** Klockslag i Stockholm, "yyyy-MM-dd" och timme, som Date. */
export function stockholm(dag: string, timme: number, minut = 0): Date {
  const gissning = Date.parse(`${dag}T${String(timme).padStart(2, "0")}:${String(minut).padStart(2, "0")}:00Z`);
  // Skillnaden mellan väggtiden i Stockholm och UTC vid gissningen är zonens förskjutning.
  const vagg = Date.parse(stockholmTid(new Date(gissning)).replace(" ", "T") + ":00Z");
  return new Date(gissning - (vagg - gissning));
}

function vardagar(fran: string, antal: number): string[] {
  const dagar: string[] = [];
  for (let i = 0; dagar.length < antal && i < antal * 2; i++) {
    const d = new Date(Date.parse(fran + "T12:00:00Z") + i * 864e5);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) dagar.push(d.toISOString().slice(0, 10));
  }
  return dagar;
}

function demo() {
  if (demoData) return demoData;
  // Några upptagna tider så att väljaren visar luckor, och ett bokat möte
  // för Testperson Fem (som är bokad i demo.ts).
  const [d1, d2, d3] = vardagar(idag(new Date(Date.now() + 864e5)), 3);
  const upptaget = [
    { start: stockholm(d1, 9).getTime(), slut: stockholm(d1, 11).getTime(), titel: "Annat möte" },
    { start: stockholm(d2, 13).getTime(), slut: stockholm(d2, 14, 30).getTime(), titel: "Lunch med leverantör" },
  ];
  const moten: Mote[] = [
    { id: "demo-mote-1", leadId: "demo0005", titel: "Takkontroll: Testperson Fem", start: stockholm(d3, 16).toISOString(), slut: stockholm(d3, 17).toISOString() },
  ];
  const heldag: Handelse[] = [{ id: "demo-heldag-1", titel: "Materialleverans Bromma", start: d2, slut: vardagar(d2, 2)[1], heldag: true }];
  demoData = { moten, upptaget, heldag };
  return demoData;
}

function minneskalender(): Kalender {
  return {
    async upptaget(fran, till) {
      const { moten, upptaget } = demo();
      return [...upptaget, ...moten.map((m) => ({ start: Date.parse(m.start), slut: Date.parse(m.slut) }))].filter(
        (u) => u.slut > fran.getTime() && u.start < till.getTime()
      );
    },
    async skapa(h) {
      const m: Mote = { id: `demo-mote-${Date.now()}`, leadId: h.leadId, titel: h.titel, start: h.start.toISOString(), slut: h.slut.toISOString() };
      demo().moten.push(m);
      return { ...m };
    },
    async lista(fran, till, leadId) {
      return demo()
        .moten.filter((m) => Date.parse(m.slut) > fran.getTime() && Date.parse(m.start) < till.getTime())
        .filter((m) => !leadId || m.leadId === leadId)
        .sort((a, b) => a.start.localeCompare(b.start))
        .map((m) => ({ ...m }));
    },
    async alla(fran, till) {
      const { moten, upptaget, heldag } = demo();
      const iso = (t: number) => new Date(t).toISOString();
      return [
        ...upptaget.map((u, i) => ({ id: `demo-upptaget-${i}`, titel: u.titel, start: iso(u.start), slut: iso(u.slut), heldag: false })),
        ...moten.map((m) => ({ ...m, heldag: false })),
        ...heldag,
      ].filter((h) => h.slut > (h.heldag ? idag(fran) : fran.toISOString()) && h.start < (h.heldag ? idag(till) : till.toISOString()));
    },
  };
}

/* Gränssnittet */

function kalender(): Kalender | null {
  if (demolage()) return minneskalender();
  if (googleInstalld()) return googleKalender();
  return null;
}

export function kalenderInstalld(): boolean {
  return kalender() !== null;
}

function kravKalender(): Kalender {
  const k = kalender();
  if (!k) throw new Error("Kalendern är inte inställd (GOOGLE_CALENDAR_* saknas)");
  return k;
}

/**
 * Lediga pass mellan fran och till: vardagar, en timme, 08 till 17 i
 * Stockholmstid. Pass som redan börjat eller börjar inom en timme räknas inte.
 */
export async function ledigaTider(fran: Date, till: Date): Promise<Pass[]> {
  const upptaget = await kravKalender().upptaget(fran, till);
  const tidigast = Math.max(fran.getTime(), Date.now() + 60 * 60_000);
  const antal = Math.ceil((till.getTime() - fran.getTime()) / 864e5) + 1;
  const pass: Pass[] = [];
  for (let i = 0; i < antal; i++) {
    const dag = idag(new Date(fran.getTime() + i * 864e5));
    const veckodag = new Date(dag + "T12:00:00Z").getUTCDay();
    if (veckodag === 0 || veckodag === 6) continue;
    for (let t = FORSTA_TIMME; t <= SISTA_TIMME; t++) {
      const start = stockholm(dag, t).getTime();
      const slut = start + PASS_MIN * 60_000;
      if (start < tidigast || slut > till.getTime()) continue;
      if (upptaget.some((u) => u.start < slut && u.slut > start)) continue;
      pass.push({ start: new Date(start).toISOString(), slut: new Date(slut).toISOString() });
    }
  }
  return pass;
}

export async function boka({ lead, start, slut }: { lead: Lead; start: Date; slut: Date }): Promise<Mote> {
  const namn = visningsnamn(lead);
  return kravKalender().skapa({
    leadId: lead.id,
    titel: `Takkontroll: ${[namn, lead.adress].filter(Boolean).join(", ")}`,
    beskrivning: [
      `Telefon: ${lead.telefon || "saknas"}`,
      lead.epost && `E-post: ${lead.epost}`,
      [lead.taktyp, lead.yta && `${lead.yta} m²`].filter(Boolean).join(", "),
      lead.meddelande && `Meddelande: ${lead.meddelande}`,
      `Backoffice: https://www.sandsab.se/admin/lead/${lead.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
    plats: lead.adress,
    start,
    slut,
  });
}

/** Bokade takkontroller mellan fran och till, tidigast först. Med leadId bara den leadens. */
export async function kommande(fran: Date, till: Date, leadId?: string): Promise<Mote[]> {
  const moten = await kravKalender().lista(fran, till, leadId);
  return moten.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * För sidorna: kommande möten de närmaste dagarna, en gång per sidvisning.
 * Saknas kalendern eller fallerar den blir listan tom och felet visas
 * diskret, så att sidan fortfarande fungerar.
 */
export const kommandeSakert = cache(async function kommandeSakert(
  dagar = 60
): Promise<{ moten: Mote[]; fel?: string; installd: boolean }> {
  if (!kalenderInstalld()) return { moten: [], installd: false };
  const nu = new Date();
  try {
    return { moten: await kommande(nu, new Date(nu.getTime() + dagar * 864e5)), installd: true };
  } catch (err) {
    return { moten: [], fel: err instanceof Error ? err.message : String(err), installd: true };
  }
});

/** Alla händelser i kalendern mellan fran och till, för kalendervyn. */
export async function allaHandelser(fran: Date, till: Date): Promise<Handelse[]> {
  return kravKalender().alla(fran, till);
}

/** Möten som börjar inom så många dagar. */
export function inomDagar(moten: Mote[], dagar: number, nu = new Date()): Mote[] {
  return moten.filter((m) => Date.parse(m.start) < nu.getTime() + dagar * 864e5);
}

/** Närmaste kommande möte per lead. */
export function nastaPerLead(moten: Mote[]): Map<string, Mote> {
  const per = new Map<string, Mote>();
  for (const m of moten) if (!per.has(m.leadId) || m.start < per.get(m.leadId)!.start) per.set(m.leadId, m);
  return per;
}

const VECKODAG = ["sön", "mån", "tis", "ons", "tor", "fre", "lör"];
const MANAD = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** "tis 28 okt" i Stockholmstid. */
export function dagText(iso: string): string {
  const dag = stockholmTid(new Date(iso)).slice(0, 10);
  const [, m, d] = dag.split("-");
  const vd = new Date(dag + "T12:00:00Z").getUTCDay();
  const text = `${VECKODAG[vd]} ${Number(d)} ${MANAD[Number(m) - 1]}`;
  if (dag === idag()) return `i dag, ${text}`;
  if (dag === idag(new Date(Date.now() + 864e5))) return `i morgon, ${text}`;
  return text;
}

/** "10:00" i Stockholmstid. */
export function klockslag(iso: string): string {
  return stockholmTid(new Date(iso)).slice(11, 16);
}

/** "tis 28 okt 10:00". */
export function moteText(m: Pick<Mote, "start">): string {
  return `${dagText(m.start)} ${klockslag(m.start)}`;
}
