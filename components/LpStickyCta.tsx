"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/*
  Fast knapp längst ner på mobil för annonslandningssidan. Visas när
  formuläret i heron skrollat ur bild uppåt och döljs igen när formuläret
  längst ner syns, så att två uppmaningar aldrig ligger ovanpå varandra.
  Den leder alltid till heroformuläret, inte till en annan sida.
*/
export default function LpStickyCta() {
  const [forbiHero, setForbiHero] = useState(false);
  const [vidBotten, setVidBotten] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("formular");
    const botten = document.getElementById("formular-botten");
    const obs: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) =>
        setForbiHero(!e.isIntersecting && e.boundingClientRect.top < 0)
      );
      o.observe(hero);
      obs.push(o);
    }
    if (botten) {
      const o = new IntersectionObserver(([e]) => setVidBotten(e.isIntersecting));
      o.observe(botten);
      obs.push(o);
    }
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const synlig = forbiHero && !vidBotten;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden px-4 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        synlig ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!synlig}
    >
      <a
        href="#formular"
        tabIndex={synlig ? 0 : -1}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-base font-semibold text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Få gratis offert <ArrowUp size={16} />
      </a>
    </div>
  );
}
