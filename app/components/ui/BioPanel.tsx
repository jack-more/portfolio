'use client';

import { memo } from 'react';
import { Linkedin, Mail, Download } from 'lucide-react';
import AmbientSound from '../AmbientSound';

function BioPanel() {
  return (
    <aside className="bio-panel">
      {/* Photo */}
      <div className="bio-panel__photo-wrap">
        <img
          src="/images/headshot-jack.jpg"
          alt="Jack Morello"
          className="bio-panel__photo"
        />
      </div>

      {/* Identity */}
      <h1 className="bio-panel__name">Jack Morello</h1>
      <p className="bio-panel__tagline">Growth, Media &amp; Creative</p>

      {/* Bio */}
      <p className="bio-panel__bio">
        Growth marketer with a creative-tech edge. Eight years helping brands
        like Netflix, Disney+, Toyota, and Sony reach audiences through paid media
        and data-driven campaigns — while leading startup growth in Web3 and building
        real-time sports simulations on the side.
      </p>

      {/* Links */}
      <div className="bio-panel__links">
        <a
          className="bio-panel__link"
          href="https://www.linkedin.com/in/jackmorello/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={16} />
          LinkedIn
        </a>

        <a
          className="bio-panel__link"
          href="mailto:jaidanmorello@gmail.com"
        >
          <Mail size={16} />
          Contact
        </a>

        <button
          className="bio-panel__link"
          onClick={() => {
            const link = document.createElement('a');
            link.href = '/JackMorello_CV.pdf';
            link.download = 'JackMorello_CV.pdf';
            link.click();
          }}
        >
          <Download size={16} />
          Resume
        </button>
      </div>

      {/* Sound */}
      <div className="bio-panel__sound">
        <AmbientSound />
      </div>

      {/* Hint */}
      <p className="bio-panel__hint">
        Scroll to spin the vortex — click a brand to explore campaigns.
      </p>
    </aside>
  );
}

export default memo(BioPanel);
