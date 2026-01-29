'use client';

import { useEffect, useState } from 'react';

// Brand data
const brandData = {
  paidMedia: [
    { name: 'Netflix', logo: '/images/netflix.png', url: 'https://netflix.com' },
    { name: 'Disney+', logo: '/images/disneyplus.png', url: 'https://disneyplus.com' },
    { name: 'Sony Pictures', logo: '/images/sony-pictures-logo.png', url: 'https://sonypictures.com' },
    { name: 'Universal', logo: '/images/universal-logo.png', url: 'https://universalpictures.com' },
    { name: 'Peacock', logo: '/images/peacock-logo.png', url: 'https://peacocktv.com' },
    { name: 'Prime Video', logo: '/images/amazon-prime-video.png', url: 'https://amazon.com/primevideo' },
    { name: 'Toyota', logo: '/images/toyota-logo.png', url: 'https://toyota.com' },
    { name: 'Starbucks', logo: '/images/starbucks.png', url: 'https://starbucks.com' },
  ],
  startupGrowth: [
    { name: 'Devolved AI', logo: '/images/DevolvedAI.png', url: 'https://devolved.ai' },
    { name: 'Dtravel', logo: '/images/Dtravel-logo.jpg', url: 'https://dtravel.com' },
    { name: 'NEAR Protocol', logo: '/images/near-protocol.png', url: 'https://near.org' },
    { name: 'Travala', logo: '/images/travala.png', url: 'https://travala.com' },
  ],
  creative: [
    { name: 'X (Twitter)', logo: '/images/twitter-x-logo.png', url: 'https://twitter.com' },
    { name: 'BMW', logo: '/images/bmw.png', url: 'https://bmw.com' },
    { name: 'LG', logo: '/images/lglogo.png', url: 'https://lg.com' },
    { name: 'Hint Water', logo: '/images/hint-water-logo.png', url: 'https://drinkhint.com' },
  ],
};

interface BrandModalProps {
  brands: Array<{ name: string; logo: string; url: string }>;
  isOpen: boolean;
  onClose: () => void;
  bgColor: string;
}

function BrandModal({ brands, isOpen, onClose, bgColor }: BrandModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        backgroundColor: bgColor,
        padding: '3rem',
        borderRadius: '0',
        border: '1px solid black',
        maxWidth: '900px',
        width: '100%',
        position: 'relative',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        {/* X Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          ×
        </button>

        {/* Brand Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
        }}>
          {brands.map((brand) => (
            <a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                border: 'none',
                background: '#ffffff',
                textDecoration: 'none',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                style={{
                  maxHeight: '50px',
                  maxWidth: '100px',
                  objectFit: 'contain',
                  filter: 'none',
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const listItems = document.querySelectorAll('.list-item');
    const columns = document.querySelectorAll('.column');

    listItems.forEach((item, index) => {
      const handleMouseEnter = () => {
        columns.forEach((col, colIndex) => {
          const column = col as HTMLElement;
          if (index !== colIndex) {
            column.style.opacity = '0.3';
          } else {
            column.style.transform = 'scale(1.02)';
            column.style.zIndex = '5';
            column.style.boxShadow = '0 0 50px rgba(0,0,0,0.2)';
          }
        });
      };

      const handleMouseLeave = () => {
        columns.forEach(col => {
          const column = col as HTMLElement;
          column.style.opacity = '1';
          column.style.transform = 'scale(1)';
          column.style.zIndex = '1';
          column.style.boxShadow = 'none';
        });
      };

      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <>
      <div className="viewport b-top b-bottom">
        <header className="b-bottom">
          <div className="brand">Jack Morello</div>
          <div className="nav-links">
            <div
              className="nav-item"
              onClick={() => window.open('https://www.linkedin.com/in/jackmorello/', '_blank')}
            >
              LINKEDIN
            </div>
            <div
              className="nav-item"
              onClick={() => window.location.href = 'mailto:jaidanmorello@gmail.com'}
            >
              CONTACT
            </div>
          </div>
          <div className="nav-item" style={{ fontSize: '1.5rem' }}>=</div>
        </header>

        <aside className="sidebar b-right">
          <div className="sidebar-header">
            <p style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
              Marketing executive specializing in growth strategy, paid media, and brand development across entertainment, tech, and consumer brands.
            </p>
          </div>
          <ul className="profile-list">
            <li className="list-item">
              <span>Startup Growth</span>
              <svg className="icon-mini" viewBox="0 0 100 100">
                <polygon points="30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30" fill="var(--c-yellow)"></polygon>
              </svg>
            </li>
            <li className="list-item">
              <span>Paid Media</span>
              <svg className="icon-mini" viewBox="0 0 100 100">
                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="var(--c-cyan)"></polygon>
              </svg>
            </li>
            <li className="list-item">
              <span>Creative Strategy</span>
              <svg className="icon-mini" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="var(--c-orange)"></circle>
                <rect x="0" y="45" width="100" height="10" fill="white"></rect>
              </svg>
            </li>
            <li className="list-item">
              <a
                href="https://cribs.fun/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <span>Cribs.Fun</span>
                <div style={{ fontSize: '1.5rem' }}>🏗️</div>
              </a>
            </li>
          </ul>
          <div
            className="sidebar-footer"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/JackMorello_CV.pdf';
              link.download = 'JackMorello_CV.pdf';
              link.click();
            }}
          >
            <span>DOWNLOAD RESUME</span>
            <span className="arrow">→</span>
          </div>
        </aside>

        <section className="column col-2 b-right">
          <div className="geo-container">
            <div className="geo-shape shape-poly"></div>
          </div>
          <div className="info-block">
            <div>
              <div className="label">STARTUP GROWTH</div>
              <h2 className="headline">Scaled over $500M in valuations across Devolved AI, Dtravel, and NEAR Tasks through strategic positioning and go-to-market execution.</h2>
            </div>
            <div className="footer-action" onClick={() => setActiveModal('startupGrowth')}>
              <span>VIEW BRANDS</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </section>

        <section className="column col-1 b-right">
          <div className="geo-container">
            <div className="geo-shape shape-star"></div>
          </div>
          <div className="info-block">
            <div>
              <div className="label">Paid Media Management</div>
              <h2 className="headline">Allocated $1B+ across Netflix, Disney+, Sony, Toyota, and Starbucks campaigns.</h2>
            </div>
            <div className="footer-action" onClick={() => setActiveModal('paidMedia')}>
              <span>VIEW BRANDS</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </section>

        <section className="column col-3">
          <div className="geo-container">
            <div className="geo-shape shape-split-solid"></div>
          </div>
          <div className="info-block">
            <div>
              <div className="label">Creative & Brand Strategy</div>
              <h2 className="headline">Brand strategy and copywriting for X/Twitter, BMW, LG Mobile, and premium brands.</h2>
            </div>
            <div className="footer-action" onClick={() => setActiveModal('creative')}>
              <span>VIEW BRANDS</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <BrandModal
        brands={brandData.paidMedia}
        isOpen={activeModal === 'paidMedia'}
        onClose={() => setActiveModal(null)}
        bgColor="#7AD0EF"
      />
      <BrandModal
        brands={brandData.startupGrowth}
        isOpen={activeModal === 'startupGrowth'}
        onClose={() => setActiveModal(null)}
        bgColor="#FDFE58"
      />
      <BrandModal
        brands={brandData.creative}
        isOpen={activeModal === 'creative'}
        onClose={() => setActiveModal(null)}
        bgColor="#FE6E0E"
      />
    </>
  );
}
