"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/growthship/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Fel lösenord.");
      return;
    }
    router.push(params.get("next") || "/growthship");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit} className="gs-card" style={{ width: 320 }}>
        <h1 style={{ fontSize: 18, marginBottom: 4 }}>The Growthship</h1>
        <p className="gs-page-desc" style={{ marginBottom: 20 }}>
          Lösenord krävs.
        </p>
        <input
          type="password"
          className="gs-input"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && (
          <p style={{ color: "var(--gs-danger)", fontSize: 13, marginTop: 10 }}>{error}</p>
        )}
        <button
          type="submit"
          className="gs-btn"
          data-variant="primary"
          disabled={loading}
          style={{ width: "100%", marginTop: 16 }}
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
