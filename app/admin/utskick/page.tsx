import Link from "next/link";
import { hamtaLeads } from "@/lib/backoffice/ark";
import { FLODEN, autoutskick, foreslagna } from "@/lib/backoffice/floden";
import { kravInloggning } from "@/lib/backoffice/session";
import { Eye } from "lucide-react";
import UtskickKnapp from "../_delar/UtskickKnapp";
import KorDagligt from "../_delar/KorDagligt";
import { Kort, KortRubrik, Sidrubrik, Tom } from "../_delar/Ui";

export const dynamic = "force-dynamic";

export default async function Utskick() {
  await kravInloggning();
  const forslag = foreslagna(await hamtaLeads());
  const auto = autoutskick();
  const sammanfattningTill = process.env.BACKOFFICE_SAMMANFATTNING_TILL;

  return (
    <div className="space-y-6">
      <Sidrubrik titel="Utskick" under="Uppföljningsmejl och den dagliga sammanfattningen." />

      <Kort className="p-5 text-sm">
        <p>
          <strong>Automatiska uppföljningar:</strong>{" "}
          {auto ? "på. Det dagliga jobbet skickar föreslagna mejl själv." : "av. Föreslagna mejl väntar på ett klick här eller i leadvyn."}
        </p>
        <p className="mt-1">
          <strong>Daglig sammanfattning:</strong> {sammanfattningTill ? `till ${sammanfattningTill}, varje morgon.` : "inte inställd."}
        </p>
        <div className="mt-4">
          <KorDagligt auto={auto} />
        </div>
      </Kort>

      <Kort>
        <KortRubrik titel={`Föreslagna just nu (${forslag.length})`} />
        {forslag.length ? (
          <ul className="divide-y divide-slate-100">
            {forslag.map(({ lead, flode }) => (
              <li key={lead.id + flode.id} className="flex flex-wrap items-center gap-2 px-5 py-3 text-sm">
                <Link href={`/admin/lead/${lead.id}`} className="flex-1 font-semibold hover:text-primary">
                  {lead.namn || lead.epost}
                </Link>
                <span className="text-slate-500">{flode.namn}</span>
                <a
                  href={`/admin/forhandsvisning?lead=${lead.id}&flode=${flode.id}`}
                  target="_blank"
                  title="Förhandsgranska"
                  className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Eye className="size-4" />
                </a>
                <UtskickKnapp id={lead.id} flode={flode.id} namn={flode.namn} epost={lead.epost} />
              </li>
            ))}
          </ul>
        ) : (
          <Tom titel="Inga uppföljningar att skicka i dag" />
        )}
      </Kort>

      <Kort>
        <KortRubrik titel="Flöden" under="Varje flöde skickas högst en gång per lead. Dagar räknas från loggen, så flytta stegen här i backofficet för att flödena ska se dem." />
        <ul className="divide-y divide-slate-100 text-sm">
          {FLODEN.map((f) => (
            <li key={f.id} className="px-5 py-4">
              <p className="font-semibold">{f.namn}</p>
              <p className="mt-1 text-slate-600">{f.regel}</p>
              <p className="mt-1 text-slate-500">Ämnesrad: &quot;{f.amne}&quot;</p>
            </li>
          ))}
        </ul>
      </Kort>
    </div>
  );
}
