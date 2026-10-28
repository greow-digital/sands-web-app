"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { PIPELINE, STEG_KORT, type Steg } from "@/lib/backoffice/crm";
import { flyttaSteg } from "../actions";

/** Stegen som en klickbar kedja. Ett klick kryssar i (eller ur) rätt rutor i arket. */
export default function StegVal({ id, steg }: { id: string; steg: Steg | "arkiverad" }) {
  const [visat, satt] = useOptimistic(steg);
  const [pending, start] = useTransition();
  const [fel, setFel] = useState("");
  const index = PIPELINE.indexOf(visat as (typeof PIPELINE)[number]);
  // Nekad kommer efter offerten och avslutat efter accepterad i kedjan.
  const nadd = visat === "forlorad" ? 4 : visat === "avslutad" ? 5 : index;

  const flytta = (till: Exclude<Steg, "ny">) =>
    start(async () => {
      satt(till);
      setFel("");
      const r = await flyttaSteg(id, till);
      if (r?.fel) setFel(r.fel);
    });

  return (
    <div>
      <ol className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">
        {PIPELINE.map((s, i) => {
          const klar = i < nadd;
          const har = s === visat;
          return (
            <li key={s} className="min-w-[6.5rem] flex-1">
              <button
                type="button"
                disabled={pending || s === "ny"}
                onClick={() => s !== "ny" && flytta(s)}
                className={`flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                  har
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : klar
                      ? "text-emerald-700 hover:bg-white/60"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
                } disabled:cursor-default`}
              >
                {klar ? <Check className="size-3.5" /> : <span className={`size-1.5 rounded-full ${har ? "bg-primary" : "bg-slate-300"}`} />}
                {STEG_KORT[s]}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {visat === "arkiverad" && <span className="font-semibold text-slate-500">Leaden ligger i arkivet.</span>}
        {(["offert", "vunnen", "forlorad", "avslutad"] as Steg[]).includes(visat as Steg) && (
          <>
            <span className="text-slate-500">Utfall:</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => flytta("forlorad")}
              className={`rounded-md px-2 py-1 font-semibold ${visat === "forlorad" ? "bg-slate-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              Offert nekad
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => flytta("avslutad")}
              className={`rounded-md px-2 py-1 font-semibold ${visat === "avslutad" ? "bg-teal-700 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              Projekt avslutat
            </button>
          </>
        )}
        {pending && <span className="text-slate-400">Sparar i arket...</span>}
        {fel && <span className="text-red-600">{fel}</span>}
      </div>
    </div>
  );
}
