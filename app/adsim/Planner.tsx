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

/* What the user is actually running. Each profile gates which channels
   are eligible, which are on by default, and carries placement-fit notes
   from documented platform creative specs. */
type AssetType = "video" | "static" | "search";

const ASSET_PROFILES: Record<
  AssetType,
  {
    label: string;
    channels: Record<string, { on: boolean; fit?: string }>;
  }
> = {
  video: {
    label: "Short video (10–15s)",
    channels: {
      tiktok: {
        on: true,
        fit: "9–15s is TikTok's recommended clip range — ideal fit",
      },
      meta: {
        on: true,
        fit: "runs as Reels + in-feed video · blended Meta CPM",
      },
      youtube: {
        on: true,
        fit: "15s: skippable, non-skip & Shorts · 10s: skippable/Shorts (bumpers need 6s)",
      },
      snapchat: {
        on: false,
        fit: "full-screen vertical video is the native format",
      },
      pinterest: { on: false, fit: "video pins · ≤15s plays best" },
    },
  },
  static: {
    label: "Static image",
    channels: {
      meta: { on: true, fit: "feed + right-column single image" },
      pinterest: { on: true, fit: "standard pins — static-native platform" },
      linkedin: { on: false, fit: "single-image sponsored content" },
      snapchat: { on: false, fit: "single-image snap ads" },
    },
  },
  search: {
    label: "Search text ads",
    channels: {
      "google-search": { on: true },
    },
  },
};

const CREATIVE_SPEC_SOURCES = [
  {
    sourceName: "YouTube Help — video ad formats",
    sourceUrl: "https://support.google.com/youtube/answer/2467968",
  },
  {
    sourceName: "TikTok for Business — creative best practices",
    sourceUrl: "https://ads.tiktok.com/business/en-US/inspiration/creative-best-practices",
  },
];

/* Documented platform delivery rules the plan is checked against. */
const PLATFORM_RULES = [
  {
    sourceName: "Meta Business Help Center — learning phase",
    sourceUrl: "https://www.facebook.com/business/help/112167992830700",
  },
  {
    sourceName: "TikTok Business Help Center — learning phase & budgets",
    sourceUrl: "https://ads.tiktok.com/help/article/learning-phase",
  },
  {
    sourceName: "LinkedIn Marketing Solutions — minimum budgets",
    sourceUrl:
      "https://www.linkedin.com/help/lms/answer/a426102",
  },
];

interface ChannelResult {
  channel: Channel;
  share: number; // 0..1 of budget
  spend: number;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  cpa: number | null;
  roas: number | null;
  rate: string;
  flags: string[];
}

function fmtCompact(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${Math.round(n)}`;
}

export default function Planner() {
  const [asset, setAsset] = useState<AssetType>("video");
  const [budget, setBudget] = useState(10000);
  const [durationId, setDurationId] = useState<(typeof DURATIONS)[number]["id"]>("1m");
  const [industryId, setIndustryId] = useState("shopping");
  const [aov, setAov] = useState(80);
  const [socialCvr, setSocialCvr] = useState(2.0);
  const [frequency, setFrequency] = useState(2.5);
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        Object.entries(ASSET_PROFILES.video.channels)
          .filter(([, v]) => v.on)
          .map(([id]) => id)
      )
  );

  const profile = ASSET_PROFILES[asset];
  const eligibleChannels = CHANNELS.filter((c) => profile.channels[c.id]);
  const hasSearch = "google-search" in profile.channels;

  function switchAsset(next: AssetType) {
    setAsset(next);
    setSelected(
      new Set(
        Object.entries(ASSET_PROFILES[next].channels)
          .filter(([, v]) => v.on)
          .map(([id]) => id)
      )
    );
  }
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(CHANNELS.map((c) => [c.id, 25]))
  );
  const [copied, setCopied] = useState(false);

  const duration = DURATIONS.find((d) => d.id === durationId)!;
  const industry = INDUSTRY_CPC.rows.find((r) => r.id === industryId)!;

  function toggleChannel(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const results: ChannelResult[] = useMemo(() => {
    const chosen = CHANNELS.filter((c) => selected.has(c.id));
    const totalW = chosen.reduce((a, c) => a + (weights[c.id] || 1), 0);
    const days = duration.days;

    return chosen.map((c) => {
      const share = (weights[c.id] || 1) / totalW;
      const spend = budget * share;
      const daily = spend / days;

      let impressions: number | null = null;
      let clicks: number | null = null;
      let conversions: number | null = null;
      let rate = "";

      if (c.id === "google-search") {
        clicks = spend / industry.value;
        impressions = clicks / ((industry.ctr ?? 5) / 100);
        conversions = clicks * ((industry.cvr ?? 5) / 100);
        rate = `${formatUsd(industry.value)} CPC`;
      } else {
        impressions = c.cpm ? (spend / c.cpm) * 1000 : null;
        clicks = c.cpc
          ? spend / c.cpc
          : c.ctr && impressions
            ? impressions * (c.ctr / 100)
            : null;
        conversions = clicks !== null ? clicks * (socialCvr / 100) : null;
        rate = c.cpm ? `${formatUsd(c.cpm)} CPM` : "";
      }

      const cpa = conversions && conversions > 0 ? spend / conversions : null;
      const roas =
        conversions && conversions > 0 ? (conversions * aov) / spend : null;

      const flags: string[] = [];
      const convPerWeek = conversions !== null ? (conversions * 7) / days : null;
      if (
        (c.id === "meta" || c.id === "tiktok") &&
        convPerWeek !== null &&
        convPerWeek < 50
      ) {
        flags.push(
          `projects ~${Math.round(convPerWeek)} conv./week — below the ~50/week ${
            c.id === "meta" ? "Meta" : "TikTok"
          } recommends to exit the learning phase; consider consolidating budget or a higher-funnel objective`
        );
      }
      if (c.id === "tiktok" && daily < 20) {
        flags.push(
          `${formatUsd(daily)}/day is under TikTok's $20/day ad-group minimum`
        );
      }
      if (c.id === "linkedin" && daily < 10) {
        flags.push(
          `${formatUsd(daily)}/day is under LinkedIn's $10/day minimum`
        );
      }
      if (c.id === "youtube" || c.id === "pinterest") {
        flags.length = 0; // view-based buys — no conversion path modeled
      }

      return { channel: c, share, spend, impressions, clicks, conversions, cpa, roas, rate, flags };
    });
  }, [selected, weights, budget, duration.days, industry, socialCvr, aov]);

  const totals = useMemo(() => {
    const impressions = results.reduce((a, r) => a + (r.impressions ?? 0), 0);
    const clicks = results.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const conversions = results.reduce((a, r) => a + (r.conversions ?? 0), 0);
    const convSpend = results
      .filter((r) => r.conversions && r.conversions > 0)
      .reduce((a, r) => a + r.spend, 0);
    return {
      impressions,
      clicks,
      conversions,
      reach: impressions / Math.max(1, frequency),
      cpa: conversions > 0 ? convSpend / conversions : null,
      revenue: conversions * aov,
      roas: convSpend > 0 ? (conversions * aov) / convSpend : null,
    };
  }, [results, frequency, aov]);

  const allFlags = results.flatMap((r) =>
    r.flags.map((f) => `${r.channel.label}: ${f}`)
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

  function copyPlan() {
    const head = [
      "Channel", "Mix", "Spend", "Rate", "Est. impressions",
      "Est. clicks", "Est. conversions", "CPA", "ROAS",
    ].join("\t");
    const lines = results.map((r) =>
      [
        r.channel.label,
        `${Math.round(r.share * 100)}%`,
        formatUsd(r.spend),
        r.rate,
        r.impressions ? Math.round(r.impressions) : "",
        r.clicks ? Math.round(r.clicks) : "",
        r.conversions ? Math.round(r.conversions) : "",
        r.cpa ? formatUsd(r.cpa) : "",
        r.roas ? `${r.roas.toFixed(1)}x` : "",
      ].join("\t")
    );
    const total = [
      "Total", "100%", formatUsd(budget), "",
      Math.round(totals.impressions), Math.round(totals.clicks),
      Math.round(totals.conversions),
      totals.cpa ? formatUsd(totals.cpa) : "",
      totals.roas ? `${totals.roas.toFixed(1)}x` : "",
    ].join("\t");
    const note = `Adsim plan — ${profile.label}, ${formatUsd(budget)} over ${duration.label}${hasSearch ? `, ${industry.label}` : ""}. Benchmarks: ${sources.join("; ")}. AOV ${formatUsd(aov)}${asset !== "search" ? ` and ${socialCvr}% social conv. rate` : ""} are user assumptions.`;
    navigator.clipboard
      .writeText([head, ...lines, total, "", note].join("\n"))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <>
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Plan a campaign</div>
          <div className={styles.cardBody}>
            <div className={styles.plannerControls}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>What are you running?</span>
                <span className={styles.segmented}>
                  {(Object.keys(ASSET_PROFILES) as AssetType[]).map((a) => (
                    <button
                      key={a}
                      className={asset === a ? styles.segActive : styles.segBtn}
                      onClick={() => switchAsset(a)}
                    >
                      {ASSET_PROFILES[a].label}
                    </button>
                  ))}
                </span>
              </div>
            </div>

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

              {hasSearch && (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Industry (sets Google rates)</span>
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
              )}
            </div>

            <div className={styles.plannerControls}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Avg. order value*</span>
                <span className={styles.budgetWrap}>
                  <span className={styles.budgetPrefix}>$</span>
                  <input
                    className={styles.numInputSm}
                    type="number"
                    min={1}
                    value={aov}
                    onChange={(e) => setAov(Math.max(1, Number(e.target.value) || 0))}
                  />
                </span>
              </label>
              {asset !== "search" && (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Social conv. rate*</span>
                  <span className={styles.budgetWrap}>
                    <input
                      className={styles.numInputSm}
                      type="number"
                      min={0.1}
                      max={30}
                      step={0.1}
                      value={socialCvr}
                      onChange={(e) =>
                        setSocialCvr(Math.max(0.1, Number(e.target.value) || 0))
                      }
                    />
                    <span className={styles.budgetSuffix}>%</span>
                  </span>
                </label>
              )}
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Avg. frequency*</span>
                <span className={styles.budgetWrap}>
                  <input
                    className={styles.numInputSm}
                    type="number"
                    min={1}
                    max={10}
                    step={0.5}
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                  <span className={styles.budgetSuffix}>×</span>
                </span>
              </label>
              <span className={styles.assumpNote}>
                *your assumptions — not benchmark data
              </span>
            </div>

            <span className={styles.fieldLabel}>
              Channel mix (drag to weight) — placements that fit{" "}
              {profile.label.toLowerCase()}
            </span>
            <div className={styles.channelList}>
              {eligibleChannels.map((c) => {
                const on = selected.has(c.id);
                const res = results.find((r) => r.channel.id === c.id);
                const fit = profile.channels[c.id]?.fit;
                return (
                  <div
                    key={c.id}
                    className={on ? styles.channelRowOn : styles.channelRow}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleChannel(c.id)}
                      aria-label={`Include ${c.label}`}
                    />
                    <span className={styles.channelName}>{c.label}</span>
                    {fit && <span className={styles.channelFit}>{fit}</span>}
                    {on ? (
                      <>
                        <input
                          className={styles.weightSlider}
                          type="range"
                          min={5}
                          max={80}
                          value={weights[c.id]}
                          onChange={(e) =>
                            setWeights((w) => ({
                              ...w,
                              [c.id]: Number(e.target.value),
                            }))
                          }
                          aria-label={`${c.label} budget weight`}
                        />
                        <span className={styles.channelShare}>
                          {res ? `${Math.round(res.share * 100)}% · ${formatUsd(res.spend)}` : ""}
                        </span>
                      </>
                    ) : (
                      <span className={styles.channelRate}>
                        {c.cpm ? `${formatUsd(c.cpm)} CPM` : ""} · {c.asOf}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            What {formatUsd(budget)} buys in {duration.label}
          </div>
          <div className={styles.cardBody}>
            <p className={styles.statValue}>
              {totals.conversions >= 1 ? Math.round(totals.conversions).toLocaleString("en-US") : fmtCompact(totals.reach)}
              <small>
                {totals.conversions >= 1
                  ? "est. conversions"
                  : `est. people reached at ${frequency}× frequency`}
              </small>
            </p>
            <div className={styles.sumGrid}>
              {totals.cpa && (
                <span className={styles.sumItem}>
                  <b>{formatUsd(totals.cpa)}</b> blended CPA
                </span>
              )}
              {totals.roas && (
                <span className={styles.sumItem}>
                  <b>{totals.roas.toFixed(1)}×</b> ROAS at {formatUsd(aov)} AOV
                </span>
              )}
              <span className={styles.sumItem}>
                <b>${fmtCompact(totals.revenue)}</b> est. revenue
              </span>
              <span className={styles.sumItem}>
                <b>{fmtCompact(totals.clicks)}</b> clicks
              </span>
              <span className={styles.sumItem}>
                <b>{fmtCompact(totals.reach)}</b> people at {frequency}×
              </span>
              <span className={styles.sumItem}>
                <b>{formatUsd(budget / duration.days)}</b>/day pacing
              </span>
            </div>
            {allFlags.length > 0 && (
              <ul className={styles.flagList}>
                {allFlags.map((f) => (
                  <li key={f}>⚠ {f}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <span className={styles.chartTitle}>Media plan</span>
          <button className={styles.copyBtn} onClick={copyPlan}>
            {copied ? "Copied ✓" : "Copy plan for your deck"}
          </button>
        </div>
        <div className={styles.cardBody}>
          <table className={styles.breakTable}>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Mix</th>
                <th>Spend</th>
                <th>Rate</th>
                <th>Impr.</th>
                <th>Clicks</th>
                <th>Conv.</th>
                <th>CPA</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.channel.id}>
                  <td>{r.channel.label}</td>
                  <td>{Math.round(r.share * 100)}%</td>
                  <td>{formatUsd(r.spend)}</td>
                  <td className={styles.breakNote}>{r.rate}</td>
                  <td>{r.impressions ? fmtCompact(r.impressions) : "—"}</td>
                  <td>{r.clicks ? fmtCompact(r.clicks) : "—"}</td>
                  <td>{r.conversions && r.conversions >= 0.5 ? Math.round(r.conversions) : "—"}</td>
                  <td>{r.cpa ? formatUsd(r.cpa) : "—"}</td>
                  <td>{r.roas ? `${r.roas.toFixed(1)}×` : "—"}</td>
                </tr>
              ))}
              <tr className={styles.totalsRow}>
                <td>Total</td>
                <td>100%</td>
                <td>{formatUsd(budget)}</td>
                <td />
                <td>{fmtCompact(totals.impressions)}</td>
                <td>{fmtCompact(totals.clicks)}</td>
                <td>{Math.round(totals.conversions)}</td>
                <td>{totals.cpa ? formatUsd(totals.cpa) : "—"}</td>
                <td>{totals.roas ? `${totals.roas.toFixed(1)}×` : "—"}</td>
              </tr>
            </tbody>
          </table>

          <BarChart items={chartData} unit="estimated impressions" />

          <p className={styles.chartSource}>
            Cost benchmarks: {sources.join(" · ")}. Delivery rules:{" "}
            {PLATFORM_RULES.map((r) => r.sourceName.split(" — ")[0]).join(", ")}.
            {asset === "video" &&
              ` Placement fit per ${CREATIVE_SPEC_SOURCES.map((s) => s.sourceName.split(" — ")[0]).join(" and ")} creative specs.`}{" "}
            AOV{asset !== "search" && ", social conv. rate"} and frequency are
            your assumptions — actuals vary with targeting, creative and
            seasonality. YouTube and Pinterest are modeled as view-based reach
            only.
          </p>
        </div>
      </div>
    </>
  );
}
