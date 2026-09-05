import { NextResponse, after } from "next/server";
import { render } from "@react-email/render";
import { Resend } from "resend";
import LeadConfirmation from "@/emails/lead-confirmation";

// Resend-klienten och @react-email/render kräver Node, inte Edge.
export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  roofType?: string;
  area?: string;
  message?: string;
  source?: string;
  formId?: string;
  tag?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  // Taktest-widgetens metadata (skickas med när formId === "taktest")
  roofAge?: string;
  symptoms?: string;
  leak?: string;
  decade?: string;
  urgency?: string;
  leadSource?: string;
  // Voice-agentens transkript (skickas med när formId === "voice")
  transcript?: string;
};

const EPOST_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Bekräftelsemejl till kunden. Sands notifieras separat av Apps Script
 * när raden skrivs till kalkylbladet, så här skickas INGET internmejl.
 * Lägger man till ett får Sands dubbla larm på varje lead.
 *
 * Körs i after(), alltså efter att svaret gått iväg. Ett fel här får
 * aldrig påverka besökaren: leadet är redan levererat via kalkylbladet
 * och formuläret ska inte visa ett felmeddelande för att mejlet strular.
 */
async function skickaBekraftelse(data: LeadPayload) {
  const epost = data.email?.trim().toLowerCase();
  if (!epost || !EPOST_RE.test(epost)) return;

  const nyckel = process.env.RESEND_API_KEY;
  if (!nyckel) {
    console.warn("RESEND_API_KEY saknas, hoppar över bekräftelsemejl");
    return;
  }

  const from =
    process.env.LEAD_FROM_EMAIL || "Sands Entreprenad <no-reply@sandsab.se>";
  const replyTo = process.env.LEAD_REPLY_TO || "info@sandsab.se";

  try {
    const element = LeadConfirmation({
      name: data.name?.trim() || "",
      email: epost,
      phone: data.phone?.trim() || undefined,
      roofType: data.roofType?.trim() || undefined,
      area: data.area?.trim() || undefined,
      message: data.message?.trim() || undefined,
    });

    const [html, text] = await Promise.all([
      render(element),
      render(element, { plainText: true }),
    ]);

    const { error } = await new Resend(nyckel).emails.send({
      from,
      to: epost,
      replyTo,
      // Första meningen är allt som säkert syns på mobil, så bekräftelsen
      // ligger först och löftet fyller ut i förhandsvisningen.
      //
      // "Senast" sätter ett tak i stället för en tidpunkt. Det håller även
      // för en förfrågan som kommer in en lördagkväll, och det underpresterar
      // inte när Sands ringer inom en timme. Byt inte till en exakt tid utan
      // att först veta om Sands svarar på helger.
      subject: "Tack för din förfrågan. Vi hör av oss senast nästa vardag.",
      html,
      text,
      tags: [{ name: "type", value: "lead_confirmation" }],
    });

    if (error) console.error("Resend-fel:", error.message);
  } catch (err) {
    console.error("Bekräftelsemejl misslyckades:", err);
  }
}

export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Popup-leads ("personlig service") och taktest-widgeten kräver minst ett
  // av e-post/telefon (taktest ber om "telefon eller e-post"). Övriga
  // formulär kräver namn+telefon.
  if (data.formId === "voice") {
    // Röst-leads: kontaktuppgift ELLER transkript räcker. Transkriptet
    // innehåller ofta kontakten i klartext som en människa kan läsa, även
    // när siffertolkningen inte kunde plocka ut ett rent telefonnummer.
    if (!data.email && !data.phone && !data.transcript) {
      return NextResponse.json(
        { error: "Kontakt eller transkript krävs" },
        { status: 400 }
      );
    }
  } else if (data.formId === "popup" || data.formId === "taktest") {
    if (!data.email && !data.phone) {
      return NextResponse.json(
        { error: "E-post eller telefon krävs" },
        { status: 400 }
      );
    }
  } else if (
    data.formId === "calc_bridge" ||
    data.formId === "home_hero" ||
    data.formId === "home_section" ||
    data.formId === "taklaggning_hero" ||
    data.formId === "taklaggning_section" ||
    data.formId === "tjanst_hero" ||
    data.formId === "omrade_hero"
  ) {
    // Formulär som frågar efter "telefon eller e-post" och låter
    // användaren välja. Kräver därför namn + minst en kontaktväg, annars
    // skulle en e-postlead avvisas av servern trots att formuläret
    // godkände den.
    if (!data.name || (!data.email && !data.phone)) {
      return NextResponse.json(
        { error: "Namn och telefon eller e-post krävs" },
        { status: 400 }
      );
    }
  } else if (!data.name || !data.phone) {
    return NextResponse.json(
      { error: "Namn och telefon krävs" },
      { status: 400 }
    );
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL saknas");
    return NextResponse.json(
      { error: "Server inte konfigurerad" },
      { status: 500 }
    );
  }

  const payload = {
    ...data,
    source: data.source || "sandsab.se",
    submittedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") || "",
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Webhook-svar icke-OK:", res.status, text);
      return NextResponse.json(
        { error: "Kunde inte skicka lead" },
        { status: 502 }
      );
    }

    // Först när leadet ligger i kalkylbladet är det levererat till Sands.
    // Bekräftelsen till kunden skickas efter svaret, aldrig före.
    after(() => skickaBekraftelse(data));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook-fel:", err);
    return NextResponse.json(
      { error: "Kunde inte skicka lead" },
      { status: 500 }
    );
  }
}
