"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { BellRing, X } from "lucide-react";
import { omDagar, datum as visaDatum } from "@/lib/backoffice/crm";
import { sattPaminnelse } from "../actions";

const VAL = [
  { text: "I morgon", dagar: 1 },
  { text: "Om 3 dagar", dagar: 3 },
  { text: "Om en vecka", dagar: 7 },
  { text: "Om två veckor", dagar: 14 },
];

/** Påminnelse med ett klick. Ett datum i arket som Att göra plockar upp. */
export default function PaminnelseVal({ id, paminnelse, kompakt }: { id: string; paminnelse: string; kompakt?: boolean }) {
  const [oppen, setOppen] = useState(false);
  const [pending, start] = useTransition();
  const ruta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!oppen) return;
    const stang = (e: MouseEvent) => !ruta.current?.contains(e.target as Node) && setOppen(false);
    document.addEventListener("mousedown", stang);
    return () => document.removeEventListener("mousedown", stang);
  }, [oppen]);

  const satt = (d: string) => {
    setOppen(false);
    start(async () => {
      await sattPaminnelse(id, d);
    });
  };

  return (
    <div ref={ruta} className="relative">
      <button
        type="button"
        disabled={pending}
        onClick={() => setOppen((o) => !o)}
        title="Påminnelse"
        className={
          kompakt
            ? `grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 ${paminnelse ? "text-primary" : ""}`
            : "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        }
      >
        <BellRing className="size-4" />
        {!kompakt && (pending ? "Sparar..." : paminnelse ? `Påminnelse ${visaDatum(paminnelse)}` : "Påminn mig")}
      </button>
      {oppen && (
        <div className="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10">
          {VAL.map((v) => (
            <button
              key={v.dagar}
              type="button"
              onClick={() => satt(omDagar(v.dagar))}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              {v.text}
              <span className="text-xs text-slate-400">{visaDatum(omDagar(v.dagar))}</span>
            </button>
          ))}
          <label className="flex items-center gap-2 border-t border-slate-100 px-3 py-2 text-sm">
            <span className="text-slate-500">Datum</span>
            <input
              type="date"
              min={omDagar(0)}
              defaultValue={paminnelse}
              onChange={(e) => e.target.value && satt(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
            />
          </label>
          {paminnelse && (
            <button
              type="button"
              onClick={() => satt("")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <X className="size-4" /> Ta bort påminnelsen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
