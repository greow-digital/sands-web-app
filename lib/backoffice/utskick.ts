/*
  Skickar uppföljningsmejl och den dagliga sammanfattningen via Resend,
  samma konto och avsändare som bekräftelsemejlet i /api/lead.
*/
import { render } from "@react-email/render";
import { Resend } from "resend";
import BackofficeUtskick from "@/emails/backoffice-utskick";
import BackofficeSammanfattning, { type SammanfattningAvsnitt } from "@/emails/backoffice-sammanfattning";
import { uppdateraLead, demolage } from "./ark";
import { fornamn, loggRad, type Lead } from "./lead";
import { loggMejl, type Flode } from "./floden";

const FRAN = () => process.env.LEAD_FROM_EMAIL || "Sands Entreprenad <no-reply@sandsab.se>";
const SVAR_TILL = () => process.env.LEAD_REPLY_TO || "info@sandsab.se";

export const adminUrl = (vag = "") =>
  (process.env.BACKOFFICE_BAS_URL || "https://www.sandsab.se").replace(/\/$/, "") + "/admin" + vag;

export function renderaUtskick(lead: Lead, f: Flode, plainText = false) {
  const element = BackofficeUtskick({ fornamn: fornamn(lead), stycken: f.stycken(lead) });
  return plainText ? render(element, { plainText: true }) : render(element);
}

async function skicka(opts: { to: string[]; subject: string; html: string; text: string; tagg: string }) {
  // Demoläget skickar aldrig, även om Preview har en Resend-nyckel.
  if (demolage()) {
    console.info(`[demo] mejl till ${opts.to.join(", ")}: ${opts.subject}`);
    return;
  }
  const nyckel = process.env.RESEND_API_KEY;
  if (!nyckel) throw new Error("RESEND_API_KEY saknas");
  const { error } = await new Resend(nyckel).emails.send({
    from: FRAN(),
    to: opts.to,
    replyTo: SVAR_TILL(),
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    tags: [{ name: "type", value: opts.tagg }],
  });
  if (error) throw new Error(error.message);
}

/**
 * Loggar först och skickar sedan. Går loggningen igenom men utskicket inte
 * skrivs ett felmeddelande i loggen. Hellre ett uteblivet mejl som syns än
 * att samma kund får mejlet två gånger för att loggen saknades.
 */
export async function skickaFlode(lead: Lead, f: Flode, vem: string, automatiskt = false) {
  if (!lead.epost) throw new Error("Leaden saknar e-post");
  await uppdateraLead(lead.id, {}, loggRad(vem, loggMejl(f) + (automatiskt ? " (automatiskt)" : "")));
  try {
    const [html, text] = await Promise.all([renderaUtskick(lead, f), renderaUtskick(lead, f, true)]);
    await skicka({ to: [lead.epost], subject: f.amne, html, text, tagg: `backoffice_${f.id}` });
  } catch (err) {
    const fel = err instanceof Error ? err.message : String(err);
    await uppdateraLead(lead.id, {}, loggRad(vem, `Utskicket misslyckades (${f.namn}): ${fel}`)).catch(() => {});
    throw err;
  }
}

export async function skickaSammanfattning(datum: string, avsnitt: SammanfattningAvsnitt[]) {
  const till = (process.env.BACKOFFICE_SAMMANFATTNING_TILL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!till.length) return false;
  const element = BackofficeSammanfattning({ datum, avsnitt, adminUrl: adminUrl() });
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  await skicka({ to: till, subject: `Att göra i backofficet ${datum}`, html, text, tagg: "backoffice_sammanfattning" });
  return true;
}
