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

/**
 * Kanban columns, in board order. The middle of the board is shaped for a
 * future automation (see docs/GROWTHSHIP.md, "Launchpad till Claude Code"):
 * an item in "Ready" has a brief a coding agent can execute, "Building"
 * means an agent is working on a branch, "Review" means a PR or preview
 * waits for a human, and "Shipped" means merged to main.
 */
export const LAUNCHPAD_STATUSES = [
  "Backlog",
  "Ready",
  "Building",
  "Review",
  "Shipped",
  "Measured",
] as const;

export type LaunchpadStatus = (typeof LAUNCHPAD_STATUSES)[number];

/**
 * Where an item's implementation run stands. Nothing writes this yet; it is
 * the record a Claude Code runner would fill in (session, branch, PR, the
 * commit that landed on main) so the board can show live progress.
 */
export interface LaunchpadImplementation {
  state: "queued" | "running" | "awaiting_review" | "merged" | "failed";
  agentSessionId: string | null;
  branch: string | null;
  pullRequestUrl: string | null;
  previewUrl: string | null;
  commitSha: string | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

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
  /**
   * What to build, written so a coding agent can execute it without more
   * context: pages/files affected, the change, and how to verify it.
   * Required before an item can leave Backlog.
   */
  brief: string | null;
  implementation: LaunchpadImplementation | null;
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
