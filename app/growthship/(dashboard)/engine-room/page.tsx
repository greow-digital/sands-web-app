import { listAnalysisRuns } from "@/lib/growthship/store/db";
import RunAnalysisButton from "../../components/RunAnalysisButton";
import EmptyState from "../../components/EmptyState";

export const metadata = { title: "The Engine Room" };

const FUTURE_WORKFLOWS = [
  "Återkommande SEO-analys",
  "Innehållsworkflows (briefs, utkast, uppdateringar)",
  "Kampanjgenerering för betald annonsering",
  "Lifecycle-workflows (e-post, uppföljning)",
  "Automatiserade growth-agenter som körs på schema",
];

export default async function EngineRoomPage() {
  const runs = await listAnalysisRuns();

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">The Engine Room</h1>
        <p className="gs-page-desc">Bygg och automatisera growth-arbetet.</p>
      </header>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Weekly Growth Analysis</div>
        <div className="gs-card">
          <p style={{ fontSize: 13.5, color: "var(--gs-text-muted)", marginBottom: 14 }}>
            Cogny-data → analysera förändringar → upptäck signaler → generera möjligheter → lägg
            till i The Radar.
          </p>
          <RunAnalysisButton />
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Körningar</div>
        {runs.length > 0 ? (
          <div className="gs-card">
            <table className="gs-table">
              <thead>
                <tr>
                  <th>Typ</th>
                  <th>Startad</th>
                  <th>Sammanfattning</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: "var(--gs-text)" }}>{r.type}</td>
                    <td>{new Date(r.startedAt).toLocaleString("sv-SE")}</td>
                    <td>{r.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Inga körningar ännu." />
        )}
      </section>

      <section>
        <div className="gs-section-title">Framtida workflows</div>
        <div className="gs-card">
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: "var(--gs-text-muted)" }}>
            {FUTURE_WORKFLOWS.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
