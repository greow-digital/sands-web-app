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
  ArrowLeft,
  Pencil,
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

const ANTAL_STEG = 3;

// Postnummer låg tidigare som ett eget steg mellan ytan och kontakten. Det
// togs bort: det påverkade inte uträkningen, och ett steg som ber om en
// uppgift utan att svaret ändras lovar en precision det inte levererar.
const STEG_ETIKETT: Record<number, string> = {
  1: "Vilket takmaterial?",
  2: "Hur stort är taket?",
  3: "Vart skickar vi svaret?",
};

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

/**
 * Progressiv takräknare i tre steg.
 *
 * Steg 1 och 2 ger ett riktpris, sista steget leder till ett fast pris.
 * Priset visas först när steg 2 är klart: ett förvalt pris vid inladdning
 * gör att det inte finns något att förtjäna, och då bygger stegen ingen
 * commitment. Sidans materialkort svarar ändå på "vad kostar det" utan en
 * enda interaktion, så det är det personliga priset som är progressivt,
 * inte prisinformationen.
 *
 * När priset väl visats ligger det kvar över sista steget. Försvinner det
 * igen läses kontaktsteget som en ny grind.
 */
export default function Takraknare({
  embedded = false,
}: {
  embedded?: boolean;
} = {}) {
  const [steg, setSteg] = useState(1);
  const [material, setMaterial] = useState<MaterialKey | null>(null);
  const [kvm, setKvm] = useState(140);
  const [open, setOpen] = useState(false);
  const [useBoyta, setUseBoyta] = useState(false);
  const [boyta, setBoyta] = useState(120);

  const [stickyVisible, setStickyVisible] = useState(false);
  const engagedRef = useRef(false);
  const stickyFiredRef = useRef(false);
  const bridgeViewedRef = useRef(false);
  const stegRubrikRef = useRef<HTMLHeadingElement>(null);
  const sedda = useRef(new Set<number>([1]));

  const valtMaterial = material
    ? MATERIAL.find((m) => m.key === material)!
    : null;
  const r = valtMaterial ? calc(valtMaterial.prisM2, kvm) : null;
  const prisSynligt = steg >= 3 && r !== null;

  function firstEngage() {
    if (engagedRef.current) return;
    engagedRef.current = true;
    fireGtag("calculator_engage", { material });

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STICKY_DISMISSED_KEY) === "1";
    } catch {
      // sessionStorage blockerat
    }
    if (!dismissed) setStickyVisible(true);
  }

  // Ett steg kan ses utan att slutföras. Utan calc_step_view går det inte
  // att skilja "såg aldrig steget" från "hoppade av i steget".
  function gaTillSteg(nasta: number) {
    setSteg(nasta);
    if (!sedda.current.has(nasta)) {
      sedda.current.add(nasta);
      fireGtag("calc_step_view", { step: nasta, material });
    }
    // Flytta fokus till den nya stegrubriken, annars står fokus kvar på en
    // knapp som just försvann.
    requestAnimationFrame(() => stegRubrikRef.current?.focus());
  }

  function handleMaterial(next: MaterialKey) {
    setMaterial(next);
    firstEngage();
    fireGtag("calc_step_complete", { step: 1, material: next });
    gaTillSteg(2);
  }

  function handleYtaKlar() {
    fireGtag("calc_step_complete", { step: 2, material, area: kvm });
    firstEngage();
    // calc_bridge_view fyrades tidigare när formuläret skrollade in i
    // vyn. I det progressiva flödet finns formuläret bara på sista steget,
    // så det är samma händelse. Namnet behålls för att historiken i GA4
    // ska hänga ihop.
    if (!bridgeViewedRef.current) {
      bridgeViewedRef.current = true;
      fireGtag("calc_bridge_view", { material, area: kvm });
    }
    gaTillSteg(3);
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
          {/* Progressrad */}
          <div className="px-6 pt-6 lg:px-8 lg:pt-8">
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="h-1 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      n <= steg ? "var(--color-primary)" : "#E6E9EF",
                  }}
                />
              ))}
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h3
                ref={stegRubrikRef}
                tabIndex={-1}
                className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-500 outline-none"
              >
                <span style={{ color: "var(--color-primary)" }}>
                  Steg {steg} av {ANTAL_STEG}
                </span>{" "}
                · {STEG_ETIKETT[steg]}
              </h3>
              {steg > 1 && (
                <button
                  type="button"
                  onClick={() => gaTillSteg(steg - 1)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#2B74FC] transition-colors"
                >
                  <ArrowLeft size={13} /> Tillbaka
                </button>
              )}
            </div>
            {steg === 1 && (
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-dark)" }}
                >
                  Steg 1 och 2 ger ditt riktpris.
                </span>{" "}
                Sista steget ger dig ett fast pris. Du väljer själv hur långt
                du går.
              </p>
            )}
          </div>

          {/* Sammanfattning av gjorda val, klickbar tillbaka-väg */}
          {steg > 1 && valtMaterial && (
            <div className="px-6 lg:px-8 pt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => gaTillSteg(1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F4F7] px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-[#E6E9EF] transition-colors"
              >
                {valtMaterial.namn}
                <Pencil size={11} className="text-gray-400" />
              </button>
              {steg > 2 && (
                <button
                  type="button"
                  onClick={() => gaTillSteg(2)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F4F7] px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-[#E6E9EF] transition-colors"
                >
                  {kvm} m²
                  <Pencil size={11} className="text-gray-400" />
                </button>
              )}
            </div>
          )}

          {/* STEG 1 — Material */}
          {steg === 1 && (
            <div className="p-6 lg:p-8">
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
          )}

          {/* STEG 2 — Storlek */}
          {steg === 2 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-gray-500">Takyta</span>
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
                  onChange={(e) => {
                    setKvm(Number(e.target.value));
                    firstEngage();
                  }}
                  className="sands-slider w-full"
                  style={
                    { "--progress": `${sliderProgress}%` } as React.CSSProperties
                  }
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
                      if (on) setKvm(Math.round(boyta * 1.2));
                      firstEngage();
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
                        if (v >= 40) setKvm(Math.round(v * 1.2));
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
                    Takytan är oftast 15–25% större än boytan på grund av
                    taklutningen.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleYtaKlar}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.01]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Fortsätt till prisförslag <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* RESULTAT — visas från steg 3 och ligger kvar */}
          {prisSynligt && r && valtMaterial && (
            <div
              aria-live="polite"
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
                {valtMaterial.namn}, {kvm} m². Före ROT:{" "}
                {formatKr(r.undreForeRot)} – {formatKr(r.ovreForeRot)}
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
                  pris.
                </p>
              </div>
            </div>
          )}

          {/* Expanderbar: vad ingår. Först när priset finns att relatera till. */}
          {prisSynligt && (
            <>
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
            </>
          )}

          {/* STEG 3 — Kontaktuppgifter, samma lead-pipeline som /offert */}
          {steg === 3 && valtMaterial && (
            <div
              id="kalkyl-kontakt"
              className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50/60 scroll-mt-24"
            >
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
                showMessage
                ctaText="Få mitt prisförslag"
                confirmation={`Gäller: ${valtMaterial.namn.toLowerCase()}, ca ${kvm} m²`}
                extraPayload={{
                  roofType: valtMaterial.namn,
                  area: `${kvm} m²`,
                }}
                onSubmitSuccess={() =>
                  fireGtag("calc_bridge_submit", { material, area: kvm })
                }
              />
            </div>
          )}
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
                {prisSynligt ? "Ditt riktpris är klart" : "Du är snart framme"}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-tight mt-0.5">
                {prisSynligt
                  ? "Få ett bindande fast pris samma vardag."
                  : "Två steg kvar till ditt riktpris."}
              </p>
            </div>
            <a
              href="#takraknare"
              onClick={handleStickyClick}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-sm whitespace-nowrap transition-all hover:scale-[1.02] shadow-lg shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Fortsätt <ArrowRight size={14} />
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
