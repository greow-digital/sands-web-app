"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const tjänster = [
  { href: "/tjanster/taklaggning", label: "Takläggning" },
  { href: "/tjanster/fasadrenovering", label: "Fasadrenovering" },
  { href: "/tjanster/takfonsterkupor", label: "Takfönster & takkupor" },
  { href: "/tjanster/hangrannorstupror", label: "Hängrännor & Vindskivor" },
  { href: "/tjanster/taksakerhet", label: "Taksäkerhet" },
  { href: "/tjanster/badrumsrenovering", label: "Badrumsrenovering" },
  { href: "/tjanster/koksrenovering", label: "Köksrenovering" },
  { href: "/tjanster/totalentreprenad", label: "Totalentreprenad" },
];

const områden = [
  { href: "/omraden/stockholm", label: "Stockholm" },
  { href: "/omraden/taby", label: "Täby" },
  { href: "/omraden/nacka", label: "Nacka" },
  { href: "/omraden/jarfalla", label: "Järfälla" },
  { href: "/omraden/huddinge", label: "Huddinge" },
  { href: "/omraden/sollentuna", label: "Sollentuna" },
  { href: "/omraden/danderyd", label: "Danderyd" },
  { href: "/omraden/bromma", label: "Bromma" },
  { href: "/omraden/tyreso", label: "Tyresö" },
  { href: "/omraden/solna", label: "Solna" },
  { href: "/omraden/lidingo", label: "Lidingö" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tjänsterOpen, setTjänsterOpen] = useState(false);
  const [områdenOpen, setOmrådenOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-200 ${
        scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.05)]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Sands Entreprenad, startsida"
          >
            <Image
              src="/images/logo-sandsentreprenad-icon.svg"
              alt="Sands Entreprenad"
              width={64}
              height={64}
              priority
              className="h-8 w-8 sm:hidden"
            />
            <Image
              src="/images/logo-sandsentreprenad.svg"
              alt="Sands Entreprenad"
              width={337}
              height={44}
              priority
              className="hidden sm:block h-6 lg:h-7 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px]">
            <div
              className="relative"
              onMouseEnter={() => setTjänsterOpen(true)}
              onMouseLeave={() => setTjänsterOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-gray-700 hover:text-[#2B74FC] transition-colors font-medium">
                Tjänster <ChevronDown size={14} />
              </button>
              {tjänsterOpen && (
                <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-2xl py-3 border border-gray-100">
                  {tjänster.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block px-5 py-2 text-sm text-gray-700 hover:text-[#2B74FC] transition-colors"
                    >
                      {t.label}
                    </Link>
                  ))}
                  <Link
                    href="/tjanster"
                    className="block px-5 py-2 text-sm font-semibold text-[#2B74FC] border-t border-gray-100 mt-1 pt-3"
                  >
                    Se alla tjänster →
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOmrådenOpen(true)}
              onMouseLeave={() => setOmrådenOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-gray-700 hover:text-[#2B74FC] transition-colors font-medium">
                Områden <ChevronDown size={14} />
              </button>
              {områdenOpen && (
                <div className="absolute top-full left-0 w-52 bg-white shadow-xl rounded-2xl py-3 border border-gray-100">
                  {områden.map((o) => (
                    <Link
                      key={o.href}
                      href={o.href}
                      className="block px-5 py-2 text-sm text-gray-700 hover:text-[#2B74FC] transition-colors"
                    >
                      {o.label}
                    </Link>
                  ))}
                  <Link
                    href="/omraden"
                    className="block px-5 py-2 text-sm font-semibold text-[#2B74FC] border-t border-gray-100 mt-1 pt-3"
                  >
                    Alla områden →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/priser"
              className="text-gray-700 hover:text-[#2B74FC] transition-colors font-medium"
            >
              Priser
            </Link>
            <Link
              href="/projekt"
              className="text-gray-700 hover:text-[#2B74FC] transition-colors font-medium"
            >
              Projekt
            </Link>
            <Link
              href="/om-oss"
              className="text-gray-700 hover:text-[#2B74FC] transition-colors font-medium"
            >
              Om oss
            </Link>
            <Link
              href="/kontakt"
              className="text-gray-700 hover:text-[#2B74FC] transition-colors font-medium"
            >
              Kontakt
            </Link>
            <Link
              href="/blogg"
              className="text-gray-700 hover:text-[#2B74FC] transition-colors font-medium"
            >
              Blogg
            </Link>
          </nav>

          {/* Desktop right: phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:08283888"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#2B74FC] transition-colors"
            >
              <Phone size={14} />
              08-28 38 88
            </a>
            <Link
              href="/offert"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få gratis offert
            </Link>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/offert"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få gratis offert
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-700"
              aria-label="Öppna meny"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 pb-6 pt-4 space-y-1">
            <a
              href="tel:08283888"
              className="flex items-center gap-2 px-3 py-3 text-sm font-bold text-[#2B74FC]"
            >
              <Phone size={14} />
              08-28 38 88
            </a>

            <div>
              <button
                className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-800"
                onClick={() => setTjänsterOpen(!tjänsterOpen)}
              >
                Tjänster <ChevronDown size={14} />
              </button>
              {tjänsterOpen && (
                <div className="pl-4 space-y-1">
                  {tjänster.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-[#2B74FC]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-800"
                onClick={() => setOmrådenOpen(!områdenOpen)}
              >
                Områden <ChevronDown size={14} />
              </button>
              {områdenOpen && (
                <div className="pl-4 space-y-1">
                  {områden.map((o) => (
                    <Link
                      key={o.href}
                      href={o.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-[#2B74FC]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {o.label}
                    </Link>
                  ))}
                  <Link
                    href="/omraden"
                    className="block px-3 py-2 text-sm font-semibold text-[#2B74FC]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Alla områden →
                  </Link>
                </div>
              )}
            </div>

            {[
              { href: "/priser", label: "Priser" },
              { href: "/projekt", label: "Projekt" },
              { href: "/om-oss", label: "Om oss" },
              { href: "/kontakt", label: "Kontakt" },
              { href: "/blogg", label: "Blogg" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-3 text-sm font-semibold text-gray-800 hover:text-[#2B74FC]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
