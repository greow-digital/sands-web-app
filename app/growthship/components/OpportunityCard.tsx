"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Opportunity } from "@/lib/growthship/types";
import { Badge, RatingBadge } from "./Badge";

async function patchOpportunity(id: string, status: Opportunity["status"]) {
  await fetch("/api/growthship/opportunities", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
}

async function sendToLaunchpad(o: Opportunity) {
  await fetch("/api/growthship/launchpad", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      opportunityId: o.id,
      title: o.title,
      hypothesis: o.recommendation,
    }),
  });
}

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function act(fn: () => Promise<void>) {
    setPending(true);
    await fn();
    setPending(false);
    router.refresh();
  }

  return (
    <div className="gs-opportunity-card">
      <div className="gs-opportunity-meta">
        <Badge>{opportunity.category}</Badge>
        {opportunity.status !== "New" && (
          <Badge tone={opportunity.status === "Dismissed" ? "low" : "neutral"}>
            {opportunity.status}
          </Badge>
        )}
      </div>
      <div className="gs-opportunity-title">{opportunity.title}</div>
      <div className="gs-opportunity-desc">{opportunity.description}</div>
      <div className="gs-opportunity-meta">
        <RatingBadge label="Impact" value={opportunity.impact} />
        <RatingBadge label="Confidence" value={opportunity.confidence} />
        <RatingBadge label="Effort" value={opportunity.effort} />
      </div>

      <details>
        <summary style={{ cursor: "pointer", fontSize: 12.5, color: "var(--gs-text-muted)" }}>
          Varför, och vad bör göras?
        </summary>
        <div className="gs-opportunity-evidence" style={{ marginTop: 10 }}>
          <strong style={{ color: "var(--gs-text-muted)" }}>Underlag: </strong>
          {opportunity.evidence}
          <br />
          <strong style={{ color: "var(--gs-text-muted)" }}>Rekommendation: </strong>
          {opportunity.recommendation}
          <br />
          <span style={{ opacity: 0.7 }}>Källa: {opportunity.source}</span>
        </div>
      </details>

      {(opportunity.status === "New" || opportunity.status === "Reviewing") && (
        <div className="gs-opportunity-actions">
          {opportunity.status === "New" && (
            <button
              className="gs-btn"
              disabled={pending}
              onClick={() => act(() => patchOpportunity(opportunity.id, "Reviewing"))}
            >
              Granska
            </button>
          )}
          <button
            className="gs-btn"
            data-variant="primary"
            disabled={pending}
            onClick={() => act(() => sendToLaunchpad(opportunity))}
          >
            Skicka till Launchpad
          </button>
          <button
            className="gs-btn"
            data-variant="ghost"
            disabled={pending}
            onClick={() => act(() => patchOpportunity(opportunity.id, "Dismissed"))}
          >
            Avfärda
          </button>
        </div>
      )}
      {opportunity.status === "Dismissed" && (
        <div className="gs-opportunity-actions">
          <button
            className="gs-btn"
            disabled={pending}
            onClick={() => act(() => patchOpportunity(opportunity.id, "New"))}
          >
            Återöppna
          </button>
        </div>
      )}
    </div>
  );
}
