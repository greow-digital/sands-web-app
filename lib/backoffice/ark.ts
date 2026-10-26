/*
  Läsning och skrivning mot lead-arket via Apps Script-bryggan
  (scripts/apps-script/backoffice.gs). Används bara på servern, token får
  aldrig hamna i klientkoden.

  BACKOFFICE_DEMO=1 kör mot exempeldata i minnet i stället, för lokal
  utveckling och flödestester. Det är avstängt i produktion och när
  BACKOFFICE_SCRIPT_URL finns.
*/
import { cache } from "react";
import { RUBRIK, franRad, type Lead, type SkrivbartFalt } from "./lead";
import { demoLista, demoUppdatera } from "./demo";

export function demolage(): boolean {
  // Finns en riktig brygga inställd vinner den, även om BACKOFFICE_DEMO
  // ligger kvar. Annars är det lätt att tro att man testar mot arket.
  return (
    process.env.BACKOFFICE_DEMO === "1" &&
    process.env.VERCEL_ENV !== "production" &&
    !process.env.BACKOFFICE_SCRIPT_URL
  );
}

async function anropa<T>(body: Record<string, unknown>): Promise<T> {
  const url = process.env.BACKOFFICE_SCRIPT_URL;
  const token = process.env.BACKOFFICE_TOKEN;
  if (!url || !token) throw new Error("BACKOFFICE_SCRIPT_URL eller BACKOFFICE_TOKEN saknas");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, token }),
    redirect: "follow",
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(`Arket svarade: ${data?.error ?? res.status}`);
  return data as T;
}

/** Alla leads, nyast först. Läses en gång per sidvisning (sidomenyn och sidan delar). */
export const hamtaLeads = cache(async function hamtaLeads(): Promise<Lead[]> {
  const rader = demolage()
    ? demoLista()
    : (await anropa<{ leads: Record<string, unknown>[] }>({ action: "lista" })).leads;
  return rader
    .map(franRad)
    .filter((l) => l.id)
    .sort((a, b) => b.tidpunkt.localeCompare(a.tidpunkt));
});

export async function hamtaLead(id: string): Promise<Lead | undefined> {
  return (await hamtaLeads()).find((l) => l.id === id);
}

/**
 * Skriver bara de fält som skickas med, plus en loggrad. Övriga celler på
 * raden rörs inte, så den som samtidigt jobbar i arket skrivs inte över.
 */
export async function uppdateraLead(
  id: string,
  falt: Partial<Record<SkrivbartFalt, string | boolean>>,
  logg?: string
): Promise<Lead> {
  const rubriker: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(falt)) rubriker[RUBRIK[k as SkrivbartFalt]] = v;

  const rad = demolage()
    ? demoUppdatera(id, rubriker, logg)
    : (await anropa<{ lead: Record<string, unknown> }>({ action: "uppdatera", id, falt: rubriker, logg })).lead;
  return franRad(rad);
}
