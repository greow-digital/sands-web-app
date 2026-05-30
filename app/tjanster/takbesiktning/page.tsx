import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import ReviewCarousel from "@/components/ReviewCarousel";
import OmradenInline from "@/components/OmradenInline";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/tjanster/takbesiktning",
  title: "Takbesiktning Stockholm: kostnadsfri takkontroll | Sands Entreprenad",
  description:
    "Kostnadsfri takbesiktning i Stockholm av certifierad takläggare. Vi går upp på taket, bedömer skicket och ger fast pris om åtgärd behövs. Boka idag.",
});

const faq = [
  {
    q: "Kostar takbesiktningen något?",
    a: "Nej. Takbesiktningen är kostnadsfri och utan förbindelse. Vi går upp på taket, bedömer skicket tillsammans med dig och lämnar ett fast pris om åtgärd behövs.",
  },
  {
    q: "Vad ingår i besiktningen?",
    a: "Vi inspekterar yttertaket (pannor, plåt, vittring), plåtdetaljer (vindskivor, nockplåt, anslutningar), hängrännor och stuprör, skorsten utvändigt, samt råspont från vinden där det är åtkomligt.",
  },
  {
    q: "Går ni upp på taket eller bara tittar nedifrån?",
    a: "Vi går upp på taket vid varje besiktning. En seriös bedömning kräver att vi inspekterar pannor, plåtdetaljer och anslutningar på nära håll.",
  },
  {
    q: "Är ni opartiska eller har ni egenintresse?",
    a: "Vi är takläggare, så om vi finner problem kan vi också åtgärda dem. Men vår ärlighet är garanterad genom BraByggare 4.8★ av 5 (54 omdömen). Vi rekommenderar aldrig arbete som inte behövs, det är så vi behåller vårt rykte.",
  },
  {
    q: "Hur lång tid tar besiktningen?",
    a: "Själva besöket tar oftast 30–60 minuter beroende på takets storlek och komplexitet. Vi går igenom resultatet direkt på plats.",
  },
  {
    q: "Vad händer om ni hittar problem?",
    a: "Vi förklarar vad vi sett, hur akut det är (kan vänta vs måste åtgärdas) och ger fast pris på åtgärd. Ingen press att välja oss, ingen extra-fakturering.",
  },
  {
    q: "Kan jag boka besiktning inför ett husköp?",
    a: "Ja, det är en av våra vanligaste anledningar att besikta. Vi prioriterar bostadsköp för snabbast möjliga tid, och du får dokumentation av takets skick som kan användas i förhandling med säljare.",
  },
  {
    q: "Vad är skillnaden mot en offert?",
    a: "Ingen, i praktiken. Vid besiktning får du både skickbedömning och fast pris i samma besök. Är taket i bra skick får du veta det, behöver det åtgärdas får du offert direkt.",
  },
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
  serviceType: "Takbesiktning",
  name: "Takbesiktning i Stockholm",
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
    "Kostnadsfri takbesiktning av certifierad takläggare. Vi går upp på taket, bedömer skicket och ger fast pris vid behov av åtgärd.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "SEK",
    description: "Kostnadsfri takkontroll utan förbindelse",
  },
};

export default function TakbesiktningPage() {
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
          eyebrow="Takbesiktning"
          title="Kostnadsfri takbesiktning i"
          titleAccent="Stockholm"
          description="Funderar du på att byta tak, ska köpa hus, eller är osäker på takets skick? Boka kostnadsfri takkontroll av certifierad takläggare. Vi går upp på taket och ger en ärlig bedömning."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Tjänster", href: "/tjanster" },
            { label: "Takbesiktning" },
          ]}
          backgroundImage="/images/hero-house.jpg"
          imageAlt="Takbesiktning utförd av certifierad takläggare"
        />

        {/* ── HUVUDSEKTION: vad besiktning är + sticky form ── */}
        <section className="py-16 lg:py-24 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Vad är en takbesiktning?
                </p>
                <h2
                  className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  En ärlig genomgång av takets skick
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Vi kommer hem till dig, går upp på taket och bedömer skicket
                  systematiskt. Du följer med på inspektionen om du vill. Efter
                  genomgången går vi tillsammans igenom vad vi sett och vad
                  som behöver göras, om något.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Om taket behöver åtgärd lämnar vi fast pris direkt. Är det i
                  bra skick får du veta det. Ingen säljpitch i efterhand, ingen
                  förbindelse att välja oss.
                </p>

                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Detta inspekterar vi
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Yttertaket: pannor, plåt, sprickor och vittring",
                    "Plåtdetaljer: vindskivor, nockplåt, anslutningar",
                    "Hängrännor, stuprör och lövsilar",
                    "Skorstenens yttre skick",
                    "Ventilation: huvor och genomföringar",
                    "Råspont från vinden där det är åtkomligt",
                    "Befintliga snörasskydd och taksäkerhet",
                    "Tecken på tidigare läckage",
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
                  Vanliga skäl att boka takbesiktning
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    {
                      h: "Du planerar takbyte eller takomläggning",
                      p: "Vi bedömer takets skick och lämnar fast pris i samma besök så du har underlag att jämföra med.",
                    },
                    {
                      h: "Du ska köpa hus",
                      p: "En takbesiktning av oberoende takläggare ger dig dokumentation och förhandlingsunderlag mot säljaren.",
                    },
                    {
                      h: "Du har sett tecken på problem",
                      p: "Fuktfläckar i innertaket, lösa pannor eller stopp i hängrännorna är värt att låta proffs kolla innan det blir dyrare.",
                    },
                    {
                      h: "Det är 25+ år sedan senaste besiktningen",
                      p: "Tak har en livslängd. En genomgång ger dig planeringsunderlag för när och vad som behöver göras.",
                    },
                  ].map((reason) => (
                    <li key={reason.h} className="text-sm">
                      <p
                        className="font-bold mb-1"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-dark)",
                        }}
                      >
                        {reason.h}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {reason.p}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="p-5 rounded-2xl border border-gray-100 bg-[#F8F9FB]">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Vad det kostar
                  </p>
                  <p
                    className="text-xl font-extrabold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    0 kr. Kostnadsfri, alltid.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Takbesiktningen ingår alltid i vår offertprocess. Ingen
                    avgift, ingen förbindelse att välja oss för efterföljande
                    arbete.
                  </p>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
              </aside>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ─────────────────────────── */}
        <ReviewCarousel />

        {/* ── FAQ ─────────────────────────────── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
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
                Det här undrar de flesta
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

        {/* ── OMRADEN INLINE ─────────────────── */}
        <OmradenInline heading="Vi besiktar tak i hela Stockholmsregionen" />

        {/* ── FINAL CTA ──────────────────────── */}
        <section className="py-16 lg:py-20 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Boka kostnadsfri takbesiktning
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Fyll i formuläret eller ring så bokar vi tid. Du kan följa med på
              taket om du vill, eller bara läsa rapporten efteråt.
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
