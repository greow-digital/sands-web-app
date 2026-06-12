import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import FormPromise from "@/components/FormPromise";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/omraden/norrtalje",
  title:
    "Takläggare Norrtälje: takbyte med fast pris & 30 års garanti | Sands",
  description:
    "Auktoriserad takläggare i Norrtälje och hela Roslagen. Takbyte, takomläggning och takrenovering för villor och fritidshus. Fast pris, ROT-avdrag och upp till 30 års garanti. Boka kostnadsfri takkontroll.",
});

// FAQ-texterna används både i den synliga FAQ-sektionen och i
// FAQPage-schemat nedan, så de är garanterat identiska.
const FAQ: { q: string; a: string }[] = [
  {
    q: "Vad kostar ett takbyte i Norrtälje?",
    a: "De flesta villatak på 120-160 m² landar mellan ca 150 000 och 250 000 kr beroende på material, före ROT-avdrag. Betongpannor från ca 1 200 kr/m², tegel från ca 1 500 kr/m². Du får ett bindande fast pris efter en kostnadsfri takkontroll.",
  },
  {
    q: "Byter ni tak på fritidshus och sommarstugor?",
    a: "Ja, fritidshus i Roslagen är en stor del av vår vardag. Papptak och plåttak är vanligast, och ROT-avdraget gäller även fritidshus du äger.",
  },
  {
    q: "Hur påverkar kustklimatet mitt tak?",
    a: "Salthaltig luft sliter snabbare på plåtdetaljer, infästningar och hängrännor, och vindutsatta lägen kräver extra noggrann montering. Bor du nära kusten rekommenderar vi takkontroll vart 3-5 år.",
  },
  {
    q: "Behöver jag bygglov för takbyte i Norrtälje?",
    a: "Byter du till samma material och kulör krävs normalt varken bygglov eller anmälan. Vid byte av material, kulör eller takform kan det krävas, reglerna beror på detaljplanen. Vi hjälper dig stämma av med Norrtälje kommun innan arbetet startar.",
  },
  {
    q: "Hur snabbt kan ni göra en takkontroll i Norrtälje?",
    a: "Hör av dig så återkommer vi samma vardag och bokar in en kostnadsfri takkontroll. Efter kontrollen får du ett fast prisförslag inom 24 timmar.",
  },
  {
    q: "Vilka garantier lämnar ni?",
    a: "Som Monier-certifierad takpartner kan vi lämna upp till 30 års garanti. Vi har F-skattsedel, är fullförsäkrade och arbetar enligt ABT-06.",
  },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Takläggning och takbyte",
  provider: {
    "@type": "RoofingContractor",
    name: "Sands Entreprenad Stockholm AB",
    telephone: "+468283888",
    url: "https://www.sandsab.se",
    identifier: "559063-8135",
  },
  areaServed: [
    { "@type": "Place", name: "Norrtälje" },
    { "@type": "Place", name: "Rimbo" },
    { "@type": "Place", name: "Hallstavik" },
    { "@type": "Place", name: "Älmsta" },
    { "@type": "Place", name: "Väddö" },
    { "@type": "Place", name: "Rådmansö" },
    { "@type": "Place", name: "Grisslehamn" },
    { "@type": "Place", name: "Bergshamra, Norrtälje" },
  ],
  url: "https://www.sandsab.se/omraden/norrtalje",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const OMRADEN: { namn: string; text: string }[] = [
  {
    namn: "Norrtälje stad",
    text: "villaområden som Grind, Solbacka och Görla, med blandning av äldre trävillor och nyare kataloghus. Betongpannor och tegel dominerar.",
  },
  {
    namn: "Rimbo",
    text: "växande villaort med många 70- och 80-talshus där taken nu når slutet av sin livslängd. Vanligaste jobbet: byte från äldre betongpannor till nya, med ny underlagspapp och läkt.",
  },
  {
    namn: "Hallstavik",
    text: "brukssamhälle med äldre villabestånd och en hel del eternittak som behöver säker rivning och ersättning.",
  },
  {
    namn: "Älmsta & Väddö",
    text: "fritidshustätt kustområde. Papptak, plåttak och vindexponerade lägen som kräver noggrann infästning.",
  },
  {
    namn: "Rådmansö & Grisslehamn",
    text: "skärgårds- och kustlägen där saltluften sliter extra på plåtdetaljer. Vi väljer material och detaljer därefter.",
  },
  {
    namn: "Bergshamra",
    text: "villor och fritidshus vid Norrtäljevikens södra sida.",
  },
];

const GRANNAR = [
  { slug: "osteraker", name: "Österåker" },
  { slug: "vallentuna", name: "Vallentuna" },
  { slug: "sigtuna", name: "Sigtuna" },
];

export default function NorrtaljePage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
        />

        <PageHero
          eyebrow="Norrtälje kommun & Roslagen"
          title="Takläggare i"
          titleAccent="Norrtälje och hela Roslagen"
          description="Takbyte, takomläggning och takrenovering i Norrtälje kommun, från Rimbo till Grisslehamn. Fast pris efter kostnadsfri takkontroll, ROT-avdrag direkt på fakturan och upp till 30 års garanti."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Områden", href: "/omraden" },
            { label: "Norrtälje" },
          ]}
          backgroundImage="/images/projekt-vitthus-efter.jpg"
          imageAlt="Färdigt takbyte med nya takpannor utfört av Sands Entreprenad"
        />

        {/* ── HERO-CTA + TRUST ─────────────────── */}
        <section className="border-b border-gray-100 bg-[#F8F9FB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                4,8 på BraByggare
              </span>
              <span className="text-gray-300">·</span>
              <span className="font-medium">2 500+ tak sedan 2016</span>
              <span className="text-gray-300">·</span>
              <span className="font-medium">Monier-certifierad takpartner</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
              <a
                href="tel:08283888"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: "var(--color-dark)" }}
              >
                <Phone size={14} style={{ color: "var(--color-primary)" }} />
                Eller ring 08-28 38 88
              </a>
            </div>
          </div>
        </section>

        {/* ── INNEHÅLL + SIDOFORM ──────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div className="prose-norrtalje max-w-none">
                {/* Sektion 1 */}
                <h2
                  className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Din takläggare i Roslagen
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Norrtälje kommun är speciell för oss som lägger tak. Här möts
                  två helt olika takvärldar: åretruntvillorna i Norrtälje stad,
                  Rimbo och Hallstavik, och tiotusentals fritidshus längs
                  kusten, från Väddö till Rådmansö. De ställer olika krav, och
                  vi hanterar båda.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Kustklimatet i Roslagen sliter mer på tak än inlandsklimat.
                  Salthaltig luft påskyndar korrosion på plåtdetaljer,
                  infästningar och hängrännor, och de öppna, vindutsatta lägena
                  vid kusten ställer högre krav på korrekt montering av pannor
                  och vindskivor. Vid en takkontroll i Norrtälje tittar vi
                  därför extra noga på just plåtarbeten, nockpannor och
                  infästningar, det är där kustklimatet syns först.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-10">
                  Vi utför takbyte och takomläggning med betongpannor, tegel,
                  plåt och papp, och tar hand om hela kedjan: besiktning,
                  materialval, ROT-avdrag, ställning, läggning och
                  slutbesiktning enligt ABT-06.
                </p>

                {/* Sektion 2 */}
                <h2
                  className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Takbyte på fritidshus och sommarstugor
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Roslagen är ett av Sveriges tätaste fritidshusområden, och en
                  stor del av taken på sommarstugor lades för 40-60 år sedan. Vi
                  byter regelbundet tak på fritidshus och vet vad som skiljer
                  dem från villaprojekt:
                </p>
                <ul className="space-y-2.5 mb-4">
                  {[
                    "Papptak och plåttak är vanligast, snabbare byten och lägre kostnad per kvm",
                    "Enklare byggnader kräver ofta mindre ställning, vilket sänker totalpriset",
                    "Vi planerar gärna arbetet utanför högsäsong så taket är klart till sommaren",
                    "ROT-avdrag gäller även fritidshus, så länge du äger fastigheten",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] text-gray-600 leading-relaxed"
                    >
                      <CheckCircle
                        size={16}
                        className="shrink-0 mt-1"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-10">
                  Osäker på om stugans tak klarar fler säsonger? En kostnadsfri
                  takkontroll ger dig svar, och du får ett fast prisförslag om
                  något behöver göras.
                </p>

                {/* Sektion 3 */}
                <h2
                  className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Eternittak i Roslagen? Vi hanterar asbest säkert
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  På äldre hus och gårdar runt Norrtälje är eternittak
                  fortfarande vanliga. Eternit innehåller asbest och får inte
                  rivas hur som helst, det kräver behörighet, skyddsutrustning
                  och korrekt deponering. Vi är fullförsäkrade och hanterar hela
                  processen: säker rivning, borttransport och nytt tak.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-10">
                  <Link
                    href="/blogg/eternittak-asbest"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    Läs mer: Eternittak och asbest, det här gäller
                  </Link>
                  {"  ·  "}
                  <Link
                    href="/tjanster/eternittak"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    Tjänst: Byte av eternittak
                  </Link>
                </p>

                {/* Sektion 4 */}
                <h2
                  className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Här jobbar vi i Norrtälje kommun
                </h2>
                <div className="space-y-3 mb-10">
                  {OMRADEN.map((o) => (
                    <p
                      key={o.namn}
                      className="text-[15px] text-gray-600 leading-[1.75]"
                    >
                      <strong className="text-gray-900">{o.namn}</strong>
                      {": "}
                      {o.text}
                    </p>
                  ))}
                </div>

                {/* Sektion 5 */}
                <h2
                  className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad kostar ett takbyte i Norrtälje?
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Priset styrs av takyta, material och takets komplexitet, inte
                  av postnumret. Som riktvärden (samma priser som i hela
                  Stockholms län):
                </p>
                <ul className="space-y-2.5 mb-4">
                  {[
                    "Betongpannor: från ca 1 200 kr/m², villa 140 m² från ca 169 000 kr",
                    "Tegeltak: från ca 1 500 kr/m², villa 140 m² från ca 210 000 kr",
                    "Plåttak: från ca 1 800 kr/m²",
                    "Papptak (vanligt på fritidshus): från ca 800 kr/m²",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] text-gray-600 leading-relaxed"
                    >
                      <CheckCircle
                        size={16}
                        className="shrink-0 mt-1"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Priserna är före ROT-avdrag. Du får alltid ett bindande fast
                  pris efter en kostnadsfri takkontroll, inga dolda tillägg.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-10">
                  <Link
                    href="/priser"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    Se fullständiga prisexempel och räkna på ditt tak
                  </Link>
                </p>

                {/* Sektion 6: DOLD CASE-MALL (publiceras EJ) */}
                {/*
                H2: Senaste takprojekt i Norrtälje
                [FOTO: takbyte-{ort}-{år}.jpg, alt: "Takbyte i {ort}, Norrtälje kommun, {material} {yta} m²"]
                {Ort}, {år}, {material}, {yta} m²
                Utmaning: {1-2 meningar} / Lösning: {1-2 meningar} / Resultat: {1 mening + kundcitat}
                */}
                <div className="rounded-2xl border border-gray-100 bg-[#F8F9FB] p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Se exempel på vårt arbete:{" "}
                    <Link
                      href="/projekt/volmvagen-jarfalla"
                      className="font-semibold text-[#2B74FC] hover:underline"
                    >
                      Takbyte Volmvägen, Järfälla
                    </Link>
                  </p>
                </div>
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

        {/* ── Sektion 7: FAQ ───────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Vanliga frågor om takbyte i Norrtälje
            </h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl border border-gray-100 bg-white p-6"
                >
                  <h3
                    className="text-base font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p className="text-[15px] text-gray-600 leading-[1.75]">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GRANNAR ──────────────────────────── */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-lg font-bold mb-5"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Takläggare i närliggande kommuner
            </h2>
            <div className="flex flex-wrap gap-3">
              {GRANNAR.map((g) => (
                <Link
                  key={g.slug}
                  href={`/omraden/${g.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                  style={{ color: "var(--color-dark)" }}
                >
                  <MapPin size={12} style={{ color: "var(--color-primary)" }} />
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-[26px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Boka kostnadsfri takkontroll i Norrtälje
            </h2>
            <p className="text-gray-600 mb-8">
              Vi inspekterar ditt tak kostnadsfritt och ger dig ett fast pris
              utan förbindelser. Svar samma vardag, fast prisförslag inom 24 h.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
              <a
                href="tel:08283888"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 font-semibold text-sm hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                style={{ color: "var(--color-dark)" }}
              >
                <Phone size={14} />
                08-28 38 88
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
