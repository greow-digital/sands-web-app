// Återanvändbara FAQ-bitar som speglar vad Skatteverket/Boverket/BMI säger.
// Konsekvent språk över alla sidor. Källor citeras separat via
// <SourcesFooter />-komponenten.

export type FaqItem = { q: string; a: string };

export const FAQ_ROT: FaqItem[] = [
  {
    q: "Hur fungerar ROT-avdraget?",
    a: "Du får 30 % av arbetskostnaden i skattereduktion, max 50 000 kr per person och år. Tillsammans med RUT-avdrag är taket 75 000 kr per person och år. Endast arbetskostnaden ger avdrag, inte material eller resekostnader. Vi sköter ansökan direkt mot Skatteverket. Elektronisk betalning krävs.",
  },
  {
    q: "Kan vi som gifta eller sambos dela på ROT-avdraget?",
    a: "Ja. Varje person har sitt eget ROT-utrymme på 50 000 kr per år. Vid två ägare kan ni alltså få sammanlagt 100 000 kr i ROT-avdrag för samma takbyte, förutsatt att båda står som beställare och betalar var sin del.",
  },
  {
    q: "Är det säkert att Sands hanterar ROT-ansökan?",
    a: "Ja. Vi sköter hela ROT-processen mot Skatteverket åt dig. Du betalar bara 70 % av arbetskostnaden direkt på fakturan, vi får återstående 30 % från Skatteverket.",
  },
];

export const FAQ_BYGGLOV: FaqItem[] = [
  {
    q: "Behöver jag bygglov för att byta tak?",
    a: "För en- och tvåfamiljshus krävs inte längre bygglov för takbyte sedan 1 december 2025. Det gäller även om du byter taktyp (t.ex. betong till plåt) eller färg. För flerbostadshus, byggnader vid allmän plats eller kulturhistoriskt skyddade byggnader (K- eller Q-märkning) kan bygglov fortfarande krävas. Vi kontrollerar alltid innan vi börjar.",
  },
  {
    q: "Hur snabbt kan ni starta efter att vi beställt?",
    a: "Eftersom bygglov inte längre krävs för villor är leveranstiden bestämd av materialval och vår beläggning. Typiskt 3-6 veckor från beställning till byggstart.",
  },
];

export const FAQ_MONIER: FaqItem[] = [
  {
    q: "Vad omfattar 30 års Monier-garantin?",
    a: "Som certifierad Monier Takpartner sedan 2016 erbjuder vi Monier Tätt tak-systemgaranti i 30 år, den mest omfattande takgarantin på den svenska marknaden. Garantin täcker både takpannor, systemtillbehör och arbetskostnad för utbyte vid garantifall. För att garantin ska gälla krävs att hela systemet monteras enligt Moniers anvisningar (vilket vi alltid följer). Garantin registreras direkt hos Monier efter slutbesiktning.",
  },
];

export const FAQ_SNORAS: FaqItem[] = [
  {
    q: "Är snörasskydd lagstadgat?",
    a: "Ja. Enligt Boverkets byggregler (BBR) krävs snörasskydd vid byggnaders entréer om fasadhöjden överstiger 8 meter, eller om taklutningen är större än 1:3 (cirka 18°). Snörasskyddet ska utformas enligt standard SS 831335 och tåla områdets snölast. På de flesta villor i Stockholmsregionen är taklutningen tillräcklig för att kravet ska gälla.",
  },
  {
    q: "Vad händer om jag saknar snörasskydd där det krävs?",
    a: "Som fastighetsägare har du ansvar för säkerhet kring fastigheten. Saknas snörasskydd där det krävs enligt BBR kan du bli ersättningsskyldig vid person- eller egendomsskador från takras. Försäkringsbolag kan också neka ersättning.",
  },
];

export const FAQ_MATERIAL: FaqItem[] = [
  {
    q: "Hur länge håller olika takmaterial?",
    a: "Branschstandard: betongpannor 40-60 år, tegelpannor 50-100 år, bandtäckt plåttak 40-70 år, papp/asfalt 20-30 år. Livslängden beror på utförande, takets lutning, klimat och underhåll. Med Moniers system och vår montering håller takpannor genomsnittligt i den övre delen av intervallet.",
  },
];
