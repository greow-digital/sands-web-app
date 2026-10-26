import { redirect } from "next/navigation";
import { inloggad } from "@/lib/backoffice/session";
import Inloggning from "../_delar/Inloggning";

export default async function LoggaIn() {
  if (await inloggad()) redirect("/admin");
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-xl font-bold">Sands backoffice</h1>
      <p className="mt-1 mb-5 text-sm text-black/60">Leads, påminnelser och uppföljningar.</p>
      <Inloggning />
    </div>
  );
}
