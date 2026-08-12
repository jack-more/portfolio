import type { Metadata } from "next";
import base from "../sko/page.module.css";
import s from "./page.module.css";
import { CHANNELS, WEEK_OF } from "./data";
import { getAttribution, usd, num, roas } from "./attribution";
import SourceChart from "./SourceChart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SKO Tracking",
  robots: { index: false, follow: false },
};

export default async function SkoTracking() {
  const { data, error } = await getAttribution("2026-08-04", "2026-08-10");

  const bySource = new Map(data?.by_source.map((r) => [r.source, r]) ?? []);
  const rows = CHANNELS.map((c) => {
    const r = bySource.get(c.key);
    return {
      key: c.key,
      label: c.label,
      spend: c.spend,
      revenue: data ? (r?.revenue ?? 0) : null,
      orders: data ? (r?.orders ?? 0) : null,
    };
  });

  const totalSpend = CHANNELS.reduce((a, c) => a + (c.spend ?? 0), 0);
  const paidRevenue = rows
    .filter((r) => r.spend !== null)
    .reduce((a, r) => a + (r.revenue ?? 0), 0);

  return (
    <div className={base.page}>
      <nav className={base.nav}>
        <span className={base.navTitle}>SKO</span>
        <span className={base.navNote}>{WEEK_OF}</span>
      </nav>

      <main className={base.main}>
        {error ? (
          <div className={base.flag}>
            <span className={base.flagLabel}>No data</span>
            <p className={base.cardBody}>{error}</p>
          </div>
        ) : null}

        <div className={s.summary}>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(data?.totals.revenue ?? null)}</span>
            <span className={s.statLabel}>Revenue</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(totalSpend)}</span>
            <span className={s.statLabel}>Spend</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{roas(data ? paidRevenue : null, totalSpend)}</span>
            <span className={s.statLabel}>ROAS</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{num(data?.totals.orders ?? null)}</span>
            <span className={s.statLabel}>Orders</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(data?.totals.aov ?? null)}</span>
            <span className={s.statLabel}>AOV</span>
          </div>
        </div>

        <SourceChart rows={rows} />

        <div className={base.tableWrap}>
          <table className={`${base.table} ${s.adsTable}`}>
            <thead>
              <tr>
                <th>Platform</th>
                <th className={base.numCol}>Spend</th>
                <th className={base.numCol}>Revenue</th>
                <th className={base.numCol}>Orders</th>
                <th className={base.numCol}>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td className={base.strong}>{r.label}</td>
                  <td className={base.numCol}>{usd(r.spend)}</td>
                  <td className={base.numCol}>{usd(r.revenue)}</td>
                  <td className={base.numCol}>{num(r.orders)}</td>
                  <td className={base.numCol}>{roas(r.revenue, r.spend)}</td>
                </tr>
              ))}
              <tr>
                <td className={base.strong}>Total</td>
                <td className={base.numCol}>{usd(totalSpend)}</td>
                <td className={base.numCol}>{usd(data?.totals.revenue ?? null)}</td>
                <td className={base.numCol}>{num(data?.totals.orders ?? null)}</td>
                <td className={base.numCol}>{roas(data ? paidRevenue : null, totalSpend)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
