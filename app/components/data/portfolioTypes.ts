// ============================================
// VORTEX PORTFOLIO — Type Definitions
// ============================================

export interface Campaign {
  title: string;
  text: string;
  tag: string;
  image: string;
  results?: string[];
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  role: string;
  desc: string;
  campaigns: Campaign[];
  skills: string[];
  tools: string[];
}

export type CompanyCategory = 'creative' | 'media' | 'startup' | 'personal';

export interface Company {
  id: string;
  name: string;
  logo: string;
  role: string;
  period: string;
  color: string;
  category: CompanyCategory;
  desc: string;
  clients: Client[];
  /** Direct campaigns (for companies with no sub-clients) */
  campaigns: Campaign[];
  skills: string[];
  tools: string[];
}
