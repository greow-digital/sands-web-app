import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import FormPromise from "@/components/FormPromise";
import ReviewCarousel from "@/components/ReviewCarousel";
import OmradenInline from "@/components/OmradenInline";
import { prisEfterRot, FLAGGSKEPP_PRIS } from "@/lib/material";
import RelateradeProjekt from "@/components/RelateradeProjekt";
import TaktestInlineCta from "@/components/TaktestInlineCta";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import type { ProjektCard } from "@/sanity/lib/types";
import { pageMeta } from "@/lib/seo";
import {
  FAQ_BYGGLOV,
  FAQ_MATERIAL,
  FAQ_MONIER,
  FAQ_ROT,
  FAQ_SNORAS,
} from "@/lib/faq-snippets";
import SourcesFooter from "@/components/SourcesFooter";
import StatsRow from "@/components/StatsRow";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import Image from "next/image";

export const metadata: Metadata = pageMeta({
  path: "/tjanster/taklaggning",
  title:
    "Takläggning Stockholm | takbyte, takomläggning & renovering | Sands Entreprenad",
  description:
    "Erfaren takläggare i Stockholm. Takbyte, takomläggning och takrenovering med fast pris och 30 års Monier-garanti. Slipp bygglov sedan 1 dec 2025. Få prisförslag inom 24 h.",
});

// Pris-formel matchar Takräknaren (inkl 25 % moms, ROT-cap 50 000 kr).
// MaterialFactor: betong = 1.0, tegel ≈ 1.25, plåt ≈ 1.5 (baseline från
// "från X kr/m²"-priserna på startsidan).
function formatKr(n: number) {
  // Avrunda till närmaste tusental
  const rounded = Math.round(n / 1000) * 1000;
  return rounded.toLocaleString("sv-SE") + " kr";
}

// Sidan har en fokuserad introduktions-FAQ + de delade snippets för
// regler/garantier (FAQ_ROT, FAQ_BYGGLOV, FAQ_MONIER, FAQ_SNORAS).
const faqIntro = [
  {
    q: "Vad är skillnaden mellan takbyte, takomläggning och takrenovering?",
    a: "Takbyte innebär att hela taket rivs och ersätts med nytt material (pannor, papp, läkt). Takomläggning innebär att vi behåller befintliga pannor men byter underlagspapp och läkt, du sparar 30-40 % mot fullt byte om pannorna är hela. Takrenovering är riktade punktinsatser (laga läckage, byta enstaka pannor, nya hängrännor) utan att hela taket görs om.",
  },
  {
    q: "Hur vet jag vilket alternativ jag behöver?",
    a: "Boka kostnadsfri takkontroll så bedömer vi tillsammans. Som tumregel: tak under 30 år med hela pannor klarar omläggning, tak över 35 år eller med läckage på flera ställen behöver byte, isolerade problem klarar renovering.",
  },
  {
    q: "Hur länge tar ett takbyte?",
    a: "5-10 arbetsdagar för en normalstor villa, beroende på storlek, material och komplexitet. Omläggning tar oftast 4-7 dagar. Vi täcker alltid taket med presenningar varje kväll.",
  },
  {
    q: "Vilket material ska jag välja?",
    a: "Betongpannor är prisvärt och håller 40-60 år. Tegel ger klassiskt utseende och håller 50-100 år. Plåttak (bandtäckt) håller 40-70 år och har lägst underhåll. Papp/asfalt 20-30 år. Vi går igenom valet på besöket utifrån din villa.",
  },
  {
    q: "Vad ingår i det fasta priset?",
    a: "Rivning, bortforsling, ny underlagspapp, ströläkt och bärläkt, nya pannor eller plåt, hängrännor och stuprör, vindskivor, plåtdetaljer, ställning och container. Slutbesiktning ingår också. Inga dolda kostnader.",
  },
  {
    q: "Vad kan tillkomma i pris?",
    a: "Råspontbyte vid omfattande rötskador (vanligaste tillägget), eternitsanering om gammalt asbesttak finns, takkupor eller fönster utöver standard, samt extra ställning vid svår tillgänglighet. Allt kommuniceras innan arbete påbörjas.",
  },
  {
    q: "Behöver jag flytta saker eller bo någon annanstans?",
    a: "Nej. Dammbildning är minimal och du kan bo kvar hela tiden. Vi arbetar 07:00-17:00 vardagar. Eventuella känsliga föremål på vinden bör täckas över.",
  },
];

// Sammanslagen lista för JSON-LD + FAQ-rendering på sidan.
const faq = [
  ...faqIntro,
  ...FAQ_BYGGLOV,
  ...FAQ_ROT,
  ...FAQ_MONIER,
  ...FAQ_MATERIAL,
  ...FAQ_SNORAS,
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Takläggning",
  name: "Takbyte, takomläggning och takrenovering",
  provider: {
    "@type": "RoofingContractor",
    name: "Sands Entreprenad Stockholm AB",
    url: "https://www.sandsab.se",
    telephone: "+46-8-28-38-88",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "54",
      bestRating: "5",
    },
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "59.33",
      longitude: "18.07",
    },
    geoRadius: "70000",
  },
  description:
    "Komplett takbyte, takomläggning och takrenovering i Stockholms län. Fast pris, 30 års Monier-garanti, ROT-avdrag tillämpas.",
};

export default async function TaklaggningPage() {
  const allaProjekt = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];
  const tjanstProjekt = allaProjekt
    .filter((p) => {
      const t = (p.typ ?? "").toLowerCase();
      return (
        t.includes("takbyte") ||
        t.includes("takomlägg") ||
        t.includes("takläggning") ||
        t.includes("takrenov")
      );
    })
    .slice(0, 6);

  // Hero-bild per service-sektion. Tre distinkta villa-bilder från
  // /public/images så varje sektion får sin egen visuella anchor.
  // (Tidigare Sanity-baserad logik tenderade att landa på samma fallback
  // för flera sektioner när typ-fältet inte matchade tydligt.)
  const serviceImages = {
    takbyte: {
      src: "/images/about-sands-building.jpg",
      alt: "Hus med nytt tak, takbyte av Sands Entreprenad",
    },
    omlaggning: {
      src: "/images/villa-render.jpg",
      alt: "Villa med omlagt tak",
    },
    renovering: {
      src: "/images/hero-sands-construction.jpg",
      alt: "Takrenovering av Sands Entreprenad",
    },
  } as const;

  // Prismatris för jämförelsetabellen. Linjär modell från lib/material
  // (= /priser + kalkylatorn). Flaggskeppet (betong 140 m²) använder det
  // kanoniska 169 000 så exemplet matchar resten av sajten.
  const priser = {
    takbyte: {
      betong140: FLAGGSKEPP_PRIS,
      betong120: prisEfterRot("betong", 120),
      tegel140: prisEfterRot("tegel", 140),
      plat165: prisEfterRot("plat", 165),
    },
    omlaggning: {
      // Omläggning behåller pannor → ca 70 % av motsvarande takbyte
      betong140: FLAGGSKEPP_PRIS * 0.7,
      betong120: prisEfterRot("betong", 120) * 0.7,
      tegel140: prisEfterRot("tegel", 140) * 0.7,
      betong165: prisEfterRot("betong", 165) * 0.7,
    },
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        <PageHero
          eyebrow="Takläggning"
          title="Takbyte, takomläggning &"
          titleAccent="takrenovering"
          description="Komplett takbyte, omläggning av befintliga pannor eller riktade punktinsatser i Stockholm och hela länet. Fast pris efter kostnadsfri takkontroll, 30 års Monier-garanti, ROT-avdrag direkt på fakturan. Sedan 1 dec 2025 krävs inget bygglov för takbyte på villa."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Tjänster", href: "/tjanster" },
            { label: "Takläggning" },
          ]}
          backgroundImage="/images/hero-house.jpg"
          imageAlt="Villa i Stockholm med nylagt tak"
        />

        {/* ── STICKY JUMP-NAV ──────────────────── */}
        <nav
          className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur border-b border-gray-100"
          aria-label="Hoppa till sektion"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex gap-1 sm:gap-2 overflow-x-auto py-3 -mx-1 sm:mx-0 text-sm">
              {[
                { href: "#takbyte", label: "Takbyte" },
                { href: "#takomlaggning", label: "Takomläggning" },
                { href: "#takrenovering", label: "Takrenovering" },
                {
                  href: "/tjanster/takbesiktning",
                  label: "Takbesiktning",
                  external: true,
                },
                {
                  href: "/tjanster/taksakerhet",
                  label: "Taksäkerhet",
                  external: true,
                },
                { href: "#faq", label: "FAQ" },
              ].map((item) => (
                <li key={item.href} className="shrink-0">
                  <a
                    href={item.href}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-gray-600 hover:text-[#2B74FC] hover:bg-blue-50 transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── BYGGLOV-NYHET ────────────────────── */}
        <section
          className="py-8 border-b border-gray-100"
          style={{ backgroundColor: "rgba(43,116,252,0.06)" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-4">
            <span className="text-2xl shrink-0">🎉</span>
            <div>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "var(--color-dark)" }}
              >
                Slipp vänta på bygglov
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Sedan 1 december 2025 krävs inte längre bygglov för takbyte på
                en- och tvåfamiljshus, även om du byter taktyp eller färg. Det
                betyder att vi kan starta så snart materialet är på plats.{" "}
                <a
                  href="#faq"
                  className="font-semibold text-[#2B74FC] hover:underline"
                >
                  Läs villkoren →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── TAKTEST-CTA ─────────────────────── */}
        <section className="py-10 lg:py-14 border-b border-gray-100 bg-white">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
            <TaktestInlineCta />
          </div>
        </section>

        {/* ── STATS + BADGES STRIP ─────────────── */}
        <section className="py-10 lg:py-14 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            <StatsRow theme="dark" />
            <TrustBadgesRow />
          </div>
        </section>

        {/* ── BESLUTSHJÄLP ───────────────────────── */}
        <section className="py-16 lg:py-24 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vilken tjänst behöver jag?
              </p>
              <h2
                className="text-[28px] lg:text-[40px] font-extrabold tracking-[-0.03em] mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Tre vägar, en kontakt
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vid kostnadsfri takkontroll går vi igenom takets skick och
                rekommenderar det alternativ som faktiskt löser ditt problem.
                Du betalar bara för det du behöver.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {[
                {
                  anchor: "takbyte",
                  title: "Takbyte",
                  desc: "Hela taket rivs och ersätts: nya pannor eller plåt, ny underlagspapp, ny läkt. När det är dags",
                  when: "Tak över 35 år, läckage på flera ställen, vittrade pannor.",
                  from: formatKr(priser.takbyte.betong140),
                  fromLabel: "Från, 140 m² betong efter ROT",
                },
                {
                  anchor: "takomlaggning",
                  title: "Takomläggning",
                  desc: "Befintliga pannor lyfts av, nytt undertak monteras (papp + läkt), pannorna läggs tillbaka.",
                  when: "Tak under 30 år, pannor i bra skick men undertaket slutkört.",
                  from: formatKr(priser.omlaggning.betong140),
                  fromLabel: "Från, 140 m² betong efter ROT",
                },
                {
                  anchor: "takrenovering",
                  title: "Takrenovering",
                  desc: "Riktade punktinsatser: laga läckage, byta enstaka pannor, nya hängrännor, plåtdetaljer.",
                  when: "Isolerade problem, taket annars i bra skick, säljförberedelse.",
                  from: "Från ca 5 000 kr",
                  fromLabel: "Beror helt på arbetets omfattning",
                },
              ].map((opt) => (
                <a
                  key={opt.anchor}
                  href={`#${opt.anchor}`}
                  className="group block p-6 lg:p-7 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-all hover:shadow-[0_8px_30px_rgba(43,116,252,0.08)]"
                >
                  <h3
                    className="text-xl font-bold mb-3 group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {opt.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {opt.desc}
                  </p>
                  <p className="text-xs text-gray-500 mb-5">
                    <strong className="text-gray-700">Passar:</strong> {opt.when}
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p
                      className="text-lg font-extrabold tabular-nums"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {opt.from}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {opt.fromLabel}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 mt-5 text-sm font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Läs mer <ChevronRight size={14} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── VAD INGÅR ALLTID ─────────────────── */}
        <section className="py-12 lg:py-16 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Trygghet
                </p>
                <h2
                  className="text-[24px] lg:text-[30px] font-extrabold tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad ingår alltid i vårt fasta pris
                </h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  "Kostnadsfri takkontroll och uppmätning",
                  "Material i högsta kvalitetsklass (Monier-system)",
                  "Borttransport av gammalt material",
                  "Daglig presenningstäckning under arbetet",
                  "30 års Monier tätt-tak-garanti",
                  "ROT-avdrag direkt på fakturan (vi sköter ansökan)",
                  "Ansvars- och allriskförsäkring",
                  "F-skattsedel och ABT-06-kontrakt",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle
                      size={16}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-primary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── DETALJER: TAKBYTE ─────────────────── */}
        <section
          id="takbyte"
          className="py-16 lg:py-24 scroll-mt-20"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <div className="relative aspect-[5/2] rounded-2xl overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={serviceImages.takbyte.src}
                    alt={serviceImages.takbyte.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Komplett takbyte
                </p>
                <h2
                  className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Takbyte i Stockholm: fast pris, 30 års garanti
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Vi river hela det gamla taket, byter råspont där det behövs,
                  lägger ny underlagspapp och tar på en helt ny taktäckning i
                  betong, tegel, plåt eller papp. Som certifierad Monier
                  Takpartner sedan 2016 ingår upp till 30 års tätt-tak-garanti
                  vid komplett byte med Moniers taksystem.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Fast pris efter besiktning, inga tillägg under vägen. Sedan
                  1 december 2025 krävs inte längre bygglov för takbyte på en-
                  och tvåfamiljshus, även vid byte av taktyp. Hela arbetet
                  regleras i ett ABT-06-kontrakt. Vi arbetar i hela Stockholms
                  län, från innerstaden till{" "}
                  <Link
                    href="/omraden/norrtalje"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    takbyte i Norrtälje
                  </Link>{" "}
                  och Roslagen.
                </p>

                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Detta ingår i ett komplett takbyte
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Rivning och bortforsling av gammalt tak",
                    "Byte av råspont där det behövs",
                    "Ny underlagspapp (Icopal Flexilight Prima)",
                    "Bär- och ströläkt 25×48 mm",
                    "Nya pannor eller plåt, ditt materialval",
                    "Hängrännor och stuprör",
                    "Vindskivor, nockplåt, ventilationshuvor",
                    "Plåtdetaljer kring skorsten",
                    "Ställning, container och bortforsling",
                    "Slutbesiktning och dokumentation",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={15}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Prisexempel takbyte (efter ROT)
                </h3>
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          Storlek
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          Material
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                          Pris efter ROT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">120 m²</td>
                        <td className="px-4 py-3 text-gray-600">
                          Betongpannor
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.takbyte.betong120)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">140 m²</td>
                        <td className="px-4 py-3 text-gray-600">Tegelpannor</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.takbyte.tegel140)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">165 m²</td>
                        <td className="px-4 py-3 text-gray-600">
                          Plåttak (bandtäckt)
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.takbyte.plat165)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Uppskattningar för sadeltak utan större genomföringar.
                  Exakt pris efter kostnadsfri takkontroll.
                </p>
                <p className="text-sm mb-10">
                  <Link
                    href="/priser#takraknare"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    Räkna ut ditt pris i Takräknaren →
                  </Link>
                </p>

                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Hur länge håller olika takmaterial?
                </h3>
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          Material
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                          Förväntad livslängd
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ["Betongpannor", "40-60 år"],
                        ["Tegelpannor", "50-100 år"],
                        ["Plåttak (bandtäckt)", "40-70 år"],
                        ["Papp / asfalt", "20-30 år"],
                      ].map(([m, l]) => (
                        <tr key={m}>
                          <td className="px-4 py-3 text-gray-700">{m}</td>
                          <td className="px-4 py-3 text-gray-600 text-right tabular-nums">
                            {l}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Branschstandard. Faktisk livslängd beror på utförande, lutning
                  och underhåll.
                </p>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
                <div className="mt-4">
                  <FormPromise variant="checklist" />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── DETALJER: TAKOMLÄGGNING ───────────── */}
        <section
          id="takomlaggning"
          className="py-16 lg:py-24 border-t border-gray-100 scroll-mt-20"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[5/2] lg:aspect-[6/2] rounded-2xl overflow-hidden bg-gray-100 mb-8 max-w-3xl">
              <Image
                src={serviceImages.omlaggning.src}
                alt={serviceImages.omlaggning.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Takomläggning
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-5 max-w-2xl"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Behåll dina pannor, byt det som faktiskt är slut
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Är dina takpannor i bra skick men underlagspappen 25+ år gammal?
              Då räcker det med takomläggning. Vi lyfter av pannorna, byter
              underlagspapp och läkt, lägger tillbaka dina befintliga pannor och
              ersätter eventuella trasiga. Du sparar 25–35 % mot komplett
              takbyte och får ändå ett tak som håller 25–30 år till. 30 års
              Monier-garanti gäller vid omläggning med Moniers taksystem.
            </p>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Detta ingår i omläggningen
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Av- och pålyft av befintliga pannor",
                    "Ny underlagspapp (Icopal Flexilight Prima)",
                    "Ny ströläkt och bärläkt",
                    "Ersättning av enstaka trasiga pannor",
                    "Hängrännor och stuprör vid behov",
                    "Plåtdetaljer kring skorsten och genomföringar",
                    "Ställning och container",
                    "Slutbesiktning",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={15}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Prisexempel omläggning (efter ROT)
                </h3>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          Storlek
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          Material
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                          Pris
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">120 m²</td>
                        <td className="px-4 py-3 text-gray-600">Betong</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.omlaggning.betong120)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">140 m²</td>
                        <td className="px-4 py-3 text-gray-600">Tegel</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.omlaggning.tegel140)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">165 m²</td>
                        <td className="px-4 py-3 text-gray-600">Betong</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.omlaggning.betong165)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Uppskattning, 25–35 % under motsvarande komplett takbyte.
                  Pannskick avgör i slutändan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DETALJER: TAKRENOVERING ───────────── */}
        <section
          id="takrenovering"
          className="py-16 lg:py-24 border-t border-gray-100 scroll-mt-20"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[5/2] lg:aspect-[6/2] rounded-2xl overflow-hidden bg-gray-100 mb-8 max-w-3xl">
              <Image
                src={serviceImages.renovering.src}
                alt={serviceImages.renovering.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              Takrenovering
            </p>
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-5 max-w-2xl"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Punktinsatser för det som faktiskt är trasigt
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Inte hela taket behöver göras om. Ibland räcker det med riktade
              insatser, en lokal lagning vid läckage, byte av enstaka pannor,
              nya hängrännor eller plåtdetaljer. Vi gör en kostnadsfri
              takkontroll, ger fast pris på det som behövs och du betalar bara
              för det vi faktiskt utför.
            </p>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad takrenovering omfattar
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {[
                    "Lokala lagningar vid läckage",
                    "Byte av enstaka skadade pannor",
                    "Förstärkning av råspont vid svaga partier",
                    "Nya hängrännor och stuprör",
                    "Nya plåtdetaljer (vindskivor, nockplåt)",
                    "Byte av takfönster",
                    "Snörasskydd och takstegar",
                    "Skorstensrenovering (yttre)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle
                        size={15}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Prisexempel renovering
                </h3>
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ["Byte av 20 trasiga betongpannor", "ca 8 000 kr"],
                        ["Lokal lagning vid läckage", "5 000–15 000 kr"],
                        ["Nya hängrännor villa (45 lpm)", "25 000–40 000 kr"],
                        ["Snörasskydd-installation", "från 12 000 kr"],
                        [
                          "Byte av takfönster (standardstorlek)",
                          "från 18 000 kr",
                        ],
                      ].map(([what, price]) => (
                        <tr key={what}>
                          <td className="px-4 py-3 text-gray-700">{what}</td>
                          <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                            {price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Uppskattningar efter ROT. Slutpriset sätts efter takkontroll.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ANDRA TAKARBETEN (cards till dedikerade sidor) ── */}
        <section className="py-16 lg:py-20 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Andra tjänster
              </p>
              <h2
                className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vi tar hela taket, inte bara takpannorna
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
              {[
                {
                  href: "/tjanster/takbesiktning",
                  id: "takbesiktning",
                  title: "Takbesiktning",
                  desc: "Kostnadsfri inspektion av takets skick av certifierad takläggare. Vi går upp på taket, ger ärlig bedömning och fast pris om åtgärd behövs.",
                  cta: "Läs om takbesiktning",
                },
                {
                  href: "/tjanster/taksakerhet",
                  id: "taksakerhet",
                  title: "Taksäkerhet",
                  desc: "Snörasskydd, takstegar, gångbryggor och säkerhetsräcken enligt BBR och SS 831335. Lagkrav vid taklutning över 1:3 eller fasadhöjd över 8 m.",
                  cta: "Läs om taksäkerhet",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group block p-6 lg:p-7 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-all hover:shadow-[0_8px_30px_rgba(43,116,252,0.08)] scroll-mt-32"
                >
                  <h3
                    id={card.id}
                    className="text-xl font-bold mb-3 group-hover:text-[#2B74FC] transition-colors scroll-mt-32"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {card.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {card.cta} <ChevronRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS (4 STEG) ─────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vår process
              </p>
              <h2
                className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em] mb-3"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Från första kontakt till slutbesiktning
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fyra tydliga steg. Inget rusas, inga överraskningar längs
                vägen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {[
                {
                  num: "01",
                  title: "Hembesök",
                  text: "Vi inspekterar taket på plats och går igenom dina behov. Kostnadsfritt, utan förpliktelser.",
                },
                {
                  num: "02",
                  title: "Fast offert",
                  text: "Detaljerad offert med fast pris enligt ABT-06. Alla material och garantier specificerade.",
                },
                {
                  num: "03",
                  title: "Utförande",
                  text: "Vårt team utför arbetet noggrant. Projektledare tillgänglig under hela tiden.",
                },
                {
                  num: "04",
                  title: "Takkontroll",
                  text: "Slutbesiktning tillsammans med dig. Du får garantibevis och dokumentation.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="p-5 lg:p-6 rounded-2xl bg-white border border-gray-100"
                >
                  <div
                    className="text-3xl font-extrabold mb-3 tabular-nums"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/var-process"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Läs hela processen i detalj <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── KUNDOMDÖMEN ───────────────────────── */}
        <ReviewCarousel />

        {/* ── FAQ ───────────────────────────────── */}
        <section
          id="faq"
          className="py-16 lg:py-24 border-t border-gray-100 scroll-mt-32"
        >
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Svar på det som hindrar dig
              </h2>
            </div>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-gray-100 bg-white"
                >
                  <summary className="flex items-start justify-between gap-3 p-5 cursor-pointer list-none">
                    <h3
                      className="text-base font-bold pr-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      {f.q}
                    </h3>
                    <ChevronRight
                      size={18}
                      className="shrink-0 mt-1 text-gray-400 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <div className="px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATERADE PROJEKT ────────────────── */}
        <RelateradeProjekt
          projekt={tjanstProjekt}
          heading="Genomförda tak-projekt"
          limit={6}
        />

        {/* ── OMRADEN INLINE ────────────────────── */}
        <OmradenInline heading="Vi lägger om tak i hela Stockholmsregionen" />

        {/* ── FINAL CTA ─────────────────────────── */}
        <section className="py-16 lg:py-20 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Redo att börja?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Boka kostnadsfri takkontroll så går vi tillsammans igenom vad just
              ditt tak behöver. Fast pris inom 24 timmar.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få gratis offert <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <SourcesFooter />
      </main>
      <Footer />
    </>
  );
}
