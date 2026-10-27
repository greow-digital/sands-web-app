/*
  Kunden bokar själv sin takkontroll på /tack, efter att ha skickat in
  formuläret på en landningssida.

  /api/lead lämnar en biljett när leadet ligger i arket. Biljetten är
  signerad (HMAC med BACKOFFICE_SESSION_SECRET), gäller i sex timmar och
  innehåller bara telefon och e-post. Med den hittar /api/boka leadet i
  arket, så att mötet kopplas till rätt rad. Utan giltig biljett går det
  varken att se lediga tider eller boka.
*/
import { createHmac, timingSafeEqual } from "node:crypto";
import { demolage, lasLeads, uppdateraLead } from "./ark";
import { LOGG } from "./floden";
import { boka, kalenderInstalld, ledigaTider, stockholm, type Mote } from "./kalender";
import { KUNDEN, dagarSedan, idag, loggRad, stockholmTid, type Lead } from "./lead";

const GILTIG_TIMMAR = 6;

type Biljett = { telefon: string; epost: string; t: number };

function hemlighet(): string | null {
  const s = process.env.BACKOFFICE_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  return demolage() ? "demo-hemlighet-som-bara-galler-lokalt-0000" : null;
}

function signatur(data: string, h: string) {
  return createHmac("sha256", h).update(data).digest("base64url");
}

/** Biljett till ett nytt lead, eller null när kalendern eller hemligheten saknas. */
export function skapaBiljett(telefon: string | undefined, epost: string | undefined): string | null {
  const h = hemlighet();
  if (!h || !kalenderInstalld() || (!telefon && !epost)) return null;
  const data = Buffer.from(JSON.stringify({ telefon: telefon ?? "", epost: epost ?? "", t: Date.now() } satisfies Biljett)).toString("base64url");
  return `${data}.${signatur(data, h)}`;
}

export function lasBiljett(biljett: unknown): Biljett | null {
  const h = hemlighet();
  if (!h || typeof biljett !== "string") return null;
  const [data, sig] = biljett.split(".");
  if (!data || !sig) return null;
  const vantad = Buffer.from(signatur(data, h));
  const fick = Buffer.from(sig);
  if (vantad.length !== fick.length || !timingSafeEqual(vantad, fick)) return null;
  try {
    const b = JSON.parse(Buffer.from(data, "base64url").toString()) as Biljett;
    return Date.now() - b.t < GILTIG_TIMMAR * 3600_000 ? b : null;
  } catch {
    return null;
  }
}

/** Telefonnummer utan landsnummer, nollor och tecken, så att "070-123 45 67" och "+4670..." matchar. */
function nummer(s: string) {
  return s.replace(/\D/g, "").replace(/^46/, "").replace(/^0+/, "");
}

const vanta = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Leadet som biljetten hör till: det nyaste från i dag eller i går med samma
 * telefon eller e-post. Raden kan ta en stund att dyka upp i arket, så det
 * görs några försök.
 */
async function hittaLead(b: Biljett): Promise<Lead | undefined> {
  const tel = nummer(b.telefon);
  const epost = b.epost.trim().toLowerCase();
  for (let forsok = 0; forsok < 4; forsok++) {
    const lead = (await lasLeads()).find(
      (l) => dagarSedan(l.tidpunkt) <= 1 && ((tel && nummer(l.telefon) === tel) || (epost && l.epost.trim().toLowerCase() === epost))
    );
    if (lead) return lead;
    await vanta(1500);
  }
  return undefined;
}

/** Lediga tider för kunden: från i morgon bitti (Stockholmstid) och två veckor fram. */
export async function kundensTider(): Promise<{ start: string; slut: string }[]> {
  const imorgon = stockholm(idag(new Date(Date.now() + 864e5)), 0);
  return ledigaTider(imorgon, new Date(imorgon.getTime() + 14 * 864e5));
}

export async function kundenBokar(b: Biljett, start: Date, adress: string): Promise<Mote> {
  const pass = (await kundensTider()).find((p) => Date.parse(p.start) === start.getTime());
  if (!pass) throw new KundFel("Tiden hann bli bokad. Välj en annan tid.");
  const lead = await hittaLead(b);
  if (!lead) throw new KundFel("Vi kunde inte boka just nu. Vi ringer dig inom 24 timmar i stället.");

  const mote = await boka({ lead: { ...lead, adress: adress || lead.adress }, start, slut: new Date(pass.slut) });
  // Loggraden börjar med "Takkontroll bokad" som när säljaren bokar, men står på kunden.
  await uppdateraLead(
    lead.id,
    { ...(lead.bokad ? {} : { bokad: true }), ...(adress && !lead.adress ? { adress } : {}) },
    loggRad(KUNDEN, `${LOGG.bokad} ${stockholmTid(start)}, bokad av kunden på /tack`)
  );
  return mote;
}

export async function kundenVillBliUppringd(b: Biljett): Promise<void> {
  const lead = await hittaLead(b);
  if (!lead) return;
  await uppdateraLead(lead.id, {}, loggRad(KUNDEN, "Vill bli uppringd i stället för att boka själv"));
}

/** Fel som kan visas för kunden som de är. */
export class KundFel extends Error {}
