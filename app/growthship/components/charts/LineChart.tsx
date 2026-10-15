"use client";

import { useRef, useState } from "react";
import { linearScale, niceTicks } from "./scales";

interface Row {
  date: string;
  value: number | null;
}

const W = 640;

export default function LineChart({
  rows,
  color,
  height = 160,
  invert = false,
  yFormat = (n: number) => String(Math.round(n)),
  tipFormat = (n: number) => String(n),
  dayFormat,
  name,
}: {
  rows: Row[];
  color: string;
  height?: number;
  invert?: boolean;
  yFormat?: (n: number) => string;
  tipFormat?: (n: number) => string;
  dayFormat: (date: string) => string;
  name: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; title: string; value: string } | null>(null);

  const H = height;
  const ml = 40;
  const mr = 6;
  const values = rows.map((r) => r.value).filter((v): v is number => v != null);
  const lo = invert ? Math.min(...values) : 0;
  const hi = Math.max(...values, 1);
  const ticks = niceTicks(hi, 3);
  const domain: [number, number] = invert ? [hi, lo] : [lo, hi];
  const y = linearScale(domain, [H - 22, 8]);
  const x = linearScale([0, rows.length - 1], [ml, W - mr]);

  const points = rows
    .map((r, i) => (r.value == null ? null : `${x(i)},${y(r.value)}`))
    .filter((p): p is string => p !== null);

  function handleMove(e: React.MouseEvent<SVGRectElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = W / rect.width;
    const localX = (e.clientX - rect.left) * scale;
    const i = Math.max(0, Math.min(rows.length - 1, Math.round((localX - ml) / ((W - mr - ml) / (rows.length - 1)))));
    const r = rows[i];
    if (!r) return;
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      title: dayFormat(r.date),
      value: r.value == null ? "No data" : tipFormat(r.value),
    });
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={ml} x2={W - mr} y1={y(t)} y2={y(t)} stroke="var(--gs-border)" strokeWidth={1} />
            <text x={ml - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill="var(--gs-text-faint)">
              {yFormat(t)}
            </text>
          </g>
        ))}
        <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <rect
          x={ml}
          y={0}
          width={W - mr - ml}
          height={H}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setTip(null)}
        />
      </svg>
      {tip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tip.x + 10, (containerRef.current?.clientWidth ?? W) - 140),
            top: Math.max(0, tip.y - 40),
            background: "var(--gs-surface-hover)",
            border: "1px solid var(--gs-border)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 12,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          <div style={{ color: "var(--gs-text-muted)", marginBottom: 3 }}>{tip.title}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--gs-text-muted)" }}>{name}</span>
            <b style={{ marginLeft: "auto" }}>{tip.value}</b>
          </div>
        </div>
      )}
    </div>
  );
}
