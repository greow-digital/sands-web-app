import { hamtaLeads } from "@/lib/backoffice/ark";
import { attGora, relativ, varde, visningsnamn, type Steg } from "@/lib/backoffice/crm";
import { kommandeSakert, moteText, nastaPerLead } from "@/lib/backoffice/kalender";
import { dagarSedan, status, type Lead } from "@/lib/backoffice/lead";
import { kravInloggning } from "@/lib/backoffice/session";
import Pipeline, { type PipelineKort } from "../_delar/Pipeline";
import { ArkFel, Sidrubrik } from "../_delar/Ui";

export const dynamic = "force-dynamic";

export default async function PipelineSida() {
  await kravInloggning();
  let leads: Lead[];
  try {
    leads = await hamtaLeads();
  } catch (err) {
    return <ArkFel err={err} />;
  }

  const orsaker = attGora(leads);
  const moten = nastaPerLead((await kommandeSakert()).moten);
  const kort: PipelineKort[] = leads
    .filter((l) => !l.arkiverad)
    // Avslutade och nekade äldre än 60 dagar är historik och tar bara plats.
    .filter((l) => !["avslutad", "forlorad"].includes(status(l)) || dagarSedan(l.tidpunkt) <= 60)
    .map((l) => ({
      id: l.id,
      namn: visningsnamn(l),
      steg: status(l) as Steg,
      varde: varde(l),
      inkom: relativ(l.tidpunkt),
      detalj: [l.taktyp, l.yta && `${l.yta} m²`, l.adress].filter(Boolean).join(" · "),
      telefon: l.telefon,
      paminnelse: l.paminnelse,
      flagga: orsaker.get(l.id)?.[0]?.text ?? "",
      mote: moten.has(l.id) ? moteText(moten.get(l.id)!) : "",
    }));

  return (
    <div>
      <Sidrubrik titel="Pipeline" under="Dra ett kort till nästa steg. Kryssrutorna i arket uppdateras och steget loggas." />
      <Pipeline kort={kort} />
    </div>
  );
}
