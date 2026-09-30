import type { Metadata } from "next";
import { SalonHubChrome } from "@/components/salon-hub/SalonHubChrome";
import { LoansClient } from "@/components/salon-hub/LoansClient";

export const metadata: Metadata = {
  title: "సెలూన్ బ్యాంక్ లోన్ DPR జనరేటర్ | Mudra & BC Welfare DPR",
  description:
    "Print-ready salon bank DPR — capital outlay, 10% margin / 90% loan, EMI @ 9.5% × 36 mo, DSCR, PM Vishwakarma / PMEGP / BC Co-Op citation.",
  alternates: { canonical: "/salon-hub/loans" },
};

export default function SalonHubLoansPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <SalonHubChrome />
      <div className="mx-auto max-w-3xl px-4 py-6 pb-28 print:max-w-none print:px-0 print:py-0 print:pb-0">
        <LoansClient />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          body * { visibility: hidden !important; }
          #salon-loan-dossier,
          #salon-loan-dossier * { visibility: visible !important; }
          #salon-loan-dossier {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }
          .loan-dpr-page {
            break-after: page;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 0 8mm 0 !important;
          }
          .loan-dpr-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `,
        }}
      />
    </div>
  );
}
