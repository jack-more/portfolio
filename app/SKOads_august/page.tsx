import type { Metadata } from "next";
import base from "../sko/page.module.css";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "SKO Paid Ads — Week of Aug 9–16",
  robots: { index: false, follow: false },
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 1000 ? 0 : 2 });
const x = (n: number) => `${n.toFixed(2)}×`;

/* All figures are platform-reported (TikTok / Meta pixel), Aug 9–16 2026.
   Source exports are on file; 7-day click window means recent days drift up. */

const TIKTOK_ADS = [
  { name: "summer30 2", spend: 3298.82, pur: 45, rev: 10737.85, cpa: 73.31, note: "fatigued" },
  { name: "ETHAN UGC", spend: 1445.81, pur: 30, rev: 7893.62, cpa: 48.19, note: "winner" },
  { name: "LAST CHANCE SUMMER 30", spend: 635.43, pur: 18, rev: 3262.87, cpa: 35.3, note: "winner" },
  { name: "ETHAN UGC 2", spend: 267.41, pur: 3, rev: 487.38, cpa: 89.14, note: "cut" },
];

const SUMMER30_TOP = [
  { name: "GLOW Compound-New_Hook-0-1", spend: 70.92, pur: 3, rev: 636.8, thumb: "/skoads/glow-newhook.jpg" },
  { name: "SKOBOX_9X16_05s", spend: 116.52, pur: 5, rev: 845.24, thumb: "/skoads/skobox.jpg" },
  { name: "7663698610439192583 (Spark)", spend: 213.55, pur: 4, rev: 1460.27, thumb: "/skoads/spark.jpg" },
  { name: "AI Generated Video-3", spend: 145.92, pur: 3, rev: 898.84, thumb: "/skoads/ai-video-3.jpg" },
  { name: "GLOW-Narrated-8-11", spend: 125.46, pur: 4, rev: 609.68, thumb: "/skoads/glow-narrated-8-11.jpg" },
  { name: "ethan UGC_vKCU0o8b", spend: 351.49, pur: 7, rev: 1295.55, thumb: "/skoads/ethan-1.jpg" },
];

const ETHAN_CREATIVES = [
  { name: "ethan UGC_vKCU0o8b.MP4", spend: 842.47, pur: 17, rev: 4564.21, ctr: "2.35%", thumb: "/skoads/ethan-1.jpg" },
  { name: "ethan ugc 2_lEe0p2xn.MOV", spend: 603.34, pur: 13, rev: 3329.41, ctr: "1.92%", thumb: "/skoads/ethan-2.jpg" },
];

const LASTCHANCE_TOP = [
  { name: "ethan UGC_vKCU0o8b", spend: 109.95, pur: 4, rev: 734.0, thumb: "/skoads/ethan-1.jpg" },
  { name: "EYE_GIANT_9X16_15s", spend: 31.3, pur: 3, rev: 718.91, thumb: "/skoads/eye-giant.jpg" },
  { name: "GLOW_70MG-Narrated-6-9", spend: 9.86, pur: 2, rev: 229.24, thumb: "/skoads/glow70-narrated-6-9.jpg" },
  { name: "SKOBOX_9X16_05s", spend: 12.31, pur: 1, rev: 218.6, thumb: "/skoads/skobox.jpg" },
  { name: "99% Purity product card", spend: 10.02, pur: 1, rev: 325.81, thumb: "/skoads/purity-card.jpg" },
];

const META_ADS = [
  { name: "ETHAN UGC summer 30", spend: 61.71, impr: 2321, clicks: 89, co: 0, est: "~1", thumb: "/skoads/ethan-1.jpg" },
  { name: "PUREST", spend: 28.91, impr: 1296, clicks: 16, co: 3, est: "~2", thumb: "/skoads/purest.jpg" },
  { name: "GIANTWOMAN + AI IMAGE", spend: 9.14, impr: 388, clicks: 10, co: 0, est: "" },
  { name: "New Sales Ad", spend: 0.21, impr: 7, clicks: 0, co: 0, est: "" },
];

const UGC_PLACEMENTS = [
  { name: "ETHAN UGC ad (both videos)", spend: 1445.81, pur: 30, rev: 7893.62 },
  { name: "inside summer30 2", spend: 351.49, pur: 7, rev: 1295.55 },
  { name: "inside LAST CHANCE", spend: 118.04, pur: 4, rev: 734.0 },
  { name: "ETHAN UGC 2 (re-cuts)", spend: 267.41, pur: 3, rev: 487.38 },
];

function Bar({ win, mid, dead, keyWin, keyMid, keyDead }: {
  win: number; mid: number; dead: number; keyWin: string; keyMid: string; keyDead: string;
}) {
  const total = win + mid + dead;
  return (
    <div className={base.stack} style={{ gap: "0.45rem" }}>
      <div className={s.bar}>
        <span className={`${s.barSeg} ${s.segWin}`} style={{ width: `${(win / total) * 100}%` }} />
        <span className={`${s.barSeg} ${s.segMid}`} style={{ width: `${(mid / total) * 100}%` }} />
        <span className={`${s.barSeg} ${s.segDead}`} style={{ width: `${(dead / total) * 100}%` }} />
      </div>
      <div className={s.barKey}>
        <span><i className={`${s.swatch} ${s.segWin}`} /><b>{keyWin}</b></span>
        <span><i className={`${s.swatch} ${s.segMid}`} /><b>{keyMid}</b></span>
        <span><i className={`${s.swatch} ${s.segDead}`} /><b>{keyDead}</b></span>
      </div>
    </div>
  );
}

function AdTable({ rows, total }: {
  rows: { name: string; spend: number; pur: number; rev: number; ctr?: string; thumb?: string }[];
  total?: boolean;
}) {
  const t = rows.reduce(
    (a, r) => ({ spend: a.spend + r.spend, pur: a.pur + r.pur, rev: a.rev + r.rev }),
    { spend: 0, pur: 0, rev: 0 },
  );
  return (
    <div className={base.tableWrap}>
      <table className={`${base.table} ${s.num}`}>
        <thead>
          <tr>
            <th>Creative</th><th>Spend</th><th>Purch</th><th>Revenue</th><th>ROAS</th><th>CPA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
              <td>{usd(r.spend)}</td>
              <td>{r.pur}</td>
              <td>{usd(r.rev)}</td>
              <td className={r.rev / r.spend >= 5 ? s.good : r.rev / r.spend < 2.5 ? s.bad : undefined}>
                {x(r.rev / r.spend)}
              </td>
              <td>{r.pur ? usd(r.spend / r.pur) : "—"}</td>
            </tr>
          ))}
          {total ? (
            <tr className={s.rowStrong}>
              <td>Total</td>
              <td>{usd(t.spend)}</td>
              <td>{t.pur}</td>
              <td>{usd(t.rev)}</td>
              <td>{x(t.rev / t.spend)}</td>
              <td>{usd(t.spend / t.pur)}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default function SkoAdsAugust() {
  return (
    <div className={base.page}>
      <nav className={base.nav}>
        <span className={base.navTitle}>SKO · Paid Ads</span>
        <span className={base.navNote}>Week of Aug 9–16, 2026</span>
      </nav>

      <main className={`${base.main} ${s.big}`}>
        {/* ---- topline ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>Topline</h2>
          </div>

          <div className={s.summary}>
            <div className={s.stat}>
              <span className={s.statNum}>$5,747</span>
              <span className={s.statLabel}>Spend</span>
              <span className={`${s.statDelta} ${s.down}`}>−17% vs prior wk</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>$22,382</span>
              <span className={s.statLabel}>Ad revenue</span>
              <span className={`${s.statDelta} ${s.flat}`}>platform-reported</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>96</span>
              <span className={s.statLabel}>Purchases</span>
              <span className={`${s.statDelta} ${s.flat}`}>$233 avg</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>3.96×</span>
              <span className={s.statLabel}>ROAS</span>
              <span className={`${s.statDelta} ${s.down}`}>from 10.8×</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>$58.83</span>
              <span className={s.statLabel}>Cost / purchase</span>
              <span className={`${s.statDelta} ${s.down}`}>from $17.85</span>
            </div>
          </div>

          <p className={base.body}>
            The week-over-week drop is one ad: <strong>summer30 2</strong> ran ~10× in
            early August and has fatigued to 3.26×. The campaigns that replaced it
            (ETHAN UGC, LAST CHANCE — launched Aug 11–13) convert at 5.1–5.5× but are
            still small. The account is mid-handoff from a decaying winner to new
            creative.
          </p>
          <p className={s.footnote}>
            All conversion figures are platform-reported (TikTok pixel, 7-day click /
            1-day view). Our own order table reads lower — click IDs die in in-app
            browsers. Recent days drift up as the click window closes.
          </p>
        </section>

        {/* ---- tiktok by ad ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>02</span>
            <h2 className={base.sectionTitle}>TikTok — by ad</h2>
          </div>
          <AdTable rows={TIKTOK_ADS} total />
          <p className={base.body}>
            <strong>Ethan's two videos are the account.</strong> 5.46× in their own ad
            at 2.2% CTR — triple the account average. LAST CHANCE has the best CPA
            ($35.30). summer30 2 still produces but costs twice what it did. ETHAN
            UGC 2 is six re-cuts of the same footage; none beat the originals — pause
            it.
          </p>
        </section>

        {/* ---- creative level ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>03</span>
            <h2 className={base.sectionTitle}>Inside the ads — creative level</h2>
          </div>

          <p className={s.pullBig}>
            The same Ethan video runs 6.68× in a small rotation, 5.42× in its own ad,
            and 3.69× buried in a 96-creative pool. Dilution costs ~2 points of ROAS
            on identical footage.
          </p>

          <h3 className={s.subheadBig}>summer30 2 — 96 creatives in rotation</h3>
          <Bar
            win={1147} mid={900} dead={1251}
            keyWin="6 proven creatives · $1,147"
            keyMid="13 marginal · ~$900"
            keyDead="77 creatives, zero purchases · $1,251 (38%)"
          />
          <AdTable rows={SUMMER30_TOP} />
          <p className={s.footnote}>
            The algorithm's biggest pick — <span className={s.mono}>7663697803021975572</span>,
            $214 — bought 2 purchases at $107 CPA. AI Generated Video-4 spent $166 for
            one purchase (0.72×, underwater). Budget flows to the wrong copies.
          </p>

          <h3 className={s.subheadBig}>ETHAN UGC — 2 creatives, zero waste</h3>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Creative</th><th>Spend</th><th>Purch</th><th>Revenue</th><th>ROAS</th><th>CTR</th></tr>
              </thead>
              <tbody>
                {ETHAN_CREATIVES.map((r) => (
                  <tr key={r.name}>
                    <td><img src={r.thumb} alt="" className={s.thumb} />{r.name}</td>
                    <td>{usd(r.spend)}</td>
                    <td>{r.pur}</td>
                    <td>{usd(r.rev)}</td>
                    <td className={s.good}>{x(r.rev / r.spend)}</td>
                    <td>{r.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.footnote}>This is what a healthy ad looks like. Every dollar on something that converts.</p>

          <h3 className={s.subheadBig}>LAST CHANCE SUMMER 30 — 87 creatives, same dilution</h3>
          <Bar
            win={173} mid={152} dead={310}
            keyWin="5 converting creatives · $173"
            keyMid="7 marginal · ~$152"
            keyDead="75 creatives, zero purchases · $310 (49%)"
          />
          <AdTable rows={LASTCHANCE_TOP} />
          <p className={s.footnote}>
            Sub-$35 spends — signals, not proven winners. But the same three names
            convert in every pool: <strong>Ethan, SKOBOX, EYE_GIANT</strong>.
          </p>
        </section>

        {/* ---- meta ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>Meta — first week live</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Ad</th><th>Spend</th><th>Clicks</th><th>CTR</th><th>Checkouts†</th><th>Est. purchases*</th></tr>
              </thead>
              <tbody>
                {META_ADS.map((r) => (
                  <tr key={r.name}>
                    <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
                    <td>{usd(r.spend)}</td>
                    <td>{r.clicks}</td>
                    <td>{r.impr ? `${((r.clicks / r.impr) * 100).toFixed(1)}%` : "—"}</td>
                    <td className={r.co ? s.good : s.dim}>{r.co || "—"}</td>
                    <td className={r.est ? s.good : s.dim}>{r.est || "—"}</td>
                  </tr>
                ))}
                <tr className={s.rowStrong}>
                  <td>Total</td><td>{usd(99.97)}</td><td>115</td><td>2.9%</td><td>3 · $34.32 ea</td><td>~2–3*</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={base.body}>
            *Est. purchases are <strong>modeled, not tracked</strong> — the same way
            Meta reports modeled conversions where tracking is incomplete: clicks ×
            the site's 1.24% conversion rate (ETHAN ~1), and initiated checkouts ×
            a ~55% completion rate (PUREST ~2). Modeled total: ~2–3 purchases ≈
            $410–615 revenue ≈ <strong>4–6× modeled ROAS</strong> on $100 —
            directional until tracked data lands Aug 17–23.
            †Purchase tracking was not functional until Aug 15–16, so ad-level
            purchase counts are not reportable for this period — checkouts are the
            attributed conversion signal this week. Early reporting is still
            fuzzy — but the signal is real. This is a fresh
            account (the previous account was banned; this one is warming deliberately)
            and the purchase event was broken until Aug 15–16, so Meta could not record
            a sale even if one happened. What <em>is</em> verified, ad by ad:{" "}
            <strong>attribution works</strong> — all 3 initiated checkouts credit to
            PUREST at $9.87 each, and with the purchase event capturing ~10% of orders,
            a completed Meta purchase may already exist that the pixel missed. Treat
            Meta as signal, not fact, until the capture fix ships.{" "}
            <strong>TikTok carries volume in the meantime; first clean Meta read is
            Aug 17–23.</strong>
          </p>

          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Early signal</th><th>Reading</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Checkout attribution verified</td>
                  <td>3 checkouts → PUREST · <span className={s.good}>$9.87 each</span></td>
                </tr>
                <tr>
                  <td>Click quality — Ethan UGC</td>
                  <td>3.87% CTR, rising to <span className={s.good}>5.19%</span> Aug 15–16</td>
                </tr>
                <tr>
                  <td>Intent vs curiosity</td>
                  <td>PUREST: ⅓ the CTR, 100% of checkouts — highest-intent clicks</td>
                </tr>
                <tr>
                  <td>Metric while stock is low</td>
                  <td>Cost per checkout initiated — ROAS returns at restock</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={s.summary}>
            <div className={s.stat}>
              <span className={s.statNum}>Live</span>
              <span className={s.statLabel}>Pixel in production</span>
              <span className={`${s.statDelta} ${s.up}`}>since Fri — full funnel firing</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>2.4K</span>
              <span className={s.statLabel}>PageViews</span>
              <span className={`${s.statDelta} ${s.flat}`}>468 content views</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>109</span>
              <span className={s.statLabel}>Adds to cart</span>
              <span className={`${s.statDelta} ${s.flat}`}>40 checkouts</span>
            </div>
          </div>

          <p className={base.body}>
            The pixel went live in production Friday and the funnel is firing — 2.4K
            PageViews → 468 ViewContent → 109 AddToCart → 40 Checkout. Purchase-event
            counts are <strong>excluded until the capture fix ships</strong>: a
            payment-verification gate currently stops the event on ~90% of orders
            (fix ticketed with Lovable), so any pixel purchase number would massively
            understate real volume — the site did ~500 orders last week per the order
            table. Once the fix deploys, purchase capture should match the order table
            and Meta ROAS becomes readable for the first time.
          </p>
        </section>

        {/* ---- ugc ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>05</span>
            <h2 className={base.sectionTitle}>UGC performance</h2>
          </div>

          <div className={s.summary}>
            <div className={s.stat}>
              <span className={s.statNum}>2</span>
              <span className={s.statLabel}>Videos (Ethan)</span>
              <span className={`${s.statDelta} ${s.flat}`}>5 paid placements</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>~155K</span>
              <span className={s.statLabel}>Paid views</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok + Meta</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>$10,411</span>
              <span className={s.statLabel}>UGC revenue</span>
              <span className={`${s.statDelta} ${s.up}`}>46% of ad revenue</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>4.77×</span>
              <span className={s.statLabel}>UGC ROAS</span>
              <span className={`${s.statDelta} ${s.flat}`}>on 39% of spend</span>
            </div>
          </div>

          <AdTable rows={UGC_PLACEMENTS} total />
          <p className={base.body}>
            Two videos from one creator produced <strong>$10,410.55 across 44
            purchases</strong> — 46% of the week's tracked ad revenue on 39% of the
            spend. The format is proven; the re-cuts are not. The ask is more raw
            footage, not more edits.
          </p>
        </section>

        {/* ---- next week ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>06</span>
            <h2 className={base.sectionTitle}>Next week — 25% inventory left</h2>
          </div>

          <p className={s.pullBig}>
            Scaling into a stock-out pays a 30% discount plus ad dollars to sell
            inventory that would sell at full price before restock. Cut to winners;
            don't scale.
          </p>

          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Move</th><th>Budget / wk</th></tr>
              </thead>
              <tbody>
                <tr><td>ETHAN UGC — hold</td><td>$1,500</td></tr>
                <tr><td>LAST CHANCE — raise (best CPA)</td><td>$1,200</td></tr>
                <tr><td>summer30 2 — cut, strip pool 96 → 10</td><td>$800–1,000</td></tr>
                <tr><td>ETHAN UGC 2 — pause</td><td>$0</td></tr>
                <tr><td>Meta — tracking-validation week</td><td>$100–150</td></tr>
                <tr className={s.rowStrong}>
                  <td>Goal spend</td><td>$3,500–4,000</td>
                </tr>
                <tr className={s.rowStrong}>
                  <td>Goal revenue (platform-reported)</td><td>$15,000–18,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul className={base.list}>
            <li>
              <strong>Turn SUMMER30 off for paid traffic.</strong> At 25% stock the
              discount pays people to buy inventory that sells itself.
            </li>
            <li>
              <strong>Build one clean ad</strong> from the six proven creatives: Ethan ×2,
              SKOBOX, EYE_GIANT, GLOW New_Hook-0-1, the Spark post.
            </li>
            <li>
              <strong>If stock gets tight, throttle to $20–30/day floors — don't pause.</strong>{" "}
              Paused campaigns lose their learning; throttled ones don't. Restock date
              sets the re-scale date.
            </li>
            <li>
              Needed to firm this up: the restock date, and whether the ads sell the
              SKUs that are running out. If yes, budgets drop this week, not next.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
