"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type HotjarWindow = Window & {
  hj?: { (...args: unknown[]): void; q?: unknown[] };
  _hjSettings?: { hjid: number; hjsv: number };
};

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
};

/**
 * gtag/Google Ads laddas pa `load` + idle (INTE eager i head, INTE gatad pa
 * interaktion). Skalet: eager i head blockerade LCP-renderingen ~2 s (176 KB
 * parse pa main-thread precis nar hero-bilden skulle malas). Genom att ladda
 * efter load-eventet malas LCP forst, men gtag fyras anda for ALLA sessioner
 * som stannar nagon sekund (aven utan interaktion) sa GA tappar inga sessioner.
 * dataLayer-shim + gtag('config') ligger eager i <head> sa page_view koas.
 *
 * Hotjar (56 KB heatmaps) laddas forst vid forsta interaktion, ren heatmap-
 * data som inte paverkar sessions-/konverteringsdata.
 */
export default function ThirdPartyScripts() {
  // Datahygien: ladda inga marknads-/analysskript i Sanity Studio eller
  // POC-sidor. De är interna och ska inte spåras eller smutsa ner GA4/Ads.
  const pathname = usePathname();
  const excluded = /^\/(studio|projekt-sanity-poc)(\/|$)/.test(pathname);

  // gtag: efter load + idle.
  useEffect(() => {
    if (excluded) return;
    const loadGtag = () => {
      if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]'))
        return;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=AW-18004063012";
      document.head.appendChild(s);
    };
    const schedule = () => {
      const w = window as IdleWindow;
      if (w.requestIdleCallback) w.requestIdleCallback(loadGtag, { timeout: 3000 });
      else setTimeout(loadGtag, 1500);
    };
    if (document.readyState === "complete") schedule();
    else {
      window.addEventListener("load", schedule, { once: true });
      return () => window.removeEventListener("load", schedule);
    }
  }, [excluded]);

  // Hotjar: vid forsta interaktion.
  useEffect(() => {
    if (excluded) return;
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
  }, [excluded]);

  return null;
}
