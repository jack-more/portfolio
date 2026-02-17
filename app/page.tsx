'use client';

import { useEffect, useState } from 'react';
import WorkModal from './components/WorkModal';
import AmbientSound from './components/AmbientSound';

export default function Home() {
  const [activeModal, setActiveModal] = useState<'fullStack' | 'paidMedia' | 'creative' | null>(null);

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="brand">Jack Morello</div>
            <AmbientSound />
          </div>
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
            <div className="footer-action" onClick={() => setActiveModal('fullStack')} style={{ cursor: 'pointer' }}>
              <span>VIEW WORK</span>
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
              <h2 className="headline">Managed paid media and marketing campaigns across Netflix, Disney, Sony, Toyota, and Starbucks.</h2>
            </div>
            <div className="footer-action" onClick={() => setActiveModal('paidMedia')} style={{ cursor: 'pointer' }}>
              <span>VIEW WORK</span>
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
            <div className="footer-action" onClick={() => setActiveModal('creative')} style={{ cursor: 'pointer' }}>
              <span>VIEW WORK</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </section>
      </div>

      {/* Work Modals */}
      <WorkModal
        type="fullStack"
        isOpen={activeModal === 'fullStack'}
        onClose={() => setActiveModal(null)}
      />
      <WorkModal
        type="paidMedia"
        isOpen={activeModal === 'paidMedia'}
        onClose={() => setActiveModal(null)}
      />
      <WorkModal
        type="creative"
        isOpen={activeModal === 'creative'}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
