import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import Takraknare from "@/components/Takraknare";

export const metadata: Metadata = {
  alternates: { canonical: "/priser" },
  title: "Vad kostar takbyte i Stockholm? Prisguide 2025 | Sands Entreprenad",
  description:
    "Riktpriser för takbyte i Stockholm. Betongtak från 1 200 kr/m², tegeltak från 1 500 kr/m², alla priser efter ROT-avdrag.",
};

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

        <PageHero
          eyebrow="Prisguide"
          title="Vad kostar takbyte i"
          titleAccent="Stockholm?"
          description="Alla riktpriser är efter 30% ROT-avdrag. Vi ger alltid fast pris efter kostnadsfri takkontroll, inga dolda avgifter."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Priser" }]}
          backgroundImage="/images/hero-priser.jpg"
          imageAlt="Villa i Stockholm med nytt tak"
        />

        {/* Takräknare */}
        <Takraknare />

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

        {/* Sands takpaket */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
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
                <ul className="space-y-3">
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
              </div>

              <div>
                <h3
                  className="text-xl font-bold mb-5"
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
                <div className="flex flex-wrap gap-3">
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
                    <Phone size={14} /> 08-28 38 88
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulär */}
        <section className="py-16 lg:py-20 border-t border-gray-100">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2
                className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em] mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Få ditt personliga prisförslag
              </h2>
              <p className="text-gray-500 text-sm">
                Boka kostnadsfri takkontroll, vi återkommer inom 24h.
              </p>
            </div>
            <LeadForm variant="section" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
