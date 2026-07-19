import type { Metadata } from "next";
import AdsimClient from "./AdsimClient";

export const metadata: Metadata = {
  title: "Adsim | What ad spots really cost",
  description:
    "Real published ad-pricing benchmarks — CPC by industry, CPM by platform and by country — in an interactive 3D chart built for presenting paid media.",
};

export default function AdsimPage() {
  return <AdsimClient />;
}
