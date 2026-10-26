"use client";

import { useTransition } from "react";
import { LOGG } from "@/lib/backoffice/floden";
import { snabbLogg } from "../actions";

/** Det man oftast gör efter ett samtal, med ett klick. */
export default function Snabbknappar({ id, arkiverad }: { id: string; arkiverad: boolean }) {
  const [pending, start] = useTransition();
  const knapp = "rounded-lg border border-black/10 px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-50";
  const kor = (text: string, falt?: Parameters<typeof snabbLogg>[2]) => start(() => snabbLogg(id, text, falt));

  return (
    <div className="flex flex-wrap gap-2">
      <button disabled={pending} className={knapp} onClick={() => kor(LOGG.ringtSvar)}>
        Ringt, fick svar
      </button>
      <button disabled={pending} className={knapp} onClick={() => kor(LOGG.ringtInget)}>
        Ringt, inget svar
      </button>
      <button disabled={pending} className={knapp} onClick={() => kor(LOGG.bokad, { bokad: true })}>
        Takkontroll bokad
      </button>
      {arkiverad ? (
        <button disabled={pending} className={knapp} onClick={() => kor(`${LOGG.arkiverad} (ångrat)`, { arkiverad: false })}>
          Ta tillbaka från arkivet
        </button>
      ) : (
        <button disabled={pending} className={knapp} onClick={() => kor("Skräp, arkiverad", { arkiverad: true })}>
          Skräp, arkivera
        </button>
      )}
    </div>
  );
}
