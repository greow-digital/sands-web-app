import Link from "next/link";
import { relativ, visningsnamn, type Orsak } from "@/lib/backoffice/crm";
import { status, type Lead } from "@/lib/backoffice/lead";
import Avatar from "./Avatar";
import PaminnelseVal from "./PaminnelseVal";
import Snabbknappar from "./Snabbknappar";
import StatusMarke from "./StatusMarke";
import UtskickKnapp from "./UtskickKnapp";
import { RingKnapp } from "./Ui";

const ORSAK_FARG: Record<Orsak["typ"], string> = {
  ny: "bg-orange-50 text-orange-700",
  paminnelse: "bg-violet-50 text-violet-700",
  orord: "bg-red-50 text-red-700",
  mejl: "bg-sky-50 text-sky-700",
};

/** En rad i Att göra: vem, varför, och åtgärderna direkt på raden. */
export default function FokusRad({ lead, orsaker }: { lead: Lead; orsaker: Orsak[] }) {
  const mejl = orsaker.find((o) => o.typ === "mejl");
  return (
    <li className="group relative flex flex-col gap-3 px-5 py-3.5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar lead={lead} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/lead/${lead.id}`} className="truncate font-semibold text-slate-900 after:absolute after:inset-0">
              {visningsnamn(lead)}
            </Link>
            <StatusMarke status={status(lead)} />
            <span className="text-xs text-slate-400">{relativ(lead.tidpunkt)}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {orsaker.map((o, i) => (
              <span key={i} className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${ORSAK_FARG[o.typ]}`}>
                {o.text}
              </span>
            ))}
            {(lead.meddelande || lead.anteckning) && (
              <span className="truncate text-xs text-slate-500">{lead.anteckning || lead.meddelande}</span>
            )}
          </div>
        </div>
      </div>
      {/* z-10: knapparna ligger över länken som täcker raden. */}
      <div className="relative z-10 flex items-center gap-1.5 pl-12 sm:pl-0">
        {mejl?.typ === "mejl" && lead.epost && <UtskickKnapp id={lead.id} flode={mejl.flode.id} namn={mejl.flode.namn} epost={lead.epost} />}
        <Snabbknappar id={lead.id} arkiverad={lead.arkiverad} kompakt />
        <PaminnelseVal id={lead.id} paminnelse={lead.paminnelse} kompakt />
        <RingKnapp telefon={lead.telefon} />
      </div>
    </li>
  );
}
