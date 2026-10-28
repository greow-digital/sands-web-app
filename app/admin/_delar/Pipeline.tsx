"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { BellRing, CalendarCheck, ChevronRight, GripVertical, Phone } from "lucide-react";
import { PIPELINE, STEG_KORT, datum, kronor, type Steg } from "@/lib/backoffice/crm";
import { telHref } from "@/lib/backoffice/lead";
import { flyttaSteg } from "../actions";
import { STATUS_FARG } from "./StatusMarke";

export type PipelineKort = {
  id: string;
  namn: string;
  steg: Steg;
  varde: number;
  inkom: string;
  detalj: string;
  telefon: string;
  paminnelse: string;
  flagga: string;
  /** Nästa bokade takkontroll från kalendern, i klartext. */
  mote: string;
};

const KOLUMNER: Steg[] = [...PIPELINE, "forlorad", "avslutad"];
const NASTA: Partial<Record<Steg, Exclude<Steg, "ny">>> = { ny: "kontaktad", kontaktad: "bokad", bokad: "offert", offert: "vunnen", vunnen: "avslutad" };

export default function Pipeline({ kort }: { kort: PipelineKort[] }) {
  const [visat, flytta] = useOptimistic(kort, (lista, { id, till }: { id: string; till: Steg }) =>
    lista.map((k) => (k.id === id ? { ...k, steg: till } : k))
  );
  const [, start] = useTransition();
  const [drar, setDrar] = useState<string | null>(null);
  const [over, setOver] = useState<Steg | null>(null);
  const [fel, setFel] = useState("");

  const flyttaTill = (id: string, till: Steg) => {
    const k = visat.find((x) => x.id === id);
    if (!k || k.steg === till || till === "ny") return;
    start(async () => {
      flytta({ id, till });
      setFel("");
      const r = await flyttaSteg(id, till);
      if (r?.fel) setFel(`${k.namn}: ${r.fel}`);
    });
  };

  return (
    <>
      {fel && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{fel}</p>}
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 lg:-mx-8 lg:px-8">
        {KOLUMNER.map((steg) => {
          const lista = visat.filter((k) => k.steg === steg);
          const summa = lista.reduce((s, k) => s + k.varde, 0);
          const sido = steg === "forlorad" || steg === "avslutad";
          return (
            <section
              key={steg}
              id={steg}
              onDragOver={(e) => {
                if (steg === "ny") return;
                e.preventDefault();
                setOver(steg);
              }}
              onDragLeave={() => setOver((o) => (o === steg ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const id = e.dataTransfer.getData("text/plain");
                if (id) flyttaTill(id, steg);
              }}
              className={`flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border transition ${
                over === steg ? "border-primary/50 bg-primary/5" : sido ? "border-dashed border-slate-200 bg-slate-50" : "border-slate-200/80 bg-slate-100/60"
              }`}
            >
              <header className="flex items-center gap-2 px-3.5 pb-2 pt-3">
                <span className={`size-2 rounded-full ${STATUS_FARG[steg].prick}`} />
                <h2 className="text-sm font-semibold text-slate-800">{STEG_KORT[steg]}</h2>
                <span className="rounded-md bg-white px-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">{lista.length}</span>
                {summa > 0 && <span className="ml-auto text-xs font-medium text-slate-500">{kronor(summa)}</span>}
              </header>
              <ul className="flex min-h-24 flex-1 flex-col gap-2 px-2 pb-2">
                {lista.map((k) => (
                  <li
                    key={k.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", k.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDrar(k.id);
                    }}
                    onDragEnd={() => setDrar(null)}
                    className={`group relative cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:shadow-md active:cursor-grabbing ${
                      drar === k.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      <GripVertical className="mt-0.5 size-4 shrink-0 text-slate-300 group-hover:text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/lead/${k.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:text-primary">
                          {k.namn}
                        </Link>
                        {k.detalj && <p className="truncate text-xs text-slate-500">{k.detalj}</p>}
                      </div>
                      {k.varde > 0 && <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900">{kronor(k.varde)}</span>}
                    </div>
                    {k.steg === "bokad" && k.mote && (
                      <p className="mt-2 flex items-center gap-1.5 truncate rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                        <CalendarCheck className="size-3 shrink-0" /> {k.mote}
                      </p>
                    )}
                    {k.flagga && <p className="mt-2 truncate rounded-md bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">{k.flagga}</p>}
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{k.inkom}</span>
                      {k.paminnelse && (
                        <span className="inline-flex items-center gap-1 text-violet-600">
                          <BellRing className="size-3" /> {datum(k.paminnelse)}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1">
                        {telHref(k.telefon) && (
                          <a href={telHref(k.telefon)} title={`Ring ${k.telefon}`} className="grid size-6 place-items-center rounded-md text-slate-400 hover:bg-primary/10 hover:text-primary">
                            <Phone className="size-3.5" />
                          </a>
                        )}
                        {/* Utan mus (mobilen) flyttas kortet ett steg i taget. */}
                        {NASTA[k.steg] && (
                          <button
                            type="button"
                            title={`Flytta till ${STEG_KORT[NASTA[k.steg]!]}`}
                            onClick={() => flyttaTill(k.id, NASTA[k.steg]!)}
                            className="grid size-6 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <ChevronRight className="size-3.5" />
                          </button>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
                {!lista.length && (
                  <li className="grid flex-1 place-items-center rounded-xl border border-dashed border-slate-200 py-6 text-xs text-slate-400">
                    {steg === "ny" ? "Inga nya leads" : "Släpp här"}
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
