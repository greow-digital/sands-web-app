import Link from "next/link";
import { getLatestBundle, listLaunchpadItems, listOpportunities } from "@/lib/growthship/store/db";
import { buildObservations } from "@/lib/growthship/analysis/observations";
import MetricTile from "../components/MetricTile";
import EmptyState from "../components/EmptyState";
import OpportunityCard from "../components/OpportunityCard";
import { Badge } from "../components/Badge";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const [bundle, opportunities, launchpadItems] = await Promise.all([
    getLatestBundle(),
    listOpportunities(),
    listLaunchpadItems(),
  ]);

  const observations = bundle ? buildObservations(bundle) : [];
  const topOpportunities = opportunities
    .filter((o) => o.status === "New" || o.status === "Reviewing")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const activeWork = launchpadItems.filter(
    (i) => i.status === "Ready" || i.status === "Building" || i.status === "Review"
  );

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">Overview</h1>
        <p className="gs-page-desc">Vad bör jag veta om verksamheten just nu?</p>
      </header>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Growth snapshot</div>
        {bundle ? (
          <div className="gs-card-row">
            <MetricTile
              label="Sessioner (30 dagar)"
              value={bundle.snapshot.totalSessions.current}
              change={bundle.snapshot.totalSessions}
            />
            <MetricTile
              label="Konverteringar (30 dagar)"
              value={bundle.snapshot.totalConversions.current}
              change={bundle.snapshot.totalConversions}
            />
            {bundle.adCampaigns.length > 0 && (
              <MetricTile
                label="Annonsspend (30 dagar)"
                value={bundle.adCampaigns.reduce((s, c) => s + c.costSek, 0)}
                format={(n) => `${Math.round(n).toLocaleString("sv-SE")} kr`}
              />
            )}
          </div>
        ) : (
          <EmptyState
            title="Ingen Cogny-data inladdad ännu."
            action={
              <Link href="/growthship/engine-room" className="gs-btn" data-variant="primary">
                Kör Growth Analysis
              </Link>
            }
          />
        )}
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Vad händer</div>
        {observations.length > 0 ? (
          <div className="gs-card">
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
              {observations.map((obs, i) => (
                <li key={i} style={{ color: "var(--gs-text-muted)" }}>
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState title="Inga observationer ännu. Kör en analys för att generera dem." />
        )}
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Möjligheter</div>
        {topOpportunities.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 14,
            }}
          >
            {topOpportunities.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Inga möjligheter upptäckta ännu."
            action={
              <Link href="/growthship/radar" className="gs-btn">
                Gå till The Radar
              </Link>
            }
          />
        )}
      </section>

      <section>
        <div className="gs-section-title">Pågående arbete</div>
        {activeWork.length > 0 ? (
          <div className="gs-card">
            <table className="gs-table">
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Status</th>
                  <th>Förväntad effekt</th>
                </tr>
              </thead>
              <tbody>
                {activeWork.map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: "var(--gs-text)" }}>{item.title}</td>
                    <td>
                      <Badge tone="neutral">{item.status}</Badge>
                    </td>
                    <td>{item.expectedImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Inget pågående arbete i The Launchpad just nu."
            action={
              <Link href="/growthship/launchpad" className="gs-btn">
                Gå till The Launchpad
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
