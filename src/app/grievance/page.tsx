import type { Metadata } from "next";
import { GrievanceDocketClient } from "@/components/grievance/GrievanceDocketClient";

export const metadata: Metadata = {
  title: "జీవో 23 ఫిర్యాదు డాకెట్ | G.O. Ms. No. 23 Grievance Docket",
  description:
    "Formal statutory representation generator for Telangana G.O. Ms. No. 23 free 250-unit salon power — intake form, printable A4 Telugu docket to DISCOM ADE, War Room notify.",
  alternates: { canonical: "/grievance" },
};

export default function GrievancePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8 print:max-w-none print:px-0 print:py-0 print:pb-0">
        <GrievanceDocketClient />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 20mm; }
          body * { visibility: hidden !important; }
          #grievance-docket-print,
          #grievance-docket-print * { visibility: visible !important; }
          #grievance-docket-print {
            display: flex !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
            color: #000 !important;
            font-family: "Noto Sans Telugu", "Gautami", Suranna, serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
