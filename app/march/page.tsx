import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import Clipper from "./Clipper";
import Sequences from "./Sequences";

export const metadata: Metadata = {
  title: "Monty Summit Intake + Planner (Mock-Up) — Jack Morello",
  description:
    "A mock-up intake and planning workflow for the Montgomery Summit, with example works, prepared for March Capital.",
  robots: { index: false, follow: false },
};

/* ============ PART 1 — THE WORKFLOW ============ */

const flow = [
  { k: "Target", v: "Identify the specific decision-makers worth a seat." },
  { k: "Segment", v: "Group them by role and tailor the message to each." },
  { k: "Sequence", v: "Five touches over eight weeks in one continuous narrative." },
  { k: "Content", v: "Short clips and creative that sustain interest between touches." },
  { k: "Convert", v: "Track responses, confirm seats, and pre-book meetings." },
];

const principles = [
  {
    k: "Segmentation",
    v: "Each audience receives messaging written for their role. A CISO and a Series C founder attend for different reasons and read different emails.",
  },
  {
    k: "Cadence",
    v: "Five touches across eight weeks. Each message advances one narrative and is timed to build on the previous one.",
  },
  {
    k: "Demand",
    v: "The sequence builds anticipation so the right people request a seat ahead of the formal invitation.",
  },
];

const heads = [
  {
    tag: "The buyers",
    title: "Enterprise CxOs",
    line: "CIO · CTO · CISO — Fortune 500",
    body: "They approve enterprise AI budgets and attend to see how their peers are deploying it. The message leads with proof: Goldman's CIO running digital co-workers, and FedEx rebuilt around automation.",
  },
  {
    tag: "The builders",
    title: "Growth-stage founders",
    line: "The 120+ who present, plus the ones who should",
    body: "For a founder, the Summit is 1,200 buyers, investors, and acquirers in one venue. The message leads with access: direct introductions to the enterprise buyers they otherwise cannot reach.",
  },
  {
    tag: "The capital",
    title: "Investors & corp dev",
    line: "VCs · institutional · corp dev",
    body: "They attend for early signal: a first look at 120+ vetted companies before the decks circulate, and the market theses that surface in person.",
  },
];

/* ============ PART 2 — TRACK RECORD ============ */

const brands = [
  { src: "/images/netflix.png", alt: "Netflix" },
  { src: "/images/disneyplus.png", alt: "Disney+" },
  { src: "/images/sony-pictures-logo.png", alt: "Sony Pictures" },
  { src: "/images/universal-logo.png", alt: "Universal" },
  { src: "/images/amazon-prime-video.png", alt: "Prime Video" },
  { src: "/images/toyota-logo.png", alt: "Toyota" },
  { src: "/images/starbucks.png", alt: "Starbucks" },
  { src: "/images/bmw.png", alt: "BMW" },
  { src: "/images/near-protocol.png", alt: "NEAR" },
  { src: "/images/Dtravel-logo.jpg", alt: "Dtravel" },
  { src: "/images/DevolvedAI.png", alt: "Devolved AI" },
];

const tasks: { co: string; name: string; out: string; href: string | null }[] = [
  {
    co: "Devolved AI",
    name: "Positioning, messaging & launch of a private enterprise-AI platform",
    out: "Rebrand and onboarding overhaul → −35% drop-off · content pipeline feeding inbound to sales",
    href: "https://www.globenewswire.com/news-release/2024/12/05/2992635/0/en/Devolved-AI-Announces-Strategic-Partnership-with-GDA-Capital-to-Revolutionize-Blockchain-Powered-AI-Solutions.html",
  },
  {
    co: "Rarestone Capital",
    name: "Content Lead — research, whitepapers & editorial across the Web3 portfolio",
    out: "Investment theses and articles for Radix, Wilder World, Mantra DAO, Argo & NFTify",
    href: null,
  },
  {
    co: "NEAR",
    name: "Four product launches and the paid & landing-page testing system",
    out: "CAC −60% · landing-page conversion +140% · 50K+ MAU",
    href: "https://pages.near.org/blog/near-tasks-launches-ai-marketplace-on-near-to-revolutionize-the-future-of-work/",
  },
  {
    co: "Dtravel",
    name: "0→1 growth: user and host acquisition through Series A",
    out: "0→12K users · 2,000+ listings seeded · $8M raise",
    href: "https://cryptoslate.com/move-over-airbnb-blockchain-based-dtravel-has-secured-200000-property-listings-in-its-first-30-days/",
  },
  {
    co: "SushiSwap",
    name: "NFT curation & strategy for the Shoyu platform",
    out: "Vetted and onboarded 200+ artists · shipped 15+ collections · drafted governance proposals",
    href: null,
  },
  {
    co: "iHeartMedia",
    name: "Paid media across Starbucks, Toyota & Starzplay",
    out: "$200–400K / mo managed · +25% QoQ ROAS",
    href: null,
  },
];

const gallery = [
  { src: "/images/campaigns/full-stack/nearcon-2023.jpg", cap: "NEARCON 2023 — product beta launch" },
  { src: "/images/campaigns/full-stack/consensus-2023.jpg", cap: "Consensus 2023 — live demo, Austin" },
  { src: "/images/campaigns/full-stack/dtravel-trvl.png", cap: "Dtravel — TRVL token launch" },
  { src: "/images/campaigns/full-stack/open-passport-nft.png", cap: "Dtravel — Open Passport program" },
  { src: "/images/campaigns/full-stack/devolved-secure.jpg", cap: "Devolved AI — secure platform launch" },
  { src: "/images/campaigns/creative/lg-v20-campaign.jpg", cap: "LG V20 — launch creative" },
];

const writing: { co: string; desc: string; href: string | null }[] = [
  {
    co: "Dtravel",
    desc: "The Dtravel Manifesto — the platform's founding narrative",
    href: "https://medium.com/dtravel-community/dtravel-manifesto-96d7eb3e48e7",
  },
  {
    co: "Dtravel",
    desc: "TRVL token launch announcement",
    href: "https://medium.com/dtravel-community/trvl-token-launch-18b85ef2d0c0",
  },
];

export default function MarchPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navBack}>&larr; Home</Link>
        <span className={styles.navTitle}>For March Capital</span>
        <span className={styles.navNote}>Platform &amp; Marketing</span>
      </nav>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Mock-Up: Monty Summit Intake + Planner</h1>
          <p className={styles.lede}>
            A mock-up of an intake and planning workflow for the Montgomery
            Summit: how prospective attendees are{" "}
            <em>identified, segmented, sequenced, and converted into confirmed
            seats</em>, with example works below.
          </p>
        </section>

        {/* ============ PART 1 ============ */}
        <section className={styles.part}>
          <div className={styles.partHead}>
            <span className={styles.partKicker}>Part 01</span>
            <h2 className={styles.partTitle}>Workflow</h2>
            <p className={styles.partSub}>
              The end-to-end process for identifying the right attendees and
              converting them into confirmed seats.
            </p>
          </div>

          <div className={styles.flow}>
            {flow.map((f, i) => (
              <div key={f.k} className={styles.flowStep}>
                <span className={styles.flowNum}>0{i + 1}</span>
                <p className={styles.flowK}>{f.k}</p>
                <p className={styles.flowV}>{f.v}</p>
              </div>
            ))}
          </div>

          <div className={styles.principles}>
            {principles.map((p) => (
              <div key={p.k} className={styles.principle}>
                <p className={styles.principleK}>{p.k}</p>
                <p className={styles.principleV}>{p.v}</p>
              </div>
            ))}
          </div>

          {/* audiences */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>A</span>
            <h3 className={styles.sectionTitle}>Audiences</h3>
            <span className={styles.sectionSub}>
              The three groups the plan targets, and why each attends.
            </span>
          </div>
          <div className={styles.segments}>
            {heads.map((s) => (
              <div key={s.title} className={styles.segment}>
                <span className={styles.segTag}>{s.tag}</span>
                <h4 className={styles.segTitle}>{s.title}</h4>
                <p className={styles.segLine}>{s.line}</p>
                <p className={styles.segBody}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* the sequence */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>B</span>
            <h3 className={styles.sectionTitle}>Sequences</h3>
            <span className={styles.sectionSub}>
              A tiered plan for each audience.
            </span>
          </div>
          <p className={styles.seqIntro}>
            Each audience is tiered, and each gets its own sequence, built on this
            year&apos;s actual program. Pick a bucket. Copy is illustrative.
          </p>
          <Sequences />

          {/* the content engine */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>C</span>
            <h3 className={styles.sectionTitle}>Content engine</h3>
            <span className={styles.sectionSub}>
              Short-form content sustains attention between touches. This tool
              produces it.
            </span>
          </div>
          <Clipper />
        </section>

        {/* ============ PART 2 ============ */}
        <section className={styles.part}>
          <div className={styles.partHead}>
            <span className={styles.partKicker}>Part 02</span>
            <h2 className={styles.partTitle}>Example Works</h2>
            <p className={styles.partSub}>
              Selected past work behind the plan above: events, roles, and writing.
            </p>
          </div>

          <div className={styles.feature}>
            <span className={styles.featKicker}>Featured · live-event activation</span>
            <h3 className={styles.featTitle}>Proof of Memories</h3>
            <p className={styles.featSub}>NEAR × SailGP · deployed on-site at live race events</p>
            <p className={styles.featBody}>
              A digital onboarding campaign I created and produced with engineering
              and design, deployed at SailGP events to onboard race-day fans on
              site. Built on NEAR&apos;s 5-second FastAuth wallet, it let fans
              collect a &ldquo;memory&rdquo; from the event with no crypto
              friction, and functioned as a live, measurable onboarding funnel.
            </p>
            <p className={styles.featWhy}>
              <b>Relevance:</b> the same work the Summit needs — a live event
              turned into a measurable acquisition channel.
            </p>
            <div className={styles.featLinks}>
              <a className={styles.featLink} href="https://near.org/blog/sailgp-launches-digital-collectibles-series-on-near/" target="_blank" rel="noopener noreferrer">
                Digital collectibles series &rarr;
              </a>
              <a className={styles.featLink} href="https://pages.near.org/blog/near-foundation-and-sail-gp-elevate-mobile-fan-engagement-with-the-dock/" target="_blank" rel="noopener noreferrer">
                The Dock — fan onboarding &rarr;
              </a>
              <a className={styles.featLink} href="https://www.forbes.com/sites/jennywang/2023/08/31/sailgp-and-near-unlock-blockchain-powered-fan-ownership/" target="_blank" rel="noopener noreferrer">
                Forbes coverage &rarr;
              </a>
            </div>
          </div>

          <div className={styles.brandStrip}>
            {brands.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.alt} src={b.src} alt={b.alt} className={styles.brandLogo} />
            ))}
          </div>

          {/* tasks owned */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>A</span>
            <h3 className={styles.sectionTitle}>Work I owned</h3>
            <span className={styles.sectionSub}>Strategy through execution.</span>
          </div>
          <div className={styles.taskList}>
            {tasks.map((t) => (
              <div key={t.co} className={styles.task}>
                <span className={styles.taskCo}>{t.co}</span>
                <p className={styles.taskName}>{t.name}</p>
                <p className={styles.taskOut}>{t.out}</p>
                {t.href && (
                  <span className={styles.taskRight}>
                    <a href={t.href} className={styles.taskLink} target="_blank" rel="noopener noreferrer">
                      View &rarr;
                    </a>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* imagery */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>B</span>
            <h3 className={styles.sectionTitle}>Selected imagery</h3>
            <span className={styles.sectionSub}>Launches, events, and creative.</span>
          </div>
          <div className={styles.gallery}>
            {gallery.map((g) => (
              <div key={g.src} className={styles.galItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.cap} className={styles.galImg} />
                <div className={styles.galCap}>{g.cap}</div>
              </div>
            ))}
          </div>

          {/* writing */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>C</span>
            <h3 className={styles.sectionTitle}>Writing</h3>
            <span className={styles.sectionSub}>Published pieces I wrote.</span>
          </div>
          <div className={styles.writeList}>
            {writing.map((w) => (
              <div key={w.href ?? w.desc} className={styles.writeItem}>
                <span className={styles.writeCo}>{w.co}</span>
                <p className={styles.writeDesc}>{w.desc}</p>
                {w.href ? (
                  <a href={w.href} className={styles.writeLink} target="_blank" rel="noopener noreferrer">
                    Read &rarr;
                  </a>
                ) : (
                  <span className={styles.writeSlot}>sample linking here</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Prepared for March Capital by Jack Morello</span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a> ·{" "}
            <a href="mailto:jaidanmorello@gmail.com">jaidanmorello@gmail.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
