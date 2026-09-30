import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { DistrictsSearchHub } from "@/components/districts/DistrictsSearchHub";
import {
  TELANGANA_DISTRICT_COUNT,
  TELANGANA_MANDAL_COUNT,
  TELANGANA_TOWN_COUNT,
  listGeoDistricts,
} from "@/data/telanganaGeo";

export const metadata: Metadata = {
  title:
    "తెలంగాణ సమగ్ర జిల్లా & మండల సేవా నెట్‌వర్క్ | Statewide Civic Directory",
  description:
    "33 జిల్లాలు, 589 మండలాలు — నాయి సమాఖ్య అధికారిక స్టేట్‌వైడ్ సివిక్ డైరెక్టరీ. జిల్లా, మండలం, పట్టణం వెతకండి.",
  openGraph: {
    title: "Statewide Civic Directory — Nayi Samakhya",
    description:
      "Telangana’s 33 districts and 589 mandals — official Nayi Samakhya service desks.",
    url: "/districts",
  },
};

export default function DistrictsHubPage() {
  const districts = listGeoDistricts();

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] antialiased">
      <div className="border-b border-slate-700/50 bg-[#1E293B] px-4 py-1.5 text-center text-[11px] text-slate-200">
        <span className="font-telugu">
          అధికారిక స్టేట్‌వైడ్ డైరెక్టరీ — {TELANGANA_DISTRICT_COUNT} జిల్లాలు
          &amp; {TELANGANA_MANDAL_COUNT} మండలాలు
        </span>
      </div>

      <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="civic-focus-ring flex min-h-11 items-center gap-2 rounded-xl px-1"
          >
            <span className="rounded-xl border border-[#B45309]/20 bg-[#B45309]/10 p-2 text-[#B45309]">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="font-telugu block text-sm font-bold text-[#0F172A]">
                నాయి సమాఖ్య తెలంగాణ
              </span>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Civic Directory
              </span>
            </span>
          </Link>
          <nav
            aria-label="Breadcrumb"
            className="font-sans hidden items-center gap-1 text-xs text-slate-500 sm:flex"
          >
            <Link href="/" className="civic-focus-ring rounded px-1 hover:text-[#B45309]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold text-[#0F172A]">Districts</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 max-w-3xl">
          <span className="civic-eyebrow-pill mb-3">
            Statewide Civic Directory
          </span>
          <h1 className="font-display-te text-[1.65rem] font-normal leading-[1.35] text-[#0F172A] sm:text-3xl md:text-4xl md:leading-[1.3]">
            తెలంగాణ సమగ్ర జిల్లా &amp; మండల సేవా నెట్‌వర్క్
          </h1>
          <p className="font-sans mt-2 text-sm font-medium uppercase tracking-widest text-slate-500">
            Statewide Civic Directory
          </p>
          <p className="font-telugu mt-3 text-sm leading-relaxed text-slate-600">
            ప్రతి జిల్లా మరియు మండలానికి అధికారిక సేవా డెస్క్ — వినతిపత్రం,
            సమన్వయకర్త బ్యాడ్జ్, WhatsApp కారిడార్ లింకులు ఒకే చోట.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#EAD7B5] bg-white px-3 py-1 font-telugu text-xs font-semibold text-[#1E293B]">
              {TELANGANA_DISTRICT_COUNT} జిల్లాలు
            </span>
            <span className="rounded-full border border-[#EAD7B5] bg-white px-3 py-1 font-telugu text-xs font-semibold text-[#1E293B]">
              {TELANGANA_MANDAL_COUNT} మండలాలు
            </span>
            <span className="rounded-full border border-[#EAD7B5] bg-white px-3 py-1 font-telugu text-xs font-semibold text-[#1E293B]">
              {TELANGANA_TOWN_COUNT} పట్టణాలు
            </span>
          </div>
        </div>

        <DistrictsSearchHub
          districts={districts}
          totalMandals={TELANGANA_MANDAL_COUNT}
          totalTowns={TELANGANA_TOWN_COUNT}
        />
      </main>
    </div>
  );
}
