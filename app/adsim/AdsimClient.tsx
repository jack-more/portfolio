"use client";

import { useMemo, useState } from "react";
import {
  CHANNELS,
  COUNTRY_CPM,
  INDUSTRY_CPC,
  formatPct,
  formatUsd,
  matchCountry,
  matchIndustry,
  slugify,
  type BenchmarkSet,
  type IndustryMetric,
  type Mode,
} from "./benchmarks";
import type { LiveCountryData } from "./livedata";
import BarChart, { type ChartItem } from "./BarChart";
import Planner from "./Planner";
import styles from "./page.module.css";

type Tab = "campaign" | Mode;

const SUGGESTIONS: Record<Mode, string[]> = {
  adwords: ["running shoes", "lawyer", "crm software", "insurance"],
  locations: ["United States", "Germany", "Brazil", "India"],
};

const METRIC_META: Record<
  IndustryMetric,
  { label: string; unitLabel: string; unitShort: string; format: (v: number) => string }
> = {
  cpc: {
    label: "Avg. CPC",
    unitLabel: "avg. cost per click, Google Search",
    unitShort: "per click",
    format: formatUsd,
  },
  ctr: {
    label: "CTR",
    unitLabel: "avg. click-through rate, Google Search",
    unitShort: "click-through rate",
    format: formatPct,
  },
  cvr: {
    label: "Conv. rate",
    unitLabel: "avg. conversion rate, Google Search",
    unitShort: "conversion rate",
    format: formatPct,
  },
};

const MAX_CHART_ROWS = 14;

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export default function AdsimClient({
  liveCountries,
}: {
  liveCountries: LiveCountryData | null;
}) {
  const [tab, setTab] = useState<Tab>("campaign");
  const [metric, setMetric] = useState<IndustryMetric>("cpc");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<{
    mode: Mode;
    query: string;
    matchedId: string | null;
  } | null>(null);

  const countrySet: BenchmarkSet = useMemo(() => {
    if (!liveCountries) return COUNTRY_CPM;
    return {
      ...COUNTRY_CPM,
      asOf: liveCountries.modified
        ? `updated ${liveCountries.modified}, checked each deploy`
        : "live from source",
      rows: liveCountries.rows.map((r) => ({
        id: slugify(r.label),
        label: r.label,
        value: r.value,
      })),
    };
  }, [liveCountries]);

  const mode: Mode = tab === "locations" ? "locations" : "adwords";
  const activeSet = mode === "adwords" ? INDUSTRY_CPC : countrySet;
  const emphasizedId =
    submitted && submitted.mode === mode ? submitted.matchedId : null;

  const isIndustryView = mode === "adwords";
  const activeMetric: IndustryMetric = isIndustryView ? metric : "cpc";

  const metricValue = (r: { value: number; ctr?: number; cvr?: number }) =>
    activeMetric === "ctr" ? r.ctr ?? 0 : activeMetric === "cvr" ? r.cvr ?? 0 : r.value;

  const formatValue = isIndustryView
    ? METRIC_META[activeMetric].format
    : formatUsd;

  const rows = useMemo(
    () => [...activeSet.rows].sort((a, b) => metricValue(b) - metricValue(a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSet, activeMetric]
  );
  const med = useMemo(
    () => median(rows.map(metricValue)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, activeMetric]
  );

  const { chartRows, capped } = useMemo(() => {
    if (rows.length <= 24) return { chartRows: rows, capped: false };
    const top = rows.slice(0, MAX_CHART_ROWS);
    const em = rows.find((r) => r.id === emphasizedId);
    if (em && !top.some((r) => r.id === em.id)) top.push(em);
    return { chartRows: top, capped: true };
  }, [rows, emphasizedId]);

  const chartData: ChartItem[] = useMemo(
    () =>
      chartRows.map((r) => ({
        id: r.id,
        label: r.label,
        value: metricValue(r),
        display: formatValue(metricValue(r)),
        emphasized: r.id === emphasizedId,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartRows, emphasizedId, activeMetric]
  );

  const emphasizedRow = rows.find((r) => r.id === emphasizedId) ?? null;
  const statRow = emphasizedRow ?? rows[0];
  const statValue = statRow ? metricValue(statRow) : 0;
  const multiple = statRow && med > 0 ? statValue / med : 1;

  const noMatch =
    submitted !== null &&
    submitted.mode === mode &&
    submitted.matchedId === null
      ? submitted.query
      : null;

  function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    const matchedId =
      mode === "adwords"
        ? matchIndustry(trimmed)
        : (() => {
            const label = matchCountry(
              trimmed,
              countrySet.rows.map((r) => r.label)
            );
            return label ? slugify(label) : null;
          })();
    setSubmitted({ mode, query: trimmed, matchedId });
  }

  function switchTab(next: Tab) {
    setTab(next);
    setQuery("");
    setSubmitted(null);
    setMetric("cpc");
  }

  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const set of [INDUSTRY_CPC, COUNTRY_CPM]) {
      map.set(set.sourceName, set.sourceUrl);
    }
    for (const c of CHANNELS) map.set(c.sourceName, c.sourceUrl);
    return [...map.entries()];
  }, []);

  const statUnitShort = isIndustryView
    ? METRIC_META[activeMetric].unitShort
    : "per 1k impressions";

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <a className={styles.navBack} href="/">
          ← jackmorello.com
        </a>
        <span className={styles.navTitle}>Adsim</span>
        <span className={styles.navNote}>
          published benchmarks · sourced
          {liveCountries ? " · country data live" : ""}
        </span>
      </nav>

      <div className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Sim your media before you spend it.</h1>
          <p className={styles.subtitle}>
            A campaign plan priced with real published benchmarks — not
            estimates pulled from the air. Set a budget, pick channels, and see
            what a month actually buys. Or explore the underlying rates by ad
            word and market.
          </p>
        </section>

        <div className={styles.tabs}>
          {(
            [
              ["campaign", "Campaign sim"],
              ["adwords", "Ad words"],
              ["locations", "Locations"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? styles.tabActive : styles.tabBtn}
              onClick={() => switchTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "campaign" ? (
          <Planner />
        ) : (
          <>
            <div className={styles.topRow}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  {mode === "adwords" ? "Price an ad word" : "Price a market"}
                </div>
                <div className={styles.cardBody}>
                  <form
                    className={styles.searchRow}
                    onSubmit={(e) => {
                      e.preventDefault();
                      runSearch(query);
                    }}
                  >
                    <input
                      className={styles.searchInput}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        mode === "adwords" ? "try “running shoes”" : "try “Germany”"
                      }
                      aria-label={
                        mode === "adwords" ? "Search ad words" : "Search locations"
                      }
                    />
                    <button className={styles.searchBtn} type="submit">
                      Price it
                    </button>
                  </form>

                  <div className={styles.chips}>
                    {SUGGESTIONS[mode].map((s) => (
                      <button
                        key={s}
                        className={
                          submitted?.query === s ? styles.chipActive : styles.chip
                        }
                        onClick={() => runSearch(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {noMatch && (
                    <p className={styles.noMatch}>
                      No published benchmark matches “{noMatch}”.{" "}
                      {mode === "adwords"
                        ? "Ad words map to WordStream's 23 tracked industries — try “insurance” or “plumber”."
                        : `Markets cover the ${countrySet.rows.length} countries in the dataset — try “United States” or “India”.`}
                    </p>
                  )}
                </div>
              </div>

              {statRow && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>Benchmark</div>
                  <div className={styles.cardBody}>
                    <p className={styles.statLabel}>
                      {emphasizedRow
                        ? `${statRow.label} — ${
                            isIndustryView
                              ? METRIC_META[activeMetric].unitLabel
                              : activeSet.unitLabel
                          }`
                        : `${statRow.label} — highest ${
                            isIndustryView
                              ? METRIC_META[activeMetric].label
                              : activeSet.unit
                          } of ${rows.length} ${
                            mode === "adwords" ? "industries" : "markets"
                          }`}
                    </p>
                    <p className={styles.statValue}>
                      {formatValue(statValue)}
                      <small>{statUnitShort}</small>
                    </p>
                    <p className={styles.statDelta}>
                      {multiple >= 1
                        ? `${multiple.toFixed(1)}× the median (${formatValue(med)})`
                        : `${((statValue / med) * 100).toFixed(0)}% of the median (${formatValue(med)})`}
                      {" · "}
                      {activeSet.asOf}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.chartTitle}>
                  {isIndustryView && activeMetric !== "cpc"
                    ? `Google Ads ${METRIC_META[activeMetric].label} by industry`
                    : activeSet.title}
                </span>
                {isIndustryView ? (
                  <span className={styles.metricToggle} role="tablist" aria-label="Metric">
                    {(Object.keys(METRIC_META) as IndustryMetric[]).map((m) => (
                      <button
                        key={m}
                        role="tab"
                        aria-selected={metric === m}
                        className={metric === m ? styles.metricActive : styles.metricBtn}
                        onClick={() => setMetric(m)}
                      >
                        {METRIC_META[m].label}
                      </button>
                    ))}
                  </span>
                ) : (
                  <span className={styles.chartUnit}>{activeSet.unitLabel}</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <BarChart
                  items={chartData}
                  unit={
                    isIndustryView
                      ? METRIC_META[activeMetric].unitLabel
                      : activeSet.unitLabel
                  }
                />
                <p className={styles.chartSource}>
                  Source: {activeSet.sourceName} · {activeSet.asOf}
                  {capped &&
                    ` · showing top ${MAX_CHART_ROWS} of ${rows.length} markets — search any of them`}
                </p>
              </div>
            </div>
          </>
        )}

        <div className={styles.card}>
          <div className={styles.cardHeader}>Plug in your ad stack</div>
          <div className={styles.cardBody}>
            <p className={styles.connectCopy}>
              Connect live accounts to sim with your own rates instead of
              industry averages — your CPCs, your best-performing media, the
              same plan. Google Ads, Meta and TikTok integrations are on the
              roadmap.
            </p>
          </div>
        </div>

        <section className={styles.sources}>
          <p className={styles.sourcesHeading}>Sources</p>
          <ul className={styles.sourcesList}>
            {sources.map(([name, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.footer}>
          <span>Adsim — sim your media before you spend it</span>
          <span>benchmark averages — your account results will vary</span>
        </footer>
      </div>
    </main>
  );
}
