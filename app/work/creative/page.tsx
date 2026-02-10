'use client';

import Link from 'next/link';

interface Campaign {
  name: string;
  description: string;
  media: string | null;
  results?: string[];
}

interface Brand {
  name: string;
  logo: string;
  role: string;
  period: string;
  description: string;
  campaigns: Campaign[];
}

const brands: Brand[] = [
  {
    name: 'X (Twitter)',
    logo: '/images/twitter-x-logo.png',
    role: 'Laundry Service — Copywriter & Social Media Manager',
    period: 'May 2017 – Dec 2017',
    description: 'Developed social media copy and engagement strategies for Twitter\'s corporate channels. Maintained consistent brand messaging across multiple client accounts and social platforms.',
    campaigns: [
      {
        name: 'Corporate Social Strategy',
        description: 'Created engaging social content for Twitter\'s own corporate channels, developing brand voice and community engagement tactics during a pivotal growth period for the platform.',
        media: null,
      },
    ],
  },
  {
    name: 'BMW',
    logo: '/images/bmw.png',
    role: 'Laundry Service — Copywriter',
    period: 'May 2017 – Dec 2017',
    description: 'Laundry Service was named Social Media Agency of Record for BMW of North America in January 2017. Created copywriting for BMW campaigns, developing compelling brand narratives and marketing copy for their social presence.',
    campaigns: [
      {
        name: 'BMW Social AOR',
        description: 'Developed social media copywriting as part of Laundry Service\'s role as BMW of North America\'s Social Media Agency of Record, crafting premium brand messaging across platforms.',
        media: null,
      },
    ],
  },
  {
    name: 'LG Mobile',
    logo: '/images/lglogo.png',
    role: 'Laundry Service — Copywriter & Social Media Manager',
    period: 'May 2017 – Dec 2017',
    description: 'Developed social media copy and engagement strategies for LG Mobile. Contributed to campaigns that achieved 695 million impressions and 114 million engagements.',
    campaigns: [
      {
        name: 'LG V20 Launch Campaign',
        description: 'Multi-channel content initiative showcasing the V20\'s superior video capture capabilities. Featured influencer partnerships including skateboarder Ryan Sheckler, with all content shot exclusively on the device.',
        media: null,
        results: [
          '695 million impressions',
          '114 million engagements in 60 days',
          '15-point increase in product awareness',
          '70M+ video views',
          '300% increase in engagement rate',
        ],
      },
    ],
  },
  {
    name: 'Hint Water',
    logo: '/images/hint-water-logo.png',
    role: 'Laundry Service — Copywriter & Content Planning',
    period: 'May 2017 – Dec 2017',
    description: 'Led copywriting and content planning for Hint Water, developing brand voice and content strategies to drive engagement for the premium flavored water brand.',
    campaigns: [
      {
        name: 'Brand Content Strategy',
        description: 'Developed copywriting and content planning for Hint Water\'s social media presence, crafting messaging that emphasized the brand\'s all-natural, zero-sugar positioning.',
        media: null,
      },
    ],
  },
];

export default function CreativePage() {
  return (
    <div className="work-page" style={{ backgroundColor: '#FE6E0E', minHeight: '100vh' }}>
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
        backgroundColor: '#FE6E0E',
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>
            Creative & Brand Strategy
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
          }}>
            Brand strategy and copywriting for X/Twitter, BMW, LG Mobile, and premium brands.
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.5, opacity: 0.9, maxWidth: '600px' }}>
            At Laundry Service (ranked #9 on Ad Age's 2017 Agency A-List), I crafted social media content, developed brand voice, and managed engagement strategies for consumer technology and premium lifestyle brands.
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
                        height: '180px',
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
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#666', marginBottom: '1rem' }}>
                        {campaign.description}
                      </p>
                      {campaign.results && (
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }}>Results</div>
                          <ul style={{ fontSize: '0.8rem', color: '#333', margin: 0, paddingLeft: '1rem' }}>
                            {campaign.results.map((result, rIndex) => (
                              <li key={rIndex} style={{ marginBottom: '0.25rem' }}>{result}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
          <Link href="/work/full-stack" style={{ textDecoration: 'none', color: 'black', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Full Stack Marketing →
          </Link>
        </div>
      </footer>
    </div>
  );
}
