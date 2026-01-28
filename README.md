# Jack Morello - Marketing Portfolio

A production-quality portfolio site for Director/VP-level marketing roles at Disney, Netflix, EA, and other entertainment/gaming brands.

## Features

- **Interactive Space Theme**: Animated background with asteroids, shooting stars, and particles
- **Responsive Design**: Optimized for all devices from mobile to 4K displays
- **Video-Ready**: Prepared for Remotion video integration
- **Performance Optimized**: Vanilla JavaScript for fast load times
- **Professional Typography**: Inter font family for clean, modern look

## Structure

```
jackmorellodotcom/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styling and theme variables
├── scripts/
│   ├── space-background.js # Interactive space canvas animation
│   └── main.js            # Navigation, scroll effects, interactions
└── README.md
```

## Getting Started

### Local Development

Simply open `index.html` in your browser. No build step required!

For a better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if available)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Customization

#### Update Content

Edit `index.html` to update:
- Your name and title
- Work samples and case studies
- About section and expertise
- Contact information and links

#### Modify Theme

Edit `styles/main.css` CSS variables at the top:

```css
:root {
    --color-space-dark: #0a0e27;
    --color-accent: #4dabf7;
    /* ... more variables */
}
```

#### Add Your Logo/Images

1. Add images to a new `assets/` directory
2. Update the `work-card-placeholder` divs with actual images
3. Replace email/LinkedIn links with your own

## Video Integration

The site includes a video showcase section ready for Remotion content.

### Adding Remotion Videos

1. Create your videos with Remotion
2. Export as MP4 or WebM
3. Replace the placeholder in the video section:

```html
<video autoplay loop muted playsinline>
    <source src="path/to/your-video.mp4" type="video/mp4">
    <source src="path/to/your-video.webm" type="video/webm">
</video>
```

### Video Player Features

- Auto-play support
- Multiple format support (MP4, WebM)
- Responsive aspect ratio (16:9)
- Custom styling to match space theme

## Performance

- No framework overhead
- Optimized animations using RequestAnimationFrame
- Lazy loading for scroll animations
- CSS-based transitions
- Minimal JavaScript bundle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Option 1: Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy (no build command needed)

### Option 2: Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Deploy

### Option 3: GitHub Pages

1. Enable GitHub Pages in repository settings
2. Select main branch
3. Site will be live at `username.github.io/repo-name`

## Next Steps

1. **Add Real Content**:
   - Replace placeholder images with actual campaign visuals
   - Update copy with your specific achievements
   - Add your real contact information

2. **Create Remotion Videos**:
   - Campaign showcase reels
   - Case study walkthroughs
   - Personal introduction

3. **SEO Optimization**:
   - Add meta tags for social sharing
   - Create favicon
   - Add structured data

4. **Analytics**:
   - Add Google Analytics or similar
   - Track visitor engagement

## License

© 2024 Jack Morello. All rights reserved.
