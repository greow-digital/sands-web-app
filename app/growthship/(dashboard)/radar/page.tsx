import Link from "next/link";
import { listOpportunities } from "@/lib/growthship/store/db";
import type { OpportunityStatus } from "@/lib/growthship/types";
import OpportunityCard from "../../components/OpportunityCard";
import EmptyState from "../../components/EmptyState";

export const metadata = { title: "The Radar" };

const TABS: { key: string; label: string }[] = [
  { key: "open", label: "Öppna" },
  { key: "All", label: "Alla" },
  { key: "Accepted", label: "Accepterade" },
  { key: "Shipped", label: "Shippade" },
  { key: "Dismissed", label: "Avfärdade" },
];

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status = statusParam ?? "open";
  const all = await listOpportunities();

  const filtered = all
    .filter((o) => {
      if (status === "All") return true;
      if (status === "open") return o.status === "New" || o.status === "Reviewing";
      return o.status === (status as OpportunityStatus);
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">The Radar</h1>
        <p className="gs-page-desc">Hitta vad som förtjänar uppmärksamhet.</p>
      </header>

      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/growthship/radar?status=${tab.key}`}
            className="gs-btn"
            data-variant={status === tab.key ? "primary" : "ghost"}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            all.length === 0
              ? "Inga möjligheter upptäckta ännu."
              : "Inget i den här vyn just nu."
          }
          action={
            all.length === 0 ? (
              <Link href="/growthship/engine-room" className="gs-btn" data-variant="primary">
                Kör Growth Analysis
              </Link>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
