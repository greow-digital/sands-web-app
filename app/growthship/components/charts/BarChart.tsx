"use client";

import { useRef, useState } from "react";
import { bandPositions, linearScale, niceTicks } from "./scales";

export interface BarSeries {
  key: string;
  color: string;
  label: string;
}

interface Row {
  date: string;
  [key: string]: number | string;
}

interface TooltipState {
  x: number;
  y: number;
  title: string;
  lines: { color?: string; name: string; value: string }[];
}

const W = 640;

export default function BarChart({
  rows,
  series,
  height = 220,
  yFormat = (n: number) => String(Math.round(n)),
  dayFormat,
  dotsKey,
  dotColor = "#3ecf8e",
  tooltipFormat,
}: {
  rows: Row[];
  series: BarSeries[];
  height?: number;
  yFormat?: (n: number) => string;
  dayFormat: (date: string) => string;
  dotsKey?: string;
  dotColor?: string;
  tooltipFormat: (row: Row) => { name: string; value: string; color?: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<TooltipState | null>(null);

  const H = height;
  const ml = 40;
  const mr = 4;
  const total = (r: Row) => series.reduce((s, sr) => s + (Number(r[sr.key]) || 0), 0);
  const maxTotal = Math.max(1, ...rows.map(total));
  const ticks = niceTicks(maxTotal, 4);
  const yMax = ticks[ticks.length - 1] || maxTotal;
  const y = linearScale([0, yMax], [H - 22, dotsKey ? 16 : 8]);
  const { x, bandwidth, step } = bandPositions(rows.length, [ml, W - mr]);

  function handleMove(e: React.MouseEvent<SVGRectElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = W / rect.width;
    const localX = (e.clientX - rect.left) * scale;
    const i = Math.max(0, Math.min(rows.length - 1, Math.floor((localX - ml) / step)));
    const r = rows[i];
    if (!r) return;
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      title: dayFormat(r.date),
      lines: tooltipFormat(r),
    });
  }

  return (
    <div
      ref={containerRef}
      className="gs-chart-wrap"
      style={{ position: "relative", width: "100%" }}
    >
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={ml} x2={W - mr} y1={y(t)} y2={y(t)} stroke="var(--gs-border)" strokeWidth={1} />
            <text x={ml - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill="var(--gs-text-faint)">
              {yFormat(t)}
            </text>
          </g>
        ))}
        {rows.map((r, i) => {
          let cum = 0;
          return series.map((s) => {
            const v = Number(r[s.key]) || 0;
            const y0 = y(cum);
            cum += v;
            const y1 = y(cum);
            return (
              <rect
                key={s.key}
                x={x(i)}
                width={bandwidth}
                y={y1}
                height={Math.max(0, y0 - y1)}
                fill={s.color}
              />
            );
          });
        })}
        {dotsKey &&
          rows
            .filter((r) => Number(r[dotsKey]) > 0)
            .map((r, i) => {
              const idx = rows.indexOf(r);
              return (
                <circle
                  key={i}
                  cx={x(idx) + bandwidth / 2}
                  cy={y(total(r)) - 7}
                  r={3}
                  fill={dotColor}
                />
              );
            })}
        <line x1={ml} x2={W - mr} y1={y(0)} y2={y(0)} stroke="var(--gs-text-faint)" strokeWidth={1} />
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
      {series.length > 1 && (
        <div className="gs-legend" style={{ display: "flex", gap: 10, fontSize: 11.5, color: "var(--gs-text-faint)", marginTop: 4 }}>
          {series.map((s) => (
            <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      {tip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tip.x + 10, (containerRef.current?.clientWidth ?? W) - 160),
            top: Math.max(0, tip.y - 50),
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
          {tip.lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {l.color && <i style={{ width: 7, height: 7, borderRadius: 2, background: l.color, display: "inline-block" }} />}
              <span style={{ color: "var(--gs-text-muted)" }}>{l.name}</span>
              <b style={{ marginLeft: "auto" }}>{l.value}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
