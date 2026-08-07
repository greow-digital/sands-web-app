"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type GtagFn = (event: string, name: string, params: object) => void;

function fireStickyClick(type: "form" | "voice") {
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
        <div className="flex items-center gap-2.5">
          {/* Primär CTA: formuläret, dominant */}
          <Link
            href="/offert"
            onClick={() => fireStickyClick("form")}
            className="flex-1 min-w-0 whitespace-nowrap flex items-center justify-center py-3 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Få prisförslag
          </Link>
          {/* Sekundär: prata med röstrådgivaren (öppnar voice-panelen) */}
          <button
            type="button"
            onClick={() => {
              fireStickyClick("voice");
              window.dispatchEvent(new Event("sands:open-voice"));
            }}
            aria-label="Prata med vår takrådgivare"
            className="shrink-0 whitespace-nowrap flex items-center gap-2 h-12 pl-1.5 pr-4 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#2B74FC] hover:text-[#2B74FC] transition-colors"
          >
            <img
              src="/images/voice-avatar.jpg"
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
            Prata med oss
          </button>
        </div>
      </div>
    </div>
  );
}
