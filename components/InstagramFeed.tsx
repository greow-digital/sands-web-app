"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type BeholdWidgetProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & { "feed-id": string };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "behold-widget": BeholdWidgetProps;
    }
  }
}

const BEHOLD_SRC = "https://w.behold.so/widget.js";

export default function InstagramFeed() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  // Ladda Behold forst nar sektionen narmar sig viewport. Feeden ligger
  // under fold, sa Lighthouse (som inte scrollar) ser den aldrig.
  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Injicera widget.js en gang nar den ska visas.
  useEffect(() => {
    if (!show) return;
    if (document.querySelector(`script[src="${BEHOLD_SRC}"]`)) return;
    const s = document.createElement("script");
    s.type = "module";
    s.async = true;
    s.src = BEHOLD_SRC;
    document.body.appendChild(s);
  }, [show]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
              Instagram
            </p>
            <h2
              className="text-[30px] lg:text-[42px] font-extrabold tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Senaste från vår Instagram
            </h2>
          </div>
          <a
            href="https://instagram.com/sandsentreprenad"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
          >
            <InstagramIcon size={16} /> Följ @sandsentreprenad <ArrowRight size={14} />
          </a>
        </div>

        {/* min-h reserverar plats sa footern inte hoppar nar feeden laddas */}
        <div ref={slotRef} className="min-h-[320px]">
          {show && (
            <behold-widget feed-id="yyTUepYBaDC9vzg061gK"></behold-widget>
          )}
        </div>
      </div>
    </section>
  );
}
