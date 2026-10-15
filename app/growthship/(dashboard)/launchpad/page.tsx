import Link from "next/link";
import { listLaunchpadItems } from "@/lib/growthship/store/db";
import LaunchpadBoard from "../../components/LaunchpadBoard";
import EmptyState from "../../components/EmptyState";

export const metadata = { title: "The Launchpad" };

export default async function LaunchpadPage() {
  const items = await listLaunchpadItems();

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">The Launchpad</h1>
        <p className="gs-page-desc">Gör möjligheter till handling.</p>
      </header>

      {items.length > 0 ? (
        <LaunchpadBoard items={items} />
      ) : (
        <EmptyState
          title="Inget i The Launchpad ännu."
          action={
            <Link href="/growthship/radar" className="gs-btn" data-variant="primary">
              Gå till The Radar och skicka en möjlighet
            </Link>
          }
        />
      )}
    </div>
  );
}
