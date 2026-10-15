import { getLatestBundle } from "@/lib/growthship/store/db";
import { detectChannelTrends } from "@/lib/growthship/analysis/detectors";
import MetricTile from "../../components/MetricTile";
import EmptyState from "../../components/EmptyState";
import AskGrowthship from "../../components/AskGrowthship";

export const metadata = { title: "The Bridge" };

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

export default async function BridgePage() {
  const bundle = await getLatestBundle();

  if (!bundle) {
    return (
      <div>
        <header className="gs-page-header">
          <h1 className="gs-page-title">The Bridge</h1>
          <p className="gs-page-desc">Förstå vad som händer i verksamheten.</p>
        </header>
        <EmptyState title="Ingen Cogny-data inladdad ännu. Kör en Growth Analysis i The Engine Room." />
      </div>
    );
  }

  const { snapshot, searchQueries, funnel, unavailable } = bundle;
  const channelTrends = detectChannelTrends(snapshot.channels);
  const sortedChannels = [...snapshot.channels].sort((a, b) => b.sessions.current - a.sessions.current);

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">The Bridge</h1>
        <p className="gs-page-desc">
          Förstå vad som händer. Period: senaste 30 dagarna mot de 30 dagarna innan.
        </p>
      </header>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Growth overview</div>
        <div className="gs-card-row">
          <MetricTile
            label="Sessioner"
            value={snapshot.totalSessions.current}
            change={snapshot.totalSessions}
          />
          <MetricTile
            label="Konverteringar"
            value={snapshot.totalConversions.current}
            change={snapshot.totalConversions}
          />
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Acquisition</div>
        <div className="gs-card">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Kanal</th>
                <th>Sessioner</th>
                <th>Förändring</th>
                <th>Konverteringar</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {sortedChannels.map((ch) => (
                <tr key={ch.channel}>
                  <td style={{ color: "var(--gs-text)" }}>{ch.channel}</td>
                  <td>{ch.sessions.current}</td>
                  <td
                    style={{
                      color:
                        ch.sessions.changeRatio === null
                          ? undefined
                          : ch.sessions.changeRatio >= 0
                            ? "var(--gs-success)"
                            : "var(--gs-danger)",
                    }}
                  >
                    {ch.sessions.changeRatio === null
                      ? "-"
                      : `${ch.sessions.changeRatio >= 0 ? "+" : ""}${round(ch.sessions.changeRatio * 100)}%`}
                  </td>
                  <td>{ch.conversions.current}</td>
                  <td>{ch.engagementRate !== null ? `${round(ch.engagementRate * 100)}%` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Conversion</div>
        <div className="gs-card">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {funnel.map((stage, i) => {
              const prev = i > 0 ? funnel[i - 1].value : null;
              const rate = prev && prev > 0 ? (stage.value / prev) * 100 : null;
              return (
                <div key={stage.label} style={{ minWidth: 120 }}>
                  <div className="gs-metric-label">{stage.label}</div>
                  <div className="gs-metric-value">{stage.value}</div>
                  <div style={{ fontSize: 11.5, color: "var(--gs-text-faint)", marginTop: 4 }}>
                    {rate !== null ? `${round(rate)}% av föregående steg` : stage.source}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Trends</div>
        {channelTrends.length > 0 ? (
          <div className="gs-card">
            <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5 }}>
              {channelTrends.map((t) => (
                <li key={t.dedupeKey} style={{ color: "var(--gs-text-muted)" }}>
                  {t.title}: {t.evidence}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState title="Inga tydliga trender över tröskelvärdet just nu." />
        )}
        {searchQueries.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--gs-text-faint)", marginTop: 10 }}>
            Fler mönster från sökdata och annonser finns brutna ner i The Radar.
          </p>
        )}
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Ask Growthship</div>
        <AskGrowthship />
      </section>

      {unavailable.length > 0 && (
        <section>
          <div className="gs-section-title">Inte tillgängligt än</div>
          <div className="gs-card">
            <ul style={{ fontSize: 12.5, color: "var(--gs-text-faint)", display: "flex", flexDirection: "column", gap: 6 }}>
              {unavailable.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
