/* Real published advertising benchmarks — no modeled or invented numbers.
   Every dataset cites its source; rows carry per-row sources where they
   differ. Country CPMs are refreshed live from the source at request time
   (see livedata.ts); the values here are the fallback snapshot. */

export type Mode = "adwords" | "locations";
export type IndustryMetric = "cpc" | "ctr" | "cvr";

export interface BenchmarkRow {
  id: string;
  label: string;
  value: number; // the set's primary metric (CPC or CPM, USD)
  ctr?: number; // avg. click-through rate, %
  cvr?: number; // avg. conversion rate, %
  sourceName?: string;
  sourceUrl?: string;
}

export interface BenchmarkSet {
  unit: "CPC" | "CPM";
  unitLabel: string;
  title: string;
  asOf: string; // when the source last published these figures
  sourceName: string;
  sourceUrl: string;
  rows: BenchmarkRow[];
}

/* ---- Google Ads by industry: avg CPC, CTR, conversion rate ----
   WordStream/LocaliQ 2026 benchmarks, data April 1 2025 – March 31 2026.
   All three metrics come from the same study and period. */

export const INDUSTRY_CPC: BenchmarkSet = {
  unit: "CPC",
  unitLabel: "avg. cost per click, Google Search",
  title: "Google Ads average CPC by industry",
  asOf: "Apr 2025 – Mar 2026 data",
  sourceName: "WordStream / LocaliQ 2026 Google Ads benchmarks",
  sourceUrl: "https://www.wordstream.com/blog/2026-google-ads-benchmarks",
  rows: [
    { id: "legal", label: "Attorneys & Legal", value: 9.87, ctr: 5.87, cvr: 5.55 },
    { id: "home", label: "Home Improvement", value: 8.33, ctr: 6.47, cvr: 8.05 },
    { id: "dental", label: "Dentists & Dental", value: 8.0, ctr: 5.66, cvr: 10.67 },
    { id: "personal-services", label: "Personal Services", value: 7.17, ctr: 7.16, cvr: 12.34 },
    { id: "fitness", label: "Health & Fitness", value: 6.17, ctr: 5.81, cvr: 6.94 },
    { id: "business", label: "Business Services", value: 5.87, ctr: 6.1, cvr: 4.85 },
    { id: "industrial", label: "Industrial & Commercial", value: 5.87, ctr: 6.57, cvr: 8.2 },
    { id: "career", label: "Career & Employment", value: 5.81, ctr: 5.88, cvr: 3.05 },
    { id: "education", label: "Education", value: 4.81, ctr: 7.56, cvr: 13.14 },
    { id: "physicians", label: "Physicians & Surgeons", value: 4.76, ctr: 6.61, cvr: 12.43 },
    { id: "beauty", label: "Beauty & Personal Care", value: 4.62, ctr: 6.75, cvr: 10.35 },
    { id: "apparel", label: "Apparel & Jewelry", value: 4.44, ctr: 6.64, cvr: 4.5 },
    { id: "auto-repair", label: "Auto Repair & Parts", value: 4.35, ctr: 5.56, cvr: 15.51 },
    { id: "shopping", label: "Shopping & Gifts", value: 4.14, ctr: 8.28, cvr: 4.01 },
    { id: "pets", label: "Animals & Pets", value: 4.06, ctr: 7.49, cvr: 16.22 },
    { id: "furniture", label: "Furniture", value: 3.97, ctr: 6.57, cvr: 2.99 },
    { id: "finance", label: "Finance & Insurance", value: 3.39, ctr: 9.83, cvr: 2.64 },
    { id: "real-estate", label: "Real Estate", value: 3.22, ctr: 7.61, cvr: 3.7 },
    { id: "sports", label: "Sports & Recreation", value: 2.77, ctr: 8.75, cvr: 7.69 },
    { id: "auto-sales", label: "Automotive — For Sale", value: 2.27, ctr: 8.28, cvr: 6.01 },
    { id: "travel", label: "Travel", value: 2.14, ctr: 9.32, cvr: 5.83 },
    { id: "restaurants", label: "Restaurants & Food", value: 2.05, ctr: 6.83, cvr: 8.05 },
    { id: "entertainment", label: "Arts & Entertainment", value: 1.63, ctr: 12.75, cvr: 5.91 },
  ],
};

/* ---- Meta (Facebook + Instagram) CPM by country ----
   Lebesgue's dataset; fallback snapshot as of March 2026. The page is
   re-fetched server-side daily and supersedes these values when it parses. */

export const COUNTRY_CPM: BenchmarkSet = {
  unit: "CPM",
  unitLabel: "avg. Meta CPM (cost per 1,000 impressions)",
  title: "Meta ads average CPM by country",
  asOf: "Mar 2026",
  sourceName: "Lebesgue (ad analytics), Facebook CPM by country",
  sourceUrl: "https://lebesgue.io/facebook-ads/facebook-cpm-by-country",
  rows: [
    { id: "united-states", label: "United States", value: 16.08 },
    { id: "saudi-arabia", label: "Saudi Arabia", value: 12.01 },
    { id: "united-kingdom", label: "United Kingdom", value: 11.81 },
    { id: "australia", label: "Australia", value: 11.63 },
    { id: "canada", label: "Canada", value: 11.47 },
    { id: "united-arab-emirates", label: "United Arab Emirates", value: 10.0 },
    { id: "germany", label: "Germany", value: 9.05 },
    { id: "france", label: "France", value: 6.95 },
    { id: "japan", label: "Japan", value: 6.73 },
    { id: "mexico", label: "Mexico", value: 3.92 },
    { id: "philippines", label: "Philippines", value: 3.4 },
    { id: "brazil", label: "Brazil", value: 2.63 },
    { id: "india", label: "India", value: 1.36 },
  ],
};

/* ---- Campaign channels: latest credible published rate per channel ----
   Used by the campaign planner. Each channel carries its own source and
   date; channels whose only published figures are >1 year old are not
   listed. Google Search rates come from the industry table above. */

export interface Channel {
  id: string;
  label: string;
  cpm?: number; // USD per 1,000 impressions
  cpc?: number; // USD per click
  ctr?: number; // %, where published alongside the cost figures
  defaultOn: boolean;
  note: string;
  asOf: string;
  sourceName: string;
  sourceUrl: string;
}

export const CHANNELS: Channel[] = [
  {
    id: "google-search",
    label: "Google Search",
    defaultOn: true,
    note: "CPC, CTR and conv. rate set by the industry you pick",
    asOf: "Apr 2025 – Mar 2026",
    sourceName: "WordStream / LocaliQ 2026 Google Ads benchmarks",
    sourceUrl: "https://www.wordstream.com/blog/2026-google-ads-benchmarks",
  },
  {
    id: "meta",
    label: "Meta (FB + IG)",
    cpm: 14.19,
    ctr: 2.19,
    defaultOn: true,
    note: "2025 average across ~35,000 brands",
    asOf: "2025 full year, published Apr 2026",
    sourceName: "Triple Whale, Meta benchmarks (~35k brands)",
    sourceUrl: "https://www.triplewhale.com/blog/facebook-ads-benchmarks",
  },
  {
    id: "tiktok",
    label: "TikTok",
    cpm: 4.67,
    cpc: 0.49,
    defaultOn: true,
    note: "latest published tracker month",
    asOf: "Oct 2025",
    sourceName: "Gupta Media, social ads cost tracker",
    sourceUrl: "https://www.guptamedia.com/social-media-ads-cost",
  },
  {
    id: "youtube",
    label: "YouTube",
    cpm: 7.61,
    defaultOn: true,
    note: "latest published tracker month",
    asOf: "Oct 2025",
    sourceName: "Gupta Media, social ads cost tracker",
    sourceUrl: "https://www.guptamedia.com/social-media-ads-cost",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    cpm: 33.8,
    cpc: 5.58,
    defaultOn: false,
    note: "B2B targeting typical",
    asOf: "2026 guide",
    sourceName: "The B2B House, LinkedIn ad benchmarks",
    sourceUrl: "https://www.theb2bhouse.com/linkedin-ad-benchmarks/",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    cpm: 12.84,
    cpc: 0.51,
    defaultOn: false,
    note: "latest published tracker month",
    asOf: "Oct 2025",
    sourceName: "Gupta Media, social ads cost tracker",
    sourceUrl: "https://www.guptamedia.com/social-media-ads-cost",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    cpm: 4.67,
    defaultOn: false,
    note: "2025 annual average",
    asOf: "2025",
    sourceName: "Gupta Media, social ads cost tracker",
    sourceUrl: "https://www.guptamedia.com/social-media-ads-cost",
  },
];

/* ---- Query matching ---- */

const KEYWORD_ALIASES: Record<string, string> = {
  lawyer: "legal", attorney: "legal", legal: "legal", "law firm": "legal",
  plumber: "home", roofing: "home", hvac: "home", contractor: "home",
  "home improvement": "home", remodel: "home",
  dentist: "dental", dental: "dental", invisalign: "dental",
  cleaning: "personal-services", "moving company": "personal-services",
  movers: "personal-services",
  gym: "fitness", fitness: "fitness", yoga: "fitness", supplements: "fitness",
  chiropractor: "fitness",
  crm: "business", saas: "business", software: "business", b2b: "business",
  consulting: "business",
  manufacturing: "industrial", industrial: "industrial",
  jobs: "career", hiring: "career", recruiting: "career", staffing: "career",
  college: "education", mba: "education", "online course": "education",
  degree: "education", bootcamp: "education",
  doctor: "physicians", dermatologist: "physicians", surgeon: "physicians",
  salon: "beauty", skincare: "beauty", makeup: "beauty", spa: "beauty",
  "running shoes": "apparel", sneakers: "apparel", clothing: "apparel",
  fashion: "apparel", jewelry: "apparel", apparel: "apparel", shoes: "apparel",
  mechanic: "auto-repair", tires: "auto-repair", "oil change": "auto-repair",
  "auto repair": "auto-repair",
  gifts: "shopping", collectibles: "shopping", ecommerce: "shopping",
  "online store": "shopping",
  "dog food": "pets", vet: "pets", pets: "pets", veterinarian: "pets",
  sofa: "furniture", mattress: "furniture", furniture: "furniture",
  insurance: "finance", loans: "finance", mortgage: "finance",
  credit: "finance", banking: "finance", finance: "finance",
  realtor: "real-estate", "homes for sale": "real-estate",
  "real estate": "real-estate", apartments: "real-estate",
  golf: "sports", bike: "sports", ski: "sports", sports: "sports",
  "used cars": "auto-sales", "cars for sale": "auto-sales",
  dealership: "auto-sales",
  flights: "travel", hotels: "travel", vacation: "travel", travel: "travel",
  cruise: "travel",
  restaurant: "restaurants", pizza: "restaurants",
  "food delivery": "restaurants", catering: "restaurants",
  "streaming service": "entertainment", movies: "entertainment",
  concerts: "entertainment", tickets: "entertainment",
};

/* alias → canonical country label (matched against whichever row set is active) */
const COUNTRY_ALIASES: Record<string, string> = {
  usa: "United States", us: "United States", america: "United States",
  "united states": "United States",
  uk: "United Kingdom", britain: "United Kingdom", england: "United Kingdom",
  uae: "United Arab Emirates", emirates: "United Arab Emirates",
  dubai: "United Arab Emirates",
  saudi: "Saudi Arabia",
  holland: "Netherlands",
  korea: "South Korea",
};

export function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function matchIndustry(query: string): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (KEYWORD_ALIASES[q]) return KEYWORD_ALIASES[q];
  for (const [alias, id] of Object.entries(KEYWORD_ALIASES)) {
    if (q.includes(alias) || alias.includes(q)) return id;
  }
  for (const row of INDUSTRY_CPC.rows) {
    const label = row.label.toLowerCase();
    if (label.includes(q) || q.includes(label)) return row.id;
  }
  return null;
}

export function matchCountry(query: string, labels: string[]): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const aliased = COUNTRY_ALIASES[q];
  if (aliased && labels.includes(aliased)) return aliased;
  for (const label of labels) {
    const l = label.toLowerCase();
    if (l === q || l.includes(q) || q.includes(l)) return label;
  }
  return null;
}

export function formatUsd(v: number): string {
  return v >= 100
    ? `$${Math.round(v).toLocaleString("en-US")}`
    : `$${v.toFixed(2)}`;
}

export function formatPct(v: number): string {
  return `${v.toFixed(2)}%`;
}
