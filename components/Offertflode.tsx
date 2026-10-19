"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  RotateCcw,
  Star,
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

  Ordningen bygger commitment innan något efterfrågas: sex knappval, sedan
  pris och skick, sist offerten. Frågan om när kunden vill byta ligger i
  offertdelen i stället för som ett sjunde steg: den kvalificerar leaden
  utan att förlänga vägen till priset. Priset gömmer sig inte bakom formuläret,
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
    "Sex snabba knappval, under en minut. Du får ditt riktpris och en bedömning av takets skick direkt på skärmen.",
  taktest:
    "Sex snabba knappval, under en minut. Du får en bedömning av takets skick och vad ett takbyte skulle kosta.",
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

            {/* Ingen räknare ("Fråga 1 av 7"). Progressraden visar läget,
                och en siffra framhäver bara hur många frågor som är kvar. */}
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
                {/* Bara från sm: på mobil sköt texten ner materialknapparna
                    halvvägs under vikningen, och heron säger redan samma sak. */}
                <p className="hidden sm:block text-sm text-gray-600 leading-relaxed -mt-2 mb-5">
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

          </div>
        )}

        {!pagaende && pris && (
          <div>
            {/* Resultatet är byggt för att namnfältet ska synas utan scroll
                på mobil när det visas: kompakt pris med skicket som etikett,
                sedan direkt offerten. Förklaringar och "så går det till"
                ligger under knappen, där de svarar på tvekan i stället för
                att skjuta ner formuläret. */}
            <div className="p-5 lg:p-8" style={{ backgroundColor: "var(--color-dark)" }}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Ditt riktpris efter ROT
                </p>
                <span
                  className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ color: niva.color, backgroundColor: "#fff" }}
                >
                  {niva.label}
                </span>
              </div>
              <p
                className="text-[26px] lg:text-[34px] font-extrabold tracking-[-0.02em] text-white tabular-nums leading-tight mt-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {prisText}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {materialNamn}, {svar.kvm} m², inklusive material, arbete och ställning
              </p>
              <div className="mt-4" aria-hidden="true">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-white/25 to-[#2B74FC]">
                  <span
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white border-[3px] border-[#2B74FC]"
                    style={{ left: `${lage.lage * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
                  <span>Enkelt tak</span>
                  <span>Komplext tak</span>
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-8" style={{ backgroundColor: "#F5F8FF" }}>
              <h3
                className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.02em] leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                Få en gratis offert på ditt tak
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Helt utan förpliktelser. Offerten är ett fast pris som gäller.
              </p>

              {/* Frivilligt. Ger Sands tidsplanen utan ett eget steg. */}
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
                När vill du byta tak? <span className="text-gray-400 font-normal">(valfritt)</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
                {TIDSPLAN.map((t) => {
                  const aktiv = svar.tidsplan === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={aktiv}
                      onClick={() =>
                        setSvar((s) => ({ ...s, tidsplan: aktiv ? undefined : t.value }))
                      }
                      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        aktiv
                          ? "border-[#2B74FC] bg-[#2B74FC] text-white"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-4 lg:p-6">
                <LeadForm
                  variant="section"
                  formId={FORM_ID[ingang]}
                  fields="minimal"
                  contact="phone-or-email"
                  stapla
                  flat
                  hideHeader
                  ctaText="Få gratis offert"
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
                <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    4,8 på BraByggare
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Upp till 30 års garanti</span>
                  <span aria-hidden="true">·</span>
                  <span>Svar inom 24 timmar</span>
                </p>
              </div>
            </div>

            {/* Under knappen: det som svarar på tvekan */}
            <div className="p-5 lg:p-8 space-y-6">
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: "var(--color-dark)" }}>
                  Så går det till
                </p>
                <ol className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Fyll i namn och telefon eller e\u2011post. Det tar 30 sekunder.",
                    "Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll.",
                    "Du får ett fast pris. Säg ja eller nej, det kostar ingenting.",
                  ].map((t, i) => (
                    <li key={t} className="flex gap-3 items-start">
                      <span
                        className="h-6 w-6 shrink-0 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 leading-snug">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-2">
                    Ditt pris
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{lage.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Före ROT: {kr(pris.undreForeRot)} – {kr(pris.ovreForeRot)}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-2">
                    Takets skick
                  </p>
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ color: niva.color, backgroundColor: niva.bg }}
                  >
                    {niva.label}
                  </span>
                  <p className="text-sm font-semibold leading-snug" style={{ color: "var(--color-dark)" }}>
                    {niva.rubrik}
                  </p>
                  {forklaringar.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
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
            </div>

            <button
              type="button"
              onClick={() => setVisaIngar(!visaIngar)}
              aria-expanded={visaIngar}
              className="w-full flex items-center justify-between px-5 py-4 lg:px-8 border-t border-gray-100 hover:bg-gray-50"
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
              <div className="px-5 pb-6 lg:px-8">
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
                  ditt fasta pris. ROT-avdraget är 30 % av arbetskostnaden,
                  högst 50 000 kr per person och år, och vi sköter ansökan.
                </p>
              </div>
            )}

            <div className="px-5 pb-5 lg:px-8 border-t border-gray-100 pt-4">
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
