// Clean domain shapes for marketing data. Growthship components only ever
// see these types: nothing above this layer needs to know whether a number
// came from GA4, Search Console or Google Ads. See README.md in this
// directory for how a CognyBundle gets produced today.

export type Period = "7d" | "30d" | "90d";

export interface PeriodValue {
  current: number;
  previous: number | null;
  /** (current - previous) / previous, null when previous is 0 or unknown. */
  changeRatio: number | null;
}

export interface ChannelMetrics {
  channel: string;
  sessions: PeriodValue;
  conversions: PeriodValue;
  engagementRate: number | null;
}

export interface SearchQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface AdCampaignMetrics {
  campaign: string;
  impressions: number;
  clicks: number;
  costSek: number;
  conversions: number;
  conversionValueSek: number;
}

export interface FunnelStage {
  label: string;
  value: number;
  /** Event or metric this came from, shown as evidence. */
  source: string;
}

export interface GrowthSnapshot {
  period: Period;
  generatedAt: string;
  totalSessions: PeriodValue;
  totalConversions: PeriodValue;
  channels: ChannelMetrics[];
  currency: string;
}

/**
 * Everything one analysis pass needs, already shaped into domain types.
 * This is what a Cogny retrieval pass (live, or run manually through an
 * agent with Cogny access) produces and hands to the analysis engine.
 */
export interface CognyBundle {
  snapshot: GrowthSnapshot;
  searchQueries: SearchQueryRow[];
  adCampaigns: AdCampaignMetrics[];
  funnel: FunnelStage[];
  /** Human-readable note on what could not be retrieved, shown in empty states. */
  unavailable: string[];
}
