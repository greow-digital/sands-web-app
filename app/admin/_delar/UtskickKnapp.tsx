"use client";

import { useState, useTransition } from "react";
import { skickaUtskick, type Resultat } from "../actions";

export default function UtskickKnapp({ id, flode, namn, epost }: { id: string; flode: string; namn: string; epost: string }) {
  const [pending, start] = useTransition();
  const [res, setRes] = useState<Resultat>(null);

  return (
    <>
      <button
        disabled={pending}
        className="rounded-lg bg-dark px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        onClick={() => {
          if (!confirm(`Skicka "${namn}" till ${epost}?`)) return;
          start(async () => setRes(await skickaUtskick(id, flode)));
        }}
      >
        {pending ? "Skickar..." : "Skicka"}
      </button>
      {res?.ok && <span className="w-full text-xs text-trust-green">{res.ok}</span>}
      {res?.fel && <span className="w-full text-xs text-red-600">{res.fel}</span>}
    </>
  );
}
