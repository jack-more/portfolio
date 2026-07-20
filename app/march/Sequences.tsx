"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Touch = { week: string; phase: string; subject: string };
type Tier = { tier: string; who: string; touch: string };
type Track = {
  key: string;
  label: string;
  caption: string;
  tiers: Tier[];
  touches: Touch[];
};

const tracks: Track[] = [
  {
    key: "buyers",
    label: "Bucket 1 (Buyers)",
    caption: "Enterprise CxOs who evaluate and approve AI spend.",
    tiers: [
      { tier: "Tier 1", who: "Named F500 CIO / CISO targets", touch: "Partner-signed, fully personal" },
      { tier: "Tier 2", who: "Warm buyers via portfolio & network", touch: "Semi-personal, hand-tuned" },
      { tier: "Tier 3", who: "Broader qualified CxO list", touch: "Templated, lightly personalized" },
    ],
    touches: [
      { week: "Week −8", phase: "Context", subject: "A quiet heads-up on this year's Summit" },
      { week: "Week −6", phase: "Room", subject: "Who you'd be sitting with" },
      { week: "Week −4", phase: "Relationships", subject: "A few people worth meeting" },
      { week: "Week −2", phase: "Access", subject: "Your two days, arranged" },
      { week: "Week −1", phase: "Confirm", subject: "Holding your place" },
    ],
  },
  {
    key: "builders",
    label: "Bucket 2 (Founders)",
    caption: "Growth-stage founders who need buyers and capital.",
    tiers: [
      { tier: "Tier 1", who: "Portfolio + top sourcing targets", touch: "Presenting slot, white-glove" },
      { tier: "Tier 2", who: "In-thesis growth-stage founders", touch: "Meetings pre-booked" },
      { tier: "Tier 3", who: "Open founder applications", touch: "Standard invite" },
    ],
    touches: [
      { week: "Week −8", phase: "Context", subject: "Ahead of this year's Summit" },
      { week: "Week −6", phase: "Room", subject: "Who's in the room" },
      { week: "Week −4", phase: "Stage", subject: "A place on the stage, if you want it" },
      { week: "Week −2", phase: "Meetings", subject: "Your meetings, set up in advance" },
      { week: "Week −1", phase: "Confirm", subject: "Holding your place" },
    ],
  },
  {
    key: "lps",
    label: "Bucket 3 (LPs)",
    caption: "Limited partners who want portfolio access and partner time.",
    tiers: [
      { tier: "Tier 1", who: "Current LPs + anchor prospects", touch: "Partner-hosted, bespoke" },
      { tier: "Tier 2", who: "Prospective institutional allocators", touch: "Curated, personal" },
      { tier: "Tier 3", who: "Broader allocator network", touch: "Standard invite" },
    ],
    touches: [
      { week: "Week −8", phase: "Context", subject: "Two days with the portfolio" },
      { week: "Week −6", phase: "Portfolio", subject: "Your companies, on stage" },
      { week: "Week −4", phase: "Peers", subject: "Who else will be there" },
      { week: "Week −2", phase: "Access", subject: "Time with the partners, arranged" },
      { week: "Week −1", phase: "Confirm", subject: "Keeping your place" },
    ],
  },
  {
    key: "coinvestors",
    label: "Bucket 4 (Co-investors)",
    caption: "VCs and syndicate partners who want early dealflow.",
    tiers: [
      { tier: "Tier 1", who: "Active co-lead funds", touch: "Personal, deals flagged" },
      { tier: "Tier 2", who: "In-thesis funds", touch: "Shortlist shared" },
      { tier: "Tier 3", who: "Broader VC list", touch: "Standard invite" },
    ],
    touches: [
      { week: "Week −8", phase: "Context", subject: "Ahead of the Summit" },
      { week: "Week −6", phase: "Cohort", subject: "This year's cohort" },
      { week: "Week −4", phase: "Dealflow", subject: "A shortlist for your thesis" },
      { week: "Week −2", phase: "Intros", subject: "Intros before you arrive" },
      { week: "Week −1", phase: "Confirm", subject: "Holding your place" },
    ],
  },
  {
    key: "strategics",
    label: "Bucket 5 (Strategics)",
    caption: "Corporate development and acquirers scanning for M&A.",
    tiers: [
      { tier: "Tier 1", who: "Acquirers circling the portfolio", touch: "Bespoke, direct" },
      { tier: "Tier 2", who: "Adjacent-category strategics", touch: "Roadmap-matched" },
      { tier: "Tier 3", who: "Broader corp dev list", touch: "Standard invite" },
    ],
    touches: [
      { week: "Week −8", phase: "Context", subject: "Ahead of the Summit" },
      { week: "Week −6", phase: "Cohort", subject: "This year's cohort" },
      { week: "Week −4", phase: "Pipeline", subject: "A shortlist for your roadmap" },
      { week: "Week −2", phase: "Intros", subject: "Intros before you arrive" },
      { week: "Week −1", phase: "Confirm", subject: "Holding your place" },
    ],
  },
];

export default function Sequences() {
  const [active, setActive] = useState("buyers");
  const track = tracks.find((t) => t.key === active) ?? tracks[0];

  return (
    <>
      <div className={styles.seqTabs}>
        {tracks.map((t) => (
          <button
            key={t.key}
            className={t.key === active ? styles.seqTabActive : styles.seqTab}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className={styles.seqCaption}>{track.caption}</p>

      <div className={styles.tierStrip}>
        {track.tiers.map((t) => (
          <div key={t.tier} className={styles.tier}>
            <span className={styles.tierLabel}>{t.tier}</span>
            <p className={styles.tierWho}>{t.who}</p>
            <p className={styles.tierTouch}>{t.touch}</p>
          </div>
        ))}
      </div>
      <p className={styles.tierNote}>
        Subject-line cadence below is the Tier 1 version. Lower tiers compress it
        to fewer touches.
      </p>

      <div className={styles.sequence}>
        {track.touches.map((e) => (
          <div key={e.week} className={styles.seqRow}>
            <div className={styles.seqWhen}>
              <span className={styles.seqWeek}>{e.week}</span>
              <span className={styles.seqPhase}>{e.phase}</span>
            </div>
            <div className={styles.email}>
              <div className={styles.subjectOnly}>
                <span className={styles.emailSubjLabel}>Subject</span>
                <span className={styles.emailSubjText}>{e.subject}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
