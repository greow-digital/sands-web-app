import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/om-oss",
  title: "Om oss: Stockholms takläggare sedan 2016 | Sands Entreprenad",
  description:
    "Sands Entreprenad Stockholm AB. F-skattsedel, ansvarsförsäkring, Monier-certifierade takläggare. 2 500+ kunder, BraByggare 4.8★ med 54 omdömen.",
});

const stats = [
  { num: "2016", label: "Grundades" },
  { num: "2 500+", label: "Takläggningar" },
  { num: "30 år", label: "Monier garanti" },
  { num: "6", label: "Anställda" },
];

const värderingar = [
  {
    title: "Fast pris, alltid",
    text: "Vi lämnar aldrig en offert utan att ha besiktigat taket. Fast pris innebär inga överraskningar.",
  },
  {
    title: "Totalentreprenad",
    text: "Vi tar hela ansvaret, ett kontrakt, en kontaktperson, allt reglerat enligt ABT-06.",
  },
  {
    title: "Monier-certifierade",
    text: "Som certifierad Monier Takpartner kan vi erbjuda upp till 30 års Tätt tak-garanti.",
  },
  {
    title: "Lokal närvaro",
    text: "Vi är lokalt förankrade i Stockholmsregionen och förstår de lokala förutsättningarna.",
  },
];

export default function OmOssPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Sands Entreprenad Stockholm AB",
      foundingDate: "2016",
      numberOfEmployees: 6,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Spjutvägen 5A",
        postalCode: "175 61",
        addressLocality: "Stockholm",
        addressRegion: "Stockholms län",
        addressCountry: "SE",
      },
    },
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
          eyebrow="Om oss"
          title="Takläggare i Stockholm sedan"
          titleAccent="2016"
          description="Vi jobbar alltid med fast pris, tydlig offert och en trygg process från start till slut."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Om oss" }]}
        />

        {/* Stats */}
        <section
          className="py-12 border-y border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-3xl lg:text-5xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Historia + värderingar */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Vår historia
                </p>
                <h2
                  className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-6"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Trygg och smidig byggprocess
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Sands Entreprenad startades 2016 med idén att erbjuda våra
                    kunder en trygg och smidig byggprocess. Vi utför våra jobb
                    genom totalentreprenad, vilket innebär att vi alltid tar
                    totalansvaret för hela ditt projekt.
                  </p>
                  <p>
                    Vi har utvecklats och växt som företag tack vare våra kunder
                    och våra medarbetare. Med Sands Entreprenad får du utbildad
                    personal som är certifierade inom de moment vi utför,
                    erforderliga försäkringar samt en gedigen erfarenhet.
                  </p>
                  <p>
                    Våra kunder är allt ifrån privatpersoner, företag samt
                    föreningar. Vi är certifierad Monier Takpartner och
                    erbjuder upp till 30 års garanti på komplett takomläggning.
                  </p>
                </div>

                <div className="mt-8 p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB]">
                  <h3
                    className="text-base font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    Kontaktuppgifter
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold">
                      Sands Entreprenad Stockholm AB
                    </p>
                    <p>Spjutvägen 5A, 175 61 Järfälla</p>
                    <p>
                      <a
                        href="mailto:info@sandsab.se"
                        className="hover:text-[#2B74FC]"
                      >
                        info@sandsab.se
                      </a>
                    </p>
                    <p>
                      <a
                        href="tel:0828388"
                        className="font-bold hover:text-[#2B74FC]"
                      >
                        08-28 38 88
                      </a>
                    </p>
                    <p className="text-gray-400 pt-1 text-xs">
                      Org.nr: 559063-8135
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 mb-8">
                  <Image
                    src="/images/about-sands-building.jpg"
                    alt="Sands Entreprenad"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <h3
                  className="text-xl font-bold mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Det vi står för
                </h3>
                <div className="space-y-5">
                  {värderingar.map((v) => (
                    <div key={v.title} className="flex gap-4">
                      <CheckCircle
                        size={18}
                        className="shrink-0 mt-1"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div>
                        <h4
                          className="text-base font-bold mb-1"
                          style={{ color: "var(--color-dark)" }}
                        >
                          {v.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {v.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[26px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Redo att ta nästa steg?
            </h2>
            <p className="text-gray-600 mb-8">
              Boka en kostnadsfri takkontroll, fast pris utan förbindelser.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Boka kostnadsfri takkontroll <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
