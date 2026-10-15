"use client";

import { useState } from "react";

const EXAMPLES = [
  "Varför föll trafiken?",
  "Vilka kanaler växer?",
  "Var slösar vi pengar?",
  "Vad bör jag fokusera på denna vecka?",
];

export default function AskGrowthship() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer(null);
    const res = await fetch("/api/growthship/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });
    const data = await res.json();
    setAnswer(data.answer ?? "Kunde inte svara.");
    setLoading(false);
  }

  return (
    <div className="gs-card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          className="gs-input"
          placeholder="Fråga Growthship något om datan..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="gs-btn" data-variant="primary" disabled={loading} type="submit">
          Fråga
        </button>
      </form>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="gs-btn"
            data-variant="ghost"
            style={{ fontSize: 12 }}
            onClick={() => {
              setQuestion(ex);
              ask(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--gs-text-muted)" }}>Tänker...</p>
      )}
      {answer && !loading && (
        <p
          style={{
            marginTop: 14,
            fontSize: 13.5,
            color: "var(--gs-text)",
            borderTop: "1px solid var(--gs-border)",
            paddingTop: 12,
          }}
        >
          {answer}
        </p>
      )}
    </div>
  );
}
