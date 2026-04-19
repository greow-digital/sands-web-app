import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  alternates: { canonical: "/omdomen" },
  title: "Kundomdömen | Sands Entreprenad — 4.8 i snittbetyg",
  description:
    "Läs vad våra kunder säger om Sands Entreprenad. 4.8 i snittbetyg av 54 omdömen. Takläggare i Stockholm med hög kundnöjdhet.",
};

const omdömen = [
  { name: "Anders L.", ort: "Täby", tjänst: "Betongtak", betyg: 5, text: "Professionellt och pålitligt företag. Boka ett hembesök — ni ångrar er inte. Fast pris från start och inga överraskningar." },
  { name: "Maria S.", ort: "Nacka", tjänst: "Tegeltak", betyg: 5, text: "Snabb offert, tydlig kommunikation och ett riktigt snyggt resultat. Rekommenderar Sands varmt!" },
  { name: "Erik H.", ort: "Järfälla", tjänst: "Plåttak", betyg: 5, text: "Hade ett gammalt eternittak som behövde bytas. Sands skötte hela processen — sanering och nytt plåttak. Supernöjd!" },
  { name: "Karin B.", ort: "Bromma", tjänst: "Betongtak", betyg: 5, text: "Från första kontakt till takkontroll var allt professionellt och välorganiserat. Priset stämde precis med offerten." },
  { name: "Peter M.", ort: "Huddinge", tjänst: "Takomläggning", betyg: 5, text: "Sands team är duktiga och noggranna. De städade efter sig och lämnade tomten i perfekt skick. Skulle anlita igen." },
  { name: "Anna W.", ort: "Solna", tjänst: "Tegeltak", betyg: 5, text: "Monier-garanti i 30 år är guld värt. Hela processen gick smidigt och vi fick bra vägledning kring materialval." },
  { name: "Johan R.", ort: "Tyresö", tjänst: "Betongtak", betyg: 5, text: "Extremt nöjd! Projektet höll tidplan och budget. Projektledaren var alltid tillgänglig och svarade snabbt på frågor." },
  { name: "Lena K.", ort: "Danderyd", tjänst: "Tegeltak", betyg: 5, text: "Fantastiskt jobb på vårt gamla hus. Tegelpannorna ser ut precis som vi hoppades och grannarna hör av sig för att fråga om hantverkare." },
];

export default function OmdömenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sands Entreprenad Stockholm AB",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "54",
      bestRating: "5",
    },
    review: omdömen.slice(0, 4).map((o) => ({
      "@type": "Review",
      author: { "@type": "Person", name: o.name },
      reviewRating: { "@type": "Rating", ratingValue: o.betyg },
      reviewBody: o.text,
    })),
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PageHero
          eyebrow="Omdömen · 4.8 / 5 av 54 kunder"
          title="Vad våra"
          titleAccent="kunder säger"
          description="Vi är stolta över att få göra skillnad för våra kunder — här kan du läsa vad de tycker om oss."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Omdömen" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {omdömen.map((o) => (
                <div
                  key={o.name + o.ort}
                  className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: o.betyg }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed mb-5">
                    &ldquo;{o.text}&rdquo;
                  </p>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {o.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.tjänst} · {o.ort}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em] mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Bli nästa nöjda kund
            </h2>
            <p className="text-gray-600 mb-6">
              Boka kostnadsfri takkontroll idag.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Boka takkontroll <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
