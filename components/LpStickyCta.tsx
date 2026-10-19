"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Star } from "lucide-react";

/*
  Fast knapp längst ner på mobil för annonslandningssidan. Visas när
  frågeflödet i heron skrollat ur bild och leder alltid tillbaka dit. Har
  besökaren redan börjat svara säger den var de var, så att ingen tror att
  de måste börja om.
*/
export default function LpStickyCta({ betyg, antal }: { betyg: string; antal: number }) {
  const [forbi, setForbi] = useState(false);
  const [lage, setLage] = useState<{ steg: number; antal: number; paborjad: boolean }>();

  useEffect(() => {
    const quiz = document.getElementById("formular");
    if (!quiz) return;
    const obs = new IntersectionObserver(([e]) => setForbi(!e.isIntersecting));
    obs.observe(quiz);
    const lyssna = (e: Event) => setLage((e as CustomEvent).detail);
    window.addEventListener("lp:steg", lyssna);
    return () => {
      obs.disconnect();
      window.removeEventListener("lp:steg", lyssna);
    };
  }, []);

  const text = lage?.paborjad
    ? `Fortsätt där du var, steg ${lage.steg} av ${lage.antal}`
    : "Få gratis offert";

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        forbi ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!forbi}
    >
      <p className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mb-1.5">
        <Star size={11} className="fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-gray-700">{betyg}</span> av 5 i {antal} omdömen
      </p>
      <a
        href="#formular"
        tabIndex={forbi ? 0 : -1}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-[15px] font-semibold text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {text} <ArrowUp size={16} />
      </a>
    </div>
  );
}
