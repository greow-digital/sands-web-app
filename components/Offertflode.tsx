"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import RoofSvg from "@/components/RoofSvg";
import {
  ALDER,
  DETALJER,
  TAKFORM,
  TAKMATERIAL,
  TECKEN,
  TIDSPLAN,
  insikter,
  lageISpannet,
  riktpris,
  sammanfattning,
  skick,
  type Svar,
  type Val,
} from "@/lib/takkoll";
import type { MaterialKey } from "@/lib/material";

/*
  Offertflödet: priskalkylatorn och taktestet i ett (beslut 19 okt 2026).
  /priser och /taktest är två ingångar till samma flöde. Ingången styr
  bara introtexten och vilket formId leaden får, så att kanalen i arket och
  i GA4 fortfarande skiljer priskalkylator från taktest.

  Ordningen bygger commitment innan något efterfrågas: sju knappval, sedan
  pris och skick, sist offerten. Priset gömmer sig inte bakom formuläret,
  det är formuläret som erbjuder det priset inte kan ge: ett fast pris.

  Knappen säger "Få gratis offert", ett medvetet undantag från CTA-regeln i
  SEO.md §4 för just det här flödet, eftersom det ligger närmast den
  intention besökaren har när priset står på skärmen.
*/

type Ingang = "priser" | "taktest";

const STEG = [
  { id: "material", fraga: "Vilket takmaterial gäller det?" },
  { id: "yta", fraga: "Hur stort är taket?" },
  { id: "takform", fraga: "Vilken takform har huset?" },
  { id: "detaljer", fraga: "Finns något av det här på taket?" },
  { id: "alder", fraga: "Hur gammalt är taket?" },
  { id: "tecken", fraga: "Ser du något av det här?" },
  { id: "tidsplan", fraga: "När vill du byta tak?" },
] as const;

const RESULTAT = STEG.length;

const INGAR = [
  "Rivning och bortforsling av gammalt tak",
  "Ny underlagspapp, ströläkt och bärläkt",
  "Nytt takmaterial",
  "Nya hängrännor och stuprör",
  "Ställning, container och transport",
];

const INTRO: Record<Ingang, string> = {
  priser:
    "Sju snabba knappval, ungefär en minut. Du får ditt riktpris och en bedömning av takets skick direkt på skärmen.",
  taktest:
    "Sju snabba knappval, ungefär en minut. Du får en bedömning av takets skick och vad ett takbyte skulle kosta.",
};

const FORM_ID: Record<Ingang, string> = {
  priser: "calc_bridge",
  taktest: "taktest",
};

type GtagFn = (event: string, name: string, params: object) => void;

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE") + " kr";

const knappCls = (aktiv: boolean) =>
  `relative flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all ${
    aktiv
      ? "border-[#2B74FC] bg-[rgba(43,116,252,0.06)]"
      : "border-gray-200 hover:border-gray-300 bg-white"
  }`;

/** Knappval i rutnät. valda är de värden som är markerade. */
function ValLista({
  lista,
  valda,
  onVal,
}: {
  lista: Val[];
  valda: (string | undefined)[];
  onVal: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {lista.map((v) => {
        const aktiv = valda.includes(v.value);
        return (
          <button
            key={v.value}
            type="button"
            aria-pressed={aktiv}
            onClick={() => onVal(v.value)}
            className={knappCls(aktiv)}
          >
            {aktiv && (
              <Check
                size={14}
                className="absolute top-2 right-2"
                style={{ color: "var(--color-primary)" }}
              />
            )}
            <span
              className="text-sm font-semibold leading-tight"
              style={{ color: "var(--color-dark)" }}
            >
              {v.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Offertflode({ ingang }: { ingang: Ingang }) {
  const [steg, setSteg] = useState(0);
  const [svar, setSvar] = useState<Svar>({ kvm: 140, detaljer: [], tecken: [] });
  const [boyta, setBoyta] = useState<number | null>(null);
  const [visaIngar, setVisaIngar] = useState(false);
  const sektionRef = useRef<HTMLElement>(null);
  const rubrikRef = useRef<HTMLHeadingElement>(null);
  const sedda = useRef(new Set<number>());
  const startad = useRef(false);

  function ga(namn: string, params: object = {}) {
    if (typeof window === "undefined" || !("gtag" in window)) return;
    (window as unknown as { gtag: GtagFn }).gtag("event", namn, {
      event_category: "engagement",
      event_label: "offertflode",
      ingang,
      ...params,
    });
  }

  function gaTill(nasta: number) {
    setSteg(nasta);
    if (!sedda.current.has(nasta)) {
      sedda.current.add(nasta);
      if (nasta === RESULTAT) {
        ga("offert_result_view", { material: svar.material, area: svar.kvm });
        // Samma händelse som kalkylatorn hade, så att historiken i GA4
        // hänger ihop för /priser.
        if (ingang === "priser") ga("calc_bridge_view", { material: svar.material, area: svar.kvm });
      } else {
        ga("offert_step_view", { step: nasta + 1 });
      }
    }
    requestAnimationFrame(() => {
      const topp = sektionRef.current?.getBoundingClientRect().top ?? 0;
      // Skrolla bara när kortets topp hamnat utanför bild. Annars hoppar
      // sidan vid varje knapptryck.
      if (topp < 0 || topp > window.innerHeight * 0.4) {
        sektionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      rubrikRef.current?.focus({ preventScroll: true });
    });
  }

  function starta() {
    if (startad.current) return;
    startad.current = true;
    ga("offert_start");
  }

  // Envalsfrågor går vidare av sig själva, efter en kort markering så att
  // valet syns.
  function valj<K extends keyof Svar>(nyckel: K, varde: Svar[K]) {
    starta();
    setSvar((s) => ({ ...s, [nyckel]: varde }));
    setTimeout(() => gaTill(steg + 1), 180);
  }

  // Flerval: "inget" utesluter de andra.
  function vaxla(nyckel: "detaljer" | "tecken", varde: string) {
    starta();
    setSvar((s) => {
      const nu = s[nyckel];
      let ny: string[];
      if (varde === "inget") ny = nu.includes("inget") ? [] : ["inget"];
      else
        ny = nu.includes(varde)
          ? nu.filter((v) => v !== varde)
          : [...nu.filter((v) => v !== "inget"), varde];
      return { ...s, [nyckel]: ny };
    });
  }

  const pris = svar.material ? riktpris(svar.material, svar.kvm) : null;
  const prisText = pris ? `${kr(pris.undre)} – ${kr(pris.ovre)}` : "";
  const lage = lageISpannet(svar);
  const niva = skick(svar);
  const forklaringar = insikter(svar);
  const materialNamn =
    TAKMATERIAL.find((m) => m.key === svar.material)?.namn ?? "";

  const fortsatt = (aktiv: boolean, text = "Fortsätt") => (
    <button
      type="button"
      disabled={!aktiv}
      onClick={() => gaTill(steg + 1)}
      className="mt-6 w-full inline-flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold text-sm transition-all enabled:hover:scale-[1.01] disabled:opacity-40"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {text} <ArrowRight size={15} />
    </button>
  );

  const pagaende = steg < RESULTAT;

  return (
    <section ref={sektionRef} id="offertflode" className="scroll-mt-24">
      <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {pagaende && (
          <div className="p-6 lg:p-8">
            {/* Progress: klara steg fyllda, pågående tonat */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex flex-1 items-center gap-1.5">
                {STEG.map((s, i) => (
                  <span
                    key={s.id}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i < steg
                          ? "var(--color-primary)"
                          : i === steg
                            ? "rgba(43,116,252,0.45)"
                            : "#E6E9EF",
                    }}
                  />
                ))}
              </div>
              {steg > 0 && (
                <button
                  type="button"
                  onClick={() => gaTill(steg - 1)}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#2B74FC]"
                >
                  <ArrowLeft size={13} /> Tillbaka
                </button>
              )}
            </div>

            <p className="text-xs font-semibold text-gray-400 mb-1">
              Fråga {steg + 1} av {STEG.length}
            </p>
            <h2
              ref={rubrikRef}
              tabIndex={-1}
              className="text-xl lg:text-2xl font-extrabold tracking-[-0.02em] outline-none mb-5"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
            >
              {STEG[steg].fraga}
            </h2>

            {steg === 0 && (
              <>
                <p className="text-sm text-gray-600 leading-relaxed -mt-2 mb-5">
                  {INTRO[ingang]}
                </p>
                <ValLista
                  lista={TAKMATERIAL.map((m) => ({ value: m.key, label: m.namn }))}
                  valda={[svar.material]}
                  onVal={(v) => valj("material", v as MaterialKey)}
                />
              </>
            )}

            {steg === 1 && (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm text-gray-500">Takyta</span>
                  <span
                    className="text-3xl font-extrabold tracking-[-0.02em] tabular-nums"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
                  >
                    {svar.kvm} m²
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={300}
                  step={5}
                  value={svar.kvm}
                  disabled={boyta !== null}
                  onChange={(e) => {
                    starta();
                    setSvar((s) => ({ ...s, kvm: Number(e.target.value) }));
                  }}
                  className="sands-slider w-full"
                  style={
                    { "--progress": `${((svar.kvm - 60) / 240) * 100}%` } as React.CSSProperties
                  }
                  aria-label="Takyta i kvadratmeter"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>60 m²</span>
                  <span>300 m²</span>
                </div>

                <label className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={boyta !== null}
                    onChange={(e) => {
                      const b = e.target.checked ? 120 : null;
                      setBoyta(b);
                      if (b) setSvar((s) => ({ ...s, kvm: Math.round(b * 1.2) }));
                    }}
                    className="h-4 w-4 accent-[#2B74FC]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Vet inte takytan, räkna på boytan
                  </span>
                </label>
                {boyta !== null && (
                  <div className="mt-3 flex items-center gap-3 pl-1">
                    <span className="text-sm text-gray-500">Boyta</span>
                    <input
                      type="number"
                      min={40}
                      max={250}
                      value={boyta}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setBoyta(v);
                        if (v >= 40) setSvar((s) => ({ ...s, kvm: Math.round(v * 1.2) }));
                      }}
                      className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#2B74FC]"
                    />
                    <span className="text-sm text-gray-500">m² + 20 %</span>
                  </div>
                )}
                {fortsatt(true)}
              </div>
            )}

            {steg === 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TAKFORM.map((t) => {
                  const aktiv = svar.takform === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={aktiv}
                      onClick={() => valj("takform", t.value)}
                      className={`${knappCls(aktiv)} flex-col !py-5`}
                      style={{ color: aktiv ? "var(--color-primary)" : "var(--color-dark)" }}
                    >
                      <RoofSvg shape={t.value} />
                      <span className="text-sm font-semibold" style={{ color: "var(--color-dark)" }}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {steg === 3 && (
              <>
                <ValLista lista={DETALJER} valda={svar.detaljer} onVal={(v) => vaxla("detaljer", v)} />
                {fortsatt(svar.detaljer.length > 0)}
              </>
            )}

            {steg === 4 &&
              <ValLista lista={ALDER} valda={[svar.alder]} onVal={(v) => valj("alder", v)} />}

            {steg === 5 && (
              <>
                <p className="text-sm text-gray-500 -mt-2 mb-4">Välj allt som stämmer.</p>
                <ValLista lista={TECKEN} valda={svar.tecken} onVal={(v) => vaxla("tecken", v)} />
                {fortsatt(svar.tecken.length > 0)}
              </>
            )}

            {steg === 6 &&
              <ValLista lista={TIDSPLAN} valda={[svar.tidsplan]} onVal={(v) => valj("tidsplan", v)} />}
          </div>
        )}

        {!pagaende && pris && (
          <div>
            {/* Pris och skick */}
            <div className="grid sm:grid-cols-2">
              <div className="p-6 lg:p-8" style={{ backgroundColor: "var(--color-dark)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Ditt riktpris efter ROT
                </p>
                <p
                  className="text-[26px] lg:text-[30px] font-extrabold tracking-[-0.02em] text-white tabular-nums leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {prisText}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {materialNamn}, {svar.kvm} m². Före ROT: {kr(pris.undreForeRot)} – {kr(pris.ovreForeRot)}
                </p>

                {/* Var i spannet just det här taket troligen hamnar */}
                <div className="mt-6" aria-hidden="true">
                  <div className="relative h-2 rounded-full bg-gradient-to-r from-[#2B74FC]/40 to-[#2B74FC]">
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white border-4 border-[#2B74FC] shadow"
                      style={{ left: `${lage.lage * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                    <span>Enkelt tak</span>
                    <span>Komplext tak</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mt-4">{lage.text}</p>
              </div>

              <div className="p-6 lg:p-8 border-b sm:border-b-0 sm:border-l border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Takets skick
                </p>
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{ color: niva.color, backgroundColor: niva.bg }}
                >
                  {niva.label}
                </span>
                <p className="text-base font-bold leading-snug" style={{ color: "var(--color-dark)" }}>
                  {niva.rubrik}
                </p>
                {forklaringar.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {forklaringar.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Gratis offert */}
            <div className="p-6 lg:p-8 border-t border-gray-100" style={{ backgroundColor: "#F5F8FF" }}>
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                Gratis offert
              </p>
              <h3
                className="text-[24px] lg:text-[28px] font-extrabold tracking-[-0.02em] leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                Få en gratis offert på ditt tak
              </h3>
              <p className="text-sm text-gray-600 mt-2 mb-5">
                Helt utan förpliktelser. Riktpriset är en uppskattning, offerten
                är ett fast pris som gäller.
              </p>

              <ol className="grid gap-3 sm:grid-cols-3 mb-6">
                {[
                  "Fyll i namn och telefon eller e\u2011post. Det tar 30 sekunder.",
                  "Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll.",
                  "Du får ett fast pris. Säg ja eller nej, det kostar ingenting.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3 items-start">
                    <span
                      className="h-7 w-7 shrink-0 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug pt-1">{t}</span>
                  </li>
                ))}
              </ol>

              <div className="rounded-2xl bg-white border border-gray-100 p-5 lg:p-6">
                <LeadForm
                  variant="section"
                  formId={FORM_ID[ingang]}
                  fields="minimal"
                  contact="phone-or-email"
                  flat
                  hideHeader
                  ctaText="Få gratis offert"
                  confirmation={`Gäller: ${materialNamn.toLowerCase()}, ca ${svar.kvm} m²`}
                  extraPayload={{
                    roofType: materialNamn,
                    area: `${svar.kvm} m²`,
                    message: sammanfattning(svar, prisText, niva),
                  }}
                  onSubmitSuccess={() => {
                    ga("offert_submit", { material: svar.material, tidsplan: svar.tidsplan });
                    if (ingang === "priser")
                      ga("calc_bridge_submit", { material: svar.material, area: svar.kvm });
                  }}
                />
              </div>
            </div>

            {/* Vad ingår, och vad riktpriset förutsätter */}
            <button
              type="button"
              onClick={() => setVisaIngar(!visaIngar)}
              aria-expanded={visaIngar}
              className="w-full flex items-center justify-between px-6 py-5 lg:px-8 border-t border-gray-100 hover:bg-gray-50"
            >
              <span className="text-sm font-bold" style={{ color: "var(--color-dark)" }}>
                Vad ingår i priset?
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${visaIngar ? "rotate-180" : ""}`}
              />
            </button>
            {visaIngar && (
              <div className="px-6 pb-6 lg:px-8">
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                  {INGAR.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 leading-relaxed mt-4">
                  Riktpriset förutsätter frisk råspont och normal åtkomst för
                  ställning. Båda kontrolleras vid takkontrollen innan du får
                  ditt fasta pris.
                </p>
              </div>
            )}

            <div className="px-6 pb-6 lg:px-8 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSvar({ kvm: 140, detaljer: [], tecken: [] });
                  setBoyta(null);
                  gaTill(0);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#2B74FC]"
              >
                <RotateCcw size={12} /> Börja om
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
