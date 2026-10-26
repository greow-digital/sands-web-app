/*
  Det dagliga jobbet: skickar föreslagna uppföljningar om automatiken är
  på, och mejlar en sammanfattning till Sands. Körs av Vercel Cron via
  /api/admin/dagligt och går att köra för hand från /admin/utskick.
*/
import { hamtaLeads } from "./ark";
import { autoutskick, foreslagna, orörda, paminnelserIdag } from "./floden";
import { idag, type Lead } from "./lead";
import { adminUrl, skickaFlode, skickaSammanfattning } from "./utskick";
import type { SammanfattningAvsnitt } from "@/emails/backoffice-sammanfattning";

const vanta = (ms: number) => new Promise((r) => setTimeout(r, ms));

const rad = (l: Lead, detalj: string) => ({
  namn: l.namn || l.epost || l.telefon || "Utan namn",
  detalj,
  href: adminUrl(`/lead/${l.id}`),
});

export async function korDagligt() {
  const nu = new Date();
  const leads = await hamtaLeads();
  const forslag = foreslagna(leads, nu);
  const auto = autoutskick();

  const skickade: typeof forslag = [];
  const misslyckade: string[] = [];
  if (auto) {
    for (const f of forslag) {
      try {
        await skickaFlode(f.lead, f.flode, "Automatik", true);
        skickade.push(f);
      } catch (err) {
        misslyckade.push(`${f.lead.namn}: ${err instanceof Error ? err.message : err}`);
      }
      // Resend tar emot ett par anrop i sekunden.
      await vanta(600);
    }
  }

  const avsnitt: SammanfattningAvsnitt[] = [
    {
      rubrik: "Påminnelser",
      rader: paminnelserIdag(leads, nu).map((l) => rad(l, l.anteckning || l.telefon)),
    },
    {
      rubrik: "Nya leads som ingen rört efter ett dygn",
      rader: orörda(leads, nu).map((l) => rad(l, [l.telefon, l.tidpunkt.slice(0, 10)].filter(Boolean).join(", "))),
    },
    auto
      ? { rubrik: "Uppföljningar som skickades i dag", rader: skickade.map((f) => rad(f.lead, f.flode.namn)) }
      : { rubrik: "Uppföljningar att skicka (ett klick i backofficet)", rader: forslag.map((f) => rad(f.lead, f.flode.namn)) },
    {
      rubrik: "Utskick som misslyckades",
      rader: misslyckade.map((fel) => ({ namn: fel, detalj: "", href: adminUrl("/utskick") })),
    },
  ];

  const harInnehall = avsnitt.some((a) => a.rader.length);
  const sammanfattning = harInnehall ? await skickaSammanfattning(idag(nu), avsnitt) : false;

  return { forslag: forslag.length, skickade: skickade.length, misslyckade, sammanfattning };
}
