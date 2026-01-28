# Remotion Video Hero Setup

## Step 1: Install Node.js
First, install Node.js (required for Remotion):
```bash
# Using Homebrew (recommended for Mac)
brew install node

# Or download from nodejs.org
```

## Step 2: Initialize Remotion Project
```bash
cd /Users/jackmorello/Desktop/jackmorellodotcom
npx create-video@latest
# Choose: "Hello World" template
# Name it: "hero-video"
```

## Step 3: Video Hero Concept

### What We'll Build:
**30-second hero video loop** with:

1. **0-3s**: Black screen → Your name fades in with subtle animation
2. **3-6s**: "Marketing Leadership | Growth Strategy | Paid Media" appears
3. **6-12s**: Stats counter animation
   - $1B+ Media Allocated (counts up)
   - $155M+ Valuation Scaled (counts up)
4. **12-18s**: Brand logos fly in (Netflix, Disney+, etc.) arranged in a grid
5. **18-24s**: Quick cuts/flashes of campaign imagery (placeholder for now)
6. **24-27s**: "View Work" CTA button animates in
7. **27-30s**: Fade to loop

### Design Style:
- **Black background** (matches your space theme)
- **Clean typography** (Space Grotesk font)
- **Subtle accent color** (indigo #6366f1)
- **Smooth animations** (professional, not flashy)

## Step 4: File Structure
```
jackmorellodotcom/
├── index.html (your main site)
├── styles/
├── scripts/
├── Website_logos/
└── remotion/
    ├── src/
    │   ├── HeroVideo.tsx (main video component)
    │   ├── Root.tsx
    │   └── animations/
    │       ├── NameIntro.tsx
    │       ├── StatsCounter.tsx
    │       ├── LogoGrid.tsx
    │       └── CTAButton.tsx
    └── public/
        └── logos/ (copy from Website_logos/)
```

## Step 5: Render & Integrate

### Render the video:
```bash
cd remotion
npm run build
npx remotion render HeroVideo hero-video.mp4
```

### Integrate into your site:
Replace the hero section in `index.html` with:
```html
<section class="hero-video-section">
    <video autoplay loop muted playsinline class="hero-video">
        <source src="hero-video.mp4" type="video/mp4">
    </video>
    <div class="hero-overlay">
        <a href="#work" class="cta-btn-overlay">Scroll to Explore</a>
    </div>
</section>
```

## Step 6: CSS for Video Hero
```css
.hero-video-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
}

.cta-btn-overlay {
    /* Same styling as existing CTA button */
}
```

## Alternative: Quick Start Without Remotion

If you want to get started NOW without installing Node, I can:

1. **Create an animated CSS/JS hero** that mimics the Remotion effect
2. Uses your existing setup (no build tools)
3. Not as powerful as Remotion but still dynamic
4. You can upgrade to Remotion later

Would you like me to create the CSS/JS animated hero version first while you set up Node?

---

## Next Steps:

1. ✅ Install Node.js: `brew install node`
2. ⬜ Run: `npx create-video@latest`
3. ⬜ I'll help you build the HeroVideo component
4. ⬜ Render and integrate into site

Let me know when Node is installed and I'll guide you through the Remotion video creation!
