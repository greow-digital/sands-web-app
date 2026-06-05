import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import FormPromise from "@/components/FormPromise";
import Takraknare from "@/components/Takraknare";
import OmradenInline from "@/components/OmradenInline";
import SourcesFooter from "@/components/SourcesFooter";

import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/priser",
  title: "Vad kostar takbyte? Priser & exempel 2026 | Sands Entreprenad",
  description:
    "Priser för takbyte i Stockholm: betongtak från 1 200 kr/m², tegeltak från 1 500, plåttak från 1 800. Exempel: villa 140 m² från 169 000 kr efter ROT.",
});

const priser = [
  {
    typ: "Betongtak",
    m2: "Från 1 200 kr/m²",
    ex140: "Från 169 000 kr",
    text: "Det vanligaste alternativet i Sverige. Robust, prisvärt och brett sortiment av kulörer.",
    slug: "betongtak",
  },
  {
    typ: "Tegeltak",
    m2: "Från 1 500 kr/m²",
    ex140: "Från 210 000 kr",
    text: "Klassiskt naturmaterial med upp till 50 års livslängd. Håller sin kulör livet ut.",
    slug: "tegeltak",
  },
  {
    typ: "Plåttak",
    m2: "Från 1 800 kr/m²",
    ex140: "Från 252 000 kr",
    text: "Modernt och lättviktigt. Passar villor med flacka tak eller modern arkitektur.",
    slug: "plattak",
  },
  {
    typ: "Papptak",
    m2: "Från 800 kr/m²",
    ex140: "Från 112 000 kr",
    text: "Prisvärt val för platta tak och enklare konstruktioner med professionellt resultat.",
    slug: "papptak",
  },
];

const ingår = [
  "Upp till 30 års tätt tak-garanti (Moniers taksystem)",
  "Ny underlagspapp (Icopal Flexilight Prima)",
  "Ny ströläkt & bärläkt (25×48 mm)",
  "Nya takpannor från Monier",
  "Nytt regnvattensystem (hängrännor och stuprör)",
  "Ställning, container och bortforsling",
  "Takkontroll tillsammans med dig",
];

const påverkar = [
  "Takets storlek (m²)",
  "Materialval (betong, tegel, plåt, papp)",
  "Takets lutning och komplexitet",
  "Antal genomföringar (skorstenar, ventilation)",
  "Skick på underlag (råspont, läkt)",
  "Tillgänglighet (ställningsbehov)",
];

export default function PriserPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vad kostar takbyte i Stockholm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Priset beror på material. Betongtak kostar från ca 1 200 kr/m², tegeltak från ca 1 500 kr/m², plåttak från ca 1 800 kr/m² och papptak från ca 800 kr/m², alla priser efter ROT-avdrag.",
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Hem",
                  item: "https://www.sandsab.se/",
                },
                { "@type": "ListItem", position: 2, name: "Priser" },
              ],
            }),
          }}
        />

        {/* Split-hero: rubrik + trust till vänster, kalkylator till höger.
            Kalkylatorn är konverteringsmotorn så den ligger ovanför fold. */}
        <section className="relative overflow-hidden">
          <Image
            src="/images/hero-priser.jpg"
            alt="Villa i Stockholm med nytt tak"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,6,7,0.92) 0%, rgba(6,6,7,0.82) 38%, rgba(6,6,7,0.62) 72%, rgba(6,6,7,0.42) 100%)",
            }}
          />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <nav className="flex items-center gap-2 text-xs text-gray-300 mb-8">
              <Link href="/" className="hover:text-white">
                Hem
              </Link>
              <span>/</span>
              <span className="text-gray-200">Priser</span>
            </nav>

            <div className="grid lg:grid-cols-[1fr_minmax(340px,420px)] gap-10 lg:gap-14 items-center">
              <div className="text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-300 mb-4">
                  Prisguide
                </p>
                <h1
                  className="text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.04] tracking-[-0.035em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Vad kostar takbyte i{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    Stockholm?
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-gray-200 leading-relaxed max-w-xl mt-5">
                  Dra i reglaget för en direkt prisuppskattning. Alla riktpriser
                  är efter 30 % ROT-avdrag, fast pris efter kostnadsfri
                  takkontroll och inga dolda avgifter.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-sm text-gray-100">
                  <span className="flex items-center gap-2">
                    <Star
                      size={16}
                      className="fill-current"
                      style={{ color: "var(--color-primary)" }}
                    />
                    4,8 av 5 på BraByggare
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle
                      size={16}
                      style={{ color: "var(--color-primary)" }}
                    />
                    Fast pris
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle
                      size={16}
                      style={{ color: "var(--color-primary)" }}
                    />
                    Upp till 30 års garanti
                  </span>
                </div>
              </div>

              <div>
                <Takraknare embedded />
              </div>
            </div>
          </div>
        </section>

        {/* ROT-info under heron */}
        <section className="py-8 border-b border-gray-100 bg-gray-50/60">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              Du betalar bara 70 % av arbetskostnaden, Skatteverket står för
              resterande 30 % via ROT-avdraget (max 50 000 kr per person och
              år, kombinerat med RUT max 75 000 kr). Endast arbetskostnad
              kvalificerar för avdrag, inte material. Vi sköter ansökan åt dig.
            </p>
          </div>
        </section>

        {/* Prisintervall */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {priser.map((p) => (
                <Link
                  key={p.typ}
                  href={`/tjanster/${p.slug}`}
                  className="block p-6 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-colors group"
                >
                  <h3
                    className="text-lg font-bold mb-3 group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {p.typ}
                  </h3>
                  <div
                    className="text-2xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {p.m2}
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    140 m²: {p.ex140}*
                  </div>
                  <p className="text-sm text-gray-500">{p.text}</p>
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6">
              * Exempelpris sadeltak 140 m² efter ROT-avdrag 30%.
            </p>
          </div>
        </section>

        {/* Sands takpaket + LeadForm sticky aside */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Takpaket från Sands
                </p>
                <h2
                  className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad ingår i priset?
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Exempelpris{" "}
                  <strong style={{ color: "var(--color-dark)" }}>
                    169 000 kr
                  </strong>{" "}
                  för sadeltak 140 m² med betongpannor efter ROT. Allt är
                  inkluderat, vi lämnar inga dolda notor.
                </p>
                <ul className="space-y-3 mb-10">
                  {ingår.map((item) => (
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

                <h3
                  className="text-xl font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad påverkar priset?
                </h3>
                <ul className="space-y-2 mb-8">
                  {påverkar.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-500">
                  Föredrar du telefon? Ring{" "}
                  <a
                    href="tel:0828388"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    08-28 38 88
                  </a>
                  .
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

        <OmradenInline />

        <SourcesFooter show={["rot", "bygglov"]} />
      </main>
      <Footer />
    </>
  );
}
