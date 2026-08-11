import type { Metadata } from "next";
import Link from "next/link";
import base from "../sko/page.module.css";
import s from "./page.module.css";
import {
  SOURCES,
  COVERAGE,
  ISSUES,
  CAMPAIGN,
  CHANNELS,
  LAST_VERIFIED,
  WEEK_OF,
  TOP_ADS,
  UGC_NOTE,
} from "./data";
import { getAttribution, usd, num, roas } from "./attribution";

/* Numbers must be live, never frozen at build time. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SKO Compounds — Tracking Status — Jack Morello",
  description:
    "Live status of every measurement source on skocompounds.com: OpenAI, Meta, TikTok, Google and RedTrack.",
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

const issueClass: Record<string, string> = {
  blocker: s.issueBlocker,
  high: s.issueHigh,
  medium: s.issueMedium,
};

export default async function SkoTracking() {
  const openBlockers = ISSUES.filter((i) => i.severity === "blocker").length;
  const openIssues = ISSUES.filter((i) => i.status !== "Monitor").length;
  const liveSources = SOURCES.filter((x) => x.runtime).length;

  const { data, error } = await getAttribution("2026-08-04", "2026-08-10");

  /* Join live revenue onto the channels we track spend for. A channel with
     no row in by_source genuinely produced no orders — that is a real zero,
     not missing data, so it renders as 0 rather than a dash. */
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
        <span className={base.navTitle}>Tracking Status</span>
        <span className={base.navNote}>Verified {LAST_VERIFIED}</span>
      </nav>

      <main className={base.main}>
        <header className={base.hero}>
          <h1 className={base.heroTitle}>Every measurement source, in one place</h1>
          <p className={base.heroLede}>
            Five platforms read this site, each with its own pixel, its own server copy
            and its own failure mode. This page is the single record of what is actually
            firing — observed on the live site, not taken from the implementation notes.
            Where the notes and the runtime disagree, that disagreement is the finding.
          </p>
          <div className={base.byline}>
            <span>
              <strong>{liveSources}/5</strong> sources loading
            </span>
            <span>
              <strong>{openIssues}</strong> open issues
            </span>
            <span>
              <strong>{openBlockers}</strong> blocking launch
            </span>
            <span>
              <a href="/sko-tracking.xlsx">Download workbook</a>
            </span>
          </div>
        </header>

        {/* 01 — weekly scorecard */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>Weekly scorecard</h2>
          </div>
          <p className={base.body}>
            Week of {WEEK_OF}. Revenue and orders are pulled live from the orders
            table — your own data, not the platforms grading their own homework.
            Spend is read from each ad account by hand, since none of them expose it
            to this page.
          </p>

          {error ? (
            <div className={base.flag}>
              <span className={base.flagLabel}>Live data unavailable</span>
              <p className={base.cardBody}>
                {error}. Figures below show dashes rather than stale numbers.
              </p>
            </div>
          ) : null}

          <div className={s.summary}>
            <div className={s.stat}>
              <span className={s.statNum}>{usd(data?.totals.revenue ?? null)}</span>
              <span className={s.statLabel}>Revenue, all sources</span>
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
          </div>

          <p className={base.subhead}>By channel</p>
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
                <tr>
                  <td className={base.strong}>Paid total</td>
                  <td className={base.numCol}>{usd(totalSpend)}</td>
                  <td className={base.numCol}>{usd(data ? paidRevenue : null)}</td>
                  <td className={base.numCol}>—</td>
                  <td className={base.numCol}>
                    {roas(data ? paidRevenue : null, totalSpend)}
                  </td>
                  <td className={base.numCol}>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={base.tableNote}>
            Affiliate and Google show no spend because neither is media buying this
            page can read — affiliate cost is commission, and Google&apos;s dashboard
            is not connected. Their ROAS is intentionally blank rather than
            flattering.
          </p>

          <p className={base.subhead}>Paid vs organic, by click ID</p>
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
          <div className={base.flag}>
            <span className={base.flagLabel}>These two tables disagree</span>
            <p className={base.cardBody}>
              The channel table shows {num(
                rows.filter((r) => r.spend !== null).reduce((a, r) => a + (r.orders ?? 0), 0),
              )}{" "}
              orders from paid sources, while the paid bucket counts{" "}
              {num(data?.paid_vs_organic.paid.orders ?? null)}. The bucket also counts
              any order carrying a click ID regardless of its source, so affiliate and
              organic orders with a click ID land in it. Until that is reconciled,
              quote the channel table — it is the conservative one.
            </p>
          </div>

          <p className={base.subhead}>Top performing ads</p>
          {TOP_ADS.length === 0 ? (
            <p className={base.tableNote}>
              Nothing to rank yet — no ad in the new campaign has delivered an
              impression. This fills in once spend starts and there is a week of
              data to sort by.
            </p>
          ) : (
            <div className={base.tableWrap}>
              <table className={`${base.table} ${s.adsTable}`}>
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Platform</th>
                    <th className={base.numCol}>Spend</th>
                    <th className={base.numCol}>Revenue</th>
                    <th className={base.numCol}>ROAS</th>
                    <th>Why it works</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_ADS.map((a) => (
                    <tr key={a.ad}>
                      <td className={base.strong}>{a.ad}</td>
                      <td>{a.platform}</td>
                      <td className={base.numCol}>{usd(a.spend)}</td>
                      <td className={base.numCol}>{usd(a.revenue)}</td>
                      <td className={base.numCol}>{roas(a.revenue, a.spend)}</td>
                      <td className={base.tableNote}>{a.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={base.flag}>
            <span className={base.flagLabel}>On attributing revenue to UGC</span>
            <p className={base.cardBody}>{UGC_NOTE}</p>
          </div>
        </section>

        {/* 02 — status */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>02</span>
            <h2 className={base.sectionTitle}>Source status</h2>
          </div>

          <div className={s.summary}>
            <div className={s.stat}>
              <span className={s.statNum}>{liveSources}</span>
              <span className={s.statLabel}>Loading live</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>{openBlockers}</span>
              <span className={s.statLabel}>Blockers</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>180</span>
              <span className={s.statLabel}>Events rejected / 7d</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>{CAMPAIGN.ads.split(" ")[0]}/12</span>
              <span className={s.statLabel}>Ads built</span>
            </div>
          </div>

          <div className={base.tableWrap}>
            <table className={base.table}>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>ID</th>
                  <th>Loads</th>
                  <th>Server copy</th>
                  <th>Health</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((src) => (
                  <tr key={src.platform}>
                    <td className={base.strong}>{src.platform}</td>
                    <td className={s.mono}>{src.id}</td>
                    <td>
                      <span
                        className={`${s.dot} ${src.runtime ? s.dotYes : s.dotNo}`}
                        aria-hidden="true"
                      />
                      {src.runtime ? "Yes" : "No"}
                    </td>
                    <td>{src.serverEvents ?? "—"}</td>
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

          <div className={base.stack}>
            {SOURCES.map((src) => (
              <div className={base.card} key={`note-${src.platform}`}>
                <span className={base.cardLabel}>{src.platform}</span>
                <p className={base.cardBody}>{src.note}</p>
                <p className={base.tableNote}>
                  Hook point: <span className={s.mono}>{src.hookPoint}</span>
                  {src.dedupeKey ? ` · Dedupe: ${src.dedupeKey}` : ""}
                  {src.secrets.length ? ` · Secrets: ${src.secrets.join(", ")}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 02 — coverage */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>03</span>
            <h2 className={base.sectionTitle}>Funnel coverage</h2>
          </div>
          <p className={base.body}>
            Which platform hears about each step. Gaps are not automatically wrong —
            OpenAI only needs checkout and purchase — but a blank in the purchase row
            would mean a platform optimizing on nothing.
          </p>
          <div className={base.tableWrap}>
            <table className={base.table}>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>OpenAI</th>
                  <th>Meta</th>
                  <th>TikTok</th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map((row) => (
                  <tr key={row.step}>
                    <td className={base.strong}>{row.step}</td>
                    <td>{row.openai}</td>
                    <td>{row.meta}</td>
                    <td>{row.tiktok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={base.tableNote}>
            Google and RedTrack are measurement and attribution rather than bid signal,
            so they sit outside this matrix.
          </p>
        </section>

        {/* 03 — issues */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>Open issues</h2>
          </div>
          <div className={base.stack}>
            {ISSUES.map((issue) => (
              <div className={`${s.issue} ${issueClass[issue.severity]}`} key={issue.id}>
                <div className={s.issueTop}>
                  <span className={s.issueId}>{issue.id}</span>
                  <span className={`${s.sev} ${sevClass[issue.severity]}`}>
                    {issue.severity}
                  </span>
                  <span className={s.issueMeta}>{issue.platform}</span>
                </div>
                <h3 className={s.issueTitle}>{issue.title}</h3>
                <p className={base.cardBody}>{issue.detail}</p>
                <p className={s.issueFix}>{issue.fix}</p>
                <p className={s.issueMeta}>{issue.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — campaign */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>05</span>
            <h2 className={base.sectionTitle}>Campaign this feeds</h2>
          </div>
          <div className={base.findings}>
            {Object.entries({
              Campaign: CAMPAIGN.name,
              "Ad account": CAMPAIGN.account,
              "Ad set": CAMPAIGN.adSet,
              Objective: CAMPAIGN.objective,
              Budget: CAMPAIGN.budget,
              Ceiling: CAMPAIGN.ceiling,
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
          <div className={base.flag}>
            <span className={base.flagLabel}>Before this runs</span>
            <p className={base.cardBody}>
              The Meta dataset the ad set optimizes against has not yet been observed
              receiving a Purchase. Spending $250 a day against a model with no
              conversion signal produces delivery without learning. One test order
              settles it.
            </p>
          </div>
        </section>

        <footer className={base.footer}>
          <p>
            Runtime figures observed directly on skocompounds.com on {LAST_VERIFIED}.
            Implementation details supplied by the SKO engineering notes. The workbook
            and this page are generated from the same source file, so they cannot drift.
          </p>
          <p>
            <a href="/sko-tracking.xlsx">sko-tracking.xlsx</a> · <Link href="/sko">SKO plan</Link> ·{" "}
            <Link href="/sko/runbook">Runbook</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
