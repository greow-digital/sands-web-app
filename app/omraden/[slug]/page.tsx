import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Phone, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import FormPromise from "@/components/FormPromise";
import { omraden, getOrt } from "@/lib/omraden";
import { pageMeta } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import type { ProjektCard } from "@/sanity/lib/types";
import { matchProjektForOrt } from "@/lib/projekt-matching";
import RelateradeProjekt from "@/components/RelateradeProjekt";
import OmdomenInline from "@/components/OmdomenInline";
import TaktestInlineCta from "@/components/TaktestInlineCta";

export async function generateStaticParams() {
  // norrtalje har en egen dedikerad route (app/omraden/norrtalje/page.tsx)
  // och exkluderas här för att undvika att två sidor löser samma path.
  return omraden
    .filter((o) => o.slug !== "norrtalje")
    .map((o) => ({ slug: o.slug }));
}

// Per-slug config. Only hasselby has a full bespoke override; all others
// use the shared template. Descriptions are otherwise auto-built from the
// ort's stadsdelar so each area page gets a specific, ~150-char meta
// description (thin/generic descriptions get overridden by Google with
// on-page text — see the Järfälla SERP where our old desc was ignored).
// shortTitle: true -> omit "30 års" from title to stay ≤60 chars (long slugs).
const OMRADE_CONFIG: Record<
  string,
  { customTitle?: string; customDesc?: string; shortTitle?: boolean }
> = {
  hasselby: {
    customTitle: "Takläggare i Hässelby, villaspecialist | Sands",
    customDesc:
      "Takläggare i Hässelby villastad, gård och strand. Specialist på 50-60-talsvillor. Fast pris, 30 års garanti och ROT på fakturan.",
  },
  "upplands-vasby": { shortTitle: true },
  "upplands-bro": { shortTitle: true },
};

// "Jakobsberg, Kallhäll, Barkarby, Viksjö" -> "Jakobsberg, Kallhäll och Barkarby"
function joinStadsdelar(stadsdelar: string | undefined, max: number): string {
  if (!stadsdelar) return "";
  const parts = stadsdelar
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} och ${parts[parts.length - 1]}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ort = getOrt(slug);
  if (!ort) return {};

  const cfg = OMRADE_CONFIG[slug] ?? {};

  // Komma i stället för tankstreck: projektets skrivregler tillåter inte
  // en-streck utanför sifferintervall.
  const title =
    cfg.customTitle ??
    (cfg.shortTitle
      ? `Takläggare i ${ort.name}, fast pris & garanti | Sands`
      : `Takläggare i ${ort.name}, fast pris & 30 års garanti | Sands`);

  const tail =
    "Fast pris, 30 års garanti och ROT på fakturan. Boka kostnadsfri takkontroll.";
  // Try 3 stadsdelar, fall back to 2, then none, to stay within 155 chars
  // (SEO.md §6 kräver meta description ≤155 tecken).
  const buildDesc = (): string => {
    for (const n of [3, 2]) {
      const hoods = joinStadsdelar(ort.stadsdelar, n);
      const candidate = `Takläggare i ${ort.name}, ${hoods}. ${tail}`;
      if (hoods && candidate.length <= 155) return candidate;
    }
    return `Takläggare i ${ort.name}. ${tail}`;
  };
  const description = cfg.customDesc ?? buildDesc();

  return pageMeta({
    path: `/omraden/${slug}`,
    title,
    description,
  });
}

export default async function OmradesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ort = getOrt(slug);
  if (!ort) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Takläggare i ${ort.name}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Sands Entreprenad Stockholm AB",
      telephone: "08-28 38 88",
      url: "https://www.sandsab.se",
    },
    areaServed: {
      "@type": "City",
      name: ort.name,
    },
    description: ort.beskrivning,
  };

  const allaProjekt = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];
  const ortProjekt = matchProjektForOrt(allaProjekt, slug, ort.name);

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PageHero
          eyebrow={ort.region}
          title="Takläggare i"
          titleAccent={ort.name}
          description={ort.beskrivning}
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Områden", href: "/omraden" },
            { label: ort.name },
          ]}
          backgroundImage="/images/bromma-tak-hero.jpg"
          imageAlt={`Takläggning i ${ort.name}`}
        />

        {/* ── TJÄNSTER + SIDEBAR ──────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <h2
                  className="text-[32px] lg:text-[44px] font-extrabold tracking-[-0.02em] mb-6"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Takbyte och takomläggning i {ort.name}
                </h2>

                {/* Tier A får unik brödtext. Övriga faller tillbaka på
                    beskrivningen, som redan visas i heron. */}
                {ort.unikText && (
                  <div className="mb-8 space-y-4">
                    {ort.unikText.split("\n\n").map((p, i) => (
                      <p
                        key={i}
                        className="text-base text-gray-600 leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {/* Listan är medvetet renodlat takrelaterad. Tidigare stod
                    "Totalentreprenad enligt ABT-06" här, vilket drog in
                    generella byggqueries (bygghissar, golvavjämning,
                    byggstädning) som vi inte säljer. */}
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    "Takbyte med upp till 30 års Monier-garanti",
                    "Omläggning av tak med befintliga pannor",
                    "Betongtak, tegeltak, plåttak & papptak",
                    "Eternitsanering med certifierad partner",
                    "Takfönster, takkupor och taksäkerhet",
                    "Hängrännor, stuprör och vindskivor",
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

                {/* Stadsdelarna renderas som eget innehåll när texter finns.
                    Tidigare låg de bara som en kommaseparerad rad, vilket inte
                    fångade svansen ("takfirma tumba", "tak djursholm"). */}
                {ort.stadsdelsTexter?.length ? (
                  <div className="mb-10">
                    <h3
                      className="text-xl font-bold mb-4"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Takarbeten i {ort.name}s olika delar
                    </h3>
                    <div className="space-y-4">
                      {ort.stadsdelsTexter.map((d) => (
                        <div key={d.namn}>
                          <h4
                            className="text-base font-bold mb-1"
                            style={{ color: "var(--color-dark)" }}
                          >
                            {d.namn}
                          </h4>
                          <p className="text-base text-gray-600 leading-relaxed">
                            {d.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : ort.stadsdelar ? (
                  <div className="mb-10">
                    <h3
                      className="text-base font-bold mb-3"
                      style={{ color: "var(--color-dark)" }}
                    >
                      Stadsdelar & orter vi täcker
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Vi lägger tak i hela {ort.name}, bland annat i{" "}
                      {ort.stadsdelar}.
                    </p>
                  </div>
                ) : null}

                <div className="mb-10 rounded-2xl border border-gray-100 bg-[#F8F9FB] p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Letar du efter en{" "}
                    <Link
                      href="/"
                      className="font-semibold text-[#2B74FC] hover:underline"
                    >
                      takläggare i Stockholm
                    </Link>
                    {" "}med verksamhet i {ort.name}?{" "}
                    <Link
                      href="/basta-taklaggare-stockholm"
                      className="font-semibold text-[#2B74FC] hover:underline"
                    >
                      Läs vår köpguide
                    </Link>
                    : sju kriterier att gå igenom, fem saker att vara extra noga med och tio frågor som är bra att ställa innan du skriver kontrakt.
                  </p>
                </div>

                {/* Prisexempel */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB]">
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Prisexempel, {ort.name}
                  </div>
                  <div
                    className="text-2xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    Från ca 1 200 kr/m²
                  </div>
                  <div className="text-sm text-gray-500">
                    efter ROT-avdrag 30%. Fast pris efter kostnadsfri
                    besiktning.
                  </div>
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

        {/* ── PROCESS ───────────────────────────── */}
        <section
          className="py-20 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.02em] mb-10 text-center"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Så går det till
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  num: "01",
                  title: "Hembesök",
                  text: `Kostnadsfritt hembesök i ${ort.name}`,
                },
                {
                  num: "02",
                  title: "Fast offert",
                  text: "Fast pris utan förbindelser",
                },
                {
                  num: "03",
                  title: "Utförande",
                  text: "Arbetet utförs effektivt och noggrant",
                },
                {
                  num: "04",
                  title: "Takkontroll",
                  text: "Vi besiktigar tillsammans med dig",
                },
              ].map((p) => (
                <div key={p.num}>
                  <div
                    className="text-3xl font-extrabold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {p.num}
                  </div>
                  <div
                    className="text-base font-bold mb-1"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {p.title}
                  </div>
                  <div className="text-sm text-gray-500">{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TAKTEST-CTA ──────────────────────── */}
        <section className="py-10 lg:py-14 bg-white border-t border-gray-100">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
            <TaktestInlineCta
              heading={`Osäker på ditt tak i ${ort.name}?`}
              text="Gör vårt kostnadsfria taktest på en minut, så får du en personlig bedömning av takets skick, innan du bokar en takkontroll."
            />
          </div>
        </section>

        {/* ── PROJEKT I OMRÅDET ────────────────── */}
        <RelateradeProjekt
          projekt={ortProjekt}
          heading={`Projekt vi har utfört i ${ort.name}`}
          limit={6}
        />

        {/* ── OMDÖMEN ─────────────────────────── */}
        <OmdomenInline
          heading="Vad våra kunder säger"
          ort={ort.name}
          match={["tak"]}
          background
        />

        {/* ── GRANNAR ───────────────────────────── */}
        {ort.grannar.length > 0 && (
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
                {ort.grannar.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/omraden/${g.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
                    style={{ color: "var(--color-dark)" }}
                  >
                    <MapPin
                      size={12}
                      style={{ color: "var(--color-primary)" }}
                    />
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ────────────────────────── */}
        <section className="py-20 lg:py-28 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-[26px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Boka takkontroll i {ort.name}
            </h2>
            <p className="text-gray-600 mb-8">
              Vi inspekterar ditt tak kostnadsfritt och ger dig ett fast pris
              utan förbindelser.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-9 py-[18px] rounded-full font-semibold text-white text-base transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
              <a
                href="tel:08283888"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#2B74FC] transition-colors"
              >
                <Phone size={13} />
                Eller ring 08-28 38 88
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
