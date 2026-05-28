"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";

// Alla siffror är exkl moms från Sands interna kalkyl. Multiplikatorn
// nedan ger konsumentpriser (inkl 25% moms) som matchar resten av sajten.
const MOMS = 1.25;
const FAST_KR = 35200 * MOMS;            // 44 000 kr (ställning, container, transport, kran)
const RORLIGT_KR_M2 = 979 * MOMS;        // 1 223,75 kr/m² (arbete + material)
const ARBETE_KR_M2 = 700 * MOMS;         // 875 kr/m²
const MATERIAL_KR_M2 = 279 * MOMS;       // 348,75 kr/m²
const ROT_PROCENT = 0.30;
const ROT_CAP = 50000;                   // Max ROT per person/år
const KOMPLEX_MULTIPLIER = 1.3;          // Övre prisintervall = +30%

function calculate(kvm: number) {
  const totalpris = FAST_KR + RORLIGT_KR_M2 * kvm;
  const rotRaw = ARBETE_KR_M2 * kvm * ROT_PROCENT;
  const rot = Math.min(rotRaw, ROT_CAP);
  const undre = totalpris - rot;
  const ovre = undre * KOMPLEX_MULTIPLIER;
  return {
    totalpris,
    rot,
    rotCapped: rotRaw > ROT_CAP,
    undre,
    ovre,
    arbete: ARBETE_KR_M2 * kvm,
    material: MATERIAL_KR_M2 * kvm,
    perM2: undre / kvm,
  };
}

function formatKr(value: number): string {
  return Math.round(value).toLocaleString("sv-SE") + " kr";
}

const INGAR = [
  "Rivning av befintligt tak",
  "Nya betongpannor (Monier Jönåker Elegant)",
  "Underlagspapp (Icopal Flexilight Prima)",
  "Ny ströläkt & bärläkt",
  "Vindskivor och beslag",
  "Hängrännor & 2 stuprör",
  "Hålpanna & nockregel",
  "Färg och småmaterial",
];

const INGAR_EJ = [
  "Taksäkerhet (stegar, snörasskydd)",
  "Råspontbyte vid rötskador",
  "Plåtarbeten utöver standard",
  "Kupor och ränndalar",
  "Fasadställning runt hela huset",
];

export default function Takraknare() {
  // Default 130 m² landar på ~169 000 kr efter ROT, vilket matchar
  // exempelpriset på startsidan (sadeltak 140 m² från 169 000 kr).
  const [kvm, setKvm] = useState(130);
  const [open, setOpen] = useState(true);
  const r = calculate(kvm);

  function handleCtaClick() {
    if (typeof window !== "undefined" && "gtag" in window) {
      const w = window as unknown as {
        gtag: (event: string, name: string, params: object) => void;
      };
      w.gtag("event", "calculator_cta_click", {
        event_category: "engagement",
        event_label: "takraknare",
        value: kvm,
      });
    }
  }

  const sliderProgress = ((kvm - 60) / (300 - 60)) * 100;

  return (
    <section
      id="takraknare"
      className="py-16 lg:py-20 border-t border-gray-100 scroll-mt-24"
    >
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "rgba(43,116,252,0.10)",
            }}
          >
            Prisuppskattning
          </span>
          <h2
            className="text-[28px] lg:text-[40px] font-extrabold tracking-[-0.03em] mb-3"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-dark)",
            }}
          >
            Vad kostar ditt takbyte?
          </h2>
          <p className="text-sm text-gray-500">
            Baserat på enkelt sadeltak med Monier betongpannor, inkl moms och
            efter ROT-avdrag.
          </p>
        </div>

        {/* Slider-kort */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex items-baseline justify-between mb-4">
              <label
                htmlFor="takyta"
                className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500"
              >
                Takyta
              </label>
              <div
                className="text-3xl lg:text-4xl font-extrabold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-dark)",
                }}
              >
                {kvm} m²
              </div>
            </div>

            <div className="relative pt-1 pb-2">
              <input
                id="takyta"
                type="range"
                min={60}
                max={300}
                step={5}
                value={kvm}
                onChange={(e) => setKvm(Number(e.target.value))}
                className="sands-slider w-full"
                style={
                  {
                    "--progress": `${sliderProgress}%`,
                  } as React.CSSProperties
                }
                aria-label="Takyta i kvadratmeter"
              />
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60 m²</span>
              <span>300 m²</span>
            </div>
          </div>

          {/* Prisvisning (mörkt) */}
          <div
            className="px-6 py-8 lg:px-8 lg:py-10"
            style={{ backgroundColor: "var(--color-dark)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3 text-center">
              Uppskattat pris efter ROT-avdrag
            </p>
            <div
              className="text-center text-[28px] lg:text-[40px] font-extrabold tracking-[-0.02em] text-white mb-3 tabular-nums"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatKr(r.undre)} – {formatKr(r.ovre)}
            </div>
            <p className="text-xs lg:text-sm text-gray-400 text-center">
              Från {Math.round(r.perM2).toLocaleString("sv-SE")} kr/m² · ROT-avdrag:{" "}
              {formatKr(r.rot)}
              {r.rotCapped && (
                <span className="text-gray-500"> (max 50 000 kr/person)</span>
              )}
            </p>
          </div>

          {/* Expanderbar breakdown */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="w-full flex items-center justify-between px-6 py-5 lg:px-8 border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-dark)" }}
            >
              Vad ingår i priset?
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="px-6 pb-8 lg:px-8 lg:pb-10 border-t border-gray-100 bg-gray-50/50">
              {/* Fasta kostnader */}
              <div className="pt-6">
                <div className="flex items-baseline justify-between mb-3">
                  <h3
                    className="text-sm font-bold uppercase tracking-[0.1em] text-gray-500"
                  >
                    Fasta kostnader
                  </h3>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {formatKr(FAST_KR)}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex justify-between">
                    <span>Ställning (långsidor + fallskydd)</span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(17500 * MOMS)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Containrar & bortforsling</span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(11000 * MOMS)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Transport</span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(1100 * MOMS)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Kran</span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(5600 * MOMS)}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Rörliga kostnader */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-baseline justify-between mb-3">
                  <h3
                    className="text-sm font-bold uppercase tracking-[0.1em] text-gray-500"
                  >
                    Rörliga kostnader · {kvm} m²
                  </h3>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {formatKr(r.arbete + r.material)}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex justify-between">
                    <span>
                      Arbete ({Math.round(ARBETE_KR_M2).toLocaleString("sv-SE")}{" "}
                      kr/m²)
                    </span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(r.arbete)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>
                      Material ({Math.round(MATERIAL_KR_M2).toLocaleString(
                        "sv-SE"
                      )}{" "}
                      kr/m²)
                    </span>
                    <span className="tabular-nums text-gray-500">
                      {formatKr(r.material)}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Ingår */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-500 mb-3">
                  Ingår i priset
                </h3>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                  {INGAR.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={14}
                        className="shrink-0 mt-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingår ej, varningsblock */}
              <div className="mt-6 p-5 rounded-2xl border border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5 text-amber-600"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900 mb-1">
                      Ingår inte, kan tillkomma
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Här uppstår vanligtvis de största prisskillnaderna mellan
                      enkla och komplexa projekt.
                    </p>
                  </div>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 pl-7">
                  {INGAR_EJ.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-amber-900 flex items-start gap-2"
                    >
                      <span className="text-amber-600 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/offert"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Boka kostnadsfri takkontroll <ArrowRight size={14} />
          </Link>
          <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto">
            Priserna är uppskattningar för enkelt sadeltak med betongpannor.
            Exakt pris ges alltid vid kostnadsfri hembesiktning.
          </p>
        </div>
      </div>
    </section>
  );
}
