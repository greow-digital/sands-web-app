import Link from "next/link";
import Image from "@/components/SanityImage";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard, SanityImageWithMeta } from "@/sanity/lib/types";

interface RelateradeProjektProps {
  projekt: ProjektCard[];
  heading?: string;
  /** Max kort som visas, övriga göms men "Se alla projekt"-länk visas */
  limit?: number;
}

export default function RelateradeProjekt({
  projekt,
  heading = "Projekt vi har utfört i området",
  limit = 6,
}: RelateradeProjektProps) {
  const display = projekt.slice(0, limit);
  const total = projekt.length;
  if (display.length === 0) return null;

  return (
    <section className="py-14 lg:py-20 border-t border-gray-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              Referenser
            </p>
            <h2
              className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              {heading}
            </h2>
          </div>
          {total > limit && (
            <Link
              href="/projekt"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              Se alla {total} projekt <ArrowRight size={13} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {display.map((p) => {
            if (!p.slug || !p.huvudbild) return null;
            const huvudUrl = urlFor(p.huvudbild)
              .width(800)
              .height(600)
              .fit("crop")
              .url();
            const sidobilder = (p.bilder ?? []).filter(
              (b): b is SanityImageWithMeta => Boolean(b?.asset)
            );

            return (
              <Link
                key={p._id}
                href={`/projekt/${p.slug}`}
                className="group block"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-200 relative projekt-thumb">
                  {sidobilder.length >= 2 ? (
                    <div className="grid grid-cols-[1.4fr_1fr] gap-[2px] h-full">
                      <div className="relative">
                        <Image
                          src={huvudUrl}
                          alt={p.huvudbild.alt || p.title || ""}
                          fill
                          sizes="(max-width: 640px) 60vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                          placeholder={
                            p.huvudbild.asset?.metadata?.lqip ? "blur" : "empty"
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
                              src={urlFor(b).width(500).height(400).fit("crop").url()}
                              alt={b.alt || `${p.title}, bild ${i + 2}`}
                              fill
                              sizes="(max-width: 640px) 40vw, 13vw"
                              className="object-cover projekt-img"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      <Image
                        src={huvudUrl}
                        alt={p.huvudbild.alt || p.title || ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                        placeholder={
                          p.huvudbild.asset?.metadata?.lqip ? "blur" : "empty"
                        }
                        blurDataURL={
                          p.huvudbild.asset?.metadata?.lqip ?? undefined
                        }
                      />
                    </div>
                  )}
                </div>
                <h3
                  className="text-sm font-bold mb-1.5 group-hover:text-[#2B74FC] transition-colors"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {[p.typ, p.ort].filter(Boolean).join(", ")}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.typ && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {p.typ}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400">
                    {p.kvm ? `${p.kvm} kvm` : null}
                    {p.kvm && p.ar ? " · " : null}
                    {p.ar ?? null}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
