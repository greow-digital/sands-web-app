/**
 * Builds the Radar "Report" from real Cogny data (same sources as
 * scripts/growthship-seed.ts) pulled live on 2026-10-15, matching the
 * structure of the reference report at
 * https://claude.ai/artifact/ShMmFn72mJmR8Zn7vGkChL (an Artifact dashboard
 * over the same GA4/GSC/Ads sources). See lib/growthship/reporting/raw/
 * for the untouched tool responses and transform.ts for how they become
 * the report.
 *
 * Usage:
 *   npx tsx scripts/growthship-report-seed.ts
 */
import { buildMarketingReport } from "../lib/growthship/reporting/transform";
import { setReport } from "../lib/growthship/store/db";

import gaDailyChannel from "../lib/growthship/reporting/raw/ga_daily_channel.json";
import gaLeadsDaily from "../lib/growthship/reporting/raw/ga_leads_daily.json";
import gaTotals from "../lib/growthship/reporting/raw/ga_totals.json";
import gaChannels from "../lib/growthship/reporting/raw/ga_channels.json";
import gaEvents from "../lib/growthship/reporting/raw/ga_events.json";
import gaLanding from "../lib/growthship/reporting/raw/ga_landing.json";
import adsDaily from "../lib/growthship/reporting/raw/ads_daily.json";
import adsCampaigns from "../lib/growthship/reporting/raw/ads_campaigns.json";
import adsTerms from "../lib/growthship/reporting/raw/ads_terms.json";
import gscDaily from "../lib/growthship/reporting/raw/gsc_daily.json";
import gscQueries from "../lib/growthship/reporting/raw/gsc_queries.json";
import gscPages from "../lib/growthship/reporting/raw/gsc_pages.json";

const report = buildMarketingReport({
  gaDailyChannel,
  gaLeadsDaily,
  gaTotals,
  gaChannels,
  gaEvents,
  gaLanding,
  adsDaily,
  adsCampaigns,
  adsTerms,
  gscDaily,
  gscQueries,
  gscPages,
} as never);

setReport(report)
  .then(() => {
    console.log(
      `Report built: ${report.channels.length} channels, ${report.campaigns.length} campaigns, ${report.queries.length} queries, ${report.pages.length} pages.`
    );
  })
  .catch((err) => {
    console.error("Report build failed:", err);
    process.exitCode = 1;
  });
