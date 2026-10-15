"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RunAnalysisButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "done" | "blocked">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setStatus("running");
    setMessage(null);
    const res = await fetch("/api/growthship/analysis-runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const data = await res.json();
    if (res.status === 501) {
      setStatus("blocked");
      setMessage(data.message);
      return;
    }
    setStatus("done");
    setMessage(data.run?.summary ?? "Klar.");
    router.refresh();
  }

  return (
    <div>
      <button className="gs-btn" data-variant="primary" disabled={status === "running"} onClick={run}>
        {status === "running" ? "Analyserar..." : "Kör analys"}
      </button>
      {message && (
        <p
          style={{
            marginTop: 10,
            fontSize: 13,
            color: status === "blocked" ? "var(--gs-warning)" : "var(--gs-text-muted)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
