export type Artikel = {
  slug: string;
  titel: string;
  ingress: string;
  datum: string;
  kategori: string;
  lästid: string;
  image?: string;
  innehåll: string;
};

export const artiklar: Artikel[] = [
  {
    slug: "vad-kostar-takbyte",
    titel: "Vad kostar ett takbyte i Stockholm 2025?",
    ingress:
      "Priset beror på material, takets storlek och komplexitet. Här är en guide med riktpriser för betongtak, tegeltak, plåttak och papptak — alla efter ROT-avdrag.",
    datum: "2025-03-15",
    kategori: "Priser",
    lästid: "5 min",
    image: "/images/blogg-vad-kostar-takbyte.jpg",
    innehåll: `## Riktpriser per taktyp

Priset för ett takbyte varierar beroende på vilket material du väljer, takets storlek och konstruktion. Här är de vanligaste materialen och vad de kostar i Stockholmsområdet — alla priser är efter 30% ROT-avdrag.

**Betongtak:** Från ca 1 200 kr/m²
Betongpannor är det vanligaste alternativet i Sverige. De är robusta, prisvärda och finns i ett brett sortiment av kulörer och profiler. Ett tak på 140 m² kostar från ca 169 000 kr efter ROT.

**Tegeltak:** Från ca 1 500 kr/m²
Tegel är ett rent naturmaterial som håller sin kulör livet ut. Ett korrekt lagt tegeltak kan hålla i över 50 år. Samma tak på 140 m² kostar från ca 210 000 kr efter ROT.

**Plåttak:** Från ca 1 800 kr/m²
Plåt är modernt och lättviktigt med minimalt underhåll. Det passar särskilt bra på hus med flackare taklutning eller modern arkitektur. 140 m² kostar från ca 252 000 kr efter ROT.

**Papptak:** Från ca 800 kr/m²
Papp är det mest prisvärda alternativet och används framför allt på platta och flacka tak. 140 m² kostar från ca 112 000 kr efter ROT.

## Vad ingår i priset?

Hos Sands Entreprenad ingår alltid:

- Rivning av befintlig beläggning
- Ny underlagspapp (Icopal Flexilight Prima)
- Ny ströläkt och bärläkt
- Nya takpannor eller beläggning
- Nytt regnvattensystem (hängrännor och stuprör)
- Taksäkerhet (stegar, snörasskydd)
- Ställning, container och bortforsling
- Slutbesiktning tillsammans med dig

Vi arbetar genom totalentreprenad enligt ABT-06 — allt regleras i ett enda kontrakt till fast pris.

## Vad påverkar priset?

Flera faktorer avgör det slutgiltiga priset:

- **Takets storlek** — fler kvadratmeter innebär ett högre totalpris, men lägre pris per m².
- **Materialval** — tegel kostar mer än betong, plåt mer än tegel.
- **Takets lutning och komplexitet** — ett valmat tak med många genomföringar tar längre tid.
- **Antal genomföringar** — skorstenar, ventilation och takfönster kräver extra arbete.
- **Underlagets skick** — om råspont eller läkt behöver bytas tillkommer kostnad.
- **Tillgänglighet** — svåråtkomliga tak kan kräva specialställning.

## ROT-avdrag — så funkar det

Alla priser ovan är efter 30% ROT-avdrag. ROT-avdraget innebär att du får tillbaka 30% av arbetskostnaden direkt på fakturan. Vi hanterar hela ansökan åt dig — du behöver inte göra något extra.

Maxbeloppet för ROT-avdrag är 50 000 kr per person och år (2025).

## Så får du ett exakt pris

Riktpriserna ovan ger en bra bild, men varje tak är unikt. Vi rekommenderar alltid en kostnadsfri takbesiktning där vi inspekterar taket på plats och lämnar ett fast pris utan förbindelser.`,
  },
  {
    slug: "nar-byta-tak",
    titel: "Hur vet du om det är dags att byta tak?",
    ingress:
      "Läckage, spruckna pannor och fukt på vinden är tydliga tecken. Men hur gammal behöver ett tak bli innan det bör bytas? Vi reder ut det.",
    datum: "2025-02-10",
    kategori: "Råd & tips",
    lästid: "4 min",
    image: "/images/blogg-nar-byta-tak.jpg",
    innehåll: `## Vanliga tecken på att taket behöver bytas

Det är inte alltid uppenbart att taket är på väg att ge upp. Här är de vanligaste varningssignalerna:

**Synliga skador på takpannorna**
Spruckna, förskjutna eller saknade pannor är tydliga tecken på att taket närmar sig slutet av sin livslängd. Enstaka pannor kan bytas, men om skadorna är utbredda bör hela taket läggas om.

**Läckage och fuktfläckar**
Vattenfläckar i taket eller på vindsvåningen är allvarliga varningssignaler. Läckage kan orsaka mögel, röta och skador på isoleringen som blir dyra att åtgärda.

**Fukt eller kondens på vinden**
Gå upp på vinden en kall dag. Om du ser fukt, kondens eller mögel kan det bero på att tätskiktet (underlagspappen) är skadat och inte längre håller tätt.

**Rost på plåtdetaljer**
Rost på hängrännor, stuprör, nockplåtar och fotplåtar tyder på att plåtdetaljerna behöver bytas — ofta i samband med en takomläggning.

**Taket närmar sig sin tekniska livslängd**
Alla tak har en begränsad livslängd:
- Betongtak: 30–50 år
- Tegeltak: 50–80 år
- Plåttak: 40–80 år
- Papptak: 15–25 år

Om ditt tak är äldre än dessa intervall bör du boka en inspektion.

## Vad händer om man väntar för länge?

Att skjuta upp ett takbyte kan leda till:

- **Vattenskador** — fukt sprider sig till konstruktionen och orsakar röta.
- **Mögel** — fuktiga miljöer skapar idealiska förhållanden för mögel.
- **Ökad kostnad** — skador på underlag och konstruktion gör det dyrare.
- **Sänkt fastighetsvärde** — ett dåligt tak syns vid besiktning.

## Boka en kostnadsfri takkontroll

Det bästa sättet att veta säkert är att låta en fackman inspektera taket. Vi erbjuder kostnadsfri takbesiktning i hela Stockholms län — vi inspekterar taket och ger dig en ärlig bedömning utan förbindelser.`,
  },
  {
    slug: "monier-garanti",
    titel: "Vad innebär Moniers Tätt tak-garanti?",
    ingress:
      "Som certifierad Monier Takpartner kan vi erbjuda upp till 30 års garanti på hela taksystemet. Så här fungerar garantin och vad den täcker.",
    datum: "2025-01-20",
    kategori: "Garanti",
    lästid: "3 min",
    image: "/images/blogg-monier-garanti.jpg",
    innehåll: `## Vad är Tätt tak-garantin?

Moniers Tätt tak-garanti är en systemgaranti som täcker hela taksystemets funktion och täthet — inte bara enskilda material. Det innebär att om ditt tak läcker under garantitiden åtgärdar Monier problemet utan kostnad för dig.

Garantin gäller i upp till 30 år vid komplett takomläggning med Moniers taksystem.

## Vad täcker garantin?

Tätt tak-garantin täcker:

- **Takpannornas funktion** — sprickor, frostskador, formförändringar
- **Underlagspappens täthet** — Icopal-membranet som ligger under pannorna
- **Taksystemets helhetsförmåga** — att taket håller tätt som system

Garantin förutsätter att alla komponenter i taksystemet är från Monier och att monteringen utförs av en certifierad Monier Takpartner.

## Hur blir man berättigad?

För att garantin ska gälla krävs:

1. **Certifierad Monier Takpartner** — vi, Sands Entreprenad, är certifierade.
2. **Komplett Monier-taksystem** — pannor, underlag, nock och detaljer.
3. **Korrekt montering** — vi följer Moniers monteringsanvisningar.
4. **Registrering** — vi registrerar ditt tak hos Monier efter slutbesiktning.

## Varför är det viktigt?

De flesta takläggare erbjuder garanti på eget utförande (vanligtvis 5–10 år). Moniers systemgaranti ger dig upp till 30 år — det är en av marknadens starkaste garantier för takläggning.

Du får ett garantibevis vid slutbesiktningen som specificerar exakta villkor och garantitid för ditt specifika tak.

## Monier — Nordens ledande taktillverkare

Monier har tillverkat takprodukter i över 100 år. Deras pannor är utvecklade och testade för nordiskt klimat — frysbeständiga, formstabila och med dokumenterad livslängd.

Som certifierad Monier Takpartner har vi genomgått utbildning och certifiering som säkerställer att varje tak vi lägger uppfyller Moniers kvalitetskrav.`,
  },
  {
    slug: "eternittak-asbest",
    titel: "Allt du behöver veta om eternittak och asbest",
    ingress:
      "Har du eternittak? Det är inte farligt att ha — men det måste hanteras korrekt när du byter det. Vår guide om asbestsanering och vad det kostar.",
    datum: "2025-01-05",
    kategori: "Material",
    lästid: "6 min",
    image: "/images/blogg-eternittak-asbest.jpg",
    innehåll: `## Vad är eternit?

Eternit är ett byggmaterial som användes flitigt i Sverige fram till mitten av 1980-talet. Det består av cement blandad med asbestfibrer och användes bland annat som takbeläggning, fasadskivor och rör.

Asbest är ett naturligt mineral som ger materialet styrka och brandmotstånd — men som vid inandning kan orsaka allvarliga lungsjukdomar.

## Är det farligt att ha eternittak?

**Intakt eternittak är normalt inte farligt.** Så länge materialet inte är skadat, bearbetat eller vittrat frigörs inga asbestfibrer. Du kan bo med eternittak utan akut hälsofara.

Men — eternit bör aldrig:
- Borras i, slipad eller sågad
- Högtryckstvättad
- Rivas utan certifierad saneringspartner

## När bör eternittak bytas?

Vi rekommenderar byte om:
- Materialet är synligt vittrat, sprucket eller skadat
- Du planerar renovering som påverkar taket
- Taket läcker
- Du vill höja fastighetsvärdet

## Hur går ett eternitbyte till?

1. **Inspektion** — vi inspekterar taket och bedömer omfattningen.
2. **Certifierad sanering** — vår saneringspartner (certifierad för asbesthantering) utför rivning enligt alla gällande regler. Materialet förpackas och transporteras till godkänd deponi.
3. **Nytt tak** — vi lägger nytt tak med ditt valda material och Monier-garanti.
4. **Slutbesiktning** — vi besiktigar resultatet tillsammans med dig.

## Vad kostar det?

Eternitbyte kostar mer än ett vanligt takbyte eftersom saneringskostnaden tillkommer. Den exakta kostnaden beror på:

- Takets storlek
- Mängden asbesthaltigt material
- Tillgänglighet och ställningsbehov
- Val av nytt takmaterial

Vi ger alltid fast pris efter besiktning — inga överraskningar.

## Vilka regler gäller?

Enligt Arbetsmiljöverkets föreskrifter (AFS 2006:1) krävs:
- Certifierat saneringsföretag med tillstånd
- Anmälan till Arbetsmiljöverket innan arbetet påbörjas
- Personlig skyddsutrustning och säkerhetsrutiner
- Korrekt avfallshantering till godkänd deponi

Vi ser till att alla regler följs — du behöver bara göra en kontakt, vi sköter resten.`,
  },
  {
    slug: "rot-avdrag-takbyte",
    titel: "ROT-avdrag vid takbyte — så funkar det",
    ingress:
      "30% av arbetskostnaden tillbaka direkt på fakturan. Vi förklarar hur ROT-avdraget fungerar och vad du kan dra av vid ett takbyte.",
    datum: "2024-12-01",
    kategori: "Ekonomi",
    lästid: "3 min",
    image: "/images/blogg-rot-avdrag.jpg",
    innehåll: `## Vad är ROT-avdrag?

ROT-avdraget (Renovering, Ombyggnad, Tillbyggnad) innebär att du som privatperson får en skattereduktion på 30% av arbetskostnaden vid renovering av din bostad. Avdraget dras direkt på fakturan — du betalar alltså bara 70% av arbetskostnaden.

## Hur mycket kan man dra av?

- **30%** av arbetskostnaden (ej material)
- **Max 50 000 kr** per person och år (2025)
- Gäller för dig som äger och bor i bostaden

Om två personer äger bostaden tillsammans kan ni alltså dra av upp till 100 000 kr totalt.

## Vad kan man dra av vid takbyte?

Vid ett takbyte är en stor del av kostnaden arbetskostnad, vilket gör ROT-avdraget särskilt fördelaktigt. Du kan dra av arbetskostnaden för:

- Rivning av gammalt tak
- Montering av nytt underlag, läkt och pannor
- Montering av hängrännor och stuprör
- Montering av taksäkerhet
- Ställningsarbete

**Materialkostnader** (takpannor, underlagspapp, plåt etc.) kan inte dras av.

## Hur funkar det i praktiken?

1. Vi specificerar arbets- och materialkostnad separat på fakturan.
2. Vi ansöker om ROT-avdraget hos Skatteverket åt dig.
3. Du betalar den reducerade summan — 70% av arbetskostnaden + 100% av materialkostnaden.
4. Vi får mellanskillnaden direkt från Skatteverket.

Du behöver inte göra något extra — vi hanterar hela processen.

## Prisexempel med ROT

Takbyte 140 m² med betongpannor:
- Totalpris före ROT: **ca 241 000 kr**
- Arbetskostnad: ca 140 000 kr
- ROT-avdrag (30%): **−42 000 kr**
- **Du betalar: ca 199 000 kr**

Med två ägare som delar avdraget kan besparingen bli ännu större.

## Villkor att tänka på

- Du måste äga bostaden och vara folkbokförd där (eller ha den som fritidsbostad)
- Arbetet måste utföras av ett F-skatteregistrerat företag
- Avdraget gäller inte för nybyggnation
- Du måste ha tillräckligt med inbetald skatt för att utnyttja avdraget

Vi kontrollerar alltid att förutsättningarna är uppfyllda innan vi ansöker.`,
  },
  {
    slug: "platttak-eller-tegeltag",
    titel: "Plåttak eller tegeltak — vilket väljer du?",
    ingress:
      "Båda materialen ger ett hållbart resultat — men de passar olika hus och stilar. Vår jämförelse hjälper dig att välja rätt.",
    datum: "2024-11-15",
    kategori: "Material",
    lästid: "5 min",
    image: "/images/blogg-plattak-eller-tegeltak.jpg",
    innehåll: `## Två utmärkta material — men med olika styrkor

Plåttak och tegeltak är två av de mest hållbara takmaterialen du kan välja. Båda ger ett vackert resultat och lång livslängd, men de passar olika hus och situationer.

## Tegeltak — det klassiska valet

**Fördelar:**
- Naturmaterial som håller i 50–80 år
- Behåller sin kulör livet ut — behöver aldrig målas
- Frostbeständigt och formstabilt
- Klassiskt utseende som passar äldre och traditionella hus
- Enskilda pannor kan bytas vid skada

**Nackdelar:**
- Tyngre — kräver en stabil takkonstruktion
- Dyrare per m² än betong
- Begränsad färgpalett (naturliga toner)

**Pris:** Från ca 1 500 kr/m² efter ROT

**Passar bäst för:** Äldre villor, 20–50-talshus, tegelhus, lantliga miljöer.

## Plåttak — det moderna valet

**Fördelar:**
- Lättviktigt — minskar belastningen på konstruktionen
- Lång livslängd (40–80 år beroende på material)
- Minimalt underhåll
- Slät yta som inte samlar mossa eller skräp
- Passar moderna och traditionella hus

**Nackdelar:**
- Kräver hög precision vid montering
- Dyrare per m² än tegel
- Kan upplevas som mindre "klassiskt"

**Pris:** Från ca 1 800 kr/m² efter ROT

**Passar bäst för:** Moderna villor, hus med flack taklutning, tillbyggnader, moderna arkitektritade hus.

## Jämförelse

| Egenskap | Tegeltak | Plåttak |
|----------|----------|---------|
| Livslängd | 50–80 år | 40–80 år |
| Vikt | Tungt | Lätt |
| Underhåll | Minimalt | Minimalt |
| Pris (efter ROT) | Från 1 500 kr/m² | Från 1 800 kr/m² |
| Garanti (Monier) | Upp till 30 år | Varierar |
| Utseende | Klassiskt | Modernt |
| Ljudnivå | Tyst | Tyst (med rätt underlag) |

## Vad rekommenderar vi?

Det beror helt på ditt hus och dina preferenser. Vi hjälper dig att välja rätt vid hembesöket — vi inspekterar taket, diskuterar alternativ och ger dig ett fast pris för det material du väljer.

Oavsett val erbjuder vi totalentreprenad med fast pris och upp till 30 års Monier-garanti.`,
  },
];

export function getArtikel(slug: string): Artikel | undefined {
  return artiklar.find((a) => a.slug === slug);
}
