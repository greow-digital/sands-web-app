"use client";

import { useActionState } from "react";
import type { Lead, SkrivbartFalt } from "@/lib/backoffice/lead";
import { sparaLead } from "../actions";

const STEG: { falt: SkrivbartFalt; text: string }[] = [
  { falt: "bokad", text: "Takkontroll bokad" },
  { falt: "offertSkickad", text: "Offert skickad" },
  { falt: "offertAccepterad", text: "Offert accepterad" },
  { falt: "offertNekad", text: "Offert nekad" },
  { falt: "projektAvslutat", text: "Projekt avslutat" },
];

const AFFAR: { falt: SkrivbartFalt; text: string; placeholder?: string; flerrad?: boolean }[] = [
  { falt: "offertvarde", text: "Offertvärde", placeholder: "T.ex. 180 000" },
  { falt: "startdatum", text: "Planerat startdatum", placeholder: "T.ex. vecka 14" },
  { falt: "adress", text: "Adress", placeholder: "Gata, ort" },
  { falt: "anteckning", text: "Anteckning (syns i listan)", flerrad: true },
];

const KONTAKT: { falt: SkrivbartFalt; text: string; typ?: string }[] = [
  { falt: "namn", text: "Namn" },
  { falt: "telefon", text: "Telefon", typ: "tel" },
  { falt: "epost", text: "E-post", typ: "email" },
];

const falt =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

function Fore({ lead, f }: { lead: Lead; f: SkrivbartFalt }) {
  return <input type="hidden" name={`fore:${f}`} value={String(lead[f])} />;
}

export default function LeadFormular({ lead }: { lead: Lead }) {
  const [res, action, pending] = useActionState(sparaLead, null);

  return (
    // key: formuläret nollställs mot arkets värden efter varje sparning.
    <form action={action} key={JSON.stringify(lead)} className="space-y-5 p-5">
      <input type="hidden" name="id" value={lead.id} />

      <div className="grid gap-3 sm:grid-cols-2">
        {AFFAR.map(({ falt: f, text, placeholder, flerrad }) => (
          <label key={f} className={`block text-xs font-medium text-slate-600 ${flerrad ? "sm:col-span-2" : ""}`}>
            {text}
            <Fore lead={lead} f={f} />
            {flerrad ? (
              <textarea name={f} defaultValue={String(lead[f])} rows={2} className={falt} />
            ) : (
              <input name={f} defaultValue={String(lead[f])} placeholder={placeholder} className={falt} />
            )}
          </label>
        ))}
      </div>

      <details className="group rounded-xl border border-slate-200">
        <summary className="cursor-pointer select-none px-3.5 py-2.5 text-xs font-semibold text-slate-600">Kontaktuppgifter och kryssrutor i arket</summary>
        <div className="space-y-4 border-t border-slate-100 p-3.5">
          <div className="grid gap-3 sm:grid-cols-3">
            {KONTAKT.map(({ falt: f, text, typ }) => (
              <label key={f} className="block text-xs font-medium text-slate-600">
                {text}
                <Fore lead={lead} f={f} />
                <input name={f} type={typ ?? "text"} defaultValue={String(lead[f])} className={falt} />
              </label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {STEG.map(({ falt: f, text }) => (
              <label key={f} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <Fore lead={lead} f={f} />
                <input type="checkbox" name={f} defaultChecked={Boolean(lead[f])} className="size-4 accent-primary" />
                {text}
              </label>
            ))}
          </div>
        </div>
      </details>

      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
          {pending ? "Sparar..." : "Spara ändringar"}
        </button>
        {res?.ok && <span className="text-sm text-emerald-700">{res.ok}</span>}
        {res?.fel && <span className="text-sm text-red-600">{res.fel}</span>}
      </div>
    </form>
  );
}
