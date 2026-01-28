'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import StarField from '@/components/StarField';
import FloatingProfile from '@/components/FloatingProfile';

const paidMediaBrands = [
  { name: 'Netflix', logo: '/Website_logos/netflix.png', url: 'https://netflix.com' },
  { name: 'Disney+', logo: '/Website_logos/disneyplus.png', url: 'https://disneyplus.com' },
  { name: 'Sony Pictures', logo: '/Website_logos/sony-pictures-logo.png', url: 'https://sonypictures.com' },
  { name: 'Universal', logo: '/Website_logos/universal-logo.png', url: 'https://universalpictures.com' },
  { name: 'Peacock', logo: '/Website_logos/peacock-logo.png', url: 'https://peacocktv.com' },
  { name: 'Prime Video', logo: '/Website_logos/amazon-prime-video.png', url: 'https://amazon.com/primevideo' },
  { name: 'Starzplay', logo: '/Website_logos/starz-play.png', url: 'https://starzplay.com' },
  { name: 'Toyota', logo: '/Website_logos/toyota-logo.png', url: 'https://toyota.com' },
  { name: 'Starbucks', logo: '/Website_logos/starbucks.png', url: 'https://starbucks.com' }
];

const startupBrands = [
  { name: 'Devolved AI', logo: '/Website_logos/DevolvedAI.png', url: 'https://devolved.ai' },
  { name: 'Dtravel', logo: '/Website_logos/Dtravel-logo.jpg', url: 'https://dtravel.com' },
  { name: 'NEAR Protocol', logo: '/Website_logos/near-protocol.png', url: 'https://near.org' },
  { name: 'Travala', logo: '/Website_logos/travala.png', url: 'https://travala.com' }
];

const creativeBrands = [
  { name: 'X', logo: '/Website_logos/twitter-x-logo.png', url: 'https://twitter.com' },
  { name: 'BMW', logo: '/Website_logos/bmw.png', url: 'https://bmw.com' },
  { name: 'LG', logo: '/Website_logos/lglogo.png', url: 'https://lg.com' },
  { name: 'Hint Water', logo: '/Website_logos/hint-water-logo.png', url: 'https://drinkhint.com' }
];

function WorkSection({ title, subtitle, description, brands, id, gridCols }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id={id} className="work-section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="work-content"
      >
        <div className="work-header">
          <h2>{title}</h2>
          <p className="subtitle">{subtitle}</p>
          <p className="description">{description}</p>
        </div>

        <motion.div
          className={`brand-grid ${gridCols}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {brands.map((brand: any, index: number) => (
            <motion.a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-item"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Image src={brand.logo} alt={brand.name} width={180} height={70} className="brand-logo" unoptimized />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }, []);

  return (
    <>
      <StarField />

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.div
            className="hero-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Defy Gravity
          </motion.div>

          <h1>Jack Morello</h1>

          <p className="subtitle-hero">
            Marketing Leadership • Growth Strategy • Paid Media
          </p>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat">
              <div className="stat-value">$150M+</div>
              <div className="stat-label">Valuation Scaled</div>
            </div>
            <div className="stat">
              <div className="stat-value">$1B+</div>
              <div className="stat-label">Media Allocated</div>
            </div>
          </motion.div>
        </motion.div>

        <FloatingProfile />

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#paid-media"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('paid-media')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            View Work
          </a>
          <a
            href="#contact"
            className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Get in Touch
          </a>
        </motion.div>
      </section>

      {/* Work Sections */}
      <WorkSection
        id="paid-media"
        title="Paid Media Management"
        subtitle="Senior Media Strategist"
        description="Allocated $1B+ across major entertainment and consumer brands. Multicultural campaigns, global launches."
        brands={paidMediaBrands}
        gridCols="grid-cols-3"
      />

      <WorkSection
        id="startup-growth"
        title="Startup Growth"
        subtitle="Head of Marketing & Innovation"
        description="Led marketing strategy scaling Devolved AI to $100M valuation. Token launches at NEAR Protocol, Dtravel, and Travala."
        brands={startupBrands}
        gridCols="grid-cols-4"
      />

      <WorkSection
        id="creative"
        title="Creative & Brand Strategy"
        subtitle="Brand Strategist & Copywriting"
        description="Voice and messaging, Instagram creative direction, social media strategy for premium brands."
        brands={creativeBrands}
        gridCols="grid-cols-4"
      />

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="contact-content"
        >
          <h2>Let's work together</h2>
          <div className="contact-links">
            <a href="mailto:jaidanmorello@gmail.com" className="contact-link">Email</a>
            <a href="https://www.linkedin.com/in/jackmorello/" target="_blank" rel="noopener" className="contact-link">LinkedIn</a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
