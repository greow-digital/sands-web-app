"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Layers,
  Grid3x3,
  AlignJustify,
  Square,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";

// Priserna är "från ca X kr/m² efter ROT-avdrag" — samma riktvärden som
// på /priser. Övre intervall = +30% för komplexa tak (kupor, ränndalar,
// branta lutningar). ROT-avdraget som visas baseras på arbetskostnaden.
const ROT_PROCENT = 0.3;
const ROT_CAP = 50000; // max ROT per person/år
const ARBETE_KR_M2 = 875; // för ROT-uppskattning (inkl moms)
const KOMPLEX = 1.3;

type MaterialKey = "betong" | "tegel" | "plat" | "papp";

const MATERIAL: {
  key: MaterialKey;
  namn: string;
  prisM2: number;
  icon: typeof Layers;
}[] = [
  { key: "betong", namn: "Betongpannor", prisM2: 1200, icon: Square },
  { key: "tegel", namn: "Tegeltak", prisM2: 1500, icon: Grid3x3 },
  { key: "plat", namn: "Plåttak", prisM2: 1800, icon: AlignJustify },
  { key: "papp", namn: "Papptak", prisM2: 800, icon: Layers },
];

const INGAR = [
  "Rivning och bortforsling av gammalt tak",
  "Ny underlagspapp (Icopal Flexilight Prima)",
  "Ny ströläkt & bärläkt",
  "Nytt takmaterial",
  "Nytt regnvattensystem (hängrännor och stuprör)",
  "Ställning, container och transport",
];

function calc(prisM2: number, kvm: number) {
  const undreEfterRot = prisM2 * kvm;
  const ovreEfterRot = undreEfterRot * KOMPLEX;
  const rot = Math.min(ARBETE_KR_M2 * kvm * ROT_PROCENT, ROT_CAP);
  return {
    undreEfterRot,
    ovreEfterRot,
    undreForeRot: undreEfterRot + rot,
    ovreForeRot: ovreEfterRot + rot,
    rot,
    rotCapped: ARBETE_KR_M2 * kvm * ROT_PROCENT > ROT_CAP,
  };
}

function formatKr(value: number): string {
  return Math.round(value).toLocaleString("sv-SE") + " kr";
}

type GtagFn = (event: string, name: string, params: object) => void;

function fireGtag(name: string, params: object) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (window as unknown as { gtag: GtagFn }).gtag("event", name, {
    event_category: "engagement",
    event_label: "takraknare",
    ...params,
  });
}

export default function Takraknare({
  embedded = false,
}: {
  embedded?: boolean;
} = {}) {
  const [material, setMaterial] = useState<MaterialKey>("betong");
  const [kvm, setKvm] = useState(140);
  const [open, setOpen] = useState(false);
  const [useBoyta, setUseBoyta] = useState(false);
  const [boyta, setBoyta] = useState(120);

  const engagedRef = useRef(false);
  const bridgeViewedRef = useRef(false);
  const bridgeRef = useRef<HTMLDivElement>(null);

  const valtMaterial = MATERIAL.find((m) => m.key === material)!;
  const r = calc(valtMaterial.prisM2, kvm);

  function firstEngage() {
    if (engagedRef.current) return;
    engagedRef.current = true;
    fireGtag("calculator_engage", { material });
  }

  function handleMaterial(next: MaterialKey) {
    setMaterial(next);
    firstEngage();
    fireGtag("calc_step_complete", { step: 1, material: next });
  }

  function handleSlider(next: number) {
    setKvm(next);
    firstEngage();
  }

  function commitSize(value: number) {
    fireGtag("calc_step_complete", { step: 2, material });
    firstEngage();
    setKvm(value);
  }

  // calc_bridge_view: fyras en gång när bro-formuläret syns i viewporten.
  useEffect(() => {
    const el = bridgeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !bridgeViewedRef.current) {
          bridgeViewedRef.current = true;
          fireGtag("calc_bridge_view", { material, area: kvm });
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // material/kvm avsiktligt ej i deps: vi vill bara fyra första gången.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sliderProgress = ((kvm - 60) / (300 - 60)) * 100;

  return (
    <section
      id="takraknare"
      className={
        embedded
          ? "scroll-mt-24"
          : "py-16 lg:py-20 border-t border-gray-100 scroll-mt-24"
      }
    >
      <div
        className={embedded ? "" : "max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8"}
      >
        {!embedded && (
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
              Välj takmaterial och yta för en uppskattning, inkl. moms och efter
              ROT-avdrag.
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* STEG 1 — Material */}
          <div className="p-6 lg:p-8 border-b border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500 mb-4">
              1. Vilket takmaterial?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MATERIAL.map((m) => {
                const active = m.key === material;
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleMaterial(m.key)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all ${
                      active
                        ? "border-[#2B74FC] bg-[rgba(43,116,252,0.06)]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      size={22}
                      style={{
                        color: active
                          ? "var(--color-primary)"
                          : "var(--color-dark)",
                      }}
                    />
                    <span
                      className="text-xs sm:text-sm font-semibold leading-tight"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {m.namn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEG 2 — Storlek */}
          <div className="p-6 lg:p-8">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500">
                2. Hur stort är taket?
              </h3>
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
                onChange={(e) => handleSlider(Number(e.target.value))}
                onPointerUp={() => commitSize(kvm)}
                onKeyUp={() => commitSize(kvm)}
                className="sands-slider w-full"
                style={{ "--progress": `${sliderProgress}%` } as React.CSSProperties}
                aria-label="Takyta i kvadratmeter"
                disabled={useBoyta}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60 m²</span>
              <span>300 m²</span>
            </div>

            {/* Vet ej-toggle: boyta + 20% */}
            <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBoyta}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setUseBoyta(on);
                    if (on) commitSize(Math.round(boyta * 1.2));
                  }}
                  className="h-4 w-4 accent-[#2B74FC]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Vet ej takytan — räkna på husets boyta + 20%
                </span>
              </label>
              {useBoyta && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-gray-500">Boyta</span>
                  <input
                    type="number"
                    min={40}
                    max={250}
                    value={boyta}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBoyta(v);
                      if (v >= 40) commitSize(Math.round(v * 1.2));
                    }}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#2B74FC]"
                  />
                  <span className="text-sm text-gray-500">
                    m² → ca {Math.round(boyta * 1.2)} m² takyta
                  </span>
                </div>
              )}
              {!useBoyta && (
                <p className="text-xs text-gray-400 mt-1.5 pl-7">
                  Takytan är oftast 15–25% större än boytan på grund av taklutningen.
                </p>
              )}
            </div>
          </div>

          {/* STEG 3 — Resultat */}
          <div
            className="px-6 py-8 lg:px-8 lg:py-10"
            style={{ backgroundColor: "var(--color-dark)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3 text-center">
              Ditt uppskattade pris efter ROT-avdrag
            </p>
            <div
              className="text-center text-[28px] lg:text-[40px] font-extrabold tracking-[-0.02em] text-white mb-3 tabular-nums"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatKr(r.undreEfterRot)} – {formatKr(r.ovreEfterRot)}
            </div>
            <p className="text-xs lg:text-sm text-gray-400 text-center leading-relaxed">
              Före ROT: {formatKr(r.undreForeRot)} – {formatKr(r.ovreForeRot)}
              <br />
              Inkl. material, arbete, ställning och bortforsling. Inga dolda
              tillägg.
            </p>
          </div>

          {/* Expanderbar: vad ingår */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="w-full flex items-center justify-between px-6 py-5 lg:px-8 border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-bold" style={{ color: "var(--color-dark)" }}>
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
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 pt-6">
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
          )}
        </div>

        {/* STEG 4 — Bron (lead-formulär, samma pipeline som /offert) */}
        <div ref={bridgeRef} className="mt-8">
          <div className="text-center mb-5 max-w-lg mx-auto">
            <h3
              className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] mb-2"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              Få ditt exakta fasta pris
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Vi gör en kostnadsfri takkontroll och lämnar ett bindande fast
              prisförslag inom 24 h. Inte bindande för dig.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <LeadForm
              variant="section"
              formId="calc_bridge"
              fields="minimal"
              hideHeader
              ctaText="Få mitt fasta pris"
              confirmation={`Gäller: ${valtMaterial.namn.toLowerCase()}, ca ${kvm} m²`}
              extraPayload={{
                roofType: valtMaterial.namn,
                area: `${kvm} m²`,
              }}
              privacyNote
              onSubmitSuccess={() =>
                fireGtag("calc_bridge_submit", { material, area: kvm })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
