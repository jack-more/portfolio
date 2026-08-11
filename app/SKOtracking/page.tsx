import type { Metadata } from "next";
import Link from "next/link";
import base from "../sko/page.module.css";
import s from "./page.module.css";
import { SOURCES, ISSUES, CAMPAIGN, CHANNELS, LAST_VERIFIED, WEEK_OF } from "./data";
import { getAttribution, usd, num, roas } from "./attribution";
import SourceChart from "./SourceChart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SKO Tracking",
  robots: { index: false, follow: false },
};

const healthClass: Record<string, string> = {
  live: s.live,
  degraded: s.degraded,
  unverified: s.unverified,
  broken: s.broken,
};

const sevClass: Record<string, string> = {
  blocker: s.blocker,
  high: s.high,
  medium: s.medium,
};

export default async function SkoTracking() {
  const { data, error } = await getAttribution("2026-08-04", "2026-08-10");

  const bySource = new Map(data?.by_source.map((r) => [r.source, r]) ?? []);
  const rows = CHANNELS.map((c) => {
    const r = bySource.get(c.key);
    return {
      ...c,
      orders: data ? (r?.orders ?? 0) : null,
      revenue: data ? (r?.revenue ?? 0) : null,
    };
  });

  const totalSpend = CHANNELS.reduce((a, c) => a + (c.spend ?? 0), 0);
  const paidRevenue = rows
    .filter((r) => r.spend !== null)
    .reduce((a, r) => a + (r.revenue ?? 0), 0);

  return (
    <div className={base.page}>
      <nav className={base.nav}>
        <Link href="/sko" className={base.navBack}>
          ← SKO
        </Link>
        <span className={base.navTitle}>Tracking</span>
        <span className={base.navNote}>
          {WEEK_OF} · verified {LAST_VERIFIED}
        </span>
      </nav>

      <main className={base.main}>
        {error ? (
          <div className={base.flag}>
            <span className={base.flagLabel}>No live data</span>
            <p className={base.cardBody}>{error}</p>
          </div>
        ) : null}

        <div className={s.summary}>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(data?.totals.revenue ?? null)}</span>
            <span className={s.statLabel}>Revenue</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{num(data?.totals.orders ?? null)}</span>
            <span className={s.statLabel}>Orders</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(data?.totals.aov ?? null)}</span>
            <span className={s.statLabel}>AOV</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{usd(totalSpend)}</span>
            <span className={s.statLabel}>Ad spend</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>{roas(data ? paidRevenue : null, totalSpend)}</span>
            <span className={s.statLabel}>Paid ROAS</span>
          </div>
        </div>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>Channels</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.adsTable}`}>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th className={base.numCol}>Spend</th>
                  <th className={base.numCol}>Revenue</th>
                  <th className={base.numCol}>Orders</th>
                  <th className={base.numCol}>ROAS</th>
                  <th className={base.numCol}>Planned/day</th>
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
                    <td className={base.numCol}>{usd(r.plannedDaily)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {data ? (
          <section className={base.section}>
            <div className={base.sectionHead}>
              <span className={base.sectionNum}>02</span>
              <h2 className={base.sectionTitle}>Revenue by source</h2>
            </div>
            <SourceChart rows={data.by_source} />
          </section>
        ) : null}

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>03</span>
            <h2 className={base.sectionTitle}>Paid vs organic</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.adsTable}`}>
              <thead>
                <tr>
                  <th>Bucket</th>
                  <th className={base.numCol}>Orders</th>
                  <th className={base.numCol}>Revenue</th>
                  <th className={base.numCol}>AOV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={base.strong}>Paid</td>
                  <td className={base.numCol}>{num(data?.paid_vs_organic.paid.orders ?? null)}</td>
                  <td className={base.numCol}>{usd(data?.paid_vs_organic.paid.revenue ?? null)}</td>
                  <td className={base.numCol}>{usd(data?.paid_vs_organic.paid.aov ?? null)}</td>
                </tr>
                <tr>
                  <td className={base.strong}>Organic</td>
                  <td className={base.numCol}>{num(data?.paid_vs_organic.organic.orders ?? null)}</td>
                  <td className={base.numCol}>{usd(data?.paid_vs_organic.organic.revenue ?? null)}</td>
                  <td className={base.numCol}>{usd(data?.paid_vs_organic.organic.aov ?? null)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={base.tableNote}>
            Counts any order with a click ID, so it does not match the channel table.
          </p>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>Pixels</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={base.table}>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>ID</th>
                  <th>Loads</th>
                  <th>Health</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((src) => (
                  <tr key={src.platform}>
                    <td className={base.strong}>{src.platform}</td>
                    <td className={s.mono}>{src.id}</td>
                    <td>{src.runtime ? "Yes" : "No"}</td>
                    <td>
                      <span className={`${s.pill} ${healthClass[src.health]}`}>
                        {src.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>05</span>
            <h2 className={base.sectionTitle}>Open</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={base.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Severity</th>
                  <th>Platform</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ISSUES.map((i) => (
                  <tr key={i.id}>
                    <td className={s.mono}>{i.id}</td>
                    <td>
                      <span className={`${s.sev} ${sevClass[i.severity]}`}>{i.severity}</span>
                    </td>
                    <td>{i.platform}</td>
                    <td className={base.strong}>{i.title}</td>
                    <td className={base.tableNote}>{i.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>06</span>
            <h2 className={base.sectionTitle}>Meta campaign</h2>
          </div>
          <div className={base.findings}>
            {Object.entries({
              Campaign: CAMPAIGN.name,
              "Ad set": CAMPAIGN.adSet,
              Budget: CAMPAIGN.budget,
              Status: CAMPAIGN.status,
              Creative: CAMPAIGN.ads,
              Promo: CAMPAIGN.promo,
            }).map(([k, v]) => (
              <div className={base.finding} key={k}>
                <span className={base.findingKey}>{k}</span>
                <span className={base.findingVal}>{v}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className={base.footer}>
          <a href="/sko-tracking.xlsx">sko-tracking.xlsx</a> ·{" "}
          <Link href="/sko">SKO</Link> · <Link href="/sko/runbook">Runbook</Link>
        </footer>
      </main>
    </div>
  );
}
