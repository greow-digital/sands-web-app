import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  CalendarCheck,
  CircleDot,
  Eye,
  FileText,
  Inbox,
  Mail,
  MessageSquareText,
  PhoneCall,
  PhoneOff,
  Trophy,
  XCircle,
} from "lucide-react";
import { hamtaLead, hamtaLeads } from "@/lib/backoffice/ark";
import { attGora, kallaNamn, kronor, relativ, varde, visningsnamn } from "@/lib/backoffice/crm";
import { FLODEN, LOGG, redanSkickat } from "@/lib/backoffice/floden";
import { kommandeSakert, moteText } from "@/lib/backoffice/kalender";
import { status, type LoggRad } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import { kontaktperson, nap } from "@/lib/company";
import Avatar from "../../_delar/Avatar";
import BokaTid from "../../_delar/BokaTid";
import LeadFormular from "../../_delar/LeadFormular";
import Notering from "../../_delar/Notering";
import PaminnelseVal from "../../_delar/PaminnelseVal";
import Snabbknappar from "../../_delar/Snabbknappar";
import StatusMarke from "../../_delar/StatusMarke";
import StegVal from "../../_delar/StegVal";
import UtskickKnapp from "../../_delar/UtskickKnapp";
import { Kort, KortRubrik, RingKnapp } from "../../_delar/Ui";

export const dynamic = "force-dynamic";

function Uppgift({ etikett, children }: { etikett: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-2 text-sm">
      <dt className="text-slate-500">{etikett}</dt>
      <dd className="whitespace-pre-line break-words text-slate-900">{children}</dd>
    </div>
  );
}

/** Ikon och färg för en rad i historiken, efter vad som hände. */
function handelse(r: LoggRad) {
  const t = r.text;
  if (t.startsWith(LOGG.ringtSvar)) return { ikon: PhoneCall, ton: "bg-emerald-50 text-emerald-600" };
  if (t.startsWith(LOGG.ringtInget)) return { ikon: PhoneOff, ton: "bg-amber-50 text-amber-600" };
  if (t.startsWith(LOGG.mejl)) return { ikon: Mail, ton: "bg-sky-50 text-sky-600" };
  if (t.includes("(ångrat)")) return { ikon: CircleDot, ton: "bg-slate-100 text-slate-500" };
  if (t.startsWith(LOGG.accepterad) || t.startsWith(LOGG.avslutat)) return { ikon: Trophy, ton: "bg-emerald-50 text-emerald-600" };
  if (t.startsWith(LOGG.nekad)) return { ikon: XCircle, ton: "bg-slate-100 text-slate-500" };
  if (t.startsWith(LOGG.offert)) return { ikon: FileText, ton: "bg-amber-50 text-amber-600" };
  if (t.startsWith(LOGG.bokad)) return { ikon: CalendarCheck, ton: "bg-indigo-50 text-indigo-600" };
  if (t.startsWith(LOGG.arkiverad) || t.startsWith("Skräp")) return { ikon: Archive, ton: "bg-slate-100 text-slate-500" };
  return { ikon: MessageSquareText, ton: "bg-slate-100 text-slate-600" };
}

export default async function LeadSida({ params }: { params: Promise<{ id: string }> }) {
  await kravInloggning();
  const { id } = await params;
  const lead = await hamtaLead(id);
  if (!lead) notFound();

  const s = status(lead);
  const orsaker = attGora(await hamtaLeads()).get(lead.id) ?? [];
  const v = varde(lead);
  const kal = await kommandeSakert();
  const nasta = kal.moten.find((m) => m.leadId === lead.id);

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="size-4" /> Alla leads
      </Link>

      <Kort className="p-5">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar lead={lead} stor />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">{visningsnamn(lead)}</h1>
              <StatusMarke status={s} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {[
                `Inkom ${relativ(lead.tidpunkt)} (${lead.tidpunkt.slice(0, 16)})`,
                lead.kalla && `via ${kallaNamn(lead.kalla)}`,
                v ? kronor(v) : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {nasta && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                <CalendarCheck className="size-3.5" />
                {nasta.lank ? (
                  <a href={nasta.lank} target="_blank" rel="noreferrer" className="hover:underline">
                    Takkontroll {moteText(nasta)}
                  </a>
                ) : (
                  <>Takkontroll {moteText(nasta)}</>
                )}
              </p>
            )}
            {kal.fel && <p className="mt-2 text-xs text-slate-400">Kalendern gick inte att läsa: {kal.fel}</p>}
            {orsaker.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {orsaker.map((o, i) => (
                  <span key={i} className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
                    {o.text}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <RingKnapp telefon={lead.telefon} text />
            <BokaTid id={lead.id} installd={kal.installd} />
            {lead.epost && (
              <a
                href={`mailto:${lead.epost}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Mail className="size-4" /> Mejla
              </a>
            )}
            <PaminnelseVal id={lead.id} paminnelse={lead.paminnelse} />
          </div>
        </div>

        <div className="mt-5">
          <StegVal id={lead.id} steg={s} />
        </div>
      </Kort>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <Kort>
            <KortRubrik titel="Efter samtalet" under="Ett klick loggar samtalet. Anteckningar hamnar i historiken och i arket." />
            <div className="space-y-4 p-5">
              <Snabbknappar id={lead.id} arkiverad={lead.arkiverad} bokad={lead.bokad} />
              <Notering id={lead.id} />
            </div>
          </Kort>

          <Kort>
            <KortRubrik titel="Historik" under={`${lead.logg.length} händelser`} />
            <ol className="relative px-5 py-4">
              {[...lead.logg].reverse().map((r, i) => {
                const { ikon: Ikon, ton } = handelse(r);
                return (
                  <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
                    <span className="absolute left-4 top-9 -bottom-0 w-px bg-slate-200" aria-hidden />
                    <span className={`relative grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white ${ton}`}>
                      <Ikon className="size-4" />
                    </span>
                    <div className="min-w-0 pt-1">
                      <p className="text-sm text-slate-900">{r.text}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {r.vem && <span className="font-medium text-slate-500">{r.vem}</span>}
                        {r.vem && r.tid && " · "}
                        {r.tid && `${relativ(r.tid)}, ${r.tid}`}
                      </p>
                    </div>
                  </li>
                );
              })}
              <li className="relative flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-50 text-accent ring-4 ring-white">
                  <Inbox className="size-4" />
                </span>
                <div className="pt-1">
                  <p className="text-sm text-slate-900">Förfrågan kom in{lead.kalla && ` från ${lead.kalla}`}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{lead.tidpunkt.slice(0, 16)}</p>
                </div>
              </li>
            </ol>
          </Kort>
        </div>

        <div className="space-y-6">
          <Kort>
            <KortRubrik titel="Förfrågan" />
            <dl className="divide-y divide-slate-100 px-5 py-2">
              <Uppgift etikett="Telefon">{lead.telefon}</Uppgift>
              <Uppgift etikett="E-post">{lead.epost}</Uppgift>
              <Uppgift etikett="Taktyp">{lead.taktyp}</Uppgift>
              <Uppgift etikett="Yta">{lead.yta && `${lead.yta} m²`}</Uppgift>
              <Uppgift etikett="Meddelande">{lead.meddelande}</Uppgift>
              <Uppgift etikett="Sida">{lead.kalla}</Uppgift>
              <Uppgift etikett="Kanal">{lead.kanal}</Uppgift>
              <Uppgift etikett="Google Ads">{lead.gclid ? "Ja, klick-id finns" : ""}</Uppgift>
            </dl>
            {lead.transkript && (
              <details className="border-t border-slate-100 px-5 py-3 text-sm">
                <summary className="cursor-pointer font-semibold text-slate-700">Transkript från röstagenten</summary>
                <p className="mt-2 whitespace-pre-line text-slate-600">{lead.transkript}</p>
              </details>
            )}
          </Kort>

          <Kort>
            <KortRubrik titel="Affären" under="Sparas i arket" />
            <LeadFormular lead={lead} />
          </Kort>

          <Kort>
            <KortRubrik
              titel="Uppföljningsmejl"
              under={lead.epost ? `Går till ${lead.epost} i ${kontaktperson.fornamn}s namn. Svar landar i ${nap.email}.` : "Leaden saknar e-post."}
            />
            <ul className="divide-y divide-slate-100">
              {FLODEN.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-2 px-5 py-3 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-slate-900">{f.namn}</span>
                    {redanSkickat(lead, f) && <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">skickat</span>}
                    {f.foreslas(lead) && <span className="ml-2 rounded bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">föreslås</span>}
                  </span>
                  <a
                    href={`/admin/forhandsvisning?lead=${lead.id}&flode=${f.id}`}
                    target="_blank"
                    title="Förhandsgranska"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Eye className="size-4" />
                  </a>
                  {lead.epost && <UtskickKnapp id={lead.id} flode={f.id} namn={f.namn} epost={lead.epost} />}
                </li>
              ))}
            </ul>
          </Kort>
        </div>
      </div>
    </div>
  );
}
