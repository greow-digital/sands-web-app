/**
 * Enda sanningskälla för kundomdömen. Renderas både i ReviewCarousel
 * (startsidan) och på /omdomen, så att samma kund alltid har samma ort,
 * material och text. Tidigare hade sidorna olika versioner av samma
 * förnamn, vilket undergrävde trovärdigheten.
 *
 * Lägg till/ändra omdömen här, inte i enskilda komponenter.
 */

export interface Testimonial {
  /** Namn som visas, t.ex. "Maria S." */
  name: string;
  ort: string;
  /** Material/tjänst, t.ex. "Tegeltak" eller "Takomläggning" */
  tjanst: string;
  /** Takyta i kvm, om känd (visas i karusellen) */
  kvm?: number;
  betyg: number;
  text: string;
  source: "brabyggare" | "offerta";
}

export const testimonials: Testimonial[] = [
  {
    name: "Henrik",
    ort: "Tyresö",
    tjanst: "Takläggning",
    kvm: 170,
    betyg: 5,
    text: "Riktigt bra att ha och göra med. Snabba, noggranna och gjort ett riktigt bra jobb som takbyte. Supernöjd och till ett bra pris dessutom. Kan starkt rekommendera.",
    source: "brabyggare",
  },
  {
    name: "Pauli",
    ort: "Solna",
    tjanst: "Tegeltak",
    kvm: 150,
    betyg: 5,
    text: "Väldigt professionellt och effektivt genomförande. Väldigt bra och detaljerad offert som också stämde exakt med slutfakturan. Rekommenderas varmt!",
    source: "offerta",
  },
  {
    name: "Maria S.",
    ort: "Nacka",
    tjanst: "Tegeltak",
    betyg: 5,
    text: "Mycket nöjd med hela processen från start till slut. Sands var alltid tillgängliga för frågor och höll tidplanen. Resultatet blev fantastiskt, taket ser helt nytt ut.",
    source: "offerta",
  },
  {
    name: "Johan R.",
    ort: "Tyresö",
    tjanst: "Betongtak",
    betyg: 5,
    text: "Extremt nöjd! Projektet höll tidplan och budget. Projektledaren var alltid tillgänglig och svarade snabbt på frågor.",
    source: "brabyggare",
  },
  {
    name: "Erik H.",
    ort: "Järfälla",
    tjanst: "Plåttak",
    betyg: 5,
    text: "Hade ett gammalt eternittak som behövde bytas. Sands skötte hela processen, sanering och nytt plåttak. Supernöjd!",
    source: "brabyggare",
  },
  {
    name: "Karin B.",
    ort: "Bromma",
    tjanst: "Betongtak",
    betyg: 5,
    text: "Från första kontakt till takkontroll var allt professionellt och välorganiserat. Priset stämde precis med offerten.",
    source: "offerta",
  },
  {
    name: "Anders L.",
    ort: "Täby",
    tjanst: "Betongtak",
    kvm: 160,
    betyg: 5,
    text: "Professionellt och pålitligt företag. Boka ett hembesök, ni ångrar er inte. Fast pris från start och inga överraskningar.",
    source: "brabyggare",
  },
  {
    name: "Lena K.",
    ort: "Danderyd",
    tjanst: "Tegeltak",
    betyg: 5,
    text: "Helt fantastiskt jobb! Nytt tegeltak på vårt 40-talshus. Grannarna har redan frågat efter kontaktuppgifter. Seriöst företag med hög kvalitet.",
    source: "offerta",
  },
  {
    name: "Peter M.",
    ort: "Huddinge",
    tjanst: "Takomläggning",
    betyg: 5,
    text: "Sands team är duktiga och noggranna. De städade efter sig och lämnade tomten i perfekt skick. Skulle anlita igen.",
    source: "brabyggare",
  },
  {
    name: "Sofie",
    ort: "Lidingö",
    tjanst: "Eternitbyte",
    betyg: 5,
    text: "Anlitade Sands för eternitsanering och nytt tak. De skötte hela processen smidigt och professionellt. Mycket tryggt att de hanterar allt i ett kontrakt.",
    source: "offerta",
  },
];
