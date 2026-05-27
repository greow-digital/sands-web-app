import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProjektKartaWrapper from "@/components/ProjektKartaWrapper";
import { client } from "@/sanity/lib/client";
import { ALL_PROJEKT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard } from "@/sanity/lib/types";
import { coordForProjekt } from "@/lib/ort-coords";
import type { ProjektPin } from "@/components/ProjektKarta";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "[POC] Projekt från Sanity | Sands Entreprenad",
  description:
    "Test-vy som hämtar projekt från Sanity CMS. Används internt för att verifiera schema och redaktörsflöde.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default async function ProjektSanityPocPage() {
  const projekt = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];

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

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* POC-banner */}
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 text-sm">
            <FlaskConical
              size={16}
              className="shrink-0 text-yellow-700"
            />
            <p className="text-yellow-900">
              <strong>POC-läge:</strong> denna sida hämtar projekt från Sanity CMS och är{" "}
              <code className="font-mono">noindex</code>. Redigera projekt på{" "}
              <Link href="/studio" className="underline font-semibold">
                /studio
              </Link>
              .
            </p>
          </div>
        </div>

        <PageHero
          eyebrow="Referenser · POC"
          title="Utförda"
          titleAccent="projekt (Sanity)"
          description="Test-vy som speglar /projekt/ men hämtar innehåll från Sanity istället för lib/projekt.ts."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Projekt (POC)" },
          ]}
        />

        {/* Karta över utförda projekt */}
        {pins.length > 0 && (
          <section className="py-12 lg:py-16 border-b border-gray-100">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 max-w-2xl mx-auto">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Geografisk täckning
                </p>
                <h2
                  className="text-[24px] lg:text-[32px] font-extrabold tracking-[-0.02em] mb-3"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {pins.length} projekt i Stockholmsområdet
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Klicka på en pin för att läsa mer. Pin-positionen visar
                  ungefärlig plats i kommunen — exakta adresser är dolda av
                  integritetsskäl.
                </p>
              </div>
              <ProjektKartaWrapper pins={pins} />
            </div>
          </section>
        )}

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
                  const imageUrl = urlFor(p.huvudbild)
                    .width(800)
                    .height(600)
                    .fit("crop")
                    .url();
                  const altText =
                    (p.huvudbild as { alt?: string }).alt || p.title || "";
                  return (
                    <Link
                      key={p._id}
                      href={`/projekt-sanity-poc/${p.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-200 relative">
                        <Image
                          src={imageUrl}
                          alt={altText}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder={
                            p.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
                          }
                          blurDataURL={p.huvudbild?.asset?.metadata?.lqip ?? undefined}
                        />
                      </div>
                      <h2
                        className="text-base font-bold mb-1 group-hover:text-[#2B74FC] transition-colors"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-dark)",
                        }}
                      >
                        {p.title}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} />
                        {p.ort} · {p.kvm} kvm · {p.ar}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-14 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-500 text-sm mb-4">
              POC-version. Original ligger kvar på{" "}
              <Link
                href="/projekt"
                className="underline font-semibold text-gray-700 hover:text-[#2B74FC]"
              >
                /projekt
              </Link>{" "}
              tills vi switchar över.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
