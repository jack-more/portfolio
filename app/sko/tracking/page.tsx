import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "SKO Compounds — Tracking & Meta Recovery — Jack Morello",
  description:
    "Diagnosis and fix plan for TikTok attribution gaps and the disabled Meta ad account, prepared by Jack Morello.",
  robots: { index: false, follow: false },
};

/* Everything in the audit section was observed from the public site in July
   2026 — cookies, storage keys and loaded scripts only. No account access. */

const audit = [
  {
    k: "Click IDs",
    v: "ttclid is captured and persisted — as a cookie, and again in localStorage as sko_ttclid. _ttp and ttcsid are both present. Nothing is being dropped at the researcher gate; I tested a tagged URL through it and the parameters survived.",
  },
  {
    k: "Attribution layer",
    v: "RedTrack is live (rtkclickid, sko_redtrack_first_touch, sko_redtrack_last_paid_touch), alongside your own first- and last-touch cookies (sko_attr_first, sko_attr_last).",
  },
  {
    k: "Pixels",
    v: "TikTok pixel, Meta pixel, Google Ads conversion tag and GA4 are all firing, through GTM.",
  },
  {
    k: "Meta CAPI",
    v: "The Meta CAPI parameter builder is loading from a public CDN (unpkg). That's a production dependency on a third-party host — worth pinning or self-hosting regardless of the account situation.",
  },
  {
    k: "The gap",
    v: "No sign of TikTok's Events API. Capture is strong; server-side transmission is what's missing.",
  },
];

const fixes = [
  {
    n: "01",
    t: "TikTok Events API, with deduplication",
    b: "The browser pixel alone loses a meaningful share of purchase events — blocked scripts, ITP, and TikTok's in-app browser dropping cookies before checkout completes. Sending the same purchase server-side, stamped with a matching event_id so TikTok collapses the pair into one, is the single biggest recovery available. Send ttclid, IP and user agent in plain text; hash email and phone.",
  },
  {
    n: "02",
    t: "Push Event Match Quality above 8.0",
    b: "EMQ is TikTok's score for how well it can tie your events to real users. Hashed email, hashed phone, IP, user agent and ttclid together move it. It is the difference between conversions being matched and being dropped into the unattributed bucket.",
  },
  {
    n: "03",
    t: "Name one source of truth",
    b: "Right now RedTrack, TikTok's own reporting, GA4 and your internal cookies are four systems that will never agree. That disagreement is what reads as \"unattributed.\" Pick one for business truth — your own order data — and treat TikTok's number as an optimization signal, not a ledger. Reconciling them is a permanent tax; choosing between them is a decision you make once.",
  },
  {
    n: "04",
    t: "Keep the single pixel",
    b: "One dataset is correct at your stage. Splitting it would starve the algorithm — an ad group needs roughly fifty conversion events a week to optimize properly, and dividing your events across pixels gives you several underfed models instead of one that works.",
  },
];

const metaSteps = [
  {
    n: "01",
    t: "Diagnose before appealing",
    b: "Find the stated policy and the level it hit — ad, ad account, Page, or Business Manager. Those are four different problems with four different paths. Appealing without knowing which one you have wastes the attempt.",
  },
  {
    n: "02",
    t: "Fix, then appeal — once",
    b: "Complete business and payment verification first; an incomplete profile is a concrete blocker a reviewer will hit. Then submit one documented appeal as an admin, with the research-use positioning, the verification gate, the certificates and the disclaimers attached. Repeat appeals do not help. There is a 180-day window from the disable date, after which reinstatement is not possible.",
  },
  {
    n: "03",
    t: "Do not rebuild",
    b: "Standing up fresh accounts on the same domains, payment methods or admins is how a recoverable suspension becomes a permanent one — the assets are linked and the pattern is exactly what enforcement looks for. This is the single most common way operators in restricted categories lose Meta for good.",
  },
  {
    n: "04",
    t: "Pre-clear before spending again",
    b: "As of 2026 this category sits in the group that needs pre-emptive whitelisting rather than post-hoc appeals. That means getting the angle approved before budget goes behind it. It's the approach I used in crypto, and it's the difference between arguing with a review queue and talking to a person who can flag your account internally.",
  },
];

export default function TrackingPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/sko" className={styles.navBack}>
          ← 90-day plan
        </Link>
        <span className={styles.navTitle}>Tracking &amp; Meta</span>
        <span className={styles.navNote}>scope note</span>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Attribution, and getting Meta back
          </h1>
          <p className={styles.heroLede}>
            Two problems, and they are not equal. TikTok is already converting —
            fixing what you can see there compounds immediately. Meta is a
            recovery job with a real chance of not working. I&rsquo;d sequence them in
            that order.
          </p>
          <div className={styles.byline}>
            <span>
              Prepared by <strong>Jack Morello</strong>
            </span>
            <span>July 2026</span>
            <span>
              <a href="https://jackmorello.com">jackmorello.com</a>
            </span>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>What&rsquo;s already on your site</h2>
          </div>
          <p className={styles.body}>
            Observed from the public site — cookies, storage and loaded scripts
            only. It matters because it changes the diagnosis: your capture
            layer is in better shape than the symptom suggests.
          </p>
          <div className={styles.findings}>
            {audit.map((a) => (
              <div key={a.k} className={styles.finding}>
                <span className={styles.findingKey}>{a.k}</span>
                <span className={styles.findingVal}>{a.v}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>What&rsquo;s actually wrong</h2>
          </div>
          <p className={styles.body}>
            The instinct with unattributed conversions is that something
            isn&rsquo;t being captured. That isn&rsquo;t your problem — ttclid is landing
            and persisting correctly. You have two different issues wearing the
            same symptom.
          </p>
          <p className={styles.pull}>
            Events are captured in the browser and lost on the way out. And four
            systems are counting the same orders differently.
          </p>
          <p className={styles.body}>
            The first is fixable and worth real money. The second is a decision,
            not a bug: RedTrack, TikTok&rsquo;s reporting, GA4 and your own cookies
            will never reconcile, because they measure different things over
            different windows. Some share of that gap is also genuinely
            unattributable — view-through conversions TikTok can see and you
            can&rsquo;t, and buyers who research on a phone and purchase on a laptop.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>03</span>
            <h2 className={styles.sectionTitle}>The TikTok fix</h2>
          </div>
          <div className={styles.stack}>
            {fixes.map((f) => (
              <div key={f.n} className={styles.card}>
                <span className={styles.cardLabel}>{f.n}</span>
                <span className={styles.cardTitle}>{f.t}</span>
                <span className={styles.cardBody}>{f.b}</span>
              </div>
            ))}
          </div>
          <p className={styles.body}>
            Because the site is custom rather than Shopify, this is a server-side
            build against your order pipeline rather than an app install. That&rsquo;s
            a few days of engineering, not a plugin — but it&rsquo;s also the version
            that actually works, and it&rsquo;s permanent.
          </p>
          <p className={styles.subhead}>What to expect afterwards</p>
          <p className={styles.body}>
            More conversions attributed, which means your reported cost per
            acquisition improves without spending differently — and more
            importantly, the algorithm starts optimizing against a fuller
            picture. The number moves because the measurement got honest, so
            don&rsquo;t read the first week as a performance change.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionTitle}>Meta, honestly</h2>
          </div>
          <p className={styles.body}>
            I won&rsquo;t promise reinstatement. This category is under heavy review
            and a share of disabled accounts never come back. What I can do is
            make sure the attempt is made properly, once, and that nothing done
            in the meantime forecloses it permanently.
          </p>
          <div className={styles.stack}>
            {metaSteps.map((m) => (
              <div key={m.n} className={styles.card}>
                <span className={styles.cardLabel}>{m.n}</span>
                <span className={styles.cardTitle}>{m.t}</span>
                <span className={styles.cardBody}>{m.b}</span>
              </div>
            ))}
          </div>
          <p className={styles.body}>
            One housekeeping note: your Meta pixel is still firing on the site.
            If the associated assets are disabled it&rsquo;s collecting into
            something you can&rsquo;t use, and it&rsquo;s worth confirming what it&rsquo;s still
            attached to.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>05</span>
            <h2 className={styles.sectionTitle}>Sequencing</h2>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Week 1</strong> — TikTok Events API with deduplication,
              EMQ pushed above 8.0, and one named source of truth.
            </li>
            <li>
              <strong>Week 1, parallel</strong> — pull the Meta disable reason
              and level, complete verification, submit a single documented
              appeal. Confirm the 180-day window hasn&rsquo;t lapsed.
            </li>
            <li>
              <strong>Week 2–3</strong> — read TikTok clean for the first time
              and reset targets against real numbers rather than the
              under-reported ones.
            </li>
            <li>
              <strong>Then</strong> — if Meta comes back, pre-clear angles before
              any budget moves. If it doesn&rsquo;t, that money has a better home in
              creator and Google anyway.
            </li>
          </ul>
          <p className={styles.pull}>
            Fix measurement on the channel that already works before spending
            energy resurrecting the one that doesn&rsquo;t.
          </p>
        </section>

        <footer className={styles.footer}>
          <span>
            Prepared for SKO Compounds, July 2026. The audit above used only
            publicly visible site data — happy to go considerably deeper with
            access to the ad accounts and order data.
          </span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
