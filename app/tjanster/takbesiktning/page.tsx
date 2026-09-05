import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import PartnerLink from "@/components/PartnerLink";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import OmdomenInline from "@/components/OmdomenInline";
import { takTestimonials } from "@/lib/testimonials";
import LeadForm from "@/components/LeadForm";
import ReviewCarousel from "@/components/ReviewCarousel";
import OmradenInline from "@/components/OmradenInline";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/tjanster/takbesiktning",
  // Titeln leder med "kostnadsfri takkontroll" eftersom GSC visar att sidan
  // rankar 6,0 på den frasen och 4,6 på "kostnadsfri takkontroll vad ingår",
  // men får noll klick. Tidigare title ledde med "Takbesiktning", vilket inte
  // matchade det användaren faktiskt sökte på. Description besvarar "vad ingår"
  // direkt i stället för att beskriva tjänsten allmänt.
  title: "Kostnadsfri takkontroll Stockholm, vad ingår | Sands",
  description:
    "Vad ingår i en kostnadsfri takkontroll? Vi går upp på taket, dokumenterar skicket och lämnar fast pris vid behov. Utan förbindelse, i hela Stockholms län.",
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
  // Flyttad hit från startsidan: den här sidan äger frågan om akuta problem.
  {
    q: "Mitt tak läcker, vad gör jag?",
    a: "Kontakta oss för en kostnadsfri takkontroll. Vi inspekterar taket, identifierar orsaken till läckaget och ger dig ett fast pris på åtgärd, ofta samma dag.",
  },
  // Ligger sist och lämnar över till avsnittet om oberoende besiktning nedanför.
  {
    q: "Vad är skillnaden på er kostnadsfria takkontroll och en oberoende takbesiktning?",
    a: "Vår takkontroll är en kostnadsfri besiktning som ligger till grund för din offert. Den utförs av våra takläggare och du får en bedömning av takets skick samt fast pris på eventuella åtgärder. En oberoende takbesiktning utförs av en besiktningsman som inte säljer tak. Du betalar för den och får ett skriftligt protokoll som du kan använda för att jämföra offerter, vid husförsäljning eller som beställarens underlag i en entreprenad. De två utesluter inte varandra, många kombinerar dem.",
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
          eyebrow="Takkontroll"
          title="Kostnadsfri takkontroll i"
          titleAccent="Stockholm"
          description="Funderar du på att byta tak, ska köpa hus, eller är osäker på takets skick? Boka kostnadsfri takkontroll av certifierad takläggare. Vi går upp på taket och ger en ärlig bedömning."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Tjänster", href: "/tjanster" },
            { label: "Takbesiktning" },
          ]}
          backgroundImage="/images/bromma-tak-hero.jpg"
          imageAlt="Takbesiktning utförd av certifierad takläggare"
          aside={
            <LeadForm
              variant="hero"
              formId="tjanst_hero"
              fields="minimal"
              contact="phone-or-email"
              showMessage
              ctaText="Få mitt prisförslag"
            />
          }
          asideUnder={<TrustBadgesRow />}
        />

        <OmdomenInline
          heading="Vad kunderna säger"
          pool={takTestimonials}
          match={["besiktning", "inspektion", "tak"]}
          limit={3}
        />

        {/* ── HUVUDSEKTION: vad besiktning är + sticky form ── */}
        <section className="py-20 lg:py-28 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                  Vad är en takbesiktning?
                </p>
                <h2
                  className="text-[34px] lg:text-[46px] font-extrabold tracking-[-0.03em] mb-5"
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
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Om taket behöver åtgärd lämnar vi fast pris direkt. Är det i
                  bra skick får du veta det. Ingen säljpitch i efterhand, ingen
                  förbindelse att välja oss.
                </p>
                {/* Takbesiktning har egen sida och missar därför uppåtlänken
                    i [slug]-mallen. Samma länk läggs här. */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Visar kontrollen att taket är uttjänt går vi vidare till ett{" "}
                  <Link
                    href="/tjanster/taklaggning"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    takbyte
                  </Link>
                  , där vi går igenom hela arbetet från rivning och ny
                  underlagspapp till färdigt tak.
                </p>

                <div className="mb-8 rounded-2xl border border-gray-100 bg-[#F8F9FB] p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                  <p className="text-sm text-gray-700 flex-1">
                    Osäker på om taket behöver ses över? Gör vårt kostnadsfria
                    taktest på en minut, så får du en första bedömning direkt.
                  </p>
                  <Link
                    href="/taktest"
                    className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold text-[#2B74FC] hover:underline"
                  >
                    Gör taktestet <ArrowRight size={14} />
                  </Link>
                </div>

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
                  <p className="text-base text-gray-600 leading-relaxed">
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
        <section className="py-20 lg:py-28 border-t border-gray-100">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[34px] lg:text-[46px] font-extrabold tracking-[-0.03em]"
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
                  <div className="px-5 pb-5 -mt-1 text-base text-gray-600 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── OBEROENDE BESIKTNING ───────────── */}
        {/* Medvetet nedtonat: ingen egen bakgrundsfärg och mindre rubrik än
            sidans övriga H2:or, så avsnittet inte konkurrerar med hero eller
            avslutande CTA. Syftet är att fånga upp den som söker ett opartiskt
            utlåtande, inte att sälja besiktning. */}
        <section className="py-16 lg:py-20 border-t border-gray-100">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Vill du ha en oberoende bedömning?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Vår takkontroll är kostnadsfri och utförs av oss som också skulle
              lägga taket. Den ligger till grund för din offert. Vill du
              istället ha ett opartiskt utlåtande från någon som inte säljer
              tak, rekommenderar vi en oberoende besiktning. Vi tar gärna emot
              ett besiktningsprotokoll som underlag när vi räknar på ditt tak.
            </p>

            {/* Jämförelsen scrollar i sin egen container på smala skärmar, så
                sidan aldrig blir bredare än viewporten. */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 mb-10">
              <table className="w-full min-w-[600px] text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    <th className="w-[22%] text-left font-semibold text-gray-500 px-5 py-3.5">
                      <span className="sr-only">Jämförelse</span>
                    </th>
                    <th
                      className="text-left font-bold px-5 py-3.5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Kostnadsfri takkontroll
                    </th>
                    <th
                      className="text-left font-bold px-5 py-3.5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Oberoende besiktning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Pris",
                      sands: "0 kr",
                      oberoende: "Enligt besiktningsbolagets prislista",
                    },
                    {
                      label: "Utförs av",
                      sands: "Sands takläggare",
                      oberoende: "Oberoende besiktningsman",
                    },
                    {
                      label: "Syfte",
                      sands: "Underlag för offert",
                      oberoende: "Opartiskt utlåtande",
                    },
                    {
                      label: "Du får",
                      sands: "Skickbedömning och fast pris på plats",
                      oberoende:
                        "Skriftligt protokoll med bilder och åtgärdslista",
                    },
                    {
                      label: "Passar när",
                      sands: "Du vill veta vad ett takbyte kostar",
                      oberoende:
                        "Du vill ha ett andra utlåtande, ska sälja huset eller upphandlar en entreprenad",
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-gray-100 align-top"
                    >
                      <th
                        scope="row"
                        className="text-left font-semibold text-gray-500 px-5 py-3.5"
                      >
                        {row.label}
                      </th>
                      <td className="text-gray-700 px-5 py-3.5">{row.sands}</td>
                      <td className="text-gray-700 px-5 py-3.5">
                        {row.oberoende}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  namn: "Svensk Takinspektion",
                  text: "Oberoende takbesiktning för villa, BRF och företag. Du får en skriftlig rapport med bilder, skickbedömning och prioriterad åtgärdslista. Passar dig som vill veta takets skick innan du begär offerter.",
                  href: "https://svensktakinspektion.se/",
                  lankText: "Till svensktakinspektion.se",
                  partner: "svensk_takinspektion",
                  logo: "/images/partner-svensk-takinspektion.webp",
                  logoBredd: 640,
                  logoHojd: 334,
                },
                {
                  namn: "Norrorts Besiktning",
                  text: "SBR-godkänd besiktningsman specialiserad på yttertak. Utför förbesiktning, slutbesiktning, efterbesiktning och garantibesiktning enligt AB04 och ABT06. Passar BRF och fastighetsägare som upphandlar en entreprenad.",
                  href: "https://www.norrortsbesiktning.se/",
                  lankText: "Till norrortsbesiktning.se",
                  partner: "norrorts_besiktning",
                  logo: "/images/partner-norrorts-besiktning.png",
                  logoBredd: 512,
                  logoHojd: 512,
                },
              ].map((p) => (
                <div
                  key={p.namn}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-[#F8F9FB] p-5"
                >
                  {/* Båda logotyperna är vita på transparent botten och syns
                      inte mot kortets ljusa yta, därför den mörka plattan. */}
                  <div
                    className="inline-flex items-center h-14 w-fit rounded-xl px-3 mb-4"
                    style={{ backgroundColor: "var(--color-dark)" }}
                  >
                    <Image
                      src={p.logo}
                      alt={`${p.namn} logotyp`}
                      width={p.logoBredd}
                      height={p.logoHojd}
                      className="h-9 w-auto"
                    />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {p.namn}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                    {p.text}
                  </p>
                  <PartnerLink
                    href={p.href}
                    partner={p.partner}
                    location="takbesiktning_page"
                  >
                    {p.lankText}
                  </PartnerLink>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Ett tak som är korrekt lagt tål att besiktas. Vi ställer gärna
              vårt arbete under granskning av tredje part.
            </p>
          </div>
        </section>

        {/* ── OMRADEN INLINE ─────────────────── */}
        <OmradenInline heading="Vi besiktar tak i hela Stockholmsregionen" />

        {/* ── FINAL CTA ──────────────────────── */}
        <section className="py-20 lg:py-24 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[34px] lg:text-[46px] font-extrabold tracking-[-0.02em] mb-4"
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
              className="inline-flex items-center gap-2 px-9 py-[18px] rounded-full text-white font-semibold text-base transition-all hover:scale-[1.02]"
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
