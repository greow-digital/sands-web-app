"use client";

import Link from "next/link";
import type { MarketingReport } from "@/lib/growthship/reporting/types";
import BarChart from "../../../components/charts/BarChart";
import LineChart from "../../../components/charts/LineChart";
import SortableTable, { TableColumn } from "../../../components/SortableTable";
import {
  METRICS,
  dayLabelLong,
  fChg,
  fCompact,
  fInt,
  fPct,
  fPos,
  fSek,
  fSek2,
  show,
} from "../../../components/reportFormat";
import { dayRange } from "@/lib/growthship/reporting/days";

const PALETTE = ["#5b8cff", "#3ecf8e", "#e8b14a", "#f06a6a", "#b98cf2", "#4ec9d6", "#f2a65a"];
const MUTED = "#3a3d44";

export default function ReportView({ report }: { report: MarketingReport }) {
  const kpiByMetric = new Map<string, (typeof report.kpis)[number]>(report.kpis.map((k) => [k.metric, k]));
  const k = (metric: string) => kpiByMetric.get(metric);
  const fmtK = (metric: string, field: "current" | "previous" | "change") => {
    const row = k(metric);
    if (!row) return "-";
    const v = row[field];
    if (v == null) return field === "change" ? "n/a" : "-";
    if (field === "change") return fChg(v);
    return METRICS[metric].fmt(v);
  };

  // ---- sessions-by-channel chart: top 7 channels, rest muted, filled daily ----
  const adsDates = report.dailyAds.map((r) => r.date);
  const chartStart = adsDates[0];
  const chartEnd = adsDates[adsDates.length - 1];
  const days = dayRange(chartStart, chartEnd);

  const totalsByChannel = new Map<string, number>();
  report.dailyChannelSessions.forEach((r) => {
    totalsByChannel.set(r.channel, (totalsByChannel.get(r.channel) ?? 0) + r.sessions);
  });
  const channelOrder = [...totalsByChannel.keys()].sort(
    (a, b) => (totalsByChannel.get(b) ?? 0) - (totalsByChannel.get(a) ?? 0)
  );
  const channelColors = new Map(channelOrder.map((c, i) => [c, i < 7 ? PALETTE[i] : MUTED]));

  const sessionsByDay = new Map(days.map((d) => [d, { date: d } as { date: string } & Record<string, number>]));
  channelOrder.forEach((c) => sessionsByDay.forEach((row) => (row[c] = 0)));
  report.dailyChannelSessions.forEach((r) => {
    const row = sessionsByDay.get(r.date);
    if (row) row[r.channel] = (Number(row[r.channel]) || 0) + r.sessions;
  });
  const sessionsRows = [...sessionsByDay.values()];
  const sessionsSeries = channelOrder.map((c) => ({ key: c, color: channelColors.get(c)!, label: c }));

  // ---- leads chart ----
  const leadsByDay = new Map(days.map((d) => [d, { date: d, form_submit: 0, phone_click: 0 }]));
  report.dailyLeads.forEach((r) => {
    const row = leadsByDay.get(r.date);
    if (row) {
      row.form_submit += r.formSubmit;
      row.phone_click += r.phoneClick;
    }
  });
  const leadsRows = [...leadsByDay.values()];

  // ---- ads spend chart ----
  const adsRows = report.dailyAds.map((r) => ({
    date: r.date,
    cost: r.costSek,
    clicks: r.clicks,
    conversions: r.conversions,
  }));

  const channelCols: TableColumn<MarketingReport["channels"][number]>[] = [
    { key: "channel", label: "Kanal", get: (r) => r.channel },
    { key: "sessions", label: "Sessioner", numeric: true, get: (r) => r.sessions, format: (r) => fInt(r.sessions) },
    {
      key: "change",
      label: "Förändring",
      numeric: true,
      get: (r) => r.change,
      format: (r) => (r.change == null ? "n/a" : fChg(r.change)),
      better: 1,
    },
    {
      key: "engagement",
      label: "Engagerade",
      numeric: true,
      get: (r) => r.engagementRate,
      format: (r) => show(fPct)(r.engagementRate),
    },
    { key: "leads", label: "Leads", numeric: true, get: (r) => r.leads, format: (r) => fInt(r.leads) },
  ];

  const landingCols: TableColumn<MarketingReport["landingPages"][number]>[] = [
    { key: "page", label: "Landningssida", get: (r) => r.page },
    { key: "sessions", label: "Sessioner", numeric: true, get: (r) => r.sessions, format: (r) => fInt(r.sessions) },
    {
      key: "engagement",
      label: "Engagerade",
      numeric: true,
      get: (r) => r.engagementRate,
      format: (r) => show(fPct)(r.engagementRate),
    },
    { key: "leads", label: "Leads", numeric: true, get: (r) => r.leads, format: (r) => fInt(r.leads) },
  ];

  const campaignCols: TableColumn<MarketingReport["campaigns"][number]>[] = [
    { key: "campaign", label: "Kampanj", get: (r) => r.campaign },
    { key: "bidding", label: "Budstrategi", get: (r) => r.bidding },
    { key: "cost", label: "Spend", numeric: true, get: (r) => r.costSek, format: (r) => fSek(r.costSek) },
    { key: "clicks", label: "Klick", numeric: true, get: (r) => r.clicks, format: (r) => fInt(r.clicks) },
    { key: "ctr", label: "CTR", numeric: true, get: (r) => r.ctr, format: (r) => show(fPct)(r.ctr) },
    { key: "conversions", label: "Konv.", numeric: true, get: (r) => r.conversions, format: (r) => fInt(r.conversions) },
    { key: "cpa", label: "Kostnad/konv.", numeric: true, get: (r) => r.cpaSek, format: (r) => show(fSek)(r.cpaSek) },
  ];

  const termsCols: TableColumn<MarketingReport["searchTerms"][number]>[] = [
    { key: "term", label: "Sökterm", get: (r) => r.term },
    { key: "cost", label: "Spend", numeric: true, get: (r) => r.costSek, format: (r) => fSek(r.costSek) },
    { key: "clicks", label: "Klick", numeric: true, get: (r) => r.clicks, format: (r) => fInt(r.clicks) },
    { key: "cpc", label: "CPC", numeric: true, get: (r) => r.cpcSek, format: (r) => show(fSek2)(r.cpcSek) },
    { key: "conversions", label: "Konv.", numeric: true, get: (r) => r.conversions, format: (r) => fInt(r.conversions) },
  ];

  const queryCols: TableColumn<MarketingReport["queries"][number]>[] = [
    { key: "query", label: "Sökfras", get: (r) => r.query },
    { key: "clicks", label: "Klick", numeric: true, get: (r) => r.clicks, format: (r) => fInt(r.clicks) },
    { key: "impressions", label: "Visningar", numeric: true, get: (r) => r.impressions, format: (r) => fInt(r.impressions) },
    { key: "ctr", label: "CTR", numeric: true, get: (r) => r.ctr, format: (r) => show(fPct)(r.ctr) },
    { key: "position", label: "Pos.", numeric: true, get: (r) => r.position, format: (r) => fPos(r.position) },
  ];

  const pageCols: TableColumn<MarketingReport["pages"][number]>[] = [
    { key: "page", label: "Sida", get: (r) => r.page },
    { key: "clicks", label: "Klick", numeric: true, get: (r) => r.clicks, format: (r) => fInt(r.clicks) },
    { key: "impressions", label: "Visningar", numeric: true, get: (r) => r.impressions, format: (r) => fInt(r.impressions) },
    { key: "ctr", label: "CTR", numeric: true, get: (r) => r.ctr, format: (r) => show(fPct)(r.ctr) },
    { key: "position", label: "Pos.", numeric: true, get: (r) => r.position, format: (r) => fPos(r.position) },
  ];

  return (
    <div>
      <header className="gs-page-header">
        <h1 className="gs-page-title">Sands marketing &amp; web</h1>
        <p className="gs-page-desc" style={{ maxWidth: "62rem", lineHeight: 1.6 }}>
          Under de senaste 28 dagarna fick sandsab.se <b>{fmtK("leads", "current")}</b> leads (
          {fmtK("leads", "change")} mot de 28 dagarna innan) från <b>{fmtK("sessions", "current")}</b>{" "}
          sessioner. Google Ads spenderade <b>{fmtK("ads_cost", "current")}</b> till{" "}
          <b>{fmtK("ads_cpa", "current")}</b> per konvertering, och organisk sökning gav{" "}
          <b>{fmtK("organic_clicks", "current")}</b> klick.
        </p>
        <p style={{ fontSize: 12.5, color: "var(--gs-text-faint)", marginTop: 6 }}>{report.windowNote}</p>
      </header>

      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        <Link href="/growthship/radar" className="gs-btn" data-variant="ghost">
          Möjligheter
        </Link>
        <Link href="/growthship/radar/report" className="gs-btn" data-variant="primary">
          Rapport
        </Link>
      </div>

      <section className="gs-card-row" style={{ marginBottom: 36 }}>
        {(["leads", "sessions", "ads_cost", "ads_conversions", "ads_cpa", "organic_clicks"] as const).map((m) => (
          <div key={m} className="gs-card" style={{ flex: "1 1 150px" }}>
            <div className="gs-metric-label">
              {{
                leads: "Leads (form + telefon)",
                sessions: "Sessioner",
                ads_cost: "Annonsspend",
                ads_conversions: "Annonskonv.",
                ads_cpa: "Kostnad/konv.",
                organic_clicks: "Organiska klick",
              }[m]}
            </div>
            <div className="gs-metric-value">{fmtK(m, "current")}</div>
            <div className="gs-metric-change" data-direction={(k(m)?.change ?? 0) >= 0 ? "up" : "down"}>
              {fmtK(m, "change")} · förra {fmtK(m, "previous")}
            </div>
          </div>
        ))}
      </section>

      <section className="gs-section" style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Webbtrafik och leads</div>
        <div className="gs-card-row" style={{ marginBottom: 14 }}>
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 2 }}>Sessioner per dag, per kanal</h3>
            <p style={{ fontSize: 11.5, color: "var(--gs-text-faint)", margin: "0 0 8px" }}>Senaste {days.length} dagarna</p>
            <BarChart
              rows={sessionsRows}
              series={sessionsSeries}
              yFormat={fInt}
              dayFormat={dayLabelLong}
              tooltipFormat={(r) => [
                ...sessionsSeries
                  .filter((s) => Number(r[s.key]) > 0)
                  .map((s) => ({ color: s.color, name: s.label, value: fInt(Number(r[s.key])) })),
                { name: "Totalt", value: fInt(sessionsSeries.reduce((sum, s) => sum + Number(r[s.key] || 0), 0)) },
              ]}
            />
          </div>
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 2 }}>Leads per dag</h3>
            <p style={{ fontSize: 11.5, color: "var(--gs-text-faint)", margin: "0 0 8px" }}>Formulär och telefonklick</p>
            <BarChart
              rows={leadsRows}
              series={[
                { key: "form_submit", color: PALETTE[0], label: "Formulär" },
                { key: "phone_click", color: PALETTE[1], label: "Telefonklick" },
              ]}
              yFormat={(n) => String(Math.round(n))}
              dayFormat={dayLabelLong}
              tooltipFormat={(r) => [
                { color: PALETTE[0], name: "Formulär", value: fInt(Number(r.form_submit)) },
                { color: PALETTE[1], name: "Telefonklick", value: fInt(Number(r.phone_click)) },
              ]}
            />
          </div>
        </div>
        <div className="gs-card-row">
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Kanaler</h3>
            <SortableTable rows={report.channels} columns={channelCols} rowKey={(r) => r.channel} defaultSortKey="sessions" />
          </div>
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Toppsidor (landningssidor)</h3>
            <SortableTable rows={report.landingPages} columns={landingCols} rowKey={(r) => r.page} defaultSortKey="sessions" />
          </div>
        </div>
      </section>

      <section className="gs-section" style={{ marginBottom: 36 }}>
        <div className="gs-section-title">Google Ads</div>
        <div className="gs-card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 13.5, marginBottom: 2 }}>Spend per dag</h3>
          <p style={{ fontSize: 11.5, color: "var(--gs-text-faint)", margin: "0 0 8px" }}>
            En prick markerar en dag med konverteringar.
          </p>
          <BarChart
            rows={adsRows}
            series={[{ key: "cost", color: PALETTE[0], label: "Spend" }]}
            yFormat={(n) => `${fCompact(n)} kr`}
            dayFormat={dayLabelLong}
            dotsKey="conversions"
            dotColor={PALETTE[2]}
            tooltipFormat={(r) => [
              { color: PALETTE[0], name: "Spend", value: fSek(Number(r.cost)) },
              { name: "Klick", value: fInt(Number(r.clicks)) },
              { color: PALETTE[2], name: "Konverteringar", value: fInt(Number(r.conversions)) },
            ]}
          />
        </div>
        <div className="gs-card-row">
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Kampanjer</h3>
            <SortableTable rows={report.campaigns} columns={campaignCols} rowKey={(r) => r.campaign} defaultSortKey="cost" />
          </div>
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Toppsökningar efter spend</h3>
            <SortableTable rows={report.searchTerms} columns={termsCols} rowKey={(r) => r.term} defaultSortKey="cost" />
          </div>
        </div>
      </section>

      <section className="gs-section">
        <div className="gs-section-title">Organisk sökning</div>
        <div className="gs-card-row" style={{ marginBottom: 14 }}>
          <div className="gs-card" style={{ flex: "1 1 200px" }}>
            <h3 style={{ fontSize: 13, marginBottom: 8 }}>Klick per dag</h3>
            <BarChart
              rows={report.dailySearch.map((r) => ({ date: r.date, clicks: r.clicks }))}
              series={[{ key: "clicks", color: PALETTE[0], label: "Klick" }]}
              height={160}
              yFormat={(n) => String(Math.round(n))}
              dayFormat={dayLabelLong}
              tooltipFormat={(r) => [{ name: "Klick", value: fInt(Number(r.clicks)) }]}
            />
          </div>
          <div className="gs-card" style={{ flex: "1 1 200px" }}>
            <h3 style={{ fontSize: 13, marginBottom: 8 }}>Visningar per dag</h3>
            <LineChart
              rows={report.dailySearch.map((r) => ({ date: r.date, value: r.impressions }))}
              color={PALETTE[1]}
              height={160}
              yFormat={fCompact}
              tipFormat={fInt}
              dayFormat={dayLabelLong}
              name="Visningar"
            />
          </div>
          <div className="gs-card" style={{ flex: "1 1 200px" }}>
            <h3 style={{ fontSize: 13, marginBottom: 8 }}>Snittposition</h3>
            <LineChart
              rows={report.dailySearch.map((r) => ({ date: r.date, value: r.position }))}
              color={PALETTE[3]}
              height={160}
              invert
              yFormat={(n) => n.toFixed(0)}
              tipFormat={fPos}
              dayFormat={dayLabelLong}
              name="Snittposition"
            />
          </div>
        </div>
        <div className="gs-card-row">
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Toppfraser</h3>
            <SortableTable rows={report.queries} columns={queryCols} rowKey={(r) => r.query} defaultSortKey="clicks" />
          </div>
          <div className="gs-card" style={{ flex: "1 1 320px" }}>
            <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>Toppsidor</h3>
            <SortableTable rows={report.pages} columns={pageCols} rowKey={(r) => r.page} defaultSortKey="clicks" />
          </div>
        </div>
      </section>
    </div>
  );
}
