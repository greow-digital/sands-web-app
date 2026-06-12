import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/var-process",
  title: "Vår process: så funkar ett takbyte i 4 steg | Sands AB",
  description:
    "Så funkar ett takbyte med Sands Entreprenad: hembesök, offert, utförande, slutkontroll. Fast pris från start, 30 års garanti, ROT-avdrag tillämpas.",
});

const steg = [
  {
    num: "01",
    title: "Hembesök",
    subtitle: "Kostnadsfritt, utan förbindelser",
    text: "Vi bokar ett kostnadsfritt hembesök där din personliga projektledare inspekterar taket och går igenom dina behov. Du får en tydlig bedömning på plats, vad behöver göras, varför och i vilken ordning.",
    bullets: [
      "Noggrann inspektion av tak, nock, ventilation och genomföringar",
      "Bedömning av underlagets skick",
      "Dialog om materialval och önskemål",
      "Tidsuppskattning för projektet",
    ],
  },
  {
    num: "02",
    title: "Fast offert",
    subtitle: "Totalentreprenad enligt ABT-06",
    text: "Du får en detaljerad offert med fast pris enligt totalentreprenad (ABT-06). Allt i ett kontrakt, inga dolda avgifter, inga överraskningar. Vi specificerar exakt vilka material, arbetsmoment och garantier som ingår.",
    bullets: [
      "Fast pris, inga löpande kostnader",
      "Alla material och arbeten specificerade",
      "Garantivillkor tydliggjorda",
      "ROT-avdrag beräknat",
    ],
  },
  {
    num: "03",
    title: "Utförande",
    subtitle: "Professionellt och noggrant",
    text: "Vårt erfarna team utför arbetet effektivt, säkert och noggrant med fokus på kvalitet i varje detalj. Din projektledare är alltid tillgänglig för frågor under hela projektet.",
    bullets: [
      "Rivning och bortforsling av gammalt material",
      "Ny underlagspapp och ny läkt",
      "Läggning av takpannor/material",
      "Nytt regnvattensystem och taksäkerhet",
    ],
  },
  {
    num: "04",
    title: "Takkontroll",
    subtitle: "Garanti och trygghet",
    text: "Vi avslutar med en noggrann takkontroll tillsammans med dig för att säkerställa att allt är i perfekt skick. Du får ett garantibevis och vi finns tillgängliga om du har frågor efteråt.",
    bullets: [
      "Genomgång av allt utfört arbete",
      "Dokumentation och garantibevis",
      "Monier Tätt tak-garanti aktiveras",
      "Vi städar och lämnar tomten i ordning",
    ],
  },
];

export default function VarProcessPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Hur vi jobbar"
          title="Vår"
          titleAccent="process"
          description="Från första kontakt till färdigt tak, vi håller dig informerad i varje steg. Alltid fast pris, alltid totalentreprenad."
          breadcrumbs={[
            { label: "Hem", href: "/" },
            { label: "Vår process" },
          ]}
        />

        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 lg:sticky lg:top-28">
                <Image
                  src="/images/hero-sands-construction.jpg"
                  alt="Sands Entreprenad takläggare i arbete"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-12">
                {steg.map((s) => (
                  <div
                    key={s.num}
                    className="pb-12 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-baseline gap-4 mb-3">
                      <div
                        className="text-3xl font-extrabold"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {s.num}
                      </div>
                      <div>
                        <h2
                          className="text-2xl font-bold"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-dark)",
                          }}
                        >
                          {s.title}
                        </h2>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {s.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-5">
                      {s.text}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-gray-700"
                        >
                          <CheckCircle
                            size={15}
                            className="shrink-0 mt-0.5"
                            style={{ color: "var(--color-primary)" }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-gray-100 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-[26px] lg:text-[36px] font-extrabold tracking-[-0.02em] mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Redo att starta steg 1?
            </h2>
            <p className="text-gray-600 mb-8">
              Boka ett kostnadsfritt hembesök, vi inspekterar ditt tak och ger
              dig ett fast pris utan förbindelser.
            </p>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Få gratis offert <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
