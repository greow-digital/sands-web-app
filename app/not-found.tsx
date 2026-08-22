import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Sidan finns inte | Sands",
  description:
    "Sidan du sökte finns inte längre. Här hittar du våra tjänster, områden och priser för takbyte i Stockholm.",
  robots: "noindex, follow",
};

// Vart en besökare (eller en crawler) rimligen ska ta vägen i stället.
const VAGAR = [
  {
    href: "/tjanster",
    rubrik: "Tjänster",
    text: "Takbyte, takomläggning, plåttak, tegeltak, papptak och taksäkerhet.",
  },
  {
    href: "/priser",
    rubrik: "Priser",
    text: "Prisintervall per taktyp och en räknare för ditt tak.",
  },
  {
    href: "/omraden",
    rubrik: "Områden",
    text: "31 orter i Stockholms län, från Norrtälje i norr till Nynäshamn i söder.",
  },
  {
    href: "/projekt",
    rubrik: "Utförda projekt",
    text: "Bilder och beskrivningar från tak vi lagt om.",
  },
  {
    href: "/blogg",
    rubrik: "Guider",
    text: "Vad ett takbyte kostar, när det är dags att byta och hur ROT-avdraget fungerar.",
  },
  {
    href: "/kontakt",
    rubrik: "Kontakt",
    text: "Telefon, e-post och formulär.",
  },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="404"
          title="Sidan"
          titleAccent="finns inte"
          description="Länken kan vara gammal eller felstavad. Sajten har fått ny struktur, så en del äldre adresser fungerar inte längre. Nedan finns vägarna vidare."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "404" }]}
        />

        <section className="py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VAGAR.map((v) => (
                <Link
                  key={v.href}
                  href={v.href}
                  className="group p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB] hover:border-[#2B74FC] transition-colors"
                >
                  <div
                    className="text-lg font-bold mb-2 group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {v.rubrik}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {v.text}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/offert"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Boka kostnadsfri takkontroll <ArrowRight size={18} />
              </Link>
              <a
                href="tel:082838888"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border border-gray-200 hover:border-[#2B74FC] transition-colors"
                style={{ color: "var(--color-dark)" }}
              >
                <Phone size={18} /> 08-28 38 88
              </a>
            </div>

            {/* Maskinläsbara ingångar. Hjälper crawlers och agenter att hitta
                vidare från en 404 i stället för att avbryta. */}
            <p className="mt-10 text-xs text-gray-400">
              Maskinläsbart:{" "}
              <a href="/sitemap.xml" className="underline hover:text-gray-600">
                /sitemap.xml
              </a>{" "}
              ·{" "}
              <a href="/llms.txt" className="underline hover:text-gray-600">
                /llms.txt
              </a>{" "}
              ·{" "}
              <a href="/robots.txt" className="underline hover:text-gray-600">
                /robots.txt
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
