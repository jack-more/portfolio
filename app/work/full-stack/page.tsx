'use client';

import Link from 'next/link';

const brands = [
  {
    name: 'Devolved AI',
    logo: '/images/DevolvedAI.png',
    role: 'Marketing Manager',
    period: 'Sep 2024 – Jun 2025',
    description: 'Led marketing strategy that scaled AI platform to $100M valuation. Developed comprehensive product positioning and launch strategy for AI agent platform serving enterprise and consumer markets. Oversaw complete company rebrand and market positioning.',
    campaigns: [
      {
        name: 'Secure Web App Launch',
        description: 'Led launch communications for "The Most Secure and Private AI Platform" featuring end-to-end encryption and Zero-Knowledge Proofs integration with Argochain.',
        media: null,
      },
      {
        name: 'GDA Capital Partnership',
        description: 'Managed strategic partnership announcement with GDA Capital, bringing Michael Gord as advisor. Distributed across GlobeNewswire, Manila Times, Tech Times, and major news outlets.',
        media: null,
      },
      {
        name: 'Next Top AI Agent Competition',
        description: 'World\'s largest virtual AI startup competition with $500K+ prize pool. Partnership with GDA Capital and Alpaca Network. March 2025 campaign reaching global AI developer community.',
        media: null,
      },
      {
        name: 'Argochain Mainnet Launch',
        description: 'Go-to-market strategy for proprietary Layer-1 blockchain launch (July 2024) and AGC token debut on MEXC exchange (August 2024).',
        media: null,
      },
    ],
  },
  {
    name: 'NEAR Tasks',
    logo: '/images/near-protocol.png',
    role: 'Head of Marketing',
    period: 'Apr 2022 – Jun 2024',
    description: 'Managed full marketing strategy for AI-powered task marketplace. Grew registered user base from launch to 12,000 users in 18 months. Contributed to $1.8M+ in platform transaction volume through strategic user engagement.',
    campaigns: [
      {
        name: 'NEARCON 2023 Beta Launch',
        description: 'Official product beta launched at NEARCON 2023. Built waitlist to 48,000+ applicants through strategic pre-launch marketing.',
        media: null,
      },
      {
        name: 'Consensus 2023 Debut',
        description: 'Platform debuted at Consensus 2023 in Austin. Achieved 40%+ conversion rate from event demo attendees to waitlist signups. 15+ businesses expressed interest with budgets ranging $500-$100,000.',
        media: null,
      },
      {
        name: '#EarnWithNEARTasks Social Campaign',
        description: 'User-generated content campaign where taskers share photos with NEAR logo on Twitter, driving organic awareness and community growth.',
        media: null,
      },
      {
        name: 'Alpha Test Program',
        description: 'Managed rollout of 122-person alpha test completing 3,000+ tasks. Outperformed parallel MTurk campaign by nearly 3x in quality scores.',
        media: null,
      },
    ],
  },
  {
    name: 'Dtravel',
    logo: '/images/Dtravel-logo.jpg',
    role: 'Head of Digital Growth',
    period: 'Apr 2021 – Apr 2022',
    description: 'Directed digital marketing strategy during Series A funding round. Scaled social media following from 7,000 to 55,000+ across platforms, supporting successful $8M Series A funding.',
    campaigns: [
      {
        name: 'TRVL Token Launch',
        description: 'Multi-platform token launch across MEXC Global, Bybit Launchpool, Gate.io Startup, and Polkastarter IDO. Over 60,000+ participants in pre-launch events.',
        media: null,
      },
      {
        name: '200K Listings in 30 Days',
        description: 'Host acquisition campaign achieving 200,000+ property listings across 2,000+ cities within first 30 days—120x faster than Airbnb\'s early growth rate.',
        media: null,
      },
      {
        name: 'Open Passport NFT Program',
        description: 'Launched blockchain-based travel passport allowing travelers to collect NFT stamps for completed bookings. Partnership with Travala.com.',
        media: null,
      },
      {
        name: 'Nite Protocol / NFT Bookings',
        description: 'First-of-its-kind system turning vacation rental bookings into transferable NFTs on Polygon. Enabled secure transfer or resale of bookings.',
        media: null,
      },
      {
        name: '10M TRVL Airdrop Campaign',
        description: 'Exclusive airdrop series for Travala.com Smart Program members. Drove community engagement and cross-platform user acquisition.',
        media: null,
      },
    ],
  },
  {
    name: 'Travala',
    logo: '/images/travala.png',
    role: 'Work done while at Dtravel',
    period: 'Apr 2021 – Apr 2022',
    description: 'Supported marketing initiatives for Travala as part of the Dtravel ecosystem partnership. Travala.com is a Binance-backed crypto travel booking platform.',
    campaigns: [
      {
        name: 'Dtravel-Travala Integration',
        description: 'Coordinated marketing for TRVL token integration enabling holders to book 2.2M+ hotels, 600+ airlines, and 400,000+ activities on Travala.com.',
        media: null,
      },
      {
        name: 'Smart Member Campaigns',
        description: 'Managed cross-promotional campaigns targeting Travala Smart Program members for Dtravel platform adoption.',
        media: null,
      },
    ],
  },
];

export default function FullStackPage() {
  return (
    <div className="work-page" style={{ backgroundColor: '#FDFE58', minHeight: '100vh' }}>
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
        backgroundColor: '#FDFE58',
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>
            Full Stack Marketing
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
          }}>
            Scaled over $500M in valuations across Devolved AI, Dtravel, and NEAR Tasks.
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, opacity: 0.9, maxWidth: '600px' }}>
            Led end-to-end marketing strategy for AI and Web3 startups—from go-to-market positioning and user acquisition to community building and product launches.
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
                Campaigns & Initiatives
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
          <Link href="/work/paid-media" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Paid Media →
          </Link>
          <Link href="/work/creative" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Creative Strategy →
          </Link>
        </div>
      </footer>
    </div>
  );
}
