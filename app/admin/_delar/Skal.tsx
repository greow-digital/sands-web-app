"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { LayoutDashboard, LogOut, Mail, Search, SquareKanban, Users } from "lucide-react";
import { loggaUt } from "../actions";

type Antal = { attGora: number; utskick: number };

const MENY = [
  { href: "/admin", text: "Översikt", ikon: LayoutDashboard, antal: null },
  { href: "/admin/leads", text: "Leads", ikon: Users, antal: "attGora" },
  { href: "/admin/pipeline", text: "Pipeline", ikon: SquareKanban, antal: null },
  { href: "/admin/utskick", text: "Utskick", ikon: Mail, antal: "utskick" },
] as const;

function aktiv(path: string, href: string) {
  if (href === "/admin") return path === "/admin";
  // Leadvyn hör till Leads i menyn.
  if (href === "/admin/leads") return path.startsWith("/admin/leads") || path.startsWith("/admin/lead/");
  return path.startsWith(href);
}

export default function Skal({ namn, demo, antal, children }: { namn: string; demo: boolean; antal: Antal; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const sok = useRef<HTMLInputElement>(null);

  // "/" eller ⌘K hoppar till sökfältet, som i de flesta CRM.
  useEffect(() => {
    const tangent = (e: KeyboardEvent) => {
      const iFalt = e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !iFalt)) {
        e.preventDefault();
        sok.current?.focus();
        sok.current?.select();
      }
    };
    window.addEventListener("keydown", tangent);
    return () => window.removeEventListener("keydown", tangent);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidomeny, dator */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid size-8 place-items-center rounded-lg bg-slate-900 font-heading text-sm font-extrabold text-white">S</span>
          <span className="leading-tight">
            <span className="block font-heading text-sm font-bold">Sands</span>
            <span className="block text-xs text-slate-500">Säljstöd</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-0.5 px-3">
          {MENY.map(({ href, text, ikon: Ikon, antal: nyckel }) => {
            const a = aktiv(path, href);
            const n = nyckel ? antal[nyckel] : 0;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  a ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Ikon className={`size-4 ${a ? "text-primary" : "text-slate-400"}`} />
                {text}
                {n > 0 && (
                  <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">{n}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <form action={loggaUt} className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {namn.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{namn}</span>
            <button title="Logga ut" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <LogOut className="size-4" />
            </button>
          </div>
        </form>
      </aside>

      <div className="lg:pl-60">
        {/* Toppfält */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          {demo && (
            <p className="bg-amber-100 px-4 py-1 text-center text-xs font-medium text-amber-900">Demoläge: exempeldata, inget skrivs till arket.</p>
          )}
          <div className="flex items-center gap-3 px-4 py-2.5 lg:px-8">
            <Link href="/admin" className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-900 font-heading text-sm font-extrabold text-white lg:hidden">
              S
            </Link>
            <form
              className="relative w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                const q = sok.current?.value.trim() ?? "";
                router.push(q ? `/admin/leads?vy=alla&q=${encodeURIComponent(q)}` : "/admin/leads");
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={sok}
                type="search"
                placeholder="Sök namn, telefon, adress..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
                ⌘K
              </kbd>
            </form>
            <form action={loggaUt} className="ml-auto lg:hidden">
              <button title="Logga ut" className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* Bottenmeny, mobil. Säljaren är ofta ute på tak. */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {MENY.map(({ href, text, ikon: Ikon, antal: nyckel }) => {
          const a = aktiv(path, href);
          const n = nyckel ? antal[nyckel] : 0;
          return (
            <Link key={href} href={href} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${a ? "text-primary" : "text-slate-500"}`}>
              <Ikon className="size-5" />
              {text}
              {n > 0 && (
                <span className="absolute left-1/2 top-1.5 ml-2 rounded-full bg-accent px-1.5 text-[10px] font-bold leading-4 text-white">{n}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
