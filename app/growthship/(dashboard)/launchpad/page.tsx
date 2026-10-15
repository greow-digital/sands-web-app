import Link from "next/link";
import { listLaunchpadItems } from "@/lib/growthship/store/db";
import LaunchpadBoard from "../../components/LaunchpadBoard";

export const metadata = { title: "The Launchpad" };

export default async function LaunchpadPage() {
  const items = await listLaunchpadItems();

  return (
    <div>
      <header
        className="gs-page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}
      >
        <div>
          <h1 className="gs-page-title">The Launchpad</h1>
          <p className="gs-page-desc">
            Gör möjligheter till handling. Dra korten från Backlog hela vägen till Utvärderad.
          </p>
        </div>
        <Link href="/growthship/radar" className="gs-btn">
          Hämta fler från The Radar
        </Link>
      </header>

      <LaunchpadBoard items={items} />
    </div>
  );
}
