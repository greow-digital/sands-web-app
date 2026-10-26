import Link from "next/link";
import { hamtaLeads } from "@/lib/backoffice/ark";
import { foreslagna, orörda, paminnelserIdag } from "@/lib/backoffice/floden";
import { idag, status, telHref, type Lead } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import StatusMarke from "./_delar/StatusMarke";

export const dynamic = "force-dynamic";

const VYER = {
  "att-gora": "Att göra",
  aktiva: "Pågående",
  vunna: "Accepterade",
  alla: "Alla",
  arkiv: "Arkiv",
} as const;

type Vy = keyof typeof VYER;

function urval(leads: Lead[], vy: Vy, orsaker: Map<string, string[]>) {
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

export default async function Leads({ searchParams }: { searchParams: Promise<{ vy?: string; q?: string }> }) {
  await kravInloggning();
  const { vy: vyParam, q = "" } = await searchParams;
  const vy: Vy = vyParam && vyParam in VYER ? (vyParam as Vy) : "att-gora";

  let leads: Lead[];
  try {
    leads = await hamtaLeads();
  } catch (err) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
        <p className="font-semibold">Kunde inte läsa arket.</p>
        <p className="mt-1 text-black/70">{err instanceof Error ? err.message : String(err)}</p>
      </div>
    );
  }

  // Varför en lead står i Att göra. Samma urval som i sammanfattningsmejlet.
  const orsaker = new Map<string, string[]>();
  const lagg = (l: Lead, orsak: string) => orsaker.set(l.id, [...(orsaker.get(l.id) ?? []), orsak]);
  paminnelserIdag(leads).forEach((l) => lagg(l, `Påminnelse ${l.paminnelse}`));
  orörda(leads).forEach((l) => lagg(l, "Ingen har rört den"));
  foreslagna(leads).forEach(({ lead, flode }) => lagg(lead, `Föreslaget mejl: ${flode.namn}`));
  // Nya från i dag hör också dit, de ska ringas samma dag.
  leads.filter((l) => status(l) === "ny" && l.tidpunkt.startsWith(idag())).forEach((l) => lagg(l, "Ny i dag"));

  const antal = Object.fromEntries(Object.keys(VYER).map((v) => [v, urval(leads, v as Vy, orsaker).length]));
  const lista = q ? sok(urval(leads, vy, orsaker), q) : urval(leads, vy, orsaker);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(Object.keys(VYER) as Vy[]).map((v) => (
          <Link
            key={v}
            href={`/admin?vy=${v}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-sm ${v === vy ? "bg-dark text-white" : "bg-white hover:bg-black/5"}`}
          >
            {VYER[v]} <span className="opacity-60">{antal[v]}</span>
          </Link>
        ))}
        <form className="ml-auto w-full sm:w-64">
          <input type="hidden" name="vy" value={vy} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Sök namn, telefon, adress..."
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm"
          />
        </form>
      </div>

      {lista.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-black/60">
          {vy === "att-gora" && !q ? "Inget att göra just nu." : "Inga leads här."}
        </p>
      ) : (
        <ul className="divide-y divide-black/5 overflow-hidden rounded-xl bg-white">
          {lista.map((l) => (
            <li key={l.id} className="relative flex flex-col gap-1 px-4 py-3 hover:bg-bg-light/60 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/lead/${l.id}`} className="font-semibold after:absolute after:inset-0">
                  {l.namn || l.epost || "Utan namn"}
                </Link>
                <p className="truncate text-sm text-black/60">
                  {[l.taktyp, l.yta && `${l.yta} m²`, l.meddelande || l.anteckning].filter(Boolean).join(" · ")}
                </p>
                {orsaker.get(l.id)?.length ? (
                  <p className="mt-0.5 text-xs font-medium text-accent">{orsaker.get(l.id)!.join(" · ")}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3 text-sm">
                {l.telefon && (
                  <a href={telHref(l.telefon)} className="relative z-10 text-primary hover:underline">
                    {l.telefon}
                  </a>
                )}
                <span className="text-black/50">{l.tidpunkt.slice(0, 10)}</span>
                <StatusMarke status={status(l)} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-black/40">{leads.length} leads i arket.</p>
    </div>
  );
}
