"use client";

import { useEffect } from "react";

type HotjarWindow = Window & {
  hj?: { (...args: unknown[]): void; q?: unknown[] };
  _hjSettings?: { hjid: number; hjsv: number };
};

/**
 * Laddar tunga tredjepartsskript (gtag/Google Ads 175 KB + Hotjar) FORST vid
 * forsta anvandarinteraktion, inte vid sidladdning. Det holler dem helt
 * utanfor LCP/TBT-fonstret (Lighthouse simulerar ingen interaktion).
 *
 * Tracking opaverkad: dataLayer-shimmen + gtag('config') ligger eager i
 * <head>, sa gtag('event')-anrop koas i dataLayer och fyras nar skriptet
 * laddas. gclid fangas separat av ClickIdCapture, konverteringar ar
 * GA4-import pa form_submit (langt efter interaktion).
 *
 * Inget fallback (Eriks val): sessioner som aldrig interagerar sparas ej.
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

      // gtag / Google Ads
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src =
        "https://www.googletagmanager.com/gtag/js?id=AW-18004063012";
      document.head.appendChild(gtagScript);

      // Hotjar
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
