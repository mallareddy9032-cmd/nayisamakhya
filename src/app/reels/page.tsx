import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clapperboard } from "lucide-react";
import { ReelsClient } from "@/components/reels/ReelsClient";

export const metadata: Metadata = {
  title: "మన కళ - మన ఆత్మగౌరవం | 60-Second Reel Contest",
  description:
    "Nayi Samakhya Competition 2 — submit a 60-second mobile reel on salon craft, nadaswaram music, or youth education. Community pride storytelling contest.",
  alternates: { canonical: "/reels" },
};

export default function ReelsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FBFBFA]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="tap inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F4F4F2]"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              <Clapperboard className="h-3 w-3" aria-hidden />
              Competition 2 · మన కళ
            </p>
            <p className="truncate text-[11px] text-[#64748B] sm:text-xs">
              Reel Contest &amp; Showcase Hub
            </p>
          </div>
          <Link
            href="/sprint"
            className="tap hidden shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-telugu text-[10px] font-bold text-amber-800 sm:inline-flex"
          >
            సేవా సారథి
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8">
        <header className="mb-8 max-w-3xl">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-1 font-telugu text-xs font-semibold text-[#B45309]">
            ⚡ 60-సెకన్ల నిబంధనలు (60-Second Rules)
          </p>
          <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-slate-900 sm:text-4xl">
            మన కళ - మన ఆత్మగౌరవం
          </h1>
          <p className="mt-2 text-xl text-amber-700">
            60-Second Mobile Reel &amp; Storytelling Challenge
          </p>
          <p className="mt-3 font-telugu text-sm leading-relaxed text-[#475569] sm:text-base">
            మన సంప్రదాయ కళలు — సెలూన్, నాదస్వరం, యువ విద్యా — 60-సెకన్ల రీల్‌లో
            చూపించి{" "}
            <span className="font-bold text-[#B45309]">ఆత్మగౌరవం</span>{" "}
            పంచుకోండి.
          </p>
        </header>

        <ReelsClient />
      </div>
    </div>
  );
}
