import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CalendarCheck, Clock, FileText, TrendingDown, TrendingUp, Trophy, Users } from "lucide-react";
import { hamtaLeads } from "@/lib/backoffice/ark";
import { PIPELINE, STEG_KORT, attGora, kallor, kronor, nyckeltal, prioritet, relativ, tratt, varde, visningsnamn } from "@/lib/backoffice/crm";
import { dagText, inomDagar, klockslag, kommandeSakert } from "@/lib/backoffice/kalender";
import { status, stockholmTid, type Lead } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import Avatar from "./_delar/Avatar";
import FokusRad from "./_delar/FokusRad";
import StatusMarke, { STATUS_FARG } from "./_delar/StatusMarke";
import Tratt from "./_delar/Tratt";
import { ArkFel, Kort, KortRubrik, RingKnapp, Sidrubrik, Tom } from "./_delar/Ui";

export const dynamic = "force-dynamic";

function halsning(namn: string) {
  const h = Number(stockholmTid().slice(11, 13));
  const tid = h < 5 ? "God natt" : h < 10 ? "God morgon" : h < 17 ? "Hej" : "God kväll";
  return `${tid}, ${namn.split(" ")[0]}`;
}

const DAG = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", weekday: "long", day: "numeric", month: "long" });

function svarstid(min: number | null) {
  if (min == null) return "Ingen data";
  if (min < 60) return `${Math.round(min)} min`;
  if (min < 48 * 60) return `${Math.round(min / 60)} h`;
  return `${Math.round(min / 1440)} d`;
}

function Nyckeltal({ etikett, varde, under, ikon: Ikon, ton }: { etikett: string; varde: string; under: React.ReactNode; ikon: typeof Users; ton: string }) {
  return (
    <Kort className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{etikett}</p>
        <span className={`grid size-8 place-items-center rounded-lg ${ton}`}>
          <Ikon className="size-4" />
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900">{varde}</p>
      <div className="mt-1 text-xs text-slate-500">{under}</div>
    </Kort>
  );
}

export default async function Oversikt({ searchParams }: { searchParams: Promise<{ vy?: string; q?: string }> }) {
  const vem = await kravInloggning();
  // Gamla länkar till listan (/admin?vy=...) går till Leads.
  const { vy, q } = await searchParams;
  if (vy || q) redirect(`/admin/leads?vy=${vy ?? "alla"}${q ? `&q=${encodeURIComponent(q)}` : ""}`);

  let leads: Lead[];
  try {
    leads = await hamtaLeads();
  } catch (err) {
    return <ArkFel err={err} />;
  }

  const orsaker = attGora(leads);
  const fokus = leads
    .filter((l) => orsaker.has(l.id))
    .sort((a, b) => prioritet(orsaker.get(a.id)) - prioritet(orsaker.get(b.id)) || b.tidpunkt.localeCompare(a.tidpunkt));
  const n = nyckeltal(leads);
  const delta = n.vecka - n.forraVeckan;
  const topp = Math.max(1, ...n.perDag.map((d) => d.antal));
  const steg = PIPELINE.map((s) => {
    const i = leads.filter((l) => status(l) === s);
    return { s, antal: i.length, varde: i.reduce((sum, l) => sum + varde(l), 0) };
  });
  const maxSteg = Math.max(1, ...steg.map((s) => s.antal));
  const kalla = kallor(leads).slice(0, 5);
  const kallaMax = Math.max(1, ...kalla.map((k) => k.antal));
  const senaste = leads.filter((l) => !l.arkiverad).slice(0, 5);
  const kal = await kommandeSakert();
  const perId = new Map(leads.map((l) => [l.id, l]));
  const moten = inomDagar(kal.moten, 14);

  return (
    <div className="space-y-6">
      <Sidrubrik
        titel={halsning(vem)}
        under={
          <>
            {DAG.format(new Date()).replace(/^./, (c) => c.toUpperCase())}
            {" · "}
            {fokus.length ? `${fokus.length} ${fokus.length === 1 ? "sak" : "saker"} att ta tag i` : "Inget som väntar just nu"}
          </>
        }
        hoger={
          <Link href="/admin/pipeline" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Öppna pipelinen <ArrowUpRight className="size-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Nyckeltal
          etikett="Nya leads, 7 dagar"
          varde={String(n.vecka)}
          ikon={Users}
          ton="bg-orange-50 text-accent"
          under={
            <span className={`inline-flex items-center gap-1 font-medium ${delta >= 0 ? "text-emerald-700" : "text-red-600"}`}>
              {delta >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {delta >= 0 ? "+" : ""}
              {delta} mot förra veckan
            </span>
          }
        />
        <Nyckeltal etikett="Svarstid, median" varde={svarstid(n.svarstidMinuter)} ikon={Clock} ton="bg-sky-50 text-sky-600" under="Från förfrågan till första kontakt, 30 dagar" />
        <Nyckeltal
          etikett="Offerter ute"
          varde={kronor(n.offerter.varde)}
          ikon={FileText}
          ton="bg-amber-50 text-amber-600"
          under={`${n.offerter.antal} ${n.offerter.antal === 1 ? "offert" : "offerter"} väntar på svar`}
        />
        <Nyckeltal
          etikett="Accepterat"
          varde={kronor(n.vunna.varde)}
          ikon={Trophy}
          ton="bg-emerald-50 text-emerald-600"
          under={n.vinstandel == null ? `${n.vunna.antal} affärer` : `${n.vunna.antal} affärer · ${n.vinstandel} % vinstandel`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Kort>
            <KortRubrik
              titel="Dagens fokus"
              under="Nya först, sedan påminnelser, orörda leads och föreslagna mejl."
              hoger={
                <Link href="/admin/leads?vy=att-gora" className="text-xs font-semibold text-primary hover:underline">
                  Visa alla
                </Link>
              }
            />
            {fokus.length ? (
              <ul className="divide-y divide-slate-100">
                {fokus.slice(0, 8).map((l) => (
                  <FokusRad key={l.id} lead={l} orsaker={orsaker.get(l.id)!} />
                ))}
              </ul>
            ) : (
              <Tom titel="Allt är avbockat" text="Nya leads och påminnelser dyker upp här." />
            )}
            {fokus.length > 8 && (
              <Link href="/admin/leads?vy=att-gora" className="block border-t border-slate-100 px-5 py-3 text-center text-sm font-medium text-primary hover:bg-slate-50">
                {fokus.length - 8} till i Att göra
              </Link>
            )}
          </Kort>

          <Kort>
            <KortRubrik
              titel="Senast inkomna"
              hoger={
                <Link href="/admin/leads" className="text-xs font-semibold text-primary hover:underline">
                  Alla leads
                </Link>
              }
            />
            <ul className="divide-y divide-slate-100">
              {senaste.map((l) => (
                <li key={l.id} className="relative flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70">
                  <Avatar lead={l} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/lead/${l.id}`} className="block truncate text-sm font-semibold after:absolute after:inset-0">
                      {visningsnamn(l)}
                    </Link>
                    <p className="truncate text-xs text-slate-500">{[l.taktyp, l.yta && `${l.yta} m²`, l.meddelande].filter(Boolean).join(" · ") || l.kalla}</p>
                  </div>
                  <span className="hidden text-xs text-slate-400 sm:block">{relativ(l.tidpunkt)}</span>
                  <StatusMarke status={status(l)} />
                  <span className="relative z-10">
                    <RingKnapp telefon={l.telefon} />
                  </span>
                </li>
              ))}
            </ul>
          </Kort>
        </div>

        <div className="min-w-0 space-y-6">
          <Kort>
            <KortRubrik titel="Kommande takkontroller" under={kal.fel ? `Kalendern gick inte att läsa: ${kal.fel}` : "Närmaste två veckorna, från kalendern"} />
            {moten.length ? (
              <ul className="divide-y divide-slate-100">
                {moten.slice(0, 6).map((m) => {
                  const l = perId.get(m.leadId);
                  return (
                    <li key={m.id} className="relative flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70">
                      <span className="grid w-12 shrink-0 place-items-center rounded-lg bg-indigo-50 py-1 text-indigo-700">
                        <span className="text-sm font-bold tabular-nums">{klockslag(m.start)}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/lead/${m.leadId}`} className="block truncate text-sm font-semibold after:absolute after:inset-0">
                          {l ? visningsnamn(l) : m.titel.replace(/^Takkontroll: /, "")}
                        </Link>
                        <p className="truncate text-xs text-slate-500 first-letter:uppercase">
                          {[dagText(m.start), l?.adress].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      {l && (
                        <span className="relative z-10">
                          <RingKnapp telefon={l.telefon} />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-slate-500">
                <CalendarCheck className="size-4 text-slate-400" />
                {kal.installd ? "Inga bokade takkontroller." : "Kalendern är inte inställd."}
              </div>
            )}
            {moten.length > 6 && <p className="border-t border-slate-100 px-5 py-2 text-center text-xs text-slate-500">{moten.length - 6} till</p>}
          </Kort>

          <Kort>
            <Tratt totalt={tratt(leads)} manad={tratt(leads, 30)} />
          </Kort>

          <Kort>
            <KortRubrik titel="Pipeline" under="Antal och offertvärde per steg" />
            <ul className="space-y-3 px-5 py-4">
              {steg.map(({ s, antal, varde: v }) => (
                <li key={s}>
                  <Link href={`/admin/pipeline#${s}`} className="group block">
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">{STEG_KORT[s]}</span>
                      <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">{antal}</span>
                        {v > 0 && ` · ${kronor(v)}`}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${STATUS_FARG[s].prick}`} style={{ width: `${Math.max(2, (100 * antal) / maxSteg)}%` }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Kort>

          <Kort>
            <KortRubrik titel="Inkomna leads" under="Senaste 14 dagarna" />
            <div className="px-5 pb-4 pt-5">
              <div className="flex h-24 items-end gap-1">
                {n.perDag.map((d) => (
                  <div key={d.dag} className="group relative flex h-full flex-1 items-end" title={`${d.dag}: ${d.antal}`}>
                    <div
                      className={`w-full rounded-t ${d.antal ? "bg-primary/80 group-hover:bg-primary" : "bg-slate-100"}`}
                      style={{ height: d.antal ? `${(100 * d.antal) / topp}%` : "4px" }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                <span>{n.perDag[0].dag.slice(5)}</span>
                <span>I dag</span>
              </div>
            </div>
          </Kort>

          <Kort>
            <KortRubrik titel="Varifrån leads kommer" under="Senaste 30 dagarna" />
            {kalla.length ? (
              <ul className="space-y-2.5 px-5 py-4">
                {kalla.map((k) => (
                  <li key={k.namn} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 truncate text-slate-600">{k.namn}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-slate-800" style={{ width: `${(100 * k.antal) / kallaMax}%` }} />
                    </span>
                    <span className="w-6 text-right font-semibold">{k.antal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Tom titel="Inga leads senaste månaden" />
            )}
          </Kort>
        </div>
      </div>
    </div>
  );
}
