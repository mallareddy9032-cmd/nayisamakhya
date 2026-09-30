import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { ProcureClient } from "@/components/salon-hub/ProcureClient";

export const metadata: Metadata = {
  title: "సెలూన్ సామాగ్రి సమూహ కొనుగోళ్లు | Group Indent Desk",
  description:
    "తెలంగాణలోని సెలూన్ యజమానులందరి డిమాండ్‌ను కలిపి, నేరుగా తయారీదారుల నుంచే 30% నుండి 45% తగ్గింపు ధరలకు నాణ్యమైన సామాగ్రిని మీ మండల కేంద్రానికి అందిస్తాము.",
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
