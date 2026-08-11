"use client";

/* Revenue by source, with a metric toggle and per-source toggles.

   Deliberately a plain horizontal bar chart: the question is "how big is
   each source relative to the others", and length against a shared baseline
   answers that better than anything with a curve in it. No gradients, no
   animation, no second axis. */

import { useState } from "react";
import s from "./chart.module.css";

export type Row = { source: string; orders: number; revenue: number; aov: number };

type Metric = "revenue" | "orders" | "aov";

const METRICS: { key: Metric; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "orders", label: "Orders" },
  { key: "aov", label: "AOV" },
];

const LABELS: Record<string, string> = {
  affiliate: "Affiliate / UGC",
  organic: "Organic",
  tiktok: "TikTok",
  meta: "Meta",
  openai: "OpenAI",
  google: "Google",
  taboola: "Taboola",
};

function format(v: number, m: Metric) {
  if (m === "orders") return v.toLocaleString("en-US");
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function SourceChart({ rows }: { rows: Row[] }) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (src: string) => {
    const next = new Set(hidden);
    if (next.has(src)) next.delete(src);
    else next.add(src);
    setHidden(next);
  };

  const visible = rows
    .filter((r) => !hidden.has(r.source))
    .sort((a, b) => b[metric] - a[metric]);

  const max = Math.max(...visible.map((r) => r[metric]), 1);
  const total = visible.reduce((a, r) => a + r[metric], 0);

  return (
    <div className={s.wrap}>
      <div className={s.controls}>
        <div className={s.metrics} role="group" aria-label="Metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              aria-pressed={metric === m.key}
              className={`${s.metricBtn} ${metric === m.key ? s.metricOn : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className={s.total}>
          {metric === "aov" ? "—" : format(total, metric)}
          <i>{metric === "aov" ? "not additive" : "shown total"}</i>
        </span>
      </div>

      {visible.length === 0 ? (
        <p className={s.empty}>Every source is hidden. Turn one back on below.</p>
      ) : (
        <ul className={s.bars}>
          {visible.map((r) => (
            <li key={r.source} className={s.row}>
              <span className={s.name}>{LABELS[r.source] ?? r.source}</span>
              <span className={s.track}>
                <span
                  className={s.bar}
                  style={{ width: `${Math.max((r[metric] / max) * 100, 0.6)}%` }}
                />
              </span>
              <span className={s.value}>{format(r[metric], metric)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={s.legend}>
        {rows.map((r) => (
          <button
            key={r.source}
            type="button"
            onClick={() => toggle(r.source)}
            aria-pressed={!hidden.has(r.source)}
            className={`${s.chip} ${hidden.has(r.source) ? s.chipOff : ""}`}
          >
            {LABELS[r.source] ?? r.source}
          </button>
        ))}
      </div>
    </div>
  );
}
