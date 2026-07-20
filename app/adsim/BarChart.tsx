"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";

export interface ChartItem {
  id: string;
  label: string;
  value: number;
  display: string;
  emphasized?: boolean;
}

export default function BarChart({
  items,
  unit,
}: {
  items: ChartItem[];
  unit: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 0.0001);
  const hasEmphasis = items.some((i) => i.emphasized);

  return (
    <div className={styles.chart} role="img" aria-label={`Bar chart, ${unit}`}>
      {items.map((it, idx) => {
          const accented = !!it.emphasized || !hasEmphasis;
          return (
            <motion.div
              layout
              key={it.id}
              className={
                it.emphasized
                  ? `${styles.chartRow} ${styles.chartRowEm}`
                  : styles.chartRow
              }
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { type: "spring", stiffness: 320, damping: 32 },
                delay: idx * 0.012,
              }}
            >
              <span className={styles.chartLabel}>{it.label}</span>
              <div className={styles.chartTrack}>
                <motion.span
                  className={
                    accented ? styles.chartFillAccent : styles.chartFill
                  }
                  initial={{ width: 0 }}
                  animate={{ width: `${(it.value / max) * 100}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 190,
                    damping: 30,
                    delay: idx * 0.018,
                  }}
                />
              </div>
              <span className={styles.chartValue}>{it.display}</span>
            </motion.div>
          );
        })}
    </div>
  );
}
