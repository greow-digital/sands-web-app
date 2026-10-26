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

const TEXTFALT: { falt: SkrivbartFalt; text: string; typ?: string; flerrad?: boolean }[] = [
  { falt: "paminnelse", text: "Påminnelse", typ: "date" },
  { falt: "offertvarde", text: "Offertvärde" },
  { falt: "startdatum", text: "Planerat startdatum" },
  { falt: "adress", text: "Adress" },
  { falt: "anteckning", text: "Anteckning (syns i listan)", flerrad: true },
  { falt: "namn", text: "Namn" },
  { falt: "telefon", text: "Telefon" },
  { falt: "epost", text: "E-post" },
];

const falt = "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm";

export default function LeadFormular({ lead }: { lead: Lead }) {
  const [res, action, pending] = useActionState(sparaLead, null);

  return (
    // key: formuläret nollställs mot arkets värden efter varje sparning.
    <form action={action} key={JSON.stringify(lead)} className="space-y-4">
      <input type="hidden" name="id" value={lead.id} />

      <fieldset>
        <legend className="mb-2 font-semibold">Steg</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {STEG.map(({ falt: f, text }) => (
            <label key={f} className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm">
              <input type="hidden" name={`fore:${f}`} value={String(lead[f])} />
              <input type="checkbox" name={f} defaultChecked={Boolean(lead[f])} className="size-4 accent-primary" />
              {text}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        {TEXTFALT.map(({ falt: f, text, typ, flerrad }) => (
          <label key={f} className={`block text-sm font-medium ${flerrad ? "sm:col-span-2" : ""}`}>
            {text}
            <input type="hidden" name={`fore:${f}`} value={String(lead[f])} />
            {flerrad ? (
              <textarea name={f} defaultValue={String(lead[f])} rows={3} className={falt} />
            ) : (
              <input name={f} type={typ ?? "text"} defaultValue={String(lead[f])} className={falt} />
            )}
          </label>
        ))}
      </div>

      <label className="block text-sm font-medium">
        Ny notering i historiken
        <input name="notering" placeholder="T.ex. vill ha besök efter kl 16" className={falt} />
      </label>

      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Sparar..." : "Spara"}
        </button>
        {res?.ok && <span className="text-sm text-trust-green">{res.ok}</span>}
        {res?.fel && <span className="text-sm text-red-600">{res.fel}</span>}
      </div>
    </form>
  );
}
