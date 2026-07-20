import type { Metadata } from "next";
import AdsimClient from "./AdsimClient";
import { fetchLiveCountryCpms } from "./livedata";

export const metadata: Metadata = {
  title: "Adsim | What ad spots really cost",
  description:
    "Real published ad-pricing benchmarks — CPC, CTR and conversion rate by industry, CPM by platform and by country — for presenting paid media.",
};

/* Statically prerendered like the rest of the site — the live source is
   fetched once per deploy at build time (8s timeout, baked fallback).
   A scheduled rebuild hook can restore daily freshness without ISR. */
export default async function AdsimPage() {
  const liveCountries = await fetchLiveCountryCpms();
  return <AdsimClient liveCountries={liveCountries} />;
}
