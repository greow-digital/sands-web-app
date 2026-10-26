/*
  Kundens egen bokning på /tack. Kräver biljetten från /api/lead, se
  lib/backoffice/kundbokning.ts.

  GET ?biljett=...                      lediga tider per dag
  POST { biljett, start, adress }       bokar takkontrollen
  POST { biljett, ring: true }          kunden vill hellre bli uppringd
*/
import { NextResponse, type NextRequest } from "next/server";
import { klockslag, perDag, dagText } from "@/lib/backoffice/kalender";
import { KundFel, kundenBokar, kundenVillBliUppringd, kundensTider, lasBiljett } from "@/lib/backoffice/kundbokning";

export const dynamic = "force-dynamic";

const ogiltig = () => NextResponse.json({ error: "Länken har gått ut" }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!lasBiljett(req.nextUrl.searchParams.get("biljett"))) return ogiltig();
  try {
    return NextResponse.json({ dagar: perDag(await kundensTider()) });
  } catch (err) {
    console.error("Kundbokning, lediga tider:", err);
    return NextResponse.json({ error: "Kalendern gick inte att läsa" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const biljett = lasBiljett(data?.biljett);
  if (!biljett) return ogiltig();

  try {
    if (data.ring === true) {
      await kundenVillBliUppringd(biljett);
      return NextResponse.json({ ok: true });
    }
    const start = new Date(String(data.start));
    if (Number.isNaN(start.getTime())) return NextResponse.json({ error: "Ogiltig tid" }, { status: 400 });
    const adress = String(data.adress ?? "").trim().slice(0, 200);
    const mote = await kundenBokar(biljett, start, adress);
    return NextResponse.json({ ok: true, dag: dagText(mote.start), tid: klockslag(mote.start) });
  } catch (err) {
    if (err instanceof KundFel) return NextResponse.json({ error: err.message }, { status: 409 });
    console.error("Kundbokning:", err);
    return NextResponse.json({ error: "Vi kunde inte boka just nu. Vi ringer dig inom 24 timmar i stället." }, { status: 502 });
  }
}
