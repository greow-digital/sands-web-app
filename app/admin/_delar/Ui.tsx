/* Små byggstenar som alla vyer i backofficet delar. */
import Link from "next/link";
import { Phone } from "lucide-react";
import { telHref } from "@/lib/backoffice/lead";

export function Kort({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>{children}</section>;
}

export function KortRubrik({ titel, under, hoger }: { titel: string; under?: React.ReactNode; hoger?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-slate-900">{titel}</h2>
        {under && <p className="mt-0.5 text-xs text-slate-500">{under}</p>}
      </div>
      {hoger}
    </div>
  );
}

export function Sidrubrik({ titel, under, hoger }: { titel: string; under?: React.ReactNode; hoger?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">{titel}</h1>
        {under && <p className="mt-1 text-sm text-slate-500">{under}</p>}
      </div>
      {hoger}
    </div>
  );
}

/** Ringknappen. Primär åtgärd överallt där en lead syns. */
export function RingKnapp({ telefon, text }: { telefon: string; text?: boolean }) {
  const href = telHref(telefon);
  if (!href) return null;
  return text ? (
    <a href={href} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 hover:bg-primary-hover">
      <Phone className="size-4" /> Ring {href.slice(4)}
    </a>
  ) : (
    <a href={href} title={`Ring ${telefon}`} className="grid size-8 place-items-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover">
      <Phone className="size-4" />
    </a>
  );
}

export function Tom({ titel, text, lank }: { titel: string; text?: string; lank?: { href: string; text: string } }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-semibold text-slate-700">{titel}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      {lank && (
        <Link href={lank.href} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          {lank.text}
        </Link>
      )}
    </div>
  );
}

export function ArkFel({ err }: { err: unknown }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm">
      <p className="font-semibold text-red-900">Kunde inte läsa arket.</p>
      <p className="mt-1 text-red-800/80">{err instanceof Error ? err.message : String(err)}</p>
    </div>
  );
}
