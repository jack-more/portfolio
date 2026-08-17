import type { Metadata } from "next";
import base from "../sko/page.module.css";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "SKO Paid Ads — Week of Aug 9–17",
  robots: { index: false, follow: false },
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 1000 ? 0 : 2 });
const x = (n: number) => `${n.toFixed(2)}×`;

/* heat tiers: >=5 win · 3.5-5 runner-up · 2.5-3.5 neutral · 1.2-2.5 weak · <1.2 dead */
const roasTier = (r: number) =>
  r >= 5 ? s.tWin : r >= 3.5 ? s.tOk : r >= 2.5 ? undefined : r >= 1.2 ? s.tWarn : s.tBad;
const shareTier = (shP: number, shS: number) =>
  shP > shS * 1.4 ? s.tWin : shP > shS + 0.5 ? s.tOk : shP < shS * 0.4 ? s.tBad : shP < shS - 0.5 ? s.tWarn : undefined;

/* All figures are platform-reported (TikTok / Meta pixel), Aug 9–16 2026.
   Source exports are on file; 7-day click window means recent days drift up. */

const TT = { spend: 9028.61, pur: 154 };

const TIKTOK_ADS = [
  { name: "summer30 2", spend: 4980.52, pur: 66, rev: 15471.93 },
  { name: "ETHAN UGC", spend: 1819.29, pur: 36, rev: 8798.45, thumb: "/skoads/ethan-1.jpg" },
  { name: "ETHAN UGC 2 (new content)", spend: 1479.66, pur: 30, rev: 5373.86 },
  { name: "LAST CHANCE SUMMER 30", spend: 749.14, pur: 22, rev: 3904.7 },
];

const SUMMER30_TOP = [
  { name: "EYE_GIANT_9X16_15s", spend: 471.91, pur: 12, rev: 3287.6, thumb: "/skoads/eye-giant.jpg" },
  { name: "ethan UGC_vKCU0o8b", spend: 561.16, pur: 11, rev: 1792.53, thumb: "/skoads/ethan-1.jpg" },
  { name: "SKOBOX_9X16_05s", spend: 180.63, pur: 6, rev: 981.1, thumb: "/skoads/skobox.jpg" },
  { name: "7663698610439192583 (Spark)", spend: 219.84, pur: 4, rev: 1460.27, thumb: "/skoads/spark.jpg" },
  { name: "AI Generated Video-3", spend: 203.91, pur: 3, rev: 898.84, thumb: "/skoads/ai-video-3.jpg" },
  { name: "AI Generated Video-4", spend: 220.62, pur: 1, rev: 119.7, thumb: "/skoads/ai-video-4.jpg" },
];

const ETHAN_CREATIVES = [
  { name: "ethan UGC_vKCU0o8b.MP4", spend: 961.87, pur: 20, rev: 5029.91, thumb: "/skoads/ethan-1.jpg" },
  { name: "ethan ugc 2_lEe0p2xn.MOV", spend: 857.42, pur: 16, rev: 3768.54, thumb: "/skoads/ethan-2.jpg" },
];

const E2_CREATIVES = [
  { name: "New video A (copy_655C…)", spend: 766.08, pur: 16, rev: 2635.46, thumb: "/skoads/e2-a.jpg" },
  { name: "New video B (copy_A0FA…)", spend: 410.19, pur: 11, rev: 2433.68, thumb: "/skoads/e2-b.jpg" },
  { name: "Logo/background versions ×4 (combined)", spend: 303.39, pur: 3, rev: 304.72 },
];

const LASTCHANCE_TOP = [
  { name: "ethan UGC_vKCU0o8b", spend: 109.95, pur: 4, rev: 734.0, thumb: "/skoads/ethan-1.jpg" },
  { name: "EYE_GIANT_9X16_15s", spend: 34.59, pur: 3, rev: 718.91, thumb: "/skoads/eye-giant.jpg" },
  { name: "SKOBOX_9X16_05s", spend: 15.74, pur: 1, rev: 218.6, thumb: "/skoads/skobox.jpg" },
  { name: "AI Generated Video-7", spend: 42.53, pur: 1, rev: 174.07 },
  { name: "HighCostBau-v10033g…", spend: 98.07, pur: 1, rev: 37.79, thumb: "/skoads/highcostbau.jpg" },
];

const META_ADS = [
  { name: "ETHAN UGC summer 30", spend: 377.4, impr: 12472, clicks: 356, pur: 0, est: "~5", thumb: "/skoads/ethan-1.jpg" },
  { name: "PUREST", spend: 193.44, impr: 8676, clicks: 72, pur: 0, est: "~2–4", thumb: "/skoads/purest.jpg" },
  { name: "GIANTWOMAN + AI IMAGE", spend: 72.3, impr: 3192, clicks: 48, pur: 0, est: "~1–2", thumb: "/skoads/eye-giant.jpg" },
  { name: "TheBOX", spend: 34.44, impr: 588, clicks: 0, pur: 6, est: "—", thumb: "/skoads/skobox.jpg" },
];

const UGC = { spend: 3978.15, pur: 81 };

const CROSS_WINNERS = [
  { name: "ethan UGC_vKCU0o8b", pools: 3, spend: 1632.98, pur: 35, rev: 7556.44, ctr: "2.12%", thumb: "/skoads/ethan-1.jpg" },
  { name: "EYE_GIANT_9X16_15s", pools: 2, spend: 506.5, pur: 15, rev: 4006.51, ctr: "0.74%", thumb: "/skoads/eye-giant.jpg" },
  { name: "ethan ugc 2_lEe0p2xn", pools: 2, spend: 865.51, pur: 16, rev: 3768.54, ctr: "1.73%", thumb: "/skoads/ethan-2.jpg" },
  { name: "New video A (copy_655C…)", pools: 1, spend: 766.08, pur: 16, rev: 2635.46, ctr: "1.40%", thumb: "/skoads/e2-a.jpg" },
  { name: "New video B (copy_A0FA…)", pools: 1, spend: 410.19, pur: 11, rev: 2433.68, ctr: "1.18%", thumb: "/skoads/e2-b.jpg" },
  { name: "SKOBOX_9X16_05s", pools: 2, spend: 196.37, pur: 7, rev: 1199.7, ctr: "0.84%", thumb: "/skoads/skobox.jpg" },
  { name: "7663698610439192583 (Spark)", pools: 2, spend: 221.17, pur: 4, rev: 1460.27, ctr: "0.52%", thumb: "/skoads/spark.jpg" },
];

const CROSS_LOSERS = [
  { name: "AI Generated Video-4", pools: 2, spend: 229.67, pur: 1, rev: 119.7, ctr: "0.52%", thumb: "/skoads/ai-video-4.jpg" },
  { name: "Logo/bg version (copy_0B27…)", pools: 1, spend: 160.55, pur: 1, rev: 153.59, ctr: "1.02%" },
  { name: "HighCostBau-v10033g…", pools: 1, spend: 98.07, pur: 1, rev: 37.79, ctr: "1.98%", thumb: "/skoads/highcostbau.jpg" },
  { name: "V2_nY8125BV.mp4", pools: 2, spend: 84.74, pur: 0, rev: 0, ctr: "0.49%" },
  { name: "Spark 7663718762378182674", pools: 2, spend: 78.99, pur: 0, rev: 0, ctr: "0.59%" },
  { name: "Logo/bg version (copy_7A39…)", pools: 1, spend: 77.87, pur: 1, rev: 77.55, ctr: "0.96%" },
];

const UGC_PLACEMENTS = [
  { name: "ETHAN UGC ad (both videos)", spend: 1819.29, pur: 36, rev: 8798.45 },
  { name: "ETHAN UGC 2 (new content)", spend: 1479.66, pur: 30, rev: 5373.86 },
  { name: "inside summer30 2", spend: 561.16, pur: 11, rev: 1792.53 },
  { name: "inside LAST CHANCE", spend: 118.04, pur: 4, rev: 734.0 },
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

function CrossTable({ rows }: {
  rows: { name: string; pools: number; spend: number; pur: number; rev: number; ctr: string; thumb?: string }[];
}) {
  const TOT = { spend: 9028.61, pur: 154 };
  return (
    <div className={base.tableWrap}>
      <table className={`${base.table} ${s.num}`}>
        <thead>
          <tr>
            <th>Creative</th><th>Ads in</th><th>Spend</th><th>Purch</th><th>Revenue</th><th>ROAS</th><th>CTR</th>
            <th title="Share of ALL TikTok ad spend this week">% of spend</th>
            <th title="Share of ALL TikTok purchases this week. Higher than its spend share = earning more than it's being fed.">% of sales</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const shS = (r.spend / TOT.spend) * 100;
            const shP = (r.pur / TOT.pur) * 100;
            return (
              <tr key={r.name}>
                <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
                <td>{r.pools}</td>
                <td>{usd(r.spend)}</td>
                <td>{r.pur}</td>
                <td>{usd(r.rev)}</td>
                <td className={roasTier(r.rev / r.spend)}>
                  {x(r.rev / r.spend)}
                </td>
                <td>{r.ctr}</td>
                <td>{shS.toFixed(1)}%</td>
                <td className={shareTier(shP, shS)}>{shP.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AdTable({ rows, total, poolSpend, poolPur }: {
  rows: { name: string; spend: number; pur: number; rev: number; thumb?: string }[];
  total?: boolean;
  poolSpend?: number;
  poolPur?: number;
}) {
  const t = rows.reduce(
    (a, r) => ({ spend: a.spend + r.spend, pur: a.pur + r.pur, rev: a.rev + r.rev }),
    { spend: 0, pur: 0, rev: 0 },
  );
  const ps = poolSpend ?? t.spend;
  const pp = poolPur ?? t.pur;
  return (
    <div className={base.tableWrap}>
      <table className={`${base.table} ${s.num}`}>
        <thead>
          <tr>
            <th>Creative</th><th>Spend</th><th>Purch</th><th>Revenue</th><th>ROAS</th><th>CPA</th>
            <th title="This creative's share of its ad's total spend">% of spend</th>
            <th title="This creative's share of its ad's total purchases. Green = earning a bigger share of sales than of budget (underfed). Red = the reverse (overfed).">% of sales</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const shS = (r.spend / ps) * 100;
            const shP = pp ? (r.pur / pp) * 100 : 0;
            return (
              <tr key={r.name}>
                <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
                <td>{usd(r.spend)}</td>
                <td>{r.pur}</td>
                <td>{usd(r.rev)}</td>
                <td className={roasTier(r.rev / r.spend)}>
                  {x(r.rev / r.spend)}
                </td>
                <td>{r.pur ? usd(r.spend / r.pur) : "—"}</td>
                <td>{shS.toFixed(1)}%</td>
                <td className={shareTier(shP, shS)}>
                  {shP.toFixed(1)}%
                </td>
              </tr>
            );
          })}
          {total ? (
            <tr className={s.rowStrong}>
              <td>Total</td>
              <td>{usd(t.spend)}</td>
              <td>{t.pur}</td>
              <td>{usd(t.rev)}</td>
              <td>{x(t.rev / t.spend)}</td>
              <td>{usd(t.spend / t.pur)}</td>
              <td>{((t.spend / ps) * 100).toFixed(0)}%</td>
              <td>{pp ? ((t.pur / pp) * 100).toFixed(0) : 0}%</td>
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
        <span className={base.navNote}>Week of Aug 9–17, 2026</span>
      </nav>

      <main className={`${base.main} ${s.big}`}>
        {/* ---- topline ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>Topline</h2>
          </div>

          <div className={s.summary}>
            <div className={s.stat} data-tip="Total paid ad spend, TikTok + Meta, Aug 9–16.">
              <span className={s.statNum}>$9,706</span>
              <span className={s.statLabel}>Spend</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok $9,029 · Meta $678 (Aug 1–17)</span>
            </div>
            <div className={s.stat} data-tip="Revenue the ad platforms attribute to ads (TikTok pixel, 7-day click / 1-day view). Our internal order table reads lower because in-app browsers lose tracking.">
              <span className={s.statNum}>$33,549</span>
              <span className={s.statLabel}>Ad revenue</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok-reported · Meta 0 tracked</span>
            </div>
            <div className={s.stat} data-tip="Purchases the platforms attribute to ads this week.">
              <span className={s.statNum}>154</span>
              <span className={s.statLabel}>Purchases</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok only · $218 avg + 6 tracked on Meta</span>
            </div>
            <div className={s.stat} data-tip="Return on ad spend: attributed revenue ÷ spend. 3.96× means $3.96 back per $1 spent.">
              <span className={s.statNum}>3.72×</span>
              <span className={s.statLabel}>ROAS</span>
              <span className={`${s.statDelta} ${s.up}`}>winners at 4.8–5.2×</span>
            </div>
            <div className={s.stat} data-tip="Spend ÷ attributed purchases (CPA). Lower is better; breakeven sits far above this at our margins.">
              <span className={s.statNum}>$58.63</span>
              <span className={s.statLabel}>Cost / purchase</span>
              <span className={`${s.statDelta} ${s.up}`}>winners $34–51</span>
            </div>
          </div>

          <p className={base.body}>
            <strong>summer30 2</strong> is fatiguing (3.11×) and still carries 55% of
            the budget. ETHAN UGC (4.84×) and LAST CHANCE (5.21×) convert far better,
            and <strong>ETHAN UGC 2 recovered to 3.63×</strong> once its new videos got
            spend — two of them are winners. Next week consolidates onto the winners,
            the proven creatives, and a dedicated EYE_GIANT test.
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
          <AdTable rows={TIKTOK_ADS} total poolSpend={TT.spend} poolPur={TT.pur} />
          <p className={base.body}>
            <strong>Ethan's content is the account.</strong> The original two videos run
            4.84× at 2.05% CTR — triple the account average — and his ad now takes the
            largest healthy share of spend. LAST CHANCE has the best CPA ($34.05).
            summer30 2 still produces but costs the most per sale. ETHAN UGC 2 is new
            content: two of its six videos are winners; the four with the edited
            background and floating logo are not.
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

          <h3 className={s.subheadBig}>Winners — every ad creative, across all ads</h3>
          <CrossTable rows={CROSS_WINNERS} />
          <p className={s.footnote}>
            How to read the last two columns: % of spend is the slice of the whole
            week's TikTok budget this creative got; % of sales is the slice of the
            week's purchases it produced. Colors run hot to cold:{" "}
            <span className={s.tWin}>bold green</span> = clear winner,{" "}
            <span className={s.tOk}>yellow-green</span> = runner-up,{" "}
            <span className={s.tWarn}>orange</span> = weak,{" "}
            <span className={s.tBad}>bright red</span> = spending without selling.
          </p>

          <h3 className={s.subheadBig}>Losers — spending without selling</h3>
          <CrossTable rows={CROSS_LOSERS} />
          <p className={s.footnote}>
            $730 of the week went to these six. Note HighCostBau: 1.98% CTR — the
            best click rate in either table — and 0.39× ROAS. Clicks are not sales;
            it's the intent pattern in reverse.
          </p>

          <h3 className={s.subheadBig}>summer30 2 — ~90 creatives in rotation</h3>
          <Bar
            win={1815} mid={1436} dead={1730}
            keyWin="6 proven creatives · $1,815"
            keyMid="~16 marginal · $1,436"
            keyDead="74 creatives, zero purchases · $1,730 (35%)"
          />
          <AdTable rows={SUMMER30_TOP} poolSpend={4980.52} poolPur={66} />
          <p className={s.footnote}>
            Read the last two columns together. EYE_GIANT: 9.5% of spend, 18.2% of
            purchases — underfed, and now proven at real spend ($472 → 6.97×). AI
            Generated Video-4: 4.4% of spend, 1.5% of purchases (0.54×, underwater) —
            overfed. The gap between the two columns is the reallocation signal.
          </p>

          <h3 className={s.subheadBig}>ETHAN UGC — 2 creatives, zero waste</h3>
          <AdTable rows={ETHAN_CREATIVES} poolSpend={1819.29} poolPur={36} />
          <p className={s.footnote}>This is what a healthy ad looks like. Every dollar on something that converts.</p>

          <div className={s.summary}>
            <div className={s.stat} data-tip="Distinct Ethan videos in paid rotation this week: the 2 proven originals plus 6 new-content tests.">
              <span className={s.statNum}>8</span>
              <span className={s.statLabel}>UGC videos</span>
              <span className={`${s.statDelta} ${s.flat}`}>2 proven + 6 new</span>
            </div>
            <div className={s.stat} data-tip="Paid impressions across every TikTok placement running Ethan content, Aug 9–17.">
              <span className={s.statNum}>~312K</span>
              <span className={s.statLabel}>Paid impressions</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok · + 12K Meta</span>
            </div>
            <div className={s.stat} data-tip="Revenue TikTok attributes to ads running Ethan content — 50% of all tracked ad revenue this week.">
              <span className={s.statNum}>$16,699</span>
              <span className={s.statLabel}>UGC revenue</span>
              <span className={`${s.statDelta} ${s.up}`}>50% of ad revenue · 44% of spend</span>
            </div>
            <div className={s.stat} data-tip="UGC-attributed revenue ÷ UGC spend.">
              <span className={s.statNum}>4.20×</span>
              <span className={s.statLabel}>UGC ROAS</span>
              <span className={`${s.statDelta} ${s.up}`}>vs 3.72× account</span>
            </div>
          </div>

          <h3 className={s.subheadBig}>LAST CHANCE SUMMER 30 — same dilution pattern</h3>
          <Bar
            win={234} mid={172} dead={342}
            keyWin="5 converting creatives · $234"
            keyMid="marginal · $172"
            keyDead="74 creatives, zero purchases · $342 (46%)"
          />
          <AdTable rows={LASTCHANCE_TOP} poolSpend={749.14} poolPur={22} />
          <p className={s.footnote}>
            Small spends — signals, not proven winners. But the same three names
            convert in every pool: <strong>Ethan, SKOBOX, EYE_GIANT</strong>.
          </p>

          <h3 className={s.subheadBig}>ETHAN UGC 2 — new content: the videos work, the treatment didn't</h3>
          <AdTable rows={E2_CREATIVES} poolSpend={1479.66} poolPur={30} />
          <p className={s.footnote}>
            Two new videos carry the ad — 5.93× and 3.44×. The four versions with the
            edited-in background and floating logo did ~1.0× on $303. Weight budget
            hard toward the native two; leave the logo/background versions running
            at low spend to see if they mature — at ~1.0× they're near break-even,
            not proven dead.
          </p>
        </section>

        {/* ---- key patterns ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>Three patterns that set next week</h2>
          </div>

          <div className={s.insightGrid}>
            <div className={s.insight}>
              <span className={s.insightNum}>6.97×</span>
              <span className={s.insightTag}>Low CTR, high intent</span>
              <p className={s.insightBody}>
                EYE_GIANT earns ~1% CTR, so the algorithm underfeeds it — yet at real
                spend it proved out: <strong>$472 → 12 purchases at 6.97×</strong>,
                taking 18.2% of summer30 2's purchases on 9.5% of its spend. Same
                pattern both platforms: low-curiosity, high-intent creatives. Fix:
                dedicated ad group — the bandit can't starve what it doesn't control.
              </p>
            </div>
            <div className={s.insight}>
              <span className={s.insightNum}>−2pts</span>
              <span className={s.insightTag}>Dilution tax</span>
              <p className={s.insightBody}>
                The same Ethan video runs 6.68× in a small rotation, 5.23× in its
                own ad, 3.19× buried with ~90 others. Identical footage,
                <strong> ~2–3 points of ROAS lost to crowding</strong>. 35–46% of
                pool spend went to creatives that have never sold.
              </p>
            </div>
            <div className={s.insight}>
              <span className={s.insightNum}>5.93×</span>
              <span className={s.insightTag}>Treatment matters</span>
              <p className={s.insightBody}>
                Ethan's new videos hit <strong>5.93× and 3.44×</strong> — the same
                content with an edited-in background and floating logo ran ~1.0×.
                Native-looking footage sells; the produced look reads as an ad.
                Downweight the treatment, not the creator.
              </p>
            </div>
          </div>
        </section>

        {/* ---- meta ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>05</span>
            <h2 className={base.sectionTitle}>Meta — first week live</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Ad</th><th>Spend</th><th>Link clicks</th><th>CTR</th><th>Purchases (tracked)†</th><th>Est. purchases*</th></tr>
              </thead>
              <tbody>
                {META_ADS.map((r) => (
                  <tr key={r.name}>
                    <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
                    <td>{usd(r.spend)}</td>
                    <td>{r.clicks}</td>
                    <td>{r.impr ? `${((r.clicks / r.impr) * 100).toFixed(1)}%` : "—"}</td>
                    <td className={r.pur ? s.good : s.dim}>{r.pur || "—"}</td>
                    <td className={r.est !== "—" ? s.good : s.dim}>{r.est}</td>
                  </tr>
                ))}
                <tr className={s.rowStrong}>
                  <td>Total</td><td>{usd(677.58)}</td><td>476</td><td>1.9%</td><td className={s.good}>6 · $5.74 ea</td><td>~8–11*</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={s.footnote}>
            †Tracked = Meta-attributed website purchases. All six TheBOX purchases:
            men 25–34, $5.74 each, zero link clicks — it converts straight from the
            ad. *Modeled: link clicks × site conversion rate; PUREST and GIANTWOMAN
            upper bounds extrapolate their earlier cost-per-checkout.
          </p>
          <p className={base.body}>
            Meta reporting is still fuzzy — fresh account warming (the old one was
            banned), purchase capture still leaky — but $678 in, <strong>the first
            tracked conversions are flowing and the demographic splits already
            work: every TheBOX purchase is a man 25–34.</strong> It sharpens as we
            tighten site tracking and pixel cooperation, and CAPI lands once the
            account is old enough for Meta Business Suite access. TikTok carries
            the volume meanwhile.
          </p>

          <div className={base.flag}>
            <span className={base.flagLabel}>Payment friction is throttling Meta</span>
            <p className={base.cardBody}>
              Both campaigns currently show <strong>Payment error · low budget
              used / low results</strong>. The company card (Bank of America) caps
              unsupervised spend, so charges keep failing until they're pushed
              through manually — and every stall stops delivery and resets pacing.
              Until the replacement card is onboarded, expect Meta results to read
              worse than the creative deserves. This is a billing problem, not an
              ads problem.
            </p>
          </div>

          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.num}`}>
              <thead>
                <tr><th>Early signal</th><th>Reading</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>First tracked purchases</td>
                  <td>TheBOX: <span className={s.good}>6 on $34.44 — $5.74 CPA</span>, 100% men 25–34</td>
                </tr>
                <tr>
                  <td>Click quality — Ethan UGC</td>
                  <td><span className={s.good}>2.85%</span> link CTR holding at $377 spend</td>
                </tr>
                <tr>
                  <td>Buying without clicking</td>
                  <td>TheBOX: zero link clicks, six purchases — converts in-feed</td>
                </tr>
                <tr>
                  <td>Metric while stock is low</td>
                  <td>Cost per tracked purchase — ROAS returns at restock</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={s.summary}>
            <div className={s.stat} data-tip="The Meta pixel is installed on the live site and sending events — the foundation for all Meta measurement.">
              <span className={s.statNum}>Live</span>
              <span className={s.statLabel}>Pixel in production</span>
              <span className={`${s.statDelta} ${s.up}`}>installed midweek — full funnel firing</span>
            </div>
            <div className={s.stat} data-tip="Page visits the Meta pixel has recorded since install.">
              <span className={s.statNum}>2.4K</span>
              <span className={s.statLabel}>PageViews</span>
              <span className={`${s.statDelta} ${s.flat}`}>468 content views</span>
            </div>
            <div className={s.stat} data-tip="Add-to-cart events the pixel recorded; 40 continued into checkout.">
              <span className={s.statNum}>109</span>
              <span className={s.statLabel}>Adds to cart</span>
              <span className={`${s.statDelta} ${s.flat}`}>40 checkouts</span>
            </div>
            <div className={s.stat} data-tip="Purchases the pixel recorded. Undercounts heavily — a bug stops the event on ~90% of orders (fix in progress). Not ad-attributed.">
              <span className={s.statNum}>11*</span>
              <span className={s.statLabel}>Purchases — pixel pickup</span>
              <span className={`${s.statDelta} ${s.flat}`}>leaky capture · attribution pending CAPI</span>
            </div>
          </div>

          <p className={s.footnote}>
            *Pixel pickup, not a volume reading — the purchase event fires on ~10%
            of orders (fix ticketed); the site did ~500 orders last week per the
            order table.
          </p>
        </section>

        {/* ---- ugc ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>06</span>
            <h2 className={base.sectionTitle}>UGC performance</h2>
          </div>

          <div className={s.summary}>
            <div className={s.stat} data-tip="Distinct Ethan videos in paid rotation this week: the 2 proven originals plus 6 new-content tests.">
              <span className={s.statNum}>8</span>
              <span className={s.statLabel}>Videos (Ethan)</span>
              <span className={`${s.statDelta} ${s.flat}`}>2 proven + 6 new</span>
            </div>
            <div className={s.stat} data-tip="Paid impressions across every TikTok placement running Ethan content, Aug 9–17.">
              <span className={s.statNum}>~312K</span>
              <span className={s.statLabel}>Paid impressions</span>
              <span className={`${s.statDelta} ${s.flat}`}>TikTok · + 12K Meta</span>
            </div>
            <div className={s.stat} data-tip="Revenue TikTok attributes to ads running Ethan content — 50% of all tracked ad revenue this week.">
              <span className={s.statNum}>$16,699</span>
              <span className={s.statLabel}>UGC revenue</span>
              <span className={`${s.statDelta} ${s.up}`}>50% of ad revenue</span>
            </div>
            <div className={s.stat} data-tip="UGC-attributed revenue ÷ UGC spend.">
              <span className={s.statNum}>4.20×</span>
              <span className={s.statLabel}>UGC ROAS</span>
              <span className={`${s.statDelta} ${s.flat}`}>on 44% of spend</span>
            </div>
          </div>

          <AdTable rows={UGC_PLACEMENTS} total poolSpend={TT.spend} poolPur={TT.pur} />
          <p className={base.body}>
            One creator's content produced <strong>$16,698.84 across 81
            purchases</strong> — 50% of the week's tracked ad revenue on 44% of the
            spend, and his two new videos proved the format repeats (5.93×, 3.44×).
            The ask stays the same: more raw, native-looking footage. No edited
            backgrounds, no floating logos — that treatment ran ~1.0×.
          </p>
        </section>

        {/* ---- next week ---- */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>07</span>
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
                <tr><td>ETHAN UGC 2 — weight to the 2 native videos; logo/bg versions throttled low, not killed</td><td>$1,000–1,200</td></tr>
                <tr><td>EYE_GIANT — new dedicated ad group (force-feed the intent winner)</td><td>$350–500</td></tr>
                <tr><td>Meta — tracking-validation week</td><td>$100–150</td></tr>
                <tr className={s.rowStrong}>
                  <td>Goal spend</td><td>$4,500–5,500</td>
                </tr>
                <tr className={s.rowStrong}>
                  <td>Goal revenue (platform-reported)</td><td>$17,000–21,000‡</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={s.footnote}>
            ‡Assumes stock covers the week. Decision rule: if units left ÷ daily
            unit velocity is fewer days than the restock date, cut to $2–2.5K spend
            and an $8–12K goal — at that point ads are accelerating a sell-out, not
            adding sales.
          </p>

          <ul className={base.list}>
            <li>
              <strong>Commission more UGC.</strong> Two videos drove 46% of ad
              revenue on 39% of spend — the highest-leverage move available. Get
              2–3 new raw videos this week: Ethan again (proven face), plus one
              new creator for a second look. Raw, native-looking footage only — no
              edited backgrounds, no floating logos (that treatment ran ~1.0×).
            </li>
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
