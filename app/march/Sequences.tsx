"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Touch = {
  week: string;
  phase: string;
  subject: string;
  body: string[];
  note: string;
};
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
      {
        week: "Week −8",
        phase: "Context",
        subject: "A quiet heads-up on this year's Summit",
        body: [
          "[First] — a note before invitations go out.",
          "This year the conversation is enterprise AI in production: John Chambers on leading through it, the CEO of FedEx on rebuilding around it. The room is the operators actually doing the work.",
          "Nothing needed from you yet. I wanted you to have it early.",
        ],
        note: "Context and early access, with nothing required yet.",
      },
      {
        week: "Week −6",
        phase: "Room",
        subject: "Who you'd be sitting with",
        body: [
          "The value of these two days is the peer group — CIOs and CISOs comparing what's genuinely working, not what's on a slide.",
          "Marco Argenti will walk through how Goldman runs AI co-workers in production. Most of the learning happens in the conversations around it.",
          "Glad to keep you a place.",
        ],
        note: "Leads with peer presence and knowledge exchange.",
      },
      {
        week: "Week −4",
        phase: "Relationships",
        subject: "A few people worth meeting",
        body: [
          "Part of why people return is the relationships. [Peer] and [Peer] will be there, and a handful of others I think you'd want to know.",
          "If it's useful, I'll make those introductions before you arrive.",
        ],
        note: "Frames the room as relationships and warm introductions.",
      },
      {
        week: "Week −2",
        phase: "Access",
        subject: "Your two days, arranged",
        body: [
          "If you'd like, I'll set up a few conversations in advance so your time is well spent — tell me who you want to meet and I'll handle it.",
          "Your schedule can be ready before you land.",
        ],
        note: "Access made effortless; the scheduling is handled for them.",
      },
      {
        week: "Week −1",
        phase: "Confirm",
        subject: "Holding your place",
        body: [
          "The room fills up, and I've kept a place for you.",
          "Whenever you're ready, a word confirms it. March 9–10, Santa Monica.",
        ],
        note: "Assured and low-pressure — a place kept, confirmed at their pace.",
      },
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
      {
        week: "Week −8",
        phase: "Context",
        subject: "Ahead of this year's Summit",
        body: [
          "[First] — a note before applications open.",
          "For two days the room is enterprise buyers, investors, and the operators who become your next customers. It's the shortest distance between your company and the people who decide.",
          "Nothing needed yet — I wanted you to have the dates.",
        ],
        note: "Opens with the access a founder cares about, nothing required yet.",
      },
      {
        week: "Week −6",
        phase: "Room",
        subject: "Who's in the room",
        body: [
          "Last year that was CIOs and heads of product from the Fortune 500, alongside the investors funding the next round.",
          "You'd present among 120 companies chosen carefully, in front of people who can actually move things for you.",
          "Happy to keep you a spot.",
        ],
        note: "Concrete presence: who they would stand in front of.",
      },
      {
        week: "Week −4",
        phase: "Stage",
        subject: "A place on the stage, if you want it",
        body: [
          "There's room to put your company forward to present. It's a short process and I can carry it.",
          "Presenting founders get a schedule of the right meetings built for them.",
        ],
        note: "Turns presence into stage time, handled for them.",
      },
      {
        week: "Week −2",
        phase: "Meetings",
        subject: "Your meetings, set up in advance",
        body: [
          "Tell me the accounts and investors you most want in front of, and I'll arrange those conversations before you arrive.",
          "Day one can already be productive.",
        ],
        note: "Effortless access; the introductions are arranged for them.",
      },
      {
        week: "Week −1",
        phase: "Confirm",
        subject: "Holding your place",
        body: [
          "Founder places go quickly, and I've kept one for you.",
          "A word confirms it whenever you're ready. March 9–10, Santa Monica.",
        ],
        note: "Assured and low-pressure; a place kept.",
      },
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
      {
        week: "Week −8",
        phase: "Context",
        subject: "Two days with the portfolio",
        body: [
          "[First] — an early note before the list closes.",
          "This is where you can watch the companies you back present, and spend unhurried time with the team, well beyond a quarterly update.",
          "Nothing needed. I wanted to keep you a place.",
        ],
        note: "Leads with portfolio presence and partner time.",
      },
      {
        week: "Week −6",
        phase: "Portfolio",
        subject: "Your companies, on stage",
        body: [
          "Several of the fund's companies are presenting this year, among 120 others across enterprise AI and cybersecurity.",
          "You'd see them in front of buyers and read the market from 180 of the people shaping it.",
        ],
        note: "Their capital, visible and at work, plus a market read.",
      },
      {
        week: "Week −4",
        phase: "Peers",
        subject: "Who else will be there",
        body: [
          "Part of the value is the company you keep — other allocators who take this seriously.",
          "Glad to make a few introductions ahead of time.",
        ],
        note: "Peer allocators and relationships.",
      },
      {
        week: "Week −2",
        phase: "Access",
        subject: "Time with the partners, arranged",
        body: [
          "If you'd like, I'll set aside time for you with the partners, and with any founders you want to hear from directly.",
          "Tell me who, and it's arranged.",
        ],
        note: "Partner and founder access, arranged for them.",
      },
      {
        week: "Week −1",
        phase: "Confirm",
        subject: "Keeping your place",
        body: [
          "The room is nearly set, and I've kept your place.",
          "A word confirms it. March 9–10, Santa Monica.",
        ],
        note: "Gracious and assured; a place kept.",
      },
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
      {
        week: "Week −8",
        phase: "Context",
        subject: "Ahead of the Summit",
        body: [
          "[First] — a note before the list closes.",
          "You'd see 120 vetted companies, most before their next round and before the decks go around.",
          "Nothing needed yet — I wanted you on it early.",
        ],
        note: "Early dealflow, framed as access.",
      },
      {
        week: "Week −6",
        phase: "Cohort",
        subject: "This year's cohort",
        body: [
          "Past years produced companies like CrowdStrike and Forter. This year leans into enterprise AI and cybersecurity.",
          "Two days among the people who source and build the next set.",
        ],
        note: "Proof of quality and the caliber of the room.",
      },
      {
        week: "Week −4",
        phase: "Dealflow",
        subject: "A shortlist for your thesis",
        body: [
          "Tell me your focus and check size, and I'll put together a shortlist of companies that fit — and flag anything we're co-leading.",
          "You'd spend two days in the right rooms.",
        ],
        note: "Curated, personal dealflow with a syndication hook.",
      },
      {
        week: "Week −2",
        phase: "Intros",
        subject: "Intros before you arrive",
        body: [
          "From your shortlist, I'll set up the founder meetings you want.",
          "Your time is arranged before you land.",
        ],
        note: "Effortless sourcing; the meetings are arranged.",
      },
      {
        week: "Week −1",
        phase: "Confirm",
        subject: "Holding your place",
        body: [
          "Investor places are nearly set, and yours is kept.",
          "A word confirms it. March 9–10, Santa Monica.",
        ],
        note: "Assured; a place kept.",
      },
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
      {
        week: "Week −8",
        phase: "Context",
        subject: "Ahead of the Summit",
        body: [
          "[First] — a note before the list closes.",
          "For a corp dev team, this is a curated view of 120 companies across enterprise AI and cybersecurity, most before they're widely known.",
          "Nothing needed yet — I wanted you on it early.",
        ],
        note: "Curated pipeline, framed as quiet access.",
      },
      {
        week: "Week −6",
        phase: "Cohort",
        subject: "This year's cohort",
        body: [
          "Past years produced companies like CrowdStrike and Forter. This year leans into enterprise AI and cybersecurity.",
          "The people building the categories you track will be in one room.",
        ],
        note: "Proof of relevance to their roadmap.",
      },
      {
        week: "Week −4",
        phase: "Pipeline",
        subject: "A shortlist for your roadmap",
        body: [
          "Tell me where you're building or buying, and I'll put together a shortlist of companies that fit.",
          "Your team meets the right ones.",
        ],
        note: "Pipeline matched to their strategy.",
      },
      {
        week: "Week −2",
        phase: "Intros",
        subject: "Intros before you arrive",
        body: [
          "From your shortlist, I'll set up meetings with the founders and partnership leads you want.",
          "Your schedule is ready before day one.",
        ],
        note: "Effortless access to targets.",
      },
      {
        week: "Week −1",
        phase: "Confirm",
        subject: "Holding your place",
        body: [
          "Strategic places are nearly set, and yours is kept.",
          "A word confirms it. March 9–10, Santa Monica.",
        ],
        note: "Assured; a place kept.",
      },
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
        Sequence below is the Tier 1 version. Lower tiers compress it to fewer,
        lighter touches.
      </p>

      <div className={styles.sequence}>
        {track.touches.map((e) => (
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
    </>
  );
}
