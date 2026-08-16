"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

type GtagFn = (event: string, name: string, params: object) => void;

function fireStickyClick(type: "form") {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (window as unknown as { gtag: GtagFn }).gtag("event", "sticky_cta_click", {
    event_category: "engagement",
    type,
  });
}

export default function MobileCTA() {
  const pathname = usePathname();
  const [ovanforFooter, setOvanforFooter] = useState(true);
  const [passeratHero, setPasseratHero] = useState(false);
  const [calcStickyActive, setCalcStickyActive] = useState(false);

  const hideOnPages = ["/offert", "/tack"];
  const shouldHide = hideOnPages.includes(pathname);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOvanforFooter(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Baren är hero-knappen som följer med när den skrollat ur bild. Så länge
  // den riktiga knappen syns behövs ingen kopia i botten.
  //
  // Saknar sidan en hero-CTA finns ingen knapp att ta över efter, och då
  // ligger baren framme direkt. Baren är global och ska se likadan ut
  // överallt, det enda som skiljer är om den har en knapp att avlösa.
  useEffect(() => {
    const heroCta = document.querySelector("[data-hero-cta]");

    if (!heroCta) {
      setPasseratHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Bara när knappen lämnat uppåt, inte när man är ovanför den.
        const passerad =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setPasseratHero(passerad);
      },
      { threshold: 0 }
    );
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, [pathname]);

  // Bakåtkompatibel: om någon sektion dispatchar en egen sticky-bar
  // döljer vi denna så de inte staplas.
  useEffect(() => {
    const handler = (e: Event) =>
      setCalcStickyActive(!!(e as CustomEvent).detail?.visible);
    window.addEventListener("sands:calc-sticky", handler);
    return () => window.removeEventListener("sands:calc-sticky", handler);
  }, []);

  if (shouldHide || calcStickyActive) return null;

  const visible = ovanforFooter && passeratHero;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        {/* Samma knapp som hero-CTAn, både i ordval och utseende: baren är
            den knappen som följt med ner. Headern behåller "Få prisförslag"
            så de två ytorna svarar mot olika intent. Röstknappen låg här
            tidigare och konkurrerade om samma tumme. */}
        <Link
          href="/offert"
          onClick={() => fireStickyClick("form")}
          className="w-full whitespace-nowrap inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Boka kostnadsfri takkontroll <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
