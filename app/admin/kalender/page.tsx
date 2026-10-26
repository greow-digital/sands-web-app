import Link from "next/link";
import { CalendarCheck, ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { allaHandelser, kalenderInstalld, stockholm, type Handelse } from "@/lib/backoffice/kalender";
import { idag, stockholmTid } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import { Kort, Sidrubrik, Tom } from "../_delar/Ui";

export const dynamic = "force-dynamic";

/* Hela kalendern, en vecka i taget. Takkontroller från backofficet länkar till leaden. */

const FORSTA = 7;
const SISTA = 19; // rutnätet slutar 19:00
const PX_TIMME = 52;

const VECKODAG = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const MANAD = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

const plusDagar = (dag: string, n: number) => new Date(Date.parse(dag + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);

function mandag(dag: string): string {
  const vd = (new Date(dag + "T12:00:00Z").getUTCDay() + 6) % 7;
  return plusDagar(dag, -vd);
}

/** ISO-veckonummer. */
function veckonummer(dag: string): number {
  const d = new Date(dag + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const forsta = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((d.getTime() - forsta.getTime()) / 864e5 - 3 + ((forsta.getUTCDay() + 6) % 7)) / 7);
}

const kortDatum = (dag: string) => `${Number(dag.slice(8, 10))} ${MANAD[Number(dag.slice(5, 7)) - 1]}`;

/** Väggtid i Stockholm: dag och minuter från midnatt. */
function vagg(iso: string) {
  const t = stockholmTid(new Date(iso));
  return { dag: t.slice(0, 10), min: Number(t.slice(11, 13)) * 60 + Number(t.slice(14, 16)), tid: t.slice(11, 16) };
}

type Placerad = { h: Handelse; topp: number; hojd: number; spar: number; sparAv: number; tid: string };

/** Lägger dagens händelser i spår så att de som krockar står bredvid varandra. */
function placera(handelser: Handelse[], dag: string): Placerad[] {
  const lista = handelser
    .map((h) => {
      const s = vagg(h.start);
      const e = vagg(h.slut);
      const fran = s.dag < dag ? 0 : s.min;
      const till = e.dag > dag ? 24 * 60 : e.min;
      return { h, fran, till: Math.max(till, fran + 15), tid: s.dag === dag ? `${s.tid} till ${e.dag === dag ? e.tid : "senare"}` : `till ${e.tid}` };
    })
    .sort((a, b) => a.fran - b.fran || b.till - a.till);

  const ut: Placerad[] = [];
  let grupp: (typeof lista[number] & { spar: number })[] = [];
  let gruppSlut = -1;
  const stang = () => {
    const n = Math.max(1, ...grupp.map((g) => g.spar + 1));
    for (const g of grupp) {
      const fran = Math.max(g.fran, FORSTA * 60);
      const till = Math.min(Math.max(g.till, fran + 15), SISTA * 60);
      ut.push({ h: g.h, topp: ((fran - FORSTA * 60) / 60) * PX_TIMME, hojd: Math.max(18, ((till - fran) / 60) * PX_TIMME - 2), spar: g.spar, sparAv: n, tid: g.tid });
    }
    grupp = [];
  };
  for (const x of lista) {
    if (x.fran >= gruppSlut) stang();
    const upptagna = grupp.filter((g) => g.till > x.fran).map((g) => g.spar);
    let spar = 0;
    while (upptagna.includes(spar)) spar++;
    grupp.push({ ...x, spar });
    gruppSlut = Math.max(gruppSlut, x.till);
  }
  stang();
  return ut;
}

function veckan(vecka?: string) {
  const nu = new Date();
  const start = mandag(vecka && /^\d{4}-\d{2}-\d{2}$/.test(vecka) ? vecka : idag(nu));
  const dagar = Array.from({ length: 7 }, (_, i) => plusDagar(start, i));
  const t = vagg(nu.toISOString());
  return { start, dagar, idag: t.dag, nuMin: t.min, fran: stockholm(start, 0), till: stockholm(plusDagar(start, 7), 0) };
}

function HandelseKort({ h, tid, kompakt }: { h: Handelse; tid?: string; kompakt?: boolean }) {
  const takkontroll = Boolean(h.leadId);
  const innehall = (
    <>
      <span className={`block truncate font-semibold ${kompakt ? "" : "text-sm"}`}>{h.titel}</span>
      {tid && <span className="block truncate opacity-80">{tid}</span>}
    </>
  );
  const klass = `block h-full overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-[11px] leading-tight ${
    takkontroll ? "border-indigo-500 bg-indigo-50 text-indigo-800 hover:bg-indigo-100" : "border-slate-400 bg-slate-100 text-slate-700 hover:bg-slate-200"
  }`;
  if (h.leadId) return <Link href={`/admin/lead/${h.leadId}`} className={klass} title={h.titel}>{innehall}</Link>;
  if (h.lank) return <a href={h.lank} target="_blank" rel="noreferrer" className={klass} title={h.titel}>{innehall}</a>;
  return <span className={klass} title={h.titel}>{innehall}</span>;
}

export default async function KalenderSida({ searchParams }: { searchParams: Promise<{ vecka?: string }> }) {
  await kravInloggning();
  const v = veckan((await searchParams).vecka);

  let handelser: Handelse[] = [];
  let fel = "";
  if (kalenderInstalld()) {
    try {
      handelser = await allaHandelser(v.fran, v.till);
    } catch (err) {
      fel = err instanceof Error ? err.message : String(err);
    }
  }

  const heldag = handelser.filter((h) => h.heldag);
  const tidsatta = handelser.filter((h) => !h.heldag);
  const perDag = v.dagar.map((dag) => ({
    dag,
    heldag: heldag.filter((h) => h.start <= dag && h.slut > dag),
    // Händelser som rör dagen, även de som började dagen innan.
    tidsatta: tidsatta.filter((h) => vagg(h.start).dag <= dag && vagg(h.slut).dag >= dag && !(vagg(h.slut).dag === dag && vagg(h.slut).min === 0)),
  }));
  const antalTakkontroller = tidsatta.filter((h) => h.leadId).length;
  const timmar = Array.from({ length: SISTA - FORSTA }, (_, i) => FORSTA + i);
  const knapp = "grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50";

  return (
    <div>
      <Sidrubrik
        titel="Kalender"
        under={
          <>
            Vecka {veckonummer(v.start)} · {kortDatum(v.dagar[0])} till {kortDatum(v.dagar[6])}
            {antalTakkontroller > 0 && ` · ${antalTakkontroller} ${antalTakkontroller === 1 ? "takkontroll" : "takkontroller"}`}
          </>
        }
        hoger={
          <div className="flex items-center gap-2">
            <Link href={`/admin/kalender?vecka=${plusDagar(v.start, -7)}`} className={knapp} title="Förra veckan">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href="/admin/kalender" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              I dag
            </Link>
            <Link href={`/admin/kalender?vecka=${plusDagar(v.start, 7)}`} className={knapp} title="Nästa vecka">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        }
      />

      {!kalenderInstalld() ? (
        <Kort>
          <Tom titel="Kalendern är inte inställd" text="Sätt GOOGLE_CALENDAR_* enligt docs/GOOGLE_KALENDER.md." />
        </Kort>
      ) : (
        <>
          {fel && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Kalendern gick inte att läsa: {fel}</p>}

          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-indigo-500" /> Takkontroll, klicka för leaden
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-slate-400" /> Övrigt i kalendern
            </span>
          </div>

          {/* Veckovy, dator */}
          <Kort className="hidden overflow-hidden md:block">
            <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] border-b border-slate-100">
              <div />
              {perDag.map(({ dag, heldag: hd }, i) => (
                <div key={dag} className={`border-l border-slate-100 px-1.5 pb-1.5 pt-2 ${i >= 5 ? "bg-slate-50/70" : ""}`}>
                  <p className={`text-center text-xs font-medium ${dag === v.idag ? "text-primary" : "text-slate-500"}`}>
                    {VECKODAG[i]}{" "}
                    <span className={`inline-grid min-w-6 place-items-center rounded-full px-1 text-sm font-bold ${dag === v.idag ? "bg-primary text-white" : "text-slate-900"}`}>
                      {Number(dag.slice(8, 10))}
                    </span>
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {hd.map((h) => (
                      <div key={h.id} className="h-6">
                        <HandelseKort h={h} kompakt />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="relative grid grid-cols-[52px_repeat(7,minmax(0,1fr))]" style={{ height: (SISTA - FORSTA) * PX_TIMME }}>
                <div className="relative">
                  {timmar.map((t) => (
                    <span key={t} className="absolute right-2 -translate-y-1/2 text-[10px] tabular-nums text-slate-400" style={{ top: (t - FORSTA) * PX_TIMME }}>
                      {t > FORSTA && `${String(t).padStart(2, "0")}:00`}
                    </span>
                  ))}
                </div>
                {perDag.map(({ dag, tidsatta: lista }, i) => (
                  <div key={dag} className={`relative border-l border-slate-100 ${i >= 5 ? "bg-slate-50/70" : ""}`}>
                    {timmar.map((t) => (
                      <div key={t} className="absolute inset-x-0 border-t border-slate-100" style={{ top: (t - FORSTA) * PX_TIMME }} />
                    ))}
                    {dag === v.idag && v.nuMin >= FORSTA * 60 && v.nuMin <= SISTA * 60 && (
                      <div className="absolute inset-x-0 z-10 border-t-2 border-accent" style={{ top: ((v.nuMin - FORSTA * 60) / 60) * PX_TIMME }}>
                        <span className="absolute -left-1 -top-[5px] size-2 rounded-full bg-accent" />
                      </div>
                    )}
                    {placera(lista, dag).map((p) => (
                      <div
                        key={p.h.id}
                        className="absolute px-0.5"
                        style={{ top: p.topp, height: p.hojd, left: `${(100 * p.spar) / p.sparAv}%`, width: `${100 / p.sparAv}%` }}
                      >
                        <HandelseKort h={p.h} tid={p.tid} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Kort>

          {/* Dagslista, mobil */}
          <div className="space-y-3 md:hidden">
            {perDag.map(({ dag, heldag: hd, tidsatta: lista }, i) => (
              <Kort key={dag}>
                <p className={`border-b border-slate-100 px-4 py-2.5 text-sm font-semibold ${dag === v.idag ? "text-primary" : "text-slate-900"}`}>
                  {VECKODAG[i]} {kortDatum(dag)}
                  {dag === v.idag && " · i dag"}
                </p>
                {hd.length + lista.length ? (
                  <ul className="divide-y divide-slate-100">
                    {[...hd, ...lista.sort((a, b) => a.start.localeCompare(b.start))].map((h) => {
                      const inner = (
                        <>
                          <span className="w-12 shrink-0 text-xs font-semibold tabular-nums text-slate-500">{h.heldag ? "Heldag" : vagg(h.start).tid}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-900">{h.titel}</span>
                            {h.plats && (
                              <span className="flex items-center gap-1 truncate text-xs text-slate-500">
                                <MapPin className="size-3 shrink-0" /> {h.plats}
                              </span>
                            )}
                          </span>
                          {h.leadId ? <CalendarCheck className="size-4 shrink-0 text-indigo-500" /> : h.lank && <ExternalLink className="size-3.5 shrink-0 text-slate-400" />}
                        </>
                      );
                      const cls = `flex items-center gap-3 border-l-[3px] px-4 py-2.5 ${h.leadId ? "border-indigo-500" : "border-transparent"}`;
                      return (
                        <li key={h.id}>
                          {h.leadId ? (
                            <Link href={`/admin/lead/${h.leadId}`} className={`${cls} hover:bg-slate-50`}>{inner}</Link>
                          ) : h.lank ? (
                            <a href={h.lank} target="_blank" rel="noreferrer" className={`${cls} hover:bg-slate-50`}>{inner}</a>
                          ) : (
                            <div className={cls}>{inner}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-400">Inget inbokat</p>
                )}
              </Kort>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
