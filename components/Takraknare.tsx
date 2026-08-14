"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Layers,
  Grid3x3,
  AlignJustify,
  Square,
  ArrowRight,
  X,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import {
  MATERIAL_LIST,
  KOMPLEX_MULTIPLIER,
  type MaterialKey,
} from "@/lib/material";

// Priser och livslängder kommer från delad lib/material (= /priser och
// takläggningssidan). ROT-avdraget som visas baseras på arbetskostnaden.
const ROT_PROCENT = 0.3;
const ROT_CAP = 50000; // max ROT per person/år
const ARBETE_KR_M2 = 875; // för ROT-uppskattning (inkl moms)
const KOMPLEX = KOMPLEX_MULTIPLIER;

const ICONS: Record<MaterialKey, typeof Layers> = {
  betong: Square,
  tegel: Grid3x3,
  plat: AlignJustify,
  papp: Layers,
};

const MATERIAL = MATERIAL_LIST.map((m) => ({ ...m, icon: ICONS[m.key] }));

const INGAR = [
  "Rivning och bortforsling av gammalt tak",
  "Ny underlagspapp (Icopal Flexilight Prima)",
  "Ny ströläkt & bärläkt",
  "Nytt takmaterial",
  "Nytt regnvattensystem (hängrännor och stuprör)",
  "Ställning, container och transport",
];

// Vad riktpriset förutsätter. Ett riktpris utan förutsättningar läses som
// ett svar, och då finns ingen anledning att boka något. Namnger vi i
// stället exakt vad vi inte kan veta på distans blir takkontrollen svaret
// på en fråga sidan just ställt.
const FORUTSATTER = [
  "sadeltak utan kupor",
  "frisk råspont under pannorna",
  "normal ställningsåtkomst runt huset",
];

const OSAKERHET = [
  {
    rubrik: "Råsponten",
    text: "Syns först när gamla taket är rivet. Är den rötskadad ska den bytas, och det märks på slutsumman.",
  },
  {
    rubrik: "Takets form",
    text: "Kupor, ränndalar, skorstenar och ventilationsgenomföringar kräver plåtarbete som ett rakt sadeltak inte har.",
  },
  {
    rubrik: "Åtkomsten",
    text: "Trång tomt, hög höjd eller närhet till grannfastighet påverkar ställningen. Enkel åtkomst drar åt andra hållet.",
  },
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

const STICKY_DISMISSED_KEY = "sands_calc_sticky_dismissed";

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
  const [postnummer, setPostnummer] = useState("");
  const postnummerFiredRef = useRef(false);

  const [stickyVisible, setStickyVisible] = useState(false);
  const engagedRef = useRef(false);
  const bridgeViewedRef = useRef(false);
  const stickyFiredRef = useRef(false);
  const bridgeRef = useRef<HTMLDivElement>(null);

  const valtMaterial = MATERIAL.find((m) => m.key === material)!;
  const r = calc(valtMaterial.prisM2, kvm);

  function firstEngage() {
    if (engagedRef.current) return;
    engagedRef.current = true;
    fireGtag("calculator_engage", { material });

    // Posta-engagement sticky-bar (visas en gång per session om ej dismissad)
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STICKY_DISMISSED_KEY) === "1";
    } catch {
      // sessionStorage blockerat
    }
    if (!dismissed) setStickyVisible(true);
  }

  function handlePostnummer(value: string) {
    // Bara siffror och ett mellanslag, i svensk form "176 71".
    const rensat = value.replace(/[^\d\s]/g, "").slice(0, 6);
    setPostnummer(rensat);
    firstEngage();
    if (rensat.replace(/\s/g, "").length === 5 && !postnummerFiredRef.current) {
      postnummerFiredRef.current = true;
      fireGtag("calc_step_complete", { step: 3, material });
    }
  }

  function handleStickyClick() {
    fireGtag("calc_sticky_click", { material, area: kvm });
  }

  function handleStickyDismiss() {
    fireGtag("calc_sticky_dismiss", { material, area: kvm });
    setStickyVisible(false);
    try {
      sessionStorage.setItem(STICKY_DISMISSED_KEY, "1");
    } catch {
      // sessionStorage blockerat: kan visas igen vid nytt engagement
    }
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

  // Impression-event när sticky-baren visas första gången
  useEffect(() => {
    if (stickyVisible && !stickyFiredRef.current) {
      stickyFiredRef.current = true;
      fireGtag("calc_sticky_view", { material, area: kvm });
    }
  }, [stickyVisible, material, kvm]);

  // Talar om för globala MobileCTA att dölja sig medan denna bar syns,
  // så de inte staplas i botten. Städar vid unmount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("sands:calc-sticky", { detail: { visible: stickyVisible } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("sands:calc-sticky", { detail: { visible: false } })
      );
    };
  }, [stickyVisible]);

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
              Alla priser inkl. moms och efter ROT-avdrag.
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Sätter förväntan innan räknaren börjar. Numreringen lovar fyra
              steg men priset kommer redan efter två, och utan den här raden
              läses steg 3 och 4 som en avgift för något användaren redan
              har fått. Här blir de i stället ett erbjudande om något bättre. */}
          <div className="px-6 pt-6 lg:px-8 lg:pt-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span
                className="font-semibold"
                style={{ color: "var(--color-dark)" }}
              >
                Steg 1 och 2 ger ditt riktpris direkt.
              </span>{" "}
              Steg 3 och 4 ger dig ett fast pris. Du väljer själv hur långt du
              går.
            </p>
          </div>

          {/* STEG 1 — Material */}
          <div className="p-6 lg:p-8 border-b border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500 mb-4">
              <span style={{ color: "var(--color-primary)" }}>Steg 1 av 4</span>{" "}
              · Vilket takmaterial?
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
                <span style={{ color: "var(--color-primary)" }}>
                  Steg 2 av 4
                </span>{" "}
                · Hur stort är taket?
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
                  Vet ej takytan, räkna på husets boyta + 20%
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

          {/* RESULTAT — medvetet ofullständigt, se FORUTSATTER/OSAKERHET */}
          <div
            className="px-6 py-8 lg:px-8 lg:py-10"
            style={{ backgroundColor: "var(--color-dark)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3 text-center">
              Ditt riktpris efter ROT-avdrag
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

            <div className="mt-7 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="font-semibold text-white">
                  Det här är inte hela svaret.
                </span>{" "}
                Siffran förutsätter {FORUTSATTER[0]}, {FORUTSATTER[1]} och{" "}
                {FORUTSATTER[2]}. Tre saker kan flytta priset i endera
                riktningen, och ingen av dem går att se på avstånd:
              </p>
              <ul className="mt-4 grid sm:grid-cols-3 gap-3">
                {OSAKERHET.map((o) => (
                  <li
                    key={o.rubrik}
                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <p className="text-xs font-bold text-white mb-1">
                      {o.rubrik}
                    </p>
                    <p className="text-[11px] leading-relaxed text-gray-400">
                      {o.text}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                Vi tittar på alla tre vid takkontrollen och sätter ett fast
                pris. Fortsätt nedan så vet du var du står.
              </p>
            </div>
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

          {/* STEG 3 — Postnummer. Ligger inuti widgeten, inte i ett eget
              formulär bredvid: den som redan valt material och dragit i
              reglaget är mitt i ett flöde, och ett separat formulär läser
              som en ny förhandling. */}
          <div className="p-6 lg:p-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500 mb-4">
              <span style={{ color: "var(--color-primary)" }}>Steg 3 av 4</span>{" "}
              · Var ligger huset?
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={postnummer}
                onChange={(e) => handlePostnummer(e.target.value)}
                placeholder="176 71"
                aria-label="Postnummer"
                className="w-32 px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors tabular-nums"
              />
              <p className="text-xs text-gray-500 leading-relaxed flex-1 min-w-[220px]">
                Ställning, etablering och transport prissätts utifrån var huset
                ligger. Vi arbetar i hela Stockholms län.
              </p>
            </div>
          </div>

          {/* STEG 4 — Kontaktuppgifter, samma lead-pipeline som /offert */}
          <div
            ref={bridgeRef}
            id="kalkyl-kontakt"
            className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50/60 scroll-mt-24"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500 mb-2">
              <span style={{ color: "var(--color-primary)" }}>Steg 4 av 4</span>{" "}
              · Vart skickar vi svaret?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Vi bokar en kostnadsfri takkontroll, tittar på de tre punkterna
              ovan och lämnar ett bindande fast pris inom 24 h. Du binder dig
              inte till något.
            </p>
            <LeadForm
              variant="section"
              formId="calc_bridge"
              fields="minimal"
              contact="phone-or-email"
              flat
              hideHeader
              ctaText="Få mitt fasta pris"
              confirmation={`Gäller: ${valtMaterial.namn.toLowerCase()}, ca ${kvm} m²${
                postnummer.trim() ? `, ${postnummer.trim()}` : ""
              }`}
              extraPayload={{
                roofType: valtMaterial.namn,
                area: `${kvm} m²`,
                postnummer: postnummer.trim() || undefined,
              }}
              privacyNote
              onSubmitSuccess={() =>
                fireGtag("calc_bridge_submit", { material, area: kvm })
              }
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto text-center">
          Riktpriser som kan variera med takets skick och komplexitet. Du får
          ett bindande fast pris efter kostnadsfri takkontroll.
        </p>
      </div>

      {/* Post-engagement sticky-bar (visas efter första interaktion) */}
      {stickyVisible && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 sm:px-6 sm:pb-5"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <div
            className="max-w-[900px] mx-auto rounded-2xl shadow-2xl border border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 sm:gap-5"
            style={{ backgroundColor: "var(--color-dark)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm sm:text-base font-bold leading-tight">
                Ditt pris ser klart ut!
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-tight mt-0.5">
                Få ett bindande prisförslag samma vardag.
              </p>
            </div>
            {/* Scrollar till steg 4 i stället för att skicka iväg till
                /offert: formuläret finns redan i widgeten. */}
            <a
              href="#kalkyl-kontakt"
              onClick={handleStickyClick}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-sm whitespace-nowrap transition-all hover:scale-[1.02] shadow-lg shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Fortsätt till steg 4 <ArrowRight size={14} />
            </a>
            <button
              type="button"
              onClick={handleStickyDismiss}
              aria-label="Stäng"
              className="text-gray-400 hover:text-white transition-colors shrink-0 -mr-1"
            >
              <X size={18} />
            </button>
          </div>
          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
