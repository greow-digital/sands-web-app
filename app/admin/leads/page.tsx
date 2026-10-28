import Link from "next/link";
import { BellRing } from "lucide-react";
import { hamtaLeads } from "@/lib/backoffice/ark";
import { attGora, datum, kronor, prioritet, relativ, senasteAktivitet, varde, visningsnamn, type Orsak } from "@/lib/backoffice/crm";
import { idag, status, type Lead } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import Avatar from "../_delar/Avatar";
import PaminnelseVal from "../_delar/PaminnelseVal";
import Snabbknappar from "../_delar/Snabbknappar";
import StatusMarke from "../_delar/StatusMarke";
import { ArkFel, Kort, RingKnapp, Sidrubrik, Tom } from "../_delar/Ui";

export const dynamic = "force-dynamic";

const VYER = {
  alla: "Alla",
  "att-gora": "Att göra",
  aktiva: "Pågående",
  vunna: "Accepterade",
  arkiv: "Arkiv",
} as const;

type Vy = keyof typeof VYER;

const SORTERING = {
  nyast: "Nyast först",
  prio: "Prioritet",
  aktivitet: "Senaste aktivitet",
  varde: "Offertvärde",
} as const;

type Sort = keyof typeof SORTERING;

function urval(leads: Lead[], vy: Vy, orsaker: Map<string, Orsak[]>) {
  switch (vy) {
    case "att-gora":
      return leads.filter((l) => orsaker.has(l.id));
    case "aktiva":
      return leads.filter((l) => ["ny", "kontaktad", "bokad", "offert"].includes(status(l)));
    case "vunna":
      return leads.filter((l) => ["vunnen", "avslutad"].includes(status(l)));
    case "arkiv":
      return leads.filter((l) => l.arkiverad);
    default:
      return leads.filter((l) => !l.arkiverad);
  }
}

function sok(leads: Lead[], q: string) {
  const s = q.toLowerCase();
  return leads.filter((l) =>
    [l.namn, l.telefon, l.epost, l.meddelande, l.adress, l.anteckning, l.taktyp].some((v) => v.toLowerCase().includes(s))
  );
}

function sortera(leads: Lead[], sort: Sort, orsaker: Map<string, Orsak[]>) {
  const lista = [...leads];
  if (sort === "prio") lista.sort((a, b) => prioritet(orsaker.get(a.id)) - prioritet(orsaker.get(b.id)) || b.tidpunkt.localeCompare(a.tidpunkt));
  if (sort === "aktivitet") lista.sort((a, b) => senasteAktivitet(b).localeCompare(senasteAktivitet(a)));
  if (sort === "varde") lista.sort((a, b) => varde(b) - varde(a));
  return lista;
}

export default async function Leads({ searchParams }: { searchParams: Promise<{ vy?: string; q?: string; sort?: string }> }) {
  await kravInloggning();
  const { vy: vyParam, q = "", sort: sortParam } = await searchParams;
  const vy: Vy = vyParam && vyParam in VYER ? (vyParam as Vy) : "alla";
  const sort: Sort = sortParam && sortParam in SORTERING ? (sortParam as Sort) : vy === "att-gora" ? "prio" : "nyast";

  let leads: Lead[];
  try {
    leads = await hamtaLeads();
  } catch (err) {
    return <ArkFel err={err} />;
  }

  const orsaker = attGora(leads);
  const antal = Object.fromEntries(Object.keys(VYER).map((v) => [v, urval(leads, v as Vy, orsaker).length]));
  const lista = sortera(q ? sok(urval(leads, vy, orsaker), q) : urval(leads, vy, orsaker), sort, orsaker);
  const lank = (p: Record<string, string>) => {
    const s = new URLSearchParams({ vy, ...(q ? { q } : {}), ...(sortParam ? { sort } : {}), ...p });
    return `/admin/leads?${s}`;
  };
  const dag = idag();

  return (
    <div>
      <Sidrubrik titel="Leads" under={`${leads.length} leads i arket${q ? ` · sökning: "${q}"` : ""}`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:rounded-xl sm:bg-slate-100 sm:p-1">
          {(Object.keys(VYER) as Vy[]).map((v) => (
            <Link
              key={v}
              href={`/admin/leads?vy=${v}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                v === vy ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {VYER[v]}
              <span className={`rounded-md px-1.5 text-xs ${v === "att-gora" && antal[v] ? "bg-accent text-white" : "bg-slate-200/70 text-slate-600"}`}>
                {antal[v]}
              </span>
            </Link>
          ))}
        </div>
        <div className="flex min-w-0 items-center gap-2 text-sm xl:ml-auto">
          <span className="text-slate-500">Sortera</span>
          <div className="flex gap-1 overflow-x-auto">
            {(Object.keys(SORTERING) as Sort[]).map((s) => (
              <Link
                key={s}
                href={lank({ sort: s })}
                className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${s === sort ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {SORTERING[s]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Kort className="overflow-visible">
        {lista.length === 0 ? (
          <Tom
            titel={vy === "att-gora" && !q ? "Inget att göra just nu" : "Inga leads här"}
            text={q ? "Prova en annan sökning." : undefined}
            lank={q ? { href: `/admin/leads?vy=${vy}`, text: "Rensa sökningen" } : undefined}
          />
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(200px,2fr)_150px_minmax(0,1.5fr)_100px_64px_168px] gap-4 border-b border-slate-100 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 xl:grid">
              <span>Kontakt</span>
              <span>Status</span>
              <span>Nästa steg</span>
              <span className="text-right">Värde</span>
              <span>Inkom</span>
              <span className="text-right">Åtgärder</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {lista.map((l) => {
                const o = orsaker.get(l.id) ?? [];
                const v = varde(l);
                return (
                  <li
                    key={l.id}
                    className="relative grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3 transition hover:bg-slate-50/70 xl:grid-cols-[minmax(200px,2fr)_150px_minmax(0,1.5fr)_100px_64px_168px]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar lead={l} />
                      <div className="min-w-0">
                        <Link href={`/admin/lead/${l.id}`} className="block truncate font-semibold text-slate-900 after:absolute after:inset-0">
                          {visningsnamn(l)}
                        </Link>
                        <p className="truncate text-xs text-slate-500">
                          {[l.telefon, l.taktyp, l.yta && `${l.yta} m²`, l.adress].filter(Boolean).join(" · ") || l.epost}
                        </p>
                      </div>
                    </div>
                    <div className="justify-self-end xl:justify-self-start">
                      <StatusMarke status={status(l)} />
                    </div>
                    <div className="col-span-2 min-w-0 xl:col-span-1">
                      {o.length ? (
                        <p className="truncate text-xs font-semibold text-accent">{o.map((x) => x.text).join(" · ")}</p>
                      ) : l.paminnelse ? (
                        <p className="flex items-center gap-1 text-xs text-violet-700">
                          <BellRing className="size-3.5" /> {l.paminnelse <= dag ? "I dag" : datum(l.paminnelse)}
                        </p>
                      ) : null}
                      <p className="truncate text-xs text-slate-500">{l.anteckning || l.meddelande}</p>
                    </div>
                    <span className="hidden text-right text-sm font-semibold tabular-nums text-slate-900 xl:block">{v ? kronor(v) : ""}</span>
                    <span className="hidden text-xs text-slate-500 xl:block" title={l.tidpunkt}>
                      {relativ(l.tidpunkt)}
                    </span>
                    <div className="relative z-10 col-span-2 flex items-center gap-1.5 xl:col-span-1 xl:justify-end">
                      <span className="mr-auto text-xs text-slate-400 xl:hidden">
                        {relativ(l.tidpunkt)}
                        {v ? ` · ${kronor(v)}` : ""}
                      </span>
                      {!l.arkiverad && <Snabbknappar id={l.id} arkiverad={l.arkiverad} kompakt />}
                      <PaminnelseVal id={l.id} paminnelse={l.paminnelse} kompakt />
                      <RingKnapp telefon={l.telefon} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Kort>
      <p className="mt-3 text-xs text-slate-400">
        Tips: tryck <kbd className="rounded border border-slate-200 bg-white px-1">/</kbd> för att söka.
      </p>
    </div>
  );
}
