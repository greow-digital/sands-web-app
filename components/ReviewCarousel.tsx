"use client";

import Image from "next/image";
import { Star } from "lucide-react";

type Review = {
  text: string;
  name: string;
  service: string;
  rating: number;
  source: "brabyggare" | "offerta";
};

const reviews: Review[] = [
  {
    text: "Riktigt bra att ha och göra med. Snabba, noggranna och gjort ett riktigt bra jobb som takbyte. Supernöjd och till ett bra pris dessutom. Kan starkt rekommendera.",
    name: "Henrik",
    service: "Takläggning 170 kvm i Tyresö",
    rating: 5,
    source: "brabyggare",
  },
  {
    text: "Väldigt professionellt och effektivt genomförande. Väldigt bra och detaljerad offert som också stämde exakt med slutfakturan. Rekommenderas varmt!",
    name: "Pauli",
    service: "Tegeltak, takläggning 150 kvm i Solna",
    rating: 5,
    source: "offerta",
  },
  {
    text: "Takbyte. Tydligt offertförfarande. Därefter bra och noggrant utfört arbete. Kan varmt rekommendera Sands Entreprenad.",
    name: "Per",
    service: "Takläggning i Stockholm",
    rating: 5,
    source: "brabyggare",
  },
  {
    text: "Mycket nöjd med hela processen från start till slut. Sands var alltid tillgängliga för frågor och höll tidplanen. Resultatet blev fantastiskt, taket ser helt nytt ut.",
    name: "Maria",
    service: "Betongtak 140 kvm i Nacka",
    rating: 5,
    source: "offerta",
  },
  {
    text: "Vi anlitade Sands för ett komplett takbyte och är oerhört nöjda. Professionellt bemötande, fast pris som höll och ett mycket fint slutresultat. Starkt rekommenderat!",
    name: "Johan",
    service: "Tegeltak i Järfälla",
    rating: 5,
    source: "brabyggare",
  },
  {
    text: "Bra kommunikation genom hela projektet. Samuel var en fantastisk projektledare som alltid svarade snabbt på våra frågor. Taket blev jättefint.",
    name: "Karin",
    service: "Betongtak i Bromma",
    rating: 5,
    source: "offerta",
  },
  {
    text: "Sands Entreprenad levererade ett komplett takbyte till fast pris. Allt från ställning till takkontroll var professionellt hanterat. Mycket nöjd och rekommenderar gärna.",
    name: "Anders",
    service: "Takläggning 160 kvm i Täby",
    rating: 5,
    source: "brabyggare",
  },
  {
    text: "Helt fantastiskt jobb! Nytt tegeltak på vårt 40-talshus. Grannarna har redan frågat efter kontaktuppgifter. Seriöst företag med hög kvalitet.",
    name: "Lena",
    service: "Tegeltak i Danderyd",
    rating: 5,
    source: "offerta",
  },
  {
    text: "Fick ett bra pris och jobbet utfördes snabbt och noggrant. Sands tog hand om allt, från rivning till takkontroll. Kan varmt rekommendera.",
    name: "Erik",
    service: "Betongtak 155 kvm i Huddinge",
    rating: 5,
    source: "brabyggare",
  },
  {
    text: "Anlitade Sands för eternitsanering och nytt tak. De skötte hela processen smidigt och professionellt. Mycket tryggt att de hanterar allt i ett kontrakt.",
    name: "Sofie",
    service: "Eternitbyte i Lidingö",
    rating: 5,
    source: "offerta",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-[340px] sm:w-[400px] shrink-0 rounded-2xl border border-gray-100 bg-white p-6 flex flex-col justify-between gap-5">
      {/* Citat */}
      <p
        className="text-[15px] leading-relaxed"
        style={{ color: "var(--color-dark)" }}
      >
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Botten: stjärnor + person + portal */}
      <div>
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{
                backgroundColor:
                  review.source === "brabyggare" ? "#FF8000" : "#2B9E6E",
              }}
            >
              {review.name[0]}
            </div>
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: "var(--color-dark)" }}
              >
                {review.name}
              </div>
              <div className="text-xs text-gray-500">{review.service}</div>
            </div>
          </div>

          {/* Portal-logga */}
          <Image
            src={
              review.source === "brabyggare"
                ? "/images/brabyggare-seal.png"
                : "/images/kundfavorit-2025.png"
            }
            alt={
              review.source === "brabyggare"
                ? "BraByggare"
                : "Offerta Kundfavorit"
            }
            width={100}
            height={100}
            className="h-8 w-auto opacity-60"
          />
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

      {/* data-nosnippet hindrar Google från att plocka review-text som
          SERP-snippet (annars mixar de fragment till otydlig copy på
          branded queries). Påverkar inte ranking eller indexering. */}
      <div
        data-nosnippet
        className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Blur-kanter */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex gap-5 animate-scroll">
          {doubled.map((r, i) => (
            <ReviewCard key={i} review={r} />
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
          animation: scroll 60s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
