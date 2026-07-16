import Image from "@/components/SanityImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { LATEST_PROJEKT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektLatest } from "@/sanity/lib/types";
import { PROJEKT_VIDEOS } from "@/lib/projekt-videos";
import ProjektCardVideo from "@/components/ProjektCardVideo";

// On-demand ISR via revalidate-sanity webhook (samma som /projekt).
// Ingen `revalidate`-konstant här - revalideras nar redaktor publicerar i Studio.

export default async function LatestProjekt() {
  const projekt = (await client.fetch(LATEST_PROJEKT_QUERY)) as ProjektLatest[];

  if (!projekt || projekt.length === 0) return null;

  // Prioritera de senaste projekten som har video så att swimlanen får
  // rörelse (drönarklipp). Bägge listorna behåller frågans senaste-ordning,
  // så vi visar de tre nyaste projekten med video och fyller vid behov på
  // med de nyaste utan.
  const hasVideo = (p: ProjektLatest) =>
    Boolean(p.slug && PROJEKT_VIDEOS[p.slug]?.length);
  const valda = [
    ...projekt.filter(hasVideo),
    ...projekt.filter((p) => !hasVideo(p)),
  ].slice(0, 3);

  return (
    <section
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#F8F9FB" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              Senaste arbeten
            </p>
            <h2
              className="text-[34px] lg:text-[48px] font-extrabold tracking-[-0.03em]"
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
          {valda.map((p) => (
            <ProjektCard key={p._id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjektCard({ p }: { p: ProjektLatest }) {
  if (!p.slug) return null;

  // Visa en enda utvald efterbild per projekt (foll. huvudbild om efterbild
  // saknas). Vi visar inte langre en fore/efter-split eftersom fore-bilderna
  // inte alltid holl tillrackligt bra kvalitet.
  const bild = p.efterImage?.asset ? p.efterImage : p.huvudbild;

  // Finns video pa projektet spelas den som tyst loop ovanpa stillbilden.
  // Bilden ligger kvar som basskikt -> ingen LCP/CLS-paverkan, och videon
  // laddas forst nar kortet ar nara viewporten (se ProjektCardVideo).
  const video = PROJEKT_VIDEOS[p.slug]?.[0];

  return (
    <Link href={`/projekt/${p.slug}`} className="group block">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200 mb-3">
        {bild?.asset && (
          <Image
            src={urlFor(bild).width(1200).height(750).fit("crop").url()}
            alt={bild.alt || p.title || ""}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder={bild.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={bild.asset.metadata?.lqip ?? undefined}
          />
        )}
        {video && <ProjektCardVideo src={video} />}
      </div>
      <p
        className="text-sm font-semibold group-hover:text-[#2B74FC] transition-colors"
        style={{ color: "var(--color-dark)" }}
      >
        {[p.typ, p.ort].filter(Boolean).join(", ")}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {[p.typ, p.ar].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
