/**
 * Builds the first Growthship CognyBundle from real Cogny data (GA4
 * property 528115518, Search Console sc-domain:sandsab.se, Google Ads
 * 4767554827), pulled live on 2026-10-15, and runs it through the
 * analysis engine. See lib/growthship/cogny/README.md for why this is a
 * script today instead of a live server call.
 *
 * Re-running later with a fresh pull: replace the literals below with the
 * new Cogny response and run again. Nothing here is invented; every
 * number is what Cogny returned for the 30-day window ending 2026-10-14
 * against the 30 days before it.
 *
 * Usage:
 *   npx tsx scripts/growthship-seed.ts
 */
import { runAnalysis } from "../lib/growthship/analysis/runAnalysis";
import type { CognyBundle, ChannelMetrics } from "../lib/growthship/cogny/types";

function channel(
  name: string,
  sessionsCurrent: number,
  sessionsPrevious: number,
  conversionsCurrent: number,
  conversionsPrevious: number,
  engagementRate: number
): ChannelMetrics {
  const changeRatio =
    sessionsPrevious > 0 ? (sessionsCurrent - sessionsPrevious) / sessionsPrevious : null;
  return {
    channel: name,
    sessions: { current: sessionsCurrent, previous: sessionsPrevious, changeRatio },
    conversions: {
      current: conversionsCurrent,
      previous: conversionsPrevious,
      changeRatio:
        conversionsPrevious > 0
          ? (conversionsCurrent - conversionsPrevious) / conversionsPrevious
          : null,
    },
    engagementRate,
  };
}

const channels: ChannelMetrics[] = [
  channel("Paid Search", 893, 724, 15, 9, 0.5969),
  channel("Direct", 257, 193, 6, 0, 0.2685),
  channel("Organic Search", 233, 147, 9, 8, 0.5622),
  channel("AI Assistant", 16, 15, 2, 3, 0.8125),
  channel("Cross-network", 12, 18, 0, 0, 0.75),
  channel("Referral", 1, 5, 0, 0, 1),
  channel("Organic Social", 1, 1, 0, 0, 1),
  channel("Unassigned", 0, 14, 0, 1, 0),
];

const totalSessionsCurrent = channels.reduce((s, c) => s + c.sessions.current, 0);
const totalSessionsPrevious = channels.reduce((s, c) => s + (c.sessions.previous ?? 0), 0);
const totalConversionsCurrent = channels.reduce((s, c) => s + c.conversions.current, 0);
const totalConversionsPrevious = channels.reduce(
  (s, c) => s + (c.conversions.previous ?? 0),
  0
);

// Google Search Console, sc-domain:sandsab.se, 2026-09-15 to 2026-10-14,
// query dimension, top rows by clicks then impressions.
const searchQueries: CognyBundle["searchQueries"] = [
  { query: "sands entreprenad stockholm ab", clicks: 7, impressions: 25, ctr: 0.28, position: 1.08 },
  { query: "sands entreprenad", clicks: 6, impressions: 44, ctr: 0.1364, position: 1.05 },
  { query: "byta eternittak kostnad", clicks: 2, impressions: 40, ctr: 0.05, position: 5.8 },
  { query: "bästa takläggare stockholm", clicks: 2, impressions: 168, ctr: 0.0119, position: 12.11 },
  { query: "byta tak tyresö", clicks: 1, impressions: 22, ctr: 0.0455, position: 18.45 },
  { query: "eternittak", clicks: 1, impressions: 121, ctr: 0.0083, position: 21.25 },
  { query: "takbesiktning stockholm", clicks: 1, impressions: 150, ctr: 0.0067, position: 44.38 },
  { query: "takbyte", clicks: 1, impressions: 309, ctr: 0.0032, position: 25.76 },
  { query: "takläggare ekerö", clicks: 1, impressions: 64, ctr: 0.0156, position: 18.63 },
  { query: "takläggning norrtälje", clicks: 1, impressions: 48, ctr: 0.0208, position: 27.19 },
  { query: "takomläggning", clicks: 1, impressions: 83, ctr: 0.012, position: 25.25 },
  { query: "auktoriserad takläggare", clicks: 0, impressions: 101, ctr: 0, position: 7.03 },
  { query: "asbest tak", clicks: 0, impressions: 68, ctr: 0, position: 7.78 },
  { query: "asbest innertak", clicks: 0, impressions: 17, ctr: 0, position: 9.94 },
  { query: "besikta tak pris", clicks: 0, impressions: 12, ctr: 0, position: 34.67 },
];

// Google Ads customer 4767554827, LAST_30_DAYS, enabled campaigns.
const adCampaigns: CognyBundle["adCampaigns"] = [
  {
    campaign: "Takläggning Stockholm",
    impressions: 11109,
    clicks: 453,
    costSek: 12160.13,
    conversions: 6,
    conversionValueSek: 9000,
  },
  {
    campaign: "Search — Pris/Research Stockholm",
    impressions: 3494,
    clicks: 361,
    costSek: 2976.48,
    conversions: 2,
    conversionValueSek: 3000,
  },
];

// GA4 event counts for the lead funnel. qualify_lead and close_convert_lead
// are configured as conversion events but recorded zero occurrences in
// either 30-day window, which is itself a finding (see detectFunnelGaps).
const funnel: CognyBundle["funnel"] = [
  { label: "Sessioner", value: totalSessionsCurrent, source: "GA4 sessions" },
  { label: "Leads", value: 25 + 7, source: "GA4-händelser: form_submit + phone_click" },
  { label: "Kvalificerad", value: 0, source: "GA4-händelse: qualify_lead" },
  { label: "Kund", value: 0, source: "GA4-händelse: close_convert_lead" },
];

const bundle: CognyBundle = {
  snapshot: {
    period: "30d",
    generatedAt: new Date().toISOString(),
    totalSessions: {
      current: totalSessionsCurrent,
      previous: totalSessionsPrevious,
      changeRatio: (totalSessionsCurrent - totalSessionsPrevious) / totalSessionsPrevious,
    },
    totalConversions: {
      current: totalConversionsCurrent,
      previous: totalConversionsPrevious,
      changeRatio:
        totalConversionsPrevious > 0
          ? (totalConversionsCurrent - totalConversionsPrevious) / totalConversionsPrevious
          : null,
    },
    channels,
    currency: "SEK",
  },
  searchQueries,
  adCampaigns,
  funnel,
  unavailable: [
    "Meta Ads och LinkedIn Ads är inte anslutna i Cogny ännu.",
    "Kostnad per kund går inte att räkna ut: Google Ads konverteringsvärde är ett standardvärde per lead, inte verkligt kontraktsvärde.",
  ],
};

runAnalysis(bundle)
  .then((run) => {
    console.log("Analysis run complete:", run);
  })
  .catch((err) => {
    console.error("Analysis run failed:", err);
    process.exitCode = 1;
  });
