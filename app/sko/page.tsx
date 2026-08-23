import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SKO Compounds — 90-Day Growth Plan — Jack Morello",
  description:
    "A 90-day acquisition and retention plan for SKO Compounds, prepared by Jack Morello.",
  robots: { index: false, follow: false },
};

/* Observations below were read directly off skocompounds.com and the
   @skocompounds TikTok profile in July 2026. Nothing here is estimated. */

const findings = [
  {
    k: "Catalog",
    v: "33 products across seven research categories. Every SKU carries a COA Verified badge, and each has its own rating — 4.7 to 4.9 stars, on review counts from 57 to 421.",
  },
  {
    k: "Compliance",
    v: "A researcher-verification gate sits in front of the catalog. That is a real control, and more than most of the category bothers with.",
  },
  {
    k: "Stock",
    v: "Five of 33 products are sold out, including MT-2 at 291 reviews and Cagrilintide. Paid traffic pointed at an out-of-stock SKU is spend with nowhere to land.",
  },
  {
    k: "Meta",
    v: "No active ads under the SKO Compounds name.",
  },
  {
    k: "TikTok",
    v: "@skocompounds sits at roughly 1,500 followers and 7,600 lifetime likes, with a handful of videos between 26K and 111K views and most others between 300 and 1,200. The shape of that distribution points to paid promotion rather than organic reach.",
  },
  {
    k: "Discounting",
    v: "A permanent public code runs in the TikTok bio at 20% off, alongside creator codes. Two discount ladders competing for the same order.",
  },
  {
    k: "Rankings",
    v: "Absent from the vendor comparison lists that drive discovery in this category — checked against two of the largest.",
  },
];

const concepts = [
  {
    label: "01 · Proof",
    title: "The CoA scroll",
    hook: "Every batch gets a certificate. This is this batch's.",
    body: "Screen recording of a real Certificate of Analysis, batch number visible. Tests whether documentation converts on its own.",
  },
  {
    label: "02 · Authority",
    title: "Purity spec card",
    hook: "99%. Here's how that number is actually measured.",
    body: "Molecular render and chromatogram as a clean motion graphic. Tests technical authority against vendors who only claim a number.",
  },
  {
    label: "03 · Education",
    title: "How to read a CoA",
    hook: "Most people can't read one of these. Two minutes and you can.",
    body: "Creator voiceover over a real document. Tests save rate, and positions SKO as the transparent option without claiming it.",
  },
  {
    label: "04 · Trust",
    title: "The vendor check",
    hook: "Before I order from any supplier, I check three things.",
    body: "Creator POV with an on-screen checklist. Targets the legitimacy question buyers are already asking.",
  },
  {
    label: "05 · Service",
    title: "Same-day dispatch",
    hook: "Ordered at 2. Packed at 4. Here's what that looks like.",
    body: "Fulfillment bench POV. Competes on reliability and touches no claims at all.",
  },
  {
    label: "06 · Utility",
    title: "Why lyophilized doesn't need ice",
    hook: "Everyone asks if this needs cold shipping. It doesn't, and here's why.",
    body: "Plain-language explainer. High save rate, zero compliance surface.",
  },
  {
    label: "07 · Demand",
    title: "What a secretagogue actually is",
    hook: "This word is on half the labels and nobody explains it.",
    body: "Simple animation. Builds search demand for house-named products that currently have none.",
  },
  {
    label: "08 · Competitive",
    title: "Four suppliers, four numbers",
    hook: "Same molecule. Four suppliers. Four different purity results.",
    body: "On-screen comparison, no competitor named. Tests whether verification beats price as the buying reason.",
  },
];

const asks = [
  {
    q: "90-day repeat rate",
    why: "Decides whether this is an acquisition business or a retention one. Every channel decision below bends around it.",
  },
  {
    q: "AOV and gross margin",
    why: "Sets the CAC ceiling. Without it, any target CAC I quote is a guess dressed as a plan.",
  },
  {
    q: "Current payment stack, and whether a backup processor is live",
    why: "Stripe, Shopify Payments and PayPal all prohibit peptides. A drop means frozen funds and a MATCH listing.",
  },
  {
    q: "How many creators are running codes, and what each is worth",
    why: "If codes aren't attributed per creator, the program can't be scaled or cut with any confidence.",
  },
  {
    q: "Whether TikTok spend is running through Promote or Ads Manager",
    why: "Promote optimizes for views. Ads Manager can optimize for purchases. They are not the same product and don't clear review the same way.",
  },
];

export default function SkoPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navBack}>
          ← jackmorello
        </Link>
        <span className={styles.navTitle}>SKO Compounds</span>
        <span className={styles.navNote}>90-day plan</span>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>
            The next 90 days
          </h1>
          <p className={styles.heroLede}>
            A plan for turning creator distribution into a measured acquisition
            system, and for using the window before this category gets crowded.
            Everything in the findings below was read directly off the site and
            the TikTok profile. Where I need a number I don&rsquo;t have, I&rsquo;ve asked
            for it rather than assumed it.
          </p>
          <div className={styles.byline}>
            <span>
              Prepared by <strong>Jack Morello</strong>
            </span>
            <span>July 2026</span>
            <span>
              <a href="https://jackmorello.com">jackmorello.com</a>
            </span>
            <span>
              <a href="/sko/ad-rankings-aug16-24.html">Ad rankings · Aug 16–24</a>
            </span>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>The moment</h2>
          </div>
          <div className={styles.card}>
            <span className={styles.cardLabel}>23–24 July 2026</span>
            <p className={styles.cardBody}>
              The FDA&rsquo;s Pharmacy Compounding Advisory Committee recommended six
              of seven peptides for the 503A bulk drug substances list —
              BPC-157, KPV, TB-500, MOTS-c, Semax and Epitalon. DSIP was
              rejected. SKO&rsquo;s catalog covers five of the six. The recommendation
              is advisory; FDA still decides.
            </p>
          </div>
          <p className={styles.body}>
            Most of the category read that as good news. I&rsquo;d read it as a clock
            starting. Right now the restriction is the moat — ad platforms
            won&rsquo;t take the money and pharmacies can&rsquo;t fill the script, so demand
            routes to whoever is reachable and trusted. If these molecules move
            to Category 1, both walls come down. Compounding pharmacies and
            telehealth get a prescription version of this exact catalog, with a
            doctor attached and full access to Meta and Google.
          </p>
          <p className={styles.pull}>
            The twelve months ahead are the cheapest attention this category will
            ever offer. The work is converting it into an owned audience before
            the money arrives.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>What I found</h2>
          </div>
          <div className={styles.findings}>
            {findings.map((f) => (
              <div key={f.k} className={styles.finding}>
                <span className={styles.findingKey}>{f.k}</span>
                <span className={styles.findingVal}>{f.v}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>03</span>
            <h2 className={styles.sectionTitle}>Market context</h2>
          </div>
          <p className={styles.body}>
            Scale has not protected anyone in this category. Peptide Sciences
            shut down on 6 March 2026 after more than thirty years. Amino
            Asylum&rsquo;s warehouse was raided by the FDA in June 2025, and founders
            tied to that operation and to Paradigm Peptides pleaded guilty to
            federal charges in December 2025. In September 2025 the FDA issued
            more than fifty warning letters, a wave that specifically targeted
            research-use-only labeling paired with advertising that implied
            human use.
          </p>
          <p className={styles.body}>
            That shapes how I&rsquo;d build. Growth here is only worth what it can
            survive, so resilience isn&rsquo;t a footnote to the plan — it&rsquo;s the first
            phase of it.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionTitle}>The plan</h2>
          </div>
          <p className={styles.body}>
            I don&rsquo;t launch and then discover the economics. I start from the
            number the margin affords and work backward.
          </p>

          <div className={styles.stack}>
            <div className={styles.card}>
              <span className={styles.phaseWhen}>Days 1–30</span>
              <span className={styles.phaseTitle}>Instrument and protect</span>
              <ul className={styles.list}>
                <li>
                  Establish the real economics — AOV, gross margin, 90-day
                  repeat rate — and set a CAC target from the margin rather than
                  from a benchmark.
                </li>
                <li>
                  Give every creator a unique code and link with server-side
                  tracking behind it, so creator spend becomes a decision rather
                  than a guess.
                </li>
                <li>
                  Move TikTok spend off view-optimized promotion and onto a
                  conversion objective with a pixel behind it.
                </li>
                <li>
                  Redundancy audit: backup payment processor, second domain, an
                  email platform that permits the vertical.
                </li>
                <li>
                  Resolve the sold-out SKUs before any spend points at them.
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.phaseWhen}>Days 31–60</span>
              <span className={styles.phaseTitle}>
                Build the channel that fits this category
              </span>
              <ul className={styles.list}>
                <li>
                  Creator bench to 20–40, with tiered commission, tight briefs
                  on hook and angle, and usage rights so winners can be reused.
                </li>
                <li>
                  Restructure the discount ladder so creator codes are worth
                  more than the public code. Right now they compete.
                </li>
                <li>
                  Surface the review base. Thousands of product reviews exist
                  and almost none of it is working where buyers are deciding.
                </li>
                <li>
                  Earn placement on the vendor comparison lists. SKO already has
                  what those rankings score — third-party testing, purity,
                  transparency — and appears on none of them.
                </li>
                <li>
                  Email and SMS capture on every order, a reorder flow timed to
                  the real cycle, and subscription on the repeat-purchase SKUs.
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.phaseWhen}>Days 61–90</span>
              <span className={styles.phaseTitle}>Add paid, carefully</span>
              <ul className={styles.list}>
                <li>
                  Meta as a small controlled test — clean Business Manager,
                  verified domain, server-side conversions, and creative built
                  research-use-native from the first line. It has to clear review
                  and clear CAC before anyone says scale.
                </li>
                <li>Google on brand and competitor terms.</li>
                <li>
                  Scale only what&rsquo;s proven, hold the asset diversification, keep
                  fresh creative ahead of fatigue.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>05</span>
            <h2 className={styles.sectionTitle}>Creative: eight concepts</h2>
          </div>
          <p className={styles.body}>
            Every concept is built compliant by construction — molecule-first,
            third person, no dosing, no outcome claims. The constraint is the
            brief, not an obstacle to it. These run as creator briefs now and as
            paid creative later.
          </p>
          <div className={styles.grid}>
            {concepts.map((c) => (
              <div key={c.title} className={styles.card}>
                <span className={styles.cardLabel}>{c.label}</span>
                <span className={styles.cardTitle}>{c.title}</span>
                <span className={styles.hook}>{c.hook}</span>
                <span className={styles.cardBody}>{c.body}</span>
              </div>
            ))}
          </div>

          <p className={styles.subhead}>How the test runs</p>
          <ul className={styles.list}>
            <li>
              Eight distinct concepts, not eight variations of one. Variations
              come later, built off whatever wins.
            </li>
            <li>
              Even budget per concept, variables held constant, run for five
              days.
            </li>
            <li>
              Read at 48–72 hours on leading indicators — hook rate, hold rate,
              CTR, CPC, early CPA. Return on ad spend is too slow and too noisy
              to steer on this early.
            </li>
            <li>
              Kill flatliners immediately, fund outliers, cut fresh variants off
              the winners, launch the next batch.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>06</span>
            <h2 className={styles.sectionTitle}>What I&rsquo;d need from you</h2>
          </div>
          <p className={styles.body}>
            I could put a CAC target on this page. It would be invented, and
            you&rsquo;d be right not to trust it. These are the five numbers that turn
            the plan above into a forecast.
          </p>
          <div className={styles.asks}>
            {asks.map((a) => (
              <div key={a.q} className={styles.ask}>
                <span className={styles.askQ}>{a.q}</span>
                <span className={styles.askWhy}>{a.why}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>07</span>
            <h2 className={styles.sectionTitle}>Why me</h2>
          </div>
          <p className={styles.body}>
            I&rsquo;ve managed well over $500k a month in paid media, and I&rsquo;ve run
            acquisition in a vertical that was formally banned. On the crypto
            side — a token launch and NEAR — I scaled to $150k a month across
            Meta, Google, TikTok, Snap and programmatic at a peak ROAS of 5.8×,
            in a category where most operators were shut off entirely.
          </p>
          <p className={styles.body}>
            The transferable part isn&rsquo;t the spend. Staying live was the hard
            problem, and solving it meant building for compliance and redundancy
            from the first day rather than after the first suspension. That&rsquo;s the
            same problem here, with different objects: the processor and the
            creator account instead of the ad account.
          </p>
        </section>

        <footer className={styles.footer}>
          <span>
            Prepared for SKO Compounds, July 2026. Happy to go deeper on any
            section — particularly creator attribution, which I think is the
            highest-return work available in the first month.
          </span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
