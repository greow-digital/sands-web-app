import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Phone, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { omraden, getOrt } from "@/lib/omraden";
import { getProjektByOrt } from "@/lib/projekt";

export async function generateStaticParams() {
  return omraden.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ort = getOrt(slug);
  if (!ort) return {};
  return {
    alternates: { canonical: `/omraden/${slug}` },
    title: `Takläggare i ${ort.name} | Sands Entreprenad`,
    description: `Sands Entreprenad utför takbyten och takomläggningar i ${ort.name}. Certifierad Monier Takpartner, boka kostnadsfri takkontroll idag.`,
    openGraph: {
      title: `Takläggare i ${ort.name} | Sands Entreprenad`,
      description: ort.beskrivning,
    },
  };
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

  const ortProjekt = getProjektByOrt(ort.name);

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
          backgroundImage="/images/hero-house.jpg"
          imageAlt={`Takläggning i ${ort.name}`}
        />

        {/* ── TJÄNSTER + SIDEBAR ──────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <h2
                  className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em] mb-6"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Vad vi erbjuder i {ort.name}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    "Takomläggning med Monier-garanti",
                    "Betongtak, tegeltak, plåttak & papptak",
                    "Eternitsanering med certifierad partner",
                    "Takfönster och takkupor",
                    "Hängrännor, stuprör och vindskivor",
                    "Totalentreprenad enligt ABT-06",
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

                {ort.stadsdelar && (
                  <div className="mb-10">
                    <h3
                      className="text-base font-bold mb-3"
                      style={{ color: "var(--color-dark)" }}
                    >
                      Stadsdelar & orter vi täcker
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {ort.stadsdelar}
                    </p>
                  </div>
                )}

                <div className="mb-10 rounded-2xl border border-gray-100 bg-[#F8F9FB] p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Letar du efter <strong>Stockholms bästa takläggare</strong> i {ort.name}?{" "}
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
              </aside>
            </div>
          </div>
        </section>

        {/* ── PROCESS ───────────────────────────── */}
        <section
          className="py-16 lg:py-20 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-10 text-center"
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

        {/* ── PROJEKT I OMRÅDET ────────────────── */}
        {ortProjekt.length > 0 && (
          <section className="py-16 lg:py-24 bg-white border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Referenser
                  </p>
                  <h2
                    className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em]"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    Projekt i {ort.name}
                  </h2>
                </div>
                <Link
                  href="/projekt"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
                >
                  Alla projekt <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {ortProjekt.slice(0, 8).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projekt/${p.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3
                      className="text-sm font-bold group-hover:text-[#2B74FC] transition-colors"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.typ} · {p.kvm} kvm
                    </p>
                  </Link>
                ))}
              </div>

              {ortProjekt.length > 8 && (
                <div className="text-center mt-8">
                  <Link
                    href="/projekt"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
                  >
                    Se alla {ortProjekt.length} projekt i {ort.name}{" "}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

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
        <section className="py-16 lg:py-24 border-t border-gray-100">
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
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={14} />
              </Link>
              <a
                href="tel:0828388"
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
