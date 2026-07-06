import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "@/components/SanityImage";
import { MapPin, Calendar, Ruler, ArrowRight, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import { client } from "@/sanity/lib/client";
import {
  ALL_PROJEKT_QUERY,
  PROJEKT_BY_SLUG_QUERY,
  PROJEKT_BY_ORT_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard, ProjektDetail } from "@/sanity/lib/types";
import { pageMeta } from "@/lib/seo";
import { PROJEKT_VIDEOS } from "@/lib/projekt-videos";

const BASE_URL = "https://www.sandsab.se";

const TYP_TO_TJANST: Record<string, { slug: string; label: string }> = {
  Tegeltak: { slug: "tegeltak", label: "tegeltak" },
  Betongtak: { slug: "betongtak", label: "betongtak" },
  "Plåttak": { slug: "plattak", label: "plåttak" },
  Papptak: { slug: "papptak", label: "papptak" },
  Fasadrenovering: { slug: "fasadrenovering", label: "fasadrenovering" },
  "Fasadmålning": { slug: "fasadrenovering", label: "fasadmålning" },
  Badrumsrenovering: { slug: "badrumsrenovering", label: "badrumsrenovering" },
  "Köksrenovering": { slug: "koksrenovering", label: "köksrenovering" },
};

const ORT_TO_OMRADE: Record<string, string> = {
  Stockholm: "stockholm", Bromma: "bromma", "Täby": "taby",
  "Järfälla": "jarfalla", Huddinge: "huddinge", Sollentuna: "sollentuna",
  Danderyd: "danderyd", "Hässelby": "hasselby", "Vällingby": "vallingby",
  "Spånga": "spanga", Enskede: "enskede", "Tyresö": "tyreso",
  "Norrtälje": "norrtalje", "Södertälje": "sodertalje", "Lidingö": "lidingo",
  Solna: "solna", Sundbyberg: "sundbyberg", "Ekerö": "ekero",
  Haninge: "haninge", Botkyrka: "botkyrka", "Nynäshamn": "nynashamn",
  Vallentuna: "vallentuna", Vaxholm: "vaxholm", "Värmdö": "varmdo",
  "Österåker": "osteraker", "Upplands Väsby": "upplands-vasby",
  "Upplands-Bro": "upplands-bro", Sigtuna: "sigtuna", Salem: "salem",
  Nykvarn: "nykvarn", Nacka: "nacka",
};

export async function generateStaticParams() {
  const all = (await client.fetch(ALL_PROJEKT_QUERY)) as ProjektCard[];
  return all
    .filter((p): p is ProjektCard & { slug: string } => Boolean(p.slug))
    .map((p) => ({ slug: p.slug }));
}

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
  const displayTitle = [p.typ, p.ort].filter(Boolean).join(", ");
  return pageMeta({
    path: `/projekt/${slug}`,
    title: `${displayTitle} | Sands Entreprenad`,
    description:
      p.beskrivning?.slice(0, 160) ??
      `Takprojekt i ${p.ort ?? "Stockholm"} utfört av Sands Entreprenad.`,
  });
}

export default async function ProjektDetailPage({
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

  const tjanst = p.typ ? TYP_TO_TJANST[p.typ] : undefined;
  const omradeSlug = p.ort ? ORT_TO_OMRADE[p.ort] : undefined;
  const displayTitle = [p.typ, p.ort].filter(Boolean).join(", ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Hem", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Projekt", item: `${BASE_URL}/projekt` },
              { "@type": "ListItem", position: 3, name: displayTitle, item: `${BASE_URL}/projekt/${slug}` },
            ],
          }),
        }}
      />
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* HERO — split layout: text vänster + huvudbild höger */}
        <section className="border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link href="/" className="hover:text-gray-600">
                Hem
              </Link>
              <ChevronRight size={12} />
              <Link href="/projekt" className="hover:text-gray-600">
                Projekt
              </Link>
              <ChevronRight size={12} />
              <span>{p.ort}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Bild — order-first på mobil, höger på desktop */}
              <div className="relative aspect-[4/5] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 order-first lg:order-last">
                <Image
                  src={heroHuvudbild}
                  alt={p.huvudbild.alt || p.title || ""}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  placeholder={
                    p.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
                  }
                  blurDataURL={
                    p.huvudbild?.asset?.metadata?.lqip ?? undefined
                  }
                />
              </div>

              {/* Text */}
              <div className="lg:order-first">
                {p.typ && (
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                    {p.typ}
                  </p>
                )}
                <h1
                  className="text-[34px] lg:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {p.typ ?? "Takbyte"}
                  {p.ort && (
                    <>
                      ,{" "}
                      <span style={{ color: "var(--color-primary)" }}>
                        {p.ort}
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
                  {p.beskrivning}
                </p>

                <div className="flex flex-wrap gap-5 text-sm text-gray-500 mb-7">
                  <span className="flex items-center gap-2">
                    <MapPin
                      size={14}
                      style={{ color: "var(--color-primary)" }}
                    />
                    {p.ort}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ruler
                      size={14}
                      style={{ color: "var(--color-primary)" }}
                    />
                    {p.kvm} kvm
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      style={{ color: "var(--color-primary)" }}
                    />
                    {p.ar}
                  </span>
                </div>

                <Link
                  href="/offert"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Få gratis offert <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Galleri + video + fakta + LeadForm */}
        <section className="py-14 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
              <div>
                {p.bilder && p.bilder.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                            alt={img.alt || `${p.title}, bild ${idx + 2}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
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
                )}

                {p.slug && PROJEKT_VIDEOS[p.slug] && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-black">
                    <video
                      src={PROJEKT_VIDEOS[p.slug]}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB] space-y-3">
                  {p.material && (
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Material
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5">{p.material}</p>
                    </div>
                  )}
                  {p.typ && (
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Typ
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5">{p.typ}</p>
                    </div>
                  )}
                  {p.ort && (
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Plats
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5">{p.ort}</p>
                    </div>
                  )}
                </div>

                {(tjanst || omradeSlug) && (
                  <p className="mt-5 text-sm text-gray-500 leading-relaxed">
                    {tjanst && (
                      <>
                        Läs mer om{" "}
                        <Link
                          href={`/tjanster/${tjanst.slug}`}
                          className="text-[#2B74FC] hover:underline font-medium"
                        >
                          {tjanst.label} i Stockholm
                        </Link>
                      </>
                    )}
                    {tjanst && omradeSlug && " eller se "}
                    {!tjanst && omradeSlug && "Se "}
                    {omradeSlug && (
                      <>
                        <Link
                          href={`/omraden/${omradeSlug}`}
                          className="text-[#2B74FC] hover:underline font-medium"
                        >
                          fler projekt i {p.ort}
                        </Link>
                      </>
                    )}
                    {(tjanst || omradeSlug) && "."}
                  </p>
                )}
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
                      href={`/projekt/${r.slug}`}
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
                        {[r.typ, r.ort].filter(Boolean).join(", ")}
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
              href="/projekt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors mb-6"
            >
              ← Alla projekt
            </Link>
            <div>
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Få gratis offert <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
