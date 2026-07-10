import { Company, Client } from './portfolioTypes';

// ============================================
// VORTEX PORTFOLIO DATA
// 7 companies, chronological (oldest first)
// ============================================

// ── 0. LAUNDRY SERVICE ──────────────────────
const laundryClients: Client[] = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    logo: '/images/twitter-x-logo.png',
    role: 'Copywriter & Social Media Manager',
    desc: "Developed social media copy and engagement strategies for Twitter's corporate channels. Maintained consistent brand messaging across multiple client accounts and social platforms.",
    campaigns: [
      { title: 'Corporate Social Strategy', text: "Created engaging social content for Twitter's own corporate channels, developing brand voice and community engagement tactics during a pivotal growth period for the platform.", tag: 'Social', image: '/images/campaigns/creative/twitter-social.jpg' },
    ],
    skills: ['copywriting', 'social-media', 'brand-development', 'content-strategy'],
    tools: ['instagram', 'tiktok'],
  },
  {
    id: 'bmw',
    name: 'BMW',
    logo: '/images/bmw.png',
    role: 'Copywriter',
    desc: "Laundry Service was named Social Media Agency of Record for BMW of North America in January 2017. Created copywriting for BMW campaigns, developing compelling brand narratives and marketing copy for their social presence.",
    campaigns: [
      { title: 'BMW Social AOR', text: "Developed social media copywriting as part of Laundry Service's role as BMW of North America's Social Media Agency of Record, crafting premium brand messaging across platforms.", tag: 'Social', image: '/images/campaigns/creative/bmw-social.jpg' },
    ],
    skills: ['copywriting', 'brand-development', 'content-strategy'],
    tools: ['automotive', 'instagram'],
  },
  {
    id: 'lg',
    name: 'LG Mobile',
    logo: '/images/lglogo.png',
    role: 'Copywriter & Social Media Manager',
    desc: 'Developed social media copy and engagement strategies for LG Mobile. Contributed to campaigns that achieved 695 million impressions and 114 million engagements.',
    campaigns: [
      {
        title: 'LG V20 Launch Campaign',
        text: "Multi-channel content initiative showcasing the V20's superior video capture capabilities. Featured influencer partnerships including skateboarder Ryan Sheckler, with all content shot exclusively on the device.",
        tag: 'Product Launch',
        image: '/images/campaigns/creative/lg-v20-campaign.jpg',
        results: ['695M impressions', '114M engagements', '70M+ video views', '300% engagement increase'],
      },
    ],
    skills: ['copywriting', 'social-media', 'content-strategy'],
    tools: ['instagram', 'tiktok'],
  },
  {
    id: 'hint',
    name: 'Hint Water',
    logo: '/images/hint-water-logo.png',
    role: 'Copywriter & Content Planning',
    desc: 'Led copywriting and content planning for Hint Water, developing brand voice and content strategies to drive engagement for the premium flavored water brand.',
    campaigns: [
      { title: 'Brand Content Strategy', text: "Developed copywriting and content planning for Hint Water's social media presence, crafting messaging that emphasized the brand's all-natural, zero-sugar positioning.", tag: 'Content', image: '/images/campaigns/creative/hint-water.jpg' },
    ],
    skills: ['copywriting', 'content-strategy', 'brand-development'],
    tools: ['instagram'],
  },
];

// ── 1. EPK.TV ───────────────────────────────
const epkClients: Client[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '/images/netflix.png',
    role: 'Content Merchandiser',
    desc: 'Managed content partnerships and coordinated weekly delivery of digital marketing assets for promotional campaigns. EPK.TV delivers over 1 million assets annually to 50,000+ media professionals worldwide.',
    campaigns: [
      { title: 'Bird Box', text: 'Viral Netflix original film starring Sandra Bullock (December 2018).', tag: 'Film', image: '/images/campaigns/paid-media/bird-box.jpg' },
      { title: 'The Irishman', text: "Martin Scorsese's epic crime drama with De Niro, Pacino, and Pesci (November 2019).", tag: 'Film', image: '/images/campaigns/paid-media/the-irishman.jpg' },
      { title: 'Stranger Things S3', text: 'Highly anticipated third season launch (July 2019).', tag: 'Series', image: '/images/campaigns/paid-media/stranger-things-s3.jpg' },
      { title: 'Marriage Story', text: "Noah Baumbach's award-winning drama with Scarlett Johansson and Adam Driver.", tag: 'Film', image: '/images/netflix.png' },
      { title: 'The Witcher S1', text: 'Epic fantasy series starring Henry Cavill (December 2019).', tag: 'Series', image: '/images/netflix.png' },
      { title: '6 Underground', text: 'Michael Bay action film starring Ryan Reynolds.', tag: 'Film', image: '/images/netflix.png' },
      { title: 'Uncut Gems', text: 'Safdie Brothers thriller starring Adam Sandler.', tag: 'Film', image: '/images/netflix.png' },
      { title: 'El Camino', text: 'Breaking Bad sequel film (October 2019).', tag: 'Film', image: '/images/netflix.png' },
      { title: 'The Crown S3', text: 'Royal drama series third season launch.', tag: 'Series', image: '/images/netflix.png' },
      { title: 'Dead to Me S1', text: 'Dark comedy series with Christina Applegate.', tag: 'Series', image: '/images/netflix.png' },
      { title: 'When They See Us', text: "Ava DuVernay's limited series on the Central Park Five.", tag: 'Series', image: '/images/netflix.png' },
      { title: 'Triple Frontier', text: 'Action thriller with Ben Affleck and Oscar Isaac.', tag: 'Film', image: '/images/netflix.png' },
    ],
    skills: ['content-strategy', 'data-analytics'],
    tools: ['entertainment'],
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: '/images/disneyplus.png',
    role: 'Content Merchandiser',
    desc: "Managed content partnerships during Disney+ launch period. EPK.TV was the designated distribution platform for Disney's promotional video content across theatrical and streaming releases.",
    campaigns: [
      { title: 'Disney+ Launch', text: 'D23 Expo 2019 announcement and November 12, 2019 platform launch.', tag: 'Platform', image: '/images/campaigns/paid-media/disney-plus-launch.jpg' },
      { title: 'Frozen II', text: 'Animated sequel release (November 2019).', tag: 'Film', image: '/images/campaigns/paid-media/frozen-2.jpg' },
      { title: 'Avengers: Endgame', text: 'Record-breaking MCU finale (April 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'The Lion King', text: 'Live-action remake (July 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'Captain Marvel', text: 'MCU origin story (March 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'Toy Story 4', text: 'Pixar animated sequel (June 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'Aladdin', text: 'Live-action remake with Will Smith (May 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'Star Wars: Rise of Skywalker', text: 'Skywalker Saga finale (December 2019).', tag: 'Film', image: '/images/disneyplus.png' },
      { title: 'The Mandalorian S1', text: 'Disney+ flagship Star Wars series.', tag: 'Series', image: '/images/disneyplus.png' },
      { title: 'Maleficent: Mistress of Evil', text: 'Fantasy sequel with Angelina Jolie.', tag: 'Film', image: '/images/disneyplus.png' },
    ],
    skills: ['content-strategy', 'data-analytics'],
    tools: ['entertainment'],
  },
  {
    id: 'sony',
    name: 'Sony Pictures',
    logo: '/images/sony-pictures-logo.png',
    role: 'Content Merchandiser',
    desc: 'Managed content partnerships with Sony Pictures, coordinating delivery of digital marketing assets for theatrical releases through dedicated studio portal.',
    campaigns: [
      { title: 'Venom', text: 'Blockbuster anti-hero film with Tom Hardy (October 2018).', tag: 'Film', image: '/images/campaigns/paid-media/venom.jpg' },
      { title: 'Spider-Man: Into the Spider-Verse', text: 'Academy Award-winning animated feature (December 2018).', tag: 'Film', image: '/images/campaigns/paid-media/spider-verse.jpg' },
      { title: 'Spider-Man: Far From Home', text: 'MCU sequel (July 2019).', tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'Once Upon a Time in Hollywood', text: "Tarantino's star-studded drama (July 2019).", tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'Jumanji: The Next Level', text: 'Action-comedy sequel (December 2019).', tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'Men in Black: International', text: 'Sci-fi comedy spinoff (June 2019).', tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'A Beautiful Day in the Neighborhood', text: 'Tom Hanks as Mr. Rogers.', tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'Little Women', text: "Greta Gerwig's acclaimed adaptation (December 2019).", tag: 'Film', image: '/images/sony-pictures-logo.png' },
      { title: 'Zombieland: Double Tap', text: 'Comedy-horror sequel (October 2019).', tag: 'Film', image: '/images/sony-pictures-logo.png' },
    ],
    skills: ['content-strategy'],
    tools: ['entertainment'],
  },
  {
    id: 'universal',
    name: 'Universal',
    logo: '/images/universal-logo.png',
    role: 'Content Merchandiser',
    desc: "Coordinated digital asset distribution through EPK.TV's dedicated Universal Pictures portal for theatrical and home entertainment releases.",
    campaigns: [
      { title: 'Us', text: "Jordan Peele's horror film (March 2019).", tag: 'Film', image: '/images/campaigns/paid-media/us.jpg' },
      { title: 'Hobbs & Shaw', text: 'Fast & Furious franchise spin-off (August 2019).', tag: 'Film', image: '/images/campaigns/paid-media/hobbs-shaw.jpg' },
      { title: '1917', text: "Sam Mendes' war epic, Academy Award winner (December 2019).", tag: 'Film', image: '/images/campaigns/paid-media/1917.jpg' },
      { title: 'How to Train Your Dragon 3', text: 'Animated trilogy finale (February 2019).', tag: 'Film', image: '/images/universal-logo.png' },
      { title: 'The Secret Life of Pets 2', text: 'Animated comedy sequel (June 2019).', tag: 'Film', image: '/images/universal-logo.png' },
      { title: 'Glass', text: 'M. Night Shyamalan thriller (January 2019).', tag: 'Film', image: '/images/universal-logo.png' },
      { title: 'Downton Abbey', text: 'Feature film adaptation (September 2019).', tag: 'Film', image: '/images/universal-logo.png' },
    ],
    skills: ['content-strategy'],
    tools: ['entertainment'],
  },
  {
    id: 'peacock',
    name: 'NBC / Peacock',
    logo: '/images/peacock-logo.png',
    role: 'Content Merchandiser',
    desc: 'Supported NBCUniversal content distribution for NBC network shows and ahead of Peacock streaming service launch.',
    campaigns: [
      { title: 'Peacock Pre-Launch', text: 'Promotional content for April 2020 streaming launch.', tag: 'Platform', image: '/images/peacock-logo.png' },
      { title: 'This Is Us', text: 'Hit NBC drama series seasons.', tag: 'Series', image: '/images/peacock-logo.png' },
      { title: 'The Good Place', text: 'Comedy series with Kristen Bell.', tag: 'Series', image: '/images/peacock-logo.png' },
      { title: 'Brooklyn Nine-Nine', text: 'Comedy series after NBC pickup.', tag: 'Series', image: '/images/peacock-logo.png' },
      { title: 'Saturday Night Live', text: 'Weekly sketch comedy episodes.', tag: 'Series', image: '/images/peacock-logo.png' },
      { title: 'Chicago franchise', text: 'Chicago Fire, PD, and Med series.', tag: 'Series', image: '/images/peacock-logo.png' },
    ],
    skills: ['content-strategy'],
    tools: ['entertainment'],
  },
  {
    id: 'prime',
    name: 'Prime Video',
    logo: '/images/amazon-prime-video.png',
    role: 'Content Merchandiser',
    desc: "Managed content distribution through EPK.TV's dedicated Amazon Prime Video portal for original series and film releases.",
    campaigns: [
      { title: 'The Boys S1', text: 'Breakout superhero series (July 2019).', tag: 'Series', image: '/images/campaigns/paid-media/the-boys.jpg' },
      { title: 'Jack Ryan S2', text: 'Action thriller series (October 2019).', tag: 'Series', image: '/images/campaigns/paid-media/jack-ryan.jpg' },
      { title: 'The Marvelous Mrs. Maisel', text: 'Emmy-winning comedy series.', tag: 'Series', image: '/images/amazon-prime-video.png' },
      { title: 'Fleabag S2', text: "Phoebe Waller-Bridge's acclaimed series.", tag: 'Series', image: '/images/amazon-prime-video.png' },
      { title: 'Carnival Row', text: 'Fantasy series with Orlando Bloom.', tag: 'Series', image: '/images/amazon-prime-video.png' },
      { title: 'The Expanse S4', text: 'Sci-fi series Amazon pickup.', tag: 'Series', image: '/images/amazon-prime-video.png' },
      { title: 'Hunters', text: 'Nazi hunters drama with Al Pacino.', tag: 'Series', image: '/images/amazon-prime-video.png' },
      { title: 'Modern Love S1', text: 'Romantic anthology series.', tag: 'Series', image: '/images/amazon-prime-video.png' },
    ],
    skills: ['content-strategy'],
    tools: ['entertainment'],
  },
];

// ── 2. iHEARTMEDIA ──────────────────────────
const iheartClients: Client[] = [
  {
    id: 'starz',
    name: 'Starz',
    logo: '/images/starz-logo.png',
    role: 'Paid Media Manager',
    desc: 'Managed paid media campaigns for Starz premium cable and streaming service, driving subscriber acquisition and engagement across digital platforms.',
    campaigns: [
      { title: 'Power Book II: Ghost', text: 'Spinoff series launch campaign.', tag: 'Series', image: '/images/starz-logo.png' },
      { title: 'Outlander', text: 'Hit time-travel drama series.', tag: 'Series', image: '/images/starz-logo.png' },
      { title: 'P-Valley', text: 'Drama series premiere campaign.', tag: 'Series', image: '/images/starz-logo.png' },
      { title: 'Hightown', text: 'Crime drama series launch.', tag: 'Series', image: '/images/starz-logo.png' },
      { title: 'Subscriber Acquisition', text: 'Multi-platform paid campaigns for Starz app subscriptions.', tag: 'Paid Media', image: '/images/starz-logo.png' },
    ],
    skills: ['performance-marketing', 'programmatic', 'user-acquisition'],
    tools: ['meta-ads', 'google-ads', 'snapchat', 'entertainment'],
  },
  {
    id: 'toyota',
    name: 'Toyota',
    logo: '/images/toyota-logo.png',
    role: 'Paid Media Manager',
    desc: 'Executed paid media strategies for Toyota across Facebook, Instagram, Twitter, and Snapchat. Implemented bidding strategies and campaign optimizations to maximize return on ad spend.',
    campaigns: [
      { title: 'New Model Launches', text: 'Paid campaigns for 2020-2021 vehicle launches including Venza, Sienna, and updated RAV4.', tag: 'Paid Media', image: '/images/toyota-logo.png' },
      { title: 'SmartAudio Retargeting', text: 'Broadcast-to-digital retargeting through multi-touch sequential messaging.', tag: 'Audio', image: '/images/toyota-logo.png' },
      { title: 'Dealer Network Campaigns', text: 'Localized paid media supporting regional dealer promotions.', tag: 'Paid Media', image: '/images/toyota-logo.png' },
      { title: 'ToyotaCare Promotions', text: 'Service and maintenance program awareness campaigns.', tag: 'Paid Media', image: '/images/toyota-logo.png' },
      { title: 'Seasonal Sales Events', text: 'Black Friday, Year-End, and holiday sales event campaigns.', tag: 'Paid Media', image: '/images/toyota-logo.png' },
    ],
    skills: ['performance-marketing', 'programmatic', 'data-analytics'],
    tools: ['meta-ads', 'google-ads', 'snapchat', 'instagram', 'automotive'],
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    logo: '/images/starbucks.png',
    role: 'Paid Media Manager',
    desc: 'Managed programmatic advertising campaigns for Starbucks across digital platforms. Delivered strategic insights and performance analysis to guide media planning.',
    campaigns: [
      { title: 'Seasonal Beverage Launches', text: 'Paid campaigns for Pumpkin Spice Latte, holiday drinks, and new menu items.', tag: 'Paid Media', image: '/images/starbucks.png' },
      { title: 'Starbucks Rewards', text: 'Loyalty program member acquisition and engagement campaigns.', tag: 'Paid Media', image: '/images/starbucks.png' },
      { title: 'Mobile Order & Pay', text: 'App download and usage campaigns during COVID-19.', tag: 'Paid Media', image: '/images/starbucks.png' },
      { title: 'Store Reopening Campaign', text: 'Communications for modified operations and safety protocols.', tag: 'Paid Media', image: '/images/starbucks.png' },
      { title: 'At-Home Coffee', text: 'Retail product campaigns for grocery and at-home consumption.', tag: 'Paid Media', image: '/images/starbucks.png' },
    ],
    skills: ['performance-marketing', 'programmatic', 'data-analytics'],
    tools: ['meta-ads', 'google-ads'],
  },
];

// ── 3. DTRAVEL ──────────────────────────────
const dtravelClients: Client[] = [
  {
    id: 'travala',
    name: 'Travala',
    logo: '/images/travala.png',
    role: 'Cross-platform Partnership',
    desc: 'Supported marketing initiatives for Travala as part of the Dtravel ecosystem partnership. Travala.com is a Binance-backed crypto travel booking platform.',
    campaigns: [
      { title: 'Dtravel-Travala Integration', text: 'Coordinated marketing for TRVL token integration enabling holders to book 2.2M+ hotels, 600+ airlines, and 400,000+ activities on Travala.com.', tag: 'Partnership', image: '/images/campaigns/full-stack/travala-integration.jpg' },
      { title: 'Smart Member Campaigns', text: 'Managed cross-promotional campaigns targeting Travala Smart Program members for Dtravel platform adoption.', tag: 'Campaign', image: '/images/travala.png' },
    ],
    skills: ['growth-marketing', 'user-acquisition'],
    tools: ['web3', 'travel-tech'],
  },
];

// ── 4. INCUBELLA ───────────────────────────
const incubellaClients: Client[] = [
  {
    id: 'devolved-ai',
    name: 'Devolved AI',
    logo: '/images/DevolvedAI.png',
    role: 'Embedded Marketing Lead',
    desc: 'Private AI platform engagement through Incubella. Led positioning, messaging, launch strategy, rebrand, onboarding improvements, and inbound content pipeline.',
    campaigns: [
      { title: 'Positioning and Rebrand', text: 'Owned positioning, messaging, and rebrand work for a private AI platform targeting enterprise users.', tag: 'Brand', image: '/images/DevolvedAI.png' },
      { title: 'Secure Web App Launch', text: "Led launch communications for a private AI platform with end-to-end encryption and Zero-Knowledge Proofs.", tag: 'Product Launch', image: '/images/campaigns/full-stack/devolved-secure.jpg' },
      { title: 'GDA Capital Partnership', text: 'Managed strategic partnership announcement with GDA Capital across press and industry channels.', tag: 'Partnership', image: '/images/campaigns/full-stack/devolved-partnership.jpg' },
      { title: 'Onboarding Optimization', text: 'Streamlined onboarding flow and reduced drop-off by 35%.', tag: 'Conversion', image: '/images/campaigns/full-stack/devolved-ai-logo.png' },
    ],
    skills: ['go-to-market', 'product-positioning', 'brand-development', 'growth-marketing'],
    tools: ['ai-ml', 'web3'],
  },
  {
    id: 'riskiiit',
    name: 'Riskiiit',
    logo: '/images/riskiiit-logo.svg',
    role: 'Growth Strategy Consultant',
    desc: 'Telegram mini app and crypto-native gaming client. Secured client contract and built early GTM, audience intelligence, and acquisition strategy through Incubella.',
    campaigns: [
      { title: 'Client Win and GTM', text: 'Secured the client engagement and shaped Telegram-led acquisition strategy for early user growth.', tag: 'GTM', image: '/images/riskiiit-logo.svg' },
      { title: 'Audience Intelligence', text: 'Built wallet cohort research toolkit and dashboard to identify high-intent crypto communities, creators, and warm-intro channels.', tag: 'Research', image: '/images/riskiiit-logo.svg' },
    ],
    skills: ['go-to-market', 'user-acquisition', 'audience-strategy', 'growth-marketing'],
    tools: ['web3', 'telegram', 'data-analytics'],
  },
];

// ── 6. PERSONAL PROJECTS (sub-items) ────────
const personalClients: Client[] = [
  {
    id: 'morello-sims',
    name: 'Morello Sims',
    logo: '/images/morello-sims-logo.svg',
    role: 'Creator & Developer',
    desc: 'Full-stack sports simulation platform: ATLAS (3D pitch viz), NBA SIM and MLB SIM (daily pick engines powered by scikit-learn GMM clustering). Firebase auth, Stripe payments, real-time data pipelines.',
    campaigns: [
      { title: 'ATLAS — 3D Pitch Viz', text: 'Custom Three.js city visualization mapping pitcher clusters as buildings on Gaussian terrain. 5,400+ lines of WebGL code.', tag: 'WebGL', image: '/images/morello-sims-logo.svg' },
      { title: 'NBA SIM', text: 'Daily NBA pick engine using WOWY synergy analysis, rotation modeling, and FUT-style player cards.', tag: 'Data Science', image: '/images/morello-sims-logo.svg' },
      { title: 'MLB SIM', text: 'MLB daily pick simulator with Gaussian Mixture Model clustering on Statcast pitch data.', tag: 'ML Pipeline', image: '/images/morello-sims-logo.svg' },
      { title: 'Auth & Payments', text: 'Firebase Authentication + Stripe subscription system with tiered access.', tag: 'Full Stack', image: '/images/morello-sims-logo.svg' },
    ],
    skills: ['data-analytics', 'growth-marketing', 'ab-testing'],
    tools: ['python', 'firebase', 'threejs', 'ai-ml'],
  },
];

// ============================================
// 7 COMPANIES — Chronological (oldest first)
// ============================================
export const companies: Company[] = [
  {
    id: 'laundry-service',
    name: 'Laundry Service',
    logo: '/images/laundry-service-logo.png',
    role: 'Copywriter & Social Media Manager',
    period: 'May 2017 – Dec 2017',
    color: '#FE6E0E',
    category: 'creative',
    desc: 'Social media agency representing major brands including BMW, X/Twitter, LG Mobile, and Hint Water. Created copywriting, content planning, and social media management across client accounts.',
    clients: laundryClients,
    campaigns: [],
    skills: ['copywriting', 'social-media', 'brand-development', 'content-strategy'],
    tools: ['instagram', 'tiktok', 'automotive'],
  },
  {
    id: 'epk-tv',
    name: 'EPK.TV',
    logo: '/images/epk-tv-logo.png',
    role: 'Content Merchandiser',
    period: 'Aug 2018 – Jan 2020',
    color: '#7AD0EF',
    category: 'media',
    desc: 'Digital content distribution platform delivering over 1 million promotional assets annually to 50,000+ media professionals. Managed studio partnerships with Netflix, Disney, Sony, Universal, NBC, and Amazon.',
    clients: epkClients,
    campaigns: [],
    skills: ['content-strategy', 'data-analytics'],
    tools: ['entertainment'],
  },
  {
    id: 'iheartmedia',
    name: 'iHeartMedia',
    logo: '/images/iheart-logo.png',
    role: 'Paid Media Manager',
    period: 'Jan 2020 – Apr 2021',
    color: '#E53935',
    category: 'media',
    desc: 'Managed paid media campaigns across Facebook, Instagram, Twitter, Snapchat, and programmatic channels for enterprise clients including Starz, Toyota, and Starbucks.',
    clients: iheartClients,
    campaigns: [],
    skills: ['performance-marketing', 'programmatic', 'data-analytics', 'user-acquisition'],
    tools: ['meta-ads', 'google-ads', 'snapchat', 'instagram'],
  },
  {
    id: 'dtravel',
    name: 'Dtravel',
    logo: '/images/Dtravel-logo.jpg',
    role: 'Head of Digital Growth',
    period: 'Apr 2021 – Apr 2022',
    color: '#00C9A7',
    category: 'startup',
    desc: 'Directed digital marketing strategy during Series A funding round. Scaled social media following from 7,000 to 55,000+ across platforms, supporting successful $8M Series A funding.',
    clients: dtravelClients,
    campaigns: [
      { title: 'TRVL Token Launch', text: 'Multi-platform token launch across MEXC Global, Bybit Launchpool, Gate.io Startup, and Polkastarter IDO. Over 60,000+ participants.', tag: 'Token Launch', image: '/images/campaigns/full-stack/blockchain-launch.jpg' },
      { title: '200K Listings in 30 Days', text: "Host acquisition campaign achieving 200,000+ property listings across 2,000+ cities within first 30 days—120x faster than Airbnb's early growth rate.", tag: 'Growth', image: '/images/campaigns/full-stack/dtravel-listings.jpg' },
      { title: 'Open Passport NFT', text: 'Launched blockchain-based travel passport allowing travelers to collect NFT stamps for completed bookings.', tag: 'Product', image: '/images/campaigns/full-stack/dtravel-passport.jpg' },
      { title: 'Nite Protocol / NFT Bookings', text: 'First-of-its-kind system turning vacation rental bookings into transferable NFTs on Polygon.', tag: 'Product', image: '/images/campaigns/full-stack/dtravel-nft.jpg' },
      { title: '10M TRVL Airdrop', text: 'Exclusive airdrop series for Travala.com Smart Program members.', tag: 'Campaign', image: '/images/campaigns/full-stack/dtravel-passport.jpg' },
    ],
    skills: ['community-growth', 'growth-marketing', 'pnl-management', 'content-strategy'],
    tools: ['web3', 'travel-tech', 'meta-ads', 'instagram'],
  },
  {
    id: 'near-tasks',
    name: 'NEAR Tasks',
    logo: '/images/near-protocol.png',
    role: 'Head of Marketing',
    period: 'Apr 2022 – Jun 2024',
    color: '#00C9A7',
    category: 'startup',
    desc: 'Managed full marketing strategy for AI-powered task marketplace. Grew registered user base from launch to 12,000 users in 18 months. Contributed to $1.8M+ in platform transaction volume.',
    clients: [],
    campaigns: [
      { title: 'NEARCON 2023 Beta', text: 'Official product beta launched at NEARCON 2023. Built waitlist to 48,000+ applicants.', tag: 'Event', image: '/images/campaigns/full-stack/nearcon-2023.jpg' },
      { title: 'Consensus 2023 Debut', text: 'Platform debuted at Consensus 2023 in Austin. 40%+ conversion rate from event demos.', tag: 'Event', image: '/images/campaigns/full-stack/consensus-2023.jpg' },
      { title: '#EarnWithNEARTasks', text: 'User-generated content campaign where taskers share photos with NEAR logo on Twitter.', tag: 'Social', image: '/images/near-protocol.png' },
      { title: 'Alpha Test Program', text: 'Managed rollout of 122-person alpha test completing 3,000+ tasks. Outperformed MTurk by 3x in quality.', tag: 'Product', image: '/images/near-protocol.png' },
    ],
    skills: ['user-acquisition', 'community-growth', 'performance-marketing', 'ab-testing', 'conversion-optimization'],
    tools: ['web3', 'ai-ml', 'meta-ads'],
  },
  {
    id: 'incubella',
    name: 'Incubella',
    logo: '/images/incubella-logo.svg',
    role: 'Partner',
    period: 'Jun 2024 - Present',
    color: '#FDFE58',
    category: 'startup',
    desc: 'Growth advisory firm building GTM systems for early-stage clients. Engagements include Devolved AI and Riskiiit, spanning positioning, paid acquisition, landing pages, dashboards, content systems, and AI-assisted workflows.',
    clients: incubellaClients,
    campaigns: [],
    skills: ['go-to-market', 'user-acquisition', 'product-positioning', 'growth-marketing', 'conversion-optimization'],
    tools: ['ai-ml', 'web3', 'meta-ads', 'data-analytics'],
  },
  {
    id: 'personal',
    name: 'Personal Projects',
    logo: '/images/morello-sims-logo.svg',
    role: 'Creator & Developer',
    period: 'Jan 2024 – Present',
    color: '#FF6B00',
    category: 'personal',
    desc: 'Building full-stack products from scratch — sports simulation platforms with real-time data pipelines, WebGL visualizations, and mobile gaming apps.',
    clients: personalClients,
    campaigns: [],
    skills: ['data-analytics', 'growth-marketing', 'go-to-market', 'product-positioning'],
    tools: ['python', 'firebase', 'threejs', 'ai-ml', 'react-native', 'tiktok', 'instagram'],
  },
];

// ── Helpers ──
export function getCompanyById(id: string): Company | undefined {
  return companies.find(c => c.id === id);
}

export function getClientById(clientId: string): { company: Company; client: Client } | undefined {
  for (const company of companies) {
    const client = company.clients.find(c => c.id === clientId);
    if (client) return { company, client };
  }
  return undefined;
}

export function getAllClients(): Client[] {
  return companies.flatMap(c => c.clients);
}
