import { STATUS_NAMN, type Status } from "@/lib/backoffice/lead";

export const STATUS_FARG: Record<Status, { marke: string; prick: string }> = {
  ny: { marke: "bg-orange-50 text-orange-700 ring-orange-600/15", prick: "bg-accent" },
  kontaktad: { marke: "bg-sky-50 text-sky-700 ring-sky-600/15", prick: "bg-sky-500" },
  bokad: { marke: "bg-indigo-50 text-indigo-700 ring-indigo-600/15", prick: "bg-indigo-500" },
  offert: { marke: "bg-amber-50 text-amber-800 ring-amber-600/20", prick: "bg-amber-500" },
  vunnen: { marke: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", prick: "bg-emerald-500" },
  avslutad: { marke: "bg-teal-50 text-teal-700 ring-teal-600/15", prick: "bg-teal-600" },
  forlorad: { marke: "bg-slate-100 text-slate-600 ring-slate-500/15", prick: "bg-slate-400" },
  arkiverad: { marke: "bg-slate-100 text-slate-500 ring-slate-500/10", prick: "bg-slate-300" },
};

export default function StatusMarke({ status }: { status: Status }) {
  const f = STATUS_FARG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${f.marke}`}>
      <span className={`size-1.5 rounded-full ${f.prick}`} />
      {STATUS_NAMN[status]}
    </span>
  );
}
