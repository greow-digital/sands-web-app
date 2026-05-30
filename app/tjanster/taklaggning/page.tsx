import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import ReviewCarousel from "@/components/ReviewCarousel";
import OmradenInline from "@/components/OmradenInline";
import RelateradeProjekt from "@/components/RelateradeProjekt";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import type { ProjektCard } from "@/sanity/lib/types";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/tjanster/taklaggning",
  title:
    "Takbyte, takomläggning & takrenovering i Stockholm | Sands Entreprenad",
  description:
    "Komplett takbyte, takomläggning eller punktinsats i Stockholm. Fast pris efter kostnadsfri takkontroll, 30 års Monier-garanti, ROT-avdrag. Få prisförslag inom 24 h.",
});

// Pris-formel matchar Takräknaren (inkl 25 % moms, ROT-cap 50 000 kr).
// MaterialFactor: betong = 1.0, tegel ≈ 1.25, plåt ≈ 1.5 (baseline från
// "från X kr/m²"-priserna på startsidan).
function prisEfterRot(kvm: number, materialFactor = 1) {
  const FAST_INKL_MOMS = 35200 * 1.25;
  const RORLIGT_KR_M2 = 979 * 1.25 * materialFactor;
  const ARBETE_KR_M2 = 700 * 1.25;
  const total = FAST_INKL_MOMS + RORLIGT_KR_M2 * kvm;
  const rot = Math.min(ARBETE_KR_M2 * kvm * 0.3, 50000);
  return Math.round(total - rot);
}

function formatKr(n: number) {
  // Avrunda till närmaste tusental
  const rounded = Math.round(n / 1000) * 1000;
  return rounded.toLocaleString("sv-SE") + " kr";
}

const faq = [
  {
    q: "Vad är skillnaden mellan takbyte, takomläggning och takrenovering?",
    a: "Takbyte innebär att hela taket rivs och ersätts med nytt material (pannor, papp, läkt). Takomläggning innebär att vi behåller befintliga pannor men byter underlagspapp och läkt — du sparar 30–40 % mot fullt byte om pannorna är hela. Takrenovering är riktade punktinsatser (laga läckage, byta enstaka pannor, nya hängrännor) utan att hela taket görs om.",
  },
  {
    q: "Hur vet jag vilket alternativ jag behöver?",
    a: "Boka kostnadsfri takkontroll så bedömer vi tillsammans. Som tumregel: tak under 30 år med hela pannor klarar omläggning, tak över 35 år eller med läckage på flera ställen behöver byte, isolerade problem klarar renovering.",
  },
  {
    q: "Hur länge tar ett takbyte?",
    a: "5–10 arbetsdagar för en normalstor villa, beroende på storlek, material och komplexitet. Omläggning tar oftast 4–7 dagar. Vi täcker alltid taket med presenningar varje kväll.",
  },
  {
    q: "Vilket material ska jag välja?",
    a: "Betongpannor är prisvärt och håller 50+ år. Tegel ger klassiskt utseende och håller minst lika länge. Plåttak (bandtäckt) håller 60+ år och är dyrast men har lägst underhåll. Vi går igenom valet på besöket utifrån din villa.",
  },
  {
    q: "Får jag bygglov för takbyte?",
    a: "Om du byter till samma typ av tak behövs oftast inget bygglov. Vid taktypsbyte (t.ex. tegel till plåt) krävs ofta bygglov. Vi hjälper dig med ansökan om det behövs.",
  },
  {
    q: "Hur fungerar ROT-avdraget?",
    a: "Du får 30 % rabatt på arbetskostnaden direkt på fakturan. Vi sköter ansökan till Skatteverket åt dig. Maxbeloppet är 50 000 kr per person per år, så vid två ägare kan ROT bli upp till 100 000 kr.",
  },
  {
    q: "Vilken garanti gäller?",
    a: "Som certifierad Monier Takpartner kan vi erbjuda upp till 30 års tätt-tak-garanti vid komplett takbyte eller takomläggning med Moniers taksystem. Garantin täcker både material och täthet i taket.",
  },
  {
    q: "Vad ingår i det fasta priset?",
    a: "Allt: rivning, bortforsling, ny underlagspapp, ströläkt och bärläkt, nya pannor eller plåt, hängrännor och stuprör, vindskivor, plåtdetaljer, ställning och container. Slutbesiktning ingår också. Inga dolda kostnader.",
  },
  {
    q: "Vad kan tillkomma i pris?",
    a: "Råspontbyte vid omfattande rötskador (vanligaste tillägget), eternitsanering om gammalt asbesttak finns, takkupor eller fönster utöver standard, samt extra ställning vid svår tillgänglighet. Allt kommuniceras innan arbete påbörjas.",
  },
  {
    q: "Behöver jag flytta saker eller bo någon annanstans?",
    a: "Nej. Dammbildning är minimal och du kan bo kvar hela tiden. Vi arbetar 07:00–17:00 vardagar. Eventuella känsliga föremål på vinden bör täckas över.",
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

  // Prismatris för jämförelsetabellen
  const priser = {
    takbyte: {
      kvm120Betong: prisEfterRot(120, 1.0),
      kvm140Tegel: prisEfterRot(140, 1.25),
      kvm165Plat: prisEfterRot(165, 1.5),
    },
    omlaggning: {
      // Omläggning behåller pannor → ca 70 % av motsvarande takbyte
      kvm120Betong: Math.round(prisEfterRot(120, 1.0) * 0.7),
      kvm140Tegel: Math.round(prisEfterRot(140, 1.25) * 0.7),
      kvm165Betong: Math.round(prisEfterRot(165, 1.0) * 0.7),
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
          description="Komplett takbyte, omläggning av befintliga pannor eller riktade punktinsatser, i Stockholm och hela länet. Fast pris efter kostnadsfri takkontroll, 30 års Monier-garanti, ROT-avdrag tillämpas."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Tjänster", href: "/tjanster" },
            { label: "Takläggning" },
          ]}
          backgroundImage="/images/hero-house.jpg"
          imageAlt="Villa i Stockholm med nylagt tak"
        />

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
                  from: formatKr(priser.takbyte.kvm120Betong),
                  fromLabel: "Från, 120 m² betong efter ROT",
                },
                {
                  anchor: "takomlaggning",
                  title: "Takomläggning",
                  desc: "Befintliga pannor lyfts av, nytt undertak monteras (papp + läkt), pannorna läggs tillbaka.",
                  when: "Tak under 30 år, pannor i bra skick men undertaket slutkört.",
                  from: formatKr(priser.omlaggning.kvm120Betong),
                  fromLabel: "Från, 120 m² betong efter ROT",
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

        {/* ── DETALJER: TAKBYTE ─────────────────── */}
        <section
          id="takbyte"
          className="py-16 lg:py-24 scroll-mt-20"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
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
                  Fast pris efter besiktning, inga tillägg under vägen. Vi
                  hanterar bygglovsansökan om du byter taktyp (t.ex. tegel till
                  plåt). Hela arbetet regleras i ett ABT-06-kontrakt.
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
                          {formatKr(priser.takbyte.kvm120Betong)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">140 m²</td>
                        <td className="px-4 py-3 text-gray-600">Tegelpannor</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.takbyte.kvm140Tegel)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">165 m²</td>
                        <td className="px-4 py-3 text-gray-600">
                          Plåttak (bandtäckt)
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.takbyte.kvm165Plat)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Uppskattningar för sadeltak utan större genomföringar.
                  Exakt pris efter kostnadsfri takkontroll.
                </p>
                <p className="text-sm">
                  <Link
                    href="/priser#takraknare"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    Räkna ut ditt pris i Takräknaren →
                  </Link>
                </p>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
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
                          {formatKr(priser.omlaggning.kvm120Betong)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">140 m²</td>
                        <td className="px-4 py-3 text-gray-600">Tegel</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.omlaggning.kvm140Tegel)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">165 m²</td>
                        <td className="px-4 py-3 text-gray-600">Betong</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold text-right tabular-nums">
                          {formatKr(priser.omlaggning.kvm165Betong)}
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

        {/* ── KUNDOMDÖMEN ───────────────────────── */}
        <ReviewCarousel />

        {/* ── FAQ ───────────────────────────────── */}
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
              Boka kostnadsfri takkontroll <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
