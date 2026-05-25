"use client";

import Script from "next/script";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

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

export default function InstagramFeed() {
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
            <Instagram size={16} /> Följ @sandsentreprenad <ArrowRight size={14} />
          </a>
        </div>

        <behold-widget feed-id="yyTUepYBaDC9vzg061gK"></behold-widget>

        <Script
          type="module"
          src="https://w.behold.so/widget.js"
          strategy="lazyOnload"
        />
      </div>
    </section>
  );
}
