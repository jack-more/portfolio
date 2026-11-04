"use client";

import Image from "next/image";
import { useState } from "react";
import GridCanvas from "./components/GridCanvas";
import DraggableCard from "./components/DraggableCard";
import MusicCard from "./components/MusicCard";

type WorkItem = {
  company: string;
  desc: string;
  href: string;
  details: string[];
  clients?: WorkItem[];
};

const work: WorkItem[] = [
  {
    company: "Ballast Research",
    desc: "Founder. Growth, paid media and research for brands ready to scale",
    href: "https://ballast.la/",
    details: [
      "Founded Ballast Research LLC in Los Angeles, 2026",
      "Research first, so the budget goes on evidence, then distribution that is bought and built: paid media that reaches people now, owned channels that keep them",
      "Engagements from $3.5K to $100K: audits, sprints, fractional leadership and full media runs",
      "Built a loyalty economy for a DTC brand, and ticketing, live-event rewards and fan participation vouchers for SailGP",
    ],
    clients: [
      {
        company: "History of the Game",
        desc: "Basketball's greatest stories, told by the players who lived them",
        href: "https://ballast.la/",
        details: [
          "A media house built with retired players and the sharpest clip editors on the internet",
          "Players commission the edits, react to the cuts and own the channels",
          "Built by Ballast Research",
        ],
      },
      {
        company: "SKO",
        desc: "Head of Performance Marketing: $1.2M+ a month in sales",
        href: "https://skocompounds.com/",
        details: [
          "Ran all paid media across Meta, TikTok and Google: under $10K to $1.2M+ in monthly sales on up to $100K a month, at a peak 6x ROAS",
          "Split spend into influencer-audience and list-excluded prospecting campaigns to hold new-customer CAC to $50 on a $220 AOV",
          "Tested 500 to 1,000 ads a month across UGC creators, AIGC and branded content, judging every ad at day 7 on hold rate, watch time and sales",
          "Built order dashboards tracking every checkout to ad and ad set, reconciled weekly against orders and invoices",
          "Built Klaviyo lifecycle, loyalty and post-purchase flows; about two-thirds of revenue came from repeat buyers",
          "Set up TikTok LIVE selling at $5K in sales a day",
        ],
      },
    ],
  },
  {
    company: "Incubella",
    desc: "Growth advisory and embedded client GTM",
    href: "https://www.incubella.co/",
    details: [
      "Partner at growth advisory firm building GTM systems for early-stage clients",
      "AI-assisted workflows for campaign research, creative iteration, landing pages, reporting",
    ],
    clients: [
      {
        company: "Devolved AI",
        desc: "Embedded marketing lead for a private AI platform",
        href: "https://www.incubella.co/",
        details: [
          "Owned positioning, messaging and launch strategy for enterprise users",
          "Built a LinkedIn and content pipeline that booked 150+ demos for sales at a $22 cost per lead",
          "Rebuilt onboarding, brand and onboarding emails, cutting drop-off 35%",
        ],
      },
      {
        company: "Riskiiit",
        desc: "Telegram-led GTM for a crypto gaming app",
        href: "https://www.incubella.co/",
        details: [
          "Secured the client contract and built the early Telegram go-to-market plan",
          "Built a wallet cohort toolkit to find high-intent communities and creators",
        ],
      },
    ],
  },
  {
    company: "iHeartMedia (Unified)",
    desc: "Paid media for Toyota, Starzplay, Starbucks",
    href: "https://www.iheartmedia.com/",
    details: [
      "Managed $1M+ in paid media for Starbucks, Toyota and STARZPLAY, holding a 2.5% average CTR",
      "Ran multicultural (Toyota), regional (Starbucks Pacific Northwest) and international (STARZPLAY) campaigns for 5+ concurrent clients",
      "Built creative testing and bid optimization that improved ROAS 25%+ quarter over quarter",
      "Campaigns across Meta, Snapchat, X and programmatic DSPs",
    ],
  },
  {
    company: "NEAR",
    desc: "Marketing for NEAR Tasks, an AI training-data marketplace (50K+ MAU)",
    href: "https://near.org/",
    details: [
      "Grew NEAR Tasks, an AI training-data marketplace, to 50K+ MAU across paid, SEO, content and community",
      "Cut CAC 60% and lifted landing-page conversion 140% with paid-channel and landing-page A/B testing",
      "Led 4 product launches, each reaching 15% adoption among active users in its first quarter",
      "Built an onboarding experience with engineering and design that SailGP adopted at its live race events",
    ],
  },
  {
    company: "Dtravel",
    desc: "Digital growth through $8M Series A",
    href: "https://www.dtravel.com/",
    details: [
      "Grew a two-sided marketplace from 0 to 12,000 users and 2,000+ property listings through content, community and light paid (1.5%+ CTR)",
      "Supported the $8M Series A",
      "Created a digital collectible program that generated $750K in incremental revenue",
    ],
  },
  {
    company: "EPK.TV",
    desc: "Digital campaigns for Disney, Netflix, Sony, NBC",
    href: "https://www.epk.tv/",
    details: [
      "Organized and delivered all campaign content for 20+ studios across platforms, territories and languages",
      "Disney, Amazon, Sony, NBC and Netflix campaigns",
    ],
  },
  {
    company: "24/7 Laundry Service (Wasserman)",
    desc: "Social for LG Mobile, Twitter, Jordan Brand",
    href: "https://247laundryservice.com/",
    details: [
      "Social content and engagement for LG Mobile, Twitter, Jordan Brand",
      "Analyzed performance data to optimize content strategy",
    ],
  },
];

const online = [
  { label: "Book a call", action: "Pick a time", href: "https://ballast.la/#book" },
  { label: "Ballast", action: "Visit", href: "https://ballast.la" },
  { label: "LinkedIn", action: "Connect", href: "https://www.linkedin.com/in/jackmorello" },
  { label: "Email", action: "Send", href: "mailto:jack@ballast.la" },
  { label: "Instagram", action: "Follow", href: "https://instagram.com/jackmorello" },
  { label: "GitHub", action: "View", href: "https://github.com/jack-more" },
];

function Row({ left, right, href }: { left: string; right: string; href?: string }) {
  const content = (
    <div className="row">
      <span className="row-left">{left}</span>
      <span className="row-dash" />
      <span className="row-right">{right}</span>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="row-link">{content}</a>;
  return content;
}

function WorkRow({ company, desc, href, details, clients, sub = false }: WorkItem & { sub?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={sub ? "work-row-wrapper work-row-sub" : "work-row-wrapper"}>
      <div className="row">
        <a href={href} target="_blank" rel="noopener noreferrer" className="row-left row-left-link">{company}</a>
        <span className="row-dash" />
        <span className="row-right">{desc}</span>
        <button
          className="row-expand"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          title={open ? "Collapse" : "Expand"}
        >
          {open ? "(\u2212)" : "(\u2026)"}
        </button>
      </div>
      {open && (
        <ul className="work-details">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {clients && clients.length > 0 && (
        <div className="work-clients">
          {clients.map((c) => (
            <WorkRow key={c.company} {...c} sub />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <GridCanvas />

      <div className="layout">
        {/* Left column */}
        <div className="col-left">
          <DraggableCard width={200}>
            <div className="illustration-card">
              <Image
                src="/images/illustration-jack.png"
                alt="Jack Morello"
                width={180}
                height={180}
                className="illustration"
                priority
              />
            </div>
          </DraggableCard>

          <DraggableCard title="Jack Morello">
            <p>
              I&apos;m Jack. I run{" "}
              <a href="https://ballast.la" target="_blank" rel="noopener noreferrer">Ballast Research</a>,
              a growth and paid media firm in Los Angeles. Since June: $1.2M+ a month in sales
              for a health and wellness brand at a peak 6x ROAS, 500 to 1,000 ads
              a month, 30+ UGC creators running at once, and TikTok LIVE selling
              at $5K a day. Before that, eight years of paid media, promo and social
              for Toyota, Starbucks, STARZPLAY, Netflix, Disney, Peacock, LG and
              Twitter, plus three venture-backed startups built from zero.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Ballast is taking on new clients now. If you want this kind of growth,{" "}
              <a href="https://ballast.la/#book" target="_blank" rel="noopener noreferrer">book a call</a>.
            </p>
            <p style={{ marginTop: "0.75rem" }}>Based in Los Angeles.</p>
          </DraggableCard>

          <DraggableCard title="Work">
            <a href="/work" className="row-link">
              <div className="row">
                <span className="row-left">The ads</span>
                <span className="row-dash" />
                <span className="row-right">View</span>
              </div>
            </a>
            {work.map((w) => (
              <WorkRow key={w.company} {...w} />
            ))}
          </DraggableCard>
        </div>

        {/* Right column */}
        <div className="col-right">
          <MusicCard />

          <DraggableCard title="Online">
            {online.map((l) => (
              <Row key={l.label} left={l.label} right={l.action} href={l.href} />
            ))}
          </DraggableCard>

          <DraggableCard title="Misc.">
            <Row left="Recent Reads" right="View" href="/recentreads" />
            <Row left="Artwork" right="View" href="/artwork" />
          </DraggableCard>
        </div>
      </div>
    </>
  );
}
