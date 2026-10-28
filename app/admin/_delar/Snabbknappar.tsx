"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, CalendarCheck, Check, PhoneCall, PhoneOff } from "lucide-react";
import { LOGG } from "@/lib/backoffice/floden";
import { snabbLogg } from "../actions";

/** Det man oftast gör efter ett samtal, med ett klick. Kompakt i listorna, med text i leadvyn. */
export default function Snabbknappar({ id, arkiverad, bokad, kompakt }: { id: string; arkiverad: boolean; bokad?: boolean; kompakt?: boolean }) {
  const [pending, start] = useTransition();
  const [klar, setKlar] = useState("");
  const kor = (text: string, falt?: Parameters<typeof snabbLogg>[2]) =>
    start(async () => {
      await snabbLogg(id, text, falt);
      setKlar(text);
      setTimeout(() => setKlar(""), 2500);
    });

  const knappar = [
    { text: LOGG.ringtSvar, kort: "Fick svar", ikon: PhoneCall, gor: () => kor(LOGG.ringtSvar), ton: "hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50" },
    { text: LOGG.ringtInget, kort: "Inget svar", ikon: PhoneOff, gor: () => kor(LOGG.ringtInget), ton: "hover:text-amber-800 hover:border-amber-200 hover:bg-amber-50" },
    ...(kompakt || bokad
      ? []
      : [{ text: LOGG.bokad, kort: "Takkontroll bokad", ikon: CalendarCheck, gor: () => kor(LOGG.bokad, { bokad: true }), ton: "hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50" }]),
    ...(kompakt
      ? []
      : arkiverad
        ? [{ text: "Ta tillbaka från arkivet", kort: "Ta tillbaka", ikon: ArchiveRestore, gor: () => kor(`${LOGG.arkiverad} (ångrat)`, { arkiverad: false }), ton: "hover:bg-slate-50" }]
        : [{ text: "Skräp, arkivera", kort: "Arkivera", ikon: Archive, gor: () => kor("Skräp, arkiverad", { arkiverad: true }), ton: "hover:text-red-700 hover:border-red-200 hover:bg-red-50" }]),
  ];

  if (kompakt) {
    return (
      <div className="flex items-center gap-1">
        {knappar.map(({ text, ikon: Ikon, gor, ton }) => (
          <button
            key={text}
            type="button"
            title={text}
            disabled={pending}
            onClick={gor}
            className={`grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition disabled:opacity-50 ${ton}`}
          >
            {klar === text ? <Check className="size-4 text-emerald-600" /> : <Ikon className="size-4" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {knappar.map(({ text, kort, ikon: Ikon, gor, ton }) => (
        <button
          key={text}
          type="button"
          disabled={pending}
          onClick={gor}
          className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition disabled:opacity-50 ${ton}`}
        >
          {klar === text ? <Check className="size-4 text-emerald-600" /> : <Ikon className="size-4" />}
          {kort}
        </button>
      ))}
    </div>
  );
}
