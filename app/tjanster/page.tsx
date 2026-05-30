import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { tjanster } from "@/lib/tjanster";

import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/tjanster",
  title: "Takläggning, takbyte & renovering i Stockholm | Sands Entreprenad",
  description:
    "Alla taktjänster i Stockholm: takbyte, takläggning, takrenovering. Plåttak, tegeltak, papptak. Fast pris, 30 års garanti, ROT-avdrag tillämpas.",
});

// Priority order, also drives the main nav. Update both together.
const TJANST_ORDER = [
  "taklaggning",
  "takbesiktning",
  "fasadrenovering",
  "takfonsterkupor",
  "hangrannorstupror",
  "taksakerhet",
  "badrumsrenovering",
  "koksrenovering",
  "totalentreprenad",
];

export default function TjansterPage() {
  const huvudtjanster = tjanster
    .filter((t) => t.kategori === "tjanst")
    .sort(
      (a, b) => TJANST_ORDER.indexOf(a.slug) - TJANST_ORDER.indexOf(b.slug)
    );
  const taktyper = tjanster.filter((t) => t.kategori === "taktyp");

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Våra tjänster"
          title="Allt vi kan hjälpa"
          titleAccent="dig med"
          description="Från komplett takomläggning och fasadrenovering till badrum och kök, alltid med fast pris och totalentreprenad enligt ABT-06."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Tjänster" }]}
        />

        {/* ── TJÄNSTER ────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                Tjänster
              </p>
              <h2
                className="text-[28px] lg:text-[38px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Våra huvudtjänster
              </h2>
            </div>

            <div className="space-y-12">
              {huvudtjanster.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tjanster/${t.slug}`}
                  className="group grid lg:grid-cols-[1fr_1.4fr] gap-8 items-center"
                >
                  {t.image && (
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={t.image}
                        alt={t.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <h3
                      className="text-2xl lg:text-3xl font-extrabold mb-3 group-hover:text-[#2B74FC] transition-colors"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      {t.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 max-w-xl">
                      {t.intro}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Läs mer <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOKA TAKKONTROLL (formulär + trust) ── */}
        <section className="py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Boka takkontroll
                </p>
                <h2
                  className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Få fast pris på din tjänst, oavsett tak
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Vi gör en kostnadsfri takkontroll på plats och lämnar ett
                  komplett fast pris inom 24 timmar. Inga dolda kostnader, inga
                  säljsamtal i efterhand.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "BraByggare 4.8★ med 54 omdömen",
                    "2 500+ utförda projekt sedan 2016",
                    "Monier-certifierad takpartner",
                    "30 års tätt tak-garanti",
                    "F-skatt, ansvars- och allriskförsäkring",
                    "Fast pris i ABT-06-kontrakt",
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
                <p className="text-xs text-gray-500">
                  Svar inom 24 timmar. Du kan även ringa{" "}
                  <a
                    href="tel:0828388"
                    className="font-semibold text-[#2B74FC] hover:underline"
                  >
                    08-28 38 88
                  </a>
                  .
                </p>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
              </aside>
            </div>
          </div>
        </section>

        {/* ── TAKTYPER ────────────────────────────── */}
        <section
          className="py-16 lg:py-24 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                Taktyper
              </p>
              <h2
                className="text-[28px] lg:text-[38px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vilka tak vi lägger
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl">
                Vi är specialister på alla vanliga taktyper, alltid med
                Monier-material och upp till 30 års garanti.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
              {taktyper.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tjanster/${t.slug}`}
                  className="group block"
                >
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4 bg-gray-200">
                    {t.image && (
                      <Image
                        src={t.image}
                        alt={t.title}
                        fill
                        sizes="(max-width: 640px) 45vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h4
                    className="text-base font-bold text-center group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {t.title}
                  </h4>
                  <p
                    className="text-xs text-center mt-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {t.prisIntervall}
                  </p>
                </Link>
              ))}
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
              Redo att starta?
            </h2>
            <p className="text-gray-600 mb-8">
              Boka en kostnadsfri takkontroll, vi ger dig ett fast pris utan
              förbindelser.
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
