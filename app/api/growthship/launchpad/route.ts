import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createLaunchpadItem,
  getOpportunity,
  getLaunchpadItem,
  listLaunchpadItems,
  updateLaunchpadItem,
  updateOpportunityStatus,
} from "@/lib/growthship/store/db";
import {
  LAUNCHPAD_STATUSES,
  type LaunchpadItem,
  type LaunchpadStatus,
} from "@/lib/growthship/types";

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
    brief: null,
    implementation: null,
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
    brief?: string;
    result?: string;
    learning?: string;
  };
  if (!body.id) return NextResponse.json({ error: "id krävs" }, { status: 400 });
  if (body.status && !(LAUNCHPAD_STATUSES as readonly string[]).includes(body.status)) {
    return NextResponse.json({ error: "ogiltig status" }, { status: 400 });
  }

  // The brief is what a coding agent would execute, so nothing leaves
  // Backlog without one. Checked against the brief in this same request
  // too, so the board can save a brief and move the card in one call.
  if (body.status && body.status !== "Backlog") {
    const existing = await getLaunchpadItem(body.id);
    if (!existing) return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
    const brief = body.brief ?? existing.brief;
    if (existing.status === "Backlog" && !brief?.trim()) {
      return NextResponse.json(
        { error: "Skriv en brief innan kortet lämnar Backlog." },
        { status: 422 }
      );
    }
  }

  const updated = await updateLaunchpadItem(body.id, {
    ...(body.status ? { status: body.status as LaunchpadStatus } : {}),
    ...(body.brief !== undefined ? { brief: body.brief } : {}),
    ...(body.result !== undefined ? { result: body.result } : {}),
    ...(body.learning !== undefined ? { learning: body.learning } : {}),
  });
  if (!updated) return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
  return NextResponse.json({ item: updated });
}
