import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import FormPromise from "@/components/FormPromise";
import Takraknare from "@/components/Takraknare";
import TaktestInlineCta from "@/components/TaktestInlineCta";
import OmdomenInline from "@/components/OmdomenInline";
import { takTestimonials } from "@/lib/testimonials";
import OmradenInline from "@/components/OmradenInline";
import SourcesFooter from "@/components/SourcesFooter";
import SeasonBanner from "@/components/SeasonBanner";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import Referensprojekt from "@/components/Referensprojekt";

import { pageMeta } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import type { ProjektCard } from "@/sanity/lib/types";

export const metadata: Metadata = pageMeta({
  path: "/priser",
  title: "Vad kostar takbyte i Stockholm? Pris per m² 2026 | Sands",
  description:
    "Räkna på takbyte i Stockholm: pris per kvadratmeter för betongtak från 1 200 kr/m², tegeltak 1 500, plåttak 1 800. Villa 140 m² från 169 000 kr efter ROT.",
});

/** Formaterar heltal med tusentalsmellanrum: 120000 -> "120 000". */
const kr = (n: number) => n.toLocaleString("sv-SE").replace(/ /g, " ");

/* krPerM2 är den enda platsen kvadratmeterpriset finns (SEO.md §5). Både
   priskorten och FAQ-svaren räknas ut härifrån. ex140 står kvar som text
   eftersom betongtakets 140 m²-exempel är avrundat uppåt till 169 000. */
const priser = [
  {
    typ: "Betongtak",
    krPerM2: 1200,
    ex140: "Från 169 000 kr",
    text: "Det vanligaste alternativet i Sverige. Robust, prisvärt och brett sortiment av kulörer.",
    slug: "betongtak",
  },
  {
    typ: "Tegeltak",
    krPerM2: 1500,
    ex140: "Från 210 000 kr",
    text: "Klassiskt naturmaterial med upp till 50 års livslängd. Håller sin kulör livet ut.",
    slug: "tegeltak",
  },
  {
    typ: "Plåttak",
    krPerM2: 1800,
    ex140: "Från 252 000 kr",
    text: "Modernt och lättviktigt. Passar villor med flacka tak eller modern arkitektur.",
    slug: "plattak",
  },
  {
    typ: "Papptak",
    krPerM2: 800,
    ex140: "Från 112 000 kr",
    text: "Prisvärt val för platta tak och enklare konstruktioner med professionellt resultat.",
    slug: "papptak",
  },
];

const pris = (slug: string) =>
  priser.find((p) => p.slug === slug)!.krPerM2;

/** Riktpris för en yta och ett material, härlett ur krPerM2. */
const yta = (slug: string, m2: number) => kr(pris(slug) * m2);

/* FAQ:n täcker kvm-klustret som i dag ligger på position 40 till 70 i
   Search Console: "kostnad byta tak 100 kvm" (77 visningar), 180 kvm och
   "takbyte pris kvm" (94 visningar). Frågorna är medvetet valda så att de
   inte dubblerar blogginläggets FAQ, som redan äger 150 kvm, råspont,
   offertskillnader och ställning/bortforsling.

   Vi stannar vid 180 m² med flit. Beloppen räknas linjärt ur krPerM2, och
   på riktigt stora tak sjunker kvadratmeterpriset eftersom etablering och
   ställning slås ut på fler kvadratmeter. Ett 250 m²-svar hade därför
   angett ett för högt riktpris på sidans största belopp. Lägg till fler
   ytor först när den faktiska rabattkurvan för stora tak är känd. */
const faq = [
  {
    q: "Vad kostar det att byta tak på 100 kvm?",
    a: `Med betongpannor landar ett tak på 100 m² från ${yta("betongtak", 100)} kr, med tegel från ${yta("tegeltak", 100)} kr och med plåt från ${yta("plattak", 100)} kr. Alla siffror är efter 30 % ROT-avdrag och förutsätter ett sadeltak utan större komplikationer och ett helt underlag. Bindande fast pris får du efter kostnadsfri takkontroll.`,
  },
  {
    q: "Vad kostar det att byta tak på 180 kvm?",
    a: `På 180 m² blir riktpriset från ${yta("betongtak", 180)} kr med betongpannor, från ${yta("tegeltak", 180)} kr med tegel och från ${yta("plattak", 180)} kr med plåt, efter ROT-avdrag. Större tak ger ofta något lägre kvadratmeterpris eftersom etablering och ställning slås ut på fler kvadratmeter. Räkna på din egen takyta i kalkylatorn högre upp på sidan.`,
  },
  {
    q: "Vad kostar takbyte per kvadratmeter?",
    a: `Priset per kvadratmeter beror på beläggningen: betongtak från ${kr(pris("betongtak"))} kr/m², tegeltak från ${kr(pris("tegeltak"))} kr/m², plåttak från ${kr(pris("plattak"))} kr/m² och papptak från ${kr(pris("papptak"))} kr/m². Priserna är efter ROT-avdrag och gäller en komplett omläggning med rivning, nytt underlag, plåt och taksäkerhet. Vad just ditt tak hamnar på beror på lutning, form och underlagets skick.`,
  },
  {
    q: "Hur mycket sjunker priset med ROT-avdraget?",
    a: "ROT-avdraget ger 30 % rabatt på arbetskostnaden, inte på materialet, och taket är 50 000 kr per person och år. Alla priser vi visar på den här sidan är redan efter avdraget, så du behöver inte räkna om dem. Vi sköter ansökan åt dig och drar avdraget direkt på fakturan.",
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

export default async function PriserPage() {
  const allaProjekt = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vad kostar takbyte i Stockholm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Priset beror på material. Betongtak kostar från ca ${kr(pris("betongtak"))} kr/m², tegeltak från ca ${kr(pris("tegeltak"))} kr/m², plåttak från ca ${kr(pris("plattak"))} kr/m² och papptak från ca ${kr(pris("papptak"))} kr/m², alla priser efter ROT-avdrag.`,
        },
      },
      // Speglar FAQ-sektionen 1:1 enligt SEO.md §10.
      ...faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
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

        {/* Kompakt centrerad hero. Kalkylatorn (nedan) overlappar upp hit sa
            den blir hjalten nara fold men bred och mittstalld, med plats for
            expanderbara detaljer och allt innehall under. */}
        <section className="relative overflow-hidden">
          <Image
            src="/images/bromma-tak-efter.jpg"
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
                "linear-gradient(180deg, rgba(6,6,7,0.74) 0%, rgba(6,6,7,0.70) 45%, rgba(6,6,7,0.84) 100%)",
            }}
          />

          <div className="relative max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 lg:pt-12 lg:pb-36 text-left lg:text-center">
            <nav className="flex items-center justify-start lg:justify-center gap-2 text-xs text-gray-300 mb-6">
              <Link href="/" className="hover:text-white">
                Hem
              </Link>
              <span>/</span>
              <span className="text-gray-200">Priser</span>
            </nav>

            {/* Säsongsargumentet är den enda tidsdrivna anledningen att agera,
                och prissidan är den sida där den gör mest nytta. */}
            <div className="flex lg:justify-center">
              <SeasonBanner />
            </div>

            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-300 mb-3">
              Prisguide
            </p>
            <h1
              className="text-white text-[34px] sm:text-[44px] lg:text-[54px] font-extrabold leading-[1.04] tracking-[-0.035em] max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Vad kostar takbyte i{" "}
              <span style={{ color: "var(--color-primary)" }}>Stockholm?</span>
            </h1>
            {/* Synonymklustret enligt SEO.md §3 vävs in här: takbyte, byta
                tak, lägga om tak och pris per kvadratmeter. "Räkna" är med
                avsiktligt, sidan rankar redan på "räkna på takbyte" men sa
                aldrig ordet i synlig copy. */}
            <p className="text-base lg:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto mt-5">
              Räkna ut vad det kostar att byta tak eller lägga om taket. Dra i
              reglaget för riktpris per kvadratmeter, efter 30 % ROT-avdrag och
              fast pris efter kostnadsfri takkontroll.
            </p>
            {/* Badges i stället för textrad: samma tre budskap, men
                BraByggare-betyget och Monier-garantin syns som verifierbara
                märken i stället för påståenden i löptext. */}
            <div className="mt-7 flex justify-start lg:justify-center">
              <TrustBadgesRow />
            </div>
          </div>
        </section>

        {/* Mobil: staplad direkt under heron (ingen overlap, som Erik gillar).
            Desktop: bred, mittställd, overlappar upp i heron. */}
        <div className="relative z-10 mt-6 lg:-mt-28 mb-4 lg:mb-8 max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8">
          <Takraknare embedded />
        </div>

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

        <OmdomenInline
          heading="Nöjda kunder om pris och offert"
          pool={takTestimonials}
          match={["offert", "faktura", "pris", "överenskomm", "konkurrensmässig"]}
          background
        />

        {/* Prisintervall */}
        <section className="py-20 lg:py-28">
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
                    Från {kr(p.krPerM2)} kr/m²
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    140 m²: {p.ex140}*
                  </div>
                  <p className="text-sm text-gray-500">{p.text}</p>
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6">
              * Riktpris sadeltak 140 m² efter 30 % ROT-avdrag. Bindande fast
              pris får du efter kostnadsfri takkontroll.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mt-6">
              Priserna gäller en komplett{" "}
              <Link
                href="/tjanster/taklaggning"
                className="font-semibold text-[#2B74FC] hover:underline"
              >
                takomläggning
              </Link>{" "}
              inklusive rivning, nytt underlag, plåt och taksäkerhet. Vill du
              veta hur du bedömer en offert och{" "}
              <Link
                href="/basta-taklaggare-stockholm"
                className="font-semibold text-[#2B74FC] hover:underline"
              >
                jämför takläggare i Stockholm
              </Link>{" "}
              har vi samlat råden i vår köpguide.
            </p>
          </div>
        </section>

        {/* Sands takpaket + LeadForm sticky aside */}
        <section
          className="py-20 lg:py-28 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                  Takpaket från Sands
                </p>
                <h2
                  className="text-[34px] lg:text-[48px] font-extrabold tracking-[-0.03em] mb-5"
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

                {/* Fördjupning. Den här sidan äger det transaktionella
                    intentet ("takbyte pris Stockholm"): tabell, kalkylator,
                    boka. Blogginlägget vad-kostar-takbyte äger det
                    informationella ("hur byggs priset upp", "varför skiljer
                    offerterna sig"). De ska länka till varandra, inte
                    upprepa varandra. Eternit saknas medvetet i pristabellen
                    ovan eftersom saneringen inte går att prissätta per m²
                    på förhand. */}
                <h3
                  className="text-xl font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Fördjupning om kostnaden
                </h3>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
                    <span>
                      Undrar du varför två offerter på samma tak kan skilja
                      tiotusentals kronor? Vi bryter ner de fyra delarna i{" "}
                      <Link
                        href="/blogg/vad-kostar-takbyte"
                        className="font-semibold text-[#2B74FC] hover:underline"
                      >
                        hur priset på ett takbyte byggs upp
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
                    <span>
                      Har du eternittak tillkommer asbestsanering utöver det nya
                      taket. Vi har räknat på det i guiden om att{" "}
                      <Link
                        href="/blogg/byta-eternittak-kostnad"
                        className="font-semibold text-[#2B74FC] hover:underline"
                      >
                        byta eternittak
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
                    <span>
                      Underlagspapp, ströläkt och råspont är de poster som
                      avgör om taket blir tätt, och de som oftast skiljer två
                      offerter åt. Se{" "}
                      <Link
                        href="/blogg/under-takpannorna-underlagspapp-strolakt"
                        className="font-semibold text-[#2B74FC] hover:underline"
                      >
                        vad som finns under takpannorna
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
                    <span>
                      Är pannorna hela räcker det ofta med omläggning i stället
                      för komplett byte, vilket sänker priset. Läs mer om{" "}
                      <Link
                        href="/tjanster/taklaggning"
                        className="font-semibold text-[#2B74FC] hover:underline"
                      >
                        takbyte och omläggning av tak
                      </Link>
                      .
                    </span>
                  </li>
                </ul>

                <p className="text-xs text-gray-500">
                  Föredrar du telefon? Ring{" "}
                  <a
                    href="tel:08283888"
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

        <Referensprojekt projekt={allaProjekt} />

        <OmradenInline />

        {/* ── FAQ ─────────────────────────────────
            Öppen som default enligt SEO.md §6 punkt 9, till skillnad från
            accordion-mönstret på tjänstesidorna. Innehållet är sidans
            SEO-nyttolast mot kvm-klustret och ska synas utan klick. */}
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
                Vad kostar det för just ditt tak?
              </h2>
            </div>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details
                  key={i}
                  open
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

        {/* Taktest-CTA:n låg tidigare direkt under kalkylatorn och sådde
            tvivel i det ögonblick intentionen var som högst. Den som kommit
            hit för att räkna pris har redan bestämt sig för att taket är en
            fråga. Nere här fångar den i stället den som skrollat förbi allt
            utan att höra av sig. */}
        <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TaktestInlineCta
            heading="Vet du inte om taket behöver bytas än?"
            text="Gör vårt kostnadsfria taktest på en minut, så får du en personlig bedömning av takets skick innan du bokar takkontroll."
          />
        </div>

        <SourcesFooter show={["rot", "bygglov"]} />
      </main>
      <Footer />
    </>
  );
}
