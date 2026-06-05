"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [calcStickyActive, setCalcStickyActive] = useState(false);

  const hideOnPages = ["/offert", "/kontakt", "/tack"];
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

  // Kalkylator-stickyn (/priser) ersatter denna bar medan den syns, sa de
  // inte staplas pa varandra. Takraknare dispatchar "sands:calc-sticky".
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
        <div className="flex gap-3">
          <a
            href="tel:0828388"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 text-sm font-semibold transition-colors"
            style={{ color: "var(--color-dark)" }}
          >
            <Phone size={15} />
            Ring oss
          </a>
          <Link
            href="/offert"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Få prisförslag
          </Link>
        </div>
      </div>
    </div>
  );
}
