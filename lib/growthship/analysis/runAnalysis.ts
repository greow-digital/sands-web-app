import { randomUUID } from "crypto";
import type { CognyBundle } from "../cogny/types";
import type { AnalysisRun, Opportunity } from "../types";
import {
  recordAnalysisRun,
  setLatestBundle,
  upsertOpportunities,
} from "../store/db";
import { runDetectors } from "./detectors";
import { priorityScore } from "./score";

/**
 * Retrieval -> reasoning -> structured insight -> opportunity generation,
 * kept separate: `bundle` is already-retrieved, typed Cogny data (see
 * lib/growthship/cogny/README.md for how it gets produced); this function
 * only reasons over it and writes the result.
 */
export async function runAnalysis(
  bundle: CognyBundle,
  type: string = "Weekly Growth Analysis"
): Promise<AnalysisRun> {
  const startedAt = new Date().toISOString();
  const drafts = runDetectors(bundle);
  const now = new Date().toISOString();

  const opportunities: Opportunity[] = drafts.map((draft) => ({
    ...draft,
    id: randomUUID(),
    status: "New",
    detectedAt: now,
    createdAt: now,
    updatedAt: now,
    score: priorityScore(draft.impact, draft.confidence, draft.effort),
  }));

  const { created, updated } = await upsertOpportunities(opportunities);
  await setLatestBundle(bundle);

  const run: AnalysisRun = {
    id: randomUUID(),
    type,
    startedAt,
    completedAt: new Date().toISOString(),
    summary:
      opportunities.length === 0
        ? "Inga nya mönster hittades i den här körningen."
        : `${created} nya möjligheter, ${updated} uppdaterade, av ${opportunities.length} signaler totalt.`,
    numberOfOpportunitiesGenerated: created,
    numberOfOpportunitiesUpdated: updated,
  };

  await recordAnalysisRun(run);
  return run;
}
