"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LaunchpadItem, LaunchpadStatus } from "@/lib/growthship/types";
import { Badge } from "./Badge";

const STATUSES: LaunchpadStatus[] = ["Backlog", "Planned", "In progress", "Shipped", "Completed"];

async function patch(id: string, body: Record<string, string>) {
  await fetch("/api/growthship/launchpad", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...body }),
  });
}

function LaunchpadCard({ item }: { item: LaunchpadItem }) {
  const router = useRouter();
  const [result, setResult] = useState(item.result ?? "");
  const [learning, setLearning] = useState(item.learning ?? "");
  const [savingLearning, setSavingLearning] = useState(false);

  async function changeStatus(status: LaunchpadStatus) {
    await patch(item.id, { status });
    router.refresh();
  }

  async function saveLearning() {
    setSavingLearning(true);
    await patch(item.id, { result, learning });
    setSavingLearning(false);
    router.refresh();
  }

  return (
    <div className="gs-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div className="gs-opportunity-title">{item.title}</div>
        <select
          className="gs-input"
          style={{ width: "auto", fontSize: 12.5 }}
          value={item.status}
          onChange={(e) => changeStatus(e.target.value as LaunchpadStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <p className="gs-opportunity-desc">{item.hypothesis}</p>
      <div className="gs-opportunity-meta">
        <Badge tone="medium">Impact {item.expectedImpact}</Badge>
        <Badge tone="low">Effort {item.effort}</Badge>
      </div>

      {(item.status === "Shipped" || item.status === "Completed") && (
        <div style={{ borderTop: "1px solid var(--gs-border)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea
            className="gs-input"
            placeholder="Resultat (vad hände?)"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={2}
          />
          <textarea
            className="gs-input"
            placeholder="Lärdom (vad tar vi med oss?)"
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            rows={2}
          />
          <button className="gs-btn" disabled={savingLearning} onClick={saveLearning} style={{ alignSelf: "flex-start" }}>
            {savingLearning ? "Sparar..." : "Spara"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LaunchpadBoard({ items }: { items: LaunchpadItem[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {STATUSES.map((status) => {
        const inStatus = items.filter((i) => i.status === status);
        if (inStatus.length === 0) return null;
        return (
          <div key={status}>
            <div className="gs-section-title">
              {status} ({inStatus.length})
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 14,
              }}
            >
              {inStatus.map((item) => (
                <LaunchpadCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
