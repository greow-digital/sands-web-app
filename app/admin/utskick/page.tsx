import Link from "next/link";
import { hamtaLeads } from "@/lib/backoffice/ark";
import { FLODEN, autoutskick, foreslagna } from "@/lib/backoffice/floden";
import { kravInloggning } from "@/lib/backoffice/session";
import UtskickKnapp from "../_delar/UtskickKnapp";
import KorDagligt from "../_delar/KorDagligt";

export const dynamic = "force-dynamic";

export default async function Utskick() {
  await kravInloggning();
  const forslag = foreslagna(await hamtaLeads());
  const auto = autoutskick();
  const sammanfattningTill = process.env.BACKOFFICE_SAMMANFATTNING_TILL;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Utskick</h1>

      <div className="rounded-xl bg-white p-4 text-sm">
        <p>
          <strong>Automatiska uppföljningar:</strong>{" "}
          {auto ? "på. Det dagliga jobbet skickar föreslagna mejl själv." : "av. Föreslagna mejl väntar på ett klick här eller i leadvyn."}
        </p>
        <p className="mt-1">
          <strong>Daglig sammanfattning:</strong> {sammanfattningTill ? `till ${sammanfattningTill}, varje morgon.` : "inte inställd."}
        </p>
        <div className="mt-3">
          <KorDagligt auto={auto} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-4">
        <h2 className="mb-3 font-semibold">Föreslagna just nu ({forslag.length})</h2>
        {forslag.length ? (
          <ul className="divide-y divide-black/5">
            {forslag.map(({ lead, flode }) => (
              <li key={lead.id + flode.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                <Link href={`/admin/lead/${lead.id}`} className="flex-1 font-semibold hover:text-primary">
                  {lead.namn || lead.epost}
                </Link>
                <span className="text-black/60">{flode.namn}</span>
                <a href={`/admin/forhandsvisning?lead=${lead.id}&flode=${flode.id}`} target="_blank" className="text-primary hover:underline">
                  Förhandsgranska
                </a>
                <UtskickKnapp id={lead.id} flode={flode.id} namn={flode.namn} epost={lead.epost} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-black/55">Inga uppföljningar att skicka i dag.</p>
        )}
      </div>

      <div className="rounded-xl bg-white p-4">
        <h2 className="mb-3 font-semibold">Flöden</h2>
        <ul className="space-y-4 text-sm">
          {FLODEN.map((f) => (
            <li key={f.id}>
              <p className="font-semibold">{f.namn}</p>
              <p className="text-black/65">{f.regel}</p>
              <p className="text-black/65">Ämnesrad: &quot;{f.amne}&quot;</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-black/45">
          Varje flöde skickas högst en gång per lead. Dagar räknas från loggen, så kryssa i stegen här i backofficet för att flödena ska se dem.
        </p>
      </div>
    </div>
  );
}
