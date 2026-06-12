import Image from "@/components/SanityImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { LATEST_PROJEKT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektLatest } from "@/sanity/lib/types";

// On-demand ISR via revalidate-sanity webhook (samma som /projekt).
// Ingen `revalidate`-konstant här - revalideras nar redaktor publicerar i Studio.

export default async function LatestProjekt() {
  const projekt = (await client.fetch(LATEST_PROJEKT_QUERY)) as ProjektLatest[];

  if (!projekt || projekt.length === 0) return null;

  return (
    <section
      className="py-16 lg:py-24"
      style={{ backgroundColor: "#F8F9FB" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
              Senaste arbeten
            </p>
            <h2
              className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Våra senaste projekt
            </h2>
          </div>
          <Link
            href="/projekt"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
          >
            Se alla projekt <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {projekt.map((p) => (
            <ProjektCard key={p._id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjektCard({ p }: { p: ProjektLatest }) {
  if (!p.slug) return null;

  const hasBeforeAfter = Boolean(
    p.foreImage?.asset?._id && p.efterImage?.asset?._id
  );

  return (
    <Link href={`/projekt/${p.slug}`} className="group block">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200 mb-3">
        {hasBeforeAfter ? (
          <div className="absolute inset-0 grid grid-cols-2 gap-[2px]">
            <div className="relative">
              <Image
                src={urlFor(p.foreImage!).width(600).height(750).fit("crop").url()}
                alt={p.foreImage?.alt || `${p.title}, före`}
                fill
                sizes="(max-width: 768px) 50vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder={
                  p.foreImage?.asset?.metadata?.lqip ? "blur" : "empty"
                }
                blurDataURL={p.foreImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
            <div className="relative">
              <Image
                src={urlFor(p.efterImage!).width(600).height(750).fit("crop").url()}
                alt={p.efterImage?.alt || `${p.title}, efter`}
                fill
                sizes="(max-width: 768px) 50vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder={
                  p.efterImage?.asset?.metadata?.lqip ? "blur" : "empty"
                }
                blurDataURL={p.efterImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 flex z-10">
              <div className="flex-1 py-2 text-center text-xs font-bold text-white bg-black/50 backdrop-blur-sm">
                FÖRE
              </div>
              <div
                className="flex-1 py-2 text-center text-xs font-bold text-white backdrop-blur-sm"
                style={{ backgroundColor: "rgba(43,116,252,0.7)" }}
              >
                EFTER
              </div>
            </div>
          </div>
        ) : (
          p.huvudbild?.asset && (
            <Image
              src={urlFor(p.huvudbild).width(1200).height(750).fit("crop").url()}
              alt={p.huvudbild.alt || p.title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder={
                p.huvudbild?.asset?.metadata?.lqip ? "blur" : "empty"
              }
              blurDataURL={p.huvudbild?.asset?.metadata?.lqip ?? undefined}
            />
          )
        )}
      </div>
      <p
        className="text-sm font-semibold group-hover:text-[#2B74FC] transition-colors"
        style={{ color: "var(--color-dark)" }}
      >
        {p.title}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {[p.typ, p.ar].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
