export type Ort = {
  slug: string;
  name: string;
  region: string;
  beskrivning: string;
  stadsdelar?: string;
  grannar: { slug: string; name: string }[];
  /**
   * Tier A: unik brödtext som ersätter mallens generiska stycke. Sätts bara
   * för de orter som har verklig sökvolym, annars faller sidan tillbaka på
   * mallen.
   */
  unikText?: string;
  /**
   * Per stadsdel: eget stycke. GSC visar att svansen finns på stadsdelsnivå
   * ("takfirma tumba" 59 visn., "takarbeten djursholm" 62), men volymen
   * ligger på kommunnivå. Därför fångas stadsdelarna som innehåll här i
   * stället för som egna URL:er, som bara skulle späda ut kommunsignalen.
   */
  stadsdelsTexter?: { namn: string; text: string }[];
};

export const omraden: Ort[] = [
  {
    slug: "stockholm",
    name: "Stockholm",
    region: "Stockholm stad",
    beskrivning:
      "Sands Entreprenad utför takbyten och takomläggningar i Stockholms stad och alla stadsdelar. Vi har lång erfarenhet av takläggning i innerstaden och ytterstadens villaområden, från Bromma i väster till Skarpnäck i öster.",
    stadsdelar:
      "Bromma, Hässelby, Vällingby, Spånga, Enskede, Farsta, Älvsjö, Hägersten, Skarpnäck, Kungsholmen, Södermalm",
    grannar: [
      { slug: "solna", name: "Solna" },
      { slug: "sundbyberg", name: "Sundbyberg" },
      { slug: "nacka", name: "Nacka" },
      { slug: "huddinge", name: "Huddinge" },
    ],
  },
  {
    slug: "taby",
    name: "Täby",
    region: "Norrort",
    beskrivning:
      "Täby är en av de mest välmående kommunerna i Stockholms län med många välskötta villor och radhus. Vi utför takbyten och takomläggningar i Täby, Arninge, Näsbypark och övriga delar av kommunen.",
    stadsdelar: "Täby centrum, Arninge, Näsbypark, Viggbyholm, Gribbylund",
    unikText:
      "Täby är en av länets största villakommuner, och taken här speglar det: mycket sadeltak med betong- eller tegelpannor, och en hel del fastigheter där taket är original sedan huset byggdes.\n\nDe flesta som hör av sig från Täby undrar samma sak, om de behöver byta tak eller om det räcker att lägga om det. Skillnaden i pris är stor, ungefär 25 till 35 procent, så det är värt att få det bedömt innan du begär offerter. Vi går upp på taket, inventerar pannorna och lämnar fast pris efter kostnadsfri takkontroll.",
    stadsdelsTexter: [
      { namn: "Täby centrum", text: "Tät blandning av villor, radhus och flerbostadshus. Vi arbetar med både enskilda villaägare och samfälligheter, och anpassar etableringen efter hur trångt det är kring huset." },
      { namn: "Arninge", text: "Nyare bebyggelse i den östra delen av kommunen. Här handlar uppdragen oftare om plåttak och punktinsatser än om kompletta byten." },
      { namn: "Näsbypark", text: "Villaområde med äldre och ofta större fastigheter. Valmade tak med många genomföringar tar längre tid och kräver mer plåtarbete, vilket vi räknar in i det fasta priset." },
      { namn: "Viggbyholm", text: "Villor nära vattnet, där vind och slagregn sliter hårdare på vindskivor och plåtdetaljer. Vi rekommenderar takkontroll oftare i vindutsatta lägen." },
    ],
    grannar: [
      { slug: "danderyd", name: "Danderyd" },
      { slug: "vallentuna", name: "Vallentuna" },
      { slug: "osteraker", name: "Österåker" },
      { slug: "vaxholm", name: "Vaxholm" },
    ],
  },
  {
    slug: "nacka",
    name: "Nacka",
    region: "Söderort",
    beskrivning:
      "Nacka är en attraktiv kommun öster om Stockholm med ett stort antal villor och radhus längs vattnet. Vi utför takomläggningar i Nacka, Saltsjöbaden, Boo och Älta.",
    stadsdelar: "Nacka strand, Boo, Saltsjöbaden, Älta, Orminge",
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "varmdo", name: "Värmdö" },
      { slug: "tyreso", name: "Tyresö" },
    ],
  },
  {
    slug: "jarfalla",
    name: "Järfälla",
    region: "Västerort",
    beskrivning:
      "Järfälla är en av Stockholms mest befolkade kranskommuner med många villaområden i Jakobsberg, Kallhäll och Barkarby. Vi är verksamma i Järfälla och utför alla typer av takomläggningar.",
    stadsdelar: "Jakobsberg, Kallhäll, Barkarby, Viksjö, Stäket",
    unikText:
      "Kommunen har ett stort villabestånd som till stor del byggdes under 1960- och 1970-talen. Många av de taken har antingen bytts en gång, eller står nu inför sitt första byte.\n\nÄr taket original är underlagspappen med all sannolikhet förbrukad, oavsett hur pannorna ser ut. Då hjälper det inte att byta enstaka pannor. Vi går upp på taket, bedömer underlaget och lämnar fast pris efter kostnadsfri takkontroll.",
    stadsdelsTexter: [
      { namn: "Jakobsberg", text: "Kommunens största tätort med blandad bebyggelse. Vi arbetar både med enskilda villor och med samfälligheter som byter tak på flera hus i samma vända." },
      { namn: "Kallhäll", text: "Villaområden nära Mälaren. Vindutsatta lägen sliter på vindskivor och plåtdetaljer, som ofta behöver bytas i samband med takbytet." },
      { namn: "Barkarby", text: "Område under snabb utveckling med både äldre villor och ny bebyggelse. Uppdragen spänner från komplett takbyte till taksäkerhet och regnvattensystem." },
      { namn: "Viksjö", text: "Stort villaområde med gott om sadeltak från samma byggperiod. Här är omläggning av tak ofta ett alternativ när pannorna fortfarande är frostbeständiga." },
    ],
    grannar: [
      { slug: "solna", name: "Solna" },
      { slug: "sundbyberg", name: "Sundbyberg" },
      { slug: "upplands-bro", name: "Upplands-Bro" },
      { slug: "ekero", name: "Ekerö" },
    ],
  },
  {
    slug: "huddinge",
    name: "Huddinge",
    region: "Söderort",
    beskrivning:
      "Huddinge är en stor kommun söder om Stockholm med många välskötta villaområden. Vi utför takbyten i Huddinge, Flemingsberg, Trångsund och Segeltorp.",
    stadsdelar: "Flemingsberg, Trångsund, Segeltorp, Kungens kurva, Stuvsta",
    unikText:
      "Huddinge är en av länets största kommuner till ytan, och villabeståndet varierar kraftigt mellan de olika delarna. Det påverkar både vilka taktyper vi möter och vad ett takbyte landar på.\n\nDet vanligaste jobbet här är att byta tak på villor där beläggningen är original. Är pannorna hela går det ofta att lägga om tak i stället, vilket sänker kostnaden märkbart. Vi bedömer det på plats vid en kostnadsfri takkontroll.",
    stadsdelsTexter: [
      { namn: "Stuvsta", text: "Etablerat villaområde med gott om sadeltak. Betongpannor dominerar, och underlagspappen är oftast det som avgör om taket behöver bytas." },
      { namn: "Segeltorp", text: "Villor och radhus nära gränsen mot Stockholm. Här gör vi både kompletta takbyten och riktade insatser på hängrännor och plåtdetaljer." },
      { namn: "Trångsund", text: "Blandat bestånd av villor och radhus. I radhuslängor lönar det sig att samordna flera fastigheter, eftersom ställningen då kan delas." },
      { namn: "Flemingsberg", text: "Område med mycket flerbostadsbebyggelse. Vi arbetar här främst med föreningar och större fastighetsägare, där papp- och plåttak dominerar." },
    ],
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "botkyrka", name: "Botkyrka" },
      { slug: "tyreso", name: "Tyresö" },
      { slug: "salem", name: "Salem" },
    ],
  },
  {
    slug: "sollentuna",
    name: "Sollentuna",
    region: "Norrort",
    beskrivning:
      "Sollentuna är en välmående nordlig förort med ett stort utbud av villor och radhus. Vi utför takomläggningar i hela Sollentuna, inklusive Häggvik, Tureberg och Edsberg.",
    stadsdelar: "Häggvik, Tureberg, Edsberg, Rotebro, Helenelund",
    unikText:
      "Sollentuna har ett stort bestånd av villor och radhus som byggdes under efterkrigstiden, och det märks i vad vi blir kallade till. Många tak har passerat den ålder där underlagspappen är förbrukad, även när pannorna fortfarande ser hela ut från marken.\n\nDet avgör vilket jobb som är rätt. Är pannorna frostbeständiga och hela räcker det ofta att lägga om tak, alltså byta papp och läkt men återanvända beläggningen. Är de vittrade är det bättre att byta tak helt och lägga nytt tak direkt. Vilket som gäller för ditt hus avgörs på plats, inte på telefon.",
    stadsdelsTexter: [
      { namn: "Häggvik", text: "Villa- och radhusområden nära E4:an. Betongpannor dominerar, och vi byter oftast hängrännor och stuprör i samma vända eftersom regnvattensystemet brukar vara lika gammalt som taket." },
      { namn: "Tureberg", text: "Kommunens centrala delar med blandad bebyggelse. Här är omläggning av tak ofta det naturliga valet, eftersom beläggningen håller medan undertaket är slut." },
      { namn: "Edsberg", text: "Villaområden med gott om sadeltak. Vi lägger både tegel och betong, och tar hand om plåtdetaljer kring skorsten och genomföringar i samma projekt." },
      { namn: "Rotebro", text: "Blandat bestånd av villor och radhus. I radhuslängor behöver flera fastighetsägare samordna sig, och vi tar gärna fram underlag inför ett gemensamt beslut." },
    ],
    grannar: [
      { slug: "danderyd", name: "Danderyd" },
      { slug: "upplands-vasby", name: "Upplands Väsby" },
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "stockholm", name: "Stockholm" },
    ],
  },
  {
    slug: "danderyd",
    name: "Danderyd",
    region: "Norrort",
    beskrivning:
      "Danderyd är en exklusiv villakommun norr om Stockholm känd för sina välskötta fastigheter. Vi har lång erfarenhet av takomläggningar i Danderyd, Djursholm och Enebyberg.",
    stadsdelar: "Djursholm, Enebyberg, Stocksund, Danderyds kyrkby",
    unikText:
      "Danderyd har ett äldre och ofta påkostat villabestånd, med större fastigheter och mer komplicerade takkonstruktioner än genomsnittet i länet. Valmade tak, takkupor och många genomföringar är vanligt.\n\nDet påverkar både tidsåtgång och pris. Ett tak med många detaljer kräver mer plåtarbete och noggrannare anslutningar, vilket vi räknar in i det fasta priset i stället för att lägga på som tillägg i efterhand.",
    stadsdelsTexter: [
      { namn: "Djursholm", text: "Det område vi oftast blir kallade till i kommunen. Större villor med komplexa tak, ofta i tegel eller plåt, där plåtdetaljer kring skorsten och kupor kräver särskild omsorg." },
      { namn: "Stocksund", text: "Äldre villabebyggelse nära vattnet. Vindutsatta lägen sliter på vindskivor och nockdetaljer, som ofta byts i samband med takbytet." },
      { namn: "Enebyberg", text: "Villaområde med gott om sadeltak. Här är omläggning av tak ofta ett alternativ när pannorna fortfarande är hela." },
      { namn: "Danderyds kyrkby", text: "Blandad villabebyggelse där vi utför både kompletta takbyten och riktade insatser på hängrännor och plåt." },
    ],
    grannar: [
      { slug: "taby", name: "Täby" },
      { slug: "sollentuna", name: "Sollentuna" },
      { slug: "stockholm", name: "Stockholm" },
      { slug: "lidingo", name: "Lidingö" },
    ],
  },
  {
    slug: "bromma",
    name: "Bromma",
    region: "Stockholm stad",
    beskrivning:
      "Bromma är en stadsdel i västra Stockholm med ett varierat villabestånd. Vi utför takbyten och takomläggningar i hela Bromma, från Abrahamsberg och Nockeby till Bromma kyrka och Ulvsunda.",
    stadsdelar: "Abrahamsberg, Blackeberg, Bromma kyrka, Ulvsunda, Nockeby",
    unikText:
      "Bromma har ett av Stockholms största sammanhängande villabestånd, med hus från flera olika epoker. Det innebär att vi möter allt från gamla lertegeltak till nyare plåtkonstruktioner inom samma stadsdel.\n\nÄr huset från mellankrigstiden eller efterkrigstiden är taket sannolikt omlagt minst en gång, och frågan är då hur gammalt det nuvarande underlaget är. Underlagspappen håller normalt 30 till 40 år, alltså kortare än pannorna ovanpå.",
    stadsdelsTexter: [
      { namn: "Abrahamsberg", text: "Villabebyggelse med gott om sadeltak. Betongpannor och tegel dominerar, och underlagspappen avgör oftast om taket behöver bytas." },
      { namn: "Blackeberg", text: "Blandad bebyggelse med både villor och flerbostadshus. Vi arbetar med enskilda ägare såväl som med föreningar." },
      { namn: "Nockeby", text: "Villaområde nära vattnet med större fastigheter. Komplexa tak med kupor och genomföringar kräver mer plåtarbete." },
      { namn: "Ulvsunda", text: "Blandning av bostäder och verksamhetslokaler. Här förekommer både pannbeläggning och flacka tak med tätskikt." },
    ],
    grannar: [
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "solna", name: "Solna" },
      { slug: "ekero", name: "Ekerö" },
      { slug: "vallingby", name: "Vällingby" },
      { slug: "hasselby", name: "Hässelby" },
    ],
  },
  {
    slug: "hasselby",
    name: "Hässelby",
    region: "Stockholm stad",
    beskrivning:
      "Hässelby är en stadsdel i nordvästra Stockholm med ett stort villabestånd från 1950–1970-talet och senare radhusområden. Vi utför takomläggningar i Hässelby villastad, Hässelby gård och Hässelby strand.",
    stadsdelar: "Hässelby villastad, Hässelby gård, Hässelby strand, Smedshagen",
    grannar: [
      { slug: "vallingby", name: "Vällingby" },
      { slug: "spanga", name: "Spånga" },
      { slug: "bromma", name: "Bromma" },
      { slug: "jarfalla", name: "Järfälla" },
    ],
  },
  {
    slug: "vallingby",
    name: "Vällingby",
    region: "Stockholm stad",
    beskrivning:
      "Vällingby är en stadsdel i västra Stockholm, känd som 50-talets modellförort med både flerbostadshus och villor. Vi byter och lägger om tak på radhus och villor i Vällingby, Råcksta och Beckomberga.",
    stadsdelar: "Vällingby centrum, Råcksta, Beckomberga, Vinsta",
    grannar: [
      { slug: "hasselby", name: "Hässelby" },
      { slug: "spanga", name: "Spånga" },
      { slug: "bromma", name: "Bromma" },
    ],
  },
  {
    slug: "spanga",
    name: "Spånga",
    region: "Stockholm stad",
    beskrivning:
      "Spånga är en stadsdel i nordvästra Stockholm med en blandning av äldre villor i Sundby och Solhem och senare radhusområden. Vi utför takomläggningar i Spånga centrum, Sundby, Solhem och Bromsten.",
    stadsdelar: "Spånga centrum, Sundby, Solhem, Bromsten, Flysta",
    grannar: [
      { slug: "hasselby", name: "Hässelby" },
      { slug: "vallingby", name: "Vällingby" },
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "sundbyberg", name: "Sundbyberg" },
    ],
  },
  {
    slug: "enskede",
    name: "Enskede",
    region: "Stockholm stad",
    beskrivning:
      "Enskede är en stadsdel i södra Stockholm känd för trädgårdsstaden med små 20- och 30-talsvillor. Vi har lång erfarenhet av takomläggningar på de karaktäristiska tegelhusen i Enskededalen, Gamla Enskede och Stureby.",
    stadsdelar: "Gamla Enskede, Enskededalen, Stureby, Enskede gård",
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "huddinge", name: "Huddinge" },
    ],
  },
  {
    slug: "tyreso",
    name: "Tyresö",
    region: "Söderort",
    beskrivning:
      "Tyresö är en av Stockholmsregionens mest expansiva kommuner med ett stort villabestånd. Vi utför takomläggningar i hela Tyresö, från Tyresö centrum till Brevik och Trollbäcken.",
    stadsdelar: "Tyresö centrum, Trollbäcken, Brevik, Lindalen",
    unikText:
      "Tyresö har ett stort villabestånd som till stor del växte fram under 1960- och 1970-talen, plus en kustremsa där väder och vind sliter hårdare på taken. Det gör att vi möter två ganska olika typer av uppdrag i kommunen.\n\nInne i de äldre villaområdena handlar det oftast om att byta tak där beläggningen är original. Närmare vattnet är det i stället plåtdetaljer, vindskivor och infästningar som ger sig först. Vilket som gäller hos dig avgörs vid en kostnadsfri takkontroll.",
    stadsdelsTexter: [
      { namn: "Tyresö centrum", text: "Blandad bebyggelse med både villor och flerbostadshus. Vi arbetar med enskilda villaägare såväl som med föreningar, och anpassar ställningen efter hur åtkomligt taket är." },
      { namn: "Trollbäcken", text: "Stort villaområde med gott om sadeltak. Betongpannor dominerar, och det är oftast underlagspappen som avgör om taket behöver bytas eller bara läggas om." },
      { namn: "Brevik", text: "Kustnära bebyggelse med både permanentboende och fritidshus. Vindutsatta lägen sliter på vindskivor och nockdetaljer, som ofta behöver bytas i samma vända." },
      { namn: "Lindalen", text: "Villor och radhus där vi gör allt från kompletta takbyten till riktade insatser på hängrännor och stuprör." },
    ],
    grannar: [
      { slug: "nacka", name: "Nacka" },
      { slug: "huddinge", name: "Huddinge" },
      { slug: "haninge", name: "Haninge" },
    ],
  },
  {
    slug: "norrtalje",
    name: "Norrtälje",
    region: "Övriga",
    beskrivning:
      "Norrtälje är en kuststad i norra Stockholms skärgård med ett stort antal sommarhus och permanentvillor. Vi utför takbyten och takomläggningar i Norrtälje och omkringliggande öar.",
    stadsdelar: "Norrtälje centrum, Älmsta, Rimbo, Hallstavik",
    grannar: [
      { slug: "osteraker", name: "Österåker" },
      { slug: "vallentuna", name: "Vallentuna" },
      { slug: "sigtuna", name: "Sigtuna" },
    ],
  },
  {
    slug: "sodertalje",
    name: "Södertälje",
    region: "Övriga",
    beskrivning:
      "Södertälje är en industristad söder om Stockholm med ett varierat villabestånd. Vi utför takomläggningar i Södertälje och omkringliggande kommundelar som Järna och Hölö.",
    stadsdelar: "Södertälje centrum, Järna, Hölö, Mölnbo",
    unikText:
      "Södertälje har ett brett villabestånd, från stadens centrala delar ut till landsbygden i söder. Det gör att uppdragen skiljer sig mer åt här än i de flesta andra kommuner vi arbetar i.\n\nGemensamt är att vi alltid börjar med en kostnadsfri takkontroll. Först då går det att säga om taket behöver bytas helt, eller om det räcker med en omläggning av tak där befintliga pannor läggs tillbaka på nytt underlag.",
    stadsdelsTexter: [
      { namn: "Södertälje centrum", text: "Blandad bebyggelse med både villor och mindre flerbostadshus. Papptak och plåttak är vanliga på de flackare taken närmast centrum." },
      { namn: "Järna", text: "Villor och gårdar utanför staden. Här möter vi ofta äldre tak där råsponten behöver kontrolleras noga innan nytt tak läggs." },
      { namn: "Hölö", text: "Landsbygd med villor och fritidshus. Längre transporter påverkar etableringen, vilket vi räknar in i offerten från början i stället för som tillägg." },
      { namn: "Mölnbo", text: "Mindre ort med äldre bebyggelse. Eternittak förekommer fortfarande, och de kräver certifierad sanering innan nytt tak kan läggas." },
    ],
    grannar: [
      { slug: "botkyrka", name: "Botkyrka" },
      { slug: "salem", name: "Salem" },
      { slug: "nykvarn", name: "Nykvarn" },
      { slug: "huddinge", name: "Huddinge" },
    ],
  },
  {
    slug: "lidingo",
    name: "Lidingö",
    region: "Norrort",
    beskrivning:
      "Lidingö är en ö öster om Stockholm med ett exklusivt villabestånd och många äldre fastigheter. Vi har erfarenhet av takomläggningar på Lidingö, inklusive äldre tegelhus och 1930-talsvillor.",
    stadsdelar: "Lidingö centrum, Larsberg, Torsvik, Högsätra",
    unikText:
      "Lidingö har ett äldre och ofta påkostat villabestånd, och många tak här är lagda i material som kräver mer hantverk än standardpannor. Vi möter allt från klassiskt lertegel till bandtäckt plåt och koppar.\n\nÖläget spelar också roll. Salthaltig luft och vind sliter snabbare på plåtdetaljer, infästningar och hängrännor än inne i staden. Det påverkar både materialval och hur ofta taket bör kontrolleras.",
    stadsdelsTexter: [
      { namn: "Lidingö centrum", text: "Blandad bebyggelse med både villor och flerbostadshus. Vi anpassar ställning och etablering efter hur åtkomligt taket är." },
      { namn: "Larsberg", text: "Område med större fastigheter. Här arbetar vi ofta med bostadsrättsföreningar, där beslutsprocessen kräver ett tydligt underlag och fast pris." },
      { namn: "Torsvik", text: "Villaområde nära bron mot fastlandet. Vindutsatta lägen gör att vindskivor och nockdetaljer slits fortare än normalt." },
      { namn: "Högsätra", text: "Villor och radhus där både tegel och plåt förekommer. Vi går igenom vilket material som passar konstruktionen innan vi lämnar pris." },
    ],
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "danderyd", name: "Danderyd" },
      { slug: "nacka", name: "Nacka" },
      { slug: "vaxholm", name: "Vaxholm" },
    ],
  },
  {
    slug: "solna",
    name: "Solna",
    region: "Västerort",
    beskrivning:
      "Solna är en tätbebyggd stad norr om Stockholm med ett blandat bostadsbestånd. Vi utför takbyten i Solna, Hagalund, Råsunda och Ulriksdal.",
    stadsdelar: "Hagalund, Råsunda, Ulriksdal, Huvudsta, Frösunda",
    unikText:
      "Solna är tätt bebyggt, och vår vardag här ser annorlunda ut än i villakommunerna runt omkring. En stor del av uppdragen gäller flerbostadshus, bostadsrättsföreningar och fastighetsägare snarare än enskilda villaägare.\n\nDet betyder mer papptak, bandtäckt plåt och plåtdetaljer, och färre pannbyten. Vi lämnar fast pris efter kostnadsfri takkontroll även på större objekt, och tar fram underlag som fungerar för ett föreningsbeslut.",
    stadsdelsTexter: [
      { namn: "Råsunda", text: "Blandad bebyggelse med både äldre villor och flerbostadshus. Här förekommer allt från tegeltak till bandtäckt plåt." },
      { namn: "Huvudsta", text: "Övervägande flerbostadshus. Uppdragen gäller oftast tätskikt, plåtarbeten och taksäkerhet snarare än pannbyten." },
      { namn: "Ulriksdal", text: "Blandning av äldre bebyggelse och nyare kvarter. Vi anpassar etablering och ställning efter hur trångt det är kring fastigheten." },
      { namn: "Hagalund", text: "Tät bebyggelse där arbete på tak kräver noggrann planering av ställning och avspärrning." },
    ],
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "sundbyberg", name: "Sundbyberg" },
      { slug: "sollentuna", name: "Sollentuna" },
      { slug: "bromma", name: "Bromma" },
    ],
  },
  {
    slug: "sundbyberg",
    name: "Sundbyberg",
    region: "Västerort",
    beskrivning:
      "Sundbyberg är en tät och expansiv stad väster om Stockholm. Vi utför takomläggningar i Sundbyberg, Hallonbergen, Rissne och Lilla Alby.",
    stadsdelar: "Sundbyberg centrum, Hallonbergen, Rissne, Lilla Alby, Ör",
    unikText:
      "Sundbyberg är Sveriges till ytan minsta kommun och samtidigt en av de tätast bebyggda. Det präglar uppdragen: här arbetar vi mer med föreningar och fastighetsägare än med enskilda villaägare.\n\nPapptak och bandtäckt plåt dominerar, och de flesta jobb handlar om tätskikt, plåtdetaljer och taksäkerhet. Vi lämnar fast pris efter kostnadsfri takkontroll och tar fram ett underlag som håller för ett styrelsebeslut.",
    stadsdelsTexter: [
      { namn: "Sundbyberg centrum", text: "Tät kvartersbebyggelse där ställning och avspärrning kräver planering. Vi samordnar med fastighetsägaren innan arbetet startar." },
      { namn: "Lilla Alby", text: "Blandad bebyggelse med både äldre hus och nyare kvarter. Papptak och plåt är vanligast." },
      { namn: "Rissne", text: "Övervägande flerbostadshus. Uppdragen gäller oftast omläggning av tätskikt och uppdatering av taksäkerheten till gällande krav." },
      { namn: "Hallonbergen", text: "Bebyggelse från miljonprogramsåren där taken nu når den ålder då tätskiktet behöver bytas." },
    ],
    grannar: [
      { slug: "stockholm", name: "Stockholm" },
      { slug: "solna", name: "Solna" },
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "bromma", name: "Bromma" },
    ],
  },
  {
    slug: "ekero",
    name: "Ekerö",
    region: "Västerort",
    beskrivning:
      "Ekerö är en ö-kommun väster om Stockholm med ett unikt beläget villabestånd längs Mälaren. Vi utför takomläggningar i Ekerö, Färingsö och Munsö.",
    stadsdelar: "Ekerö centrum, Färingsö, Munsö, Stenhamra",
    grannar: [
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "stockholm", name: "Stockholm" },
      { slug: "upplands-bro", name: "Upplands-Bro" },
      { slug: "bromma", name: "Bromma" },
    ],
  },
  {
    slug: "haninge",
    name: "Haninge",
    region: "Söderort",
    beskrivning:
      "Haninge är en skärgårdskommun söder om Stockholm med ett stort antal villor och fritidshus. Vi utför takbyten i Haninge, Handen, Jordbro och Brandbergen.",
    stadsdelar: "Handen, Jordbro, Brandbergen, Vendelsö, Västerhaninge",
    unikText:
      "Haninge är en av länets största kommuner till ytan, och bebyggelsen spänner från tät förort i norr till landsbygd och kust i söder. Det påverkar både vilka taktyper vi möter och hur etableringen ser ut.\n\nDet vanligaste uppdraget är att byta tak på villor från kommunens stora utbyggnadsperiod. Är pannorna hela går det ofta att lägga om tak i stället, vilket sänker kostnaden märkbart eftersom ny beläggning inte behöver köpas in.",
    stadsdelsTexter: [
      { namn: "Handen", text: "Kommunens centrala del med blandad bebyggelse. Här arbetar vi både med villaägare och med föreningar, där papp- och plåttak är vanliga." },
      { namn: "Vendelsö", text: "Villaområde med gott om sadeltak. Betongpannor dominerar, och regnvattensystemet brukar vara lika gammalt som taket och byts därför samtidigt." },
      { namn: "Västerhaninge", text: "Villor och gårdar söderut. Här möter vi äldre tak där råsponten behöver kontrolleras noga innan nytt tak läggs." },
      { namn: "Brandbergen", text: "Bebyggelse med både radhus och flerbostadshus. I radhuslängor lönar det sig att samordna flera fastigheter, eftersom ställningen då kan delas." },
    ],
    grannar: [
      { slug: "tyreso", name: "Tyresö" },
      { slug: "nynashamn", name: "Nynäshamn" },
      { slug: "huddinge", name: "Huddinge" },
    ],
  },
  {
    slug: "botkyrka",
    name: "Botkyrka",
    region: "Söderort",
    beskrivning:
      "Botkyrka är en stor söderförort med ett varierande villabestånd. Vi utför takomläggningar i Botkyrka, Tumba, Norsborg och Tullinge.",
    stadsdelar: "Tumba, Norsborg, Tullinge, Fittja, Alby",
    unikText:
      "Botkyrka har ett brett bestånd, från villaområden i Tumba och Tullinge till tätare bebyggelse i norra kommundelen. Tyngdpunkten i våra uppdrag ligger tydligt på villasidan.\n\nMånga av villorna byggdes under samma period, vilket betyder att taken når slutet av sin livslängd ungefär samtidigt. Är taket original är underlagspappen med all sannolikhet förbrukad även om pannorna ser hela ut, och då räcker det inte att byta enstaka pannor.",
    stadsdelsTexter: [
      { namn: "Tumba", text: "Kommunens största villaområde och den del vi oftast blir kallade till. Betongpannor dominerar, och vi gör både kompletta takbyten och omläggningar där befintliga pannor återanvänds." },
      { namn: "Tullinge", text: "Villaområde med gott om sadeltak. Här är det ofta underlagspappen som avgör, medan pannorna fortfarande är frostbeständiga." },
      { namn: "Norsborg", text: "Blandad bebyggelse där vi arbetar med både villaägare och föreningar. Papp- och plåttak är vanliga på de flackare taken." },
      { namn: "Alby", text: "Tätare bebyggelse med mycket flerbostadshus. Uppdragen här handlar oftare om tätskikt, plåtdetaljer och taksäkerhet än om pannbyten." },
    ],
    grannar: [
      { slug: "huddinge", name: "Huddinge" },
      { slug: "sodertalje", name: "Södertälje" },
      { slug: "salem", name: "Salem" },
    ],
  },
  {
    slug: "nynashamn",
    name: "Nynäshamn",
    region: "Söderort",
    beskrivning:
      "Nynäshamn är en kustkommun söder om Stockholm med ett stort antal sommarhus och permanentvillor. Vi utför takbyten i Nynäshamn, Ösmo och Sorunda.",
    stadsdelar: "Nynäshamn centrum, Ösmo, Sorunda, Stora Vika",
    unikText:
      "Nynäshamn ligger vid kusten längst söderut i länet, och både klimatet och bebyggelsen skiljer sig från förorterna närmare Stockholm. Här finns gott om fritidshus och äldre villor, och en hel del flacka tak med papp.\n\nSaltluft och vind gör att plåtdetaljer, infästningar och hängrännor slits snabbare än inåt landet. Vi väljer material och detaljer därefter, och rekommenderar tätare takkontroller i de mest utsatta lägena.",
    stadsdelsTexter: [
      { namn: "Nynäshamn centrum", text: "Blandad bebyggelse med både villor och flerbostadshus. Papptak är vanligt på flackare konstruktioner." },
      { namn: "Ösmo", text: "Villaområden och landsbygd innanför kusten. Här gör vi både kompletta takbyten och omläggning av tak." },
      { namn: "Sorunda", text: "Landsbygd med villor och gårdar. Längre transporter räknas in i etableringen från början i stället för som tillägg." },
      { namn: "Stora Vika", text: "Kustnära bebyggelse där vind och slagregn ställer höga krav på vindskivor och plåtdetaljer." },
    ],
    grannar: [
      { slug: "haninge", name: "Haninge" },
      { slug: "botkyrka", name: "Botkyrka" },
    ],
  },
  {
    slug: "vallentuna",
    name: "Vallentuna",
    region: "Norrort",
    beskrivning:
      "Vallentuna är en expansiv nordlig kommun med ett stort antal nybyggda och äldre villor. Vi utför takomläggningar i Vallentuna, Bällsta och Lindholmen.",
    stadsdelar: "Vallentuna centrum, Bällsta, Lindholmen, Ekskogen",
    grannar: [
      { slug: "taby", name: "Täby" },
      { slug: "danderyd", name: "Danderyd" },
      { slug: "osteraker", name: "Österåker" },
      { slug: "norrtalje", name: "Norrtälje" },
    ],
  },
  {
    slug: "vaxholm",
    name: "Vaxholm",
    region: "Norrort",
    beskrivning:
      "Vaxholm är en charmig kuststad i Stockholms norra skärgård med ett karaktäristiskt trähusmiljö. Vi utför takomläggningar i Vaxholm och de viktigaste öarna.",
    stadsdelar: "Vaxholm centrum, Eriksberg, Blynäs",
    unikText:
      "Vaxholm ligger mitt i skärgården, och det syns på taken. Saltluft och vind sliter betydligt snabbare på plåtdetaljer, infästningar och hängrännor än inne i staden, och material som håller bra på fastlandet gör inte alltid det här.\n\nDärför lägger vi extra vikt vid materialval och infästning i vindutsatta lägen, och rekommenderar takkontroll oftare än vart tionde år. Vi arbetar med både permanentbostäder och fritidshus.",
    stadsdelsTexter: [
      { namn: "Vaxholm centrum", text: "Äldre bebyggelse med både trähus och nyare fastigheter. Vi anpassar material och detaljer efter husets karaktär." },
      { namn: "Eriksberg", text: "Villabebyggelse där vi gör både kompletta takbyten och omläggning av tak när pannorna är i gott skick." },
      { namn: "Blynäs", text: "Kustnära läge där vind och slagregn ställer höga krav på vindskivor, nockdetaljer och infästningar." },
    ],
    grannar: [
      { slug: "taby", name: "Täby" },
      { slug: "osteraker", name: "Österåker" },
      { slug: "lidingo", name: "Lidingö" },
    ],
  },
  {
    slug: "varmdo",
    name: "Värmdö",
    region: "Norrort",
    beskrivning:
      "Värmdö är en skärgårdskommun med ett stort antal sommarhus som omvandlas till permanentboenden. Vi utför takomläggningar i Gustavsberg, Ingarö och Djurö.",
    stadsdelar: "Gustavsberg, Ingarö, Djurö, Stavsnäs, Nämdö",
    grannar: [
      { slug: "nacka", name: "Nacka" },
      { slug: "osteraker", name: "Österåker" },
      { slug: "vaxholm", name: "Vaxholm" },
    ],
  },
  {
    slug: "osteraker",
    name: "Österåker",
    region: "Norrort",
    beskrivning:
      "Österåker är en skärgårdskommun norr om Stockholm med ett varierat fastighetsbestånd. Vi utför takbyten i Åkersberga, Österskär och Ljusterö.",
    stadsdelar: "Åkersberga, Österskär, Ljusterö, Svinninge",
    grannar: [
      { slug: "taby", name: "Täby" },
      { slug: "vallentuna", name: "Vallentuna" },
      { slug: "varmdo", name: "Värmdö" },
      { slug: "norrtalje", name: "Norrtälje" },
      { slug: "vaxholm", name: "Vaxholm" },
    ],
  },
  {
    slug: "upplands-vasby",
    name: "Upplands Väsby",
    region: "Norrort",
    beskrivning:
      "Upplands Väsby är en snabbt växande norrort med ett blandat bostadsbestånd. Vi utför takomläggningar i Väsby, Sättra och Bollstanäs.",
    stadsdelar: "Väsby centrum, Sättra, Bollstanäs, Dragonhill",
    unikText:
      "Upplands Väsby växte kraftigt under andra halvan av 1900-talet, och en stor del av villabeståndet har tak som nu nått slutet av sin tekniska livslängd. Det är den vanligaste anledningen till att vi blir kontaktade härifrån.\n\nEtt tak som passerat 30 år bör kontrolleras även om det ser helt ut. Underlagspappen håller normalt 30 till 40 år, alltså kortare än pannorna ovanpå, och när den blir spröd syns det först som fuktfläckar på vinden.",
    stadsdelsTexter: [
      { namn: "Väsby centrum", text: "Blandad bebyggelse kring stationen. Vi arbetar både med enskilda villor och med samfälligheter som byter tak på flera hus samtidigt." },
      { namn: "Sättra", text: "Villaområde där betongpannor är vanligast. Ofta räcker det att lägga om tak, eftersom pannorna håller längre än underlaget." },
      { namn: "Bollstanäs", text: "Villor nära Mälaren. Vindutsatta lägen sliter på vindskivor och plåtdetaljer, som därför bör ses över med jämna mellanrum." },
      { namn: "Dragonhill", text: "Nyare bebyggelse där taken generellt är i bättre skick. Här handlar uppdragen oftare om taksäkerhet och regnvattensystem än om komplett takbyte." },
    ],
    grannar: [
      { slug: "sollentuna", name: "Sollentuna" },
      { slug: "sigtuna", name: "Sigtuna" },
      { slug: "jarfalla", name: "Järfälla" },
    ],
  },
  {
    slug: "upplands-bro",
    name: "Upplands-Bro",
    region: "Norrort",
    beskrivning:
      "Upplands-Bro är en grön kommun väster om Stockholm med ett stort antal villaområden längs Mälaren. Vi utför takomläggningar i Kungsängen, Bro och Tibble.",
    stadsdelar: "Kungsängen, Bro, Tibble, Brunna",
    unikText:
      "Många söker på bara Bro när de letar takläggare här, och vi arbetar i hela kommunen: både Bro och Kungsängen med omnejd. Bebyggelsen är blandad, med villaområden nära Mälaren och tätare bebyggelse kring stationerna.\n\nNärheten till vattnet märks på taken. Vindutsatta lägen sliter snabbare på vindskivor, nockdetaljer och infästningar än längre in i landet, vilket påverkar både materialval och hur ofta taket bör kontrolleras.",
    stadsdelsTexter: [
      { namn: "Bro", text: "Villaområden och tätort där vi gör både kompletta takbyten och omläggning av tak. Papptak förekommer på flackare konstruktioner och garage." },
      { namn: "Kungsängen", text: "Kommunens största tätort med blandad bebyggelse. Vi arbetar med enskilda villor såväl som med samfälligheter som byter tak på flera hus samtidigt." },
      { namn: "Brunna", text: "Nyare bebyggelse där taken generellt är i bättre skick. Uppdragen handlar oftare om taksäkerhet och regnvattensystem än om komplett byte." },
      { namn: "Tibble", text: "Villabebyggelse där betongpannor är vanligast. Är pannorna hela räcker det ofta att byta papp och läkt." },
    ],
    grannar: [
      { slug: "jarfalla", name: "Järfälla" },
      { slug: "upplands-vasby", name: "Upplands Väsby" },
      { slug: "sigtuna", name: "Sigtuna" },
      { slug: "ekero", name: "Ekerö" },
    ],
  },
  {
    slug: "sigtuna",
    name: "Sigtuna",
    region: "Norrort",
    beskrivning:
      "Sigtuna är en historisk stad och en av de äldsta i Sverige. Vi utför takomläggningar i Sigtuna stad, Märsta och Rosersberg.",
    stadsdelar: "Sigtuna stad, Märsta, Rosersberg, Steninge",
    grannar: [
      { slug: "upplands-vasby", name: "Upplands Väsby" },
      { slug: "upplands-bro", name: "Upplands-Bro" },
      { slug: "sollentuna", name: "Sollentuna" },
    ],
  },
  {
    slug: "salem",
    name: "Salem",
    region: "Söderort",
    beskrivning:
      "Salem är en liten villakommun söder om Stockholm med ett karaktäristiskt naturnära boende. Vi utför takomläggningar i Rönninge, Söderby och Salem centrum.",
    stadsdelar: "Rönninge, Söderby, Salem centrum",
    grannar: [
      { slug: "botkyrka", name: "Botkyrka" },
      { slug: "sodertalje", name: "Södertälje" },
      { slug: "huddinge", name: "Huddinge" },
    ],
  },
  {
    slug: "nykvarn",
    name: "Nykvarn",
    region: "Övriga",
    beskrivning:
      "Nykvarn är en liten men växande kommun söder om Södertälje. Vi utför takomläggningar i Nykvarn och omkringliggande byar.",
    stadsdelar: "Nykvarn centrum, Taxinge, Turinge",
    grannar: [
      { slug: "sodertalje", name: "Södertälje" },
      { slug: "salem", name: "Salem" },
    ],
  },
];

export function getOrt(slug: string): Ort | undefined {
  return omraden.find((o) => o.slug === slug);
}
