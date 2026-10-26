import { initialer } from "@/lib/backoffice/crm";
import type { Lead } from "@/lib/backoffice/lead";

// Samma färg för samma person varje gång, så att man känner igen dem i listan.
const FARGER = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
];

export default function Avatar({ lead, stor }: { lead: Pick<Lead, "id" | "namn" | "epost">; stor?: boolean }) {
  const i = [...lead.id].reduce((s, c) => s + c.charCodeAt(0), 0) % FARGER.length;
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold ${FARGER[i]} ${stor ? "size-14 text-lg" : "size-9 text-xs"}`}
      aria-hidden
    >
      {initialer(lead)}
    </span>
  );
}
