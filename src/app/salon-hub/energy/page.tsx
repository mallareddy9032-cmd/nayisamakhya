import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { EnergyClient } from "@/components/salon-hub/EnergyClient";

export const metadata: Metadata = {
  title: "సెలూన్ విద్యుత్ & ఏసీ లోడ్ ప్లానర్ | G.O. 23 Safe-AC",
  description:
    "G.O. Ms. No. 23 Safe-AC & Energy Planner — estimate salon units, stay within 250 free units, print Green Salon Load Certificate.",
  alternates: { canonical: "/salon-hub/energy" },
};

export default function SalonHubEnergyPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome />
      <div className="mx-auto max-w-6xl px-4 py-6 pb-28 print:max-w-none print:px-0 print:py-0 print:pb-0">
        <EnergyClient />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body * { visibility: hidden !important; }
          #salon-energy-certificate,
          #salon-energy-certificate * { visibility: visible !important; }
          #salon-energy-certificate {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
