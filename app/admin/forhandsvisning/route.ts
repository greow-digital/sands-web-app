import { hamtaLead } from "@/lib/backoffice/ark";
import { flode } from "@/lib/backoffice/floden";
import { inloggad } from "@/lib/backoffice/session";
import { renderaUtskick } from "@/lib/backoffice/utskick";

export const runtime = "nodejs";

/** Mejlet exakt som kunden får det, för förhandsgranskning i en ny flik. */
export async function GET(req: Request) {
  if (!(await inloggad())) return new Response("Obehörig", { status: 401 });
  const url = new URL(req.url);
  const f = flode(url.searchParams.get("flode") ?? "");
  const lead = await hamtaLead(url.searchParams.get("lead") ?? "");
  if (!f || !lead) return new Response("Hittades inte", { status: 404 });

  const html = await renderaUtskick(lead, f);
  const rubrik = `<div style="font:14px sans-serif;padding:12px 16px;background:#060607;color:#fff">Till: ${esc(lead.epost || "(saknar e-post)")} &middot; Ämne: ${esc(f.amne)}</div>`;
  return new Response(rubrik + html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
