import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Ruler, ArrowRight, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { client } from "@/sanity/lib/client";
import {
  PROJEKT_BY_SLUG_QUERY,
  PROJEKT_BY_ORT_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard, ProjektDetail } from "@/sanity/lib/types";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await client.fetch(PROJEKT_BY_SLUG_QUERY, {
    slug,
  })) as ProjektDetail | null;
  if (!p) return {};
  return {
    title: `[POC] ${p.title} | Sands Entreprenad`,
    description: p.beskrivning ?? undefined,
    robots: { index: false, follow: false },
    alternates: { canonical: undefined },
  };
}

export default async function ProjektSanityPocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await client.fetch(PROJEKT_BY_SLUG_QUERY, {
    slug,
  })) as ProjektDetail | null;
  if (!p || !p.huvudbild) notFound();

  const ortProjekt = (await client.fetch(PROJEKT_BY_ORT_QUERY, {
    ort: p.ort ?? "",
  })) as ProjektCard[];
  const relaterade = ortProjekt
    .filter((x) => x.slug !== p.slug && x.typ === p.typ)
    .slice(0, 3);

  const heroHuvudbild = urlFor(p.huvudbild)
    .width(1600)
    .height(2000)
    .fit("crop")
    .url();

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
              <strong>POC-läge:</strong> denna sida hämtar projektet från Sanity och är{" "}
              <code className="font-mono">noindex</code>.{" "}
              <Link href="/studio" className="underline font-semibold">
                Öppna i Studion
              </Link>
              .
            </p>
          </div>
        </div>

        <PageHero
          eyebrow={p.typ ?? ""}
          title={p.title?.split(", ")[0] ?? ""}
          titleAccent={p.title?.split(", ")[1] || ""}
          description={p.beskrivning ?? ""}
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Projekt (POC)", href: "/projekt-sanity-poc" },
            { label: p.ort ?? "" },
          ]}
        />

        {/* Meta stripe */}
        <section className="border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <MapPin size={14} style={{ color: "var(--color-primary)" }} />
                {p.ort}
              </span>
              <span className="flex items-center gap-2">
                <Ruler size={14} style={{ color: "var(--color-primary)" }} />
                {p.kvm} kvm
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} style={{ color: "var(--color-primary)" }} />
                {p.ar}
              </span>
            </div>
          </div>
        </section>

        {/* Bild + beskrivning */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
              <div>
                {p.bilder && p.bilder.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden col-span-2 bg-gray-100">
                      <Image
                        src={heroHuvudbild}
                        alt={
                          (p.huvudbild as { alt?: string })?.alt || p.title || ""
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        placeholder={
                          p.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
                        }
                        blurDataURL={p.huvudbild?.asset?.metadata?.lqip ?? undefined}
                      />
                    </div>
                    {p.bilder.map((img, idx) => {
                      if (!img.asset) return null;
                      const url = urlFor(img)
                        .width(900)
                        .height(675)
                        .fit("crop")
                        .url();
                      return (
                        <div
                          key={img._key}
                          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={url}
                            alt={
                              (img as { alt?: string })?.alt ||
                              `${p.title}, bild ${idx + 2}`
                            }
                            fill
                            sizes="(max-width: 1024px) 50vw, 30vw"
                            className="object-cover"
                            placeholder={
                              img.asset?.metadata?.lqip ? "blur" : "empty"
                            }
                            blurDataURL={img.asset?.metadata?.lqip ?? undefined}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-gray-100">
                    <Image
                      src={urlFor(p.huvudbild).width(1600).height(1000).fit("crop").url()}
                      alt={
                        (p.huvudbild as { alt?: string })?.alt || p.title || ""
                      }
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      placeholder={
                        p.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
                      }
                      blurDataURL={p.huvudbild?.asset?.metadata?.lqip ?? undefined}
                    />
                  </div>
                )}

                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Om projektet
                </h2>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {p.beskrivning}
                </p>

                <div className="p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB] space-y-3">
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Material
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{p.material}</p>
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Typ
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{p.typ}</p>
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Plats
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{p.ort}</p>
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit">
                <LeadForm variant="section" />
              </aside>
            </div>
          </div>
        </section>

        {/* Relaterade */}
        {relaterade.length > 0 && (
          <section
            className="py-14 border-t border-gray-100"
            style={{ backgroundColor: "#F8F9FB" }}
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                className="text-xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Fler {(p.typ ?? "").toLowerCase()}-projekt
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relaterade.map((r) => {
                  if (!r.slug || !r.huvudbild) return null;
                  const url = urlFor(r.huvudbild)
                    .width(600)
                    .height(450)
                    .fit("crop")
                    .url();
                  return (
                    <Link
                      key={r._id}
                      href={`/projekt-sanity-poc/${r.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                        <Image
                          src={url}
                          alt={r.title ?? ""}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder={
                            r.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
                          }
                          blurDataURL={r.huvudbild?.asset?.metadata?.lqip ?? undefined}
                        />
                      </div>
                      <h3
                        className="text-sm font-bold mb-0.5 group-hover:text-[#2B74FC] transition-colors"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {r.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} /> {r.ort} · {r.kvm} kvm
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/projekt-sanity-poc"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors mb-6"
            >
              ← Alla projekt (POC)
            </Link>
            <div>
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka takkontroll <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
