import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { QuizClient } from "@/components/quiz/QuizClient";
import { QUIZ_PASS_THRESHOLD } from "@/types/quiz";

export const metadata: Metadata = {
  title: "చట్ట హక్కుల అన్వేషి | Civic & Legal Rights Quiz",
  description: `Nayi Samakhya Competition 3 — 10-question bilingual quiz on G.O. Ms. No. 23, Telangana Municipalities Act 2019, BC welfare, and community heritage. Score ${QUIZ_PASS_THRESHOLD}+ for a printable Rights Guardian certificate.`,
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="no-print sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FBFBFA]/95 backdrop-blur-md print:hidden">
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
              <Scale className="h-3 w-3" aria-hidden />
              Competition 3 · చట్ట హక్కులు
            </p>
            <p className="truncate text-[11px] text-[#64748B] sm:text-xs">
              Civic Rights Quiz &amp; Certification Desk
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

      <div className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8 print:max-w-none print:px-0 print:py-0 print:pb-0">
        <header className="no-print mb-8 max-w-3xl print:hidden">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-3 py-1 font-telugu text-xs font-semibold text-[#B45309]">
            <Scale className="h-3.5 w-3.5" aria-hidden />
            Competition 3 · 10 ప్రశ్నలు · {QUIZ_PASS_THRESHOLD}+ సర్టిఫికేట్
          </p>
          <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-slate-900 sm:text-4xl">
            చట్ట హక్కుల అన్వేషి
          </h1>
          <p className="mt-2 text-xl text-amber-700">
            Civic &amp; Legal Rights Awareness Quiz
          </p>
          <p className="mt-3 font-telugu text-sm leading-relaxed text-[#475569] sm:text-base">
            జీ.ఓ. 23 ఉచిత విద్యుత్, మున్సిపల్ హక్కులు, బీసీ సంక్షేమం, మన వారసత్వం —
            తెలుసుకుని{" "}
            <span className="font-bold text-[#B45309]">ప్రజా హక్కుల రక్షకుడు</span>{" "}
            అవ్వండి.
          </p>
        </header>

        <QuizClient />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body * { visibility: hidden !important; }
          #quiz-certificate-print,
          #quiz-certificate-print * { visibility: visible !important; }
          #quiz-certificate-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            border: 4px solid #B45309 !important;
            border-radius: 0 !important;
            padding: 12mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
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
