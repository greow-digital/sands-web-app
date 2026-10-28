"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import type { TrattSteg } from "@/lib/backoffice/crm";

const FARG = ["bg-accent", "bg-indigo-500", "bg-amber-500", "bg-emerald-500"];

/** Konverteringstratten på översikten, med växling mellan totalt och senaste 30 dagarna. */
export default function Tratt({ totalt, manad }: { totalt: TrattSteg[]; manad: TrattSteg[] }) {
  const [period, setPeriod] = useState<"totalt" | "manad">("totalt");
  const steg = period === "totalt" ? totalt : manad;
  const annan = period === "totalt" ? manad : totalt;
  const bas = steg[0].antal;
  const hela = bas ? Math.round((100 * steg[steg.length - 1].antal) / bas) : null;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900">Konvertering</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {period === "totalt" ? "Alla leads i arket" : "Leads som kom in de senaste 30 dagarna. De yngsta har inte hunnit hela vägen än."}
          </p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
          {(["totalt", "manad"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2.5 py-1 transition ${period === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {p === "totalt" ? "Totalt" : "30 dagar"}
            </button>
          ))}
        </div>
      </div>

      <ol className="px-5 py-4">
        {steg.map((s, i) => (
          <li key={s.namn}>
            {i > 0 && (
              <div className="flex items-center gap-2 py-1.5 pl-1 text-xs">
                <ArrowDown className="size-3.5 text-slate-300" />
                <span className="rounded-md bg-slate-900 px-1.5 py-0.5 font-bold tabular-nums text-white">{s.andel == null ? "Ingen data" : `${s.andel} %`}</span>
                <span className="text-slate-400">
                  {period === "totalt" ? "30 dagar" : "totalt"}: {annan[i].andel == null ? "ingen data" : `${annan[i].andel} %`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-sm font-medium text-slate-700">{s.namn}</span>
              <span className="h-7 flex-1 overflow-hidden rounded-md bg-slate-100">
                <span
                  className={`flex h-full items-center rounded-md px-2 text-xs font-bold text-white transition-[width] duration-500 ${FARG[i]}`}
                  style={{ width: `${Math.max(bas ? (100 * s.antal) / bas : 0, 6)}%` }}
                >
                  {s.antal}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        Från lead till accepterad offert: <span className="font-semibold text-slate-900">{hela == null ? "ingen data" : `${hela} %`}</span>
      </p>
    </div>
  );
}
