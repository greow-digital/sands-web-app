import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import TrustBadgesRow from "@/components/TrustBadgesRow";
import { CheckCircle, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/offert",
  title: "Få prisförslag på takbyte i Stockholm: inom 24 h | Sands AB",
  description:
    "Begär kostnadsfri offert på ditt takbyte. Hembesök, fast pris från 169 000 kr efter ROT, 30 års garanti. Svarar samma vardag.",
});

const TRUST_BULLETS = [
  "Kostnadsfritt",
  "Utan förpliktelser",
  "Svarar samma vardag",
  "2 500+ kunder",
  "BraByggare 4,8",
  "30 års Monier-garanti",
];

const STEPS = [
  {
    num: "01",
    title: "Vi hör av oss",
    text: "Vi ringer eller mailar dig samma vardag för att boka tid för takkontroll.",
  },
  {
    num: "02",
    title: "Kostnadsfri takkontroll",
    text: "Din projektledare kommer hem och inspekterar taket tillsammans med dig.",
  },
  {
    num: "03",
    title: "Fast prisförslag",
    text: "Du får en komplett offert med fast pris efter ROT, inga dolda kostnader.",
  },
];

const TESTIMONIALS = [
  {
    text: "Väldigt professionellt och effektivt genomförande. Väldigt bra och detaljerad offert som också stämde exakt med slutfakturan. Rekommenderas varmt!",
    name: "Pauli",
    detail: "Tegeltak 150 kvm, Solna",
  },
  {
    text: "Tydligt offertförfarande. Därefter bra och noggrant utfört arbete. Kan varmt rekommendera Sands Entreprenad.",
    name: "Per",
    detail: "Takläggning, Stockholm",
  },
];

export default function OffertPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* ── HERO + FORM (2-kol) ─────────────── */}
        <section className="pt-6 lg:pt-12 pb-12 lg:pb-16 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 lg:mb-6">
              <Link href="/" className="hover:text-gray-600">
                Hem
              </Link>
              <ChevronRight size={12} />
              <span>Boka offert</span>
            </nav>

            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-start">
              {/* Text: visas under formuläret på mobil, vänster på desktop */}
              <div className="order-2 lg:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Kostnadsfri takkontroll
                </p>
                <h1
                  className="text-[26px] lg:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.1] lg:leading-[1.05] mb-4 lg:mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-dark)",
                  }}
                >
                  Boka din kostnadsfria{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    takkontroll
                  </span>
                </h1>
                <p className="text-base text-gray-600 leading-relaxed mb-7 max-w-lg">
                  Vi kommer hem till dig, inspekterar taket och lämnar ett
                  fast prisförslag med ROT-avdrag. Inga förpliktelser.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-sm text-gray-700">
                  {TRUST_BULLETS.map((b) => (
                    <li key={b} className="inline-flex items-center gap-2">
                      <CheckCircle
                        size={15}
                        className="shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form: först på mobil (över fold), höger på desktop */}
              <div className="order-1 lg:order-2">
                <LeadForm
                  variant="section"
                  formId="offert"
                  notBindingNote
                  privacyNote
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── VAD HÄNDER HÄRNÄST ──────────────── */}
        <section className="py-14 lg:py-20 bg-[#F8F9FB]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Efter du skickat in
              </p>
              <h2
                className="text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                Vad händer härnäst?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className="p-5 lg:p-6 rounded-2xl bg-white border border-gray-100"
                >
                  <div
                    className="text-2xl font-extrabold mb-3 tabular-nums"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {s.num}
                  </div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────── */}
        <section className="py-14 lg:py-20 border-t border-gray-100">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div
              data-nosnippet
              className="grid sm:grid-cols-2 gap-5 lg:gap-6"
            >
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="p-6 rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-gray-700 leading-relaxed mb-3">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="text-xs text-gray-500">
                    <strong className="text-gray-800">{t.name}</strong>
                    <span className="block">{t.detail}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ────────────────────── */}
        <section className="py-12 lg:py-16 border-t border-gray-100 bg-[#F8F9FB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <TrustBadgesRow />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
