"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    text: "Riktigt bra att ha och göra med. Snabba, noggranna och gjort ett riktigt bra jobb som takbyte. Supernöjd och till ett bra pris dessutom. Kan starkt rekommendera.",
    name: "Henrik",
    service: "Tjänst: Takläggning 170 kvm i Tyresö",
    color: "#2B74FC",
  },
  {
    text: "Väldigt professionellt och effektivt genomförande. Väldigt bra och detaljerad offert som också stämde exakt med slutfakturan. Rekommenderas varmt!",
    name: "Pauli",
    service: "Tjänst: Tegeltak, takläggning 150 kvm i Solna",
    color: "#FC5F2A",
  },
  {
    text: "Takbyte. Tydligt offertförfarande. Därefter bra och noggrant utfört arbete. Kan varmt rekommendera Sands Entreprenad.",
    name: "Per",
    service: "Takläggning Stockholm",
    color: "#085B69",
  },
  {
    text: "Professionellt och pålitligt företag. Fast pris från start och inga överraskningar. Boka ett hembesök — ni ångrar er inte.",
    name: "Anders",
    service: "Tjänst: Betongtak i Täby",
    color: "#2B74FC",
  },
  {
    text: "Från första kontakt till slutbesiktning var allt professionellt och välorganiserat. Priset stämde precis med offerten.",
    name: "Karin",
    service: "Tjänst: Betongtak i Bromma",
    color: "#FC5F2A",
  },
  {
    text: "Monier-garanti i 30 år är guld värt. Hela processen gick smidigt och vi fick bra vägledning kring materialval.",
    name: "Anna",
    service: "Tjänst: Tegeltak i Solna",
    color: "#085B69",
  },
];

function ReviewCard({
  text,
  name,
  service,
  color,
}: {
  text: string;
  name: string;
  service: string;
  color: string;
}) {
  return (
    <div className="w-[340px] sm:w-[400px] shrink-0 rounded-2xl border border-gray-100 bg-white p-6 flex flex-col justify-between">
      <p
        className="text-[15px] leading-relaxed mb-5"
        style={{ color: "var(--color-dark)" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <div>
        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: color }}
          >
            {name[0]}
          </div>
          <div>
            <div
              className="text-sm font-bold"
              style={{ color: "var(--color-dark)" }}
            >
              {name}
            </div>
            <div className="text-xs text-gray-500">{service}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewCarousel() {
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-16 lg:py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2
          className="text-[28px] lg:text-[36px] font-extrabold tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-dark)",
          }}
        >
          Vad våra kunder säger
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-5 animate-scroll">
          {doubled.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: max-content;
          padding-left: max(1rem, calc((100vw - 1200px) / 2 + 1rem));
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
