import type { Metadata } from "next";
import { inloggad } from "@/lib/backoffice/session";
import { demolage, hamtaLeads } from "@/lib/backoffice/ark";
import { attGora } from "@/lib/backoffice/crm";
import { foreslagna } from "@/lib/backoffice/floden";
import Skal from "./_delar/Skal";

export const metadata: Metadata = {
  title: "Backoffice | Sands",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const namn = await inloggad();
  if (!namn) return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;

  // Siffrorna i menyn. Går arket inte att läsa visar sidan själv felet.
  const antal = await hamtaLeads()
    .then((leads) => ({ attGora: attGora(leads).size, utskick: foreslagna(leads).length }))
    .catch(() => ({ attGora: 0, utskick: 0 }));

  return (
    <Skal namn={namn} demo={demolage()} antal={antal}>
      {children}
    </Skal>
  );
}
