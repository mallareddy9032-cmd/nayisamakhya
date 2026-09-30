import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatewideSurveyWizard } from "@/components/survey/StatewideSurveyWizard";

export const metadata: Metadata = {
  title: "Statewide Community Survey | Nayi Samakhya",
  description:
    "Telangana statewide community, livelihood, welfare & matrimonial survey for Nayi Brahmin, Mangali, Bajantri and allied households.",
  alternates: { canonical: "/survey" },
};

export default function StatewideSurveyPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FBFBFA]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="tap inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F4F4F2]"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              Nayi Samakhya · Statewide
            </p>
            <h1 className="truncate font-display-te text-lg font-normal leading-snug text-[#0F172A] sm:text-xl">
              రాష్ట్రవ్యాప్త సమాజ సర్వే
            </h1>
            <p className="truncate text-xs text-[#64748B]">
              Community · Livelihood · Matrimonial
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 pb-28">
        <p className="mb-4 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 font-telugu text-sm leading-relaxed text-[#1E293B]">
          మీ మొత్తం కుటుంబాన్ని దశలవారీగా నమోదు చేయండి — అర్హులైన వివాహ అభ్యర్థులను
          అదే సమయంలో ప్లాట్‌ఫామ్‌కు నమోదు చేయవచ్చు.
          <span className="mt-1 block text-xs text-[#64748B]">
            Document the entire household step by step while instantly
            registering eligible candidates for the matrimonial platform.
          </span>
        </p>
        <StatewideSurveyWizard />
      </div>
    </div>
  );
}
