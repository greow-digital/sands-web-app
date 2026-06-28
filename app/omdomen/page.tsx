import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
import {
  testimonials,
  SOURCE_LABEL,
  SOURCE_META,
  PLATFORM_STATS,
  TOTAL_REVIEWS,
  AVG_RATING,
} from "@/lib/testimonials";

export const metadata: Metadata = pageMeta({
  path: "/omdomen",
  title: `Kundomdömen: ${TOTAL_REVIEWS} omdömen, ${AVG_RATING} av 5 | Sands Entreprenad`,
  description:
    "Läs riktiga kundomdömen om Sands Entreprenad från BraByggare, Offerta och Servicefinder. 4,8 av 5 i snitt på takbyte, takomläggning och fasad i Stockholmsområdet.",
});

const omdömen = testimonials;

export default function OmdömenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sands Entreprenad Stockholm AB",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: AVG_RATING.replace(",", "."),
      reviewCount: String(TOTAL_REVIEWS),
      bestRating: "5",
    },
    review: omdömen.slice(0, 8).map((o) => ({
      "@type": "Review",
      author: { "@type": "Person", name: o.name },
      reviewRating: { "@type": "Rating", ratingValue: o.betyg, bestRating: 5 },
      reviewBody: o.text,
      datePublished: o.datumISO,
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

        <PageHero
          eyebrow="Kundomdömen"
          title="Vad våra"
          titleAccent="kunder säger"
          description="Riktiga omdömen från BraByggare, Offerta och Servicefinder. Vi är stolta över att få göra skillnad för våra kunder."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Omdömen" }]}
        />

        {/* Sammanfattning: totalt snitt + per-marknadsplats */}
        <section className="py-12 lg:py-16 border-b border-gray-100">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div
              className="text-[44px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              {AVG_RATING} / 5
            </div>
            <p className="text-gray-600 mt-3">
              Snittbetyg från <strong>{TOTAL_REVIEWS} omdömen</strong> på
              BraByggare, Offerta och Servicefinder
            </p>

            {/* Per-marknadsplats-pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              {PLATFORM_STATS.map((p) => {
                const meta = SOURCE_META[p.source];
                return (
                  <div
                    key={p.source}
                    className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5"
                  >
                    {meta.logo ? (
                      <Image
                        src={meta.logo}
                        alt={meta.label}
                        width={120}
                        height={100}
                        className="h-6 w-auto"
                      />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      <strong style={{ color: "var(--color-dark)" }}>
                        {p.antal}
                      </strong>{" "}
                      omdömen
                      <span className="text-gray-300 mx-1.5">·</span>
                      <span className="inline-flex items-center gap-0.5 font-semibold">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {p.snitt}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Alla omdömen */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {omdömen.map((o, i) => {
                const meta = SOURCE_META[o.source];
                return (
                  <div
                    key={`${o.name}-${o.datumISO}-${i}`}
                    className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: o.betyg }).map((_, s) => (
                          <Star
                            key={s}
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      {meta.logo ? (
                        <Image
                          src={meta.logo}
                          alt={meta.label}
                          width={120}
                          height={100}
                          className="h-5 w-auto opacity-70"
                        />
                      ) : (
                        <span
                          className="text-xs font-bold"
                          style={{ color: meta.color }}
                        >
                          {SOURCE_LABEL[o.source]}
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-gray-700 leading-relaxed mb-5 flex-1">
                      &ldquo;{o.text}&rdquo;
                    </p>
                    <div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {o.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {o.tjanst}
                        {o.ort ? ` · ${o.ort}` : ""}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {o.datum}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-14 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em] mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Bli nästa nöjda kund
            </h2>
            <p className="text-gray-600 mb-6">
              Boka kostnadsfri takkontroll idag.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få gratis offert <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
