import { NextResponse } from "next/server";

export const runtime = "edge";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  roofType?: string;
  area?: string;
  message?: string;
  source?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
};

export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data.name || !data.phone) {
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook-fel:", err);
    return NextResponse.json(
      { error: "Kunde inte skicka lead" },
      { status: 500 }
    );
  }
}
