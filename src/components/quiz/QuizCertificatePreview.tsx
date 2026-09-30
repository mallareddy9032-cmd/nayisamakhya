"use client";

import { Award, Landmark, MapPin, QrCode } from "lucide-react";
import { QUIZ_PASS_THRESHOLD } from "@/types/quiz";

/**
 * Static gold-dashed preview shown beside registration —
 * motivates high scorers (≥7) toward the printable A4 certificate.
 */
export function QuizCertificatePreview() {
  return (
    <aside
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#B45309]/55 bg-gradient-to-b from-[#FFFDF8] via-white to-[#FBF7EF] p-5 shadow-[0_12px_36px_rgba(180,83,9,0.12)] sm:p-6"
      aria-label="సర్టిఫికేట్ మునుజూపు"
    >
      <div
        className="pointer-events-none absolute inset-3 rounded-xl border border-[#B45309]/25"
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#B45309] bg-[#B45309]/10 text-[#B45309]">
          <Landmark className="h-7 w-7" aria-hidden />
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B45309]">
          Nayi Samakhya · Telangana
        </p>
        <h2 className="mt-1 font-display-te text-xl font-normal leading-snug text-slate-900 sm:text-2xl">
          ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు
        </h2>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92400E]">
          Certified Civic Rights Guardian
        </p>
      </div>

      <div className="relative my-5 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#B45309]/40" aria-hidden />
        <span className="font-telugu text-[11px] font-bold tracking-wide text-[#B45309]">
          సర్టిఫికేట్ ఆఫ్ మెరిట్
        </span>
        <span className="h-px w-10 bg-[#B45309]/40" aria-hidden />
      </div>

      <div className="relative rounded-xl border border-[#B45309]/25 bg-white/70 px-4 py-4 text-center">
        <p className="font-telugu text-xs text-[#64748B]">మీ పేరు ఇక్కడ కనిపిస్తుంది</p>
        <p className="mt-1 font-display-te text-2xl font-normal text-slate-900">
          — — —
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/30 bg-[#B45309]/10 px-2.5 py-1 font-telugu text-[11px] font-bold text-[#B45309]">
          <MapPin className="h-3 w-3" aria-hidden />
          మండలం · జిల్లా బ్యాడ్జ్
        </p>
        <p className="mt-3 font-telugu text-sm text-[#0F172A]">
          స్కోర్{" "}
          <span className="font-bold text-[#B45309]">
            {QUIZ_PASS_THRESHOLD}+/10
          </span>{" "}
          · జీ.ఓ. 23 · మున్సిపల్ చట్టం
        </p>
      </div>

      <div className="relative mt-5 flex items-end justify-between gap-3">
        <div className="text-left">
          <p className="flex items-center gap-1 font-telugu text-[11px] font-bold text-[#B45309]">
            <Award className="h-3.5 w-3.5" aria-hidden />
            Official Seal
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-wide text-[#94A3B8]">
            NS-LEG-2026-••••
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded border border-[#B45309]/40 bg-white text-[#0F172A]">
            <QrCode className="h-10 w-10" aria-hidden />
          </div>
          <p className="font-telugu text-[9px] text-[#64748B]">ధృవీకరణ QR</p>
        </div>
      </div>

      <p className="relative mt-5 border-t border-[#EAD7B5] pt-4 text-center font-telugu text-sm leading-relaxed text-[#475569]">
        {QUIZ_PASS_THRESHOLD} లేదా అంతకంటే ఎక్కువ స్కోర్ సాధించి A4 సర్టిఫికేట్
        ప్రింట్ చేసుకోండి — హక్కుల రక్షణకు మీ మొదటి అడుగు.
      </p>
    </aside>
  );
}
