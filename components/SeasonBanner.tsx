"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

function getSeasonMessage(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) {
    return "Våren är bästa tiden för takbyte — boka besiktning nu för att säkra plats i sommar";
  }
  if (month >= 5 && month <= 7) {
    const monthNames = ["juni", "juli", "augusti"];
    return `Hög säsong — begränsat antal lediga projekt kvar i ${monthNames[month - 5]}. Boka din besiktning idag.`;
  }
  if (month >= 8 && month <= 10) {
    return "Hösten närmar sig — se till att ditt tak är klart innan vintern. Boka besiktning nu.";
  }
  return "Planera ditt takbyte i tid — boka kostnadsfri besiktning nu så är du redo till våren.";
}

export default function SeasonBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs sm:text-sm text-white"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-3 flex-wrap">
        <span>{getSeasonMessage()}</span>
        <Link
          href="/offert"
          className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:no-underline whitespace-nowrap"
        >
          Boka nu <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
