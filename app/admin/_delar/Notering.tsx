"use client";

import { useRef, useState, useTransition } from "react";
import { snabbLogg } from "../actions";

const MALL = ["Vill bli uppringd efter kl 16", "Skickat bilder på taket", "Väntar på grannar/förening", "Jämför med andra firmor"];

/** Skriv en rad i historiken. ⌘+Enter sparar. */
export default function Notering({ id }: { id: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const falt = useRef<HTMLTextAreaElement>(null);

  const spara = () => {
    const t = text.trim();
    if (!t) return;
    start(async () => {
      await snabbLogg(id, t);
      setText("");
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
      <textarea
        ref={falt}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            spara();
          }
        }}
        rows={2}
        placeholder="Skriv en anteckning från samtalet..."
        className="block w-full resize-none rounded-t-xl bg-transparent px-3.5 py-3 text-sm outline-none placeholder:text-slate-400"
      />
      <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 px-2.5 py-2">
        {MALL.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setText((t) => (t ? `${t} ${m}` : m));
              falt.current?.focus();
            }}
            className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          disabled={pending || !text.trim()}
          onClick={spara}
          className="ml-auto rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
        >
          {pending ? "Sparar..." : "Spara anteckning"}
        </button>
      </div>
    </div>
  );
}
