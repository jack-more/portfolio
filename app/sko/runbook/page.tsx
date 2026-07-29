import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "SKO Compounds — Pixel & Event Tracking Runbook — Jack Morello",
  description:
    "Ordered troubleshooting steps for lost TikTok pixel events on a React SPA, prepared by Jack Morello.",
  robots: { index: false, follow: false },
};

/* Stack inventory observed from the public site in July 2026 — loaded scripts,
   cookies and storage only. No account access. */

const stack = [
  { k: "Front end", v: "React single-page app, Vite build. Client-side routing." },
  { k: "TikTok", v: "Browser pixel loaded, ttq exposed with page() and track() available." },
  { k: "RedTrack", v: "track.skocompounds.com/uniclick.js — last-paid attribution, 90-day cookie window." },
  { k: "Server-side tagging", v: "sst.skocompounds.com is serving a first-party tagging script. Some server-side infrastructure already exists." },
  { k: "Meta", v: "Pixel still live and loading config. CAPI parameter builder is being pulled from a public CDN (unpkg) rather than self-hosted." },
  { k: "Google", v: "Ads conversion tag present alongside GA4 and GTM." },
];

const phases = [
  {
    n: "Phase 1",
    t: "See what actually fires — 30 minutes, no code",
    items: [
      "Install TikTok Pixel Helper in Chrome. Walk the full funnel end to end: land, view a product, add to cart, begin checkout, complete a test order.",
      "Write down which events fire at each step and which don't. This one exercise usually finds the problem.",
      "Open Events Manager and compare against the Diagnostics tab. TikTok flags malformed and missing parameters there, and most people never look at it.",
      "Keep DevTools Network open, filtered to analytics.tiktok.com, so you can see the actual event calls rather than trusting the UI.",
    ],
  },
  {
    n: "Phase 2",
    t: "The SPA test — this is the likely culprit",
    items: [
      "The TikTok base snippet fires a pageview once, when the script loads. On a React app, moving between views is a client-side route change with no new document load — so unless the app explicitly calls ttq.page() on every route change, the pixel never fires again.",
      "Test it directly: with the Network tab filtered to TikTok, navigate from the catalog into a product without a full reload. If no new request appears, that is your gap.",
      "Product cards on the site are click handlers rather than links, which means product views are almost certainly client-side. That is exactly the part of the funnel where you need ViewContent to fire.",
      "The fix is a route-change listener in the router that calls ttq.page(), plus explicit ttq.track() calls on the actions that matter.",
    ],
  },
  {
    n: "Phase 3",
    t: "Event integrity — the silent failures",
    items: [
      "TikTok's purchase event is CompletePayment, not Purchase. Purchase is Meta's name. Wiring Meta's vocabulary into TikTok produces events that look like they fired and never report.",
      "Every CompletePayment needs value and currency. Without them conversions register but revenue reads as zero, which breaks ROAS while appearing to work.",
      "Include contents with content_id, content_type, quantity and price so reporting works at product level.",
      "Attach an event_id to every browser event now, even before going server-side — it costs nothing and it's the hook deduplication will need later.",
      "Fire ttq.identify() with hashed email and phone where you have them. Match quality is what decides whether an event gets attributed or dropped.",
    ],
  },
  {
    n: "Phase 4",
    t: "Checkout — where this most likely breaks",
    items: [
      "Checkout is on-domain with inline card fields, so the pixel can fire there. That rules out the worst case and makes this very fixable.",
      "But there are multiple card processors plus a bank option, and each one has its own completion path. CompletePayment has to fire on every one of them. If it was wired to a single flow, every order settled through the others is invisible — and that alone can account for a large share of what looks unattributed.",
      "Run a test order through each payment route separately and watch whether the event fires each time. Not one test order — one per processor.",
      "Bank payments are the harder case. If funds settle asynchronously rather than at the moment of checkout, the browser has already gone. A pixel structurally cannot capture those conversions no matter how it is configured.",
      "Confirm the order record stores ttclid at first touch, since that stored value is what makes the server-side fix possible.",
    ],
  },
  {
    n: "Phase 5",
    t: "Server-side — the permanent fix",
    items: [
      "Send CompletePayment from the order pipeline through TikTok's Events API, carrying the stored ttclid, the _ttp value, hashed email and phone, IP and user agent.",
      "Stamp the same event_id on the browser event and the server event so TikTok collapses them into one. Skip this and you will double-count.",
      "Watch Event Match Quality and push it above 8.0. That score is the difference between events being matched and quietly discarded.",
      "There is already a server-side tagging endpoint on the domain — the first job is establishing what it is currently doing before building anything new alongside it.",
    ],
  },
  {
    n: "Phase 6",
    t: "Validate, then decide what you trust",
    items: [
      "Use Test Events to confirm each event arrives once, with full parameters, before trusting any reporting.",
      "Run seven clean days, then compare TikTok's reported conversions against order data. They will not match — different windows, different models, view-through counted on one side only.",
      "Name one source of truth. Order data is the business number. TikTok's number is an optimization signal. Reconciling them permanently is a tax; choosing between them is a decision made once.",
    ],
  },
];

const ranked = [
  "CompletePayment wired to one payment route while orders settle through several. Every order through an unwired processor is invisible.",
  "Pageview and ViewContent never firing after the first load, because nothing calls ttq.page() on route change.",
  "The purchase event named Purchase instead of CompletePayment, or missing value and currency.",
  "Bank payments settling after the browser has gone, which no pixel can capture.",
  "No Events API, so everything lost to ad blockers, tracking prevention and TikTok's in-app browser stays lost.",
  "Several systems counting the same orders and disagreeing, which reads as unattributed when it is really unreconciled.",
];

export default function RunbookPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/sko/tracking" className={styles.navBack}>
          ← tracking
        </Link>
        <span className={styles.navTitle}>Event tracking runbook</span>
        <span className={styles.navNote}>working doc</span>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Finding the lost events</h1>
          <p className={styles.heroLede}>
            Ordered so the cheap checks come first. Phases one and two need no
            engineering and will most likely find the problem on their own.
            Everything below is based on what is visible from the public site —
            with account access this gets a lot more precise.
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
            <span className={styles.sectionNum}>00</span>
            <h2 className={styles.sectionTitle}>What&rsquo;s on the site today</h2>
          </div>
          <div className={styles.findings}>
            {stack.map((s) => (
              <div key={s.k} className={styles.finding}>
                <span className={styles.findingKey}>{s.k}</span>
                <span className={styles.findingVal}>{s.v}</span>
              </div>
            ))}
          </div>
          <p className={styles.body}>
            Worth saying plainly: there is a lot here, and it looks like it
            arrived in layers. Several of these systems overlap, and at least one
            appears half-finished. Before adding anything, the job is
            establishing what each one is currently doing.
          </p>
        </section>

        {phases.map((p) => (
          <section key={p.n} className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>{p.n}</span>
              <h2 className={styles.sectionTitle}>{p.t}</h2>
            </div>
            <ul className={styles.list}>
              {p.items.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>—</span>
            <h2 className={styles.sectionTitle}>Most likely causes, ranked</h2>
          </div>
          <ul className={styles.list}>
            {ranked.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <p className={styles.pull}>
            A React app plus a pixel designed for page loads is the most common
            way good ad spend goes unmeasured. It is also one of the more
            straightforward things to fix.
          </p>
        </section>

        <footer className={styles.footer}>
          <span>
            Prepared for SKO Compounds, July 2026. Phases one and two are worth
            running before our next conversation — whatever they turn up will
            make the rest of this much more specific.
          </span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
