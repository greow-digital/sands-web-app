import { redirect } from "next/navigation";
import { inloggad, saknarAnvandare } from "@/lib/backoffice/session";
import Inloggning from "../_delar/Inloggning";

export default async function LoggaIn() {
  if (await inloggad()) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm px-4 pt-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5">
      <span className="grid size-10 place-items-center rounded-xl bg-slate-900 font-heading font-extrabold text-white">S</span>
      <h1 className="mt-4 font-heading text-xl font-bold">Sands säljstöd</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Leads, pipeline, påminnelser och uppföljningar.</p>
      {saknarAnvandare() && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Ingen användare är inställd. Lägg in BACKOFFICE_ANVANDARE som Namn:lösenord (minst 8 tecken) och redeploya.
        </p>
      )}
      <Inloggning />
      </div>
    </div>
  );
}
