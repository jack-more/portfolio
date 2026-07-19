/* Real published advertising benchmarks — no modeled or invented numbers.
   Every dataset cites its source; rows carry per-row sources where they differ. */

export type Mode = "adwords" | "locations";

export interface BenchmarkRow {
  id: string;
  label: string;
  value: number;
  sourceName?: string;
  sourceUrl?: string;
}

export interface BenchmarkSet {
  unit: "CPC" | "CPM";
  unitLabel: string; // "avg. cost per click"
  title: string;
  asOf: string; // when the source last published these figures
  sourceName: string;
  sourceUrl: string;
  rows: BenchmarkRow[];
}

/* ---- Google Ads average CPC by industry ----
   WordStream/LocaliQ 2026 benchmarks, data April 1 2025 – March 31 2026. */

export const INDUSTRY_CPC: BenchmarkSet = {
  unit: "CPC",
  unitLabel: "avg. cost per click, Google Search",
  title: "Google Ads average CPC by industry",
  asOf: "Apr 2025 – Mar 2026 data",
  sourceName: "WordStream / LocaliQ 2026 Google Ads benchmarks",
  sourceUrl: "https://www.wordstream.com/blog/2026-google-ads-benchmarks",
  rows: [
    { id: "legal", label: "Attorneys & Legal", value: 9.87 },
    { id: "home", label: "Home Improvement", value: 8.33 },
    { id: "dental", label: "Dentists & Dental", value: 8.0 },
    { id: "personal-services", label: "Personal Services", value: 7.17 },
    { id: "fitness", label: "Health & Fitness", value: 6.17 },
    { id: "business", label: "Business Services", value: 5.87 },
    { id: "industrial", label: "Industrial & Commercial", value: 5.87 },
    { id: "career", label: "Career & Employment", value: 5.81 },
    { id: "education", label: "Education", value: 4.81 },
    { id: "physicians", label: "Physicians & Surgeons", value: 4.76 },
    { id: "beauty", label: "Beauty & Personal Care", value: 4.62 },
    { id: "apparel", label: "Apparel & Jewelry", value: 4.44 },
    { id: "auto-repair", label: "Auto Repair & Parts", value: 4.35 },
    { id: "shopping", label: "Shopping & Gifts", value: 4.14 },
    { id: "pets", label: "Animals & Pets", value: 4.06 },
    { id: "furniture", label: "Furniture", value: 3.97 },
    { id: "finance", label: "Finance & Insurance", value: 3.39 },
    { id: "real-estate", label: "Real Estate", value: 3.22 },
    { id: "sports", label: "Sports & Recreation", value: 2.77 },
    { id: "auto-sales", label: "Automotive — For Sale", value: 2.27 },
    { id: "travel", label: "Travel", value: 2.14 },
    { id: "restaurants", label: "Restaurants & Food", value: 2.05 },
    { id: "entertainment", label: "Arts & Entertainment", value: 1.63 },
  ],
};

/* ---- Meta (Facebook + Instagram) CPM by country ----
   Lebesgue 2026 Facebook CPM-by-country dataset. */

export const COUNTRY_CPM: BenchmarkSet = {
  unit: "CPM",
  unitLabel: "avg. Meta CPM (cost per 1,000 impressions)",
  title: "Meta ads average CPM by country",
  asOf: "Mar 2026",
  sourceName: "Lebesgue, Facebook CPM by country",
  sourceUrl: "https://lebesgue.io/facebook-ads/facebook-cpm-by-country",
  rows: [
    { id: "us", label: "United States", value: 16.08 },
    { id: "sa", label: "Saudi Arabia", value: 12.01 },
    { id: "uk", label: "United Kingdom", value: 11.81 },
    { id: "au", label: "Australia", value: 11.63 },
    { id: "ca", label: "Canada", value: 11.47 },
    { id: "ae", label: "UAE", value: 10.0 },
    { id: "de", label: "Germany", value: 9.05 },
    { id: "fr", label: "France", value: 6.95 },
    { id: "jp", label: "Japan", value: 6.73 },
    { id: "mx", label: "Mexico", value: 3.92 },
    { id: "ph", label: "Philippines", value: 3.4 },
    { id: "br", label: "Brazil", value: 2.63 },
    { id: "in", label: "India", value: 1.36 },
  ],
};

/* ---- Average CPM by platform (default view) ----
   Gupta Media tracker (Oct 2025) unless noted per row. */

const GUPTA = {
  sourceName: "Gupta Media, social ads cost tracker",
  sourceUrl: "https://www.guptamedia.com/social-media-ads-cost",
};

export const PLATFORM_CPM: BenchmarkSet = {
  unit: "CPM",
  unitLabel: "avg. CPM (cost per 1,000 impressions)",
  title: "Average CPM by platform",
  asOf: "2025 annual averages",
  sourceName: GUPTA.sourceName,
  sourceUrl: GUPTA.sourceUrl,
  rows: [
    {
      id: "linkedin",
      label: "LinkedIn",
      value: 33.8,
      sourceName: "The B2B House, LinkedIn ad benchmarks (2026)",
      sourceUrl: "https://www.theb2bhouse.com/linkedin-ad-benchmarks/",
    },
    { id: "snapchat", label: "Snapchat", value: 8.6, ...GUPTA },
    { id: "meta", label: "Meta (FB + IG)", value: 8.19, ...GUPTA },
    { id: "youtube", label: "YouTube", value: 7.61, ...GUPTA },
    {
      id: "ig-stories",
      label: "Instagram Stories",
      value: 7.25,
      sourceName: "Gupta Media, Instagram ads cost (Jan 2025)",
      sourceUrl: "https://www.guptamedia.com/insights/instagram-ads-cost",
    },
    { id: "tiktok", label: "TikTok", value: 4.82, ...GUPTA },
    { id: "pinterest", label: "Pinterest", value: 4.67, ...GUPTA },
    {
      id: "ig-reels",
      label: "Instagram Reels",
      value: 4.29,
      sourceName: "Gupta Media, Instagram ads cost (Jan 2025)",
      sourceUrl: "https://www.guptamedia.com/insights/instagram-ads-cost",
    },
    {
      id: "x",
      label: "X (Twitter)",
      value: 0.86,
      sourceName: "Gupta Media data via Statista (late 2025)",
      sourceUrl:
        "https://www.statista.com/chart/31144/cpm-advertising-price-on-social-media-platforms-timeline/",
    },
  ],
};

/* ---- Query matching (aliases → dataset row ids) ---- */

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

const COUNTRY_ALIASES: Record<string, string> = {
  usa: "us", us: "us", "united states": "us", america: "us",
  "saudi arabia": "sa", saudi: "sa",
  uk: "uk", "united kingdom": "uk", britain: "uk", england: "uk",
  australia: "au",
  canada: "ca",
  uae: "ae", emirates: "ae", dubai: "ae",
  germany: "de",
  france: "fr",
  japan: "jp",
  mexico: "mx",
  philippines: "ph",
  brazil: "br",
  india: "in",
};

export function datasetFor(mode: Mode): BenchmarkSet {
  return mode === "adwords" ? INDUSTRY_CPC : COUNTRY_CPM;
}

export function matchQuery(mode: Mode, query: string): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const set = datasetFor(mode);
  const aliases = mode === "adwords" ? KEYWORD_ALIASES : COUNTRY_ALIASES;
  if (aliases[q]) return aliases[q];
  // substring match against aliases, then against row labels
  for (const [alias, id] of Object.entries(aliases)) {
    if (q.includes(alias) || alias.includes(q)) return id;
  }
  for (const row of set.rows) {
    const label = row.label.toLowerCase();
    if (label.includes(q) || q.includes(label)) return row.id;
  }
  return null;
}

export function formatUsd(v: number): string {
  return v >= 100 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`;
}
