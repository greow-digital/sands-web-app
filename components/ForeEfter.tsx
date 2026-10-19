"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/*
  Före och efter som reglage. Besökaren drar själv, vilket håller kvar
  blicken längre än två bilder bredvid varandra. Ett osynligt range-fält
  ligger över bilderna, så det fungerar med tumme, mus och tangentbord.
*/
export default function ForeEfter({
  fore,
  efter,
  alt,
  bredd,
  hojd,
}: {
  fore: string;
  efter: string;
  alt: string;
  bredd: number;
  hojd: number;
}) {
  const [lage, setLage] = useState(50);

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-gray-100 select-none"
      style={{ aspectRatio: `${bredd} / ${hojd}` }}
    >
      <Image src={efter} alt={`${alt}, efter`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - lage}% 0 0)` }}>
        <Image src={fore} alt={`${alt}, före`} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
        Före
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900">
        Efter
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ left: `${lage}%` }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800">
          <ChevronsLeftRight size={20} />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={lage}
        onChange={(e) => setLage(Number(e.target.value))}
        aria-label="Dra för att jämföra före och efter"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
