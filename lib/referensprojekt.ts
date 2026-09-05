/**
 * Verkliga projekt med det pris kunden faktiskt betalade.
 *
 * Källan är offerten i projektmappen (Sands-web/sandsab-bilder/<projekt>),
 * INTE prismodellen i lib/material.ts. Beloppet är raden "Totalt inkl.
 * moms" i offerten, alltså efter att ROT-avdraget dragits av. ROT-satsen
 * skiljer sig mellan åren och står därför per projekt.
 *
 * Skriv aldrig in ett räknat pris här. Hela poängen med sektionen är att
 * siffrorna är verkliga och går att spåra till ett offertnummer, till
 * skillnad från riktpriserna i kalkylatorn. Saknas offert ska projektet
 * utelämnas, inte kompletteras med en uppskattning.
 *
 * `slug` matchar projektet i Sanity, så bild och länk hämtas därifrån.
 */
export interface Referensprojekt {
  slug: string;
  /** Plats som visas på kortet. */
  plats: string;
  /** Faktisk takyta enligt offerten. */
  kvm: number;
  material: string;
  ar: number;
  /** Totalt inkl. moms efter ROT, ur offerten. */
  prisEfterRot: number;
  /** ROT-satsen som gällde när offerten skrevs. */
  rotProcent: number;
  /** Offertnummer, så siffran går att spåra internt. */
  offert: string;
  /** Vad jobbet omfattade, en mening. */
  omfattning: string;
}

export const REFERENSPROJEKT: Referensprojekt[] = [
  {
    slug: "takomlaggning-norrtalje",
    plats: "Norrtälje",
    kvm: 130,
    material: "Betongpannor, Monier Elegant",
    ar: 2026,
    prisEfterRot: 192438,
    rotProcent: 30,
    offert: "D4526",
    omfattning:
      "Komplett omläggning: rivning, ny underlagspapp, läkt förberedd för solpaneler, plåtdetaljer och taksäkerhet.",
  },
  {
    slug: "takomlaggning-flen",
    plats: "Flen",
    kvm: 160,
    material: "Betongpannor, Monier Aerlox",
    ar: 2026,
    prisEfterRot: 263655,
    rotProcent: 30,
    offert: "D4440",
    omfattning:
      "Komplett omläggning: rivning, ny råspont, underlagspapp, läkt förberedd för solpaneler, nytt regnvattensystem och taksäkerhet.",
  },
  {
    slug: "aladdinvagen-bromma",
    plats: "Bromma",
    kvm: 150,
    material: "Tvåkupigt lertegel, Monier Vittinge",
    ar: 2026,
    prisEfterRot: 228852,
    rotProcent: 30,
    offert: "D4439",
    omfattning:
      "Nytt lertaksystem med nytt regnvattensystem, taklucka, skorstensbeslag och sex takbryggor.",
  },
  {
    slug: "papptak-fasad-hasselby",
    plats: "Hässelby",
    kvm: 90,
    material: "Svetsad ytpapp, ISOTEKK ISOLA",
    ar: 2025,
    prisEfterRot: 59470,
    rotProcent: 50,
    offert: "D4280",
    omfattning:
      "Takdelen av projektet: ny ytpapp på befintligt underlag, ny krönplåt runt takfoten och byte av insticksbrunn.",
  },
];
