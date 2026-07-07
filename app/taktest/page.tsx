import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Taktest from "@/components/Taktest";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/taktest",
  title: "Taktest – behöver ditt tak bytas? Testa på 1 minut | Sands",
  description:
    "Gör vårt kostnadsfria taktest på 1 minut. Några snabba frågor om ålder, material och skick ger dig en personlig bedömning av om taket behöver bytas. Boka gratis takkontroll.",
});

const FAKTA = [
  {
    q: "Är taktestet verkligen gratis?",
    a: "Ja. Både taktestet och den takkontroll du kan boka efteråt är helt kostnadsfria och utan förpliktelser.",
  },
  {
    q: "Ersätter testet en besiktning?",
    a: "Nej. Testet ger en indikation utifrån dina svar. En fysisk takkontroll på plats är det enda sättet att få ett säkert besked, och den bokar du direkt efter testet.",
  },
  {
    q: "Vad händer efter att jag fyllt i testet?",
    a: "Du får en personlig bedömning direkt på skärmen. Vill du gå vidare lämnar du dina kontaktuppgifter, så hör en av våra takexperter av sig för att boka en kostnadsfri takkontroll.",
  },
];

const TECKEN = [
  "Taket är äldre än 25–30 år",
  "Mossa, alg eller spruckna pannor",
  "Fuktfläckar i innertak eller på vinden",
  "Taket har läckt någon gång de senaste åren",
  "Hängande partier eller svackor i takfallet",
  "Original underlagspapp på ett äldre hus",
];

export default function TaktestPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16 lg:pt-20">
        {/* Immersivt taktest */}
        <Taktest />

        {/* ── SÅ FUNGERAR DET ─────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                Så fungerar taktestet
              </p>
              <h2
                className="text-[34px] lg:text-[46px] font-extrabold tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Från fråga till svar på en minut
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  titel: "Svara på frågorna",
                  text: "Några snabba klick om takets ålder, material, byggår och skick. Inga uppgifter krävs för att göra själva testet.",
                },
                {
                  num: "02",
                  titel: "Få din bedömning",
                  text: "Du får direkt en personlig bedömning med angelägenhetsgrad och de punkter som sticker ut i dina svar.",
                },
                {
                  num: "03",
                  titel: "Boka takkontroll",
                  text: "Vill du ha säkert besked bokar du en kostnadsfri takkontroll på plats. Vi hör av oss samma vardag.",
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="rounded-2xl border border-gray-100 bg-[#F8F9FB] p-7"
                >
                  <div
                    className="text-2xl font-extrabold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {s.num}
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {s.titel}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECKEN + LÄNKAR ─────────────────── */}
        <section
          className="py-20 lg:py-28 border-t border-gray-100"
          style={{ backgroundColor: "#F8F9FB" }}
        >
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                Vanliga tecken
              </p>
              <h2
                className="text-[32px] lg:text-[44px] font-extrabold tracking-[-0.02em] mb-5"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Tecken på att taket behöver bytas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Känner du igen något av det här är det klokt att göra taktestet
                och boka en kostnadsfri takkontroll. Ju tidigare du fångar
                slitaget desto billigare blir åtgärden.
              </p>
              <ul className="space-y-3">
                {TECKEN.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle
                      size={19}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span className="text-[15px] text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-7 lg:p-8">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--color-dark)" }}
              >
                Läs vidare
              </h3>
              <div className="space-y-3">
                {[
                  { href: "/tjanster/taklaggning", label: "Takläggning och takbyte i Stockholm" },
                  { href: "/priser", label: "Vad kostar ett takbyte?" },
                  { href: "/blogg/nar-byta-tak", label: "Hur vet du att det är dags att byta tak?" },
                  { href: "/projekt", label: "Se våra senaste takprojekt" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#F8F9FB] p-4 hover:border-[#2B74FC]/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#2B74FC]">
                      {l.label}
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-gray-400 group-hover:text-[#2B74FC] shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                Vanliga frågor
              </p>
              <h2
                className="text-[32px] lg:text-[44px] font-extrabold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Frågor om taktestet
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {FAKTA.map((f) => (
                <div key={f.q} className="py-6">
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
