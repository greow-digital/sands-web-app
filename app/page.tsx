import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import ReviewCarousel from "@/components/ReviewCarousel";
import SeasonBanner from "@/components/SeasonBanner";

// ──────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────

const taktyper = [
  {
    title: "Betongtak – lägga om tak med betongpannor",
    slug: "betongtak",
    text: "Robust och prisvärt med lång livslängd.",
    image: "/images/taktyp-betongtak.jpg",
  },
  {
    title: "Tegeltak – pris och omläggning",
    slug: "tegeltak",
    text: "Klassiskt naturmaterial som håller i generationer.",
    image: "/images/taktyp-tegeltak.jpg",
  },
  {
    title: "Plåttak – kostnad för att byta",
    slug: "plattak",
    text: "Modernt och lättviktigt med minimalt underhåll.",
    image: "/images/taktyp-plattak.jpg",
  },
  {
    title: "Papptak – pris per m²",
    slug: "papptak",
    text: "Prisvärt alternativ för platta konstruktioner.",
    image: "/images/taktyp-papptak.jpg",
  },
  {
    title: "Eternittak – byta eternittak tryggt och säkert",
    slug: "eternittak",
    text: "Certifierad sanering och nytt tak i ett kontrakt.",
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
    text: "Du får en detaljerad offert med fast pris enligt totalentreprenad (ABT-06). Allt i ett kontrakt — inga dolda avgifter.",
  },
  {
    num: "03",
    title: "Utförande",
    text: "Vårt erfarna team utför arbetet effektivt, säkert och noggrant med fokus på kvalitet i varje detalj.",
  },
  {
    num: "04",
    title: "Besiktning",
    text: "Vi avslutar med en noggrann takkontroll tillsammans med dig för att säkerställa att allt är i perfekt skick.",
  },
];

const eternitFaq = [
  {
    q: "Jag vill lägga ett nytt tak men det innehåller eternit?",
    a: "Eternit innehåller asbest och kräver certifierad sanering innan nytt tak kan läggas. Vi tar hand om hela processen — från rivning och asbestsanering till nytt tak med upp till 30 års Monier-garanti. Du behöver bara göra en kontakt, vi sköter resten.",
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
    a: "Totalentreprenad innebär att vi tar hela ansvaret för ditt projekt — från takkontroll till färdigt tak. Allt regleras i ett enda kontrakt med fast pris enligt ABT-06.",
  },
  {
    q: "Vad kostar ett takbyte i Stockholm?",
    a: "Betongtak från ca 1 200 kr/m², tegeltak från ca 1 500 kr/m², plåttak från ca 1 800 kr/m² — alla priser efter ROT-avdrag. Vi ger alltid fast pris efter kostnadsfri takkontroll.",
  },
  {
    q: "Hur lång tid tar ett takbyte?",
    a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
  },
  {
    q: "Kan jag använda ROT-avdrag?",
    a: "Ja. ROT-avdraget innebär att du får tillbaka 30% av arbetskostnaden direkt på fakturan. Vi hanterar ansökan åt dig.",
  },
  {
    q: "Vad innebär Monier Tätt tak-garanti?",
    a: "Med ett komplett Monier-taksystem omfattas ditt tak av Tätt tak-garanti i upp till 30 år — hela taksystemets funktion och täthet garanteras.",
  },
  {
    q: "Vad kostar det att lägga om tak?",
    a: "Att lägga om taket kostar från ca 1 200 kr/m² efter ROT-avdrag, beroende på material och takets förutsättningar. Boka en kostnadsfri takkontroll så ger vi dig ett fast pris.",
  },
  {
    q: "Vad kostar det att byta tak?",
    a: "Ett komplett takbyte kostar från ca 1 200 kr/m² efter ROT-avdrag. Priset varierar beroende på material — tegel, betong, plåt eller papp. Vi ger alltid fast pris efter kostnadsfri takkontroll.",
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
    a: "Ja, du får tillbaka 30 % av arbetskostnaden som ROT-avdrag — direkt på fakturan. Vi hanterar ansökan åt dig. Maxbeloppet är 50 000 kr per person och år.",
  },
  {
    q: "Mitt tak läcker – vad gör jag?",
    a: "Kontakta oss för en kostnadsfri takkontroll. Vi inspekterar taket, identifierar orsaken till läckaget och ger dig ett fast pris på åtgärd — ofta samma dag.",
  },
  {
    q: "Hur vet jag om taket behöver bytas?",
    a: "Vanliga tecken är läckage, spruckna eller förskjutna pannor, fukt på vinden och rost på plåtdetaljer. Är taket över 25–40 år gammalt rekommenderar vi en kostnadsfri takkontroll.",
  },
];

// ──────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center">
          {/* Bakgrundsbild */}
          <Image
            src="/images/hero-house.jpg"
            alt="Villa med nytt tak i Stockholm"
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
              {/* Left — copy */}
              <div className="text-white">
                <SeasonBanner />
                <h1
                  className="text-[32px] sm:text-[40px] lg:text-[50px] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Takbyte i Stockholm –<br />
                  {"fast pris när du ska "}
                  <span style={{ color: "var(--color-primary)" }}>
                    lägga om taket
                  </span>
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed max-w-xl mb-10">
                  Byta tak, lägga om tak eller lägga nytt tak? Vi tar
                  helhetsansvar för takbyte i hela Stockholms län –
                  totalentreprenad enligt ABT 06 med 30 års garanti.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mb-10">
                  {[
                    { num: "500+", label: "Nöjda kunder" },
                    { num: "2 500+", label: "Takläggningar" },
                    { num: "30 år", label: "Monier garanti" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        className="text-[34px] sm:text-[42px] lg:text-[52px] font-extrabold leading-none tracking-[-0.03em] mb-2 text-white"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {s.num}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* BraByggare */}
                  <div className="flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 shadow-lg">
                    <Image
                      src="/images/brabyggare-badge.svg"
                      alt="BraByggare 4.8 av 5 — 54 omdömen"
                      width={217}
                      height={85}
                      className="h-9 w-auto"
                    />
                  </div>
                  {/* Kundfavorit 2025 */}
                  <div className="flex items-center gap-2.5 bg-white rounded-full px-3 py-1.5 shadow-lg">
                    <Image
                      src="/images/kundfavorit-2025.png"
                      alt="Offerta Kundfavorit 2025"
                      width={200}
                      height={200}
                      className="h-10 w-auto"
                    />
                    <span
                      className="text-xs font-bold pr-2 leading-tight"
                      style={{ color: "var(--color-dark)" }}
                    >
                      Kundfavorit<br />2025
                    </span>
                  </div>
                  {/* Monier Tätt tak */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-lg">
                    <Image
                      src="/images/monier-tatt-tak.jpg"
                      alt="Monier Tätt tak-garanti"
                      width={100}
                      height={140}
                      className="h-10 w-auto rounded-sm"
                    />
                    <span
                      className="text-xs font-bold pr-2 leading-tight"
                      style={{ color: "var(--color-dark)" }}
                    >
                      Upp till 30 års<br />garanti
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — formulär */}
              <div>
                <LeadForm variant="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* ── PRISSEKTION ──────────────────────────── */}
        <section className="py-14 lg:py-20 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Vad kostar det att byta tak?
            </h2>

            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              <div className="p-6 rounded-2xl border border-gray-100">
                <div
                  className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Takläggning (komplett takbyte)
                </div>
                <div
                  className="text-2xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  från 1 200 kr/m²
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-gray-100">
                <div
                  className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Takkontroll
                </div>
                <div
                  className="text-2xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  0 kr (kostnadsfri)
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-gray-100">
                <div
                  className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Byte av eternittak
                </div>
                <div
                  className="text-2xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  från 1 200 kr/m²
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-8">
              <span>· Fast pris efter kostnadsfri takkontroll</span>
              <span>· ROT-avdrag möjligt på arbetskostnad</span>
              <span>· 30 års garanti</span>
            </div>

            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Boka kostnadsfri takkontroll <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── RUBRIK OVANFÖR TAKTYPER ─────────────── */}
        <section className="pt-8 pb-6 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Takbyte Stockholm
            </p>
            <h2
              className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Fast pris & 30 års garanti
            </h2>
          </div>
        </section>

        {/* ── TAKTYPER ───────────────────────────── */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-10"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Taktyper vi jobbar med
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
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

        {/* ── REVIEWS KARUSELL ─────────────────── */}
        <ReviewCarousel />

        {/* ── FÖRE / EFTER ─────────────────────── */}
        <section
          className="py-16 lg:py-24"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Resultat
                </p>
                <h2
                  className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Före & efter
                </h2>
              </div>
              <Link
                href="/projekt"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                Se alla projekt <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {[
                {
                  src: "/images/ba-vitthus.jpg",
                  alt: "Vitt hus — före och efter takbyte",
                  ort: "Vaxholm",
                },
                {
                  src: "/images/ba-gulthus.jpg",
                  alt: "Gult hus — före och efter takbyte",
                  ort: "Lidingö",
                },
                {
                  src: "/images/ba-rotthus.jpg",
                  alt: "Rött hus — före och efter takbyte",
                  ort: "Norrtälje",
                },
              ].map((img) => (
                <div key={img.src} className="group">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {/* Före / efter labels */}
                    <div className="absolute bottom-0 inset-x-0 flex">
                      <div className="flex-1 py-2 text-center text-xs font-bold text-white bg-black/50 backdrop-blur-sm">
                        FÖRE
                      </div>
                      <div
                        className="flex-1 py-2 text-center text-xs font-bold text-white backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(43,116,252,0.7)" }}
                      >
                        EFTER
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mt-3" style={{ color: "var(--color-dark)" }}>
                    Takbyte i {img.ort}
                  </p>
                </div>
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

              {/* Höger — steg */}
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
                { name: "Täby", slug: "taby" },
                { name: "Nacka", slug: "nacka" },
                { name: "Järfälla", slug: "jarfalla" },
                { name: "Huddinge", slug: "huddinge" },
                { name: "Sollentuna", slug: "sollentuna" },
                { name: "Danderyd", slug: "danderyd" },
                { name: "Bromma", slug: "bromma" },
                { name: "Tyresö", slug: "tyreso" },
                { name: "Solna", slug: "solna" },
                { name: "Sundbyberg", slug: "sundbyberg" },
                { name: "Lidingö", slug: "lidingo" },
                { name: "Ekerö", slug: "ekero" },
                { name: "Haninge", slug: "haninge" },
                { name: "Botkyrka", slug: "botkyrka" },
                { name: "Vallentuna", slug: "vallentuna" },
                { name: "Norrtälje", slug: "norrtälje" },
                { name: "Södertälje", slug: "sodertalje" },
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
      </main>
      <Footer />
    </>
  );
}
