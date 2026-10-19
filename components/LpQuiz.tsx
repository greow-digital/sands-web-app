"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Droplets,
  Hammer,
  Home,
  RefreshCw,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import {
  KOMPLEX_MULTIPLIER,
  MATERIAL,
  omlaggningPrisEfterRot,
  prisEfterRot,
  type MaterialKey,
} from "@/lib/material";

/*
  Frågeflödet på annonslandningssidan /lp. Tre knapptryck ger ett
  personligt riktpris, och först därefter efterfrågas kontaktuppgifter.
  Priset är belöningen för stegen och anledningen att fylla i: det fasta
  priset kommer efter takkontrollen.

  - Varianten i URL:en kan förvälja första svaret (/lp/takbyte börjar på
    steg 2), så den som sökt något specifikt slipper ett steg.
  - Läckage och annat takarbete går direkt till kontakt med fritext, utan
    pris. Där finns inget meningsfullt riktpris.
  - Priserna kommer ur lib/material.ts. Eternit får inget pris, saneringen
    går inte att prissätta på distans.
  - Steget meddelas till den fasta knappen via "lp:steg", så att den kan
    säga "Fortsätt där du var".

  Knappen säger "Få gratis offert", undantaget i SEO.md §5 för /lp.
*/

export type Arende = "byta" | "lagga-om" | "lackage" | "annat";

const ARENDEN: { value: Arende; label: string; sub: string; icon: typeof Home }[] = [
  { value: "byta", label: "Byta tak", sub: "Nytt tak med nya pannor", icon: Home },
  { value: "lagga-om", label: "Lägga om tak", sub: "Nytt underlag, befintliga pannor", icon: RefreshCw },
  { value: "lackage", label: "Läckage eller skada", sub: "Något behöver åtgärdas", icon: Droplets },
  { value: "annat", label: "Annat takarbete", sub: "Plåt, kupor, hängrännor", icon: Hammer },
];

const TAKTYPER: { value: MaterialKey | "eternit" | "vet-ej"; label: string }[] = [
  { value: "betong", label: "Betongpannor" },
  { value: "tegel", label: "Tegelpannor" },
  { value: "plat", label: "Plåt" },
  { value: "papp", label: "Papp" },
  { value: "eternit", label: "Eternit" },
  { value: "vet-ej", label: "Vet ej" },
];

// Boyta till takyta: boytan plus 20 %, samma antagande som kalkylatorn.
const STORLEKAR = [
  { value: "90", label: "Under 100 m²", boyta: 90 },
  { value: "125", label: "100–150 m²", boyta: 125 },
  { value: "175", label: "150–200 m²", boyta: 175 },
  { value: "225", label: "Över 200 m²", boyta: 225 },
];

type GtagFn = (event: string, name: string, params: object) => void;

const avrunda = (n: number) => Math.round(n / 1000) * 1000;
const kr = (n: number) => avrunda(n).toLocaleString("sv-SE") + " kr";

export default function LpQuiz({
  sokord,
  forval,
}: {
  sokord: string;
  forval?: Arende;
}) {
  const [arende, setArende] = useState<Arende | undefined>(forval);
  const [taktyp, setTaktyp] = useState<string>();
  const [storlek, setStorlek] = useState<string>();
  const [steg, setSteg] = useState(forval ? 2 : 1);
  const ref = useRef<HTMLDivElement>(null);
  const rubrikRef = useRef<HTMLParagraphElement>(null);
  const visad = useRef(false);

  const prisSpar = arende === "byta" || arende === "lagga-om";
  const antalSteg = prisSpar ? 4 : 2;
  const kontaktSteg = prisSpar ? 4 : 2;

  function ga(namn: string, params: object = {}) {
    if (typeof window === "undefined" || !("gtag" in window)) return;
    (window as unknown as { gtag: GtagFn }).gtag("event", namn, {
      event_category: "engagement",
      event_label: "landningssida",
      form_id: "lp_hero",
      sokord,
      ...params,
    });
  }

  // Den fasta knappen behöver veta om flödet påbörjats.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("lp:steg", {
        detail: { steg, antal: antalSteg, paborjad: steg > 1 || Boolean(arende && !forval) },
      })
    );
  }, [steg, antalSteg, arende, forval]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || visad.current) return;
        visad.current = true;
        ga("lp_view", { forval: forval ?? "inget" });
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // ga läser bara props som inte ändras under sidans livstid.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function till(nasta: number, params: object = {}) {
    setSteg(nasta);
    ga(`lp_step_${nasta}`, params);
    requestAnimationFrame(() => {
      const topp = ref.current?.getBoundingClientRect().top ?? 0;
      if (topp < 0) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      rubrikRef.current?.focus({ preventScroll: true });
    });
  }

  // Envalsfrågor går vidare av sig själva efter en kort markering.
  function valjArende(a: Arende) {
    setArende(a);
    ga("lp_answer", { question: "arende", answer: a });
    setTimeout(() => till(2, { arende: a }), 170);
  }
  function valjTaktyp(t: string) {
    setTaktyp(t);
    ga("lp_answer", { question: "taktyp", answer: t });
    setTimeout(() => till(3), 170);
  }
  function valjStorlek(s: string) {
    setStorlek(s);
    ga("lp_answer", { question: "storlek", answer: s });
    setTimeout(() => {
      till(4);
      ga("lp_price_view", { arende, taktyp, storlek: s });
    }, 170);
  }

  // Riktpris för pris-spåret.
  const boyta = STORLEKAR.find((s) => s.value === storlek)?.boyta;
  const kvm = boyta ? Math.round((boyta * 1.2) / 5) * 5 : undefined;
  const material: MaterialKey | undefined =
    taktyp === "vet-ej" ? "betong" : taktyp && taktyp !== "eternit" ? (taktyp as MaterialKey) : undefined;
  const undre =
    material && kvm
      ? arende === "lagga-om"
        ? omlaggningPrisEfterRot(material, kvm)
        : prisEfterRot(material, kvm)
      : undefined;
  const pris = undre ? { undre, ovre: undre * KOMPLEX_MULTIPLIER } : undefined;

  const arendeLabel = ARENDEN.find((a) => a.value === arende)?.label ?? "";
  const taktypLabel = TAKTYPER.find((t) => t.value === taktyp)?.label ?? "";

  const meddelande = [
    `Från landningssidan: ${arendeLabel.toLowerCase()}`,
    taktyp ? `tak idag: ${taktypLabel.toLowerCase()}` : "",
    boyta ? `boyta ${STORLEKAR.find((s) => s.value === storlek)?.label.toLowerCase()}` : "",
    pris ? `riktpris ${kr(pris.undre)} – ${kr(pris.ovre)}` : "",
    `sökord: ${sokord}`,
  ]
    .filter(Boolean)
    .join(", ");

  const tillbaka = () => {
    ga("lp_back", { step: steg });
    if (steg === kontaktSteg && !prisSpar) return till(1);
    till(Math.max(1, steg - 1));
  };

  const ruta = (aktiv: boolean) =>
    `group w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.99] ${
      aktiv
        ? "border-[#2B74FC] bg-[rgba(43,116,252,0.06)]"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`;

  const chip = (aktiv: boolean) =>
    `rounded-2xl border-2 px-3 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
      aktiv
        ? "border-[#2B74FC] bg-[rgba(43,116,252,0.06)]"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`;

  return (
    <div
      ref={ref}
      className="scroll-mt-3 rounded-[28px] bg-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5 p-5 sm:p-7"
    >
      {/* Progress och tillbaka */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {Array.from({ length: antalSteg }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i + 1 < steg ? "var(--color-primary)" : i + 1 === steg ? "rgba(43,116,252,0.45)" : "#E8EBF0",
              }}
            />
          ))}
        </div>
        {steg > 1 && (
          <button
            type="button"
            onClick={tillbaka}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#2B74FC]"
          >
            <ArrowLeft size={13} /> Tillbaka
          </button>
        )}
      </div>

      {steg === 1 && (
        <>
          <p
            ref={rubrikRef}
            tabIndex={-1}
            className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight outline-none"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            Vad behöver du hjälp med?
          </p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Tre snabba frågor, sedan ser du ditt riktpris.</p>
          <div className="space-y-2.5">
            {ARENDEN.map((a) => {
              const Ikon = a.icon;
              const aktiv = arende === a.value;
              return (
                <button key={a.value} type="button" aria-pressed={aktiv} onClick={() => valjArende(a.value)} className={ruta(aktiv)}>
                  <span
                    className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(43,116,252,0.08)", color: "var(--color-primary)" }}
                  >
                    <Ikon size={19} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[15px]" style={{ color: "var(--color-dark)" }}>
                      {a.label}
                    </span>
                    <span className="block text-xs text-gray-500">{a.sub}</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#2B74FC]" />
                </button>
              );
            })}
          </div>
        </>
      )}

      {steg === 2 && prisSpar && (
        <>
          {forval && (
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
              {arendeLabel}
            </p>
          )}
          <p
            ref={rubrikRef}
            tabIndex={-1}
            className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight outline-none mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            Vilket tak har du idag?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {TAKTYPER.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={taktyp === t.value}
                onClick={() => valjTaktyp(t.value)}
                className={chip(taktyp === t.value)}
                style={{ color: "var(--color-dark)" }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {forval && (
            <button
              type="button"
              onClick={() => till(1)}
              className="mt-4 text-xs font-medium text-gray-500 underline underline-offset-2"
            >
              Gäller det något annat?
            </button>
          )}
        </>
      )}

      {steg === 3 && prisSpar && (
        <>
          <p
            ref={rubrikRef}
            tabIndex={-1}
            className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight outline-none"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            Hur stort är huset?
          </p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Boytan räcker, vi räknar om till takyta.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {STORLEKAR.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={storlek === s.value}
                onClick={() => valjStorlek(s.value)}
                className={chip(storlek === s.value)}
                style={{ color: "var(--color-dark)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}

      {steg === kontaktSteg && (
        <>
          {prisSpar && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "var(--color-dark)" }}>
              {pris ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Ditt riktpris efter ROT
                  </p>
                  <p
                    className="text-[24px] font-extrabold tracking-[-0.02em] text-white tabular-nums leading-tight mt-0.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {kr(pris.undre)} – {kr(pris.ovre)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {arendeLabel}, {material ? MATERIAL[material].namn.toLowerCase() : ""}
                    {taktyp === "vet-ej" ? " (räknat på betong)" : ""}, ca {kvm} m² tak
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-200 leading-relaxed">
                  Eternit kräver sanering innan det nya taket läggs, och den går
                  inte att prissätta på distans. Du får ett fast pris för båda
                  delarna efter den kostnadsfria takkontrollen.
                </p>
              )}
            </div>
          )}

          <p
            ref={rubrikRef}
            tabIndex={-1}
            className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight outline-none"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            {prisSpar ? "Få ett fast pris, gratis" : "Vart når vi dig?"}
          </p>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            {prisSpar
              ? "Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll. Sedan får du en offert med fast pris."
              : "Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll."}
          </p>

          <LeadForm
            variant="hero"
            formId="lp_hero"
            fields="minimal"
            contact="phone-or-email"
            stapla
            flat
            hideHeader
            showMessage={!prisSpar}
            ctaText="Få gratis offert"
            extraPayload={{
              roofType: taktyp ? taktypLabel : undefined,
              area: kvm ? `${kvm} m²` : undefined,
              message: meddelande,
            }}
            onSubmitSuccess={() => ga("lp_submit", { arende, taktyp: taktyp ?? "ej angiven", storlek: storlek ?? "ej angiven" })}
          />
          <p className="text-[11px] text-gray-500 text-center mt-3">
            Kostnadsfritt · Utan förpliktelser · Svar inom 24 timmar
          </p>
        </>
      )}
    </div>
  );
}
