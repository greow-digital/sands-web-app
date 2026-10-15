import { NextResponse } from "next/server";
import { listOpportunities, updateOpportunityStatus } from "@/lib/growthship/store/db";
import type { OpportunityStatus } from "@/lib/growthship/types";

const VALID_STATUSES: OpportunityStatus[] = [
  "New",
  "Reviewing",
  "Accepted",
  "Dismissed",
  "Shipped",
];

export async function GET() {
  const opportunities = await listOpportunities();
  return NextResponse.json({ opportunities });
}

export async function PATCH(req: Request) {
  const { id, status } = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
  };
  if (!id || !status || !VALID_STATUSES.includes(status as OpportunityStatus)) {
    return NextResponse.json({ error: "id och en giltig status krävs" }, { status: 400 });
  }
  const updated = await updateOpportunityStatus(id, status as OpportunityStatus);
  if (!updated) return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
  return NextResponse.json({ opportunity: updated });
}
