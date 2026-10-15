import { NextResponse } from "next/server";
import { getLatestBundle, listOpportunities } from "@/lib/growthship/store/db";
import { answerQuestion } from "@/lib/growthship/analysis/ask";

export async function POST(req: Request) {
  const { question } = (await req.json().catch(() => ({}))) as { question?: string };
  if (!question?.trim()) {
    return NextResponse.json({ error: "question krävs" }, { status: 400 });
  }

  const [bundle, opportunities] = await Promise.all([getLatestBundle(), listOpportunities()]);
  const answer = answerQuestion(question, bundle, opportunities);
  return NextResponse.json({ answer });
}
