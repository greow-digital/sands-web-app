// Core domain types for Growthship. Kept separate from the Cogny-shaped
// types in lib/growthship/cogny/types.ts: this file is what gets persisted
// and rendered, that file is what Cogny returns.

export type Category =
  | "Acquisition"
  | "SEO"
  | "Paid"
  | "Conversion"
  | "Content"
  | "Lifecycle"
  | "Revenue"
  | "Retention"
  | "Technical";

export type Rating = "High" | "Medium" | "Low";

export type OpportunityStatus =
  | "New"
  | "Reviewing"
  | "Accepted"
  | "Dismissed"
  | "Shipped";

export type LaunchpadStatus =
  | "Backlog"
  | "Planned"
  | "In progress"
  | "Shipped"
  | "Completed";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: Category;
  evidence: string;
  recommendation: string;
  impact: Rating;
  confidence: Rating;
  effort: Rating;
  score: number;
  status: OpportunityStatus;
  source: string;
  detectedAt: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Detector id + a stable key derived from the evidence, so re-running
   * analysis updates an existing opportunity instead of duplicating it.
   */
  dedupeKey: string;
}

export interface LaunchpadItem {
  id: string;
  opportunityId: string | null;
  title: string;
  hypothesis: string;
  expectedImpact: Rating;
  effort: Rating;
  status: LaunchpadStatus;
  result: string | null;
  learning: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRun {
  id: string;
  type: string;
  startedAt: string;
  completedAt: string | null;
  summary: string;
  numberOfOpportunitiesGenerated: number;
  numberOfOpportunitiesUpdated: number;
}
