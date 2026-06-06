import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Award,
  FileText,
  HardHat,
  ScrollText,
  Phone,
  Info,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { omraden } from "@/lib/omraden";
import { client } from "@/sanity/lib/client";
import {
  PROJEKT_COUNT_QUERY,
  REFERENS_PROJEKT_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektReferens } from "@/sanity/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/basta-taklaggare-stockholm" },
  title:
    "Stockholms bästa takläggare: så vet du att du valt rätt | Sands",
  description:
    "Hur väljer du Stockholms bästa takläggare? Checklista med F-skatt, försäkring, garantitid och certifieringar. 4,8 av 5 på BraByggare, 30 års Monier-garanti, fast pris.",
  openGraph: {
    title: "Stockholms bästa takläggare: så vet du att du valt rätt",
    description:
      "Komplett guide för att välja rätt takläggare i Stockholm med checklista, recensioner och referensprojekt från Sands Entreprenad.",
  },
};

// ──────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────

const stats = [
  { value: "4,8★", label: "Snittbetyg BraByggare" },
  { value: "54+", label: "Verifierade omdömen" },
  { value: "30 år", label: "Tätt tak-garanti (Monier)" },
  { value: "27+", label: "Kommuner i Stockholms län" },
];

const kriterier = [
  {
    icon: FileText,
    titel: "1. F-skatt och korrekt företagsstatus",
    text: "Kontrollera alltid att takläggaren har F-skattsedel hos Skatteverket, registrerat momsnummer och är godkänd för F-skatt på allabolag.se. En seriös takfirma har redovisat resultat i flera år och tar inte betalt svart. Företag utan F-skatt får inte ge dig ROT-avdrag.",
    sands: "Sands Entreprenad Stockholm AB har F-skatt, är registrerad för moms och redovisar offentlig årsredovisning. Vi sköter ROT-ansökan åt dig direkt på fakturan.",
  },
  {
    icon: Shield,
    titel: "2. Ansvarsförsäkring och allriskförsäkring",
    text: "Ett takbyte är ett känsligt moment där hela huset står utan tätskikt under flera dygn. Om det börjar regna kraftigt och vatten tar sig in: vem betalar för fuktskadade golv, möbler eller elektronik? En takläggare utan rätt försäkring kan inte ersätta dig om något går fel.",
    sands: "Vi har fullvärdig ansvarsförsäkring och allriskförsäkring som täcker både arbetsskador och egendomsskador hos dig som kund.",
  },
  {
    icon: Award,
    titel: "3. Garantitid och taksystemsgaranti",
    text: "Branschstandard i Sverige är 10 år enligt konsumenttjänstlagen, men på ett komplett taksystem kan du få upp till 30 år. Skillnaden är att en systemgaranti omfattar både material och funktion, inte bara enskilda komponenter. Be alltid om en specifik garantihandling, inte bara muntliga löften.",
    sands: "Som certifierad Monier Takpartner kan vi erbjuda Monier Tätt tak-garanti på upp till 30 år på hela taksystemet. Du får alltid ett skriftligt garantibevis när arbetet är slutbesiktigat.",
  },
  {
    icon: ScrollText,
    titel: "4. Certifieringar och leverantörspartnerskap",
    text: "Auktorisationer som Monier Takpartner, BraByggare och medlemskap i Plåt & Ventföretagen visar att företaget granskats av en oberoende part. Certifieringar förnyas årligen och kräver att firman lever upp till specifika krav på kvalitet, utbildning och ekonomi.",
    sands: "Vi är certifierad Monier Takpartner, verifierad partner på BraByggare och har Offerta Kundfavorit-utmärkelse 2025. Alla våra takläggare är utbildade och har giltiga ID06-kort.",
  },
  {
    icon: FileText,
    titel: "5. Fast pris i kontrakt, inte löpande räkning",
    text: "Den enskilt största risken vid takbyte är att priset glider. Be alltid om fast pris efter besiktning, dokumenterat i ett skriftligt entreprenadkontrakt enligt ABT-06 eller motsvarande. Ett seriöst företag har inga problem att binda priset, då vet de att de kalkylerat rätt.",
    sands: "Vi lämnar alltid fast pris efter kostnadsfri takkontroll. Allt regleras i ett ABT-06-kontrakt: omfattning, betalningsplan, garantier och tidplan. Det vi offererat är det du betalar.",
  },
  {
    icon: Star,
    titel: "6. Verifierbara referenser och recensioner",
    text: "En takläggare som varit verksam i 5+ år ska kunna visa minst 20-30 verifierade omdömen på externa plattformar som BraByggare, Offerta, Trustpilot eller Google. Skepsis är befogad om en firma bara visar utvalda citat på sin egen hemsida. Du vill se snittbetyget av alla, inte bara de bästa.",
    sands: "Vi har 4,8★ i snitt på BraByggare med 54+ verifierade omdömen, ytterligare omdömen på Offerta och Google. Du kan ringa upp tidigare kunder. Fråga oss om referenser i ditt område.",
  },
  {
    icon: HardHat,
    titel: "7. Taksäkerhet och arbetsmiljöansvar",
    text: "Arbete på tak räknas som högrisk och kräver ställning, fallskydd och dokumenterad arbetsmiljöplan. En firma som hoppar över ställning för att 'spara pengar åt dig' bryter mot Arbetsmiljöverkets föreskrifter och riskerar både sina anställdas liv och din försäkring om något händer.",
    sands: "All vår produktion arbetar enligt AFS 2014:26: ställning monteras av certifierad ställningsbyggare, BAS-U och BAS-P utses skriftligen och takets befintliga taksäkerhet uppdateras alltid till nuvarande krav (snörasskydd, fästöglor, gångbryggor).",
  },
];

const inbyggdaRecensioner = [
  {
    text: "Riktigt bra att ha och göra med. Snabba, noggranna och gjort ett riktigt bra jobb som takbyte. Supernöjd och till ett bra pris dessutom. Kan starkt rekommendera.",
    namn: "Henrik",
    plats: "Tyresö",
    typ: "Takläggning 170 kvm",
    kalla: "BraByggare",
  },
  {
    text: "Väldigt professionellt och effektivt genomförande. Väldigt bra och detaljerad offert som också stämde exakt med slutfakturan. Rekommenderas varmt!",
    namn: "Pauli",
    plats: "Solna",
    typ: "Tegeltak 150 kvm",
    kalla: "Offerta",
  },
  {
    text: "Helt fantastiskt jobb! Nytt tegeltak på vårt 40-talshus. Grannarna har redan frågat efter kontaktuppgifter. Seriöst företag med hög kvalitet.",
    namn: "Lena",
    plats: "Danderyd",
    typ: "Tegeltak",
    kalla: "Offerta",
  },
  {
    text: "Mycket nöjd med hela processen från start till slut. Sands var alltid tillgängliga för frågor och höll tidplanen. Resultatet blev fantastiskt, taket ser helt nytt ut.",
    namn: "Maria",
    plats: "Nacka",
    typ: "Betongtak 140 kvm",
    kalla: "Offerta",
  },
  {
    text: "Anlitade Sands för eternitsanering och nytt tak. De skötte hela processen smidigt och professionellt. Mycket tryggt att de hanterar allt i ett kontrakt.",
    namn: "Sofie",
    plats: "Lidingö",
    typ: "Eternitbyte",
    kalla: "Offerta",
  },
];

const fragor = [
  {
    q: "Hur väljer jag Stockholms bästa takläggare?",
    a: "Det finns sju kriterier som är värda att gå igenom: F-skatt och redovisad ekonomi, ansvarsförsäkring som täcker dig som kund, dokumenterad garantitid (gärna 25–30 år via taksystemsgaranti), externa certifieringar (Monier Takpartner, BraByggare), fast pris i skriftligt kontrakt enligt ABT-06, verifierbara omdömen på externa portaler, samt korrekt taksäkerhet enligt AFS 2014:26. Om flera av punkterna känns oklara är det rimligt att ställa följdfrågor eller jämföra med fler offerter.",
  },
  {
    q: "Vad kostar Stockholms bästa takläggare?",
    a: "Pris och kvalitet följs inte alltid åt, men billigast är nästan aldrig bäst. Marknadspris för ett komplett takbyte i Stockholm 2026 ligger på 1 200–1 800 kr/m² efter ROT-avdrag beroende på material (betong är billigast, plåt och tegel dyrare). Misstänk företag som offererar väsentligt under marknadspris, ofta saknas något i specifikationen (ny underlagspapp, byte av läkt, taksäkerhet eller nytt regnvattensystem).",
  },
  {
    q: "Hur många takläggare ska jag jämföra?",
    a: "Tre till fyra offerter är optimalt. Med fler än fyra blir det svårt att jämföra likvärdigt. Säkerställ att alla räknar på samma specifikation: samma material, samma omfattning, samma garanti. Det är när offerterna är jämförbara du kan se vem som faktiskt är bäst.",
  },
  {
    q: "Vad är skillnaden mellan en bra och en dålig takläggare?",
    a: "En bra takläggare ger fast pris efter fysisk besiktning på plats, lämnar skriftligt entreprenadkontrakt, har försäkring och certifieringar du kan verifiera, och kan visa minst 20 referensobjekt. En dålig takläggare ger pris över telefon utan besiktning, vill skriva avtal på en lapp eller via SMS, och har inga externa omdömen.",
  },
  {
    q: "Vad ska finnas med i en seriös takoffert?",
    a: "En komplett takoffert ska innehålla: specifikation av material (fabrikat och modell), uppmätt takyta i kvm, omfattning av rivningsarbete, byte av underlagspapp, byte av läkt, taksäkerhet, regnvattensystem, ställning, container och bortforsling. Den ska också ange totalpris före och efter ROT, betalningsplan, garantitid, sluttidpunkt och försäkringsskydd.",
  },
  {
    q: "Hur lång garanti kan jag förvänta mig?",
    a: "Enligt konsumenttjänstlagen gäller 10 års reklamationsrätt. Men på ett komplett Monier-taksystem som installeras av certifierad Monier Takpartner kan du få upp till 30 års Tätt tak-garanti. Garantin omfattar både material och funktion, och täcker hela taksystemet, inte bara enskilda pannor.",
  },
  {
    q: "Hur lång tid tar ett takbyte i Stockholm?",
    a: "För en normalvilla på 120–160 kvm tar ett komplett takbyte 1–2 veckor inklusive ställning och takkontroll. Vid eternitsanering tillkommer 2–3 dagar för saneringen som utförs av certifierad partner. Vintertid (november–februari) kan tidplanen påverkas av väder och kortare arbetsdagar.",
  },
  {
    q: "Vad ska jag fråga takläggaren innan jag skriver kontrakt?",
    a: "Tio kritiska frågor: (1) Har ni F-skatt och allabolag-historik? (2) Vilken ansvarsförsäkring har ni? (3) Vilken garantitid får jag och på vad? (4) Är ni certifierade Monier-takpartner? (5) Får jag fast pris i ABT-06-kontrakt? (6) Kan ni visa minst tre referensobjekt i mitt område? (7) Hur hanterar ni eventuell asbest? (8) Vem är BAS-U och BAS-P för projektet? (9) Hur fungerar ROT-avdraget? (10) Vad händer om vädret förstör arbetet?",
  },
];

// ──────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────

export default async function BastaTaklaggareStockholm() {
  const [projektCount, referensProjekt] = await Promise.all([
    client.fetch(PROJEKT_COUNT_QUERY).then((n) => (n as number) ?? 0),
    client.fetch(REFERENS_PROJEKT_QUERY) as Promise<ProjektReferens[]>,
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fragor.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": "https://www.sandsab.se/#organization",
    name: "Sands Entreprenad Stockholm AB",
    url: "https://www.sandsab.se",
    telephone: "08-28 38 88",
    email: "info@sandsab.se",
    image: "https://www.sandsab.se/og-image.jpg",
    priceRange: "från 1 200 kr/m²",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Spjutvägen 5A",
      postalCode: "175 61",
      addressLocality: "Stockholm",
      addressRegion: "Stockholms län",
      addressCountry: "SE",
    },
    areaServed: { "@type": "State", name: "Stockholms län" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "54",
      bestRating: "5",
    },
    award: [
      "Certifierad Monier Takpartner",
      "BraByggare verifierad partner",
      "Offerta Kundfavorit 2025",
    ],
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />

        <PageHero
          eyebrow="Köpguide Stockholm 2026"
          title="Stockholms bästa takläggare:"
          titleAccent="så vet du att du valt rätt"
          description="Att välja takläggare är ett av de största enskilda inköp en villaägare gör. Här är de sju kriterier som skiljer ett seriöst takbyte från en kostsam felinvestering, plus hur du själv kan kontrollera varje punkt innan du skriver kontrakt."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Stockholms bästa takläggare" },
          ]}
          backgroundImage="/images/hero-house.jpg"
          imageAlt="Takläggning i Stockholm från Sands Entreprenad"
        />

        {/* ── STAT-CARDS ──────────────────────── */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-100 bg-[#F8F9FB] p-6 text-center"
                >
                  <div
                    className="text-3xl lg:text-4xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TL;DR / SNABBSVARET ──────────────── */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Snabbsvaret
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Vem är egentligen Stockholms bästa takläggare?
            </h2>
            <div className="space-y-5 text-gray-700 leading-relaxed text-[17px]">
              <p>
                Det finns inte ett enda &quot;bästa&quot;. Det finns rätt takläggare för ditt projekt. En firma som är fantastisk på plåtomläggning på en industribyggnad är inte nödvändigtvis bäst för dig som har en 40-talsvilla i Bromma med eternittak. Men vad alla &quot;bästa takläggare&quot; har gemensamt är att de uppfyller samma sju grundkriterier: dokumenterad ekonomi, rätt försäkringar, lång garantitid, externa certifieringar, fast pris i kontrakt, verifierbara omdömen och korrekt arbetsmiljöansvar.
              </p>
              <p>
                <strong>Sands Entreprenad Stockholm AB</strong> är certifierad Monier Takpartner med 4,8★ snittbetyg på BraByggare och 54+ verifierade omdömen. Vi har levererat 100+ kompletta takbyten i Stockholms län sedan starten, från innerstadens K-märkta hus till skärgårdens 50-talsvillor. På den här sidan visar vi hur vi mäter oss mot varje kriterium och hur du själv kan verifiera påståendena innan du tar beslut.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
              <a
                href="tel:0828388"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 font-semibold text-sm hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                style={{ color: "var(--color-dark)" }}
              >
                <Phone size={14} />
                08-28 38 88
              </a>
            </div>
          </div>
        </section>

        {/* ── 7 KRITERIER ──────────────────────── */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Köpguide
              </p>
              <h2
                className="text-[28px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                7 kriterier som är bra att gå igenom
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Ramverket nedan bygger på det branschorganisationer, Konsumentverket och försäkringsbolag brukar rekommendera villaägare att tänka igenom. Varje kriterium har en faktarad om vad det innebär, och en kort rad om hur vi på Sands arbetar med just den punkten.
              </p>
            </div>

            <div className="space-y-5">
              {kriterier.map((k) => {
                const Icon = k.icon;
                return (
                  <div
                    key={k.titel}
                    className="rounded-2xl border border-gray-100 bg-white p-7 lg:p-9"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: "rgba(43,116,252,0.08)",
                          color: "var(--color-primary)",
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-[19px] lg:text-[22px] font-extrabold mb-3"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-dark)",
                          }}
                        >
                          {k.titel}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {k.text}
                        </p>
                        <div className="rounded-xl bg-[#F8F9FB] border-l-4 border-[#2B74FC] p-4">
                          <p className="text-sm leading-relaxed">
                            <span
                              className="font-bold mr-1.5"
                              style={{ color: "var(--color-primary)" }}
                            >
                              Sands:
                            </span>
                            <span className="text-gray-700">{k.sands}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ATT VARA OBSERVANT PÅ ──────────── */}
        <section className="py-16 lg:py-20 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Att vara observant på
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              5 saker att vara extra noga med
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Det här är inte avgörande röda flaggor i sig, men de är värt att vara uppmärksam på och gärna ställa följdfrågor om innan du skriver kontrakt. Ofta finns det bra förklaringar, men ibland är det signaler om att du bör undersöka närmare.
            </p>
            <ul className="space-y-4">
              {[
                {
                  titel: "Fast pris utan att taket har besiktigats på plats",
                  text: "Be alltid om en fysisk besiktning innan ett fast pris lämnas. En siffra som ges direkt i ett samtal är i praktiken en uppskattning, antingen med säkerhetsmarginal uppåt eller med risk att justeras när arbetet startar.",
                },
                {
                  titel: "Höga krav på handpenning",
                  text: "Branschstandard är 10–20 % handpenning som blir aktuell när material beställs. Möts du av krav på betydligt mer i förskott, eller av kontantbetalning, är det rimligt att fråga om en alternativ betalningsplan och eventuellt jämföra med ett par andra offerter.",
                },
                {
                  titel: "Inget skriftligt entreprenadkontrakt",
                  text: "Ett skriftligt entreprenadkontrakt, till exempel enligt ABT-06, skyddar både dig och takläggaren och är en förutsättning för ROT-avdrag. Muntliga överenskommelser är svårare att luta sig mot om något skulle bli oklart längre fram.",
                },
                {
                  titel: "Begränsat med externa omdömen att luta sig mot",
                  text: "Utvalda citat på en firmas egen hemsida är ett bra komplement, men titta också på externa portaler som BraByggare, Offerta, Trustpilot och Google. Där ser du snittbetyget av alla omdömen och kan bilda dig en mer komplett uppfattning.",
                },
                {
                  titel: "Mycket kort startdatum",
                  text: "Seriösa takläggare i Stockholm har ofta 4–10 veckors framförhållning. Kan en firma börja redan imorgon kan det vara bra att fråga om de har kapacitet att slutföra arbetet på utlovad tid, eller om det finns risk att projektet pausas när nästa kund hör av sig.",
                },
              ].map((v, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 p-5"
                >
                  <Info
                    size={22}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <div>
                    <h3
                      className="text-base font-bold mb-1"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {v.titel}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── RECENSIONER ──────────────────────── */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Verifierade omdömen
              </p>
              <h2
                className="text-[28px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vad våra kunder säger på externa portaler
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-700">
                  4,8 / 5 på BraByggare
                </span>
                <span>· 54+ omdömen ·</span>
                <span>Offerta Kundfavorit 2025</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inbyggdaRecensioner.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col justify-between gap-5"
                >
                  <div>
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: "var(--color-dark)" }}
                    >
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {r.namn}, {r.plats}
                      </div>
                      <div className="text-xs text-gray-500">{r.typ}</div>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          r.kalla === "BraByggare" ? "#FFF1E1" : "#E1F5EB",
                        color:
                          r.kalla === "BraByggare" ? "#FF8000" : "#2B9E6E",
                      }}
                    >
                      {r.kalla}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/omdomen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                Se alla omdömen <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── REFERENSPROJEKT ──────────────────── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Referensprojekt
              </p>
              <h2
                className="text-[28px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Tre nyligen färdigställda projekt
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vi delar adress, omfattning och materialval på tre färdigställda takbyten i Stockholmsområdet. Vill du prata direkt med kunden? Ring oss så förmedlar vi referenskontakten.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {referensProjekt.map((p) => (
                <Link
                  key={p._id}
                  href={`/projekt/${p.slug}`}
                  className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#2B74FC] transition-colors"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {p.huvudbild?.asset && (
                      <Image
                        src={urlFor(p.huvudbild)
                          .width(800)
                          .height(600)
                          .fit("crop")
                          .url()}
                        alt={
                          p.huvudbild.alt ||
                          [p.title, p.typ, p.kvm && `${p.kvm} kvm`]
                            .filter(Boolean)
                            .join(", ")
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder={
                          p.huvudbild.asset.metadata?.lqip ? "blur" : "empty"
                        }
                        blurDataURL={
                          p.huvudbild.asset.metadata?.lqip ?? undefined
                        }
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      {p.typ && (
                        <span
                          className="font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "rgba(43,116,252,0.08)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {p.typ}
                        </span>
                      )}
                      {p.kvm && <span>{p.kvm} kvm</span>}
                      {p.ort && (
                        <>
                          <span>·</span>
                          <span>{p.ort}</span>
                        </>
                      )}
                    </div>
                    <h3
                      className="text-lg font-extrabold mb-2 group-hover:text-[#2B74FC] transition-colors"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      {p.title}
                    </h3>
                    {p.beskrivning && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                        {p.beskrivning}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-gray-500 group-hover:text-[#2B74FC] transition-colors">
                      Läs hela projektet <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/projekt"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                Se alla {projektCount} projekt <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── LOKALKÄNNEDOM ──────────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Stockholms takbestånd
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Varför lokalkännedom spelar roll i Stockholms län
            </h2>
            <div className="space-y-5 text-gray-700 leading-relaxed text-[17px]">
              <p>
                Stockholms län är inte en homogen marknad. En takläggare som arbetar mycket i innerstadens 1900-tals stenhus möter helt andra förutsättningar än någon som lägger om plåttak på 80-talsradhus i Tyresö. <strong>Lokalkännedom</strong> handlar inte bara om att &quot;veta var Bromma ligger&quot;. Det handlar om att förstå byggnadsåldrar, vanliga konstruktionsfel och vilka bygglovsregler som faktiskt tillämpas i respektive kommun.
              </p>
              <p>
                I <Link href="/omraden/bromma" className="text-[#2B74FC] font-semibold hover:underline">Bromma</Link> och <Link href="/omraden/lidingo" className="text-[#2B74FC] font-semibold hover:underline">Lidingö</Link> dominerar 1920–1950-talsvillor där underlagspappen ofta är original, vilket innebär att taket nästan alltid behöver totalrenovering snarare än bara byte av yttertaket. I <Link href="/omraden/taby" className="text-[#2B74FC] font-semibold hover:underline">Täby</Link>, <Link href="/omraden/sollentuna" className="text-[#2B74FC] font-semibold hover:underline">Sollentuna</Link> och <Link href="/omraden/danderyd" className="text-[#2B74FC] font-semibold hover:underline">Danderyd</Link> är 60–70-talsvillor med betongtakpannor vanligast, och pannorna närmar sig nu sin tekniska livslängd. I <Link href="/omraden/nacka" className="text-[#2B74FC] font-semibold hover:underline">Nacka</Link> och <Link href="/omraden/varmdo" className="text-[#2B74FC] font-semibold hover:underline">Värmdö</Link> är fritidshus som omvandlas till permanentbostäder en stor del av marknaden, vilket ofta kräver uppgradering till modern isolering och taksäkerhet samtidigt som taket byts.
              </p>
              <p>
                <strong>Eternittak</strong> är fortfarande mycket vanliga i 50- och 60-talsbestånd i hela länet, särskilt i ytterstaden, Nacka, Tyresö och delar av Lidingö. Eternit innehåller asbest och får bara hanteras av certifierade saneringsföretag.
              </p>
              <p>
                Vi har varit aktiva i Stockholms län sedan starten och hanterar ungefär 50/50 mellan innerstad och kranskommuner. Vår produktionsledning känner till bygglovshanteringen i flertalet kommuner och vet exempelvis att <strong>Lidingö kommun</strong> har striktare estetiska krav på K-märkta hus än många andra, eller att <strong>Norrtälje</strong> ofta kräver lokaltransportlösningar på grund av smala vägar och ölandskap.
              </p>
            </div>
          </div>
        </section>

        {/* ── FRÅGOR ──────────────────────────── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[28px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Frågor om att välja takläggare
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {fragor.map((f, i) => (
                <div key={i} className="py-7">
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                Fler frågor i vår FAQ <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── OMRÅDEN-CLOUD ───────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Områden vi är takläggare i
              </p>
              <h2
                className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vi tar takbyten i 27+ kommuner
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {omraden.map((o) => (
                <Link
                  key={o.slug}
                  href={`/omraden/${o.slug}`}
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                  style={{ color: "var(--color-dark)" }}
                >
                  {o.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Boka takkontroll
                </p>
                <h2
                  className="text-[28px] lg:text-[40px] font-extrabold tracking-[-0.03em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Redo att jämföra oss mot tre andra?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Vi rekommenderar att du tar in 3–4 offerter innan du väljer takläggare. Boka en kostnadsfri takkontroll så får du en fast offert med specificerat material, garantitid och betalningsplan, på samma underlag du kan jämföra med andra.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Kostnadsfri takkontroll på plats inom 1–2 veckor",
                    "Fast pris i ABT-06-kontrakt utan överraskningar",
                    "30 års Monier-garanti på komplett taksystem",
                    "Vi sköter ROT-avdraget åt dig",
                  ].map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:0828388"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 font-semibold text-sm hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                    style={{ color: "var(--color-dark)" }}
                  >
                    <Phone size={14} />
                    08-28 38 88
                  </a>
                </div>
              </div>

              <div>
                <LeadForm variant="section" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
