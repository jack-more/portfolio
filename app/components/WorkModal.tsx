'use client';

import { useState, useEffect } from 'react';

// ===========================================
// DATA FOR ALL THREE MODALS
// ===========================================

const fullStackData = {
  devolved: {
    role: "Marketing Manager",
    period: "Sep 2024 – Jun 2025",
    title: "Devolved AI",
    abbrev: "DAI",
    logo: "/images/DevolvedAI.png",
    desc: "Led marketing strategy that scaled AI platform to $100M valuation. Developed comprehensive product positioning and launch strategy for AI agent platform serving enterprise and consumer markets. Oversaw complete company rebrand and market positioning.",
    campaigns: [
      { title: "Secure Web App Launch", text: "Led launch communications for 'The Most Secure and Private AI Platform' featuring end-to-end encryption and Zero-Knowledge Proofs integration with Argochain.", tag: "Product Launch", image: "/images/campaigns/full-stack/devolved-secure.jpg" },
      { title: "GDA Capital Partnership", text: "Managed strategic partnership announcement with GDA Capital, bringing Michael Gord as advisor. Distributed across GlobeNewswire, Manila Times, Tech Times, and major news outlets.", tag: "Partnership", image: "/images/campaigns/full-stack/devolved-partnership.jpg" },
      { title: "Next Top AI Agent", text: "World's largest virtual AI startup competition with $500K+ prize pool. Partnership with GDA Capital and Alpaca Network. March 2025 campaign reaching global AI developer community.", tag: "Campaign", image: "/images/campaigns/full-stack/devolved-competition.jpg" },
      { title: "Argochain Mainnet Launch", text: "Go-to-market strategy for proprietary Layer-1 blockchain launch (July 2024) and AGC token debut on MEXC exchange (August 2024).", tag: "Token Launch", image: "/images/campaigns/full-stack/blockchain-launch.jpg" }
    ]
  },
  near: {
    role: "Head of Marketing",
    period: "Apr 2022 – Jun 2024",
    title: "NEAR Tasks",
    abbrev: "NT",
    logo: "/images/near-protocol.png",
    desc: "Managed full marketing strategy for AI-powered task marketplace. Grew registered user base from launch to 12,000 users in 18 months. Contributed to $1.8M+ in platform transaction volume through strategic user engagement.",
    campaigns: [
      { title: "NEARCON 2023 Beta", text: "Official product beta launched at NEARCON 2023. Built waitlist to 48,000+ applicants through strategic pre-launch marketing.", tag: "Event", image: "/images/campaigns/full-stack/nearcon-2023.jpg" },
      { title: "Consensus 2023 Debut", text: "Platform debuted at Consensus 2023 in Austin. Achieved 40%+ conversion rate from event demo attendees to waitlist signups.", tag: "Event", image: "/images/campaigns/full-stack/consensus-2023.jpg" },
      { title: "#EarnWithNEARTasks", text: "User-generated content campaign where taskers share photos with NEAR logo on Twitter, driving organic awareness and community growth.", tag: "Social", image: "/images/near-protocol.png" },
      { title: "Alpha Test Program", text: "Managed rollout of 122-person alpha test completing 3,000+ tasks. Outperformed parallel MTurk campaign by nearly 3x in quality scores.", tag: "Product", image: "/images/near-protocol.png" }
    ]
  },
  dtravel: {
    role: "Head of Digital Growth",
    period: "Apr 2021 – Apr 2022",
    title: "Dtravel",
    abbrev: "DT",
    logo: "/images/Dtravel-logo.jpg",
    desc: "Directed digital marketing strategy during Series A funding round. Scaled social media following from 7,000 to 55,000+ across platforms, supporting successful $8M Series A funding.",
    campaigns: [
      { title: "TRVL Token Launch", text: "Multi-platform token launch across MEXC Global, Bybit Launchpool, Gate.io Startup, and Polkastarter IDO. Over 60,000+ participants.", tag: "Token Launch", image: "/images/campaigns/full-stack/blockchain-launch.jpg" },
      { title: "200K Listings in 30 Days", text: "Host acquisition campaign achieving 200,000+ property listings across 2,000+ cities within first 30 days—120x faster than Airbnb's early growth rate.", tag: "Growth", image: "/images/campaigns/full-stack/dtravel-listings.jpg" },
      { title: "Open Passport NFT", text: "Launched blockchain-based travel passport allowing travelers to collect NFT stamps for completed bookings. Partnership with Travala.com.", tag: "Product", image: "/images/campaigns/full-stack/dtravel-passport.jpg" },
      { title: "Nite Protocol / NFT Bookings", text: "First-of-its-kind system turning vacation rental bookings into transferable NFTs on Polygon. Enabled secure transfer or resale of bookings.", tag: "Product", image: "/images/campaigns/full-stack/dtravel-nft.jpg" },
      { title: "10M TRVL Airdrop", text: "Exclusive airdrop series for Travala.com Smart Program members. Drove community engagement and cross-platform user acquisition.", tag: "Campaign", image: "/images/campaigns/full-stack/dtravel-passport.jpg" }
    ]
  },
  travala: {
    role: "Work done while at Dtravel",
    period: "Apr 2021 – Apr 2022",
    title: "Travala",
    abbrev: "TV",
    logo: "/images/travala.png",
    desc: "Supported marketing initiatives for Travala as part of the Dtravel ecosystem partnership. Travala.com is a Binance-backed crypto travel booking platform.",
    campaigns: [
      { title: "Dtravel-Travala Integration", text: "Coordinated marketing for TRVL token integration enabling holders to book 2.2M+ hotels, 600+ airlines, and 400,000+ activities on Travala.com.", tag: "Partnership", image: "/images/campaigns/full-stack/travala-integration.jpg" },
      { title: "Smart Member Campaigns", text: "Managed cross-promotional campaigns targeting Travala Smart Program members for Dtravel platform adoption.", tag: "Campaign", image: "/images/travala.png" }
    ]
  }
};

const paidMediaData = {
  netflix: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "Netflix",
    abbrev: "NF",
    logo: "/images/netflix.png",
    desc: "Managed content partnerships and coordinated weekly delivery of digital marketing assets for promotional campaigns. EPK.TV delivers over 1 million assets annually to 50,000+ media professionals worldwide.",
    campaigns: [
      { title: "Bird Box", text: "Viral Netflix original film starring Sandra Bullock (December 2018).", tag: "Film", image: "/images/campaigns/paid-media/bird-box.jpg" },
      { title: "The Irishman", text: "Martin Scorsese's epic crime drama with De Niro, Pacino, and Pesci (November 2019).", tag: "Film", image: "/images/campaigns/paid-media/the-irishman.jpg" },
      { title: "Stranger Things S3", text: "Highly anticipated third season launch (July 2019).", tag: "Series", image: "/images/campaigns/paid-media/stranger-things-s3.jpg" },
      { title: "Marriage Story", text: "Noah Baumbach's award-winning drama with Scarlett Johansson and Adam Driver.", tag: "Film", image: "/images/netflix.png" },
      { title: "The Witcher S1", text: "Epic fantasy series starring Henry Cavill (December 2019).", tag: "Series", image: "/images/netflix.png" },
      { title: "6 Underground", text: "Michael Bay action film starring Ryan Reynolds.", tag: "Film", image: "/images/netflix.png" },
      { title: "Uncut Gems", text: "Safdie Brothers thriller starring Adam Sandler.", tag: "Film", image: "/images/netflix.png" },
      { title: "El Camino", text: "Breaking Bad sequel film (October 2019).", tag: "Film", image: "/images/netflix.png" },
      { title: "The Crown S3", text: "Royal drama series third season launch.", tag: "Series", image: "/images/netflix.png" },
      { title: "Dead to Me S1", text: "Dark comedy series with Christina Applegate.", tag: "Series", image: "/images/netflix.png" },
      { title: "When They See Us", text: "Ava DuVernay's limited series on the Central Park Five.", tag: "Series", image: "/images/netflix.png" },
      { title: "Triple Frontier", text: "Action thriller with Ben Affleck and Oscar Isaac.", tag: "Film", image: "/images/netflix.png" }
    ]
  },
  disney: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "Disney",
    abbrev: "D+",
    logo: "/images/disneyplus.png",
    desc: "Managed content partnerships during Disney+ launch period. EPK.TV was the designated distribution platform for Disney's promotional video content across theatrical and streaming releases.",
    campaigns: [
      { title: "Disney+ Launch", text: "D23 Expo 2019 announcement and November 12, 2019 platform launch.", tag: "Platform", image: "/images/campaigns/paid-media/disney-plus-launch.jpg" },
      { title: "Frozen II", text: "Animated sequel release (November 2019).", tag: "Film", image: "/images/campaigns/paid-media/frozen-2.jpg" },
      { title: "Avengers: Endgame", text: "Record-breaking MCU finale (April 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "The Lion King", text: "Live-action remake (July 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "Captain Marvel", text: "MCU origin story (March 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "Toy Story 4", text: "Pixar animated sequel (June 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "Aladdin", text: "Live-action remake with Will Smith (May 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "Star Wars: Rise of Skywalker", text: "Skywalker Saga finale (December 2019).", tag: "Film", image: "/images/disneyplus.png" },
      { title: "The Mandalorian S1", text: "Disney+ flagship Star Wars series.", tag: "Series", image: "/images/disneyplus.png" },
      { title: "Maleficent: Mistress of Evil", text: "Fantasy sequel with Angelina Jolie.", tag: "Film", image: "/images/disneyplus.png" }
    ]
  },
  sony: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "Sony Pictures",
    abbrev: "SP",
    logo: "/images/sony-pictures-logo.png",
    desc: "Managed content partnerships with Sony Pictures, coordinating delivery of digital marketing assets for theatrical releases through dedicated studio portal.",
    campaigns: [
      { title: "Venom", text: "Blockbuster anti-hero film with Tom Hardy (October 2018).", tag: "Film", image: "/images/campaigns/paid-media/venom.jpg" },
      { title: "Spider-Man: Into the Spider-Verse", text: "Academy Award-winning animated feature (December 2018).", tag: "Film", image: "/images/campaigns/paid-media/spider-verse.jpg" },
      { title: "Spider-Man: Far From Home", text: "MCU sequel (July 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "Once Upon a Time in Hollywood", text: "Tarantino's star-studded drama (July 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "Jumanji: The Next Level", text: "Action-comedy sequel (December 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "Men in Black: International", text: "Sci-fi comedy spinoff (June 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "A Beautiful Day in the Neighborhood", text: "Tom Hanks as Mr. Rogers.", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "Little Women", text: "Greta Gerwig's acclaimed adaptation (December 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" },
      { title: "Zombieland: Double Tap", text: "Comedy-horror sequel (October 2019).", tag: "Film", image: "/images/sony-pictures-logo.png" }
    ]
  },
  universal: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "Universal",
    abbrev: "UN",
    logo: "/images/universal-logo.png",
    desc: "Coordinated digital asset distribution through EPK.TV's dedicated Universal Pictures portal (universal.epk.tv) for theatrical and home entertainment releases.",
    campaigns: [
      { title: "Us", text: "Jordan Peele's horror film (March 2019).", tag: "Film", image: "/images/campaigns/paid-media/us.jpg" },
      { title: "Hobbs & Shaw", text: "Fast & Furious franchise spin-off (August 2019).", tag: "Film", image: "/images/campaigns/paid-media/hobbs-shaw.jpg" },
      { title: "1917", text: "Sam Mendes' war epic, Academy Award winner (December 2019).", tag: "Film", image: "/images/campaigns/paid-media/1917.jpg" },
      { title: "How to Train Your Dragon 3", text: "Animated trilogy finale (February 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "The Secret Life of Pets 2", text: "Animated comedy sequel (June 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "Glass", text: "M. Night Shyamalan thriller (January 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "Downton Abbey", text: "Feature film adaptation (September 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "Good Boys", text: "R-rated comedy (August 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "Cats", text: "Musical adaptation (December 2019).", tag: "Film", image: "/images/universal-logo.png" },
      { title: "Abominable", text: "DreamWorks animated film (September 2019).", tag: "Film", image: "/images/universal-logo.png" }
    ]
  },
  peacock: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "NBC / Peacock",
    abbrev: "NBC",
    logo: "/images/peacock-logo.png",
    desc: "Supported NBCUniversal content distribution for NBC network shows and ahead of Peacock streaming service launch.",
    campaigns: [
      { title: "Peacock Pre-Launch", text: "Promotional content for April 2020 streaming launch.", tag: "Platform", image: "/images/peacock-logo.png" },
      { title: "This Is Us", text: "Hit NBC drama series seasons.", tag: "Series", image: "/images/peacock-logo.png" },
      { title: "The Good Place", text: "Comedy series with Kristen Bell.", tag: "Series", image: "/images/peacock-logo.png" },
      { title: "Brooklyn Nine-Nine", text: "Comedy series after NBC pickup.", tag: "Series", image: "/images/peacock-logo.png" },
      { title: "Saturday Night Live", text: "Weekly sketch comedy episodes.", tag: "Series", image: "/images/peacock-logo.png" },
      { title: "Chicago franchise", text: "Chicago Fire, PD, and Med series.", tag: "Series", image: "/images/peacock-logo.png" }
    ]
  },
  prime: {
    role: "EPK.TV — Content Merchandiser",
    period: "Aug 2018 – Jan 2020",
    title: "Prime Video",
    abbrev: "PV",
    logo: "/images/amazon-prime-video.png",
    desc: "Managed content distribution through EPK.TV's dedicated Amazon Prime Video portal (amazonprimevideo.epk.tv) for original series and film releases.",
    campaigns: [
      { title: "The Boys S1", text: "Breakout superhero series (July 2019).", tag: "Series", image: "/images/campaigns/paid-media/the-boys.jpg" },
      { title: "Jack Ryan S2", text: "Action thriller series (October 2019).", tag: "Series", image: "/images/campaigns/paid-media/jack-ryan.jpg" },
      { title: "The Marvelous Mrs. Maisel", text: "Emmy-winning comedy series.", tag: "Series", image: "/images/amazon-prime-video.png" },
      { title: "Fleabag S2", text: "Phoebe Waller-Bridge's acclaimed series.", tag: "Series", image: "/images/amazon-prime-video.png" },
      { title: "Carnival Row", text: "Fantasy series with Orlando Bloom.", tag: "Series", image: "/images/amazon-prime-video.png" },
      { title: "The Expanse S4", text: "Sci-fi series Amazon pickup.", tag: "Series", image: "/images/amazon-prime-video.png" },
      { title: "Hunters", text: "Nazi hunters drama with Al Pacino.", tag: "Series", image: "/images/amazon-prime-video.png" },
      { title: "Modern Love S1", text: "Romantic anthology series.", tag: "Series", image: "/images/amazon-prime-video.png" }
    ]
  },
  starz: {
    role: "iHeartMedia — Paid Media Manager",
    period: "Jan 2020 – Apr 2021",
    title: "Starz",
    abbrev: "STZ",
    logo: "/images/starz-logo.png",
    desc: "Managed paid media campaigns for Starz premium cable and streaming service, driving subscriber acquisition and engagement across digital platforms.",
    campaigns: [
      { title: "Power Book II: Ghost", text: "Spinoff series launch campaign.", tag: "Series", image: "/images/starz-logo.png" },
      { title: "Outlander", text: "Hit time-travel drama series.", tag: "Series", image: "/images/starz-logo.png" },
      { title: "P-Valley", text: "Drama series premiere campaign.", tag: "Series", image: "/images/starz-logo.png" },
      { title: "Hightown", text: "Crime drama series launch.", tag: "Series", image: "/images/starz-logo.png" },
      { title: "Subscriber Acquisition", text: "Multi-platform paid campaigns for Starz app subscriptions.", tag: "Paid Media", image: "/images/starz-logo.png" }
    ]
  },
  toyota: {
    role: "iHeartMedia — Paid Media Manager",
    period: "Jan 2020 – Apr 2021",
    title: "Toyota",
    abbrev: "TY",
    logo: "/images/toyota-logo.png",
    desc: "Executed paid media strategies for Toyota across Facebook, Instagram, Twitter, and Snapchat. Implemented bidding strategies and campaign optimizations to maximize return on ad spend.",
    campaigns: [
      { title: "New Model Launches", text: "Paid campaigns for 2020-2021 vehicle launches including Venza, Sienna, and updated RAV4.", tag: "Paid Media", image: "/images/toyota-logo.png" },
      { title: "SmartAudio Retargeting", text: "Broadcast-to-digital retargeting through multi-touch sequential messaging.", tag: "Audio", image: "/images/toyota-logo.png" },
      { title: "Dealer Network Campaigns", text: "Localized paid media supporting regional dealer promotions.", tag: "Paid Media", image: "/images/toyota-logo.png" },
      { title: "ToyotaCare Promotions", text: "Service and maintenance program awareness campaigns.", tag: "Paid Media", image: "/images/toyota-logo.png" },
      { title: "Seasonal Sales Events", text: "Black Friday, Year-End, and holiday sales event campaigns.", tag: "Paid Media", image: "/images/toyota-logo.png" }
    ]
  },
  starbucks: {
    role: "iHeartMedia — Paid Media Manager",
    period: "Jan 2020 – Apr 2021",
    title: "Starbucks",
    abbrev: "SB",
    logo: "/images/starbucks.png",
    desc: "Managed programmatic advertising campaigns for Starbucks across digital platforms. Delivered strategic insights and performance analysis to guide media planning.",
    campaigns: [
      { title: "Seasonal Beverage Launches", text: "Paid campaigns for Pumpkin Spice Latte, holiday drinks, and new menu items.", tag: "Paid Media", image: "/images/starbucks.png" },
      { title: "Starbucks Rewards", text: "Loyalty program member acquisition and engagement campaigns.", tag: "Paid Media", image: "/images/starbucks.png" },
      { title: "Mobile Order & Pay", text: "App download and usage campaigns during COVID-19.", tag: "Paid Media", image: "/images/starbucks.png" },
      { title: "Store Reopening Campaign", text: "Communications for modified operations and safety protocols.", tag: "Paid Media", image: "/images/starbucks.png" },
      { title: "At-Home Coffee", text: "Retail product campaigns for grocery and at-home consumption.", tag: "Paid Media", image: "/images/starbucks.png" }
    ]
  }
};

const creativeData = {
  twitter: {
    role: "Laundry Service — Copywriter & Social Media Manager",
    period: "May 2017 – Dec 2017",
    title: "X (Twitter)",
    abbrev: "X",
    logo: "/images/twitter-x-logo.png",
    desc: "Developed social media copy and engagement strategies for Twitter's corporate channels. Maintained consistent brand messaging across multiple client accounts and social platforms.",
    campaigns: [
      { title: "Corporate Social Strategy", text: "Created engaging social content for Twitter's own corporate channels, developing brand voice and community engagement tactics during a pivotal growth period for the platform.", tag: "Social", image: "/images/campaigns/creative/twitter-social.jpg" }
    ]
  },
  bmw: {
    role: "Laundry Service — Copywriter",
    period: "May 2017 – Dec 2017",
    title: "BMW",
    abbrev: "BMW",
    logo: "/images/bmw.png",
    desc: "Laundry Service was named Social Media Agency of Record for BMW of North America in January 2017. Created copywriting for BMW campaigns, developing compelling brand narratives and marketing copy for their social presence.",
    campaigns: [
      { title: "BMW Social AOR", text: "Developed social media copywriting as part of Laundry Service's role as BMW of North America's Social Media Agency of Record, crafting premium brand messaging across platforms.", tag: "Social", image: "/images/campaigns/creative/bmw-social.jpg" }
    ]
  },
  lg: {
    role: "Laundry Service — Copywriter & Social Media Manager",
    period: "May 2017 – Dec 2017",
    title: "LG Mobile",
    abbrev: "LG",
    logo: "/images/lglogo.png",
    desc: "Developed social media copy and engagement strategies for LG Mobile. Contributed to campaigns that achieved 695 million impressions and 114 million engagements.",
    campaigns: [
      { title: "LG V20 Launch Campaign", text: "Multi-channel content initiative showcasing the V20's superior video capture capabilities. Featured influencer partnerships including skateboarder Ryan Sheckler, with all content shot exclusively on the device.", tag: "Product Launch", image: "/images/campaigns/creative/lg-v20-campaign.jpg", results: ["695M impressions", "114M engagements", "70M+ video views", "300% engagement increase"] }
    ]
  },
  hint: {
    role: "Laundry Service — Copywriter & Content Planning",
    period: "May 2017 – Dec 2017",
    title: "Hint Water",
    abbrev: "HW",
    logo: "/images/hint-water-logo.png",
    desc: "Led copywriting and content planning for Hint Water, developing brand voice and content strategies to drive engagement for the premium flavored water brand.",
    campaigns: [
      { title: "Brand Content Strategy", text: "Developed copywriting and content planning for Hint Water's social media presence, crafting messaging that emphasized the brand's all-natural, zero-sugar positioning.", tag: "Content", image: "/images/campaigns/creative/hint-water.jpg" }
    ]
  }
};

// ===========================================
// MODAL CONFIG
// ===========================================

interface ModalConfig {
  bgColor: string;
  label: string;
  headline: string;
  subheadline: string;
  body: string;
  data: Record<string, any>;
  brandKeys: string[];
}

const modalConfigs: Record<string, ModalConfig> = {
  fullStack: {
    bgColor: '#FDFE58',
    label: 'Full Stack Marketing',
    headline: 'Scaled Over',
    subheadline: '$500M',
    body: 'Led end-to-end marketing strategy for AI and Web3 startups—from go-to-market positioning to product launches.',
    data: fullStackData,
    brandKeys: ['devolved', 'near', 'dtravel', 'travala']
  },
  paidMedia: {
    bgColor: '#7AD0EF',
    label: 'Paid Media Management',
    headline: 'Managed',
    subheadline: '$1B+',
    body: 'At EPK.TV, managed content partnerships with 20+ major studios. At iHeartMedia, executed programmatic advertising for entertainment and automotive clients.',
    data: paidMediaData,
    brandKeys: ['netflix', 'disney', 'sony', 'universal', 'peacock', 'prime', 'starz', 'toyota', 'starbucks']
  },
  creative: {
    bgColor: '#FE6E0E',
    label: 'Creative & Brand Strategy',
    headline: 'Award-Winning',
    subheadline: 'Agency',
    body: 'At Laundry Service (ranked #9 on Ad Age\'s 2017 Agency A-List), crafted social content and brand voice for premium brands.',
    data: creativeData,
    brandKeys: ['twitter', 'bmw', 'lg', 'hint']
  }
};

// ===========================================
// MODAL COMPONENT
// ===========================================

interface WorkModalProps {
  type: 'fullStack' | 'paidMedia' | 'creative';
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkModal({ type, isOpen, onClose }: WorkModalProps) {
  const config = modalConfigs[type];
  const [activeBrand, setActiveBrand] = useState(config.brandKeys[0]);
  const [handPosition, setHandPosition] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveBrand(config.brandKeys[0]);
      setHandPosition(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, config.brandKeys]);

  if (!isOpen) return null;

  const brandData = config.data[activeBrand];

  const handleBrandClick = (key: string, index: number) => {
    setActiveBrand(key);
    setHandPosition(index);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;600;800&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes contentFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-content-area {
          animation: contentFade 0.4s ease-out;
        }

        .campaign-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px #111 !important;
        }

        .nav-item-btn:hover {
          transform: translateX(5px);
        }

        .nav-item-btn.active .nav-logo-circle {
          background: #111 !important;
          box-shadow: 0 0 0 4px #fff, 0 0 0 7px #111;
          transform: scale(1.1);
        }

        .nav-item-btn.active .nav-logo-circle img {
          filter: brightness(0) invert(1) !important;
        }

        .nav-item-btn.active .nav-text-label {
          opacity: 1 !important;
        }

        .right-panel {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .right-panel::-webkit-scrollbar {
          width: 8px;
        }
        .right-panel::-webkit-scrollbar-track {
          background: #f5f5f5;
        }
        .right-panel::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        .right-panel::-webkit-scrollbar-thumb:hover {
          background: #999;
        }

        .left-panel {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .left-panel::-webkit-scrollbar {
          width: 6px;
        }
        .left-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .left-panel::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90vw',
          maxWidth: '1200px',
          height: '90vh',
          background: '#fff',
          border: '3px solid #111',
          boxShadow: '6px 6px 0px #111',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gridTemplateRows: '1fr',
          overflow: 'hidden',
          animation: 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* LEFT PANEL */}
        <aside
          className="left-panel"
          style={{
            backgroundColor: config.bgColor,
            borderRight: '3px solid #111',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
            overflowY: 'auto',
            height: '100%',
            minHeight: 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '36px',
              height: '36px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            ×
          </button>

          <div style={{
            fontFamily: "'Roobert', 'Outfit', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: '#111',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {config.label}
          </div>

          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '2.2rem',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff',
            textShadow: '2px 2px 0px #111',
            WebkitTextStroke: '1.5px #111',
            marginBottom: '16px',
          }}>
            {config.headline}<br/>
            <span style={{ color: '#111', WebkitTextStroke: '0' }}>{config.subheadline}</span><br/>
            Value
          </h1>

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
            lineHeight: 1.4,
            fontWeight: 600,
            marginBottom: '24px',
            borderLeft: '4px solid #111',
            paddingLeft: '12px',
          }}>
            {config.body}
          </p>

          {/* Brand Navigation */}
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            flexGrow: 1,
          }}>
            {/* Wire line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '20px',
              bottom: '20px',
              width: '3px',
              background: '#111',
              borderRadius: '2px',
              zIndex: 0,
            }} />

            {/* Hand pointer */}
            <svg
              style={{
                position: 'absolute',
                right: '-60px',
                width: '80px',
                height: '60px',
                transition: 'top 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                pointerEvents: 'none',
                zIndex: 10,
                top: `${-10 + (handPosition * 54)}px`,
              }}
              viewBox="0 0 105 85"
              fill="none"
            >
              <g filter="url(#filter0_d)">
                <path d="M14.5 28.5C14.5 28.5 29.5 35.5 38.5 35.5C47.5 35.5 61.5 23 61.5 23L93.5 23C96.5 23 99 26 99 29.5C99 33 96.5 36 93.5 36H72.5" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <path d="M12.5 42.5C21.5 42.5 37.5 40.5 37.5 40.5" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <rect x="4" y="24" width="20" height="30" rx="10" fill="white" stroke="black" strokeWidth="4"/>
                <path d="M68 23L62.5 13.5C61.3 11.1 63.5 8.5 66 9.5L92 20" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <filter id="filter0_d" x="0" y="0" width="105" height="85" filterUnits="userSpaceOnUse">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dx="4" dy="4"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
              </defs>
            </svg>

            {config.brandKeys.map((key, index) => {
              const brand = config.data[key];
              return (
                <div
                  key={key}
                  className={`nav-item-btn ${activeBrand === key ? 'active' : ''}`}
                  onClick={() => handleBrandClick(key, index)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div
                    className="nav-logo-circle"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: '#fff',
                      border: '3px solid #111',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      padding: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'grayscale(100%)',
                        transition: 'filter 0.2s ease',
                      }}
                    />
                  </div>
                  <span
                    className="nav-text-label"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '1.1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      opacity: activeBrand === key ? 1 : 0.5,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {brand.title}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT PANEL */}
        <main
          className="right-panel"
          style={{
            background: '#fff',
            padding: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            height: '100%',
            minHeight: 0,
          }}
        >
          <div
            key={activeBrand}
            className="modal-content-area"
            style={{
              padding: '40px 50px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {/* Header */}
            <div style={{
              marginBottom: '30px',
              borderBottom: '3px dashed #111',
              paddingBottom: '24px',
            }}>
              <span style={{
                display: 'inline-block',
                background: '#111',
                color: config.bgColor,
                padding: '6px 12px',
                fontFamily: "'Roobert', 'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                marginBottom: '10px',
                borderRadius: '4px',
              }}>
                {brandData.role}
              </span>

              <h2 style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '2.8rem',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {brandData.title}
              </h2>

              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.8rem',
              }}>
                {brandData.period}
              </div>

              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                lineHeight: 1.5,
                marginTop: '16px',
                color: '#333',
              }}>
                {brandData.desc}
              </p>
            </div>

            {/* Campaigns Grid with Images */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}>
              {brandData.campaigns.map((campaign: any, idx: number) => (
                <div
                  key={idx}
                  className="campaign-card"
                  style={{
                    background: '#fff',
                    border: '3px solid #111',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '6px 6px 0px #111',
                    cursor: 'default',
                    overflow: 'hidden',
                  }}
                >
                  {/* Campaign Image */}
                  {campaign.image && (
                    <div style={{
                      width: '100%',
                      height: '140px',
                      overflow: 'hidden',
                      borderBottom: '3px solid #111',
                    }}>
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      border: '2px solid #111',
                      padding: '3px 6px',
                      borderRadius: '20px',
                      marginBottom: '8px',
                      background: config.bgColor,
                      fontFamily: "'Outfit', sans-serif",
                    }}>
                      {campaign.tag}
                    </span>

                    <h3 style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '1.2rem',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      color: '#111',
                    }}>
                      {campaign.title}
                    </h3>

                    <p style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.85rem',
                      color: '#444',
                      lineHeight: 1.4,
                    }}>
                      {campaign.text}
                    </p>

                    {campaign.results && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '2px dashed #ddd',
                      }}>
                        <div style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: '#999',
                          marginBottom: '6px',
                          fontFamily: "'Outfit', sans-serif",
                        }}>
                          Results
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {campaign.results.map((result: string, rIdx: number) => (
                            <span
                              key={rIdx}
                              style={{
                                background: '#111',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                fontFamily: "'Outfit', sans-serif",
                              }}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
