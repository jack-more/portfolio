"use client";

import Image from "next/image";
import { useState } from "react";
import GridCanvas from "./components/GridCanvas";
import DraggableCard from "./components/DraggableCard";
import MusicCard from "./components/MusicCard";

const work = [
  {
    company: "iHeartMedia (Unified)",
    desc: "Paid media for Toyota, Starzplay, Starbucks",
    href: "https://www.iheartmedia.com/",
    details: [
      "Managed $200K-$400K/mo across 5+ concurrent accounts",
      "Built creative testing framework that drove 25%+ ROAS lift QoQ",
      "Day-to-day client lead for Toyota and Starzplay",
      "Campaigns across Meta, Snapchat, Twitter, programmatic DSPs",
    ],
  },
  {
    company: "NEAR",
    desc: "Growth marketing: 0 to 50k+ MAU in 18 months",
    href: "https://near.org/",
    details: [
      "One of the first marketing hires, built function from zero",
      "Contributed to $1.8M+ in platform GMV",
      "Cut CAC by 60%, improved conversion by 140% via A/B testing",
      "Led GTM for 4 major product launches",
    ],
  },
  {
    company: "Dtravel",
    desc: "Digital growth through $8M Series A",
    href: "https://www.dtravel.com/",
    details: [
      "Grew social from 7K to 55K+ organically",
      "Built host onboarding funnel: 2,000+ property listings",
      "Digital collectible program generated $750K revenue",
    ],
  },
  {
    company: "Devolved AI",
    desc: "AI agent marketing: >100M mc scaled",
    href: "https://www.devolvedai.com/",
    details: [
      "Led full company rebrand and market positioning",
      "Streamlined onboarding, reducing drop-off by 35%",
      "Built inbound content pipeline across LinkedIn and industry pubs",
    ],
  },
  {
    company: "EPK.TV",
    desc: "Digital campaigns for Disney, Netflix, Sony, NBC",
    href: "https://www.epk.tv/",
    details: [
      "Coordinated digital asset distribution across 20+ studios",
      "Disney, Amazon, Sony, NBC, Netflix campaigns",
      "Streamlined content delivery workflows",
    ],
  },
  {
    company: "24/7 Laundry Service",
    desc: "Social for LG Mobile, Twitter, Jordan Brand",
    href: "https://247laundryservice.com/",
    details: [
      "Social content and engagement for LG Mobile, Twitter, Jordan Brand",
      "Analyzed performance data to optimize content strategy",
    ],
  },
];

const online = [
  { label: "LinkedIn", action: "Connect", href: "https://www.linkedin.com/in/jackmorello" },
  { label: "Email", action: "Send", href: "mailto:jaidanmorello@gmail.com" },
  { label: "Instagram", action: "Follow", href: "https://instagram.com/jackmorello" },
  { label: "GitHub", action: "View", href: "https://github.com/jack-more" },
  { label: "Morello Sims", action: "Visit", href: "https://morellosims.com" },
  { label: "Cribs.fun", action: "Visit", href: "https://cribs.fun" },
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

function WorkRow({ company, desc, href, details }: {
  company: string; desc: string; href: string; details: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="work-row-wrapper">
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
              Hey, I&apos;m Jack! I&apos;ve spent the last 8 years doing paid
              media and growth marketing on the agency side at iHeartMedia and
              Laundry Service before going in-house to build marketing
              from scratch at three venture-backed startups with massive growth.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              I&apos;m based in Los Angeles. If you have something interesting
              or just want to say hi, I love to meet people online!{" "}
              <a href="mailto:jaidanmorello@gmail.com">Start a chat with me</a>.
            </p>
          </DraggableCard>

          <DraggableCard title="Work">
            {work.map((w) => (
              <WorkRow
                key={w.company}
                company={w.company}
                desc={w.desc}
                href={w.href}
                details={w.details}
              />
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
