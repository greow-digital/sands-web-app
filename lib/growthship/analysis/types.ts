import type { Category, Rating } from "../types";

/**
 * What a detector produces. runAnalysis.ts fills in id/status/timestamps
 * and persists it as a full Opportunity.
 */
export interface OpportunityDraft {
  title: string;
  description: string;
  category: Category;
  evidence: string;
  recommendation: string;
  impact: Rating;
  confidence: Rating;
  effort: Rating;
  source: string;
  /** Stable key so re-running analysis updates this opportunity, not duplicates it. */
  dedupeKey: string;
}
