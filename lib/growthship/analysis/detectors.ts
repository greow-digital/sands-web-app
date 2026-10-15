import type {
  AdCampaignMetrics,
  ChannelMetrics,
  CognyBundle,
  FunnelStage,
  SearchQueryRow,
} from "../cogny/types";
import type { OpportunityDraft } from "./types";

// Starting heuristics, not settled law. Each threshold is named so it is
// one edit to retune once we have a few weeks of real opportunity outcomes
// to check them against (see The Launchpad's learning loop).
const SEO_MIN_IMPRESSIONS = 20;
const SEO_NEAR_PAGE_ONE_POSITION = 15;
const SEO_LOW_CTR_IMPRESSIONS = 100;
const SEO_LOW_CTR_THRESHOLD = 0.02;
const CHANNEL_MIN_PREVIOUS_SESSIONS = 20;
const CHANNEL_DECLINE_RATIO = -0.15;
const CHANNEL_GROWTH_RATIO = 0.2;
const CAMPAIGN_CPA_GAP_RATIO = 1.3;
const CAMPAIGN_MIN_SPEND_SEK = 500;

function round(n: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function pct(ratio: number): string {
  return `${ratio >= 0 ? "+" : ""}${round(ratio * 100)}%`;
}

export function detectSeoOpportunities(
  rows: SearchQueryRow[]
): OpportunityDraft[] {
  const drafts: OpportunityDraft[] = [];

  for (const row of rows) {
    if (
      row.impressions >= SEO_MIN_IMPRESSIONS &&
      row.position <= SEO_NEAR_PAGE_ONE_POSITION &&
      row.clicks === 0
    ) {
      drafts.push({
        title: `"${row.query}" rankar nära förstasidan men får inga klick`,
        description:
          "Sökordet syns ofta i Google men ingen klickar sig vidare, vilket oftast beror på titel eller snippet snarare än ranking.",
        category: "SEO",
        evidence: `${row.impressions} visningar, position ${round(row.position)}, 0 klick (CTR 0%).`,
        recommendation:
          "Skriv om titel och metabeskrivning för sidan som rankar på frasen, och lägg in frasen tydligare i H1 eller intro.",
        impact: row.impressions >= 100 ? "Medium" : "Low",
        confidence: "High",
        effort: "Low",
        source: "Google Search Console",
        dedupeKey: `seo:zero-click:${row.query}`,
      });
      continue;
    }

    if (
      row.impressions >= SEO_LOW_CTR_IMPRESSIONS &&
      row.ctr < SEO_LOW_CTR_THRESHOLD &&
      row.clicks > 0
    ) {
      drafts.push({
        title: `Låg klickfrekvens på "${row.query}"`,
        description:
          "Frasen får många visningar men ovanligt låg andel klick jämfört med hur högt den syns, vilket pekar på en svag snippet.",
        category: "SEO",
        evidence: `${row.impressions} visningar, CTR ${round(row.ctr * 100, 2)}%, position ${round(row.position)}.`,
        recommendation:
          "Testa en mer konkret titel (pris, tidsram eller plats) för sidan som rankar på frasen.",
        impact: row.impressions >= 250 ? "High" : "Medium",
        confidence: "Medium",
        effort: "Low",
        source: "Google Search Console",
        dedupeKey: `seo:low-ctr:${row.query}`,
      });
    }
  }

  return drafts;
}

export function detectChannelTrends(
  channels: ChannelMetrics[]
): OpportunityDraft[] {
  const drafts: OpportunityDraft[] = [];

  for (const ch of channels) {
    const { changeRatio, previous, current } = ch.sessions;
    if (changeRatio === null || previous === null) continue;
    if (previous < CHANNEL_MIN_PREVIOUS_SESSIONS) continue;

    if (changeRatio <= CHANNEL_DECLINE_RATIO) {
      drafts.push({
        title: `${ch.channel} tappar trafik`,
        description: `Sessioner från ${ch.channel} har minskat tydligt mot föregående period.`,
        category: "Acquisition",
        evidence: `${current} sessioner nu mot ${previous} föregående period (${pct(changeRatio)}).`,
        recommendation: `Undersök vad som förändrats i ${ch.channel}: budget, ranking, säsong eller en trasig källa.`,
        impact: previous >= 100 ? "High" : "Medium",
        confidence: "Medium",
        effort: "Medium",
        source: "Google Analytics 4",
        dedupeKey: `channel:decline:${ch.channel}`,
      });
    } else if (changeRatio >= CHANNEL_GROWTH_RATIO && current >= 50) {
      drafts.push({
        title: `${ch.channel} accelererar`,
        description: `Sessioner från ${ch.channel} växer tydligt mot föregående period.`,
        category: "Acquisition",
        evidence: `${current} sessioner nu mot ${previous} föregående period (${pct(changeRatio)}).`,
        recommendation: `Överväg att öka investeringen i ${ch.channel} medan kanalen presterar över snittet.`,
        impact: "Medium",
        confidence: "Medium",
        effort: "Low",
        source: "Google Analytics 4",
        dedupeKey: `channel:growth:${ch.channel}`,
      });
    }
  }

  return drafts;
}

export function detectPaidOpportunities(
  campaigns: AdCampaignMetrics[]
): OpportunityDraft[] {
  const drafts: OpportunityDraft[] = [];
  const withSpend = campaigns.filter((c) => c.costSek >= CAMPAIGN_MIN_SPEND_SEK);

  for (const c of withSpend) {
    if (c.conversions === 0) {
      drafts.push({
        title: `"${c.campaign}" spenderar utan konverteringar`,
        description:
          "Kampanjen har fått ett märkbart budgetutrymme men inga registrerade konverteringar i perioden.",
        category: "Paid",
        evidence: `${c.costSek.toLocaleString("sv-SE")} kr spenderat, ${c.clicks} klick, 0 konverteringar.`,
        recommendation:
          "Pausa eller skala ner kampanjen tills konverteringsspårningen eller målgruppen är verifierad.",
        impact: "High",
        confidence: "High",
        effort: "Low",
        source: "Google Ads",
        dedupeKey: `paid:zero-conversion:${c.campaign}`,
      });
    }
  }

  const withConversions = withSpend.filter((c) => c.conversions > 0);
  if (withConversions.length >= 2) {
    const byCpaAsc = [...withConversions].sort(
      (a, b) => a.costSek / a.conversions - b.costSek / b.conversions
    );
    const cheapest = byCpaAsc[0];
    const priciest = byCpaAsc[byCpaAsc.length - 1];
    const cpaCheapest = cheapest.costSek / cheapest.conversions;
    const cpaPriciest = priciest.costSek / priciest.conversions;

    if (cpaPriciest / cpaCheapest >= CAMPAIGN_CPA_GAP_RATIO) {
      drafts.push({
        title: `Stor skillnad i kostnad per konvertering mellan kampanjer`,
        description: `"${priciest.campaign}" kostar betydligt mer per konvertering än "${cheapest.campaign}".`,
        category: "Paid",
        evidence: `${priciest.campaign}: ${round(cpaPriciest)} kr/konvertering. ${cheapest.campaign}: ${round(cpaCheapest)} kr/konvertering.`,
        recommendation: `Flytta budget från "${priciest.campaign}" till "${cheapest.campaign}" och följ om konverteringsvolymen håller.`,
        impact: "Medium",
        confidence: "Medium",
        effort: "Low",
        source: "Google Ads",
        dedupeKey: `paid:cpa-gap:${priciest.campaign}:${cheapest.campaign}`,
      });
    }
  }

  return drafts;
}

export function detectFunnelGaps(funnel: FunnelStage[]): OpportunityDraft[] {
  const drafts: OpportunityDraft[] = [];
  const firstPositive = funnel.findIndex((s) => s.value > 0);

  for (let i = 0; i < funnel.length; i += 1) {
    const stage = funnel[i];
    if (stage.value === 0 && i > firstPositive && firstPositive !== -1) {
      drafts.push({
        title: `"${stage.label}" registrerar inga händelser`,
        description:
          "Ett steg längre ner i tratten är helt tomt trots trafik och leads tidigare i tratten, vilket oftast betyder att spårningen saknas snarare än att inget händer.",
        category: "Technical",
        evidence: `${stage.source}: 0 registrerade händelser den senaste perioden.`,
        recommendation:
          "Verifiera att händelsen faktiskt triggas i produkten eller CRM:et, och att den skickas till GA4.",
        impact: "Medium",
        confidence: "Medium",
        effort: "Medium",
        source: "Google Analytics 4",
        dedupeKey: `funnel:empty-stage:${stage.label}`,
      });
    }
  }

  return drafts;
}

export function runDetectors(bundle: CognyBundle): OpportunityDraft[] {
  return [
    ...detectSeoOpportunities(bundle.searchQueries),
    ...detectChannelTrends(bundle.snapshot.channels),
    ...detectPaidOpportunities(bundle.adCampaigns),
    ...detectFunnelGaps(bundle.funnel),
  ];
}
