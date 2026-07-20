"use client";

import { useMemo, useState } from "react";
import {
  COUNTRY_CPM,
  INDUSTRY_CPC,
  PLATFORM_CPM,
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
import styles from "./page.module.css";

const SUGGESTIONS: Record<Mode, string[]> = {
  adwords: ["running shoes", "lawyer", "crm software", "insurance"],
  locations: ["United States", "Germany", "Brazil", "India"],
};

const AD_STACK = [
  { name: "Google Ads", note: "Search, YouTube, Display" },
  { name: "Meta Ads", note: "Instagram, Facebook, Audience Network" },
  { name: "TikTok Ads", note: "In-feed, Spark, Pangle" },
];

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
  const [mode, setMode] = useState<Mode>("adwords");
  const [metric, setMetric] = useState<IndustryMetric>("cpc");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<{
    mode: Mode;
    query: string;
    matchedId: string | null;
  } | null>(null);
  const [connectNote, setConnectNote] = useState<string | null>(null);

  /* Country set: live-parsed rows supersede the baked snapshot. */
  const countrySet: BenchmarkSet = useMemo(() => {
    if (!liveCountries) return COUNTRY_CPM;
    return {
      ...COUNTRY_CPM,
      asOf: liveCountries.modified
        ? `updated ${liveCountries.modified}, checked daily`
        : "live from source, checked daily",
      rows: liveCountries.rows.map((r) => ({
        id: slugify(r.label),
        label: r.label,
        value: r.value,
      })),
    };
  }, [liveCountries]);

  const active: { set: BenchmarkSet; emphasizedId: string | null } =
    useMemo(() => {
      if (submitted?.matchedId) {
        return {
          set: submitted.mode === "adwords" ? INDUSTRY_CPC : countrySet,
          emphasizedId: submitted.matchedId,
        };
      }
      return { set: PLATFORM_CPM, emphasizedId: null };
    }, [submitted, countrySet]);

  const isIndustryView =
    submitted?.matchedId != null && submitted.mode === "adwords";
  const activeMetric: IndustryMetric = isIndustryView ? metric : "cpc";

  const metricValue = (r: { value: number; ctr?: number; cvr?: number }) =>
    activeMetric === "ctr" ? r.ctr ?? 0 : activeMetric === "cvr" ? r.cvr ?? 0 : r.value;

  const formatValue = isIndustryView
    ? METRIC_META[activeMetric].format
    : formatUsd;

  const rows = useMemo(
    () => [...active.set.rows].sort((a, b) => metricValue(b) - metricValue(a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active.set, activeMetric]
  );
  const med = useMemo(
    () => median(rows.map(metricValue)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, activeMetric]
  );

  /* Cap very long sets (52 live countries) at the top N, always keeping
     the searched market visible; the cap is stated next to the source.
     Sets up to ~2 dozen rows (the 23 industries) render in full. */
  const { chartRows, capped } = useMemo(() => {
    if (rows.length <= 24) return { chartRows: rows, capped: false };
    const top = rows.slice(0, MAX_CHART_ROWS);
    const em = rows.find((r) => r.id === active.emphasizedId);
    if (em && !top.some((r) => r.id === em.id)) top.push(em);
    return { chartRows: top, capped: true };
  }, [rows, active.emphasizedId]);

  const chartData: ChartItem[] = useMemo(
    () =>
      chartRows.map((r) => ({
        id: r.id,
        label: r.label,
        value: metricValue(r),
        display: formatValue(metricValue(r)),
        emphasized: r.id === active.emphasizedId,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartRows, active.emphasizedId, activeMetric]
  );

  const emphasizedRow = rows.find((r) => r.id === active.emphasizedId) ?? null;
  const statRow = emphasizedRow ?? rows[0];
  const statValue = statRow ? metricValue(statRow) : 0;
  const multiple = statRow && med > 0 ? statValue / med : 1;

  const noMatch =
    submitted !== null && submitted.matchedId === null ? submitted.query : null;

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

  function switchMode(next: Mode) {
    setMode(next);
    setQuery("");
    setSubmitted(null);
    setMetric("cpc");
  }

  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const set of [INDUSTRY_CPC, COUNTRY_CPM, PLATFORM_CPM]) {
      map.set(set.sourceName, set.sourceUrl);
      for (const r of set.rows) {
        if (r.sourceName && r.sourceUrl) map.set(r.sourceName, r.sourceUrl);
      }
    }
    return [...map.entries()];
  }, []);

  const statUnitShort = isIndustryView
    ? METRIC_META[activeMetric].unitShort
    : active.set.unit === "CPC"
      ? "per click"
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
          <h1 className={styles.title}>What ad spots really cost.</h1>
          <p className={styles.subtitle}>
            Real published rates — not estimates. Search an ad word to see cost
            and performance in its industry, or a market to see what a thousand
            Meta impressions cost there.
          </p>
        </section>

        <div className={styles.topRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>Price a spot</div>
            <div className={styles.cardBody}>
              <div className={styles.modeToggle} role="tablist" aria-label="Search mode">
                <button
                  role="tab"
                  aria-selected={mode === "adwords"}
                  className={mode === "adwords" ? styles.modeActive : styles.modeBtn}
                  onClick={() => switchMode("adwords")}
                >
                  Ad words
                </button>
                <button
                  role="tab"
                  aria-selected={mode === "locations"}
                  className={mode === "locations" ? styles.modeActive : styles.modeBtn}
                  onClick={() => switchMode("locations")}
                >
                  Locations
                </button>
              </div>

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
                  aria-label={mode === "adwords" ? "Search ad words" : "Search locations"}
                />
                <button className={styles.searchBtn} type="submit">
                  Price it
                </button>
              </form>

              <div className={styles.chips}>
                {SUGGESTIONS[mode].map((s) => (
                  <button
                    key={s}
                    className={submitted?.query === s ? styles.chipActive : styles.chip}
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
                    ? "Ad words map to WordStream's 23 tracked industries — try “insurance”, “plumber”, or a chip above."
                    : `Markets cover the ${countrySet.rows.length} countries in Lebesgue's Meta CPM dataset — try “United States” or “India”.`}
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
                          : active.set.unitLabel
                      }`
                    : `${statRow.label} — highest ${active.set.unit} of ${rows.length} platforms`}
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
                  {active.set.asOf}
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
                : active.set.title}
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
              <span className={styles.chartUnit}>{active.set.unitLabel}</span>
            )}
          </div>
          <div className={styles.cardBody}>
            <BarChart
              items={chartData}
              unit={
                isIndustryView
                  ? METRIC_META[activeMetric].unitLabel
                  : active.set.unitLabel
              }
            />
            <p className={styles.chartSource}>
              Source: {active.set.sourceName} · {active.set.asOf}
              {capped &&
                ` · showing top ${MAX_CHART_ROWS} of ${rows.length} markets — search any of them`}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Plug in your ad stack</div>
          <div className={styles.cardBody}>
            <p className={styles.connectCopy}>
              Connect live accounts to put your own serving data — including
              your actual best-performing media — next to the published
              benchmarks. The same chart, your numbers.
            </p>
            <div className={styles.connectGrid}>
              {AD_STACK.map((a) => (
                <div key={a.name} className={styles.connectCard}>
                  <span className={styles.connectName}>{a.name}</span>
                  <span className={styles.connectMeta}>{a.note}</span>
                  <button
                    className={styles.connectBtn}
                    onClick={() => setConnectNote(a.name)}
                  >
                    Connect →
                  </button>
                </div>
              ))}
            </div>
            {connectNote && (
              <p className={styles.connectSoon}>
                {connectNote} integration is coming soon — benchmarks stay fully
                sourced in the meantime.
              </p>
            )}
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
          <span>Adsim — a pricing lens for paid media</span>
          <span>benchmark averages — your account results will vary</span>
        </footer>
      </div>
    </main>
  );
}
