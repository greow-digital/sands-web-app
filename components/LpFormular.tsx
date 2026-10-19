"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import LeadForm from "@/components/LeadForm";

/*
  Tvåstegsformuläret på annonslandningssidan /lp/takbyte.

  Steg 1 är ett enda knappval ("Vad gäller det?"). Ett lätt första klick
  sänker tröskeln, och svaret säger Sands vad förfrågan handlar om.
  Steg 2 har taktypen som valfria knappar och sedan kontaktfälten.

  Knappen säger "Få gratis offert", samma undantag från CTA-regeln som
  offertflödet (beslut 19 okt 2026, se SEO.md §5).
*/

const GALLER = [
  { value: "byta", label: "Byta tak" },
  { value: "lagga-om", label: "Lägga om tak" },
  { value: "lackage", label: "Läckage eller skada" },
  { value: "annat", label: "Annat takarbete" },
];

const TAKTYP = ["Betong", "Tegel", "Plåt", "Papp", "Eternit", "Vet ej"];

type GtagFn = (event: string, name: string, params: object) => void;

export default function LpFormular({
  formId,
  sokord,
}: {
  /** lp_hero eller lp_bottom, skiljer formulären åt i arket och GA4 */
  formId: "lp_hero" | "lp_bottom";
  /** Rubrikvarianten från annonsens URL, följer med i spårningen */
  sokord: string;
}) {
  const [steg, setSteg] = useState<1 | 2>(1);
  const [galler, setGaller] = useState<string>();
  const [taktyp, setTaktyp] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);
  const visad = useRef(false);

  function ga(namn: string, params: object = {}) {
    if (typeof window === "undefined" || !("gtag" in window)) return;
    (window as unknown as { gtag: GtagFn }).gtag("event", namn, {
      event_category: "engagement",
      event_label: "landningssida",
      form_id: formId,
      sokord,
      ...params,
    });
  }

  // Steg 1 räknas som visat när formuläret syns, så att tappet mellan
  // visning och första klick går att mäta.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || visad.current) return;
        visad.current = true;
        ga("lp_step_1");
        obs.disconnect();
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // ga läser bara props som inte ändras under sidans livstid.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gallerLabel = GALLER.find((g) => g.value === galler)?.label ?? "";

  return (
    <div ref={ref} className="rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] p-5 sm:p-7">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
          Gratis offert · steg {steg} av 2
        </p>
        {steg === 2 && (
          <button
            type="button"
            onClick={() => setSteg(1)}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#2B74FC]"
          >
            <ArrowLeft size={13} /> Tillbaka
          </button>
        )}
      </div>

      {steg === 1 && (
        <>
          <p
            className="text-xl font-extrabold tracking-[-0.02em] mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            Vad gäller det?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {GALLER.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => {
                  setGaller(g.value);
                  ga("lp_answer", { answer: g.value });
                  setTimeout(() => {
                    setSteg(2);
                    ga("lp_step_2", { answer: g.value });
                  }, 160);
                }}
                aria-pressed={galler === g.value}
                className={`rounded-2xl border-2 px-3 py-4 text-sm font-semibold leading-tight transition-colors ${
                  galler === g.value
                    ? "border-[#2B74FC] bg-[rgba(43,116,252,0.06)]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ color: "var(--color-dark)" }}
              >
                {g.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Kostnadsfritt och utan förpliktelser
          </p>
        </>
      )}

      {steg === 2 && (
        <>
          <p
            className="text-xl font-extrabold tracking-[-0.02em] mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            Vart når vi dig?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {gallerLabel}. Vi hör av oss inom 24 timmar och bokar en
            kostnadsfri takkontroll.
          </p>

          <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
            Vilket tak har du idag? <span className="text-gray-400 font-normal">(valfritt)</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {TAKTYP.map((t) => {
              const aktiv = taktyp === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={aktiv}
                  onClick={() => setTaktyp(aktiv ? undefined : t)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    aktiv
                      ? "border-[#2B74FC] bg-[#2B74FC] text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {aktiv && <Check size={11} className="inline -mt-0.5 mr-1" />}
                  {t}
                </button>
              );
            })}
          </div>

          <LeadForm
            variant={formId === "lp_hero" ? "hero" : "section"}
            formId={formId}
            fields="minimal"
            contact="phone-or-email"
            stapla
            flat
            hideHeader
            ctaText="Få gratis offert"
            extraPayload={{
              roofType: taktyp,
              message: `Från landningssidan: ${gallerLabel.toLowerCase()}${
                taktyp ? `, tak idag: ${taktyp.toLowerCase()}` : ""
              }. Sökord: ${sokord}.`,
            }}
            onSubmitSuccess={() => ga("lp_submit", { answer: galler, taktyp: taktyp ?? "ej angiven" })}
          />
        </>
      )}
    </div>
  );
}
