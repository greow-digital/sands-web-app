import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import LatestProjekt from "@/components/LatestProjekt";
import TaktestCta from "@/components/TaktestCta";
import HeroCtaTracker from "@/components/HeroCtaTracker";
import LeadForm from "@/components/LeadForm";
import {
  Etikett,
  Fragor,
  Garantiband,
  Omdomen,
  Priskort,
  Rubrik2,
  Stjarnor,
  Tidslinje,
} from "@/components/Byggblock";
import { AVG_RATING, TOTAL_REVIEWS, startsidaTestimonials } from "@/lib/testimonials";
import { company, stats } from "@/lib/company";
import { FLAGGSKEPP_KVM, MATERIAL } from "@/lib/material";

const kr = (n: number) => n.toLocaleString("sv-SE");

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
    rubrik: "Hembesök",
    text: "Vi bokar ett kostnadsfritt hembesök där din personliga projektledare inspekterar taket och går igenom dina behov.",
  },
  {
    rubrik: "Offert",
    text: "Du får en detaljerad offert med fast pris enligt totalentreprenad (ABT-06). Allt i ett kontrakt, inga dolda avgifter.",
  },
  {
    rubrik: "Utförande",
    text: "Vårt erfarna team utför arbetet effektivt, säkert och noggrant med fokus på kvalitet i varje detalj.",
  },
  {
    rubrik: "Slutkontroll",
    text: "Vi avslutar med en noggrann takkontroll tillsammans med dig för att säkerställa att allt är i perfekt skick.",
  },
];

const takpaket = [
  "Upp till 30 års tätt tak-garanti genom Moniers taksystem",
  "Ny underlagspapp (Icopal Flexilight Prima)",
  "Ny strö- och bärläkt (25×48 mm)",
  "Nya takpannor från Monier",
  "Nytt regnvattensystem (hängrännor och stuprör)",
  "Ställning, container och bortforsling ingår",
  "Takkontroll tillsammans med dig",
  "Reservpannor (ca 8 st) lämnas kvar för framtida reparationer",
  "Läktsystem förberett för eventuella solpaneler",
  "Taket täcks med presseningar vid regn under byggtiden",
];

// Formuleringarna är hämtade från /tjanster/taklaggning så startsidan och
// tjänstesidan beskriver alternativen likadant.
const takalternativ = [
  {
    rubrik: "Komplett takbyte",
    text: "Hela taket rivs och ersätts: nya pannor eller plåt, ny underlagspapp, ny läkt.",
    passar:
      "Passar tak över 35 år, läckage på flera ställen, vittrade pannor.",
  },
  {
    rubrik: "Takomläggning",
    text: "Befintliga pannor lyfts av, nytt undertak monteras (papp och läkt), pannorna läggs tillbaka. Du sparar 25 till 35 procent mot komplett takbyte och får ett tak som håller 25 till 30 år till.",
    passar:
      "Passar när pannorna är hela men underlagspappen är 25 år eller äldre.",
  },
  {
    rubrik: "Riktad reparation",
    text: "Punktinsats på det som faktiskt är trasigt. Vid kostnadsfri takkontroll rekommenderar vi det alternativ som löser problemet.",
    passar: "Du betalar bara för det du behöver.",
  },
];

// Fem konverteringsinvändningar, inte en kunskapsbank. De 20 frågor som
// låg här genererade noll organiska klick och dubblerade /faq och
// tjänstesidorna, som äger respektive fråga. FAQPage-schemat ligger
// medvetet bara där, så sidorna inte konkurrerar om samma rich result.
const startsidaFaq = [
  {
    q: "Vad kostar ett takbyte i Stockholm?",
    a: `Betongtak från ca ${kr(MATERIAL.betong.prisM2)} kr/m², tegeltak från ca ${kr(MATERIAL.tegel.prisM2)} kr/m², plåttak från ca ${kr(MATERIAL.plat.prisM2)} kr/m², alla priser efter ROT-avdrag. Vi ger alltid fast pris efter kostnadsfri takkontroll.`,
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
    q: "Vad är Sands Entreprenads garantitid?",
    a: "Sands Entreprenad lämnar 15 års hantverksgaranti på utfört arbete. När vi lägger ett komplett Monier-taksystem tillkommer Moniers Tätt tak-garanti i upp till 30 år. Garantibeviset är registrerat digitalt och kan alltid tas fram med ditt offertnummer.",
  },
  {
    q: "Hur lång tid tar ett takbyte?",
    a: "För en normalvilla på 120–160 m² tar ett komplett takbyte vanligtvis 1–2 veckor, beroende på väder och takets skick.",
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
        {/*
          Lägre min-höjd än tidigare, så innehållet styr heron i stället för
          att centreras i en box som är högre än det. Med 820 px låg
          innehållet 18 px från mitten och luften mellan menyn och
          säsongspillret blev 114 px. Nu styr paddingen ensam.
        */}
        <section className="relative overflow-hidden min-h-[560px] lg:min-h-[640px] flex items-center bg-[#07090D]">
          {/*
            Stillbild i stället för video sedan 16 sep. Videon laddade 4,4 MB
            efter page load på desktop utan att tillföra något mätbart, och
            hoppades ändå över helt på mobil, som är 77 procent av den
            betalda trafiken.
          */}
          {/*
            Samma behandling som annonslandningssidan (19 okt 2026): mörk
            botten, bilden nedtonad och lätt oskarp, en blå glöd i hörnet.
            Det röda tegeltaket med skorstenen hamnade annars rakt bakom
            rubriken på mobil, och den blå accenten syntes dåligt mot rött.
            Bilden är 61 KB i stället för 275 KB, vilket också hjälper LCP.
          */}
          <Image
            src="/images/hero-start.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 70% at 85% 0%, rgba(43,116,252,0.35) 0%, rgba(7,9,13,0) 55%), linear-gradient(180deg, rgba(7,9,13,0.55) 0%, rgba(7,9,13,0.85) 70%, #07090D 100%)",
            }}
          />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:py-14 w-full">
            {/* På mobil: titel → betyg → prisrad → form → badges. På desktop:
                2-kol-grid med formuläret till höger. Formuläret låg här fram
                till 5 juni och togs bort för att mäta hero-flöde mot
                /offert-flöde. Det är tillbaka eftersom 96 procent av den
                betalda trafiken aldrig nådde /offert. */}
            <div className="grid lg:grid-cols-[1.1fr_400px] gap-6 lg:gap-x-14 lg:gap-y-6 items-start">
            <div className="text-white max-w-3xl lg:col-start-1 lg:row-start-1">
              <h1
                className="text-[34px] sm:text-[52px] lg:text-[66px] font-extrabold leading-[1.05] tracking-[-0.035em] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Din takläggare i Stockholm, med fast pris och{" "}
                {/* Ljusblå toning mot mörk botten, samma som landningssidan.
                    Den läses tydligt, till skillnad från varumärkesblått mot
                    det röda taket som låg under kontrastkravet. */}
                <span className="bg-gradient-to-r from-[#7AA9FF] to-[#2B74FC] bg-clip-text text-transparent">
                  30 års garanti
                </span>
              </h1>
              {/* Betyget under H1 och säsongspillret borttaget (19 okt 2026).
                  På mobil låg formulärets första fält 857 px ner mot en
                  synlig yta på ca 664 px. Rubriken ska läsas först, betyget
                  bekräftar den. */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
                {/* Samlat betyg från alla tre plattformarna, som på
                    landningssidan, i stället för bara BraByggare. */}
                <div className="flex items-center gap-1.5">
                  <Stjarnor />
                  <span className="font-semibold">{AVG_RATING}</span>
                  <span className="text-gray-300">· {TOTAL_REVIEWS} omdömen</span>
                </div>
                {/* Raden bryts på mobil, och då blev pricken hängande sist. */}
                <span className="hidden sm:inline text-gray-400">·</span>
                <span className="font-medium">
                  {stats.tak} utförda tak sedan {company.grundades}
                </span>
              </div>

              {/* En rad i stället för brödtext plus prisrad, som tog sex
                  rader på mobil. Priset ligger kvar ovanför vikningen: broad
                  match på "takläggare" drar in ett tjugotal prisvarianter,
                  och SEO.md kräver pris i heron. Takbyte och takomläggning
                  bär synonymerna som brödtexten hade. */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl">
                Takbyte och takomläggning{" "}
                <span className="font-bold text-white">
                  från {MATERIAL.betong.prisM2.toLocaleString("sv-SE")} kr/m² efter ROT.
                </span>{" "}
                Fast pris efter kostnadsfri takkontroll.
              </p>

              {/* Ingen CTA-knapp här: formuläret till höger ÄR handlingen,
                  och två uppmaningar bredvid varandra delar bara
                  uppmärksamheten. Utan knappen kommer stats och badges upp,
                  och på mobil hamnar formuläret högre. */}
            </div>

            {/* data-hero-anchor: mobilbaren i botten tar över när det här
                blocket skrollat ur bild. Tidigare satt ankaret på
                CTA-knappen som nu är borttagen. */}
            <div
              className="lg:pt-16 lg:col-start-2 lg:row-start-1 lg:row-span-2"
              data-hero-anchor
            >
              <LeadForm
                variant="hero"
                formId="home_hero"
                fields="minimal"
                contact="phone-or-email"
                showMessage
                ctaText="Få mitt prisförslag"
                hideHeader="mobile"
              />
            </div>
            </div>

            {/* Badges under grinden, så formuläret kommer före dem på mobil.
                StatsRow låg här tidigare men upprepade sig själv: 2 500+ tak
                står redan i trust-raden ovanför H1, och 30 år står i både
                H1 och garantibadgen. */}
            <div className="text-white max-w-3xl mt-8 lg:mt-0 lg:col-start-1 lg:row-start-2">
              <TrustBadgesRow />
            </div>
          </div>
        </section>

        {/* ── BEVISBAND ──────────────────────────────
            Den som sökt "takläggare" väljer firma, inte taktyp. Beviset för
            att vi går att lita på låg tidigare på plats 8 av 15. Alla sex
            omdömen i en svepbar rad på mobil, som på landningssidan. */}
        <Omdomen
          urval={startsidaTestimonials}
          rubrik="Därför väljer villaägare oss som takläggare"
          lank
          bred
        />

        {/* ── SENASTE PROJEKT (dynamisk fr Sanity) ────── */}
        <LatestProjekt />

        {/* ── TAKTYPER ───────────────────────────── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <Rubrik2>Taktyper vi jobbar med</Rubrik2>
            </div>

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
                    className="text-xl lg:text-[22px] font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {t.title}
                  </h4>
                  <p className="text-[15px] text-gray-500 leading-relaxed">{t.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TAKBYTE, OMLÄGGNING ELLER REPARATION ──
            Ordet "takomläggning" fanns tidigare bara i en FAQ-rubrik på
            startsidan trots att det är ett av tre kärnbegrepp. Copyn är
            hämtad från /tjanster/taklaggning, inte nyskriven, så sidorna
            säger samma sak. */}
        <section className="py-20 lg:py-28 bg-white border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <Rubrik2>Takbyte, takomläggning eller reparation?</Rubrik2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {takalternativ.map((a) => (
                <div
                  key={a.rubrik}
                  className="rounded-2xl border border-gray-100 p-6 lg:p-7"
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {a.rubrik}
                  </h3>
                  <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                    {a.text}
                  </p>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {a.passar}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8">
              <Link
                href="/tjanster/taklaggning"
                className="inline-flex items-center gap-1.5 text-base font-semibold text-[#2B74FC] hover:gap-2.5 transition-all"
              >
                Läs mer om takomläggning och takbyte <ArrowRight size={16} />
              </Link>
            </p>
          </div>
        </section>

        {/* ── PRISSEKTION ──────────────────────────────
            Samma priskort som landningssidan (19 okt 2026). Siffrorna kommer
            från lib/material.ts, så de följer med vid nästa prisjustering.
            Trust-punkterna som låg här står nu i kortets fotnot och i
            garantibandet under. */}
        <section className="py-16 lg:py-28 bg-white border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Priskort
              rubrik={<Rubrik2>Vad kostar det att byta tak?</Rubrik2>}
              cta={
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/offert"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-[15px] transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Boka kostnadsfri takkontroll <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/priser#offertflode"
                    className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
                  >
                    Räkna på ditt eget tak <ArrowRight size={14} />
                  </Link>
                </div>
              }
              ingarRubrik="Detta ingår i takpaketet"
              ingar={takpaket}
              tvaKolumner={false}
              tillagg={
                <div className="space-y-3 text-sm text-gray-500 leading-relaxed border-t border-gray-200 pt-6 mt-7">
                  <p>
                    <strong className="text-gray-700">Om prisexemplet:</strong>{" "}
                    Baseras på standardtak (sadeltak) {FLAGGSKEPP_KVM} m² utan större
                    genomföringar. Slutpriset varierar beroende på materialval
                    och takets förutsättningar.
                  </p>
                  <p>
                    <strong className="text-gray-700">ROT-avdrag:</strong>{" "}
                    30% av arbetskostnaden dras direkt på fakturan. Vi sköter
                    all administration.
                  </p>
                  <p>
                    <strong className="text-gray-700">Betalning:</strong>{" "}
                    Vi fakturerar 100% när arbetet är klart och godkänt.
                    Ingen förskottsbetalning. Betalningstid 10 dagar.
                  </p>
                </div>
              }
            />
          </div>
        </section>

        {/* ── GARANTI ─────────────────────────────────
            Ersätter Monier-stycket i prisrutans fotnot. */}
        <Garantiband bred className="pb-16 lg:pb-28 bg-white" />

        {/* ── VÅR PROCESS ────────────────────────── */}
        <section
          className="py-16 lg:py-28"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Bilden är liggande på mobil, så stegen kommer upp snabbare.
                  Stående 4:5 tog en hel skärm innan första steget syntes. */}
              <div className="relative aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gray-200">
                <Image
                  src="/images/process-takomlaggning-bromma.jpg"
                  alt="Nylagt tegeltak på villa i Bromma, sett från ovan med Sands Entreprenads ställningsbanderoll på fasaden"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Höger, steg som tidslinje (samma som landningssidan) */}
              <div>
                <Etikett>Hur vi jobbar</Etikett>
                <div className="mb-9">
                  <Rubrik2>Så jobbar din takläggare, steg för steg</Rubrik2>
                </div>
                <Tidslinje steg={process} />
              </div>
            </div>
          </div>
        </section>

        {/* ── LÄCKAGE / SKADOR ──────────────────── */}
        <section
          className="py-20 lg:py-28 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bilden till höger på desktop: sektionen ovanför har bild till
                vänster, och två likadana uppställningar i rad blev statiskt.
                order-klasser i stället för omkastad DOM, så mobil behåller
                bild före text. */}
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 lg:order-2">
                <Image
                  src="/images/bromma-tak-fore.jpg"
                  alt="Slitet tegeltak med urblekta och skadade pannor, sett ovanifrån"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:order-1">
                <div className="mb-6">
                  <Rubrik2>Läcker taket? Fuktskador, ruttna läkt eller trasiga pannor?</Rubrik2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-5">
                  Ett läckande tak kan snabbt leda till mögel, röta och dyra
                  följdskador på konstruktionen. Ju längre du väntar, desto
                  dyrare blir det. Vi erbjuder kostnadsfri takkontroll i hela
                  Stockholms län, ofta samma vecka.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-9">
                  Våra takläggare inspekterar taket på plats, identifierar
                  problemet och ger
                  dig ett fast pris på åtgärd. Totalentreprenad enligt ABT 06,
                  du slipper samordna och får ett enda kontrakt.
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/offert"
                    className="inline-flex items-center gap-2 px-9 py-[18px] rounded-full text-white font-semibold text-base transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Boka kostnadsfri takkontroll <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/taktest"
                    className="inline-flex items-center gap-1.5 text-base font-semibold text-[#2B74FC] hover:underline"
                  >
                    Osäker? Gör taktestet först <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MID-PAGE CTA ──────────────────── */}
        <section className="py-20 lg:py-24 border-t border-gray-100 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Rubrik2>Redo att få ditt prisförslag?</Rubrik2>
            </div>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Kostnadsfri takkontroll, fast pris efter besiktning.
              Svar inom 24 timmar.
            </p>
            {/* Formulär i stället för länk: den som skrollat hit ska slippa
                ett sidbyte för att agera. */}
            <div className="max-w-md mx-auto text-left">
              <LeadForm
                variant="section"
                formId="home_section"
                fields="minimal"
                contact="phone-or-email"
                showMessage
                hideHeader
                ctaText="Få mitt prisförslag"
              />
            </div>
          </div>
        </section>

        {/* ── OMRÅDEN ────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Etikett>Stockholms län</Etikett>
                <Rubrik2>Takläggare i hela Stockholms län</Rubrik2>
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
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-[15px] font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                  style={{ color: "var(--color-dark)" }}
                >
                  {o.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-gray-100 bg-[#F8F9FB] p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3
                  className="text-xl lg:text-2xl font-extrabold mb-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Hur väljer du Stockholms bästa takläggare?
                </h3>
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  7 kriterier att gå igenom, 5 saker att vara extra noga med och 10 frågor som är bra att ställa innan du skriver kontrakt.
                </p>
              </div>
              <Link
                href="/basta-taklaggare-stockholm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-base shrink-0 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Läs köpguiden <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ "HAR DU ETERNITTAK?" ───────────── */}
        <section className="py-20 lg:py-28 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Etikett>Vanliga frågor</Etikett>
              <Rubrik2>Vanliga frågor om takomläggning</Rubrik2>
            </div>

            {/* Inget FAQPage-schema här. Samma frågor har schema på /faq och
                på tjänstesidorna, och flera sidor med samma schema
                konkurrerar om samma rich result. LocalBusiness-schemat i
                layouten är orört. */}

            {/* Kort som på landningssidan, men öppna: SEO.md kräver att
                svaren syns utan klick på indexerade sidor. */}
            <Fragor fragor={startsidaFaq} oppen />

            <div className="text-center mt-12">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-9 py-[18px] rounded-full font-semibold text-white text-base transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── TAKTEST-CTA ──────────────────────────── */}
        <TaktestCta />

        {/* ── BOTTOM CTA ────────────────────── */}
        <section
          className="py-24 lg:py-32 border-t border-gray-100 text-center"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Etikett>Sista steget</Etikett>
            <div className="mb-5">
              <Rubrik2>Boka kostnadsfri takkontroll</Rubrik2>
            </div>
            <p className="text-lg text-gray-600 mb-9 leading-relaxed">
              Vi inspekterar taket på plats och lämnar ett komplett fast
              pris inom 24 timmar. Helt utan förpliktelser.
            </p>
            <div className="max-w-md mx-auto text-left">
              <LeadForm
                variant="section"
                formId="home_section"
                fields="minimal"
                contact="phone-or-email"
                showMessage
                hideHeader
                ctaText="Få mitt prisförslag"
                notBindingNote
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
