"use client";

import { useState } from "react";
import GridCanvas from "./components/GridCanvas";
import DraggableCard from "./components/DraggableCard";
import MusicCard from "./components/MusicCard";
import GazePortrait from "./components/GazePortrait";

type Media =
  | { kind: "mp4"; src: string; poster: string; cap: string; wide?: boolean }
  | { kind: "yt"; id: string; cap: string }
  | { kind: "img"; src: string; cap: string };

type WorkItem = {
  company: string;
  desc: string;
  href: string;
  tags?: string[];
  market?: string;
  owned?: string;
  summary?: string;
  media?: Media[];
  details?: string[];
  clients?: WorkItem[];
  open?: boolean;
};

const mp4 = (f: string, cap: string, wide = false): Media => ({ kind: "mp4", src: `/reel/${f}.mp4`, poster: `/reel/${f}.jpg`, cap, wide });

const work: WorkItem[] = [
  {
    company: "Ballast Research",
    desc: "Founder. Growth, paid media and research for brands ready to scale",
    href: "https://ballast.la/",
    details: [
      "Founded Ballast Research LLC in Los Angeles, 2026",
      "Engagements from audits and sprints to fractional leadership and full media runs",
    ],
    clients: [
      {
        company: "DTC wellness brand",
        desc: "Head of Performance Marketing",
        href: "https://skocompounds.com/",
        tags: ["Paid", "Creative", "Growth"],
        open: true,
        owned: "All paid media budget and buying on Meta, TikTok and Google; the creative testing system; a 30+ creator program; order-level tracking; Klaviyo lifecycle email; TikTok LIVE selling.",
        summary:
          "Took the brand from under $10K to $1.2M+ in monthly sales on Meta, TikTok and Google on up to $100K a month in spend, holding new-customer CAC to $50 on a $220 AOV. Shipped 500 to 1,000 ads a month across UGC creators, AI and branded content, and judged every one at day 7 on hold rate, watch time and sales. Built order-level tracking reconciled weekly against invoices, lifecycle email that brought about two-thirds of revenue from repeat buyers, and TikTok LIVE selling at $5K a day.",
        media: [
          mp4("v3g", "Brand film", true),
          mp4("eyepocalypse", "EYEpocalypse"),
          mp4("2ndor1st", "2nd or 1st"),
          mp4("sophie35k", "Creator, 35K orders"),
          mp4("hightech", "High-tech"),
          mp4("dna", "Rotating DNA"),
        ],
      },
      {
        company: "History of the Game",
        desc: "Brand for Baron Davis's basketball media house",
        href: "https://ballast.la/",
        tags: ["Design"],
        open: true,
        owned: "Identity, the live show graphics package and the merch line.",
        summary:
          "Identity, live show graphics and merch for a basketball media house built with retired players and the sharpest clip editors online. One flower-and-ball mark that carries from the broadcast package to a game-night seal, tees, shorts and loafers.",
        media: [
          { kind: "mp4", src: "/reel/hotg-live.mp4", poster: "/reel/hotg-live.webp", cap: "Live show graphics", wide: true },
          { kind: "img", src: "/reel/hotg/seal-knicks-pacers.png", cap: "Knicks vs Pacers seal" },
          { kind: "img", src: "/reel/hotg/tee-hotg.webp", cap: "hotg tee" },
          { kind: "img", src: "/reel/hotg/loafers.webp", cap: "Loafers" },
          { kind: "img", src: "/reel/hotg/shorts-teal.webp", cap: "Mesh shorts" },
        ],
      },
    ],
  },
  {
    company: "Incubella",
    desc: "Growth advisory and embedded client GTM",
    href: "https://www.incubella.co/",
    details: [
      "Partner at a growth advisory firm building go-to-market systems for early-stage clients",
      "AI-assisted workflows for campaign research, creative iteration, landing pages and reporting",
    ],
    clients: [
      {
        company: "Devolved AI",
        desc: "Embedded marketing lead for a private AI platform",
        href: "https://www.incubella.co/",
        tags: ["Paid", "Creative", "Growth"],
        owned: "Positioning, messaging, launch, the LinkedIn and content pipeline, and onboarding email.",
        summary:
          "Owned positioning, messaging and launch for enterprise users. Built a LinkedIn and content pipeline that booked 150+ demos for sales at a $22 cost per lead, and rebuilt onboarding and lifecycle emails to cut drop-off 35%.",
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
    desc: "$25M+ in paid media at a 2.5% average CTR",
    href: "https://www.iheartmedia.com/",
    details: [
      "Ran 5+ concurrent clients across Meta, Snapchat, X and programmatic",
      "Built creative testing and bid optimization that improved ROAS 25%+ quarter over quarter",
    ],
    clients: [
      {
        company: "Toyota",
        desc: "Paid media",
        href: "https://www.iheartmedia.com/",
        tags: ["Paid"],
        market: "African American and Asian American audiences",
        owned: "Planning, buying and optimization by audience, with creative versions matched to each segment.",
        summary:
          "Multicultural campaigns for Toyota's 4Runner, Tacoma, Camry and Corolla launches, planned and bought per audience rather than per model, with creative versions matched to each segment.",
        media: [{ kind: "yt", id: "Y_IuBEtfzGM", cap: "4Runner" }],
      },
      {
        company: "Starbucks",
        desc: "Paid media",
        href: "https://www.iheartmedia.com/",
        tags: ["Paid"],
        market: "Pacific Northwest",
        owned: "Regional planning, buying and week-to-week optimization.",
        summary: "Regional campaigns across the Pacific Northwest, including the holiday season, bought and optimized week to week against store traffic.",
        media: [{ kind: "yt", id: "jtJ_DbPYnrU", cap: "Holidays" }],
      },
      {
        company: "STARZPLAY",
        desc: "Paid media",
        href: "https://www.iheartmedia.com/",
        tags: ["Paid"],
        market: "International",
        owned: "Launch planning, buying and optimization toward subscriptions across markets.",
        summary: "Series launches for STARZPLAY across international markets, from Raising Kanan to BMF and Heels, optimized toward subscriptions.",
        media: [{ kind: "yt", id: "JSpUNWjQk6c", cap: "Raising Kanan" }],
      },
    ],
  },
  {
    company: "NEAR",
    desc: "Marketing for NEAR Tasks, an AI training-data marketplace",
    href: "https://near.org/",
    tags: ["Growth"],
    owned: "Paid, SEO, content and community; landing-page testing; four product launches; the onboarding flow with engineering and design.",
    summary:
      "Grew NEAR Tasks to 50K+ monthly users across paid, SEO, content and community. Cut CAC 60% and lifted landing-page conversion 140% through testing, led 4 product launches that each reached 15% adoption in their first quarter, and built an onboarding flow with engineering and design that SailGP adopted at its live race events.",
    media: [{ kind: "yt", id: "jr3UYpx8gVI", cap: "NEAR × SailGP" }],
  },
  {
    company: "Dtravel",
    desc: "Digital growth through an $8M Series A",
    href: "https://www.dtravel.com/",
    tags: ["Paid", "Creative", "Growth"],
    owned: "Content, community and paid acquisition, and the digital collectible program.",
    summary:
      "Grew a two-sided travel marketplace from zero to 12,000 users and 2,000+ property listings through content, community and paid at a 1.5%+ CTR, supporting the $8M Series A. Launched a digital collectible program that brought in $750K in new revenue.",
    media: [
      { kind: "yt", id: "h4Rb4tDK1GQ", cap: "SAGA" },
      { kind: "yt", id: "fSd9_ECe068", cap: "Bali, paid in crypto" },
      { kind: "yt", id: "w8_kSY_ABzg", cap: "Direct Stays" },
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
  { label: "Resume", action: "PDF", href: "/JackMorello_CV.pdf" },
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

function MediaItem({ m }: { m: Media }) {
  const [play, setPlay] = useState(false);
  if (m.kind === "img")
    return (
      <figure className="wm wm-sq">
        <img src={m.src} alt={m.cap} loading="lazy" decoding="async" />
        <figcaption>{m.cap}</figcaption>
      </figure>
    );
  if (m.kind === "mp4")
    return (
      <figure className={m.wide ? "wm wm-wide" : "wm wm-tall"}>
        <video src={m.src} poster={m.poster} muted loop playsInline autoPlay preload="metadata" />
        <figcaption>{m.cap}</figcaption>
      </figure>
    );
  return (
    <figure className="wm wm-wide">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${m.id}?autoplay=1&rel=0`}
          title={m.cap}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="wm-play" onClick={() => setPlay(true)} aria-label={`Play ${m.cap}`}>
          <img src={`/reel/yt/${m.id}.webp`} alt="" loading="lazy" decoding="async" />
          <span aria-hidden="true">&#9654;</span>
        </button>
      )}
      <figcaption>{m.cap}</figcaption>
    </figure>
  );
}

function WorkRow(item: WorkItem & { sub?: boolean }) {
  const { company, desc, href, tags, market, owned, summary, media, details, clients, sub = false } = item;
  const [open, setOpen] = useState(!!item.open);
  const hasBody = !!(summary || media?.length || details?.length);
  return (
    <div className={sub ? "work-row-wrapper work-row-sub" : "work-row-wrapper"}>
      <div className="row">
        <a href={href} target="_blank" rel="noopener noreferrer" className="row-left row-left-link">{company}</a>
        <span className="row-dash" />
        {tags?.length ? (
          <span className="row-right work-tags">{tags.join(" + ")}</span>
        ) : (
          <span className="row-right">{desc}</span>
        )}
        {hasBody && (
          <button
            className="row-expand"
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            title={open ? "Collapse" : "Expand"}
          >
            {open ? "(−)" : "(…)"}
          </button>
        )}
      </div>
      {open && (
        <div className="work-body">
          {tags?.length ? <p className="work-role">{desc}{market ? <> &middot; <b>Market:</b> {market}</> : null}</p> : null}
          {owned && <p className="work-owned"><b>Owned:</b> {owned}</p>}
          {summary && <p className="work-summary">{summary}</p>}
          {details?.length ? (
            <ul className="work-details">
              {details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : null}
          {media?.length ? (
            <div className="work-media">
              {media.map((m, i) => (
                <MediaItem key={i} m={m} />
              ))}
            </div>
          ) : null}
        </div>
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


function Subscribe() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    setBusy(true);
    try {
      const r = await fetch("https://ballast.la/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), company: data.get("company"), source: "jackmorello.com" }),
      });
      const d = await r.json().catch(() => ({}));
      setMsg(r.ok ? "You're in. First note lands this week." : d.error || "Something went wrong. Try again.");
      if (r.ok) f.reset();
    } catch {
      setMsg("Something went wrong. Try again.");
    }
    setBusy(false);
  }
  return (
    <form className="pitch-sub" onSubmit={onSubmit}>
      <label className="pitch-sub-label" htmlFor="sub-email">One note a week on what&apos;s actually working in paid media.</label>
      <div className="pitch-sub-row">
        <input id="sub-email" type="email" name="email" placeholder="you@company.com" required />
        <input className="pitch-hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button type="submit" disabled={busy}>Subscribe</button>
      </div>
      {msg && <p className="pitch-sub-msg" role="status">{msg}</p>}
    </form>
  );
}

const services = [
  {
    t: "Go-to-market",
    m: ["lg-g7-launch", "near-sailgp", "dtravel-stays"],
    d: "Positioning, offer and launch plan, set before the budget goes out.",
    p: "150+ demos at a $22 cost per lead for an enterprise AI platform",
  },
  {
    t: "Ads that convert",
    m: ["sko-hanna", "bmw-m5", "starbucks-holiday"],
    d: "Paid on Meta, TikTok and Google, with creative made at volume by UGC creators and AIGC.",
    p: "$1.2M+ a month in sales for a DTC brand",
  },
  {
    t: "A funnel that converts",
    m: ["dtravel-bali", "netflix-squidgame", "lg-v40"],
    d: "A landing page for each audience, offers that get tested, and email that brings buyers back.",
    p: "Landing-page conversion up 140% at NEAR Tasks",
  },
  {
    t: "Measurement you can trust",
    m: ["peacock-office", "universal-f9", "disney-endgame"],
    d: "Every sale tied to the ad that drove it and checked against real orders, so budget moves on what sold.",
    p: "Ad spend reconciled weekly against orders and invoices",
  },
  {
    t: "Agents that run on their own",
    m: ["starzplay-heels", "nbc-snl", "netflix-bridgerton"],
    d: "AI tools that handle the repeat work on a schedule: reporting, creative variations, budget checks.",
    p: "Built in-house tools that cut raw footage into 9:16 ads and block banned claims",
  },
];

function Pitch() {
  const stats = [
    { n: "$1.2M+", l: "a month in sales for one DTC client" },
    { n: "4x", l: "blended ROAS at $2M+ a month" },
    { n: "1,000+", l: "ads shipped" },
    { n: "$50M+", l: "in paid media managed" },
  ];
  return (
    <div className="pitch">
      <header className="mast">
        <div className="mast-top">
          <span>Jack Morello &middot; Ballast Research</span>
          <span>8+ years &middot; Los Angeles</span>
        </div>
        <h1 className="mast-h">Head of growth and<br className="mast-br" /> <em>performance marketing.</em></h1>
        <p className="mast-proof">$50M+ in paid media managed. $10K to $1.2M+ a month for a DTC brand.</p>
        <div className="mast-body">
          <div className="mast-text">
            <ul className="mast-list">
              <li>A go-to-market plan</li>
              <li>Ads that convert better</li>
              <li>A funnel that converts better</li>
              <li>Numbers you can actually trust</li>
              <li>Then, agents that run the work on their own</li>
            </ul>
            <p className="mast-dek">
              I build all of it, through{" "}
              <a href="https://ballast.la" target="_blank" rel="noopener noreferrer">Ballast Research</a>.
            </p>
            <div className="pitch-ctas">
              <a className="pitch-btn pitch-btn-solid" href="https://ballast.la/#book" target="_blank" rel="noopener noreferrer">Book a call</a>
              <a className="pitch-btn" href="#work">See the work</a>
              <a className="pitch-btn" href="/JackMorello_CV.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
            </div>
          </div>
          <figure className="mast-fig">
            <GazePortrait className="pitch-portrait" alt="Jack Morello" />
            <figcaption>Jack Morello, founder, Ballast Research</figcaption>
          </figure>
        </div>
      </header>
      <div className="pitch-stats">
        {stats.map((s) => (
          <div key={s.n}>
            <b>{s.n}</b>
            <span>{s.l}</span>
          </div>
        ))}
      </div>
      <p className="pitch-sec">What I help with</p>
      <ol className="svc">
        {services.map((s, i) => (
          <li key={s.t}>
            <span className="svc-n">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="svc-t">{s.t}</h2>
            <p className="svc-d">{s.d}</p>
            <a className="svc-m" href="https://ballast.la/#work" target="_blank" rel="noopener noreferrer" aria-label={`${s.t}: see the work on ballast.la`}>
              {s.m.map((id) => (
                <img key={id} src={`/thumbs/${id}.webp`} alt="" width={240} height={427} loading="lazy" decoding="async" />
              ))}
            </a>
            {s.p === "resume" ? (
              <a className="svc-p svc-link" href="/JackMorello_CV.pdf" target="_blank" rel="noopener noreferrer">See my resume &rarr;</a>
            ) : (
              <p className="svc-p">{s.p}</p>
            )}
          </li>
        ))}
      </ol>
      <p className="pitch-clients">
        <span>Past work for</span> Toyota &middot; Starbucks &middot; STARZPLAY &middot; Netflix &middot; Disney &middot; Peacock &middot; LG &middot; Twitter
      </p>
      <Subscribe />
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
          <DraggableCard title="Services">
            <Pitch />
          </DraggableCard>

          <DraggableCard title="Work">
            <span id="work" />
            <a href="/work" className="row-link">
              <div className="row">
                <span className="row-left">All ads</span>
                <span className="row-dash" />
                <span className="row-right">View</span>
              </div>
            </a>
            {work.map((w) => (
              <WorkRow key={w.company} {...w} />
            ))}
          </DraggableCard>

          <DraggableCard title="Jack Morello">
            <p>
              I&apos;m Jack, a growth and performance marketer with 8+ years in
              paid media. I run{" "}
              <a href="https://ballast.la" target="_blank" rel="noopener noreferrer">Ballast Research</a>,
              a growth and paid media firm in Los Angeles. Most recently I took a DTC
              wellness brand from under $10K to $1.2M+ a month in sales, with 500 to 1,000 ads
              a month, 30+ UGC creators running at once, and TikTok LIVE selling
              at $5K a day. Before that, $2M+ a month in paid media at 4x blended ROAS
              for Toyota, Starbucks and STARZPLAY, campaigns for Netflix, Disney, Peacock, LG and
              Twitter, plus three venture-backed startups built from zero.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Ballast is taking on new clients now. If you want this kind of growth,{" "}
              <a href="https://ballast.la/#book" target="_blank" rel="noopener noreferrer">book a call</a>.
            </p>
            <p style={{ marginTop: "0.75rem" }}>Based in Los Angeles.</p>
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
