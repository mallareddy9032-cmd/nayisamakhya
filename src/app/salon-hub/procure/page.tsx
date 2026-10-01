import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { ProcureClient } from "@/components/salon-hub/ProcureClient";

export const metadata: Metadata = {
  title: "సెలూన్ సమూహ సేకరణ (Group Procurement Hub)",
  description:
    "హోల్‌సేల్ ధరలకే నాణ్యమైన కటింగ్ కిట్లు మరియు సెలూన్ పరికరాల సమూహ ఆర్డర్.",
  alternates: { canonical: "/salon-hub/procure" },
};

export default function SalonHubProcurePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome />
      <div className="mx-auto max-w-6xl px-4 py-6 pb-28">
        <ProcureClient />
      </div>
    </div>
  );
}
