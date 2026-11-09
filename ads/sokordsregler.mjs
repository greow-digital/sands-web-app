/*
  Regler för sökordsloopen (se ads/README.md).

  Loopen sorterar förra veckans sökord i kampanjen Takläggning Stockholm
  i fyra högar: redan stoppade, behåll, föreslå negativt och osäkert.
  Inget läggs in i Google Ads utan Eriks godkännande. Varje beslut han
  fattar om ett osäkert sökord skrivs in här, så att loopen frågar mindre
  för varje varv.

  Ordningen är:
    1. Sökordet stoppas redan av befintliga negativa sökord: hoppas över.
    2. Sökordet finns i BESLUT: Eriks beslut gäller.
    3. Sökordet har gett en konvertering: behåll.
    4. Sökordet nämner en ort utanför området: föreslå negativt, även om
       det också säger "takläggare" ("takläggare idre").
    5. Sökordet matchar AVSIKT: behåll.
    6. Sökordet matchar en annan regel i NEGATIVA: föreslå det negativa
       sökordet, men bara om det klarar spärrarna nedan.
    7. Allt annat: osäkert, Erik avgör.

  Spärrar (kontrolleras av skriptet, ett brott flyttar förslaget till
  osäkert och stoppar --test):
    - Ett negativt sökord får aldrig stoppa något i KANDA_BRA.
    - Ett negativt sökord får aldrig stoppa ett sökord som har gett en
      konvertering. "takutsprång" och "inspektera tak" gav varsin lead i
      oktober, fast de ser ut som kunskapssökningar.

  Typ: "FRAS" blockerar alla sökningar som innehåller orden i den
  ordningen. "EXAKT" blockerar bara exakt den sökningen. Ord som också
  förekommer i sökningar efter Sands tjänster (plåttak, papp, hängrännor)
  läggs därför som EXAKT på hela sökordet, inte som FRAS.
*/

/** Kampanjen loopen arbetar i. Brand-gruppen hoppas över. */
export const KAMPANJ = "Takläggning Stockholm";
export const HOPPA_OVER_ANNONSGRUPPER = ["Brand"];

/** Högst så här många nya negativa sökord per varv. */
export const MAX_PER_VARV = 60;

/**
 * Sökningar efter något Sands säljer. Matchar ett sökord något av detta
 * behålls det, oavsett andra regler.
 */
export const AVSIKT = [
  /takläggar/, /takläggning/, /\btak ?l[äa]ggare\b/,
  /takfirm/, /takföretag/, /\btak företag\b/, /takentreprenad/,
  /takbyte/, /\bbyt(a|e)\b/, /\blägga om\b/, /omläggning/, /takomläggning/,
  /\blägga (nytt )?(plåt)?tak\b/, /\bnytt tak\b/,
  /renover/, /reparat/, /\blaga\b/, /läck/,
  /besikt/, /inspekt/, /takkontroll/,
  /taksäkerhet/, /snörasskydd/, /takstege/, /\btaksteg\b/, /takbrygga/,
  /\bplåta in\b/, /\bklä in\b/, /plåtslagare/,
];

/**
 * Sökningar som aldrig får stoppas. Varje föreslaget negativt sökord
 * provas mot dessa innan det föreslås.
 */
export const KANDA_BRA = [
  "takläggare", "takläggare stockholm", "takläggning stockholm", "bästa takläggare stockholm",
  "takfirma stockholm", "takföretag stockholm", "takrenovering stockholm",
  "byta tak", "byta tak stockholm", "takbyte", "takbyte stockholm", "byte av tak",
  "lägga om tak", "lägga nytt tak", "omläggning av tak", "takomläggning stockholm",
  "byta papptak", "byta takpapp", "byta underlagspapp", "byta eternittak", "byta till plåttak",
  "byta tak plåt", "plåttak stockholm", "papptak stockholm", "nytt plåttak",
  "byta hängrännor", "byta hängrännor och stuprör",
  "takbesiktning", "takbesiktning stockholm", "takläckage", "laga tak som läcker",
  "snörasskydd", "montera snörasskydd", "takstege plåttak", "taksäkerhet stockholm",
  "plåta in skorsten", "klä in skorsten i plåt",
  "takutsprång", "inspektera tak", "renovera tak",
  "takläggare norrtälje", "takläggare rimbo", "takläggare väddö", "takläggare hallstavik",
  "takläggare täby", "takläggare lidingö", "takläggare södertälje",
];

/**
 * Regler för negativa sökord. monster matchar sökordet. negativ är det
 * negativa sökord som föreslås; utan negativ föreslås hela sökordet som
 * EXAKT.
 */
export const NEGATIVA = [
  // Produkter och material: ord som inte förekommer i sökningar efter en takläggare.
  ...[
    "pannplåt", "trapetsplåt", "profilplåt", "planjaplåt", "tegelprofil", "trp", "tp 20", "trp20",
    "självbärande", "nockplåt", "nockskydd", "nocktätning", "rännkrok", "rännkrokar", "rörsvep",
    "takduk", "onduline", "carisma", "candor", "zanda", "kami", "bison", "paroc", "katepal",
    "resitrix", "wakaflex", "aerlox", "isola", "bender", "benders", "st eriks", "plegel",
    "am galant", "armat", "sedum", "torvtak", "grästak", "gröntak",
  ].map((ord) => ({ kategori: "produkt", monster: ord, negativ: ord, typ: "FRAS" })),

  // Köpa, sälja eller bygga själv.
  ...[
    "säljes", "begagnade", "begagnad", "build a house", "build your own house", "bygg hus",
    "per m2", "hemsida",
  ].map((ord) => ({ kategori: "själv eller handel", monster: ord, negativ: ord, typ: "FRAS" })),

  // Andra tjänster och förmedlare.
  ...["anticimex", "offerta", "servicefinder", "service finder", "renovation company", "home builder", "isolation company"].map(
    (ord) => ({ kategori: "förmedlare och annat", monster: ord, negativ: ord, typ: "FRAS" })
  ),

  // Andra takfirmor. Namnet som FRAS. Ort plus "tak" ("älvsjö tak",
  // "tumba tak") kan vara både en firma och en sökning efter takläggare
  // på orten, och lämnas till Erik.
  ...[
    "takhero", "skandinaviska tak", "takvisionärerna", "fredins tak", "hagman tak",
    "arkadia tak", "nicatak", "np gruppen", "lundgrens tak", "taktäckarna", "byggimperium",
    "nordiska takmästare", "haninge tak och plåt", "vallentuna tak och fog", "pl tak och montage",
  ].map((namn) => ({ kategori: "konkurrent", monster: namn, negativ: namn, typ: "FRAS" })),

  // Orter utanför området. Norrtälje kommun (Rimbo, Väddö, Hallstavik) ligger inom.
  ...[
    "idre", "rättvik", "skellefteå", "mora", "sälen", "åre", "borlänge", "ludvika", "kiruna",
    "örnsköldsvik", "härnösand", "hudiksvall", "söderhamn", "karlskrona", "kristianstad",
    "halmstad", "borås", "trollhättan", "uddevalla",
  ].map((ort) => ({ kategori: "utanför området", monster: ort, negativ: ort, typ: "FRAS", foreAvsikt: true })),

  // Kunskapssökningar. Hela sökordet som EXAKT, eftersom orden också kan
  // stå i en sökning efter hjälp.
  ...[
    /\beller\b/, /\bvs\b/, /\bvikt\b/, /kondens/, /ser ut som/, /luftspalt/, /ångspärr/,
    /takvinkel/, /behandling av/, /energieffektiv/,
  ].map((re) => ({ kategori: "kunskap", monster: re, typ: "EXAKT" })),

  // Material utan något som tyder på att någon ska anlitas. Hela sökordet
  // som EXAKT, eftersom "byta takpannor" eller "nytt plåttak" är kunder.
  ...[
    /^(svarta |gråa |röda? |lätta |glaserade |enkupiga |platta |bästa )?(takpann(a|or)|betongpann(a|or)|tegelpann(a|or)|betongtakpannor|betongtegel|lertegelpannor)( tegel| betong| tak| grå| svart)?$/,
    /^(tak )?(tegel|betong)(pannor)?( tak)?$/,
    /^(falsad|falsat|dubbelfalsad|bandtäckt|bandat|band|klick|isolerat|galvaniserat|korrugerat|grönt|rött|svart) ?plåt(tak)?( falsat| röd| svart)?$/,
    /^plåttak (röd|svart|aluminium|falsat)$/,
    /^(fibercement|fibercementskivor|fibercementskiva|aluminium|plast|koppar|zink)(tak| tak)?( eternit)?$/,
    /^(kami|klick|klickfals) ?(plåt)?tak$/,
  ].map((re) => ({ kategori: "material utan avsikt", monster: re, typ: "EXAKT" })),
];

/**
 * Eriks beslut om enskilda sökord. Skrivs in efter varje varv.
 * beslut: "behåll" eller "negativ" (med typ och eventuellt negativ).
 */
export const BESLUT = [
  // { sokord: "hängrännor koppar", beslut: "negativ", typ: "EXAKT", datum: "2026-11-xx" },
];
