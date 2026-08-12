"use client";

import { useState } from "react";
import s from "./chart.module.css";

export type Row = {
  key: string;
  label: string;
  spend: number | null;
  revenue: number | null;
  orders: number | null;
};

type Metric = "revenue" | "spend" | "orders";

const METRICS: { key: Metric; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "spend", label: "Spend" },
  { key: "orders", label: "Orders" },
];

function format(v: number | null, m: Metric) {
  if (v === null) return "—";
  if (m === "orders") return v.toLocaleString("en-US");
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function SourceChart({ rows }: { rows: Row[] }) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (k: string) => {
    const next = new Set(hidden);
    next.has(k) ? next.delete(k) : next.add(k);
    setHidden(next);
  };

  const visible = rows
    .filter((r) => !hidden.has(r.key))
    .sort((a, b) => (b[metric] ?? -1) - (a[metric] ?? -1));

  const max = Math.max(...visible.map((r) => r[metric] ?? 0), 1);
  const total = visible.reduce((a, r) => a + (r[metric] ?? 0), 0);

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
        <span className={s.total}>{format(total, metric)}</span>
      </div>

      <ul className={s.bars}>
        {visible.map((r) => (
          <li key={r.key} className={s.row}>
            <span className={s.name}>{r.label}</span>
            <span className={s.track}>
              <span
                className={s.bar}
                style={{ width: `${Math.max(((r[metric] ?? 0) / max) * 100, 0)}%` }}
              />
            </span>
            <span className={s.value}>{format(r[metric], metric)}</span>
          </li>
        ))}
      </ul>

      <div className={s.legend}>
        {rows.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => toggle(r.key)}
            aria-pressed={!hidden.has(r.key)}
            className={`${s.chip} ${hidden.has(r.key) ? s.chipOff : ""}`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
