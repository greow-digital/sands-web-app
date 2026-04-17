import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { projekt } from "@/lib/projekt";

export const metadata: Metadata = {
  title: "Utförda projekt — Takläggning Stockholm | Sands Entreprenad",
  description:
    "Se utförda takläggningsprojekt runt om i Stockholms län. Tegeltak, betongtak, plåttak och eternitbyten med Monier-garanti.",
};

export default function ProjektPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Referenser"
          title="Utförda"
          titleAccent="projekt"
          description="Exempel på takläggningar vi utfört runt om i Stockholms län. Varje projekt genomförs med Monier-material och avslutas med slutbesiktning."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Projekt" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projekt.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projekt/${p.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-200 relative projekt-thumb">
                    {p.images.length >= 3 ? (
                      <div className="grid grid-cols-[1.4fr_1fr] gap-[2px] h-full">
                        <div className="relative">
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 60vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                          />
                        </div>
                        <div className="grid grid-rows-2 gap-[2px]">
                          <div className="relative">
                            <Image
                              src={p.images[1]}
                              alt={`${p.title} — bild 2`}
                              fill
                              sizes="(max-width: 640px) 40vw, 13vw"
                              className="object-cover projekt-img"
                            />
                          </div>
                          <div className="relative">
                            <Image
                              src={p.images[2]}
                              alt={`${p.title} — bild 3`}
                              fill
                              sizes="(max-width: 640px) 40vw, 13vw"
                              className="object-cover projekt-img"
                            />
                          </div>
                        </div>
                      </div>
                    ) : p.images.length === 2 ? (
                      <div className="grid grid-cols-[1.4fr_1fr] gap-[2px] h-full">
                        <div className="relative">
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 60vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src={p.images[1]}
                            alt={`${p.title} — bild 2`}
                            fill
                            sizes="(max-width: 640px) 40vw, 13vw"
                            className="object-cover projekt-img"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 projekt-img"
                        />
                      </div>
                    )}
                  </div>
                  <h2
                    className="text-base font-bold mb-1 group-hover:text-[#2B74FC] transition-colors"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {p.title}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} />
                    {p.ort} · {p.kvm} kvm · {p.år}
                  </div>
                </Link>
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
              Ditt tak kan vara nästa projekt
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Boka kostnadsfri takbesiktning — fast pris utan förbindelser.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Boka takbesiktning <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
