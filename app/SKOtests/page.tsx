import type { Metadata } from "next";
import base from "../sko/page.module.css";
import s from "../SKOads_august/page.module.css";
import data from "./data.json";

export const metadata: Metadata = {
  title: "SKO Creative Testing Pipeline",
  robots: { index: false, follow: false },
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 1000 ? 0 : 2 });
const x = (n: number) => `${n.toFixed(2)}×`;

const { contributionRate: CR, cpaTarget, cpaBreakeven } = data.assumptions;

type Row = { name: string; type: string; entered?: string; spend: number; pur: number; rev: number; thumb?: string };

/* Verdict rules — mechanical, no judgment calls:
   GRADUATE: >=3 purchases AND ROAS >= 5 AND spend >= $100
   KILL:     spend >= $70 with 0 purchases, or spend >= $100 with margin ROAS < 0.8
   PROMOTE?: hit graduate bars on purchases/ROAS but spend still < $100
   TESTING:  everything else, until day 14 */
function verdict(r: Row) {
  const roas = r.spend ? r.rev / r.spend : 0;
  const mroas = roas * CR;
  if (r.pur >= 3 && roas >= 5 && r.spend >= 100) return { v: "GRADUATE", c: s.tWin };
  if (r.pur >= 3 && roas >= 5) return { v: "PROMOTE?", c: s.tOk };
  if (r.spend >= 70 && r.pur === 0) return { v: "KILL", c: s.tBad };
  if (r.spend >= 100 && mroas < 0.8) return { v: "KILL", c: s.tBad };
  if (r.spend >= 70 && mroas < 1) return { v: "WEAK", c: s.tWarn };
  return { v: "TESTING", c: undefined };
}

function profitPerOrder(r: Row) {
  if (!r.pur) return null;
  return CR * (r.rev / r.pur) - r.spend / r.pur;
}

function Table({ rows, showVerdict }: { rows: Row[]; showVerdict?: boolean }) {
  return (
    <div className={base.tableWrap}>
      <table className={`${base.table} ${s.num}`}>
        <thead>
          <tr>
            <th>Creative</th><th>Type</th><th>Spend</th><th>Purch</th><th>Revenue</th><th>ROAS</th>
            <th title="Average order value for this creative's buyers">AOV</th>
            <th title="35% contribution × AOV, minus CPA. The number that actually ranks creatives — a high-AOV 4× can out-earn a low-AOV 6×.">Profit / order</th>
            {showVerdict ? <th title="Mechanical rules — see the card below. Nobody argues with a rule.">Verdict</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const roas = r.spend ? r.rev / r.spend : 0;
            const ppo = profitPerOrder(r);
            const vd = verdict(r);
            return (
              <tr key={r.name}>
                <td>{r.thumb ? <img src={r.thumb} alt="" className={s.thumb} /> : null}{r.name}</td>
                <td>{r.type}</td>
                <td>{usd(r.spend)}</td>
                <td>{r.pur}</td>
                <td>{usd(r.rev)}</td>
                <td className={roas >= 5 ? s.tWin : roas >= 3.5 ? s.tOk : roas >= 2.86 ? undefined : roas >= 1.2 ? s.tWarn : s.tBad}>
                  {x(roas)}
                </td>
                <td>{r.pur ? usd(r.rev / r.pur) : "—"}</td>
                <td className={ppo === null ? s.dim : ppo >= 30 ? s.tWin : ppo >= 10 ? s.tOk : ppo >= 0 ? s.tWarn : s.tBad}>
                  {ppo === null ? "—" : usd(ppo)}
                </td>
                {showVerdict ? <td className={vd.c}>{vd.v}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SkoTests() {
  const tests = (data.tests as Row[]).slice().sort((a, b) => b.rev - a.rev);
  const winners = data.winners as Row[];
  return (
    <div className={base.page}>
      <nav className={base.nav}>
        <span className={base.navTitle}>SKO · Creative Testing</span>
        <span className={base.navNote}>Updated {data.asOf} · window {data.window}</span>
      </nav>

      <main className={`${base.main} ${s.big}`}>
        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>01</span>
            <h2 className={base.sectionTitle}>The rules</h2>
          </div>
          <p className={s.pullBig}>
            Every new creative gets 14 days and its own test lane. The numbers decide —
            nobody argues with a rule.
          </p>
          <div className={s.insightGrid}>
            <div className={s.insight}>
              <span className={s.insightNum}>2 wks</span>
              <span className={s.insightTag}>Test lanes</span>
              <p className={s.insightBody}>
                Two standing test campaigns: <strong>UGC creators</strong> and{" "}
                <strong>Higgsfield content</strong>. $75–100/day each, $50 cost cap,
                ages 18–44, full price — max 10% attribution code, never SUMMER30.
                Max 12 creatives per lane.
              </p>
            </div>
            <div className={s.insight}>
              <span className={s.insightNum}>3 + 5×</span>
              <span className={s.insightTag}>Graduate</span>
              <p className={s.insightBody}>
                <strong>≥3 purchases, ROAS ≥5×, ≥$100 spend</strong> inside 14 days →
                moves to the WINNERS campaign at full budget share. Hit the bars on
                less spend → "PROMOTE?" — feed it to $100 and confirm.
              </p>
            </div>
            <div className={s.insight}>
              <span className={s.insightNum}>$70</span>
              <span className={s.insightTag}>Kill</span>
              <p className={s.insightBody}>
                <strong>$70 spent, zero purchases → off.</strong> $100 spent with
                margin-ROAS under 0.8 → off. $70 is 1.3× the breakeven CPA — a
                creative that can't buy one customer with it doesn't get a second.
              </p>
            </div>
          </div>
          <p className={s.footnote}>
            Economics behind the bars: <strong>75% of each order is cost</strong>{" "}
            (processing, COGS, fulfillment, shipping, labor), so contribution = 25%
            of revenue. <strong>The CAC rule: breakeven at 25% of AOV, target ≤18%.</strong>{" "}
            At $218 AOV that's breakeven $54.50, target ~$40 — the current $50 caps
            are near-breakeven and should trim toward $40–45 after restock, or AOV
            has to rise (bundles). A 20% discount leaves 5% contribution → 20×
            breakeven — paid traffic never sees SUMMER30. Full-price breakeven ROAS
            = 4.0×. Profit/order = 25% × AOV − CPA.
          </p>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>02</span>
            <h2 className={base.sectionTitle}>Winners — the on-going bucket</h2>
          </div>
          <Table rows={winners} />
          <p className={s.footnote}>
            Full price, 65–70% of total budget, caps trimming toward $40–45.
            Graduates land here with their own ad; fatigue (ROAS below 4× for a
            full week at real spend) sends a winner back to the bench.
          </p>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>03</span>
            <h2 className={base.sectionTitle}>Test pipeline — this cycle</h2>
          </div>
          <Table rows={tests} showVerdict />
          <p className={s.footnote}>
            <strong>Inventory caveat for this cycle:</strong> Aug 9–17 ran at ~25%
            stock — restock lands Wednesday Aug 19. A KILL earned while the
            creative's product was out of stock is provisional: re-test one cycle
            after restock before writing the creative off. Verdicts are computed
            from the rules above, not opinions. GRADUATE rows
            move to Winners at the Monday review; KILL rows switch off the same day.
            Update cadence: export the weekly creative report from TikTok Ads
            Manager, run <span className={s.mono}>scripts/build-sko-tests.py</span>,
            push.
          </p>
        </section>

        <section className={base.section}>
          <div className={base.sectionHead}>
            <span className={base.sectionNum}>04</span>
            <h2 className={base.sectionTitle}>Weekly operating loop</h2>
          </div>
          <ul className={base.list}>
            <li><strong>Monday:</strong> export last 7 days creative-level from TikTok → run the script → verdicts refresh here.</li>
            <li><strong>Same day:</strong> execute every KILL, move every GRADUATE into Winners with its own ad, top the test lanes back up to 12 creatives.</li>
            <li><strong>Intake:</strong> new UGC goes to the UGC lane, new Higgsfield renders to the Higgsfield lane. Nothing ever launches directly into Winners.</li>
            <li><strong>Guardrail:</strong> test lanes together never exceed ~30% of weekly spend; Winners never runs a discount code above 10%.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
