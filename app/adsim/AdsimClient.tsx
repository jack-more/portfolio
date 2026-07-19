"use client";

import { useMemo, useState } from "react";
import {
  COUNTRY_CPM,
  INDUSTRY_CPC,
  PLATFORM_CPM,
  datasetFor,
  formatUsd,
  matchQuery,
  type BenchmarkSet,
  type Mode,
} from "./benchmarks";
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

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export default function AdsimClient() {
  const [mode, setMode] = useState<Mode>("adwords");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<{
    mode: Mode;
    query: string;
    matchedId: string | null;
  } | null>(null);
  const [connectNote, setConnectNote] = useState<string | null>(null);

  const active: { set: BenchmarkSet; emphasizedId: string | null } =
    useMemo(() => {
      if (submitted?.matchedId) {
        return {
          set: datasetFor(submitted.mode),
          emphasizedId: submitted.matchedId,
        };
      }
      return { set: PLATFORM_CPM, emphasizedId: null };
    }, [submitted]);

  const rows = useMemo(
    () => [...active.set.rows].sort((a, b) => b.value - a.value),
    [active.set]
  );
  const med = useMemo(() => median(rows.map((r) => r.value)), [rows]);

  const chartData: ChartItem[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        label: r.label,
        value: r.value,
        display: formatUsd(r.value),
        emphasized: r.id === active.emphasizedId,
      })),
    [rows, active.emphasizedId]
  );

  const emphasizedRow = rows.find((r) => r.id === active.emphasizedId) ?? null;
  const statRow = emphasizedRow ?? rows[0];
  const multiple = statRow ? statRow.value / med : 1;

  const noMatch =
    submitted !== null && submitted.matchedId === null
      ? submitted.query
      : null;

  function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSubmitted({ mode, query: trimmed, matchedId: matchQuery(mode, trimmed) });
  }

  function switchMode(next: Mode) {
    setMode(next);
    setQuery("");
    setSubmitted(null);
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

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.wordmark}>ADSIM</span>
        <span className={styles.topNote}>published benchmarks · sourced</span>
        <a className={styles.topLink} href="/">
          jackmorello.com →
        </a>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.title}>What ad spots really cost.</h1>
        <p className={styles.subtitle}>
          Real published rates — not estimates. Search an ad word to see the
          average cost per click in its industry, or a market to see what a
          thousand Meta impressions cost there.
        </p>
      </section>

      <section className={styles.workspace}>
        <div className={styles.topRow}>
          <div className={styles.searchCard}>
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
                  ? "Ad words map to WordStream's 23 tracked industries — try “insurance”, “plumber”, or a chip above."
                  : "Markets cover the 13 countries in Lebesgue's Meta CPM dataset — try “United States” or “India”."}
              </p>
            )}
          </div>

          {statRow && (
            <div className={styles.statTile}>
              <p className={styles.statLabel}>
                {emphasizedRow
                  ? `${statRow.label} — ${active.set.unitLabel}`
                  : `${statRow.label} — highest ${active.set.unit} of ${rows.length} platforms`}
              </p>
              <p className={styles.statValue}>
                {formatUsd(statRow.value)}
                <small>{active.set.unit === "CPC" ? "per click" : "per 1k impressions"}</small>
              </p>
              <p className={styles.statDelta}>
                {multiple >= 1
                  ? `${multiple.toFixed(1)}× the median (${formatUsd(med)})`
                  : `${(statRow.value / med * 100).toFixed(0)}% of the median (${formatUsd(med)})`}
                {" · "}
                {active.set.asOf}
              </p>
            </div>
          )}

        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <p className={styles.chartTitle}>{active.set.title}</p>
            <span className={styles.chartUnit}>{active.set.unitLabel}</span>
          </div>
          <BarChart items={chartData} unit={active.set.unitLabel} />
          <p className={styles.chartSource}>
            Source: {active.set.sourceName} · {active.set.asOf}
          </p>
        </div>
      </section>

      <section className={styles.connect}>
        <div className={styles.connectInner}>
          <div>
            <h2 className={styles.connectTitle}>Plug in your ad stack</h2>
            <p className={styles.connectCopy}>
              Connect live accounts to put your own serving data next to the
              published benchmarks — the same chart, your numbers.
            </p>
          </div>
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
            {connectNote && (
              <p className={styles.connectSoon}>
                {connectNote} integration is coming soon — benchmarks stay
                fully sourced in the meantime.
              </p>
            )}
          </div>
        </div>
      </section>

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
        <span>ADSIM — a pricing lens for paid media</span>
        <span>benchmark averages — your account results will vary</span>
      </footer>
    </main>
  );
}
