/*
  Uppföljningsflöden. Varje flöde har en regel för när mejlet föreslås och
  en text. Föreslagna mejl syns i backofficet och i den dagliga
  sammanfattningen, och skickas med ett klick. Med BACKOFFICE_AUTOUTSKICK=1
  skickar det dagliga jobbet dem själv.

  Ett flöde skickas högst en gång per lead (loggraden "Mejl: <namn>"
  räknas). Manuellt går alla flöden att skicka när som helst.

  Regler för texterna: samma CTA-regler som sajten, inga priser och inga nya
  påståenden om garanti eller certifiering (se SEO.md och
  emails/lead-confirmation.tsx). Mejlen skickas i kontaktpersonens namn.
*/
import { kontaktperson } from "../company";
import { dagarSedan, idag, senaste, status, type Lead } from "./lead";

export type FlodeId = "offert_uppfoljning" | "inget_svar";

export type Flode = {
  id: FlodeId;
  namn: string;
  /** När flödet föreslår ett mejl, i klartext för backofficet. */
  regel: string;
  amne: string;
  stycken: (lead: Lead) => string[];
  /** Antal dagar som regeln väntar. */
  dagar: number;
  foreslas: (lead: Lead, nu?: Date) => boolean;
};

export const LOGG = {
  bokad: "Takkontroll bokad",
  offert: "Offert skickad",
  accepterad: "Offert accepterad",
  nekad: "Offert nekad",
  avslutat: "Projekt avslutat",
  arkiverad: "Arkiverad",
  ringtSvar: "Ringt, fick svar",
  ringtInget: "Ringt, inget svar",
  mejl: "Mejl: ",
} as const;

export const loggMejl = (f: Flode) => `${LOGG.mejl}${f.namn}`;

export function redanSkickat(lead: Lead, f: Flode) {
  return Boolean(senaste(lead, loggMejl(f)));
}

const aktiv = (l: Lead) => !l.arkiverad && !l.projektAvslutat && Boolean(l.epost);

export const FLODEN: Flode[] = [
  {
    id: "offert_uppfoljning",
    namn: "Uppföljning av offert",
    dagar: 5,
    regel: "Offert skickad för minst 5 dagar sedan, inget svar markerat (varken accepterad eller nekad).",
    amne: "Har du hunnit titta på prisförslaget?",
    stycken: () => [
      "Jag skickade ett prisförslag på ditt tak för några dagar sedan och ville höra hur du tänker.",
      "Har du frågor om omfattningen, materialet eller ROT-avdraget går jag gärna igenom dem. Vill du ändra något i förslaget räknar jag om det.",
      `Svara på det här mejlet eller ring mig på ${kontaktperson.telefonDisplay}, så tar vi det därifrån.`,
    ],
    foreslas(lead, nu) {
      if (!aktiv(lead) || status(lead) !== "offert" || redanSkickat(lead, this)) return false;
      // Datumet kommer från loggen. Är offerten bara ikryssad i arket finns
      // inget datum, och då föreslås inget (går att skicka manuellt).
      const skickad = senaste(lead, LOGG.offert);
      return Boolean(skickad?.tid) && dagarSedan(skickad!.tid, nu) >= this.dagar;
    },
  },
  {
    id: "inget_svar",
    namn: "Nådde dig inte på telefon",
    dagar: 1,
    regel: "Loggat \"Ringt, inget svar\" för minst 1 dag sedan, utan att någon fått svar efteråt eller bokat takkontroll.",
    amne: "Jag försökte nå dig om ditt tak",
    stycken: () => [
      "Tack för din förfrågan om ditt tak. Jag har försökt ringa dig men inte fått tag på dig, så jag hör av mig här i stället.",
      "Nästa steg är en kostnadsfri takkontroll. Vi kommer ut, går upp på taket och bedömer skicket, och efter besöket får du ett skriftligt prisförslag. Helt utan förpliktelser.",
      `Svara gärna med ett par tider som passar dig, eller ring mig på ${kontaktperson.telefonDisplay}.`,
    ],
    foreslas(lead, nu) {
      if (!aktiv(lead) || lead.bokad || lead.offertSkickad || redanSkickat(lead, this)) return false;
      const inget = senaste(lead, LOGG.ringtInget);
      if (!inget?.tid || dagarSedan(inget.tid, nu) < this.dagar) return false;
      const svar = senaste(lead, LOGG.ringtSvar);
      return !svar || svar.tid < inget.tid;
    },
  },
];

export const flode = (id: string) => FLODEN.find((f) => f.id === id);

export function foreslagna(leads: Lead[], nu = new Date()) {
  return FLODEN.flatMap((f) => leads.filter((l) => f.foreslas(l, nu)).map((lead) => ({ flode: f, lead })));
}

/* Att göra-listan, samma urval i backofficet och i sammanfattningsmejlet. */

/** Nya leads som ingen rört efter ett dygn. Äldre än två veckor räknas inte, då är det historik. */
export function orörda(leads: Lead[], nu = new Date()) {
  return leads.filter((l) => {
    if (status(l) !== "ny") return false;
    const d = dagarSedan(l.tidpunkt, nu);
    return d >= 1 && d <= 14;
  });
}

export function paminnelserIdag(leads: Lead[], nu = new Date()) {
  const dag = idag(nu);
  return leads.filter((l) => !l.arkiverad && l.paminnelse && l.paminnelse <= dag);
}

export function autoutskick(): boolean {
  return process.env.BACKOFFICE_AUTOUTSKICK === "1";
}
