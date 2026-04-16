import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { artiklar } from "@/lib/blogg";

export const metadata: Metadata = {
  title: "Blogg — Tips om takläggning i Stockholm | Sands Entreprenad",
  description:
    "Artiklar och råd om takbyte, material, priser och underhåll från Sands Entreprenad — takläggare i Stockholm.",
};

export default function BloggPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Kunskapsbank"
          title="Blogg &"
          titleAccent="tips"
          description="Artiklar om takbyte, material, priser och underhåll från våra takexperter."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Blogg" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {artiklar.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blogg/${a.slug}`}
                  className="block p-6 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(43,116,252,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {a.kategori}
                    </span>
                    <span className="text-xs text-gray-400">{a.lästid}</span>
                  </div>
                  <h2
                    className="text-lg font-bold mb-3 group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {a.titel}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                    {a.ingress}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} />
                      {new Date(a.datum).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Läs mer <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
