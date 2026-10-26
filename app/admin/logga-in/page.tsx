import { redirect } from "next/navigation";
import { inloggad, saknarAnvandare } from "@/lib/backoffice/session";
import Inloggning from "../_delar/Inloggning";

export default async function LoggaIn() {
  if (await inloggad()) redirect("/admin");
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-xl font-bold">Sands backoffice</h1>
      <p className="mt-1 mb-5 text-sm text-black/60">Leads, påminnelser och uppföljningar.</p>
      {saknarAnvandare() && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Ingen användare är inställd. Lägg in BACKOFFICE_ANVANDARE som Namn:lösenord (minst 8 tecken) och redeploya.
        </p>
      )}
      <Inloggning />
    </div>
  );
}
