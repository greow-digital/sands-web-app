import Link from "next/link";
import Image from "@/components/SanityImage";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ProjektCard } from "@/sanity/lib/types";
import { REFERENSPROJEKT } from "@/lib/referensprojekt";

function formatKr(n: number) {
  return n.toLocaleString("sv-SE") + " kr";
}

/**
 * AVSTÄNGD I PRODUKTION. Sätt VISA till true för att slå på sektionen igen.
 *
 * Sektionen visar faktiska slutpriser ur riktiga offerter. Dolda på begäran
 * i väntan på att beloppen i lib/referensprojekt.ts dubbelkollas mot
 * offerterna. Publicerade slutpriser är bindande på ett annat sätt än
 * riktpriser med "från", så de ska inte ligga ute overifierade.
 *
 * Ingenting är borttaget: komponenten, datan i lib/referensprojekt.ts och
 * anropet i app/priser/page.tsx är orörda. Enda spärren är flaggan nedan.
 */
const VISA = false;

/**
 * Tre verkliga jobb med faktisk yta och faktiskt slutpris ur offerten.
 *
 * Ett reglage går att räkna färdigt och lämna. Tre riktiga tak går inte
 * att räkna på, de går bara att jämföra med sitt eget, och den jämförelsen
 * är en anledning att höra av sig.
 */
export default function Referensprojekt({
  projekt,
}: {
  projekt: ProjektCard[];
}) {
  if (!VISA) return null;

  const kort = REFERENSPROJEKT.map((ref) => ({
    ref,
    sanity: projekt.find((p) => p.slug === ref.slug),
  })).filter((k) => k.sanity);

  if (kort.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
            Verkliga slutpriser
          </p>
          <h2
            className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.02em] mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-dark)",
            }}
          >
            Tre tak vi faktiskt har lagt om
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Det här är inte exempel, det är tre riktiga projekt med den yta
            och det slutpris som stod på offerten. Vilket av dem liknar ditt
            tak mest?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kort.map(({ ref, sanity }) => {
            const bild = sanity!.huvudbild;
            return (
              <Link
                key={ref.slug}
                href={`/projekt/${ref.slug}`}
                className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#2B74FC] transition-colors"
              >
                {bild && (
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <Image
                      src={urlFor(bild).width(800).height(600).fit("crop").url()}
                      alt={bild.alt || `Tak i ${ref.plats}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder={bild.asset?.metadata?.lqip ? "blur" : "empty"}
                      blurDataURL={bild.asset?.metadata?.lqip ?? undefined}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-dark)",
                      }}
                    >
                      {ref.plats}
                    </h3>
                    <span className="text-xs text-gray-400 tabular-nums">
                      {ref.ar}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {ref.kvm} m², {ref.material}
                  </p>

                  <div
                    className="text-2xl font-extrabold tabular-nums"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {formatKr(ref.prisEfterRot)}
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    slutpris efter {ref.rotProcent} % ROT
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ref.omfattning}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Se projektet <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-6 max-w-2xl leading-relaxed">
          Priserna är hämtade ur respektive offert och är vad kunden betalade
          efter ROT-avdrag, inte riktpriser. ROT-satsen var 50 % under delar
          av 2025 och 30 % i dag. Ditt tak har andra förutsättningar, det är
          därför vi alltid tittar på plats innan vi sätter pris.
        </p>
      </div>
    </section>
  );
}
