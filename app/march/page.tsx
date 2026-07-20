import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import Clipper from "./Clipper";

export const metadata: Metadata = {
  title: "For March Capital — Jack Morello",
  description: "The engine for filling the room — built for March Capital.",
  robots: { index: false, follow: false },
};

/* ============ PART 1 — THE ENGINE ============ */

const flow = [
  { k: "Target", v: "Name the right heads — a list of ones, not a list." },
  { k: "Segment", v: "A different story built for each seat." },
  { k: "Sequence", v: "Five touches, one arc, deliberate cadence." },
  { k: "Content", v: "Clips and creative that build the aura." },
  { k: "Convert", v: "Until they ask you for the seat." },
];

const principles = [
  {
    k: "Segments, not a list",
    v: "A list treats 1,200 people as one. This treats one person as the only invite that matters — a CISO and a Series C founder never get the same word.",
  },
  {
    k: "Cadence, not a blast",
    v: "Five touches, eight weeks, one story. Nobody gets “just following up.” Every note earns the next — or it doesn't get sent.",
  },
  {
    k: "Aura, not an invite",
    v: "Anyone can send an invite. The work is making the room feel unmissable — until the right heads ask you for a seat.",
  },
];

const heads = [
  {
    tag: "The buyers",
    title: "Enterprise CxOs",
    line: "CIO · CTO · CISO — Fortune 500",
    body: "They sign the AI budget. They don't need another conference; they need the room where their peers are already comparing notes. We sell them proof: Goldman's CIO running digital co-workers, FedEx rebuilt around automation.",
  },
  {
    tag: "The builders",
    title: "Growth-stage founders",
    line: "The 120+ who present — and the ones who should",
    body: "For a founder, the Summit is 1,200 buyers, investors, and acquirers under one roof. We sell them access — the shortest path to the enterprise buyer who's ghosted their emails all year.",
  },
  {
    tag: "The capital",
    title: "Investors & corp dev",
    line: "VCs · institutional · corp dev",
    body: "They come for signal — first look at 120+ vetted companies before the decks circulate. We sell them edge: next year's theses, sourced in hallway conversations no Zoom can replace.",
  },
];

const sequence = [
  {
    week: "Week −8",
    phase: "The thesis",
    subject: "The Age of Intelligence — before it's public",
    body: [
      "[First] — one note before invitations go out.",
      "This year the Summit has a single throughline: enterprise AI has left the lab. John Chambers is coming to talk about steering a company through it. So is the CEO of FedEx.",
      "No ask yet. I just wanted you on the list of people who hear it first.",
    ],
    note: "No ask. Status, not a sale — they're on the inside now.",
  },
  {
    week: "Week −6",
    phase: "The proof",
    subject: "What Goldman's CIO is doing with digital co-workers",
    body: [
      "Marco Argenti runs technology for Goldman Sachs. He's deploying AI “digital co-workers” across the firm — and he's walking through exactly how, on stage, at the Summit.",
      "This is the session your team will ask you about. Two days, 180 speakers, one room in Santa Monica.",
      "Want me to hold a seat while they last?",
    ],
    note: "One concrete, name-brand proof point. The soft ask rides on FOMO, not pressure.",
  },
  {
    week: "Week −4",
    phase: "The peers",
    subject: "You'll know half the room",
    body: [
      "What people underestimate about the Summit is who's actually there — 1,200 leaders, invitation-only, most of whom come back year after year. As one put it: the people who keep returning are the people you can trust.",
      "[Peer] and [Peer] have already confirmed. You belong in that room.",
      "Say the word and it's done.",
    ],
    note: "Trust + peers. Their own words do the selling.",
  },
  {
    week: "Week −2",
    phase: "The personal",
    subject: "Held a seat for you, [First]",
    body: [
      "I set one aside. The Fairmont Miramar fills up, and I'd rather you have it than not.",
      "If it helps, I'll pre-book two or three one-on-ones before you land — tell me who you want in front of and I'll make the introductions.",
      "Just need a yes.",
    ],
    note: "One-to-one. Brokering the meetings is the real value — and it's personal.",
  },
  {
    week: "Week −1",
    phase: "Last call",
    subject: "Doors close Friday",
    body: [
      "Final call, [First]. We cap the room at 1,200 to keep it intimate — and we're nearly there.",
      "This is the last note I'll send. I'd hate for you to hear about it Monday from someone who went.",
      "March 9–10, Santa Monica. In or out?",
    ],
    note: "Scarcity + a clean binary. Easy yes, expensive no.",
  },
];

/* ============ PART 2 — THE PROOF ============ */

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
    out: "Rebrand + onboarding overhaul → −35% drop-off · content pipeline feeding inbound to sales",
    href: "https://www.globenewswire.com/news-release/2024/12/05/2992635/0/en/Devolved-AI-Announces-Strategic-Partnership-with-GDA-Capital-to-Revolutionize-Blockchain-Powered-AI-Solutions.html",
  },
  {
    co: "NEAR",
    name: "Four product launches + the paid & landing-page testing system",
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
  {
    co: "Devolved AI",
    desc: "Institutional AI: how Olympus redefines data sovereignty for enterprises",
    href: "https://www.devolvedai.com/posts/03-llm-instances-and-institutional-ai",
  },
];

export default function MarchPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navBack}>&larr; Home</Link>
        <span className={styles.navTitle}>For March Capital</span>
        <span className={styles.navNote}>Private · for Madeline Pope</span>
      </nav>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>The right heads in the room.</h1>
          <p className={styles.lede}>
            Madeline — the Summit doesn&apos;t need a bigger list. It needs the{" "}
            <em>right people, reached the right way</em> — a run-up that makes them
            feel late to something that matters. Here&apos;s the engine I&apos;d build
            for that, and the proof I&apos;ve built engines like it before.
          </p>
        </section>

        {/* ============ PART 1 ============ */}
        <section className={styles.part}>
          <div className={styles.partHead}>
            <span className={styles.partKicker}>Part 01</span>
            <h2 className={styles.partTitle}>The Engine</h2>
            <p className={styles.partSub}>
              The workflow that puts the right heads in the room — and keeps them
              coming back.
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

          {/* the right heads */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>A</span>
            <h3 className={styles.sectionTitle}>The right heads</h3>
            <span className={styles.sectionSub}>Who each story gets built for.</span>
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
            <h3 className={styles.sectionTitle}>The sequence</h3>
            <span className={styles.sectionSub}>
              One arc, five touches, never the same ask twice.
            </span>
          </div>
          <p className={styles.seqIntro}>
            The Enterprise-CxO storyline — from &ldquo;you&apos;re an insider&rdquo;
            to &ldquo;you&apos;ll regret missing this.&rdquo; Built on this year&apos;s
            real program; copy is illustrative.
          </p>
          <div className={styles.sequence}>
            {sequence.map((e) => (
              <div key={e.week} className={styles.seqRow}>
                <div className={styles.seqWhen}>
                  <span className={styles.seqWeek}>{e.week}</span>
                  <span className={styles.seqPhase}>{e.phase}</span>
                </div>
                <div className={styles.email}>
                  <div className={styles.emailSubj}>
                    <span className={styles.emailSubjLabel}>Subject</span>
                    <span className={styles.emailSubjText}>{e.subject}</span>
                  </div>
                  <div className={styles.emailBody}>
                    {e.body.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className={styles.emailNote}>
                    <b>Why:</b> {e.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* the content engine */}
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>C</span>
            <h3 className={styles.sectionTitle}>The content engine</h3>
            <span className={styles.sectionSub}>
              The aura runs on content. This is the machine that makes it.
            </span>
          </div>
          <Clipper />
        </section>

        {/* ============ PART 2 ============ */}
        <section className={styles.part}>
          <div className={styles.partHead}>
            <span className={styles.partKicker}>Part 02</span>
            <h2 className={styles.partTitle}>The Proof</h2>
            <p className={styles.partSub}>
              Engines I&apos;ve already built — the rooms, the work I owned, and the
              words that moved people.
            </p>
          </div>

          <div className={styles.feature}>
            <span className={styles.featKicker}>Featured · live-event activation</span>
            <h3 className={styles.featTitle}>Proof of Memories</h3>
            <p className={styles.featSub}>NEAR × SailGP · deployed on-site at live race events</p>
            <p className={styles.featBody}>
              A digital onboarding campaign I created and produced with engineering
              and design, deployed at SailGP events to turn race-day fans into
              onboarded users on the spot. Built on NEAR&apos;s 5-second FastAuth
              wallet, it let mainstream fans collect a &ldquo;memory&rdquo; from the
              event with zero crypto friction — a proof-of-attendance moment that
              doubled as a live, observable onboarding funnel.
            </p>
            <p className={styles.featWhy}>
              <b>Why it&apos;s here:</b> the exact muscle this role needs — turning a
              live event into an instrumented growth moment, not just a party.
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
            <span className={styles.sectionSub}>End to end — strategy through execution.</span>
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
            <span className={styles.sectionSub}>Copy that carried the launch.</span>
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
