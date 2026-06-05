"use client";

import { useEffect } from "react";

/**
 * Lyssnar pa klick pa element med data-hero-cta (hero-CTAn pa
 * startsidan) och fyrar GA4-event 'hero_cta_click' samt registrerar
 * source i sessionStorage sa /tack senare kan koppla form_submit
 * tillbaka till hero-flodet.
 */
export default function HeroCtaTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-hero-cta]");
      if (!target) return;

      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
      };
      if (typeof w.gtag === "function") {
        w.gtag("event", "hero_cta_click", {
          event_category: "engagement",
          event_label: "home_hero",
          destination: "/offert",
        });
      }

      // Markera funnel-source sa /tack kan rapportera "hero_cta -> /offert -> submit"
      try {
        sessionStorage.setItem("sands_funnel_entry", "home_hero_cta");
      } catch {
        // sessionStorage kan vara blockerat
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
