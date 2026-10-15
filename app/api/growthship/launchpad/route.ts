import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createLaunchpadItem,
  getOpportunity,
  listLaunchpadItems,
  updateLaunchpadItem,
  updateOpportunityStatus,
} from "@/lib/growthship/store/db";
import type { LaunchpadItem, LaunchpadStatus } from "@/lib/growthship/types";

const VALID_STATUSES: LaunchpadStatus[] = [
  "Backlog",
  "Planned",
  "In progress",
  "Shipped",
  "Completed",
];

export async function GET() {
  const items = await listLaunchpadItems();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    opportunityId?: string;
    title?: string;
    hypothesis?: string;
  };

  if (!body.title || !body.hypothesis) {
    return NextResponse.json({ error: "title och hypothesis krävs" }, { status: 400 });
  }

  let expectedImpact: LaunchpadItem["expectedImpact"] = "Medium";
  let effort: LaunchpadItem["effort"] = "Medium";
  if (body.opportunityId) {
    const opp = await getOpportunity(body.opportunityId);
    if (opp) {
      expectedImpact = opp.impact;
      effort = opp.effort;
      await updateOpportunityStatus(opp.id, "Accepted");
    }
  }

  const now = new Date().toISOString();
  const item: LaunchpadItem = {
    id: randomUUID(),
    opportunityId: body.opportunityId ?? null,
    title: body.title,
    hypothesis: body.hypothesis,
    expectedImpact,
    effort,
    status: "Backlog",
    result: null,
    learning: null,
    createdAt: now,
    updatedAt: now,
  };

  const created = await createLaunchpadItem(item);
  return NextResponse.json({ item: created }, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
    result?: string;
    learning?: string;
  };
  if (!body.id) return NextResponse.json({ error: "id krävs" }, { status: 400 });
  if (body.status && !VALID_STATUSES.includes(body.status as LaunchpadStatus)) {
    return NextResponse.json({ error: "ogiltig status" }, { status: 400 });
  }

  const updated = await updateLaunchpadItem(body.id, {
    ...(body.status ? { status: body.status as LaunchpadStatus } : {}),
    ...(body.result !== undefined ? { result: body.result } : {}),
    ...(body.learning !== undefined ? { learning: body.learning } : {}),
  });
  if (!updated) return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
  return NextResponse.json({ item: updated });
}
