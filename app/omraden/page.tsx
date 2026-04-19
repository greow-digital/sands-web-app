import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { omraden } from "@/lib/omraden";

export const metadata: Metadata = {
  alternates: { canonical: "/omraden" },
  title: "Takläggare i Stockholms län — Alla områden | Sands Entreprenad",
  description:
    "Vi utför takbyten och takomläggningar i hela Stockholms län — 27+ kommuner. Certifierad Monier Takpartner med fast pris.",
};

const regionOrder = [
  "Stockholm stad",
  "Norrort",
  "Söderort",
  "Västerort",
  "Övriga",
];

export default function OmradenPage() {
  const grouped = regionOrder.reduce<Record<string, typeof omraden>>(
    (acc, region) => {
      acc[region] = omraden.filter((o) => o.region === region);
      return acc;
    },
    {}
  );

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Stockholms län"
          title="Takläggare i hela"
          titleAccent="Stockholms län"
          description="Vi utför takbyten och takomläggningar i 27+ kommuner i Stockholms län. Boka kostnadsfri takkontroll — alltid fast pris."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Områden" },
          ]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {regionOrder.map((region) => (
              <div key={region}>
                <h2
                  className="text-xl font-bold mb-6 pb-3 border-b border-gray-100"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  {region}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {grouped[region]?.map((ort) => (
                    <Link
                      key={ort.slug}
                      href={`/omraden/${ort.slug}`}
                      className="group flex items-center gap-3 px-5 py-4 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-colors"
                    >
                      <MapPin
                        size={14}
                        className="shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span
                        className="text-sm font-semibold group-hover:text-[#2B74FC] transition-colors"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {ort.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
