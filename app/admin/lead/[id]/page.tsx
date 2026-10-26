import Link from "next/link";
import { notFound } from "next/navigation";
import { hamtaLead } from "@/lib/backoffice/ark";
import { FLODEN, redanSkickat } from "@/lib/backoffice/floden";
import { status, telHref } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import { kontaktperson, nap } from "@/lib/company";
import StatusMarke from "../../_delar/StatusMarke";
import LeadFormular from "../../_delar/LeadFormular";
import Snabbknappar from "../../_delar/Snabbknappar";
import UtskickKnapp from "../../_delar/UtskickKnapp";

export const dynamic = "force-dynamic";

function Rad({ etikett, children }: { etikett: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="py-1.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">{etikett}</dt>
      <dd className="whitespace-pre-line break-words text-sm">{children}</dd>
    </div>
  );
}

export default async function LeadSida({ params }: { params: Promise<{ id: string }> }) {
  await kravInloggning();
  const { id } = await params;
  const lead = await hamtaLead(id);
  if (!lead) notFound();

  return (
    <div className="space-y-5">
      <Link href="/admin" className="text-sm text-black/60 hover:text-dark">
        &larr; Alla leads
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold">{lead.namn || lead.epost || "Utan namn"}</h1>
        <StatusMarke status={status(lead)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <section className="space-y-5">
          <div className="rounded-xl bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {lead.telefon && (
                <a href={telHref(lead.telefon)} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
                  Ring {lead.telefon}
                </a>
              )}
              {lead.epost && (
                <a href={`mailto:${lead.epost}`} className="rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold">
                  Mejla
                </a>
              )}
            </div>
            <dl>
              <Rad etikett="Inkom">{lead.tidpunkt.slice(0, 16)}</Rad>
              <Rad etikett="E-post">{lead.epost}</Rad>
              <Rad etikett="Taktyp">{lead.taktyp}</Rad>
              <Rad etikett="Yta">{lead.yta}</Rad>
              <Rad etikett="Meddelande">{lead.meddelande}</Rad>
              <Rad etikett="Sida">{lead.kalla}</Rad>
              <Rad etikett="Kanal">{lead.kanal}</Rad>
              <Rad etikett="Google Ads">{lead.gclid ? "Ja, klick-id finns" : ""}</Rad>
            </dl>
            {lead.transkript && (
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer font-semibold">Transkript från röstagenten</summary>
                <p className="mt-2 whitespace-pre-line text-black/70">{lead.transkript}</p>
              </details>
            )}
          </div>

          <div className="rounded-xl bg-white p-4">
            <h2 className="mb-2 font-semibold">Snabbt</h2>
            <Snabbknappar id={lead.id} arkiverad={lead.arkiverad} />
          </div>

          <div className="rounded-xl bg-white p-4">
            <h2 className="mb-1 font-semibold">Mejla en uppföljning</h2>
            <p className="mb-3 text-xs text-black/55">
              {lead.epost ? `Går till ${lead.epost} i ${kontaktperson.fornamn}s namn. Svar landar i ${nap.email}.` : "Leaden saknar e-post."}
            </p>
            <ul className="space-y-2">
              {FLODEN.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="flex-1">
                    {f.namn}
                    {redanSkickat(lead, f) && <span className="ml-2 text-xs text-trust-green">skickat</span>}
                    {f.foreslas(lead) && <span className="ml-2 text-xs font-semibold text-accent">föreslås</span>}
                  </span>
                  <a
                    href={`/admin/forhandsvisning?lead=${lead.id}&flode=${f.id}`}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Förhandsgranska
                  </a>
                  {lead.epost && <UtskickKnapp id={lead.id} flode={f.id} namn={f.namn} epost={lead.epost} />}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-xl bg-white p-4">
            <LeadFormular lead={lead} />
          </div>
          <div className="rounded-xl bg-white p-4">
            <h2 className="mb-2 font-semibold">Historik</h2>
            {lead.logg.length ? (
              <ol className="space-y-2 text-sm">
                {[...lead.logg].reverse().map((r, i) => (
                  <li key={i}>
                    <span className="text-black/45">{r.tid}{r.vem && ` · ${r.vem}`}</span>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-black/55">Inget loggat än. Ändringar från backofficet hamnar här och i kolumnen Logg i arket.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
