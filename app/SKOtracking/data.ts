/* Typed view over data.json.

   data.json is the single source of truth: this page reads it, and
   scripts/build-tracking-xlsx.py generates public/sko-tracking.xlsx from the
   same file. Edit the JSON — never edit the sheet or the page directly, or
   the two will disagree and the sheet stops being trustworthy.

   The "runtime" flag means the tag was observed loading on the live site,
   as distinct from what the implementation notes claim is installed. */

import raw from "./data.json";

export type Health = "live" | "degraded" | "unverified" | "broken";
export type Severity = "blocker" | "high" | "medium";

export type Source = {
  platform: string;
  id: string;
  runtime: boolean;
  browserEvents: string[];
  serverEvents: string | null;
  dedupeKey: string | null;
  secrets: string[];
  hookPoint: string;
  health: Health;
  note: string;
};

export type Coverage = {
  step: string;
  openai: string;
  meta: string;
  tiktok: string;
};

export type Issue = {
  id: string;
  title: string;
  severity: Severity;
  platform: string;
  detail: string;
  fix: string;
  status: string;
};

export type Metric = {
  metric: string;
  actual: number | null;
  goal: number | null;
  unit: "usd" | "x" | "count";
  source: string;
};

export type TopAd = {
  ad: string;
  platform: string;
  spend: number | null;
  revenue: number | null;
  roas: number | null;
  why: string;
};

export const LAST_VERIFIED: string = raw.lastVerified;
export const SOURCES = raw.sources as Source[];
export const COVERAGE = raw.coverage as Coverage[];
export const ISSUES = raw.issues as Issue[];
export const CAMPAIGN = raw.campaign;
export const WEEK_OF: string = raw.weekOf;
export const SCORECARD = raw.scorecard as Metric[];
export const TOP_ADS = raw.topAds as TopAd[];
export const UGC_NOTE: string = raw.ugcNote;

/** Formats a scorecard cell, keeping empty values visibly empty rather than
 *  rendering a misleading zero. */
export function fmt(v: number | null, unit: Metric["unit"]): string {
  if (v === null || v === undefined) return "—";
  if (unit === "usd") return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (unit === "x") return `${v.toFixed(2)}×`;
  return v.toLocaleString("en-US");
}
