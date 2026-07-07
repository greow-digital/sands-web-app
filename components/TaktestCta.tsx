import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Split-banner: takbild med diagonal kant till vänster, blå panel till höger.
// Server-komponent (ingen interaktivitet). Länkar till /taktest.
export default function TaktestCta() {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_70px_-30px_rgba(11,18,32,0.4)]">
          {/* Bild */}
          <div className="relative h-56 sm:h-72 lg:h-auto lg:absolute lg:inset-0">
            <Image
              src="/images/hero-sands-construction.jpg"
              alt="Takarbete med ställning i Stockholm"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* Blå panel */}
          <div
            className="relative bg-[#2B74FC] px-7 py-10 sm:px-10 lg:py-16 lg:ml-auto lg:w-[60%] lg:pl-[14%] lg:pr-14 flex flex-col justify-center lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0%_100%)]"
          >
            <h2
              className="text-white text-[26px] sm:text-[32px] lg:text-[40px] font-extrabold tracking-[-0.02em] leading-[1.1]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Testa ditt tak!
            </h2>
            <p
              className="text-white/95 text-[19px] sm:text-[22px] font-bold mt-1 mb-4 leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ta reda på ditt taks nuvarande skick
            </p>
            <p className="text-white/85 text-[15px] leading-relaxed max-w-md mb-7">
              Har du koll på hur ditt tak egentligen mår? Svara på några korta
              frågor, det tar under en minut, och få en personlig bedömning
              direkt. Helt utan förpliktelser.
            </p>
            <Link
              href="/taktest"
              className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full border-2 border-white text-white font-semibold text-sm transition-colors hover:bg-white hover:text-[#2B74FC]"
            >
              Gör taktestet <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
