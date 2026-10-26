"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { bokaTid, hamtaLedigaTider, type LedigDag } from "../actions";

/**
 * Bokning av takkontroll i leadvyn. Lediga tider läses från kalendern när
 * väljaren öppnas, ett klick bokar.
 */
export default function BokaTid({ id, installd }: { id: string; installd: boolean }) {
  const [oppen, setOppen] = useState(false);
  const [dagar, setDagar] = useState<LedigDag[] | null>(null);
  const [vald, setVald] = useState(0);
  const [fel, setFel] = useState("");
  const [klar, setKlar] = useState("");
  const [laser, startLas] = useTransition();
  const [bokar, startBoka] = useTransition();
  const ruta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!oppen) return;
    const stang = (e: MouseEvent) => !ruta.current?.contains(e.target as Node) && setOppen(false);
    document.addEventListener("mousedown", stang);
    return () => document.removeEventListener("mousedown", stang);
  }, [oppen]);

  const oppna = () => {
    if (oppen) return setOppen(false);
    setOppen(true);
    setFel("");
    setKlar("");
    startLas(async () => {
      const r = await hamtaLedigaTider();
      setDagar(r.dagar ?? []);
      setVald(0);
      if (r.fel) setFel(r.fel);
    });
  };

  const boka = (start: string) => {
    setFel("");
    startBoka(async () => {
      const r = await bokaTid(id, start);
      if (r?.fel) {
        setFel(r.fel);
        // Tiden kan ha blivit upptagen, läs om listan.
        const ny = await hamtaLedigaTider();
        if (ny.dagar) setDagar(ny.dagar);
        return;
      }
      setKlar(r?.ok ?? "Bokad");
      setOppen(false);
    });
  };

  if (!installd) {
    return (
      <button
        type="button"
        disabled
        title="Kalendern är inte inställd, se docs/GOOGLE_KALENDER.md"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-400"
      >
        <CalendarPlus className="size-4" /> Boka tid
      </button>
    );
  }

  const dag = dagar?.[vald];

  return (
    <div ref={ruta} className="relative">
      <button
        type="button"
        onClick={oppna}
        disabled={bokar}
        aria-expanded={oppen}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {bokar ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />}
        {bokar ? "Bokar..." : klar || "Boka tid"}
      </button>
      {oppen && (
        <div className="absolute right-0 z-40 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Välj tid för takkontroll</p>
            <p className="text-xs text-slate-500">Lediga timmar i kalendern, vardagar de närmaste två veckorna.</p>
          </div>
          {laser || !dagar ? (
            <p className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" /> Läser kalendern...
            </p>
          ) : dagar.length ? (
            <>
              <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-2 py-2">
                {dagar.map((d, i) => (
                  <button
                    key={d.rubrik}
                    type="button"
                    onClick={() => setVald(i)}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      i === vald ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {d.rubrik.replace(/^(i dag|i morgon), /, "")}
                  </button>
                ))}
              </div>
              {dag && (
                <div className="px-4 py-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500 first-letter:uppercase">{dag.rubrik}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {dag.tider.map((t) => (
                      <button
                        key={t.start}
                        type="button"
                        disabled={bokar}
                        onClick={() => boka(t.start)}
                        className="rounded-lg border border-slate-200 px-2 py-2 text-sm font-medium tabular-nums text-slate-800 hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50"
                      >
                        {t.tid}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            !fel && <p className="px-4 py-6 text-sm text-slate-500">Inga lediga tider de närmaste två veckorna.</p>
          )}
          {fel && <p className="border-t border-slate-100 bg-red-50 px-4 py-2 text-xs text-red-700">{fel}</p>}
        </div>
      )}
    </div>
  );
}
