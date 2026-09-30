import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { ProcureClient } from "@/components/salon-hub/ProcureClient";

export const metadata: Metadata = {
  title: "సమూహ ఇండెంట్ | Group Procure",
  description:
    "Nayi Samakhya salon group indent — monthly demand window (1–5), bundles A/B/C, COD/UPI at mandal hub.",
  alternates: { canonical: "/salon-hub/procure" },
};

export default function SalonHubProcurePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome
        title="సమూహ ఇండెంట్"
        subtitle="Group procure · Mandal hub COD/UPI"
      />
      <div className="mx-auto max-w-3xl px-4 py-5 pb-28">
        <ProcureClient />
      </div>
    </div>
  );
}
