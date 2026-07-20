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
type Track = { key: string; label: string; caption: string; touches: Touch[] };

const tracks: Track[] = [
  {
    key: "buyers",
    label: "Bucket 1 (Buyers)",
    caption: "Enterprise CxOs — the buyers. They attend to see how their peers deploy AI.",
    touches: [
      {
        week: "Week −8",
        phase: "The thesis",
        subject: "The Age of Intelligence — before it's public",
        body: [
          "[First] — one note before invitations go out.",
          "This year the Summit has a single throughline: enterprise AI has left the lab. John Chambers is coming to talk about steering a company through it. So is the CEO of FedEx.",
          "No ask yet. I just wanted you on the list of people who hear it first.",
        ],
        note: "Opens with information and no request, which establishes insider access.",
      },
      {
        week: "Week −6",
        phase: "The proof",
        subject: "What Goldman's CIO is doing with digital co-workers",
        body: [
          "Marco Argenti runs technology for Goldman Sachs. He's deploying AI “digital co-workers” across the firm, and he's walking through exactly how, on stage, at the Summit.",
          "This is the session your team will ask you about. Two days, 180 speakers, one room in Santa Monica.",
          "Want me to hold a seat while they last?",
        ],
        note: "Leads with one concrete, named session. The ask is soft and optional.",
      },
      {
        week: "Week −4",
        phase: "The peers",
        subject: "You'll know half the room",
        body: [
          "The Summit is 1,200 leaders, invitation-only, most of whom return year after year.",
          "[Peer] and [Peer] have already confirmed. You belong in that room.",
          "Say the word and it's done.",
        ],
        note: "Uses peer confirmation and the community's own language.",
      },
      {
        week: "Week −2",
        phase: "The personal",
        subject: "Held a seat for you, [First]",
        body: [
          "I set one aside. The Fairmont Miramar fills up, and I'd rather you have it.",
          "If it helps, I'll pre-book two or three one-on-ones before you land — tell me who you want in front of and I'll make the introductions.",
          "Just need a yes.",
        ],
        note: "Personal and one-to-one. The offer to broker meetings carries the value.",
      },
      {
        week: "Week −1",
        phase: "Last call",
        subject: "Doors close Friday",
        body: [
          "Final call, [First]. We cap the room at 1,200, and we're nearly there.",
          "This is the last note I'll send.",
          "March 9–10, Santa Monica. In or out?",
        ],
        note: "Closes on genuine scarcity and a single clear decision.",
      },
    ],
  },
  {
    key: "builders",
    label: "Bucket 2 (Founders)",
    caption: "Growth-stage founders — the builders. They attend for access to buyers and capital.",
    touches: [
      {
        week: "Week −8",
        phase: "The opportunity",
        subject: "The buyers you've been chasing, in one room",
        body: [
          "[First] — a note before applications open.",
          "The Summit puts 1,200 enterprise buyers, investors, and acquirers in one venue over two days. For a company at your stage, that is the shortest path to the people who decide.",
          "No ask yet. I wanted you to have the dates first.",
        ],
        note: "Leads with the core value for a founder: direct access to buyers.",
      },
      {
        week: "Week −6",
        phase: "The proof",
        subject: "Who's actually in the room",
        body: [
          "Last year's attendees included CIOs and heads of product from the Fortune 500, plus the investors who fund the next round.",
          "You would present alongside 120 vetted companies, in front of the people who can move your pipeline.",
          "Want me to hold a spot while they last?",
        ],
        note: "Concrete proof of who they would meet and present to.",
      },
      {
        week: "Week −4",
        phase: "The slot",
        subject: "A presenting slot, if you want it",
        body: [
          "There is room to put your company forward for the presenting cohort. It's a short application and I can walk it through.",
          "Presenting companies get a curated meeting schedule built for them before the event.",
          "Say the word and I'll start it.",
        ],
        note: "Turns attendance into a concrete outcome: stage time and booked meetings.",
      },
      {
        week: "Week −2",
        phase: "The personal",
        subject: "I'll line up your meetings, [First]",
        body: [
          "Tell me the five accounts and three investors you most want to meet.",
          "I'll pre-book those conversations before you land, so day one is already productive.",
          "Just need your list.",
        ],
        note: "Personal brokering. For a founder, booked meetings are the whole value.",
      },
      {
        week: "Week −1",
        phase: "Last call",
        subject: "Applications close Friday",
        body: [
          "Final call, [First]. Presenting slots and founder passes are nearly full.",
          "This is the last note I'll send.",
          "March 9–10, Santa Monica. In or out?",
        ],
        note: "Closes on scarcity and a single clear decision.",
      },
    ],
  },
  {
    key: "capital",
    label: "Bucket 3 (Investors)",
    caption: "Investors & corp dev — the capital. They attend for early signal and dealflow.",
    touches: [
      {
        week: "Week −8",
        phase: "The signal",
        subject: "First look at next year's breakout companies",
        body: [
          "[First] — one note before the guest list closes.",
          "The Summit presents 120+ vetted companies, most before their next round and before the decks circulate widely.",
          "No ask yet. I wanted you on the early list.",
        ],
        note: "Leads with the investor's edge: early, curated dealflow.",
      },
      {
        week: "Week −6",
        phase: "The proof",
        subject: "The caliber of this year's cohort",
        body: [
          "Past cohorts produced companies like CrowdStrike and Forter. This year leans into enterprise AI and cybersecurity.",
          "Two days, 180 speakers, and a room built for the conversations that source deals.",
          "Want me to reserve an investor pass?",
        ],
        note: "Proof of pipeline quality through named alumni and this year's focus.",
      },
      {
        week: "Week −4",
        phase: "The shortlist",
        subject: "A shortlist matched to your thesis",
        body: [
          "Send me your focus areas and check size.",
          "I'll put together a shortlist of presenting companies that fit, so you spend two days in the right rooms.",
          "Happy to prioritize whichever sectors you're leaning into.",
        ],
        note: "Personalized dealflow, matched to their thesis.",
      },
      {
        week: "Week −2",
        phase: "The personal",
        subject: "Curated intros before you land",
        body: [
          "From your shortlist, I'll pre-arrange meetings with the founders you want to see.",
          "Your schedule will be set before you arrive.",
          "Just confirm the list.",
        ],
        note: "Concrete, personalized introductions.",
      },
      {
        week: "Week −1",
        phase: "Last call",
        subject: "Investor passes close Friday",
        body: [
          "Final call, [First]. The investor allocation is nearly full.",
          "This is the last note I'll send.",
          "March 9–10, Santa Monica. In or out?",
        ],
        note: "Closes on scarcity and a single clear decision.",
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
