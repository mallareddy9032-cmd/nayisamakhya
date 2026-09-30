import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { SprintClient } from "@/components/sprint/SprintClient";

export const metadata: Metadata = {
  title: "మండల సేవా సారథి | 5-Day Civic Challenge",
  description:
    "Register as a Nayi Samakhya field champion, share your survey link with వివాహ వేదిక & G.O. 23 message, and certify at 15 surveys.",
  alternates: { canonical: "/sprint" },
};

export default function SprintPage() {
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
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B45309]">
              <Trophy className="h-3 w-3" aria-hidden />
              Competition 1
            </p>
            <h1 className="font-display-te text-base font-normal leading-snug text-[#0F172A] sm:text-lg">
              <span className="text-[#B45309]">మండల సేవా సారథి</span>
              <span className="text-[#0F172A]">
                {" "}
                • 5-రోజుల ప్రజా సేవా ఛాలెంజ్
              </span>
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-5 pb-28">
        <p className="mb-5 rounded-xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] px-4 py-3 font-telugu text-sm leading-relaxed text-[#0F172A]">
          మీ మండలంలో సర్వే లింక్ షేర్ చేసి{" "}
          <span className="font-bold text-[#B45309]">15</span> కుటుంబాల నమోదు
          పూర్తి చేస్తే — సర్టిఫైడ్ సేవా సారథి బ్యాడ్జ్ + కోఆర్డినేటర్ కార్డు + జిల్లా
          వాట్సాప్ హబ్.
        </p>
        <SprintClient />
      </div>
    </div>
  );
}
