'use client';

import Link from 'next/link';

const brands = [
  {
    name: 'Netflix',
    logo: '/images/netflix.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Managed content partnerships and coordinated weekly delivery of digital marketing assets for promotional campaigns. EPK.TV delivers over 1 million assets annually to 50,000+ media professionals worldwide.',
    campaigns: [
      {
        name: 'Bird Box Campaign Assets',
        description: 'Coordinated distribution of promotional content including trailers, B-roll, and press materials for the viral Netflix original film (December 2018).',
        media: null,
      },
      {
        name: 'The Irishman Press Kit',
        description: 'Managed digital asset distribution for Martin Scorsese\'s epic, including junket interviews and premiere footage (November 2019).',
        media: null,
      },
      {
        name: 'Stranger Things Season 3',
        description: 'Distributed marketing assets for the highly anticipated third season launch (July 2019).',
        media: null,
      },
    ],
  },
  {
    name: 'Disney+',
    logo: '/images/disneyplus.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Managed content partnerships during Disney+ launch period. EPK.TV was the designated distribution platform for Disney\'s promotional video content.',
    campaigns: [
      {
        name: 'D23 Expo 2019 Launch',
        description: 'Distributed B-roll, VNR, and sound bites from the official Disney+ announcement at D23 Expo ahead of the November 12, 2019 platform launch.',
        media: null,
      },
      {
        name: 'Frozen II Press Campaign',
        description: 'Coordinated digital asset distribution for the animated sequel release (November 2019).',
        media: null,
      },
    ],
  },
  {
    name: 'Sony Pictures',
    logo: '/images/sony-pictures-logo.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Managed content partnerships with Sony Pictures, coordinating delivery of digital marketing assets for theatrical releases.',
    campaigns: [
      {
        name: 'Venom Launch',
        description: 'Distributed promotional content for Sony\'s blockbuster anti-hero film (October 2018).',
        media: null,
      },
      {
        name: 'Spider-Man: Into the Spider-Verse',
        description: 'Managed press kit distribution for the Academy Award-winning animated feature (December 2018).',
        media: null,
      },
    ],
  },
  {
    name: 'Universal',
    logo: '/images/universal-logo.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Coordinated digital asset distribution through EPK.TV\'s dedicated Universal Pictures portal (universal.epk.tv).',
    campaigns: [
      {
        name: 'Us Press Campaign',
        description: 'Distributed promotional assets for Jordan Peele\'s horror film (March 2019).',
        media: null,
      },
      {
        name: 'Fast & Furious: Hobbs & Shaw',
        description: 'Managed press materials and B-roll distribution for the franchise spin-off (August 2019).',
        media: null,
      },
      {
        name: '1917 Awards Campaign',
        description: 'Coordinated press kit distribution for Sam Mendes\' war epic during awards season (December 2019).',
        media: null,
      },
    ],
  },
  {
    name: 'Peacock',
    logo: '/images/peacock-logo.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Supported NBCUniversal content distribution ahead of Peacock streaming service launch. Managed promotional materials for NBC properties.',
    campaigns: [
      {
        name: 'Peacock Pre-Launch',
        description: 'Coordinated promotional content distribution as NBCUniversal prepared for the April 2020 streaming service launch.',
        media: null,
      },
    ],
  },
  {
    name: 'Prime Video',
    logo: '/images/amazon-prime-video.png',
    role: 'EPK.TV — Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    description: 'Managed content distribution through EPK.TV\'s dedicated Amazon Prime Video portal (amazonprimevideo.epk.tv).',
    campaigns: [
      {
        name: 'The Boys Season 1',
        description: 'Distributed press materials for Amazon\'s breakout superhero series (July 2019).',
        media: null,
      },
      {
        name: 'Jack Ryan Season 2',
        description: 'Coordinated promotional asset distribution for the action thriller series (October 2019).',
        media: null,
      },
    ],
  },
  {
    name: 'Toyota',
    logo: '/images/toyota-logo.png',
    role: 'iHeartMedia — Paid Media Manager',
    period: 'Jan 2020 – Apr 2021',
    description: 'Executed paid media strategies for Toyota across Facebook, Instagram, Twitter, and Snapchat. Implemented bidding strategies and campaign optimizations to maximize return on ad spend.',
    campaigns: [
      {
        name: 'Programmatic Advertising',
        description: 'Managed programmatic advertising campaigns across digital platforms. Delivered strategic insights and performance analysis to guide media planning and budget allocation.',
        media: null,
      },
      {
        name: 'SmartAudio Campaign Integration',
        description: 'Leveraged iHeartMedia\'s SmartAudio technology for broadcast-to-digital retargeting through multi-touch and sequential messaging.',
        media: null,
      },
    ],
  },
  {
    name: 'Starbucks',
    logo: '/images/starbucks.png',
    role: 'iHeartMedia — Paid Media Manager',
    period: 'Jan 2020 – Apr 2021',
    description: 'Managed programmatic advertising campaigns for Starbucks across digital platforms. Delivered strategic insights and performance analysis to guide media planning.',
    campaigns: [
      {
        name: 'Digital Media Campaigns',
        description: 'Executed paid social strategies across Facebook, Instagram, Twitter, and Snapchat. Maintained relationships with key stakeholders ensuring campaign objectives aligned with marketing goals.',
        media: null,
      },
    ],
  },
];

export default function PaidMediaPage() {
  return (
    <div className="work-page" style={{ backgroundColor: '#7AD0EF', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid black',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem' }}>Jack Morello</div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          ← Back
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        padding: '4rem 2rem',
        borderBottom: '1px solid black',
        backgroundColor: '#7AD0EF',
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>
            Paid Media Management
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
          }}>
            Managed paid media and marketing campaigns across Netflix, Disney, Sony, Toyota, and Starbucks.
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, opacity: 0.9, maxWidth: '600px' }}>
            At EPK.TV, managed content partnerships with 20+ major studios delivering marketing assets to 50,000+ media professionals. At iHeartMedia, executed programmatic advertising campaigns for entertainment and automotive clients.
          </p>
        </div>
      </section>

      {/* Brands */}
      <section style={{ padding: '2rem' }}>
        {brands.map((brand) => (
          <div
            key={brand.name}
            style={{
              backgroundColor: 'white',
              border: '1px solid black',
              marginBottom: '2rem',
              borderRadius: '0',
            }}
          >
            {/* Brand Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              padding: '2rem',
              borderBottom: '1px solid black',
              flexWrap: 'wrap',
            }}>
              <img
                src={brand.logo}
                alt={brand.name}
                style={{ height: '50px', objectFit: 'contain' }}
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>{brand.name}</h2>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{brand.role}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{brand.period}</div>
              </div>
            </div>

            {/* Brand Description */}
            <div style={{ padding: '2rem', borderBottom: '1px solid black' }}>
              <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>{brand.description}</p>
            </div>

            {/* Campaigns */}
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.6 }}>
                Campaigns
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}>
                {brand.campaigns.map((campaign, cIndex) => (
                  <div
                    key={cIndex}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {campaign.media ? (
                      <img
                        src={campaign.media}
                        alt={campaign.name}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        height: '120px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '0.875rem',
                      }}>
                        Campaign media
                      </div>
                    )}
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {campaign.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#666' }}>
                        {campaign.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid black',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          ← Back to Home
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/work/full-stack" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Full Stack Marketing →
          </Link>
          <Link href="/work/creative" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Creative Strategy →
          </Link>
        </div>
      </footer>
    </div>
  );
}
