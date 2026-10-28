"use client";

import { useState, useTransition } from "react";
import { Check, Send } from "lucide-react";
import { skickaUtskick, type Resultat } from "../actions";

export default function UtskickKnapp({ id, flode, namn, epost }: { id: string; flode: string; namn: string; epost: string }) {
  const [pending, start] = useTransition();
  const [res, setRes] = useState<Resultat>(null);

  if (res?.ok) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700" title={res.ok}>
        <Check className="size-4" /> Skickat
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        onClick={() => {
          if (!confirm(`Skicka "${namn}" till ${epost}?`)) return;
          start(async () => setRes(await skickaUtskick(id, flode)));
        }}
      >
        <Send className="size-3.5" />
        {pending ? "Skickar..." : "Skicka"}
      </button>
      {res?.fel && <span className="w-full text-xs text-red-600">{res.fel}</span>}
    </>
  );
}
