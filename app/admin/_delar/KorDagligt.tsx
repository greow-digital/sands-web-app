"use client";

import { useState, useTransition } from "react";
import { korDagligtNu, type Resultat } from "../actions";

export default function KorDagligt({ auto }: { auto: boolean }) {
  const [pending, start] = useTransition();
  const [res, setRes] = useState<Resultat>(null);
  return (
    <div className="space-y-1">
      <button
        disabled={pending}
        className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-50"
        onClick={() => {
          const text = auto
            ? "Kör det dagliga jobbet nu? Föreslagna uppföljningar skickas till kunderna och sammanfattningen mejlas."
            : "Kör det dagliga jobbet nu? Sammanfattningen mejlas, inga kundmejl skickas.";
          if (confirm(text)) start(async () => setRes(await korDagligtNu()));
        }}
      >
        {pending ? "Kör..." : "Kör dagliga jobbet nu"}
      </button>
      {res?.ok && <p className="text-sm text-trust-green">{res.ok}</p>}
      {res?.fel && <p className="text-sm text-red-600">{res.fel}</p>}
    </div>
  );
}
