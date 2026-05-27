import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { CheckCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/offert" },
  title: "Boka kostnadsfri takkontroll | Sands Entreprenad",
  description:
    "Boka en kostnadsfri takkontroll, vi inspekterar ditt tak och ger dig ett fast pris utan förbindelser.",
};

export default function OffertPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Kostnadsfri takkontroll"
          title="Få skräddarsytt"
          titleAccent="prisförslag"
          description="Vi bokar ett kostnadsfritt hembesök där din personliga projektledare inspekterar taket och går igenom dina behov. Du får en tydlig bedömning på plats, utan förbindelser."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Boka offert" }]}
          backgroundImage="/images/hero-offert.jpg"
          imageAlt="Villa med nytt plåttak i skymning"
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
              <div>
                <ul className="space-y-4 mb-10">
                  {[
                    "Kostnadsfri takkontroll utan förbindelser",
                    "Fast pris med totalentreprenad (ABT-06)",
                    "Upp till 30 års Monier Tätt tak-garanti",
                    "ROT-avdrag 30%, vi sköter ansökan",
                    "Certifierad Monier Takpartner sedan 2016",
                    "Normalt svar inom 24 timmar",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-base text-gray-700"
                    >
                      <CheckCircle
                        size={18}
                        style={{ color: "var(--color-primary)" }}
                        className="shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="p-6 rounded-2xl border border-gray-100 bg-[#F8F9FB]">
                  <p className="text-sm text-gray-500 mb-1">
                    Föredrar du att ringa?
                  </p>
                  <a
                    href="tel:0828388"
                    className="inline-flex items-center gap-2 text-3xl font-extrabold"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    <Phone size={22} />
                    08-28 38 88
                  </a>
                </div>
              </div>

              <aside>
                <LeadForm variant="section" />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
