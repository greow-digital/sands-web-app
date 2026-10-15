// Domain shapes for the marketing report under The Radar. Separate from
// lib/growthship/cogny/types.ts (the Bridge/Overview/Radar snapshot): this
// is a denser, period-trend report mirroring a full channel-by-channel
// view, not a set of opportunity signals.

export interface KpiRow {
  metric:
    | "leads"
    | "sessions"
    | "ads_cost"
    | "ads_conversions"
    | "ads_cpa"
    | "ads_clicks"
    | "ads_cpc"
    | "organic_clicks"
    | "organic_impressions"
    | "organic_ctr"
    | "organic_position";
  current: number | null;
  previous: number | null;
  change: number | null;
}

export interface DailyChannelRow {
  date: string; // YYYY-MM-DD
  channel: string;
  sessions: number;
}

export interface DailyLeadRow {
  date: string;
  formSubmit: number;
  phoneClick: number;
}

export interface ChannelSummaryRow {
  channel: string;
  sessions: number;
  prevSessions: number;
  change: number | null;
  engagementRate: number | null;
  leads: number;
}

export interface LandingPageRow {
  page: string;
  sessions: number;
  engagementRate: number | null;
  leads: number;
}

export interface DailyAdsRow {
  date: string;
  costSek: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

export interface CampaignRow {
  campaign: string;
  status: string;
  bidding: string;
  costSek: number;
  clicks: number;
  impressions: number;
  ctr: number | null;
  conversions: number;
  cpaSek: number | null;
}

export interface SearchTermRow {
  term: string;
  costSek: number;
  clicks: number;
  impressions: number;
  cpcSek: number | null;
  conversions: number;
}

export interface DailySearchRow {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageSearchRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface MarketingReport {
  generatedAt: string;
  windowNote: string;
  kpis: KpiRow[];
  dailyChannelSessions: DailyChannelRow[];
  dailyLeads: DailyLeadRow[];
  channels: ChannelSummaryRow[];
  landingPages: LandingPageRow[];
  dailyAds: DailyAdsRow[];
  campaigns: CampaignRow[];
  searchTerms: SearchTermRow[];
  dailySearch: DailySearchRow[];
  queries: QueryRow[];
  pages: PageSearchRow[];
}
