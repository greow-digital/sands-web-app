export type Ort = {
  slug: string;
  name: string;
  region: string;
  beskrivning: string;
  stadsdelar?: string;
  grannar: { slug: string; name: string }[];
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
    stadsdelar: "Täby centrum, Arninge, Näsbypark, Viggbyholm, Enebyberg",
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
      "Nacka är en attraktiv kommun öster om Stockholm med ett stort antal villor och radhus längs vattnet. Vi utför takomläggningar i Nacka, Saltsjöbaden, Boo och Gustavsberg.",
    stadsdelar: "Nacka strand, Boo, Saltsjöbaden, Gustavsberg, Orminge",
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
    stadsdelar: "Jakobsberg, Kallhäll, Barkarby, Viksjö, Bällsta",
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
    stadsdelar: "Djursholm, Enebyberg, Stocksund, Traneberg",
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
    stadsdelar:
      "Abrahamsberg, Blackeberg, Bromma kyrka, Ulvsunda, Nockeby, Vällingby, Hässelby",
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
      "Österåker är en skärgårdskommun norr om Stockholm med ett varierat fastighetsbestånd. Vi utför takbyten i Åkersberga, Brottby och Ljusterö.",
    stadsdelar: "Åkersberga, Brottby, Ljusterö, Rådmansö",
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
