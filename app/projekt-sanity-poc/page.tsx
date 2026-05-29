import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FlaskConical, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjektKartaWrapper from "@/components/ProjektKartaWrapper";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard, SanityImageWithMeta } from "@/sanity/lib/types";
import { coordForProjekt } from "@/lib/ort-coords";
import type { ProjektPin } from "@/components/ProjektKarta";
import { getCustomerDensity } from "@/lib/customer-density";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "[POC] Projekt från Sanity | Sands Entreprenad",
  description:
    "Test-vy som hämtar projekt från Sanity CMS. Används internt för att verifiera schema och redaktörsflöde.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

function imgSrc(img: SanityImageWithMeta, w: number, h: number) {
  return urlFor(img).width(w).height(h).fit("crop").url();
}

function imgAlt(img: SanityImageWithMeta | null | undefined, fallback: string) {
  return img?.alt || fallback;
}

export default async function ProjektSanityPocPage() {
  const projekt = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];
  const density = getCustomerDensity();

  const pins: ProjektPin[] = projekt.flatMap((p) => {
    if (!p.slug || !p.ort || !p.title) return [];
    const coord = coordForProjekt(p.ort, p.slug);
    if (!coord) return [];
    return [
      {
        slug: p.slug,
        title: p.title,
        ort: p.ort,
        typ: p.typ,
        kvm: p.kvm,
        ar: p.ar,
        lat: coord.lat,
        lng: coord.lng,
      },
    ];
  });

  const totalProjekt = density.totalCustomers + pins.length;
  // Rundas ner till närmaste 500 så trust-signalen alltid ser ärlig ut
  // ("över 2 500"), oavsett om datat just passerat 2 611 eller 2 999.
  const trustVolym = Math.floor(totalProjekt / 500) * 500;

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* POC-banner */}
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-xs">
            <FlaskConical size={13} className="shrink-0 text-yellow-700" />
            <p className="text-yellow-900">
              <strong>POC-läge:</strong> Sanity-feed,{" "}
              <code className="font-mono">noindex</code>. Redigera på{" "}
              <Link href="/studio" className="underline font-semibold">
                /studio
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Hero: text vänster, karta höger */}
        <section className="relative border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link href="/" className="hover:text-gray-600">
                Hem
              </Link>
              <ChevronRight size={12} />
              <span>Projekt</span>
            </nav>

            <div className="grid lg:grid-cols-[1fr_1.25fr] gap-8 lg:gap-12 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Referenser
                </p>
                <h1
                  className="text-[36px] lg:text-[52px] font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Utförda{" "}
                  <span style={{ color: "var(--color-primary)" }}>projekt</span>
                </h1>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg">
                  Sedan 2016 har vi lagt om över{" "}
                  <strong className="font-semibold text-[#2B74FC]">
                    {trustVolym.toLocaleString("sv-SE")} tak
                  </strong>{" "}
                  i Stockholmsregionen. Här visar vi{" "}
                  <strong className="font-semibold text-[#2B74FC]">
                    {pins.length}
                  </strong>{" "}
                  av de projekt vi är mest stolta över, med bilder och detaljer
                  för varje takbyte.
                </p>
              </div>

              {pins.length > 0 ? (
                <div>
                  <ProjektKartaWrapper
                    pins={pins}
                    densityCells={density.cells}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Projekt-grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {projekt.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  Inga projekt finns i Sanity ännu.
                </p>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2B74FC] hover:underline"
                >
                  Öppna Studion och lägg till ett <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {projekt.map((p) => {
                  if (!p.slug || !p.huvudbild) return null;
                  const sidobilder = (p.bilder ?? []).filter(
                    (b): b is SanityImageWithMeta => Boolean(b?.asset)
                  );
                  return (
                    <Link
                      key={p._id}
                      href={`/projekt-sanity-poc/${p.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-200 relative projekt-thumb">
                        {sidobilder.length >= 2 ? (
                          <div className="grid grid-cols-[1.4fr_1fr] gap-[2px] h-full">
                            <div className="relative">
                              <Image
                                src={imgSrc(p.huvudbild, 800, 600)}
                                alt={imgAlt(p.huvudbild, p.title ?? "")}
                                fill
                                sizes="(max-width: 640px) 60vw, 20vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                                placeholder={
                                  p.huvudbild.asset?.metadata?.lqip
                                    ? "blur"
                                    : "empty"
                                }
                                blurDataURL={
                                  p.huvudbild.asset?.metadata?.lqip ?? undefined
                                }
                              />
                            </div>
                            <div className="grid grid-rows-2 gap-[2px]">
                              {[sidobilder[0], sidobilder[1]].map((b, i) => (
                                <div key={i} className="relative">
                                  <Image
                                    src={imgSrc(b, 500, 400)}
                                    alt={imgAlt(
                                      b,
                                      `${p.title}, bild ${i + 2}`
                                    )}
                                    fill
                                    sizes="(max-width: 640px) 40vw, 13vw"
                                    className="object-cover projekt-img"
                                    placeholder={
                                      b.asset?.metadata?.lqip ? "blur" : "empty"
                                    }
                                    blurDataURL={
                                      b.asset?.metadata?.lqip ?? undefined
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : sidobilder.length === 1 ? (
                          <div className="grid grid-cols-[1.4fr_1fr] gap-[2px] h-full">
                            <div className="relative">
                              <Image
                                src={imgSrc(p.huvudbild, 800, 600)}
                                alt={imgAlt(p.huvudbild, p.title ?? "")}
                                fill
                                sizes="(max-width: 640px) 60vw, 20vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                              />
                            </div>
                            <div className="relative">
                              <Image
                                src={imgSrc(sidobilder[0], 500, 400)}
                                alt={imgAlt(sidobilder[0], `${p.title}, bild 2`)}
                                fill
                                sizes="(max-width: 640px) 40vw, 13vw"
                                className="object-cover projekt-img"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-full">
                            <Image
                              src={imgSrc(p.huvudbild, 1000, 750)}
                              alt={imgAlt(p.huvudbild, p.title ?? "")}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                            />
                          </div>
                        )}
                      </div>
                      <h2
                        className="text-base font-bold mb-2 group-hover:text-[#2B74FC] transition-colors"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-dark)",
                        }}
                      >
                        {p.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {p.ort && (
                          <span
                            className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: "rgba(43,116,252,0.10)",
                              color: "var(--color-primary)",
                            }}
                          >
                            {p.ort}
                          </span>
                        )}
                        {p.typ && (
                          <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                            {p.typ}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 ml-1">
                          {p.kvm ? `${p.kvm} kvm` : null}
                          {p.kvm && p.ar ? " · " : null}
                          {p.ar ?? null}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em] mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Ditt tak kan vara nästa projekt
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Boka kostnadsfri takkontroll, fast pris utan förbindelser.
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
