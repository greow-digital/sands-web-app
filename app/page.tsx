import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsRow from "@/components/StatsRow";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import ReviewCarousel from "@/components/ReviewCarousel";
import SeasonBanner from "@/components/SeasonBanner";
// import InstagramFeed from "@/components/InstagramFeed"; // avstangd, se nedan
import LatestProjekt from "@/components/LatestProjekt";
import HeroVideo from "@/components/HeroVideo";
import HeroCtaTracker from "@/components/HeroCtaTracker";

// ──────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────

const taktyper = [
  {
    title: "Betongtak",
    slug: "betongtak",
    text: "Robust och prisvärt med lång livslängd.",
    image: "/images/taktyp-betongtak.jpg",
  },
  {
    title: "Tegeltak",
    slug: "tegeltak",
    text: "Klassiskt naturmaterial som håller i generationer.",
    image: "/images/taktyp-tegeltak.jpg",
  },
  {
    title: "Plåttak",
    slug: "plattak",
    text: "Modernt och lättviktigt med minimalt underhåll.",
    image: "/images/taktyp-plattak.jpg",
  },
  {
    title: "Papptak",
    slug: "papptak",
    text: "Prisvärt alternativ för platta konstruktioner.",
    image: "/images/taktyp-papptak.jpg",
  },
];

const process = [
  {
    num: "01",
    title: "Hembesök",
    text: "Vi bokar ett kostnadsfritt hembesök där din personliga projektledare inspekterar taket och går igenom dina behov.",
  },
  {
    num: "02",
    title: "Offert",
    text: "Du får en detaljerad offert med fast pris enligt totalentreprenad (ABT-06). Allt i ett kontrakt, inga dolda avgifter.",
  },
  {
    num: "03",
    title: "Utförande",
    text: "Vårt erfarna team utför arbetet effektivt, säkert och noggrant med fokus på kvalitet i varje detalj.",
  },
  {
    num: "04",
    title: "Slutkontroll",
    text: "Vi avslutar med en noggrann takkontroll tillsammans med dig för att säkerställa att allt är i perfekt skick.",
  },
];

const eternitFaq = [
  {
    q: "Jag vill lägga ett nytt tak men det innehåller eternit?",
    a: "Eternit innehåller asbest och kräver certifierad sanering innan nytt tak kan läggas. Vi tar hand om hela processen, från rivning och asbestsanering till nytt tak med upp till 30 års Monier-garanti. Du behöver bara göra en kontakt, vi sköter resten.",
  },
  {
    q: "Vilka certifikat har Sands Entreprenad?",
    a: "Vi är certifierad Monier Takpartner, har F-skattsedel, är fullförsäkrade med ansvars- och allriskförsäkring, och all personal är certifierad inom de moment vi utför.",
  },
  {
    q: "Erbjuder ni kostnadsfri takkontroll?",
    a: "Ja. Vi bokar ett kostnadsfritt hembesök där vi inspekterar taket och lämnar ett fast pris utan förbindelser.",
  },
  {
    q: "Vad innebär totalentreprenad enligt ABT-06?",
    a: "Totalentreprenad innebär att vi tar hela ansvaret för ditt projekt, från takkontroll till färdigt tak. Allt regleras i ett enda kontrakt med fast pris enligt ABT-06.",
  },
  {
    q: "Vad kostar ett takbyte i Stockholm?",
    a: "Betongtak från ca 1 200 kr/m², tegeltak från ca 1 500 kr/m², plåttak från ca 1 800 kr/m², alla priser efter ROT-avdrag. Vi ger alltid fast pris efter kostnadsfri takkontroll.",
  },
  {
    q: "Hur lång tid tar ett takbyte?",
    a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
  },
  {
    q: "Kan jag använda ROT-avdrag?",
    a: "Ja. ROT-avdraget innebär att du får tillbaka 30 % av arbetskostnaden direkt på fakturan, max 50 000 kr per person och år (kombinerat med RUT max 75 000 kr). Endast arbetskostnaden ger avdrag, inte material. Vi sköter ansökan åt dig.",
  },
  {
    q: "Behöver jag bygglov för takbyte?",
    a: "För en- och tvåfamiljshus krävs inte längre bygglov för takbyte sedan 1 december 2025, även om du byter taktyp eller färg. För flerbostadshus eller kulturhistoriskt skyddade byggnader kan bygglov fortfarande krävas. Vi kontrollerar alltid innan vi börjar.",
  },
  {
    q: "Vad innebär Monier Tätt tak-garanti?",
    a: "Med ett komplett Monier-taksystem omfattas ditt tak av Tätt tak-garanti i upp till 30 år, hela taksystemets funktion och täthet garanteras.",
  },
  {
    q: "Vad kostar det att lägga om tak?",
    a: "Att lägga om taket kostar från ca 1 200 kr/m² efter ROT-avdrag, beroende på material och takets förutsättningar. Boka en kostnadsfri takkontroll så ger vi dig ett fast pris.",
  },
  {
    q: "Vad kostar det att byta tak?",
    a: "Ett komplett takbyte kostar från ca 1 200 kr/m² efter ROT-avdrag. Priset varierar beroende på material, tegel, betong, plåt eller papp. Vi ger alltid fast pris efter kostnadsfri takkontroll.",
  },
  {
    q: "Vad kostar takbyte per kvadratmeter?",
    a: "Betongtak från ca 1 200 kr/m², tegeltak från ca 1 500 kr/m², plåttak från ca 1 800 kr/m² och papptak från ca 800 kr/m². Alla priser efter ROT-avdrag och baseras på kostnadsfri takkontroll.",
  },
  {
    q: "Hur mycket kostar det att byta takpannor?",
    a: "Att byta takpannor kostar från ca 1 200 kr/m² efter ROT-avdrag vid komplett omläggning. Enstaka pannor kan bytas till lägre kostnad. Boka en kostnadsfri takkontroll för exakt pris.",
  },
  {
    q: "Vad kostar det att byta plåttak?",
    a: "Plåttak kostar från ca 1 800 kr/m² efter ROT-avdrag. Bandtäckt och dubbelfalsat plåt ger lång livslängd med minimalt underhåll. Vi ger fast pris efter kostnadsfri takkontroll.",
  },
  {
    q: "Kan man få ROT-avdrag på takbyte?",
    a: "Ja, du får tillbaka 30 % av arbetskostnaden som ROT-avdrag, direkt på fakturan. Vi hanterar ansökan åt dig. Maxbeloppet är 50 000 kr per person och år.",
  },
  {
    q: "Mitt tak läcker, vad gör jag?",
    a: "Kontakta oss för en kostnadsfri takkontroll. Vi inspekterar taket, identifierar orsaken till läckaget och ger dig ett fast pris på åtgärd, ofta samma dag.",
  },
  {
    q: "Hur vet jag om taket behöver bytas?",
    a: "Vanliga tecken är läckage, spruckna eller förskjutna pannor, fukt på vinden och rost på plåtdetaljer. Är taket över 25–40 år gammalt rekommenderar vi en kostnadsfri takkontroll.",
  },
];

// ──────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────

export default async function Home() {
  return (
    <>
      <Header />
      <HeroCtaTracker />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center">
          {/* Bakgrund: bild som LCP + video som tonas in efter page load */}
          <HeroVideo
            posterSrc="/images/hero-house.jpg"
            videoSrc="/videos/hero.mp4"
            alt="Takbyte i Stockholm, villa med nytt tak"
          />
          {/* Gradient overlay: 70% mörk vänster → 20% höger */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,6,7,0.82) 0%, rgba(6,6,7,0.70) 25%, rgba(6,6,7,0.45) 55%, rgba(6,6,7,0.20) 100%)",
            }}
          />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            {/* På mobil: titel → form → stats → badges (form högre upp för CRO).
                På desktop: 2-kol-grid med form höger som spänner båda raderna. */}
            <div className="text-white max-w-3xl">
              <SeasonBanner />

              {/* Trust-rad ovanfor H1: stjarnor + recensions-snippet */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold">4,8</span>
                  <span className="text-gray-300">BraByggare</span>
                </div>
                <span className="text-gray-400">·</span>
                <span className="font-medium">
                  2 500+ utförda tak sedan 2016
                </span>
              </div>

              <h1
                className="text-[32px] sm:text-[40px] lg:text-[50px] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Din takläggare i Stockholm, med fast pris och{" "}
                <span style={{ color: "var(--color-primary)" }}>
                  30 års garanti
                </span>
              </h1>
              <p className="text-lg text-gray-200 leading-relaxed max-w-xl mb-8">
                Auktoriserad takläggare i Stockholm. Takbyte, takomläggning
                och renovering med transparent prissättning, ROT-avdrag
                direkt på fakturan och svar samma vardag.
              </p>

              {/* CTA + ring-lank */}
              <div className="flex flex-wrap items-center gap-5 mb-12 lg:mb-16">
                <Link
                  href="/offert"
                  data-hero-cta
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Boka kostnadsfri takkontroll <ArrowRight size={16} />
                </Link>
                <span className="text-sm text-gray-300">
                  Eller ring{" "}
                  <a
                    href="tel:08283888"
                    className="font-bold underline underline-offset-4 text-white hover:text-[#2B74FC]"
                  >
                    08-28 38 88
                  </a>
                </span>
              </div>

              <StatsRow theme="light" className="mb-8" />
              <TrustBadgesRow />
            </div>
          </div>
        </section>

        {/* ── OMRÅDESBEKRÄFTELSE ────────────────── */}
        <section className="py-6 border-b border-gray-100 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-700">
                Vi servar hela Stockholms län:
              </span>
              {[
                { name: "Stockholm", slug: "stockholm" },
                { name: "Nacka", slug: "nacka" },
                { name: "Täby", slug: "taby" },
                { name: "Järfälla", slug: "jarfalla" },
                { name: "Bromma", slug: "bromma" },
                { name: "Huddinge", slug: "huddinge" },
                { name: "Lidingö", slug: "lidingo" },
                { name: "Sollentuna", slug: "sollentuna" },
                { name: "Norrtälje", slug: "norrtalje" },
              ].map((o) => (
                <Link
                  key={o.slug}
                  href={`/omraden/${o.slug}`}
                  className="inline-flex px-2.5 py-1 rounded-full border border-gray-200 hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors text-xs font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  {o.name}
                </Link>
              ))}
              <Link
                href="/omraden"
                className="inline-flex items-center gap-1 ml-1 text-xs font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                + 22 områden <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── TAKTYPER ───────────────────────────── */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-10"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Taktyper vi jobbar med
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {taktyper.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tjanster/${t.slug}`}
                  className="group block"
                >
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-5 bg-gray-100">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      sizes="(max-width: 640px) 45vw, 22vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h4
                    className="text-lg font-bold mb-1.5"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {t.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── VÅR PROCESS ────────────────────────── */}
        <section
          className="py-16 lg:py-28"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Vänster bild */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-200">
                <Image
                  src="/images/hero-sands-construction.jpg"
                  alt="Sands Entreprenad takläggare i arbete"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Höger, steg */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Hur vi jobbar
                </p>
                <h2
                  className="text-[32px] lg:text-[48px] font-extrabold tracking-[-0.03em] mb-10"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vår Process
                </h2>

                <div className="space-y-8">
                  {process.map((p) => (
                    <div
                      key={p.num}
                      className="flex gap-5 pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
                    >
                      <div
                        className="text-3xl font-extrabold shrink-0 w-12"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {p.num}
                      </div>
                      <div>
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-dark)",
                          }}
                        >
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {p.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRISSEKTION ──────────────────────────── */}
        <section className="py-14 lg:py-20 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
              {/* Vänster, pris + trust */}
              <div>
                <h2
                  className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad kostar det att byta tak?
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
                  Exempelpris · sadeltak 140 m²
                </p>

                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className="text-[44px] lg:text-[56px] font-extrabold tracking-[-0.03em]"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    från 169 000 kr
                  </span>
                  <span className="text-lg text-gray-400 font-bold">*</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Från ca 1 200 kr/m²
                </p>
                <p className="text-xs text-gray-400 mb-8">
                  *Efter ROT-avdrag på 30%
                </p>

                {/* Trust-punkter */}
                <ul className="space-y-2 text-sm text-gray-700 mb-8">
                  {[
                    "Fast pris efter kostnadsfri takkontroll",
                    "ROT-avdrag 30% på arbetskostnad",
                    "Upp till 30 års Monier-garanti",
                    "Kostnadsfri takkontroll: 0 kr",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span style={{ color: "var(--color-primary)" }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/offert"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Boka kostnadsfri takkontroll <ArrowRight size={14} />
                </Link>
              </div>

              {/* Höger, vad ingår + detaljer */}
              <div className="rounded-2xl border border-gray-100 bg-[#F8F9FB] p-6 lg:p-8">
                <h3
                  className="text-lg font-bold mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Detta ingår i takpaketet:
                </h3>
                <ul className="space-y-2.5 mb-6">
                  {[
                    "Upp till 30 års tätt tak-garanti genom Moniers taksystem",
                    "Ny underlagspapp (Icopal Flexilight Prima)",
                    "Ny strö- och bärläkt (25×48 mm)",
                    "Nya takpannor från Monier",
                    "Nytt regnvattensystem (hängrännor och stuprör)",
                    "Ställning, container och bortforsling ingår",
                    "Takkontroll tillsammans med dig",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <span
                        className="text-base leading-none mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-200 pt-5">
                  <p>
                    <strong className="text-gray-700">Om prisexemplet:</strong>{" "}
                    Baseras på standardtak (sadeltak) 140 m² utan större
                    genomföringar. Slutpriset varierar beroende på materialval
                    och takets förutsättningar.
                  </p>
                  <p>
                    <strong className="text-gray-700">Monier-garanti:</strong>{" "}
                    Med komplett Monier-taksystem omfattas taket av Tätt
                    tak-garanti i upp till 30 år, funktion och täthet
                    garanteras.
                  </p>
                  <p>
                    <strong className="text-gray-700">ROT-avdrag:</strong>{" "}
                    30% av arbetskostnaden dras direkt på fakturan. Vi sköter
                    all administration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── REVIEWS KARUSELL ─────────────────── */}
        <ReviewCarousel />

        {/* ── SENASTE PROJEKT (dynamisk fr Sanity) ────── */}
        <LatestProjekt />

        {/* ── MID-PAGE CTA ──────────────────── */}
        <section className="py-14 lg:py-16 border-t border-gray-100 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em] mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Redo att få ditt prisförslag?
            </h2>
            <p className="text-gray-600 mb-7 text-sm">
              Kostnadsfri takkontroll, fast pris efter besiktning.
              Svarar samma vardag.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få prisförslag <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── INSTAGRAM ──────────────────────────────
            Avstangd: IG-bilderna holler for lag kvalitet och drar ner
            intrycket. Komponenten finns kvar i components/InstagramFeed.tsx
            (lazy-laddad via IntersectionObserver) sa den ar latt att sla
            pa igen genom att avkommentera nedan. */}
        {/* <InstagramFeed /> */}

        {/* ── OMRÅDEN ────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Stockholms län
                </p>
                <h2
                  className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Områden vi jobbar i
                </h2>
              </div>
              <Link
                href="/omraden"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                Alla områden <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { name: "Stockholm", slug: "stockholm" },
                { name: "Bromma", slug: "bromma" },
                { name: "Täby", slug: "taby" },
                { name: "Sollentuna", slug: "sollentuna" },
                { name: "Danderyd", slug: "danderyd" },
                { name: "Lidingö", slug: "lidingo" },
                { name: "Vallentuna", slug: "vallentuna" },
                { name: "Vaxholm", slug: "vaxholm" },
                { name: "Värmdö", slug: "varmdo" },
                { name: "Österåker", slug: "osteraker" },
                { name: "Upplands Väsby", slug: "upplands-vasby" },
                { name: "Upplands-Bro", slug: "upplands-bro" },
                { name: "Sigtuna", slug: "sigtuna" },
                { name: "Nacka", slug: "nacka" },
                { name: "Huddinge", slug: "huddinge" },
                { name: "Tyresö", slug: "tyreso" },
                { name: "Haninge", slug: "haninge" },
                { name: "Botkyrka", slug: "botkyrka" },
                { name: "Nynäshamn", slug: "nynashamn" },
                { name: "Salem", slug: "salem" },
                { name: "Järfälla", slug: "jarfalla" },
                { name: "Solna", slug: "solna" },
                { name: "Sundbyberg", slug: "sundbyberg" },
                { name: "Ekerö", slug: "ekero" },
                { name: "Norrtälje", slug: "norrtalje" },
                { name: "Södertälje", slug: "sodertalje" },
                { name: "Nykvarn", slug: "nykvarn" },
              ].map((o) => (
                <Link
                  key={o.slug}
                  href={`/omraden/${o.slug}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                  style={{ color: "var(--color-dark)" }}
                >
                  {o.name}
                </Link>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gray-100 bg-[#F8F9FB] p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3
                  className="text-lg lg:text-xl font-extrabold mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Hur väljer du Stockholms bästa takläggare?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  7 kriterier att gå igenom, 5 saker att vara extra noga med och 10 frågor som är bra att ställa innan du skriver kontrakt.
                </p>
              </div>
              <Link
                href="/basta-taklaggare-stockholm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shrink-0 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Läs köpguiden <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── LÄCKAGE / SKADOR ──────────────────── */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  src="/images/hero-house.jpg"
                  alt="Tak som behöver åtgärdas"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h2
                  className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Läcker taket? Fuktskador, ruttna läkt eller trasiga pannor?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ett läckande tak kan snabbt leda till mögel, röta och dyra
                  följdskador på konstruktionen. Ju längre du väntar, desto
                  dyrare blir det. Vi erbjuder kostnadsfri takkontroll i hela
                  Stockholms län, ofta samma vecka.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Vi inspekterar taket på plats, identifierar problemet och ger
                  dig ett fast pris på åtgärd. Totalentreprenad enligt ABT 06,
                  du slipper samordna och får ett enda kontrakt.
                </p>
                <Link
                  href="/offert"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Boka kostnadsfri takkontroll <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ "HAR DU ETERNITTAK?" ───────────── */}
        <section className="py-16 lg:py-24 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vanliga frågor om takomläggning
              </h2>
            </div>

            {/* JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: eternitFaq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />

            <div className="divide-y divide-gray-200">
              {eternitFaq.map((f) => (
                <div key={f.q} className="py-6">
                  <h3
                    className="text-base lg:text-lg font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ────────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100 text-center"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Sista steget
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Boka kostnadsfri takkontroll
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Vi inspekterar taket på plats och lämnar ett komplett fast
              pris inom 24 timmar. Helt utan förpliktelser.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få prisförslag <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
