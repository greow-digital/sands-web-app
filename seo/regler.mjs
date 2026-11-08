/*
  Regler för SEO-loopen (se seo/README.md).

  Loopen läser Search Console varje vecka, följer upp tidigare ändringar
  (seo/experiment.json) och letar möjligheter. Förslagen skrivs av Claude
  utifrån möjligheterna och SEO.md, och Erik godkänner innan något ändras.
  Ändringar går via PR och samma kvalitetskontroll som allt annat.
*/

/** Search Console-egenskapen och sajtens adress. */
export const SAJT = "sc-domain:sandsab.se";
export const BAS = "https://www.sandsab.se";

/** Sökningar på varumärket räknas inte som möjligheter. */
export const VARUMARKE = /\bsands\b|sandsab|sands entreprenad/;

/**
 * Sökningar utanför takfokus (andra tjänster på sajten och engelska
 * sökningar) räknas inte heller. Search Console hämtas bara för Sverige.
 */
export const UTANFOR_FOKUS = /totalentreprenad|kök|badrum|altan|snickare|entreprenadtvist|^sand$|roofing|contractor/;

/** Högst så här många förslag per varv, så att varje ändring går att mäta. */
export const MAX_FORSLAG = 3;

/** Trösklar för möjligheter, räknat på 28 dagar. */
export const TROSKEL = {
  minVisningar: 20,
  // Nära toppen: syns, men under plats 3.
  naraFran: 4,
  naraTill: 20,
  // Låg klickfrekvens: hög placering men långt under förväntat.
  lagCtrMaxPosition: 6,
  lagCtrMinVisningar: 40,
  lagCtrAndel: 0.5,
  // Tapp jämfört med föregående 28 dagar.
  tappMinKlickFore: 5,
  tappAndel: 0.4,
  tappPositioner: 3,
};

/** Ungefärlig klickfrekvens per placering, för att hitta låg CTR. */
export const FORVANTAD_CTR = { 1: 0.28, 2: 0.15, 3: 0.1, 4: 0.07, 5: 0.05, 6: 0.04 };

/**
 * Uppföljning: en ändring mäts tidigast efter minDagar, med samma antal
 * dagar före som efter (högst fonsterDagar). De första dagarna efter
 * ändringen räknas inte, Google behöver hinna läsa om sidan.
 */
export const MATNING = { startForskjutning: 3, minDagar: 21, fonsterDagar: 28 };

/**
 * Vilken sida som ska äga vilket ämne. Första träffen gäller, så de
 * snävaste ämnena står först. alternativ är sidor som också får ranka
 * utan att det räknas som fel sida.
 *
 * Sökningar med en ort i området ägs av /omraden/<ort>, utom Stockholm
 * som startsidan äger (beslut 26 okt 2026, PR #39).
 */
export const AMNEN = [
  { amne: "eternit och pris", monster: /eternit.*(pris|kostn|kostar)|(pris|kostn|kostar).*eternit/, sida: "/blogg/byta-eternittak-kostnad" },
  { amne: "rot", monster: /\brot\b|rotavdrag/, sida: "/blogg/rot-avdrag-takbyte" },
  { amne: "pris", monster: /pris|kostn|kostar|kvm|kvadratmeter|per m2/, sida: "/priser", alternativ: ["/blogg/vad-kostar-takbyte"] },
  { amne: "bästa takläggare", monster: /bästa.*takl[äa]ggare|takl[äa]ggare.*bästa/, sida: "/basta-taklaggare-stockholm", alternativ: ["/"] },
  { amne: "eternit", monster: /eternit|asbest/, sida: "/tjanster/eternittak", alternativ: ["/blogg/eternittak-asbest", "/blogg/byta-eternittak-kostnad"] },
  { amne: "besiktning", monster: /besikt|takkontroll|inspekt/, sida: "/tjanster/takbesiktning" },
  { amne: "läckage", monster: /läck/, sida: "/blogg/taket-lacker" },
  { amne: "taksäkerhet", monster: /snörasskydd|snöras|taksäkerhet|takstege|taksteg|takbrygga/, sida: "/tjanster/taksakerhet", alternativ: ["/blogg/snorasskydd-krav-ansvar"] },
  { amne: "hängrännor", monster: /hängrän|stuprör|takrän|regnrän/, sida: "/tjanster/hangrannorstupror" },
  { amne: "kupor och takfönster", monster: /kupa|kupor|takfönster/, sida: "/tjanster/takfonsterkupor" },
  { amne: "underlag", monster: /underlagspapp|ströläkt|bärläkt|läkt/, sida: "/blogg/under-takpannorna-underlagspapp-strolakt" },
  { amne: "betong eller tegel", monster: /betong.*tegel|tegel.*betong/, sida: "/blogg/betongpannor-eller-tegelpannor" },
  { amne: "när byta tak", monster: /när.*byta|hur länge|livslängd/, sida: "/blogg/nar-byta-tak" },
  { amne: "garanti", monster: /garanti|monier/, sida: "/blogg/monier-garanti" },
  { amne: "certifiering", monster: /certifier|auktoriser/, sida: "/blogg/certifierad-taklaggare" },
  { amne: "plåttak", monster: /plåt/, sida: "/tjanster/plattak" },
  { amne: "papptak", monster: /papp/, sida: "/tjanster/papptak" },
  { amne: "shingel", monster: /shingel/, sida: "/tjanster/shingeltak" },
  { amne: "tegeltak", monster: /tegel/, sida: "/tjanster/tegeltak" },
  { amne: "betongtak", monster: /betong/, sida: "/tjanster/betongtak" },
  { amne: "takbyte", monster: /byt(a|e)|takbyte|lägga om|omläggning|nytt tak|lägga.*tak|renover/, sida: "/tjanster/taklaggning", alternativ: ["/"] },
  { amne: "takläggare", monster: /takl[äa]gg|takfirm|takföretag|tak ?företag|takentreprenad/, sida: "/", alternativ: ["/tjanster/taklaggning"] },
];

/** Orter med egen områdessida. Stockholm ägs av startsidan. */
export const ORTER = [
  "taby", "nacka", "jarfalla", "huddinge", "sollentuna", "danderyd", "bromma", "hasselby",
  "vallingby", "spanga", "enskede", "tyreso", "norrtalje", "sodertalje", "lidingo", "solna",
  "sundbyberg", "ekero", "haninge", "botkyrka", "nynashamn", "vallentuna", "vaxholm", "varmdo",
  "osteraker", "upplands-vasby", "upplands-bro", "sigtuna", "salem", "nykvarn",
];
