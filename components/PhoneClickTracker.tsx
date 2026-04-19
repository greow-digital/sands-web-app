"use client";

import { useEffect } from "react";

export default function PhoneClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a[href^='tel:']");
      if (!target) return;

      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
      };
      if (typeof w.gtag !== "function") return;

      // Google Ads conversion
      w.gtag("event", "conversion", {
        send_to: "AW-18004063012/6974CJ7H_54cEKTmgIlD",
      });

      // GA4 custom event
      w.gtag("event", "phone_click", {
        event_category: "engagement",
        event_label: "08-28 38 88",
        transport_type: "beacon",
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
