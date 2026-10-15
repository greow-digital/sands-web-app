import { NextResponse } from "next/server";
import { listAnalysisRuns } from "@/lib/growthship/store/db";
import { runAnalysis } from "@/lib/growthship/analysis/runAnalysis";
import type { CognyBundle } from "@/lib/growthship/cogny/types";

export async function GET() {
  const runs = await listAnalysisRuns();
  return NextResponse.json({ runs });
}

/**
 * The Engine Room's "Run analysis" button hits this. Today the server has
 * no direct Cogny credential (see lib/growthship/cogny/README.md), so a
 * request with no bundle attached is reported honestly instead of faking
 * a run. Once a bundle is passed (by a future live client), it is reasoned
 * over exactly like the manual seed script.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { bundle?: CognyBundle } | null;

  if (!body?.bundle) {
    return NextResponse.json(
      {
        error: "cogny_not_connected",
        message:
          "Cogny är inte kopplad till servern ännu. Be Claude köra analysen manuellt (npm run growthship:seed), eller koppla en Cogny-nyckel när den finns.",
      },
      { status: 501 }
    );
  }

  const run = await runAnalysis(body.bundle);
  return NextResponse.json({ run }, { status: 201 });
}
