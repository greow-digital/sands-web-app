export type Tjanst = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  text: string;
  prisIntervall?: string;
  prism2: string;
  image?: string;
  kategori: "tjanst" | "taktyp";
  ingår?: string[];
  process?: { step: string; text: string }[];
  komponenter?: { name: string; description: string; image: string }[];
  faq: { q: string; a: string }[];
  relaterade?: string[];
};

const bildKarta: Record<string, string> = {
  taklaggning: "/images/takdiagram.jpg",
  tegeltak: "/images/taktyp-tegeltak.jpg",
  betongtak: "/images/taktyp-betongtak.jpg",
  plattak: "/images/taktyp-plattak.jpg",
  papptak: "/images/taktyp-papptak.jpg",
  eternittak: "/images/taktyp-papptak.jpg",
  takfonsterkupor: "/images/taktyp-plattak.jpg",
  hangrannorstupror: "/images/hangrannor-efter.jpg",
  taksakerhet: "/images/hero-sands-construction.jpg",
  takbesiktning: "/images/bromma-tak-hero.jpg",
  totalentreprenad: "/images/totalentreprenad.jpg",
  fasadrenovering: "/images/fasad-panelbyte-bromma.jpg",
  badrumsrenovering: "/images/badrum.png",
  koksrenovering: "/images/koksrenovering.jpg",
  ovriga: "/images/solna-uteplats-dag.jpg",
};

export const tjanster: Tjanst[] = [
  {
    slug: "taklaggning",
    kategori: "tjanst",
    title: "Takläggning",
    h1: "Takbyte, takomläggning & takrenovering i Stockholm",
    intro:
      "Komplett takbyte, omläggning av befintliga pannor eller riktade punktinsatser. Vi börjar alltid med en kostnadsfri takkontroll och rekommenderar det alternativ som faktiskt löser ditt problem.",
    text:
      "Vi arbetar med alla typer av tak, tegeltak, betongtak, plåttak och papptak. Som certifierad Monier Takpartner kan vi erbjuda Moniers Tätt tak-garanti på upp till 30 år vid komplett takomläggning med Moniers taksystem.\n\nVarje arbete är unikt och därför börjar vi alltid med en kostnadsfri takkontroll. Vid besiktningen får ni som kund en överblick på vilka åtgärder taket behöver. Vi arbetar genom totalentreprenad enligt ABT-06, vilket innebär att allt regleras i ett enda kontrakt till fast pris.",
    prisIntervall: "Från ca 1 200–2 000 kr/m² efter ROT-avdrag",
    prism2: "1 200–2 000",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintlig beläggning",
      "Ny underlagspapp (Icopal Flexilight Prima)",
      "Ny ströläkt & bärläkt (25×48 mm)",
      "Nya takpannor/beläggning",
      "Nytt regnvattensystem (hängrännor och stuprör)",
      "Ställning, container och bortforsling",
      "Takkontroll tillsammans med dig",
    ],
    faq: [
      {
        q: "Hur går en takomläggning till hos Sands?",
        a: "Vi börjar med ett kostnadsfritt hembesök där vi inspekterar taket och går igenom dina behov. Du får sedan en detaljerad offert med fast pris. När du godkänt offerten utför vi arbetet och avslutar med en takkontroll.",
      },
      {
        q: "Hur lång tid tar en takomläggning?",
        a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
      },
      {
        q: "Ingår rivning av det gamla taket?",
        a: "Ja, rivning av befintlig beläggning, bortforsling och container ingår alltid i det fasta priset.",
      },
      {
        q: "Kan jag använda ROT-avdrag?",
        a: "Ja. ROT-avdraget ger dig 30% tillbaka på arbetskostnaden direkt på fakturan. Vi hanterar ansökan åt dig.",
      },
    ],
    relaterade: ["tegeltak", "betongtak", "plattak", "papptak"],
  },
  {
    slug: "tegeltak",
    kategori: "taktyp",
    title: "Tegeltak",
    h1: "Tegeltak i Stockholm",
    intro:
      "Taktegel är ett rent naturmaterial som bara blir vackrare med åren. Vi lägger tegeltak från Monier med upp till 30 års garanti.",
    text:
      "Tegeltak har en lång tradition i Sverige och är känt för sin hållbarhet och sitt klassiska utseende. Ett korrekt lagt tegeltak kan hålla i 50-100 år. Vi arbetar med Moniers tegelpannor som ger ett komplett taksystem med materialgaranti och montagegaranti.\n\nTegelpannor är tillverkade av naturligt lera och bränd i hög temperatur. De är frostbeständiga, formstabila och behåller sin kulör livet ut utan att behöva målas eller underhållas.",
    prisIntervall: "Från ca 1 500 kr/m² efter ROT-avdrag",
    prism2: "1 500",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintlig beläggning",
      "Ny underlagspapp",
      "Ny ströläkt & bärläkt",
      "Tegelpannor från Monier",
      "Nockpannor, kantdetaljer och genomföringar",
      "Nytt regnvattensystem",
      "Ställning, container och bortforsling",
    ],
    faq: [
      {
        q: "Hur länge håller ett tegeltak?",
        a: "Ett korrekt lagt tegeltak med Moniers system kan hålla i 50-100 år. Med Tätt tak-garantin täcks hela taksystemets funktion i upp till 30 år.",
      },
      {
        q: "Väger tegeltak mer än betongtak?",
        a: "Tegel är något lättare än betong per panna, men skillnaden i total vikt är liten. Konstruktionen ska alltid verifieras av en takläggare.",
      },
      {
        q: "Vilka tegelpannor jobbar ni med?",
        a: "Vi är certifierad Monier Takpartner och arbetar primärt med Moniers sortiment, bland annat Palema och Romano-profiler.",
      },
      {
        q: "Kan man byta enstaka tegelpannor?",
        a: "Ja, det är en fördel med tegel, enskilda pannor kan bytas vid skada utan att hela taket behöver läggas om.",
      },
    ],
    relaterade: ["betongtak", "taklaggning", "plattak"],
  },
  {
    slug: "betongtak",
    kategori: "taktyp",
    title: "Betongtak",
    h1: "Betongtak i Stockholm",
    intro:
      "Betongpannor är ett robust och prisvärt val som tål det nordiska klimatet.",
    text:
      "Betongtak är det vanligaste takmaterialet i Sverige. Pannorna finns i flera färger och profiler och ger ett snyggt och hållbart resultat. Vi arbetar med Moniers betongpannor, bland annat modellen Jönåker Elegant som kombinerar klassisk form med modern prestanda.\n\nBetongpannor är ett ekonomiskt alternativ som ger lång livslängd och lågt underhåll. De är tillgängliga i ett brett sortiment av kulörer och ytor, allt från naturgrå till glaserat.",
    prisIntervall: "Från ca 1 200 kr/m² efter ROT-avdrag",
    prism2: "1 200",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintlig beläggning",
      "Ny underlagspapp (Icopal Flexilight Prima)",
      "Ny ströläkt & bärläkt (25×48 mm)",
      "Betongpannor från Monier",
      "Nockpannor, kantdetaljer och genomföringar",
      "Nytt regnvattensystem",
      "Ställning, container och bortforsling",
    ],
    faq: [
      {
        q: "Hur länge håller ett betongtak?",
        a: "Med korrekt läggning och Moniers taksystem håller ett betongtak i 40-60 år. Tätt tak-garantin täcker upp till 30 år.",
      },
      {
        q: "Vad är skillnaden på betongtak och tegeltak?",
        a: "Betong är något tyngre och kostar lite mindre per m². Tegel är ett naturmaterial och behåller sin kulör längre. Båda ger utmärkta resultat.",
      },
      {
        q: "Vilken modell använder ni?",
        a: "Vi arbetar med hela Moniers betongpannasortiment. Jönåker Elegant är en populär modell för villa.",
      },
      {
        q: "Kan jag välja färg?",
        a: "Ja, Monier erbjuder betongpannor i ett brett spektrum av kulörer, naturgrå, rödbrun, svart, glaserat med mera.",
      },
    ],
    relaterade: ["tegeltak", "taklaggning", "papptak"],
  },
  {
    slug: "plattak",
    kategori: "taktyp",
    title: "Plåttak",
    h1: "Plåttak i Stockholm",
    intro:
      "Modernt och lättviktigt material med lång livslängd och minimalt underhåll.",
    text:
      "Plåttak är ett populärt val för villor och moderna hus. Materialet är lättare än tegel och betong, vilket minskar belastningen på konstruktionen. Vi lägger bandtäckt och dubbelfalsat plåttak med hög precision.\n\nPlåt är ett extremt hållbart material, korrekt lagt håller det i 40-70 år. Det kräver minimalt underhåll och passar utmärkt för tak med flackare lutning eller för hus med en mer modern arkitektur.",
    prisIntervall: "Från ca 1 800 kr/m² efter ROT-avdrag",
    prism2: "1 800",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintlig beläggning",
      "Ny underlagspapp / underlagsskiva",
      "Bandtäckt eller dubbelfalsat plåt",
      "Plåtdetaljer, nockplåt, genomföringar",
      "Nytt regnvattensystem i plåt",
      "Ställning, container och bortforsling",
    ],
    faq: [
      {
        q: "Hur länge håller ett plåttak?",
        a: "Ett korrekt lagt plåttak håller i 40-70 år beroende på material och behandling. Zink och koppar kan hålla ännu längre.",
      },
      {
        q: "Vilket plåtmaterial väljer man?",
        a: "Vanligast är stålplåt med skyddslacksbeläggning. Zink och koppar används på premium-projekt och patineras vackert med åren.",
      },
      {
        q: "Passar plåttak på alla hus?",
        a: "Plåttak passar på de flesta hus, från moderna flacka tak till klassiska sadeltak. Det är ett särskilt bra val vid ombyggnation eller tillägg.",
      },
      {
        q: "Är plåttak mer bullrigt?",
        a: "Med rätt underlag och isolering märks inget extra ljud från regn. Moderna plåtsystem är inte mer bullriga än andra material.",
      },
    ],
    relaterade: ["betongtak", "tegeltak", "totalentreprenad"],
  },
  {
    slug: "papptak",
    kategori: "taktyp",
    title: "Papptak",
    h1: "Papptak i Stockholm",
    intro:
      "Prisvärt alternativ för platta tak och enklare konstruktioner.",
    text:
      "Papptak är en kostnadseffektiv taklösning som är hållbar om den läggs professionellt. Vi arbetar med Icopals pappsystem för bästa resultat.\n\nPapptäckning är den vanligaste lösningen för platta och flacka tak. Rätt utförd med ordentlig tätskiktsläggning och genomföringar ger papptak ett vattentätt och hållbart resultat i många år.",
    prisIntervall: "Från ca 800 kr/m² efter ROT-avdrag",
    prism2: "800",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintlig beläggning",
      "Kontroll och åtgärd av underlag",
      "Ny tätskiktspapp (Icopal)",
      "Genomföringar, anslutningar och detaljer",
      "Nytt regnvattensystem",
      "Ställning, container och bortforsling",
    ],
    faq: [
      {
        q: "Hur länge håller ett papptak?",
        a: "Ett professionellt lagt papptak håller i 20-30 år beroende på system och exponering. Regelbunden inspektion förlänger livslängden.",
      },
      {
        q: "Passar papptak bara för platta tak?",
        a: "Papptak används framför allt på platta och flacka tak (0–15° lutning). För brantare tak är pannmaterial ett bättre alternativ.",
      },
      {
        q: "Kan man lägga papp ovanpå befintlig papp?",
        a: "I vissa fall, men vi rekommenderar alltid rivning och ny läggning för bäst resultat och garanti.",
      },
      {
        q: "Inkluderas garantier?",
        a: "Vi arbetar med Icopals system och ger garanti på utförandet. Exakta villkor specificeras i offerten.",
      },
    ],
    relaterade: ["taklaggning", "betongtak", "hangrannorstupror"],
  },
  {
    slug: "eternittak",
    kategori: "taktyp",
    title: "Eternittak",
    h1: "Byte av eternittak i Stockholm",
    intro:
      "Eternittak innehåller asbest och kräver certifierad sanering innan nytt tak kan läggas.",
    text:
      "Har du eternittak? Det är viktigt att hantera det korrekt. Vi samarbetar med certifierade saneringsföretag och hanterar hela processen åt dig, från rivning och asbestsanering till nytt tak med garanti. Du behöver bara göra en kontakt, vi sköter resten.\n\nAsbest är ett hälsofarligt material som inte får hanteras av obehöriga. Vår partner är certifierad för asbestsanering och följer samtliga lagkrav och säkerhetsrutiner.",
    prisIntervall: "Pris efter takkontroll (inkl. sanering)",
    prism2: "Kontakta oss",
    process: [
      {
        step: "Inspektion",
        text: "Vi inspekterar taket och bedömer omfattningen av asbestinnehåll och rivning.",
      },
      {
        step: "Sanering",
        text: "Certifierad saneringspartner utför asbestsanering enligt alla gällande regler och säkerhetsrutiner.",
      },
      {
        step: "Nytt tak",
        text: "Vi lägger nytt tak med ditt valda material och Monier-garanti.",
      },
      {
        step: "Takkontroll",
        text: "Vi avslutar med takkontroll och du får garantibevis.",
      },
    ],
    faq: [
      {
        q: "Är det farligt att ha eternittak?",
        a: "Intakt eternittak som inte är skadat utgör vanligtvis ingen direkt fara. Men vid rivning eller skada frigörs asbestfibrer som är hälsofarliga, därför krävs certifierad hantering.",
      },
      {
        q: "Måste man ha tillstånd för att riva eternittak?",
        a: "Ja, asbestrivning kräver certifiering och ska utföras av ett godkänt saneringföretag. Vi hanterar detta åt dig.",
      },
      {
        q: "Hur lång tid tar ett eternitbyte?",
        a: "Typiskt 1–2 veckor totalt, beroende på takets storlek och saneringens omfattning.",
      },
      {
        q: "Vad kostar det att byta eternittak?",
        a: "Priset inkluderar sanering och nytt tak. Det är högre än ett vanligt takbyte, men vi ger alltid fast pris efter takkontroll.",
      },
    ],
    relaterade: ["taklaggning", "tegeltak", "betongtak"],
  },
  {
    slug: "takfonsterkupor",
    kategori: "tjanst",
    title: "Takfönster & takkupor",
    h1: "Takfönster & takkupor i Stockholm",
    intro:
      "Vi installerar takfönster och bygger takkupor i samband med takomläggning.",
    text:
      "En takkupa är ett effektivt sätt att få in ljus och skapa rymd på övervåningen eller vinden. Takfönster höjer värdet på huset och gör att boytan känns större.\n\nVi installerar takfönster från ledande leverantörer och bygger takkupor i olika utföranden. Arbetet utförs alltid i samband med takomläggning för effektivare utförande och bästa resultat.",
    prisIntervall: "Pris efter takkontroll och val av fönster",
    prism2: "Kontakta oss",
    faq: [
      {
        q: "Kan man sätta in takfönster utan att lägga om hela taket?",
        a: "Det är möjligt, men vi rekommenderar att kombinera det med takomläggning för bäst resultat och för att undvika två omgångar av ställning och arbete.",
      },
      {
        q: "Kräver en takkupa bygglov?",
        a: "Det beror på kommunen och husets karaktär. Vi hjälper till att bedöma vad som gäller för ditt hus.",
      },
      {
        q: "Vilka takfönster jobbar ni med?",
        a: "Vi installerar takfönster från Velux och FAKRO, anpassade efter taklutning och konstruktion.",
      },
    ],
    relaterade: ["taklaggning", "totalentreprenad"],
  },
  {
    slug: "hangrannorstupror",
    kategori: "tjanst",
    title: "Hängrännor & vindskivor",
    h1: "Hängrännor & vindskivor i Stockholm",
    intro:
      "Vi monterar och byter hängrännor, stuprör och vindskivor som skyddar din fasad och grund från fukt.",
    text:
      "Hängrännor, stuprör och vindskivor utgör takets ytterhölje och skyddar både fasad och grund. När de börjar läcka, rosta eller ruttna är det dags att byta. Annars riskerar du följdskador på trä, isolering och murverk.\n\nVi monterar plåthängrännor av hög kvalitet (halvrunda eller fyrkantiga) tillsammans med matchande stuprör. Allt ingår alltid när vi gör en komplett takomläggning, men vi byter också enbart hängrännor och stuprör om resten av taket är i gott skick.\n\nVindskivorna är minst lika viktiga. Det är brädorna eller plåten längs takets gavlar som skyddar takets kant från vind och slagregn och döljer takkonstruktionens undersida. När vindskivorna ruttnar eller färgen flagar är det ett tecken på att fukt börjat tränga in. Vi byter både träbaserade och plåtklädda vindskivor, ofta i samma vända som hängrännor och stuprör för bästa resultat och pris.",
    prisIntervall: "Ingår vid komplett takbyte. Separat: pris efter takkontroll",
    prism2: "Kontakta oss",
    faq: [
      {
        q: "Ingår hängrännor i ett komplett takbyte?",
        a: "Ja, byte av hängrännor och stuprör ingår alltid i ett komplett takbyte hos oss.",
      },
      {
        q: "Kan ni byta hängrännor utan att byta tak?",
        a: "Ja, om taket är i gott skick kan vi byta enbart hängrännor och stuprör.",
      },
      {
        q: "Vilket material väljer man?",
        a: "Vi monterar i första hand plåthängrännor (stål med skyddslackering). Koppar och zink är tillval för premium-projekt.",
      },
      {
        q: "Vad är vindskivor?",
        a: "Vindskivor är brädorna eller plåten längs takets gavlar (där taket möter väggen i triangelformen). De skyddar takets kant från vind och vatten samt döljer takkonstruktionens undersida.",
      },
      {
        q: "Hur ofta behöver vindskivor bytas?",
        a: "Träbaserade vindskivor bör ses över vart 5–10:e år och målas vid behov. Vid rötangrepp eller om färgen flagar bör de bytas. Plåtklädda vindskivor håller betydligt längre.",
      },
      {
        q: "Kan ni byta enbart vindskivor?",
        a: "Ja, om taket i övrigt är i gott skick byter vi gärna enbart vindskivorna. Vi rekommenderar dock att kombinera med byte av hängrännor eftersom samma ställning kan användas.",
      },
    ],
    relaterade: ["taklaggning", "papptak"],
  },
  {
    slug: "taksakerhet",
    kategori: "tjanst",
    title: "Taksäkerhet",
    h1: "Taksäkerhet i Stockholm",
    intro:
      "Vi installerar komplett taksäkerhet enligt BBR: snörasskydd, gångbryggor, takstegar och säkerhetsräcken som skyddar både dem som vistas på taket och dem som rör sig nedanför.",
    text:
      "Taksäkerhet är inte bara ett lagkrav enligt Boverkets byggregler (BBR 8:24), utan också en förutsättning för att sotare, takmontörer och andra hantverkare ska kunna utföra sitt arbete tryggt. Saknas taksäkerhet får sotaren rätt att vägra inspektion, och du som fastighetsägare bär ansvaret om någon skadas på taket eller av nedfallande snö och is.\n\nVi monterar samtliga delar enligt branschstandard och med produkter som följer SS-EN 516 och SS-EN 517 (svenska säkerhetsstandarder för fasta takanordningar). Vid en komplett takomläggning ingår arbetssäkerhet och ställning i det fasta priset. Taksäkerhetsprodukter som snörasskydd, takstegar och gångbryggor offereras som en separat post utifrån vad just ditt tak kräver. Vi tar även uppdrag på enbart komplettering, ofta efter besiktningsanmärkning vid husköp eller krav från sotare eller försäkringsbolag.",
    prism2: "Pris efter takkontroll",
    komponenter: [
      {
        name: "Snörasskydd",
        description:
          "Hindrar snö och is från att rasa ner över entréer, gångvägar och uteplatser.",
        image: "/images/taksakerhet/snorasskydd.jpg",
      },
      {
        name: "Gångbrygga",
        description:
          "Säker förflyttning i sidled över taket för sotare och takmontörer.",
        image: "/images/taksakerhet/gangbrygga.jpg",
      },
      {
        name: "Takstege",
        description:
          "Säker åtkomst upp och ned för takfallet, monterad parallellt med takets lutning.",
        image: "/images/taksakerhet/takstege.jpg",
      },
      {
        name: "Bärläktsteg",
        description:
          "Alternativ stegfunktion som följer takets bärläkt, diskret och hållbar.",
        image: "/images/taksakerhet/barlaktsteg.jpg",
      },
      {
        name: "Nock- och takfotsräcken",
        description:
          "Fast räcke längs nock eller takfot som fungerar både som fallskydd och fästpunkt.",
        image: "/images/taksakerhet/nock-takfotsracke.jpg",
      },
      {
        name: "Räcke för taklucka & takfönster",
        description:
          "Monteras kring takluckor och takfönster för att förhindra genomtrampning.",
        image: "/images/taksakerhet/racke-taklucka.jpg",
      },
      {
        name: "Glidskydd markstege",
        description:
          "Säkrar markstegens position vid takåtkomst så den inte glider undan.",
        image: "/images/taksakerhet/glidskydd-markstege.jpg",
      },
      {
        name: "Vajer- och linsystem",
        description:
          "Extra fallskydd vid stora taklängder, kompletterar gångbrygga och takstege.",
        image: "/images/taksakerhet/vajersystem.jpg",
      },
    ],
    faq: [
      {
        q: "Är taksäkerhet lagkrav?",
        a: "Ja. Enligt Boverkets byggregler (BBR 8:24) ska byggnader förses med fasta säkerhetsanordningar för säkert tillträde, förflyttning och arbete på tak. Kraven gäller både nybyggnation och vid större takomläggningar.",
      },
      {
        q: "Vem ansvarar om sotaren ramlar?",
        a: "Som fastighetsägare har du ansvar för att taksäkerheten är godkänd. Saknas eller är den bristfällig kan sotaren vägra utföra sitt arbete tills brister åtgärdats.",
      },
      {
        q: "När krävs snörasskydd?",
        a: "Snörasskydd är obligatoriskt över entréer, gångbanor, uteplatser och allmän mark där människor rör sig. För Stockholmsklimat rekommenderar vi alltid komplett snörasskydd, för att skydda mot både person- och egendomsskador.",
      },
      {
        q: "Kan ni montera taksäkerhet utan att byta tak?",
        a: "Ja, vi monterar både på befintliga tak och som del av en komplett takomläggning. På befintligt tak kontrollerar vi först bärighet och pannornas skick.",
      },
      {
        q: "Måste taksäkerheten besiktigas?",
        a: "Det finns inget formellt besiktningskrav, men sotaren bedömer skicket vid sin årliga genomgång. Vi rekommenderar kontroll vart 5:e år och direkt efter större takarbeten.",
      },
    ],
    relaterade: ["taklaggning", "hangrannorstupror"],
  },
  {
    slug: "takbesiktning",
    kategori: "tjanst",
    title: "Takbesiktning",
    h1: "Takbesiktning i Stockholm",
    intro:
      "Kostnadsfri takbesiktning av certifierad takläggare. Vi går upp på taket, bedömer skicket och ger en ärlig rekommendation. Bra inför takbyte, husköp eller för att veta hur länge taket håller till.",
    text:
      "En takbesiktning är en systematisk genomgång av takets skick. Vi inspekterar pannor och plåt, plåtdetaljer, hängrännor, skorsten utvändigt och vinden där det är åtkomligt.\n\nDu följer med på inspektionen om du vill. Efter genomgången går vi tillsammans igenom vad vi sett och vad som behöver göras, om något. Om åtgärd behövs lämnar vi fast pris direkt. Är taket i bra skick får du veta det.\n\nBesiktningen är kostnadsfri och utan förbindelse, oavsett om du väljer oss för efterföljande arbete eller inte.",
    prism2: "0 kr",
    prisIntervall: "Kostnadsfri",
    faq: [
      {
        q: "Kostar takbesiktningen något?",
        a: "Nej. Besiktningen är kostnadsfri och utan förbindelse att välja oss för efterföljande arbete.",
      },
      {
        q: "Går ni upp på taket eller bara tittar nedifrån?",
        a: "Vi går upp på taket. En seriös bedömning kräver att vi inspekterar pannor och plåtdetaljer på nära håll.",
      },
      {
        q: "Kan jag boka besiktning inför ett husköp?",
        a: "Ja. Vi prioriterar bostadsköp för snabbast möjliga tid och du får dokumentation som kan användas i förhandling med säljaren.",
      },
      {
        q: "Vad är skillnaden mot offert?",
        a: "Ingen i praktiken. Vid besiktning får du både skickbedömning och fast pris i samma besök.",
      },
    ],
    relaterade: ["taklaggning", "taksakerhet"],
  },
  {
    slug: "totalentreprenad",
    kategori: "tjanst",
    title: "Totalentreprenad",
    h1: "Totalentreprenad med fast pris",
    intro:
      "Vi tar hela ansvaret för ditt projekt, från takkontroll till färdigt tak.",
    text:
      "Totalentreprenad innebär att vi tar hela ansvaret för ditt projekt, från takkontroll till färdigt tak. Allt regleras i ett enda kontrakt med fast pris enligt ABT-06. Du slipper samordna olika hantverkare och får en kontaktperson genom hela processen.\n\nABT-06 (Allmänna bestämmelser för totalentreprenader) är branschstandard och reglerar ansvarsfördelning, garantier och besiktningsprocess. Med oss som totalentreprenör är du alltid skyddad.",
    prisIntervall: "Fast pris enligt offert, inga dolda avgifter",
    prism2: "Fast pris",
    ingår: [
      "Ett kontrakt, ett fast pris",
      "En kontaktperson från start till mål",
      "Vi samordnar alla moment",
      "Regleras enligt ABT-06",
      "Inga dolda avgifter",
      "Garanti på utförandet",
      "Takkontroll med garantibevis",
    ],
    faq: [
      {
        q: "Vad innebär ABT-06?",
        a: "ABT-06 (Allmänna bestämmelser för totalentreprenader) är branschstandard och reglerar ansvarsfördelning, garantier, besiktning och tvisthantering. Det ger dig som kund ett starkt skydd.",
      },
      {
        q: "Vad är skillnaden på totalentreprenad och utförandeentreprenad?",
        a: "Vid totalentreprenad ansvarar vi för hela projektet inkl. materialleveranser. Vid utförandeentreprenad ansvarar kunden för projektering. Totalentreprenad ger ett enklare och tryggare ansvar.",
      },
      {
        q: "Kan priset ändras efter att offerten är godkänd?",
        a: "Nej. Med totalentreprenad och fast pris är priset låst. Tilläggsarbeten som beställs separat prissätts i förväg.",
      },
    ],
    relaterade: ["taklaggning", "tegeltak", "betongtak"],
  },
  {
    slug: "fasadrenovering",
    kategori: "tjanst",
    title: "Fasadrenovering & fasadmålning",
    h1: "Fasadrenovering i Stockholm",
    intro:
      "Vi utför fasadrenoveringar och fasadmålning i samband med takprojekt eller som fristående uppdrag.",
    text:
      "En fasadrenovering ger huset nytt liv och höjer fastighetsvärdet. Vi erbjuder putsning, målning och renovering av fasader i hela Stockholms län. Ofta kombinerar våra kunder fasadrenovering med takbyte, det sparar ställningskostnad och ger ett helhetsmässigt resultat.\n\nVi arbetar med professionella material och metoder som ger lång livslängd. Oavsett om du har puts, trä eller tegelfasad kan vi hjälpa dig med rätt lösning.",
    prisIntervall: "Pris efter takkontroll",
    prism2: "Kontakta oss",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Tvättning och förbehandling av fasad",
      "Lagning av skador och sprickor",
      "Grundmålning och slutstrykning",
      "Fönsterkarmar och vindskivor vid behov",
      "Ställning",
      "Takkontroll",
    ],
    faq: [
      {
        q: "Kan ni renovera fasaden i samband med takbyte?",
        a: "Ja, det är vanligt och kostnadseffektivt. Ställningen som används vid takbytet kan ofta användas till fasadarbetet.",
      },
      {
        q: "Vilka typer av fasader jobbar ni med?",
        a: "Vi arbetar med putsfasader, träfasader och tegelfasader. Vi anpassar metod och material efter fasadens typ och skick.",
      },
      {
        q: "Behövs ROT-avdrag för fasadmålning?",
        a: "Ja, fasadarbeten berättigar till ROT-avdrag. 30% av arbetskostnaden dras direkt på fakturan.",
      },
    ],
    relaterade: ["taklaggning", "totalentreprenad"],
  },
  {
    slug: "badrumsrenovering",
    kategori: "tjanst",
    title: "Badrumsrenovering",
    h1: "Badrumsrenovering i Stockholm",
    intro:
      "Vi utför kompletta badrumsrenoveringar, från rivning till inflyttningsklart.",
    text:
      "Sands Entreprenad erbjuder badrumsrenoveringar med samma noggrannhet och kvalitet som våra takprojekt. Vi hanterar hela processen genom totalentreprenad, ett kontrakt, ett fast pris.\n\nOavsett om det gäller ett komplett badrumsbytte med nytt tätskikt, kakel och porslin eller en uppfräschning av ett befintligt badrum kan vi hjälpa dig. Vi samarbetar med certifierade VVS-montörer och elektriker.",
    prisIntervall: "Pris efter takkontroll",
    prism2: "Kontakta oss",
    ingår: [
      "Kostnadsfri takkontroll och bedömning",
      "Rivning av befintligt badrum",
      "Nytt tätskikt (våtrumscertifierat)",
      "Kakel och klinker",
      "Nytt porslin och blandare",
      "El- och VVS-arbete",
      "Takkontroll",
    ],
    faq: [
      {
        q: "Hur lång tid tar en badrumsrenovering?",
        a: "En komplett badrumsrenovering tar vanligtvis 3–5 veckor beroende på storlek och omfattning.",
      },
      {
        q: "Ingår ROT-avdrag?",
        a: "Ja, badrumsrenoveringar berättigar till ROT-avdrag. 30% av arbetskostnaden dras direkt på fakturan.",
      },
      {
        q: "Är arbetet våtrumscertifierat?",
        a: "Ja, vi arbetar med certifierade hantverkare och följer Byggkeramikrådets branschregler för våtrum.",
      },
    ],
    relaterade: ["koksrenovering", "totalentreprenad"],
  },
  {
    slug: "koksrenovering",
    kategori: "tjanst",
    title: "Köksrenovering",
    h1: "Köksrenovering i Stockholm",
    intro:
      "Komplett köksrenovering med fast pris, från stomme till inflyttningsklart.",
    text:
      "Vi erbjuder kompletta köksrenoveringar i hela Stockholms län. Oavsett om du vill byta hela köket eller renovera det befintliga tar vi hand om hela processen, rivning, el, VVS, montering av köksluckor, bänkskivor och vitvaror.\n\nPrecis som med våra takprojekt arbetar vi genom totalentreprenad med fast pris. Du får en kontaktperson genom hela projektet och slipper samordna olika hantverkare.",
    prisIntervall: "Pris efter takkontroll",
    prism2: "Kontakta oss",
    ingår: [
      "Kostnadsfri takkontroll och planering",
      "Rivning av befintligt kök",
      "El- och VVS-arbete",
      "Montering av nytt kök",
      "Bänkskivor, stänkskydd och detaljer",
      "Vitvaruinstallation",
      "Takkontroll",
    ],
    faq: [
      {
        q: "Hur lång tid tar en köksrenovering?",
        a: "En komplett köksrenovering tar vanligtvis 3–6 veckor beroende på kökets storlek och vilka ändringar som görs.",
      },
      {
        q: "Kan ni hjälpa med att välja kök?",
        a: "Vi kan ge råd om layout och material, men vi rekommenderar att du väljer köksstomme och luckor från en köksåterförsäljare, vi sköter sedan montering och anslutning.",
      },
      {
        q: "Ingår ROT-avdrag?",
        a: "Ja, köksrenoveringar berättigar till ROT-avdrag på arbetskostnaden.",
      },
    ],
    relaterade: ["badrumsrenovering", "totalentreprenad"],
  },
];

tjanster.forEach((t) => {
  if (!t.image) t.image = bildKarta[t.slug];
});

export function getTjanst(slug: string): Tjanst | undefined {
  return tjanster.find((t) => t.slug === slug);
}
