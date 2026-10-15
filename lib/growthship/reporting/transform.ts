import type {
  CampaignRow,
  ChannelSummaryRow,
  DailyAdsRow,
  DailyChannelRow,
  DailyLeadRow,
  DailySearchRow,
  KpiRow,
  LandingPageRow,
  MarketingReport,
  PageSearchRow,
  QueryRow,
  SearchTermRow,
} from "./types";

// Mirrors the calc logic of the reference "Sands marketing & web" report
// (an Artifact dashboard over the same Cogny sources) so the two stay
// readable side by side. Raw inputs are exactly what Cogny returned; see
// lib/growthship/reporting/raw/*.json and docs/GROWTHSHIP.md.

const num = (v: unknown): number => Number(v) || 0;

function ga4DateToIso(d: string): string {
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/** Last 28 distinct sorted dates, and the 28 before that. Matches the
 * reference's `windows()`: trailing windows over whatever dates are
 * actually present, not calendar months. */
function trailingWindows(dates: string[]): { cur: Set<string>; prev: Set<string> } {
  const sorted = [...new Set(dates)].sort();
  return {
    cur: new Set(sorted.slice(-28)),
    prev: new Set(sorted.slice(-56, -28)),
  };
}

function sumWhere<T>(rows: T[], dateKey: keyof T, valueKey: keyof T, window: Set<string>): number {
  return rows
    .filter((r) => window.has(String(r[dateKey])))
    .reduce((s, r) => s + num(r[valueKey]), 0);
}

const BIDDING_NAMES: Record<string, string> = {
  TARGET_SPEND: "Maximize clicks",
  MAXIMIZE_CONVERSIONS: "Maximize conversions",
  MAXIMIZE_CONVERSION_VALUE: "Maximize conv. value",
  TARGET_CPA: "Target CPA",
  TARGET_ROAS: "Target ROAS",
  MANUAL_CPC: "Manual CPC",
};

export interface RawInputs {
  gaDailyChannel: { date: string; sessionDefaultChannelGroup: string; sessions: string }[];
  gaLeadsDaily: { date: string; eventName: "form_submit" | "phone_click"; eventCount: string }[];
  gaTotals: { dateRange: "current" | "previous"; sessions: string; totalUsers: string; engagementRate: string }[];
  gaChannels: {
    sessionDefaultChannelGroup: string;
    dateRange: "current" | "previous";
    sessions: string;
    engagementRate: string;
    keyEvents: string;
  }[];
  gaEvents: { eventName: "form_submit" | "phone_click"; dateRange: "current" | "previous"; eventCount: string }[];
  gaLanding: { landingPage: string; sessions: string; engagementRate: string; keyEvents: string }[];
  adsDaily: {
    "segments.date": string;
    "metrics.cost_micros": number;
    "metrics.clicks": number;
    "metrics.impressions": number;
    "metrics.conversions": number;
  }[];
  adsCampaigns: {
    "campaign.name": string;
    "campaign.status": string;
    "campaign.bidding_strategy_type": string;
    "metrics.cost_micros": number;
    "metrics.clicks": number;
    "metrics.impressions": number;
    "metrics.conversions": number;
  }[];
  adsTerms: {
    "search_term_view.search_term": string;
    "metrics.clicks": number;
    "metrics.impressions": number;
    "metrics.cost_micros": number;
    "metrics.conversions": number;
  }[];
  gscDaily: { keys: [string]; clicks: number; impressions: number; ctr: number; position: number }[];
  gscQueries: { keys: [string]; clicks: number; impressions: number; ctr: number; position: number }[];
  gscPages: { keys: [string]; clicks: number; impressions: number; ctr: number; position: number }[];
}

export function buildMarketingReport(raw: RawInputs): MarketingReport {
  const dailyChannelSessions: DailyChannelRow[] = raw.gaDailyChannel.map((r) => ({
    date: ga4DateToIso(r.date),
    channel: r.sessionDefaultChannelGroup,
    sessions: num(r.sessions),
  }));

  const leadsByDate = new Map<string, DailyLeadRow>();
  raw.gaLeadsDaily.forEach((r) => {
    const date = ga4DateToIso(r.date);
    const row = leadsByDate.get(date) ?? { date, formSubmit: 0, phoneClick: 0 };
    if (r.eventName === "form_submit") row.formSubmit += num(r.eventCount);
    else row.phoneClick += num(r.eventCount);
    leadsByDate.set(date, row);
  });
  const dailyLeads = [...leadsByDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  const channelByName = new Map<string, ChannelSummaryRow>();
  raw.gaChannels.forEach((r) => {
    const c = r.sessionDefaultChannelGroup;
    const row =
      channelByName.get(c) ??
      ({ channel: c, sessions: 0, prevSessions: 0, change: null, engagementRate: null, leads: 0 } as ChannelSummaryRow);
    if (r.dateRange === "current") {
      row.sessions = num(r.sessions);
      row.engagementRate = Number(r.engagementRate);
      row.leads = num(r.keyEvents);
    } else {
      row.prevSessions = num(r.sessions);
    }
    channelByName.set(c, row);
  });
  const channels = [...channelByName.values()]
    .filter((r) => r.sessions || r.prevSessions)
    .map((r) => ({ ...r, change: r.prevSessions ? r.sessions / r.prevSessions - 1 : null }))
    .sort((a, b) => b.sessions - a.sessions);

  const landingPages: LandingPageRow[] = raw.gaLanding.map((r) => ({
    page: r.landingPage,
    sessions: num(r.sessions),
    engagementRate: Number(r.engagementRate),
    leads: num(r.keyEvents),
  }));

  const dailyAds: DailyAdsRow[] = raw.adsDaily.map((r) => ({
    date: r["segments.date"],
    costSek: num(r["metrics.cost_micros"]) / 1e6,
    clicks: num(r["metrics.clicks"]),
    impressions: num(r["metrics.impressions"]),
    conversions: num(r["metrics.conversions"]),
  }));

  const campaigns: CampaignRow[] = raw.adsCampaigns.map((r) => {
    const costSek = num(r["metrics.cost_micros"]) / 1e6;
    const clicks = num(r["metrics.clicks"]);
    const impressions = num(r["metrics.impressions"]);
    const conversions = num(r["metrics.conversions"]);
    const bidding = r["campaign.bidding_strategy_type"];
    return {
      campaign: r["campaign.name"],
      status: r["campaign.status"],
      bidding: BIDDING_NAMES[bidding] ?? bidding,
      costSek,
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : null,
      conversions,
      cpaSek: conversions ? costSek / conversions : null,
    };
  });

  const termsByName = new Map<string, SearchTermRow>();
  raw.adsTerms.forEach((r) => {
    const t = r["search_term_view.search_term"];
    const row = termsByName.get(t) ?? { term: t, costSek: 0, clicks: 0, impressions: 0, cpcSek: null, conversions: 0 };
    row.clicks += num(r["metrics.clicks"]);
    row.impressions += num(r["metrics.impressions"]);
    row.costSek += num(r["metrics.cost_micros"]) / 1e6;
    row.conversions += num(r["metrics.conversions"]);
    termsByName.set(t, row);
  });
  const searchTerms = [...termsByName.values()]
    .map((r) => ({ ...r, cpcSek: r.clicks ? r.costSek / r.clicks : null }))
    .sort((a, b) => b.costSek - a.costSek)
    .slice(0, 25);

  const dailySearch: DailySearchRow[] = raw.gscDaily.map((r) => ({
    date: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  const queries: QueryRow[] = raw.gscQueries.map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  const pages: PageSearchRow[] = raw.gscPages.map((r) => ({
    page: r.keys[0].replace(/^https?:\/\/[^/]+/, "") || "/",
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  // ---- KPIs: current 28 days vs the 28 before, per source's own windows ----
  const totalsByRange = new Map(raw.gaTotals.map((r) => [r.dateRange, r]));
  const sessionsCur = num(totalsByRange.get("current")?.sessions);
  const sessionsPrev = num(totalsByRange.get("previous")?.sessions);

  const eventsByRange = new Map<string, { formSubmit: number; phoneClick: number }>();
  raw.gaEvents.forEach((r) => {
    const o = eventsByRange.get(r.dateRange) ?? { formSubmit: 0, phoneClick: 0 };
    if (r.eventName === "form_submit") o.formSubmit = num(r.eventCount);
    else o.phoneClick = num(r.eventCount);
    eventsByRange.set(r.dateRange, o);
  });
  const leadsCur = (eventsByRange.get("current")?.formSubmit ?? 0) + (eventsByRange.get("current")?.phoneClick ?? 0);
  const leadsPrev = (eventsByRange.get("previous")?.formSubmit ?? 0) + (eventsByRange.get("previous")?.phoneClick ?? 0);

  const adsWindows = trailingWindows(dailyAds.map((r) => r.date));
  const adsAgg = (w: Set<string>) => ({
    cost: sumWhere(dailyAds, "date", "costSek", w),
    conv: sumWhere(dailyAds, "date", "conversions", w),
    clicks: sumWhere(dailyAds, "date", "clicks", w),
  });
  const adsCur = adsAgg(adsWindows.cur);
  const adsPrev = adsAgg(adsWindows.prev);

  const gscWindows = trailingWindows(dailySearch.map((r) => r.date));
  const gscAgg = (w: Set<string>) => {
    const clicks = sumWhere(dailySearch, "date", "clicks", w);
    const impressions = sumWhere(dailySearch, "date", "impressions", w);
    const posWeighted = dailySearch
      .filter((r) => w.has(r.date))
      .reduce((s, r) => s + r.position * r.impressions, 0);
    return {
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : null,
      position: impressions ? posWeighted / impressions : null,
    };
  };
  const gscCur = gscAgg(gscWindows.cur);
  const gscPrev = gscAgg(gscWindows.prev);

  const row = (metric: KpiRow["metric"], current: number | null, previous: number | null): KpiRow => ({
    metric,
    current,
    previous,
    change: previous && current != null ? current / previous - 1 : null,
  });

  const kpis: KpiRow[] = [
    row("leads", leadsCur, leadsPrev),
    row("sessions", sessionsCur, sessionsPrev),
    row("ads_cost", adsCur.cost, adsPrev.cost),
    row("ads_conversions", adsCur.conv, adsPrev.conv),
    row("ads_cpa", adsCur.conv ? adsCur.cost / adsCur.conv : null, adsPrev.conv ? adsPrev.cost / adsPrev.conv : null),
    row("ads_clicks", adsCur.clicks, adsPrev.clicks),
    row(
      "ads_cpc",
      adsCur.clicks ? adsCur.cost / adsCur.clicks : null,
      adsPrev.clicks ? adsPrev.cost / adsPrev.clicks : null
    ),
    row("organic_clicks", gscCur.clicks, gscPrev.clicks),
    row("organic_impressions", gscCur.impressions, gscPrev.impressions),
    row("organic_ctr", gscCur.ctr, gscPrev.ctr),
    row("organic_position", gscCur.position, gscPrev.position),
  ];

  return {
    generatedAt: new Date().toISOString(),
    windowNote:
      "Last 28 days vs the 28 days before. Search Console data runs about three days behind, so its windows end earlier.",
    kpis,
    dailyChannelSessions,
    dailyLeads,
    channels,
    landingPages,
    dailyAds,
    campaigns,
    searchTerms,
    dailySearch,
    queries,
    pages,
  };
}
