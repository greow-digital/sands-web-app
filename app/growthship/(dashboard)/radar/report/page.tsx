import Link from "next/link";
import { getReport } from "@/lib/growthship/store/db";
import EmptyState from "../../../components/EmptyState";
import ReportView from "./ReportView";

export const metadata = { title: "Rapport" };

export default async function ReportPage() {
  const report = await getReport();

  if (!report) {
    return (
      <div>
        <header className="gs-page-header">
          <h1 className="gs-page-title">Rapport</h1>
          <p className="gs-page-desc">En djupare marknadsrapport från Cogny.</p>
        </header>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          <Link href="/growthship/radar" className="gs-btn" data-variant="ghost">
            Möjligheter
          </Link>
          <Link href="/growthship/radar/report" className="gs-btn" data-variant="primary">
            Rapport
          </Link>
        </div>
        <EmptyState
          title="Ingen rapport inladdad ännu."
          action={
            <span style={{ fontSize: 12.5, color: "var(--gs-text-faint)" }}>
              Be Claude köra <code>npm run growthship:seed-report</code> med färsk Cogny-data.
            </span>
          }
        />
      </div>
    );
  }

  return <ReportView report={report} />;
}
