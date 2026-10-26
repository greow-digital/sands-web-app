import { NextResponse } from "next/server";
import { korDagligt } from "@/lib/backoffice/dagligt";

// Resend och @react-email/render kräver Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backofficets dagliga jobb, schemalagt i vercel.json. Vercel Cron skickar
 * CRON_SECRET som Bearer-token. Utan hemligheten körs ingenting.
 */
export async function GET(req: Request) {
  const hemlighet = process.env.CRON_SECRET;
  if (!hemlighet || req.headers.get("authorization") !== `Bearer ${hemlighet}`) {
    return NextResponse.json({ error: "Obehörig" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await korDagligt()) });
  } catch (err) {
    console.error("Backofficets dagliga jobb misslyckades:", err);
    return NextResponse.json({ error: "Jobbet misslyckades" }, { status: 500 });
  }
}
