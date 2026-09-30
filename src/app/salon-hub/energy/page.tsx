import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { EnergyClient } from "@/components/salon-hub/EnergyClient";

export const metadata: Metadata = {
  title: "జీ.ఓ. 23 ఎనర్జీ ప్లానర్ | Green Salon Energy",
  description:
    "G.O. 23 energy planner — estimate salon units, stay within 250 free units, print Green Salon Energy Certificate.",
  alternates: { canonical: "/salon-hub/energy" },
};

export default function SalonHubEnergyPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome
        title="జీ.ఓ. 23 ఎనర్జీ ప్లానర్"
        subtitle="250 units free power planner"
      />
      <div className="mx-auto max-w-3xl px-4 py-5 pb-28 print:max-w-none print:px-0 print:py-0 print:pb-0">
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
