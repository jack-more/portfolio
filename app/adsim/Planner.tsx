"use client";

import { useMemo, useState } from "react";
import {
  CHANNELS,
  INDUSTRY_CPC,
  formatUsd,
  type Channel,
} from "./benchmarks";
import BarChart, { type ChartItem } from "./BarChart";
import styles from "./page.module.css";

const DURATIONS = [
  { id: "2w", label: "2 weeks", days: 14 },
  { id: "1m", label: "1 month", days: 30 },
  { id: "3m", label: "3 months", days: 90 },
] as const;

interface ChannelResult {
  channel: Channel;
  spend: number;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  rateNote: string;
}

function fmtCompact(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${Math.round(n)}`;
}

export default function Planner() {
  const [budget, setBudget] = useState(10000);
  const [durationId, setDurationId] = useState<(typeof DURATIONS)[number]["id"]>("1m");
  const [industryId, setIndustryId] = useState("shopping");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(CHANNELS.filter((c) => c.defaultOn).map((c) => c.id))
  );

  const duration = DURATIONS.find((d) => d.id === durationId)!;
  const industry = INDUSTRY_CPC.rows.find((r) => r.id === industryId)!;

  function toggleChannel(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // keep at least one channel
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const results: ChannelResult[] = useMemo(() => {
    const chosen = CHANNELS.filter((c) => selected.has(c.id));
    const spendEach = budget / chosen.length;
    return chosen.map((c) => {
      if (c.id === "google-search") {
        const clicks = spendEach / industry.value;
        const impressions = clicks / ((industry.ctr ?? 5) / 100);
        const conversions = clicks * ((industry.cvr ?? 5) / 100);
        return {
          channel: c,
          spend: spendEach,
          impressions,
          clicks,
          conversions,
          rateNote: `${formatUsd(industry.value)} CPC · ${industry.ctr}% CTR (${industry.label})`,
        };
      }
      const impressions = c.cpm ? (spendEach / c.cpm) * 1000 : null;
      const clicks = c.cpc
        ? spendEach / c.cpc
        : c.ctr && impressions
          ? impressions * (c.ctr / 100)
          : null;
      const parts = [];
      if (c.cpm) parts.push(`${formatUsd(c.cpm)} CPM`);
      if (c.cpc) parts.push(`${formatUsd(c.cpc)} CPC`);
      else if (c.ctr) parts.push(`${c.ctr}% CTR`);
      return {
        channel: c,
        spend: spendEach,
        impressions,
        clicks,
        conversions: null,
        rateNote: parts.join(" · "),
      };
    });
  }, [selected, budget, industry]);

  const totals = useMemo(
    () => ({
      impressions: results.reduce((a, r) => a + (r.impressions ?? 0), 0),
      clicks: results.reduce((a, r) => a + (r.clicks ?? 0), 0),
      conversions: results.reduce((a, r) => a + (r.conversions ?? 0), 0),
    }),
    [results]
  );

  const chartData: ChartItem[] = useMemo(
    () =>
      results
        .filter((r) => r.impressions !== null)
        .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
        .map((r) => ({
          id: r.channel.id,
          label: r.channel.label,
          value: r.impressions ?? 0,
          display: fmtCompact(r.impressions ?? 0),
        })),
    [results]
  );

  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of results) map.set(r.channel.sourceName, r.channel.sourceUrl);
    return [...map.keys()];
  }, [results]);

  return (
    <>
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Plan a campaign</div>
          <div className={styles.cardBody}>
            <div className={styles.plannerControls}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Total budget</span>
                <span className={styles.budgetWrap}>
                  <span className={styles.budgetPrefix}>$</span>
                  <input
                    className={styles.numInput}
                    type="number"
                    min={100}
                    step={500}
                    value={budget}
                    onChange={(e) =>
                      setBudget(Math.max(100, Number(e.target.value) || 0))
                    }
                    aria-label="Total budget in dollars"
                  />
                </span>
              </label>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Duration</span>
                <span className={styles.segmented}>
                  {DURATIONS.map((d) => (
                    <button
                      key={d.id}
                      className={durationId === d.id ? styles.segActive : styles.segBtn}
                      onClick={() => setDurationId(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </span>
              </div>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Industry (sets Google Search rates)</span>
                <select
                  className={styles.select}
                  value={industryId}
                  onChange={(e) => setIndustryId(e.target.value)}
                >
                  {INDUSTRY_CPC.rows.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <span className={styles.fieldLabel}>Channels (even split)</span>
            <div className={styles.channelList}>
              {CHANNELS.map((c) => (
                <label
                  key={c.id}
                  className={
                    selected.has(c.id) ? styles.channelRowOn : styles.channelRow
                  }
                >
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleChannel(c.id)}
                  />
                  <span className={styles.channelName}>{c.label}</span>
                  <span className={styles.channelRate}>
                    {c.id === "google-search"
                      ? `${formatUsd(industry.value)} CPC`
                      : c.cpm
                        ? `${formatUsd(c.cpm)} CPM`
                        : ""}
                    {" · "}
                    {c.asOf}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            What {formatUsd(budget).replace(".00", "")} buys in {duration.label}
          </div>
          <div className={styles.cardBody}>
            <p className={styles.statValue}>
              {fmtCompact(totals.impressions)}
              <small>est. impressions</small>
            </p>
            <div className={styles.sumGrid}>
              <span className={styles.sumItem}>
                <b>{fmtCompact(totals.clicks)}</b> est. clicks
              </span>
              <span className={styles.sumItem}>
                <b>{fmtCompact(totals.conversions)}</b> est. conversions
                <em> (Google Search only)</em>
              </span>
              <span className={styles.sumItem}>
                <b>{formatUsd(budget / duration.days)}</b> / day pacing
              </span>
            </div>
            <p className={styles.statDelta}>
              Even split · {results.length} channel{results.length > 1 ? "s" : ""} ·{" "}
              {formatUsd(budget / results.length)} each
            </p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <span className={styles.chartTitle}>Estimated impressions by channel</span>
          <span className={styles.chartUnit}>{duration.label} · even split</span>
        </div>
        <div className={styles.cardBody}>
          <BarChart items={chartData} unit="estimated impressions" />

          <table className={styles.breakTable}>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Spend</th>
                <th>Est. impressions</th>
                <th>Est. clicks</th>
                <th>Benchmark used</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.channel.id}>
                  <td>{r.channel.label}</td>
                  <td>{formatUsd(r.spend)}</td>
                  <td>{r.impressions ? fmtCompact(r.impressions) : "—"}</td>
                  <td>{r.clicks ? fmtCompact(r.clicks) : "—"}</td>
                  <td className={styles.breakNote}>{r.rateNote}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className={styles.chartSource}>
            Modeled from published benchmark averages ({sources.join(" · ")}) —
            actuals vary with targeting, creative and seasonality.
          </p>
        </div>
      </div>
    </>
  );
}
