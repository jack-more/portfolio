import type { Metadata } from "next";
import AdsimClient from "./AdsimClient";
import { fetchLiveCountryCpms } from "./livedata";

export const metadata: Metadata = {
  title: "Adsim | What ad spots really cost",
  description:
    "Real published ad-pricing benchmarks — CPC, CTR and conversion rate by industry, CPM by platform and by country — for presenting paid media.",
};

export const revalidate = 86400; // re-check the live source daily

export default async function AdsimPage() {
  const liveCountries = await fetchLiveCountryCpms();
  return <AdsimClient liveCountries={liveCountries} />;
}
