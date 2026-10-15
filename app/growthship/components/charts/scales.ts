// Minimal scale helpers, enough for this report's bar/line charts. Not a
// general charting library: no new dependency for a handful of charts.

export function linearScale(
  domain: [number, number],
  range: [number, number]
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (v: number) => r0 + ((v - d0) / span) * (r1 - r0);
}

export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const step = niceStep(max / count);
  const ticks: number[] = [];
  for (let t = 0; t <= max + step / 2; t += step) ticks.push(Math.round(t * 100) / 100);
  return ticks;
}

function niceStep(rough: number): number {
  const exp = Math.floor(Math.log10(rough));
  const base = Math.pow(10, exp);
  const frac = rough / base;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * base;
}

export function bandPositions(count: number, range: [number, number], paddingRatio = 0.2) {
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, count);
  const bandwidth = step * (1 - paddingRatio);
  return {
    x: (i: number) => r0 + i * step + (step - bandwidth) / 2,
    bandwidth,
    step,
  };
}
