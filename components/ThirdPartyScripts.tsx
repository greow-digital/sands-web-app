"use client";

import { useEffect } from "react";

type HotjarWindow = Window & {
  hj?: { (...args: unknown[]): void; q?: unknown[] };
  _hjSettings?: { hjid: number; hjsv: number };
};

/**
 * Laddar Hotjar (56 KB heatmaps/analys) FORST vid forsta anvandarinteraktion
 * istallet for vid sidladdning, sa det halls utanfor LCP/TBT-fonstret.
 *
 * gtag/Google Ads laddas DAREMOT eager i <head> (layout.tsx) sa GA4 page_view
 * registreras for alla sessioner, aven de som aldrig interagerar. Hotjar ar
 * ren heatmap-data och paverkar inte sessions-/konverteringsdata, sa den
 * tal att deferras.
 */
export default function ThirdPartyScripts() {
  useEffect(() => {
    const events = [
      "scroll",
      "mousemove",
      "touchstart",
      "pointerdown",
      "keydown",
      "click",
    ];

    let loaded = false;

    const remove = () =>
      events.forEach((e) => window.removeEventListener(e, load));

    function load() {
      if (loaded) return;
      loaded = true;
      remove();

      const w = window as HotjarWindow;
      w.hj =
        w.hj ||
        function (...args: unknown[]) {
          (w.hj!.q = w.hj!.q || []).push(args);
        };
      w._hjSettings = { hjid: 3307551, hjsv: 6 };
      const hjScript = document.createElement("script");
      hjScript.async = true;
      hjScript.src =
        "https://static.hotjar.com/c/hotjar-" +
        w._hjSettings.hjid +
        ".js?sv=" +
        w._hjSettings.hjsv;
      document.head.appendChild(hjScript);
    }

    events.forEach((e) =>
      window.addEventListener(e, load, { passive: true })
    );

    return remove;
  }, []);

  return null;
}
