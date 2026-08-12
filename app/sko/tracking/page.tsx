import type { Metadata } from "next";
import Link from "next/link";
import base from "../page.module.css";
import s from "./tracking.module.css";
import { getAttribution, usd, num } from "../../SKOtracking/attribution";

/* Numbers are pulled live; the diagram encodes structure, which does not change
   week to week. Netlify does not run ISR here, so no caching. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SKO Compounds — Measurement map — Jack Morello",
  description:
    "How creators, SKO Lives and paid ads reach one checkout, and why five systems report five different numbers.",
  robots: { index: false, follow: false },
};

const WINDOWS = [
  { key: "week", label: "1 week", range: "Aug 6–12", start: "2026-08-06", end: "2026-08-12" },
  { key: "fortnight", label: "2 weeks", range: "Jul 30–Aug 12", start: "2026-07-30", end: "2026-08-12" },
  { key: "month", label: "1 month", range: "Jul 13–Aug 12", start: "2026-07-13", end: "2026-08-12" },
];

const ROWS = [
  { key: "affiliate", label: "Affiliate + Lives" },
  { key: "organic", label: "Organic" },
  { key: "tiktok", label: "TikTok" },
  { key: "meta", label: "Meta" },
];

export default async function SkoTracking() {
  const results = await Promise.all(
    WINDOWS.map((w) => getAttribution(w.start, w.end).then((r) => ({ ...w, ...r }))),
  );

  const cell = (i: number, source: string) => {
    const d = results[i].data;
    if (!d) return { revenue: null as number | null, orders: null as number | null, share: null as number | null };
    const row = d.by_source.find((r) => r.source === source);
    return {
      revenue: row?.revenue ?? 0,
      orders: row?.orders ?? 0,
      share: d.totals.revenue ? ((row?.revenue ?? 0) / d.totals.revenue) * 100 : 0,
    };
  };

  return (
    <div className={base.page}>
      <nav className={base.nav}>
        <Link href="/sko" className={base.navBack}>
          ← SKO
        </Link>
        <span className={base.navTitle}>Measurement map</span>
        <span className={base.navNote}>read live · Aug 12, 2026</span>
      </nav>

      <main className={base.main}>
        <header className={base.hero}>
          <h1 className={base.heroTitle}>Five systems are counting the same orders</h1>
          <p className={base.heroLede}>
            Creators, SKO Lives and paid ads are three separate businesses that all end at the
            same checkout. Five systems then measure what happened, each with a different
            definition of proof — and two of the three demand sources collapse into a single
            value in the one column that reconciles.
          </p>
          <div className={base.byline}>
            <span>
              <strong>64%</strong> of revenue from creators
            </span>
            <span>
              <strong>55:1</strong> creators vs paid media
            </span>
            <span>
              <Link href="/SKOtracking">Live scorecard</Link>
            </span>
          </div>
        </header>

        {/* 01 — the map */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>Where a sale comes from, and who counts it</h2>
          </div>

          <div className={s.board}>
            <svg
              className={s.diagram}
              viewBox="0 0 1000 660"
              role="img"
              aria-label="Demand comes from creators, SKO Lives, TikTok ads, other paid platforms and organic traffic. All orders land in one table where attribution_source takes a single value, and both creators and SKO Lives write the value affiliate, so they cannot be told apart. Five systems then read those orders and report different totals."
            >
              <defs>
                <marker id="mk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
                <marker id="mkC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--creator)" />
                </marker>
              </defs>

              {/* demand */}
              <text x="0" y="24" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.2" fill="var(--ink3)">WHAT CREATES THE SALE</text>

              <rect x="0" y="38" width="212" height="60" fill="var(--creatorSoft)" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="14" y="60" fontSize="13" fontWeight="650" fill="currentColor">Creators · affiliate</text>
              <text x="14" y="77" fontSize="11" fill="var(--ink2)">24 creators · ?ref= links + codes</text>
              <text x="14" y="91" fontSize="11" fill="var(--ink2)">10–40% commission, varies</text>

              <rect x="0" y="110" width="212" height="60" fill="var(--creatorSoft)" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="14" y="132" fontSize="13" fontWeight="650" fill="currentColor">SKO Lives · TikTok Live</text>
              <text x="14" y="149" fontSize="11" fill="var(--ink2)">separate program · flat 10%</text>
              <text x="14" y="163" fontSize="11" fill="var(--ink2)">own codes · freebie offers</text>

              <rect x="0" y="182" width="212" height="48" fill="none" stroke="var(--rule)" />
              <text x="14" y="204" fontSize="13" fontWeight="650" fill="currentColor">TikTok Ads</text>
              <text x="14" y="220" fontSize="11" fill="var(--ink2)">paid media · 2 campaigns</text>

              <rect x="0" y="242" width="212" height="48" fill="none" stroke="var(--ruleSoft)" />
              <text x="14" y="264" fontSize="13" fill="var(--dead)">Meta · OpenAI · Taboola</text>
              <text x="14" y="280" fontSize="11" fill="var(--dead)">barely spending</text>

              <rect x="0" y="302" width="212" height="48" fill="none" stroke="var(--rule)" />
              <text x="14" y="324" fontSize="13" fontWeight="650" fill="currentColor">Organic · direct</text>
              <text x="14" y="340" fontSize="11" fill="var(--ink2)">search, social, word of mouth</text>

              <path d="M 212 68 C 246 68 246 168 280 168" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />
              <path d="M 212 140 C 246 140 246 178 280 178" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />
              <path d="M 212 206 C 246 206 246 192 280 192" fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />
              <path d="M 212 266 C 246 266 246 204 280 204" fill="none" stroke="var(--dead)" strokeWidth="1.2" markerEnd="url(#mk)" />
              <path d="M 212 326 C 246 326 246 216 280 216" fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />

              {/* the order */}
              <text x="280" y="24" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.2" fill="var(--ink3)">ONE ROW PER ORDER</text>

              <rect x="280" y="38" width="230" height="312" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="296" y="62" fontSize="13" fontWeight="650" fill="currentColor">skocompounds.com</text>
              <text x="296" y="79" fontSize="11" fill="var(--ink2)">checkout → orders table</text>
              <line x1="296" y1="92" x2="494" y2="92" stroke="var(--rule)" />
              <text x="296" y="112" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.1" fill="var(--ink3)">attribution_source</text>
              <text x="296" y="127" fontSize="11" fill="var(--ink2)">exactly one value, set by the ladder</text>

              <rect x="296" y="138" width="198" height="32" fill="var(--creatorSoft)" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="308" y="159" fontSize="12" fontWeight="700" fill="var(--creator)" fontFamily="ui-monospace, Menlo, monospace">affiliate</text>
              <text x="386" y="159" fontSize="10.5" fill="var(--ink2)">creators AND Lives</text>

              <rect x="296" y="178" width="198" height="26" fill="none" stroke="var(--rule)" />
              <text x="308" y="196" fontSize="12" fill="currentColor" fontFamily="ui-monospace, Menlo, monospace">tiktok</text>
              <rect x="296" y="212" width="198" height="26" fill="none" stroke="var(--rule)" />
              <text x="308" y="230" fontSize="12" fill="currentColor" fontFamily="ui-monospace, Menlo, monospace">meta</text>
              <rect x="296" y="246" width="198" height="26" fill="none" stroke="var(--ruleSoft)" />
              <text x="308" y="264" fontSize="12" fill="var(--dead)" fontFamily="ui-monospace, Menlo, monospace">openai</text>
              <rect x="296" y="280" width="198" height="26" fill="none" stroke="var(--rule)" />
              <text x="308" y="298" fontSize="12" fill="currentColor" fontFamily="ui-monospace, Menlo, monospace">organic</text>

              <text x="296" y="326" fontSize="10.5" fill="var(--creator)">Two businesses, one label — Lives and</text>
              <text x="296" y="340" fontSize="10.5" fill="var(--creator)">affiliate are indistinguishable here.</text>

              {/* readers */}
              <text x="556" y="24" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.2" fill="var(--ink3)">WHO READS IT · AUG 1–12</text>

              <path d="M 510 116 C 534 116 534 66 556 66" fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />
              <path d="M 510 146 C 534 146 534 140 556 140" fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />
              <path d="M 510 176 C 534 176 534 214 556 214" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />
              <path d="M 510 206 C 534 206 534 288 556 288" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />
              <path d="M 510 236 C 534 236 534 362 556 362" fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />

              <rect x="556" y="42" width="444" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="572" y="63" fontSize="12.5" fontWeight="650" fill="currentColor">Order table · the ledger</text>
              <text x="572" y="79" fontSize="10.5" fill="var(--ink2)">one owner per order · deterministic floor, not a ceiling</text>
              <text x="984" y="65" fontSize="15" fontWeight="700" textAnchor="end" fill="currentColor">$236,546</text>
              <text x="984" y="81" fontSize="10.5" textAnchor="end" fill="var(--ink2)">1,310 orders</text>

              <rect x="556" y="116" width="444" height="48" fill="none" stroke="var(--warn)" strokeWidth="1.5" />
              <text x="572" y="137" fontSize="12.5" fontWeight="650" fill="currentColor">RedTrack</text>
              <text x="572" y="153" fontSize="10.5" fill="var(--warn)">tags every visitor by design · not a paid signal</text>
              <text x="984" y="139" fontSize="15" fontWeight="700" textAnchor="end" fill="currentColor">$169,589</text>
              <text x="984" y="155" fontSize="10.5" textAnchor="end" fill="var(--ink2)">ROAS shown as 43.53×</text>

              <rect x="556" y="190" width="444" height="48" fill="none" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="572" y="211" fontSize="12.5" fontWeight="650" fill="currentColor">Affiliate ledger · pays creators</text>
              <text x="572" y="227" fontSize="10.5" fill="var(--ink2)">payment-verified only · 24 creators · per-creator rates</text>
              <text x="984" y="213" fontSize="15" fontWeight="700" textAnchor="end" fill="var(--creator)">$87,966</text>
              <text x="984" y="229" fontSize="10.5" textAnchor="end" fill="var(--ink2)">377 orders · $23,606 owed</text>

              <rect x="556" y="264" width="444" height="48" fill="none" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="572" y="285" fontSize="12.5" fontWeight="650" fill="currentColor">SKO Lives ledger · separate program</text>
              <text x="572" y="301" fontSize="10.5" fill="var(--ink2)">flat 10% · AOV $269.30 · 31.5% new customers</text>
              <text x="984" y="287" fontSize="15" fontWeight="700" textAnchor="end" fill="var(--creator)">$28,277</text>
              <text x="984" y="303" fontSize="10.5" textAnchor="end" fill="var(--ink2)">105 orders</text>

              <rect x="556" y="338" width="444" height="48" fill="none" stroke="var(--warn)" strokeWidth="1.5" />
              <text x="572" y="359" fontSize="12.5" fontWeight="650" fill="currentColor">TikTok Ads Manager</text>
              <text x="572" y="375" fontSize="10.5" fill="var(--warn)">never reads an order · Cost × TikTok’s own ROAS</text>
              <text x="984" y="361" fontSize="15" fontWeight="700" textAnchor="end" fill="currentColor">$8,027</text>
              <text x="984" y="377" fontSize="10.5" textAnchor="end" fill="var(--ink2)">estimated · Aug 6–12 only</text>

              {/* collision */}
              <line x1="0" y1="418" x2="1000" y2="418" stroke="var(--rule)" />
              <text x="0" y="444" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.2" fill="var(--ink3)">THE COLLISION</text>

              <rect x="0" y="458" width="300" height="80" fill="var(--creatorSoft)" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="14" y="480" fontSize="12.5" fontWeight="650" fill="currentColor">Creators — affiliate links</text>
              <text x="14" y="498" fontSize="11" fill="var(--ink2)">Ethan Levi · 158 orders · $35,675</text>
              <text x="14" y="513" fontSize="11" fill="var(--ink2)">Andersen Pate · 82 · $21,358</text>
              <text x="14" y="528" fontSize="11" fill="var(--ink2)">both run Lives on their own accounts</text>

              <rect x="0" y="552" width="300" height="66" fill="var(--creatorSoft)" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="14" y="574" fontSize="12.5" fontWeight="650" fill="currentColor">SKO Lives — company program</text>
              <text x="14" y="592" fontSize="11" fill="var(--ink2)">company channel · flat 10% · own codes</text>
              <text x="14" y="607" fontSize="11" fill="var(--ink2)">buy-2-get-1 freebies depress AOV</text>

              <path d="M 300 498 C 340 498 340 534 380 534" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />
              <path d="M 300 584 C 340 584 340 546 380 546" fill="none" stroke="var(--creator)" strokeWidth="1.6" markerEnd="url(#mkC)" />

              <rect x="380" y="510" width="212" height="60" fill="none" stroke="var(--creator)" strokeWidth="1.5" />
              <text x="396" y="534" fontSize="12.5" fontWeight="700" fill="var(--creator)" fontFamily="ui-monospace, Menlo, monospace">affiliate</text>
              <text x="396" y="552" fontSize="11" fill="var(--ink2)">one value · 661 orders</text>
              <text x="396" y="566" fontSize="11" fill="var(--ink2)">$140,167 Aug 1–12</text>

              <line x1="592" y1="540" x2="640" y2="540" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#mk)" />

              <rect x="640" y="498" width="360" height="84" fill="none" stroke="var(--warn)" strokeWidth="1.5" />
              <text x="656" y="521" fontSize="12.5" fontWeight="650" fill="currentColor">You cannot split it here</text>
              <text x="656" y="540" fontSize="11" fill="var(--ink2)">The reconciling column cannot tell a Live sale from</text>
              <text x="656" y="556" fontSize="11" fill="var(--ink2)">an affiliate-link sale. Only the two separate ledgers</text>
              <text x="656" y="572" fontSize="11" fill="var(--ink2)">can, and they use different windows and rules.</text>
            </svg>
          </div>
          <p className={s.caption}>
            Creators and SKO Lives are genuinely separate programs — different people, different
            commission structures, different dashboards. They become one number the moment an
            order is written, because <span className={s.mono}>attribution_source</span> holds a
            single value and both write <span className={s.mono}>affiliate</span>.
          </p>
        </section>

        {/* 02 — windows */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>02</span>
            <h2 className={base.sectionTitle}>Order table, three windows</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.windows}`}>
              <thead>
                <tr>
                  <th>Source</th>
                  {WINDOWS.map((w) => (
                    <th className="num" key={w.key}>
                      {w.label} · {w.range}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.key}>
                    <td className={base.strong}>{r.label}</td>
                    {WINDOWS.map((w, i) => {
                      const c = cell(i, r.key);
                      return (
                        <td className="num" key={w.key}>
                          {usd(c.revenue)}
                          <small>
                            {num(c.orders)} orders
                            {c.share !== null ? ` · ${c.share.toFixed(1)}%` : ""}
                          </small>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="total">
                  <td>Total</td>
                  {results.map((r) => (
                    <td className="num" key={r.key}>
                      {usd(r.data?.totals.revenue ?? null)}
                      <small>{num(r.data?.totals.orders ?? null)} orders</small>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className={s.caption}>
            Pulled live from the orders table. Creators outsell paid media roughly 55 to 1, and
            the ratio holds at every window.
          </p>
        </section>

        {/* 03 — floor / ceiling */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>03</span>
            <h2 className={base.sectionTitle}>Floor and ceiling · 30 days</h2>
          </div>
          <div className={base.tableWrap}>
            <table className={`${base.table} ${s.windows}`}>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th className="num">Floor</th>
                  <th className="num">Ceiling</th>
                  <th>Floor is</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={base.strong}>Creators + Lives</td>
                  <td className="num">$451,549<small>1,921 orders</small></td>
                  <td className="num">$474,463<small>2,272 orders</small></td>
                  <td className={base.tableNote}>a code was typed at checkout — indisputable</td>
                </tr>
                <tr>
                  <td className={base.strong}>Organic</td>
                  <td className="num">$261,219<small>1,606 orders</small></td>
                  <td className="num">$261,219<small>same</small></td>
                  <td className={base.tableNote}>residual — nothing claims it</td>
                </tr>
                <tr>
                  <td className={base.strong}>TikTok</td>
                  <td className="num">$10,000<small>62 orders</small></td>
                  <td className="num">pending<small>needs 30d platform report</small></td>
                  <td className={base.tableNote}>ttclid survived to checkout and won the ladder</td>
                </tr>
                <tr>
                  <td className={base.strong}>Meta</td>
                  <td className="num">$1,606<small>11 orders</small></td>
                  <td className="num">$1,606<small>same</small></td>
                  <td className={base.tableNote}>fbclid present · $0 spent, so organic social</td>
                </tr>
                <tr>
                  <td className={base.strong}>OpenAI</td>
                  <td className="num">$0<small>0 orders</small></td>
                  <td className="num">$0<small>launched Aug 11</small></td>
                  <td className={base.tableNote}>click capture not yet published</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={s.caption}>
            Floor is deterministic: a code entered, or a click ID that survived. Ceiling is the
            widest defensible claim. Where they match, the number is settled. TikTok&apos;s
            ceiling is open until we have 30 days of platform-reported conversions.
          </p>
        </section>

        {/* 04 — findings */}
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>What the numbers say</h2>
          </div>
          <div className={s.findingsGrid}>
            <div className={`${s.finding} ${s.good}`}>
              <h3>Creators are 64% of a $746k month</h3>
              <p>
                $474,463 over 30 days at a $208.83 average order, against $8,567 from TikTok
                ads. Creators outsell paid media roughly 55 to 1.
              </p>
            </div>
            <div className={`${s.finding} ${s.good}`}>
              <h3>Lives sell a different, better basket</h3>
              <p>
                $269.30 average order versus $208.83 for affiliate links, and 31.5% of Live
                buyers are new customers. Different economics, currently invisible in the
                column everyone reports from.
              </p>
            </div>
            <div className={s.finding}>
              <h3>Creator Lives run outside the company program</h3>
              <p>
                Ethan Levi and Andersen Pate both go live from their own accounts, separate from
                SKO Lives. Their sales land under affiliate; the company Lives ledger only sees
                the company channel. Two Live motions, one label.
              </p>
            </div>
            <div className={s.finding}>
              <h3>RedTrack is missing $66,957</h3>
              <p>
                It reports $169,589 for Aug 1–12 against the order table&apos;s $236,546, and its
                top traffic channel is literally &ldquo;Unattributed&rdquo; — $10,690 of $11,420
                yesterday.
              </p>
            </div>
            <div className={s.finding}>
              <h3>TikTok converts at 2.1%</h3>
              <p>
                2,947 landings carried a <span className={s.mono}>ttclid</span> over 30 days; 62
                became orders. A normal store rate — which suggests the attributed figure is
                close to real, not badly undercounting.
              </p>
            </div>
            <div className={s.finding}>
              <h3>Freebies distort the Lives basket</h3>
              <p>
                Buy-2-get-1 offers running on Live inflate units and depress realised margin
                without showing up anywhere in attribution. Lives revenue is real, but unit
                economics need the COGS view.
              </p>
            </div>
          </div>
        </section>

        <footer className={base.footer}>
          <p>
            Order-table figures pulled live. Ledger figures read from the SKO admin on Aug 12,
            2026. TikTok figure is Aug 6–12 only.
          </p>
          <p>
            <Link href="/SKOtracking">Live scorecard</Link> · <Link href="/sko">SKO plan</Link> ·{" "}
            <Link href="/sko/runbook">Runbook</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
