import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { omraden } from "@/lib/omraden";

// Inline "Vi servar även:" link rail. Renders on high-traffic pages
// (/priser, /tjanster/[slug], /om-oss) to push link equity from them
// down to the weaker area pages that don't show up in the main nav.
//
// Defaults to a curated mix: all 5 weakest areas + 7 strong ones.
// Override by passing a `slugs` array if a specific page needs a
// different selection.
const DEFAULT_SLUGS = [
  "bromma",
  "nacka",
  "taby",
  "jarfalla",
  "huddinge",
  "danderyd",
  "sollentuna",
  "vallentuna",
  "varmdo",
  "vaxholm",
  "sigtuna",
  "upplands-vasby",
];

interface OmradenInlineProps {
  slugs?: string[];
  heading?: string;
}

export default function OmradenInline({
  slugs = DEFAULT_SLUGS,
  heading = "Vi servar takbyten i hela Stockholmsregionen",
}: OmradenInlineProps) {
  const display = slugs
    .map((s) => omraden.find((o) => o.slug === s))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  if (display.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 border-t border-gray-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-sm font-bold uppercase tracking-[0.15em] text-gray-500 mb-5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heading}
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {display.map((o) => (
            <Link
              key={o.slug}
              href={`/omraden/${o.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
              style={{ color: "var(--color-dark)" }}
            >
              {o.name}
            </Link>
          ))}
          <Link
            href="/omraden"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Alla områden <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
