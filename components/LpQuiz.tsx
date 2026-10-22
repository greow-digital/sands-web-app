"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Droplets,
  Hammer,
  Home,
  RefreshCw,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import type { MaterialKey } from "@/lib/material";

/*
  Frågeflödet på annonslandningssidan /lp. Tre knapptryck, sedan
  kontaktuppgifter. Inget riktpris (beslut 20 okt 2026): ett prisspann
  besvarar frågan som offerten ska besvara och tar bort skälet att skicka
  in. Svaren följer med leaden, så Sands vet vad det gäller.

  - Varianten i URL:en kan förvälja första svaret (/lp/takbyte börjar på
    steg 2), så den som sökt något specifikt slipper ett steg.
  - Läckage och annat takarbete går direkt till kontakt med fritext.
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

// Det offerten innehåller, samma punkter som "Det här ingår" hade på sidan.
const I_OFFERTEN = [
  "Kostnadsfri takkontroll på plats",
  "Fast pris för hela jobbet, ROT-avdraget inräknat",
  "Rivning, material, ställning och bortforsling",
];

type GtagFn = (event: string, name: string, params: object) => void;

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
  // Sökordet som annonsen skickade med (?kw=), följer med leaden och i
  // spårningen så att Sands och vi ser vilket sökord leaden kom från.
  // Läses bara i webbläsaren och renderas aldrig, så servern och klienten
  // ger samma HTML.
  const [annonsSokord] = useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("kw")
  );

  const offertSpar = arende === "byta" || arende === "lagga-om";
  // Innan ärendet är valt visas den längre vägen, annars hoppar raden från
  // två till fyra steg efter första svaret.
  const antalSteg = offertSpar || !arende ? 4 : 2;
  const kontaktSteg = offertSpar ? 4 : 2;

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

  // tillFormular: formulärsteget är högre än frågorna, och på mobil hamnade
  // fälten och knappen under vikningen medan heron låg kvar ovanför kortet.
  // Ingen av de första sju som nådde formuläret tryckte i ett fält (22 okt
  // 2026). Därför flyttas kortet alltid upp när formuläret visas.
  function till(nasta: number, params: object = {}, tillFormular = false) {
    setSteg(nasta);
    ga(`lp_step_${nasta}`, params);
    requestAnimationFrame(() => {
      const topp = ref.current?.getBoundingClientRect().top ?? 0;
      if (topp < 0 || tillFormular) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      rubrikRef.current?.focus({ preventScroll: true });
    });
  }

  // Envalsfrågor går vidare av sig själva efter en kort markering.
  function valjArende(a: Arende) {
    setArende(a);
    ga("lp_answer", { question: "arende", answer: a });
    const direktKontakt = a === "lackage" || a === "annat";
    setTimeout(() => till(2, { arende: a }, direktKontakt), 170);
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
      till(4, {}, true);
      ga("lp_form_view", { arende, taktyp, storlek: s });
    }, 170);
  }

  const storlekLabel = STORLEKAR.find((s) => s.value === storlek)?.label;
  const boyta = STORLEKAR.find((s) => s.value === storlek)?.boyta;
  const kvm = boyta ? Math.round((boyta * 1.2) / 5) * 5 : undefined;

  const arendeLabel = ARENDEN.find((a) => a.value === arende)?.label ?? "";
  const taktypLabel = TAKTYPER.find((t) => t.value === taktyp)?.label ?? "";

  const meddelande = [
    `Från landningssidan: ${arendeLabel.toLowerCase()}`,
    taktyp ? `tak idag: ${taktypLabel.toLowerCase()}` : "",
    storlekLabel ? `boyta ${storlekLabel.toLowerCase()}` : "",
    `sökord: ${sokord}`,
    annonsSokord ? `annonssökord: ${annonsSokord}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const tillbaka = () => {
    ga("lp_back", { step: steg });
    if (steg === kontaktSteg && !offertSpar) return till(1);
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
          <p className="text-sm text-gray-500 mt-1 mb-4">Tre snabba frågor, sedan får du en gratis offert.</p>
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

      {steg === 2 && offertSpar && (
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

      {steg === 3 && offertSpar && (
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
          <p
            ref={rubrikRef}
            tabIndex={-1}
            className="text-[22px] font-extrabold tracking-[-0.02em] leading-tight outline-none"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            {offertSpar ? "Få din gratis offert med fast pris" : "Vart når vi dig?"}
          </p>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll.
          </p>

          {/* Svaren som en kort bekräftelse: förfrågan är redan halvvägs
              ifylld. Vad offerten innehåller står under knappen, så att
              fälten kommer upp direkt. */}
          {offertSpar && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[arendeLabel, taktypLabel, storlekLabel].filter(Boolean).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F5F8FF] px-2.5 py-1 text-xs font-semibold"
                  style={{ color: "var(--color-dark)" }}
                >
                  <CheckCircle size={12} style={{ color: "var(--color-primary)" }} />
                  {t}
                </span>
              ))}
            </div>
          )}

          <LeadForm
            variant="hero"
            formId="lp_hero"
            fields="minimal"
            contact="phone-or-email"
            stapla
            flat
            hideHeader
            // Fritext på alla vägar, inte bara läckage (beslut 19 okt 2026):
            // många leads vill skriva något själva, och svaren från flödet
            // slås ihop med texten i LeadForm.
            showMessage
            ctaText="Få gratis offert"
            extraPayload={{
              roofType: taktyp ? taktypLabel : undefined,
              area: kvm ? `${kvm} m²` : undefined,
              message: meddelande,
            }}
            onSubmitSuccess={() =>
              ga("lp_submit", {
                arende,
                taktyp: taktyp ?? "ej angiven",
                storlek: storlek ?? "ej angiven",
                annonssokord: annonsSokord ?? "saknas",
              })
            }
          />
          <p className="text-[11px] text-gray-500 text-center mt-3">
            Kostnadsfritt · Utan förpliktelser · Svar inom 24 timmar
          </p>

          {offertSpar && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold mb-2" style={{ color: "var(--color-dark)" }}>
                Det här ingår i offerten
              </p>
              <ul className="space-y-1.5">
                {I_OFFERTEN.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13px] text-gray-700">
                    <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                    {t}
                  </li>
                ))}
              </ul>
              {taktyp === "eternit" && (
                <p className="text-xs text-gray-500 leading-relaxed mt-3">
                  Eternit saneras innan det nya taket läggs. Du får ett fast pris
                  för båda delarna efter takkontrollen.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
