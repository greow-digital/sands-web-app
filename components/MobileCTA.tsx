"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [visible, setVisible] = useState(true);
  const [calcStickyActive, setCalcStickyActive] = useState(false);

  const hideOnPages = ["/offert", "/tack"];
  const shouldHide = hideOnPages.includes(pathname);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Bakåtkompatibel: om någon sektion dispatchar en egen sticky-bar
  // döljer vi denna så de inte staplas.
  useEffect(() => {
    const handler = (e: Event) =>
      setCalcStickyActive(!!(e as CustomEvent).detail?.visible);
    window.addEventListener("sands:calc-sticky", handler);
    return () => window.removeEventListener("sands:calc-sticky", handler);
  }, []);

  if (shouldHide || calcStickyActive) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        {/* Bara huvud-CTA:n. Röstknappen låg här tidigare och konkurrerade
            med prisförslaget om samma tumme. */}
        <Link
          href="/offert"
          onClick={() => fireStickyClick("form")}
          className="w-full whitespace-nowrap flex items-center justify-center py-3 rounded-full text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Få prisförslag
        </Link>
      </div>
    </div>
  );
}
