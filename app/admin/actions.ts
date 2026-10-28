"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hamtaLead, uppdateraLead } from "@/lib/backoffice/ark";
import { flode, LOGG } from "@/lib/backoffice/floden";
import { KRYSSRUTOR, SKRIVBARA, loggRad, status, stockholmTid, type SkrivbartFalt } from "@/lib/backoffice/lead";
import { flytt, type Steg } from "@/lib/backoffice/crm";
import { avslutaSession, kontrollera, kravInloggning, skapaSession } from "@/lib/backoffice/session";
import { korDagligt } from "@/lib/backoffice/dagligt";
import { DAGAR_FRAM, boka, dagText, klockslag, ledigaTider, perDag, type LedigDag } from "@/lib/backoffice/kalender";
import { skickaFlode } from "@/lib/backoffice/utskick";

export type Resultat = { ok?: string; fel?: string } | null;

export async function loggaIn(_: Resultat, form: FormData): Promise<Resultat> {
  const namn = kontrollera(String(form.get("losen") ?? ""));
  if (!namn) {
    // Bromsar gissningar utan att behöva lagra försök någonstans.
    await new Promise((r) => setTimeout(r, 800));
    return { fel: "Fel lösenord" };
  }
  await skapaSession(namn);
  redirect("/admin");
}

export async function loggaUt() {
  await avslutaSession();
  redirect("/admin/logga-in");
}

// Kryssrutor som ger en egen rad i loggen när de kryssas i. Datumet i
// loggen är det flödena räknar dagar från.
const LOGG_VID_KRYSS: Partial<Record<SkrivbartFalt, string>> = {
  bokad: LOGG.bokad,
  offertSkickad: LOGG.offert,
  offertAccepterad: LOGG.accepterad,
  offertNekad: LOGG.nekad,
  projektAvslutat: LOGG.avslutat,
  arkiverad: LOGG.arkiverad,
};

/**
 * Formuläret skickar med varje fälts ursprungsvärde ("fore:<fält>"). Bara
 * fält som ändrats skrivs till arket, så en ändring som någon gjort direkt
 * i arket under tiden skrivs inte över.
 */
export async function sparaLead(_: Resultat, form: FormData): Promise<Resultat> {
  const vem = await kravInloggning();
  const id = String(form.get("id"));
  const andrat: Partial<Record<SkrivbartFalt, string | boolean>> = {};
  const handelser: string[] = [];

  for (const falt of SKRIVBARA) {
    if (!form.has(`fore:${falt}`)) continue;
    const fore = String(form.get(`fore:${falt}`));
    if ((KRYSSRUTOR as readonly string[]).includes(falt)) {
      const nu = form.get(falt) === "on";
      if (String(nu) === fore) continue;
      andrat[falt] = nu;
      const h = LOGG_VID_KRYSS[falt];
      if (h) handelser.push(nu ? h : `${h} (ångrat)`);
    } else {
      const nu = String(form.get(falt) ?? "").trim();
      if (nu === fore) continue;
      andrat[falt] = nu;
      if (falt === "paminnelse") handelser.push(nu ? `Påminnelse ${nu}` : "Påminnelse borttagen");
    }
  }

  const notering = String(form.get("notering") ?? "").trim();
  if (notering) handelser.push(notering);

  if (!Object.keys(andrat).length && !handelser.length) return { ok: "Inget att spara" };

  try {
    await uppdateraLead(id, andrat, handelser.length ? loggRad(vem, handelser.join(". ")) : undefined);
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Kunde inte spara" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "Sparat i arket" };
}

/** Snabbknapparna i leadvyn ("Ringt, inget svar" och liknande). */
export async function snabbLogg(id: string, text: string, falt?: Partial<Record<SkrivbartFalt, boolean>>) {
  const vem = await kravInloggning();
  await uppdateraLead(id, falt ?? {}, loggRad(vem, text));
  revalidatePath("/admin", "layout");
}

/**
 * Pipelinen och stegväljaren. Loggraden börjar med det högsta steget, så
 * att flödena (som letar efter "Offert skickad" först på raden) ser det.
 */
export async function flyttaSteg(id: string, till: Exclude<Steg, "ny">): Promise<Resultat> {
  const vem = await kravInloggning();
  const lead = await hamtaLead(id);
  if (!lead) return { fel: "Hittar inte leaden" };
  const andrat = flytt(lead, till);
  const handelser = Object.entries(andrat)
    .reverse()
    .map(([falt, nu]) => {
      const h = LOGG_VID_KRYSS[falt as SkrivbartFalt]!;
      return nu ? h : `${h} (ångrat)`;
    });
  if (!handelser.length) {
    // Från Ny till Kontaktad ändras ingen kryssruta, det är loggraden som gör det.
    if (till !== "kontaktad" || status(lead) !== "ny") return { ok: "Redan i det steget" };
    handelser.push("Kontaktad");
  }
  try {
    await uppdateraLead(id, andrat, loggRad(vem, handelser.join(". ")));
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Kunde inte spara" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "Flyttad" };
}

export async function sattPaminnelse(id: string, datum: string): Promise<Resultat> {
  const vem = await kravInloggning();
  if (datum && !/^\d{4}-\d{2}-\d{2}$/.test(datum)) return { fel: "Ogiltigt datum" };
  try {
    await uppdateraLead(id, { paminnelse: datum }, loggRad(vem, datum ? `Påminnelse ${datum}` : "Påminnelse borttagen"));
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Kunde inte spara" };
  }
  revalidatePath("/admin", "layout");
  return { ok: datum ? `Påminnelse ${datum}` : "Påminnelse borttagen" };
}

export type { LedigDag };

/** Lediga pass för bokningsväljaren i leadvyn, grupperade per dag. */
export async function hamtaLedigaTider(): Promise<{ dagar?: LedigDag[]; fel?: string }> {
  await kravInloggning();
  const nu = new Date();
  try {
    const dagar = perDag(await ledigaTider(nu, new Date(nu.getTime() + DAGAR_FRAM * 864e5)));
    return { dagar };
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Kunde inte läsa kalendern" };
  }
}

/**
 * Bokar en takkontroll: händelse i kalendern med lead-ID:t, kryssrutan
 * Bokad och en loggrad som börjar med "Takkontroll bokad".
 */
export async function bokaTid(id: string, start: string): Promise<Resultat> {
  const vem = await kravInloggning();
  const lead = await hamtaLead(id);
  if (!lead) return { fel: "Hittar inte leaden" };
  const fran = new Date(start);
  if (Number.isNaN(fran.getTime())) return { fel: "Ogiltig tid" };

  let mote;
  try {
    // Någon kan ha bokat tiden sedan väljaren öppnades, så kolla igen.
    const ledig = (await ledigaTider(new Date(fran.getTime() - 1), new Date(fran.getTime() + 2 * 3600_000))).find(
      (p) => Date.parse(p.start) === fran.getTime()
    );
    if (!ledig) return { fel: "Tiden är inte ledig längre, välj en annan" };
    mote = await boka({ lead, start: fran, slut: new Date(ledig.slut) });
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Kunde inte boka i kalendern" };
  }

  const text = `${LOGG.bokad} ${stockholmTid(fran)}`;
  try {
    await uppdateraLead(id, lead.bokad ? {} : { bokad: true }, loggRad(vem, text));
  } catch (err) {
    // Mötet finns i kalendern även om arket inte gick att skriva.
    return { fel: `Bokad i kalendern, men arket gick inte att uppdatera: ${err instanceof Error ? err.message : err}` };
  }
  revalidatePath("/admin", "layout");
  return { ok: `Bokad ${dagText(mote.start)} ${klockslag(mote.start)}` };
}

export async function skickaUtskick(id: string, flodeId: string): Promise<Resultat> {
  const vem = await kravInloggning();
  const f = flode(flodeId);
  const lead = await hamtaLead(id);
  if (!f || !lead) return { fel: "Hittar inte leaden eller flödet" };
  try {
    await skickaFlode(lead, f, vem);
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Utskicket misslyckades" };
  }
  revalidatePath("/admin", "layout");
  return { ok: `Skickat till ${lead.epost}` };
}

export async function korDagligtNu(): Promise<Resultat> {
  await kravInloggning();
  try {
    const r = await korDagligt();
    revalidatePath("/admin", "layout");
    return {
      ok: `Klart. ${r.skickade} uppföljningar skickade, ${r.forslag} föreslagna. ${r.sammanfattning ? "Sammanfattningen är skickad." : "Ingen sammanfattning skickad."}`,
      fel: r.misslyckade.length ? r.misslyckade.join("; ") : undefined,
    };
  } catch (err) {
    return { fel: err instanceof Error ? err.message : "Jobbet misslyckades" };
  }
}
