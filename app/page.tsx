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

const reading = [
  { title: "The Double and The Gambler", author: "Dostoevsky", href: "https://www.goodreads.com/book/show/5698.The_Double_and_The_Gambler" },
  { title: "Debt: The First 5,000 Years", author: "David Graeber", href: "https://www.goodreads.com/book/show/6617037-debt" },
  { title: "Breath", author: "James Nestor", href: "https://www.goodreads.com/book/show/48890486-breath" },
  { title: "The Boy Who Could Change the World", author: "Aaron Swartz", href: "https://www.goodreads.com/en/book/show/23258925-the-boy-who-could-change-the-world" },
  { title: "Harrison Bergeron", author: "Vonnegut", href: "https://www.goodreads.com/book/show/10176119-harrison-bergeron" },
  { title: "Machines Like Me", author: "Ian McEwan", href: "https://www.goodreads.com/book/show/42086795-machines-like-me" },
  { title: "The Road", author: "Cormac McCarthy", href: "https://www.goodreads.com/book/show/6288.The_Road" },
  { title: "Intelligence and Spirit", author: "Reza Negarestani", href: "https://www.goodreads.com/en/book/show/35218850-intelligence-and-spirit" },
  { title: "Fanged Noumena", author: "Nick Land", href: "https://www.goodreads.com/en/book/show/10838202-fanged-noumena" },
];

const articles = [
  { title: "Hitting Streaks Don't Obey Your Rules", source: "SABR", href: "https://sabr.org/journal/article/hitting-streaks-dont-obey-your-rules-evidence-that-hitting-streaks-arent-just-by-products-of-random-variation/" },
  { title: "RE24", source: "FanGraphs", href: "https://library.fangraphs.com/misc/re24/" },
  { title: "Nodal Points Digest #2: LLM Personas", source: "Substack", href: "https://poeticengineering.substack.com/p/nodal-points-digest-2-llm-personas" },
  { title: "The Fluid Mind and the Ever More Magical Future of Interfaces", source: "Substack", href: "https://poeticengineering.substack.com/p/the-fluid-mind-and-the-ever-more-magical-future-of-interfaces" },
];

const artwork = [
  { title: "Roma CT", note: "beautiful things happening" },
  { title: "GDP +10", note: "flags become paintings when nobody salutes" },
  { title: "Plane Post", note: "posts from the plane" },
  { title: "Breer", note: "longing" },
  { title: "Oceanic Plate", note: "brotherhood reveals itself in yellow pools" },
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

      {/* Illustration - not in a card, just floating */}
      <DraggableCard defaultX={35} defaultY={5} width={200}>
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

      {/* Music card */}
      <MusicCard defaultX={1065} defaultY={195} />

      {/* Bio card */}
      <DraggableCard title="Jack Morello" defaultX={35} defaultY={235} width={480}>
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

      {/* Work card */}
      <DraggableCard title="Work" defaultX={35} defaultY={460} width={500}>
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

      {/* Online card */}
      <DraggableCard title="Online" defaultX={960} defaultY={260} width={220}>
        {online.map((l) => (
          <Row key={l.label} left={l.label} right={l.action} href={l.href} />
        ))}
      </DraggableCard>

      {/* Misc card */}
      <DraggableCard title="Misc." defaultX={940} defaultY={440} width={300} maxHeight={300}>
        <h3 className="misc-heading">Recent Reads</h3>
        {reading.map((b) => (
          <Row key={b.title} left={b.title} right={b.author} href={b.href} />
        ))}
        <h3 className="misc-heading" style={{ marginTop: "0.75rem" }}>Articles</h3>
        {articles.map((a) => (
          <Row key={a.title} left={a.title} right={a.source} href={a.href} />
        ))}
        <h3 className="misc-heading" style={{ marginTop: "0.75rem" }}>Artwork</h3>
        {artwork.map((a) => (
          <Row key={a.title} left={a.title} right={a.note} href={`/artwork#${a.title.toLowerCase().replace(/\s+/g, "-").replace(/\+/g, "plus")}`} />
        ))}
      </DraggableCard>
    </>
  );
}
