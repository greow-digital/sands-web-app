import type { CognyBundle } from "../cogny/types";
import type { Opportunity } from "../types";

/**
 * "Ask Growthship" v1: answers over data we actually have, not a general
 * LLM call. This app has no LLM API key configured, and bolting one on
 * just to answer four example questions would be the kind of infra this
 * MVP is explicitly told to avoid. If that changes, swap the body of
 * `answer()` for a call to an LLM given the same bundle + opportunities
 * as context; the function signature does not need to change.
 */

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
const pct = (r: number) => `${r >= 0 ? "+" : ""}${round(r * 100)}%`;

function answerTrafficChange(bundle: CognyBundle): string {
  const { totalSessions } = bundle.snapshot;
  if (totalSessions.changeRatio === null) {
    return "Det finns ingen föregående period att jämföra med ännu.";
  }
  const direction = totalSessions.changeRatio >= 0 ? "ökade" : "minskade";
  const lines = [
    `Trafiken ${direction} ${pct(totalSessions.changeRatio)} (${totalSessions.current} mot ${totalSessions.previous} sessioner).`,
  ];
  const decliners = bundle.snapshot.channels
    .filter((c) => (c.sessions.changeRatio ?? 0) < 0 && (c.sessions.previous ?? 0) >= 20)
    .sort((a, b) => (a.sessions.changeRatio ?? 0) - (b.sessions.changeRatio ?? 0));
  if (decliners.length > 0) {
    const top = decliners[0];
    lines.push(
      `Störst nedgång i ${top.channel}: ${pct(top.sessions.changeRatio!)} (${top.sessions.current} mot ${top.sessions.previous}).`
    );
  }
  return lines.join(" ");
}

function answerGrowingChannels(bundle: CognyBundle): string {
  const growing = bundle.snapshot.channels
    .filter((c) => (c.sessions.changeRatio ?? 0) > 0 && (c.sessions.previous ?? 0) >= 20)
    .sort((a, b) => (b.sessions.changeRatio ?? 0) - (a.sessions.changeRatio ?? 0));
  if (growing.length === 0) return "Ingen kanal med meningsfull volym växer just nu.";
  return growing
    .map((c) => `${c.channel}: ${pct(c.sessions.changeRatio!)} (${c.sessions.current} sessioner)`)
    .join(". ");
}

function answerWaste(bundle: CognyBundle): string {
  const zeroConversion = bundle.adCampaigns.filter((c) => c.conversions === 0 && c.costSek > 0);
  if (zeroConversion.length > 0) {
    return zeroConversion
      .map((c) => `"${c.campaign}" har kostat ${round(c.costSek)} kr utan en enda konvertering.`)
      .join(" ");
  }
  const withConversions = bundle.adCampaigns.filter((c) => c.conversions > 0);
  if (withConversions.length >= 2) {
    const sorted = [...withConversions].sort(
      (a, b) => b.costSek / b.conversions - a.costSek / a.conversions
    );
    const worst = sorted[0];
    return `Ingen kampanj saknar konverteringar helt, men "${worst.campaign}" har högst kostnad per konvertering (${round(worst.costSek / worst.conversions)} kr).`;
  }
  return "Det finns inte nog annonsdata för att peka ut bortkastad spend ännu.";
}

function answerFocus(bundle: CognyBundle, opportunities: Opportunity[]): string {
  const open = opportunities
    .filter((o) => o.status === "New" || o.status === "Reviewing")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (open.length === 0) {
    return "Inga öppna möjligheter just nu. Köra Weekly Growth Analysis i Engine Room för att leta efter nya.";
  }
  return open.map((o, i) => `${i + 1}. ${o.title}`).join(" ");
}

export function answerQuestion(
  question: string,
  bundle: CognyBundle | null,
  opportunities: Opportunity[]
): string {
  if (!bundle) {
    return "Det finns ingen Cogny-data inladdad ännu. Kör Weekly Growth Analysis i Engine Room först.";
  }
  const q = question.toLowerCase();

  if (q.includes("varför") && (q.includes("trafik") || q.includes("minska") || q.includes("föll") || q.includes("fall"))) {
    return answerTrafficChange(bundle);
  }
  if (q.includes("växer") || q.includes("tillväxt") || (q.includes("kanal") && q.includes("bäst"))) {
    return answerGrowingChannels(bundle);
  }
  if (q.includes("slösa") || q.includes("bortkastad") || q.includes("spara")) {
    return answerWaste(bundle);
  }
  if (q.includes("fokusera") || q.includes("prioritera") || q.includes("denna vecka") || q.includes("göra")) {
    return answerFocus(bundle, opportunities);
  }

  return "Den frågan täcks inte av v1 ännu. Prova att fråga om trafikförändringar, växande kanaler, bortkastad spend eller vad som bör prioriteras denna vecka.";
}
