import type { Metadata } from "next";
import Link from "next/link";
import { inloggad } from "@/lib/backoffice/session";
import { demolage } from "@/lib/backoffice/ark";
import { loggaUt } from "./actions";

export const metadata: Metadata = {
  title: "Backoffice | Sands",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const namn = await inloggad();
  return (
    <div className="min-h-screen bg-bg-light text-dark">
      {namn && (
        <header className="sticky top-0 z-20 border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
            <Link href="/admin" className="font-heading text-base font-bold">
              Sands backoffice
            </Link>
            <nav className="flex gap-3">
              <Link href="/admin" className="hover:text-primary">
                Leads
              </Link>
              <Link href="/admin/utskick" className="hover:text-primary">
                Utskick
              </Link>
            </nav>
            <form action={loggaUt} className="ml-auto flex items-center gap-3">
              <span className="hidden text-black/50 sm:inline">{namn}</span>
              <button className="text-black/60 hover:text-dark">Logga ut</button>
            </form>
          </div>
          {demolage() && (
            <p className="bg-accent/15 px-4 py-1 text-center text-xs">Demoläge: exempeldata, inget skrivs till arket.</p>
          )}
        </header>
      )}
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
