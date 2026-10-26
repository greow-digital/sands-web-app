/*
  Exempeldata för BACKOFFICE_DEMO=1. Påhittade personer, bara för lokal
  utveckling och flödestester. Ligger i minnet och nollställs vid omstart.
*/
import { loggRad, stockholmTid } from "./lead";

function dagarSedan(n: number, tid = "10:15:00") {
  return stockholmTid(new Date(Date.now() - n * 864e5)).slice(0, 10) + " " + tid;
}

const tomma = {
  Taktyp: "",
  "Yta m²": "",
  Meddelande: "",
  gclid: "",
  Kanal: "",
  Transkript: "",
  Bokad: false,
  "Offert skickad": false,
  "Offet accepterad": false,
  "Offert nekad": false,
  "Projekt avslutat": false,
  "Planerat startdatum": "",
  "Adress (fyll ut)": "",
  Offertvärde: "",
  Anteckning: "",
  Påminnelse: "",
  Logg: "",
  Arkiverad: false,
};

const rader: Record<string, unknown>[] = [
  {
    ...tomma,
    ID: "demo0001",
    Tidpunkt: dagarSedan(0, "08:42:10"),
    Namn: "Testperson Ett",
    Telefon: "0700000001",
    "E-post": "ett@example.se",
    Taktyp: "Betongtak",
    "Yta m²": "140",
    Källa: "/lp/takbyte",
  },
  {
    ...tomma,
    ID: "demo0002",
    Tidpunkt: dagarSedan(3),
    Namn: "Testperson Två",
    Telefon: "700000002",
    "E-post": "tva@example.se",
    Meddelande: "Tegeltak från 70-talet, läcker vid skorstenen.",
    Källa: "/offert",
    Logg: loggRad("Demo", "Ringt, inget svar", new Date(Date.now() - 2 * 864e5)),
  },
  {
    ...tomma,
    ID: "demo0003",
    Tidpunkt: dagarSedan(12),
    Namn: "Testperson Tre",
    Telefon: "0700000003",
    "E-post": "tre@example.se",
    Taktyp: "Plåttak",
    Källa: "/priser",
    Bokad: true,
    "Offert skickad": true,
    Offertvärde: "180 000",
    Logg: [
      loggRad("Demo", "Takkontroll bokad", new Date(Date.now() - 10 * 864e5)),
      loggRad("Demo", "Offert skickad", new Date(Date.now() - 6 * 864e5)),
    ].join("\n"),
  },
  {
    ...tomma,
    ID: "demo0004",
    Tidpunkt: dagarSedan(30),
    Namn: "Testperson Fyra",
    Telefon: "0700000004",
    "E-post": "",
    Källa: "/omraden/bromma",
    Bokad: true,
    "Offert skickad": true,
    "Offet accepterad": true,
    Offertvärde: "210 000",
    "Planerat startdatum": "Början av december",
  },
  {
    ...tomma,
    ID: "demo0005",
    Tidpunkt: dagarSedan(5),
    Namn: "Testperson Fem",
    Telefon: "0700000005",
    "E-post": "fem@example.se",
    Källa: "/tjanster/tegeltak",
    Bokad: true,
    Påminnelse: stockholmTid().slice(0, 10),
    Anteckning: "Vill ha besök efter kl 16.",
  },
];

export function demoLista() {
  return rader.map((r) => ({ ...r }));
}

export function demoUppdatera(id: string, falt: Record<string, unknown>, logg?: string) {
  const rad = rader.find((r) => r.ID === id);
  if (!rad) throw new Error("Hittar inte leaden");
  Object.assign(rad, falt);
  if (logg) rad.Logg = rad.Logg ? `${rad.Logg}\n${logg}` : logg;
  return { ...rad };
}
