import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Phone, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { tjanster, getTjanst } from "@/lib/tjanster";
import { pageMeta } from "@/lib/seo";
import OmradenInline from "@/components/OmradenInline";

// Per-slug SEO overrides. Only listed slugs get the hand-tuned copy
// below; everything else falls back to the generic `${title} i Stockholm`
// template further down.
const SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  taklaggning: {
    title: "Takläggning Stockholm: fast pris, 30 års garanti | Sands AB",
    description:
      "Professionell takläggning i Stockholm av certifierade takläggare. Plåttak, tegeltak, papptak. Fast pris från start, ROT-avdrag, kostnadsfri offert.",
  },
  tegeltak: {
    title: "Tegeltak Stockholm: från 1 500 kr/m² | Sands Entreprenad",
    description:
      "Tegeltak i Stockholm från 1 500 kr/m². Tegelpannor med 30 års garanti, ROT-avdrag tillämpas. Certifierade takläggare, kostnadsfri offert inom 24 h.",
  },
  plattak: {
    title: "Plåttak Stockholm: från 1 800 kr/m² | Sands Entreprenad",
    description:
      "Plåttak i Stockholm från 1 800 kr/m². Bandtäckt, falsat eller klickfals. 30 års garanti, ROT-avdrag, certifierade takläggare i hela Stockholm.",
  },
  papptak: {
    title: "Papptak Stockholm: från 800 kr/m² | Sands Entreprenad",
    description:
      "Papptak (takpapp) i Stockholm från 800 kr/m². Lång hållbarhet, fast pris, 30 års garanti. ROT-avdrag tillämpas, offert inom 24 h.",
  },
  betongtak: {
    title: "Betongtak Stockholm: betongpannor från 1 200 kr/m² | Sands",
    description:
      "Betongtak och betongpannor i Stockholm från 1 200 kr/m². 30 års garanti, ROT-avdrag, BraByggare-certifierad takläggare. Få prisförslag idag.",
  },
  takfonsterkupor: {
    title: "Takfönster & takkupor i Stockholm | Sands Entreprenad",
    description:
      "Montering av takfönster och takkupor i Stockholm. Erfarna takläggare, kvalitetsmaterial, 30 års garanti, ROT-avdrag tillämpas.",
  },
};

export async function generateStaticParams() {
  return tjanster.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTjanst(slug);
  if (!t) return {};
  const override = SEO_OVERRIDES[slug];
  return pageMeta({
    path: `/tjanster/${slug}`,
    title: override?.title ?? `${t.title} i Stockholm | Sands Entreprenad`,
    description: override?.description ?? t.intro,
  });
}

export default async function TjanstPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTjanst(slug);
  if (!t) notFound();

  const relaterade = t.relaterade
    ? tjanster.filter((x) => t.relaterade!.includes(x.slug))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.h1,
    provider: {
      "@type": "LocalBusiness",
      name: "Sands Entreprenad Stockholm AB",
      telephone: "08-28 38 88",
      url: "https://www.sandsab.se",
    },
    areaServed: "Stockholms län",
    description: t.intro,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        <PageHero
          eyebrow={t.title}
          title={t.h1.replace(` ${t.title}`, "")}
          titleAccent={t.title}
          description={t.intro}
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Tjänster", href: "/tjanster" },
            { label: t.title },
          ]}
          backgroundImage={t.image}
          imageAlt={t.title}
        />

        {/* ── BESKRIVNING + SIDEBAR FORM ─────────── */}
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
                  Om {t.title.toLowerCase()}
                </h2>
                {t.text.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-base text-gray-600 leading-relaxed mb-4"
                  >
                    {para}
                  </p>
                ))}

                {/* Pris */}
                {t.prisIntervall && (
                  <div className="mt-8 p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB]">
                    <div
                      className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Prisintervall
                    </div>
                    <div
                      className="text-2xl font-extrabold mb-1"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      {t.prisIntervall}
                    </div>
                    <p className="text-sm text-gray-500">
                      Alltid fast pris efter kostnadsfri takkontroll.
                    </p>
                  </div>
                )}

                {/* Vad ingår / process */}
                {t.ingår && (
                  <div className="mt-10">
                    <h3
                      className="text-xl font-bold mb-5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Vad ingår
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {t.ingår.map((item) => (
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
                )}

                {t.komponenter && (
                  <div className="mt-10">
                    <h3
                      className="text-xl font-bold mb-5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Komponenter vi monterar
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {t.komponenter.map((k) => (
                        <div
                          key={k.name}
                          className="rounded-2xl border border-gray-100 overflow-hidden bg-white"
                        >
                          <div className="aspect-[4/3] bg-gray-50 relative">
                            <Image
                              src={k.image}
                              alt={k.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div
                              className="text-sm font-bold mb-1"
                              style={{
                                fontFamily: "var(--font-heading)",
                                color: "var(--color-dark)",
                              }}
                            >
                              {k.name}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {k.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {t.process && (
                  <div className="mt-10">
                    <h3
                      className="text-xl font-bold mb-5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      Så går det till
                    </h3>
                    <div className="space-y-6">
                      {t.process.map((p, i) => (
                        <div key={p.step} className="flex gap-5">
                          <div
                            className="text-2xl font-extrabold shrink-0 w-10"
                            style={{
                              fontFamily: "var(--font-heading)",
                              color: "var(--color-primary)",
                            }}
                          >
                            0{i + 1}
                          </div>
                          <div>
                            <div
                              className="text-base font-bold mb-1"
                              style={{ color: "var(--color-dark)" }}
                            >
                              {p.step}
                            </div>
                            <div className="text-sm text-gray-600">
                              {p.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar formulär */}
              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
              </aside>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────── */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Frågor om {t.title.toLowerCase()}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {t.faq.map((f) => (
                <div key={f.q} className="py-6">
                  <h3
                    className="text-base lg:text-lg font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATERADE ─────────────────────────── */}
        {relaterade.length > 0 && (
          <section className="py-14 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                className="text-xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Relaterade tjänster
              </h2>
              <div className="flex flex-wrap gap-3">
                {relaterade.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/tjanster/${r.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border border-gray-200 hover:border-[#2B74FC] hover:text-[#2B74FC]"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {r.title}
                    <ChevronRight size={14} />
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
              Redo att boka?
            </h2>
            <p className="text-gray-600 mb-8">
              Boka en kostnadsfri takkontroll, vi inspekterar ditt tak och
              ger dig ett fast pris utan förbindelser.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Få gratis offert <ArrowRight size={14} />
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

        <OmradenInline />
      </main>
      <Footer />
    </>
  );
}
