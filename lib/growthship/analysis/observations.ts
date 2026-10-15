import type { CognyBundle } from "../cogny/types";

/**
 * Short, factual sentences for the Overview's "What's happening" list.
 * Every sentence must trace back to a number in the bundle; this is not
 * a place to paraphrase, speculate or fill gaps.
 */
export function buildObservations(bundle: CognyBundle): string[] {
  const observations: string[] = [];
  const { snapshot, searchQueries, adCampaigns } = bundle;

  const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
  const pct = (r: number) => `${r >= 0 ? "+" : ""}${round(r * 100)}%`;

  if (snapshot.totalSessions.changeRatio !== null) {
    observations.push(
      `Trafiken totalt ${snapshot.totalSessions.changeRatio >= 0 ? "ökade" : "minskade"} ${pct(Math.abs(snapshot.totalSessions.changeRatio) * (snapshot.totalSessions.changeRatio >= 0 ? 1 : -1))} jämfört med föregående period (${snapshot.totalSessions.current} mot ${snapshot.totalSessions.previous} sessioner).`
    );
  }

  if (snapshot.totalConversions.changeRatio !== null) {
    observations.push(
      `Konverteringar ${snapshot.totalConversions.changeRatio >= 0 ? "ökade" : "minskade"} ${pct(Math.abs(snapshot.totalConversions.changeRatio) * (snapshot.totalConversions.changeRatio >= 0 ? 1 : -1))} (${snapshot.totalConversions.current} mot ${snapshot.totalConversions.previous}).`
    );
  }

  const topGrowth = [...snapshot.channels]
    .filter((c) => c.sessions.changeRatio !== null && c.sessions.previous! >= 20)
    .sort((a, b) => (b.sessions.changeRatio ?? 0) - (a.sessions.changeRatio ?? 0))[0];
  if (topGrowth && (topGrowth.sessions.changeRatio ?? 0) > 0) {
    observations.push(
      `${topGrowth.channel} är den snabbast växande kanalen, ${pct(topGrowth.sessions.changeRatio!)} fler sessioner.`
    );
  }

  const zeroClickHighImpression = searchQueries
    .filter((q) => q.clicks === 0 && q.impressions >= 20 && q.position <= 15)
    .sort((a, b) => b.impressions - a.impressions)[0];
  if (zeroClickHighImpression) {
    observations.push(
      `"${zeroClickHighImpression.query}" syns ${zeroClickHighImpression.impressions} gånger nära förstasidan (position ${round(zeroClickHighImpression.position)}) men får inga klick.`
    );
  }

  const campaignsWithConversions = adCampaigns.filter((c) => c.conversions > 0);
  if (campaignsWithConversions.length >= 2) {
    const sorted = [...campaignsWithConversions].sort(
      (a, b) => a.costSek / a.conversions - b.costSek / b.conversions
    );
    const cheapest = sorted[0];
    const priciest = sorted[sorted.length - 1];
    if (cheapest.campaign !== priciest.campaign) {
      observations.push(
        `"${cheapest.campaign}" konverterar billigare än "${priciest.campaign}" (${round(cheapest.costSek / cheapest.conversions)} kr mot ${round(priciest.costSek / priciest.conversions)} kr per konvertering).`
      );
    }
  }

  return observations.slice(0, 5);
}
