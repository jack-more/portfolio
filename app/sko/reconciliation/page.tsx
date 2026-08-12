import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "SKO Compounds — Reconciling the Revenue Numbers — Jack Morello",
  description:
    "Why TikTok, RedTrack and order data report three different revenue figures for the same day, and which one to trust.",
  robots: { index: false, follow: false },
};

/* Source: TikTok Ads Manager export "View Report-2026-07-09-2026-08-06.xlsx",
   single ad 1871013578328498, daily grain. Dashboard and RedTrack figures read
   from screenshots taken 6 August 2026, ~16:57. All arithmetic below is derived
   from those two sources only. */

type Day = { d: string; clicks: number; conv: number; spend: number };

const daily: Day[] = [
  { d: "07-17", clicks: 14, conv: 2, spend: 22.17 },
  { d: "07-18", clicks: 1281, conv: 45, spend: 580.14 },
  { d: "07-19", clicks: 324, conv: 30, spend: 97.41 },
  { d: "07-20", clicks: 60, conv: 19, spend: 75.3 },
  { d: "07-21", clicks: 793, conv: 78, spend: 1184.43 },
  { d: "07-22", clicks: 623, conv: 72, spend: 965.72 },
  { d: "07-23", clicks: 151, conv: 23, spend: 349.52 },
  { d: "07-24", clicks: 627, conv: 43, spend: 962.87 },
  { d: "07-25", clicks: 154, conv: 21, spend: 259.88 },
  { d: "07-26", clicks: 529, conv: 69, spend: 1188.0 },
  { d: "07-27", clicks: 618, conv: 103, spend: 1648.37 },
  { d: "07-28", clicks: 588, conv: 88, spend: 1421.33 },
  { d: "07-29", clicks: 165, conv: 47, spend: 446.8 },
  { d: "07-30", clicks: 730, conv: 88, spend: 1724.47 },
  { d: "07-31", clicks: 784, conv: 97, spend: 1641.18 },
  { d: "08-01", clicks: 397, conv: 62, spend: 1102.42 },
  { d: "08-02", clicks: 840, conv: 106, spend: 2035.41 },
  { d: "08-03", clicks: 949, conv: 71, spend: 1508.58 },
  { d: "08-04", clicks: 414, conv: 43, spend: 719.23 },
  { d: "08-05", clicks: 431, conv: 26, spend: 622.1 },
  { d: "08-06", clicks: 282, conv: 6, spend: 603.21 },
];

const TOTAL_SPEND = 19158.54;
const TOTAL_CLICKS = 10754;
const TOTAL_CONV = 1139;
const VERIFIED_AOV = 203.16;

/* Least-squares fit of conversions on clicks across the 21 delivering days. */
const INTERCEPT = 20.5;
const SLOPE = 0.0659;

const fileFacts = [
  {
    k: "Scope",
    v: "One ad — 1871013578328498 — at daily grain, 9 July to 6 August. Delivery actually starts 17 July, so there are 21 live days in the file. This single ad is carrying the account.",
  },
  {
    k: "Columns",
    v: "Ad ID, day, spend, impressions, CPM, clicks (destination), CPC, clicks (all), CTR, video views, conversions, cost per conversion, currency. Thirteen fields.",
  },
  {
    k: "What's missing",
    v: "There is no revenue column. No value column, no ROAS column, no purchase amount. TikTok did not give you revenue in this export at this grain — so every revenue figure downstream of it is constructed rather than measured.",
  },
  {
    k: "Totals",
    v: "$19,158.54 spend, 10,754 destination clicks, 1,139 reported conversions, $16.82 reported cost per conversion.",
  },
];

const yesterday = [
  {
    src: "TikTok Ads Manager",
    val: "$5,200.07",
    what: "Spend × TikTok's reported ROAS. A platform self-report, built on TikTok's own attributed conversions.",
    trust: "Ranking signal",
  },
  {
    src: "RedTrack",
    val: "$15,537.38",
    what: "All traffic, last-paid attribution. 92% of it lands in the unattributed bucket.",
    trust: "Not joining",
  },
  {
    src: "Order data",
    val: "$13,253.76",
    what: "55 verified orders. Money that actually arrived.",
    trust: "Truth",
  },
];

const impliedAov = [
  { w: "Yesterday", rev: "$5,200.07", conv: "26", aov: "$200.00" },
  { w: "7 days", rev: "$73,554.58", conv: "375", aov: "$196.15" },
  { w: "30 days", rev: "$220,402.67", conv: "1,041", aov: "$211.72" },
];

const corrected = [
  { cvr: "2.0%", orders: "215", cpa: "$89.08", roas: "2.28x" },
  { cvr: "2.5%", orders: "269", cpa: "$71.26", roas: "2.85x" },
  { cvr: "3.0%", orders: "323", cpa: "$59.38", roas: "3.42x" },
];

const verifiedTile = [
  { w: "Yesterday", rev: "$13,253.76", orders: "55" },
  { w: "7 days", rev: "$119,665.51", orders: "585" },
  { w: "30 days", rev: "$20,683.98", orders: "94" },
];

const actions = [
  {
    n: "01",
    t: "Fix the date filter on the verified tile",
    b: "It is the only real-money number on the dashboard and right now it is the one you cannot read. Until the window applies correctly, nothing else on the page can be checked against anything.",
  },
  {
    n: "02",
    t: "Carry the click ID through to the order record",
    b: "RedTrack is meant to be the join between an ad click and an order. At 92% unattributed it isn't joining. On a client-side React storefront the usual causes are query parameters dropped on route transitions, or a click ID that never gets persisted before checkout and never lands on the order itself. This is the upstream fix — everything else is reporting around the gap.",
  },
  {
    n: "03",
    t: "Relabel the TikTok tiles",
    b: "\"Estimated TikTok revenue\" and \"11.99x\" are set in the same type as measured figures, so they read as measurements. They are TikTok's self-report. Use them to rank ads against each other, which they are genuinely good at. Never bank on them.",
  },
  {
    n: "04",
    t: "Regress orders on spend",
    b: "Daily spend on this one ad swings from $75 to $2,035 with no deliberate testing. That variance is free experimental data. Put daily order counts next to these 21 days of daily spend and you get an incrementality read that doesn't depend on a pixel, a click ID, or TikTok's cooperation.",
  },
];

/* ---- chart geometry ---- */
const W = 720;
const H = 420;
const M = { t: 16, r: 16, b: 44, l: 52 };
const X_MAX = 1350;
const Y_MAX = 120;
const px = (v: number) => M.l + (v / X_MAX) * (W - M.l - M.r);
const py = (v: number) => H - M.b - (v / Y_MAX) * (H - M.t - M.b);

const HONEST_CVR = 0.025;

export default function ReconciliationPage() {
  const xTicks = [0, 250, 500, 750, 1000, 1250];
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/sko" className={styles.navBack}>
          ← 90-day plan
        </Link>
        <span className={styles.navTitle}>Reconciliation</span>
        <span className={styles.navNote}>6 August 2026</span>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Three revenue numbers, and which one is real
          </h1>
          <p className={styles.heroLede}>
            For the same day, the dashboard reports $5,200, RedTrack reports
            $15,537, and the order data reports $13,254. Those will never
            agree, because only one of them is revenue — the other two are
            attribution views wearing a dollar sign. Here is what the TikTok
            export actually contains, where the estimate holds up, and where it
            breaks.
          </p>
          <div className={styles.byline}>
            <span>
              Prepared by <strong>Jack Morello</strong>
            </span>
            <span>6 August 2026</span>
            <span>
              <a href="https://jackmorello.com">jackmorello.com</a>
            </span>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>What the export contains</h2>
          </div>
          <p className={styles.body}>
            Everything below comes out of the Ads Manager export covering 9 July
            to 6 August, read at the day level.
          </p>
          <div className={styles.findings}>
            {fileFacts.map((f) => (
              <div key={f.k} className={styles.finding}>
                <span className={styles.findingKey}>{f.k}</span>
                <span className={styles.findingVal}>{f.v}</span>
              </div>
            ))}
          </div>
          <p className={styles.pull}>
            Ad spend is measured. Revenue is inferred. Those two numbers do not
            deserve the same amount of confidence.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>Three numbers for one day</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Source</th>
                  <th className={styles.numCol}>Yesterday</th>
                  <th>What it&rsquo;s counting</th>
                  <th>Use it as</th>
                </tr>
              </thead>
              <tbody>
                {yesterday.map((r) => (
                  <tr key={r.src}>
                    <td className={styles.strong}>{r.src}</td>
                    <td className={`${styles.numCol} ${styles.strong}`}>
                      {r.val}
                    </td>
                    <td>{r.what}</td>
                    <td>{r.trust}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.body}>
            Reconciling these is not a data-cleaning task, because they are not
            three measurements of one quantity. TikTok is reporting what it
            believes it caused. RedTrack is reporting what it managed to tag.
            Your order data is reporting what customers paid. Only the last one
            is a ledger, and it should be the number that settles every
            argument.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>03</span>
            <h2 className={styles.sectionTitle}>
              Right about price, wrong about volume
            </h2>
          </div>
          <p className={styles.body}>
            The estimate is built by applying an hourly rate to conversion
            counts, and the instinct is to distrust the rate. Back it out of
            each panel and the rate turns out to be the healthy part.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Window</th>
                  <th className={styles.numCol}>Est. revenue</th>
                  <th className={styles.numCol}>Conversions</th>
                  <th className={styles.numCol}>Implied AOV</th>
                </tr>
              </thead>
              <tbody>
                {impliedAov.map((r) => (
                  <tr key={r.w}>
                    <td className={styles.strong}>{r.w}</td>
                    <td className={styles.numCol}>{r.rev}</td>
                    <td className={styles.numCol}>{r.conv}</td>
                    <td className={`${styles.numCol} ${styles.strong}`}>
                      {r.aov}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            Verified average order value from order data is $203.16. The implied
            values land within about 4% of it across all three windows.
          </p>
          <p className={styles.pull}>
            The estimate knows what an order is worth. It is wrong about how
            many orders there were.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionTitle}>The evidence</h2>
          </div>
          <p className={styles.body}>
            Across the 21 delivering days, {TOTAL_CONV.toLocaleString()}{" "}
            conversions are credited against{" "}
            {TOTAL_CLICKS.toLocaleString()} destination clicks. That is a{" "}
            <strong>10.59% conversion rate</strong>. Cold direct-to-consumer
            traffic converts between 1% and 3%. A rate four to ten times the
            ceiling is not a performance result, it is a measurement artifact.
          </p>
          <p className={styles.body}>
            Plotting each day&rsquo;s conversions against that day&rsquo;s clicks shows
            where it comes from.
          </p>

          <div className={styles.chart}>
            <div className={styles.chartScroll}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className={styles.chartSvg}
              role="img"
              aria-label="Scatter plot of daily conversions against daily destination clicks for 21 days, with a least-squares fit line intercepting near 20 conversions at zero clicks, and a reference line showing a 2.5 percent click conversion rate."
            >
              {yTicks.map((t) => (
                <g key={`y${t}`}>
                  <line
                    x1={M.l}
                    y1={py(t)}
                    x2={W - M.r}
                    y2={py(t)}
                    stroke="#1c1917"
                    strokeOpacity={t === 0 ? 0.45 : 0.1}
                    strokeWidth="1"
                  />
                  <text
                    x={M.l - 8}
                    y={py(t) + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#1c1917"
                    fillOpacity="0.55"
                  >
                    {t}
                  </text>
                </g>
              ))}
              {xTicks.map((t) => (
                <text
                  key={`x${t}`}
                  x={px(t)}
                  y={H - M.b + 17}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#1c1917"
                  fillOpacity="0.55"
                >
                  {t.toLocaleString()}
                </text>
              ))}

              {/* honest 2.5% reference */}
              <line
                x1={px(0)}
                y1={py(0)}
                x2={px(X_MAX)}
                y2={py(X_MAX * HONEST_CVR)}
                stroke="#1c1917"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              {/* least-squares fit */}
              <line
                x1={px(0)}
                y1={py(INTERCEPT)}
                x2={px(X_MAX)}
                y2={py(INTERCEPT + SLOPE * X_MAX)}
                stroke="#8c2f21"
                strokeWidth="2"
              />
              {/* intercept marker + leader into the empty upper-left region */}
              <circle
                cx={M.l}
                cy={py(INTERCEPT)}
                r="5"
                fill="#8c2f21"
              />
              <line
                x1={M.l + 4}
                y1={py(INTERCEPT) - 8}
                x2={70}
                y2={148}
                stroke="#8c2f21"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text x={66} y={124} fontSize="13" fill="#8c2f21" fontWeight="700">
                20.5 conversions a day
              </text>
              <text x={66} y={140} fontSize="13" fill="#8c2f21" fontWeight="700">
                at zero clicks
              </text>

              {daily.map((d) => (
                <circle
                  key={d.d}
                  cx={px(d.clicks)}
                  cy={py(d.conv)}
                  r="4"
                  fill="#1c1917"
                  fillOpacity={d.d === "08-06" ? 0.25 : 0.8}
                />
              ))}

              <text
                x={M.l}
                y={H - 5}
                fontSize="12"
                fill="#1c1917"
                fillOpacity="0.55"
              >
                Destination clicks per day →
              </text>
              <text
                x={-(M.t + 46)}
                y={14}
                transform="rotate(-90)"
                fontSize="12"
                fill="#1c1917"
                fillOpacity="0.55"
              >
                Conversions →
              </text>
            </svg>
            </div>
            <div className={styles.chartKey}>
              <span>
                <b /> One delivering day
              </span>
              <span>
                <i style={{ borderTopColor: "#8c2f21" }} /> Least-squares fit
              </span>
              <span>
                <i
                  style={{
                    borderTopColor: "rgba(28,25,23,0.5)",
                    borderTopStyle: "dashed",
                  }}
                />{" "}
                2.5% click conversion
              </span>
            </div>
          </div>
          <p className={styles.tableNote}>
            21 days, 17 July to 6 August. 6 August is a partial day — the faded
            point — and is included in the fit.
          </p>

          <p className={styles.body}>
            The fitted line is{" "}
            <strong>
              conversions = {INTERCEPT} + {SLOPE} × clicks
            </strong>
            . The intercept is the part that matters: roughly{" "}
            <strong>20 conversions a day get credited at zero clicks</strong>.
            Over 21 days that is about 430 of the 1,139 — 38% — with no
            relationship to click volume at all. You can see the same thing
            without any statistics by reading the low-click days: 20 July posts
            a 31.7% conversion rate on 60 clicks, and 29 July posts 28.5% on 165
            clicks, while 18 July posts 3.5% on 1,281 clicks. Genuine
            click-driven conversion does not swing fifteen-fold day to day. A
            roughly constant view-through floor does, because on a low-click day
            it is nearly all that&rsquo;s left.
          </p>
          <p className={styles.body}>
            Holding spend and clicks fixed and substituting a defensible click
            conversion rate gives the range the account is actually operating
            in:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>True click CVR</th>
                  <th className={styles.numCol}>Orders</th>
                  <th className={styles.numCol}>Cost per order</th>
                  <th className={styles.numCol}>ROAS</th>
                </tr>
              </thead>
              <tbody>
                {corrected.map((r) => (
                  <tr key={r.cvr}>
                    <td className={styles.strong}>{r.cvr}</td>
                    <td className={styles.numCol}>{r.orders}</td>
                    <td className={`${styles.numCol} ${styles.strong}`}>
                      {r.cpa}
                    </td>
                    <td className={styles.numCol}>{r.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            On ${TOTAL_SPEND.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            spend and {TOTAL_CLICKS.toLocaleString()} clicks, at the verified
            $203.16 average order value.
          </p>
          <p className={styles.body}>
            That brackets the figure the order data gives independently — around
            $63 a sale, a little over 3x. Two different routes to the same
            answer, which is the reason to believe it. Against that, the
            reported $16.82 is off by roughly a factor of four.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>05</span>
            <h2 className={styles.sectionTitle}>
              A bug in the verified tile
            </h2>
          </div>
          <p className={styles.body}>
            Separate from the estimate, and worth fixing first because it is
            cheap. Reading the verified order revenue across the three tabs:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Window</th>
                  <th className={styles.numCol}>Verified revenue</th>
                  <th className={styles.numCol}>Verified orders</th>
                </tr>
              </thead>
              <tbody>
                {verifiedTile.map((r) => (
                  <tr key={r.w}>
                    <td className={styles.strong}>{r.w}</td>
                    <td className={styles.numCol}>{r.rev}</td>
                    <td className={styles.numCol}>{r.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.flag}>
            <span className={styles.flagLabel}>Impossible</span>
            <span className={styles.cardBody}>
              The 30-day window contains the 7-day window, so it cannot be
              smaller. $20,683.98 over 30 days against $119,665.51 over 7 days
              means the tile is not applying the date filter. The 7-day figure
              is close to the entire order dataset on record — $119,865.82 from
              590 orders — which suggests that tab is returning everything,
              while the 30-day tab is returning some narrower join.
            </span>
          </div>
          <p className={styles.body}>
            This is the number the whole dashboard should be anchored to, so it
            is the one that has to be right before anything else on the page can
            be trusted.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>06</span>
            <h2 className={styles.sectionTitle}>
              Why RedTrack can&rsquo;t close this
            </h2>
          </div>
          <p className={styles.body}>
            RedTrack exists to be the join between an ad click and an order.
            Yesterday it put <strong>$14,361.24 across 55 purchases</strong>{" "}
            into unattributed traffic, against{" "}
            <strong>$1,176.14 across 6</strong> for TikTok. That is roughly 92%
            unattributed. Its ad spend column also reads $0.00 — there is no
            cost feed connected — so every ROAS figure it produces is
            structurally zero.
          </p>
          <p className={styles.body}>
            A tracker attributing 8% of revenue is not a source of truth and
            can&rsquo;t be reconciled against; it is a broken join reporting its own
            failure. On a client-side React storefront the usual causes are
            ordinary: UTM parameters lost on route transitions, or a click ID
            captured on landing that never persists as far as the order record.
            Worth pointing at directly rather than working around.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>07</span>
            <h2 className={styles.sectionTitle}>What to do</h2>
          </div>
          <p className={styles.body}>
            You cannot make a derived number agree with a measured one. So stop
            trying to make them match — name the order data as truth, and demote
            everything else to a share of it.
          </p>
          <div className={styles.stack}>
            {actions.map((a) => (
              <div key={a.n} className={styles.card}>
                <span className={styles.cardLabel}>{a.n}</span>
                <span className={styles.cardTitle}>{a.t}</span>
                <span className={styles.cardBody}>{a.b}</span>
              </div>
            ))}
          </div>
          <p className={styles.pull}>
            TikTok&rsquo;s numbers are good at ranking ads against each other. Order
            data is the only thing that counts money. Neither job is improved by
            pretending they are the same number.
          </p>
        </section>

        <footer className={styles.footer}>
          <span>
            Prepared for SKO Compounds, 6 August 2026. Derived from the Ads
            Manager export covering 9 July to 6 August, and from dashboard and
            RedTrack figures as displayed on 6 August. The TikTok feed was
            showing a cached refresh failure at the time of reading, so the
            live totals may have moved since.
          </span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
