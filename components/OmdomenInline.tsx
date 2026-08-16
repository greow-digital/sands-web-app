import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import {
  testimonials,
  SOURCE_META,
  SOURCE_LABEL,
  type Testimonial,
} from "@/lib/testimonials";

interface OmdomenInlineProps {
  /** Rubrik ovanför omdömena */
  heading?: string;
  /**
   * Explicit urval. Sätts detta används listan rakt av, utan poängsättning.
   * Använd när sidan kräver att omdömena handlar om rätt sak, t.ex. bara
   * tak. Poängsättningen nedan väljer annars gärna ett välskrivet omdöme
   * om fasadmålning framför ett kortare om tak.
   */
  urval?: Testimonial[];
  /**
   * Begränsar vilka omdömen som får väljas, men behåller poängsättningen på
   * ort och grannkommun. Skicka `takTestimonials` på taksidor så väljs rätt
   * ort ur rätt ämne, i stället för ett välskrivet omdöme om fasadmålning.
   */
  pool?: Testimonial[];
  /** Prioritera omdömen från denna ort (delsträngsmatch) */
  ort?: string;
  /** Stadsdelar/kommundelar som räknas som samma ort (t.ex. Tullinge i Botkyrka) */
  delomraden?: string[];
  /** Grannkommuner som får näst högst prioritet när lokala omdömen saknas */
  narliggande?: string[];
  /** Prioritera omdömen vars text/tjänst innehåller något av dessa ord */
  match?: string[];
  /** Antal omdömen som visas (default 3) */
  limit?: number;
  /** Mörk bakgrund (för sektioner med grå/mörk yta runt) */
  background?: boolean;
}

function pickReviews(
  ort?: string,
  match?: string[],
  limit = 3,
  delomraden: string[] = [],
  narliggande: string[] = [],
  pool: Testimonial[] = testimonials
): Testimonial[] {
  const lokala = [ort, ...delomraden]
    .filter((o): o is string => Boolean(o))
    .map((o) => o.toLowerCase());
  const grannar = narliggande.map((o) => o.toLowerCase());

  const score = (t: Testimonial) => {
    let s = 0;
    const tOrt = t.ort?.toLowerCase();
    if (ort) {
      if (tOrt && lokala.some((o) => tOrt.includes(o))) {
        s += 6;
      } else if (tOrt && grannar.some((o) => tOrt.includes(o))) {
        s += 3;
      } else if (!tOrt) {
        // Omdömen utan ort påstår aldrig fel ort på en ortssida, så de
        // går före omdömen från en helt annan kommun.
        s += 2;
      }
    }
    if (match) {
      const hay = `${t.tjanst} ${t.text}`.toLowerCase();
      if (match.some((m) => hay.includes(m.toLowerCase()))) s += 1;
    }
    return s;
  };
  // Stabil sortering: högst poäng först, behåll annars ursprunglig ordning.
  return pool
    .map((t, i) => ({ t, i, s: score(t) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.t);
}

export default function OmdomenInline({
  heading = "Vad våra kunder säger",
  urval,
  pool,
  ort,
  delomraden,
  narliggande,
  match,
  limit = 3,
  background = false,
}: OmdomenInlineProps) {
  const reviews =
    urval && urval.length > 0
      ? urval.slice(0, limit)
      : pickReviews(ort, match, limit, delomraden, narliggande, pool);

  return (
    <section
      className={`py-14 lg:py-20 border-t border-gray-100 ${
        background ? "bg-[#F8F9FB]" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2
            className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-dark)",
            }}
          >
            {heading}
          </h2>
          <Link
            href="/omdomen"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B74FC] hover:gap-2.5 transition-all"
          >
            Se alla omdömen <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {reviews.map((o, i) => {
            const meta = SOURCE_META[o.source];
            return (
              <div
                key={`${o.name}-${o.datumISO}-${i}`}
                className="p-6 rounded-2xl border border-gray-100 bg-white flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: o.betyg }).map((_, s) => (
                      <Star
                        key={s}
                        size={13}
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
                <p className="text-[14px] text-gray-700 leading-relaxed mb-4 flex-1 line-clamp-[7]">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
