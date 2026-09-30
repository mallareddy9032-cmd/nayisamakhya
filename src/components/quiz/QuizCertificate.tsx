"use client";

import { Landmark } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  districtLabel,
  formatQuizDate,
  mandalLabel,
  verifyUrl,
} from "@/lib/quiz/store";

type QuizCertificateProps = {
  name: string;
  district: string;
  mandal: string;
  score: number;
  total: number;
  certificateId: string;
  completedAt: string;
};

/**
 * Printable A4 certificate — ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు
 * Gold border, emblem, QR marker. Hidden unless score ≥ pass threshold.
 */
export function QuizCertificate({
  name,
  district,
  mandal,
  score,
  total,
  certificateId,
  completedAt,
}: QuizCertificateProps) {
  const place = `${mandalLabel(district, mandal)} · ${districtLabel(district)}`;
  const qr = verifyUrl(certificateId);

  return (
    <article
      id="quiz-certificate-print"
      className="print-only-document print-document relative mx-auto w-full max-w-[210mm] overflow-hidden rounded-2xl border-[3px] border-[#B45309] bg-gradient-to-b from-[#FFFDF8] via-white to-[#FBF7EF] p-5 shadow-[0_12px_40px_rgba(180,83,9,0.18)] sm:p-8 print:max-w-none print:rounded-none print:border-[4px] print:border-[#B45309] print:bg-white print:p-10 print:shadow-none"
      aria-label="ప్రజా హక్కుల రక్షకుడు సర్టిఫికేట్"
    >
      {/* Corner ornaments */}
      <div
        className="pointer-events-none absolute inset-2 rounded-xl border border-[#B45309]/35 print:inset-3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-3 rounded-lg border border-[#EAD7B5] print:inset-4"
        aria-hidden
      />

      <header className="relative flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#B45309] bg-[#B45309]/10 text-[#B45309] sm:h-16 sm:w-16">
          <Landmark className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B45309]">
          Nayi Samakhya · Telangana
        </p>
        <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A] sm:text-2xl md:text-3xl">
          నాయీ సమాఖ్య తెలంగాణ
        </h2>
        <p className="font-telugu text-xs text-[#64748B] sm:text-sm">
          చట్ట హక్కుల అన్వేషి · Competition 3
        </p>
      </header>

      <div className="relative my-5 flex items-center justify-center gap-3 sm:my-6">
        <span className="h-px w-12 bg-[#B45309]/40 sm:w-20" aria-hidden />
        <span className="font-telugu text-[11px] font-bold tracking-wide text-[#B45309]">
          సర్టిఫికేట్ ఆఫ్ మెరిట్
        </span>
        <span className="h-px w-12 bg-[#B45309]/40 sm:w-20" aria-hidden />
      </div>

      <p className="relative text-center font-telugu text-sm text-[#475569]">
        ఇది ధృవీకరిస్తుంది —
      </p>
      <p className="relative mt-2 text-center font-display-te text-2xl font-normal text-[#0F172A] sm:text-3xl">
        {name}
      </p>
      <p className="relative mt-1 text-center font-telugu text-sm text-[#64748B]">
        {place}
      </p>

      <div className="relative mx-auto mt-5 max-w-md rounded-xl border border-[#B45309]/30 bg-[#B45309]/5 px-4 py-4 text-center sm:mt-6">
        <p className="font-display-te text-lg font-normal leading-snug text-[#B45309] sm:text-xl">
          ధ్రువీకృత ప్రజా హక్కుల రక్షకుడు
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92400E]">
          Certified Civic Rights Guardian
        </p>
        <p className="mt-3 font-telugu text-sm text-[#0F172A]">
          స్కోర్{" "}
          <span className="font-bold text-[#B45309]">
            {score}/{total}
          </span>{" "}
          · జీ.ఓ. 23 · మున్సిపల్ చట్టం · బీసీ సంక్షేమం · వారసత్వం
        </p>
      </div>

      <div className="relative mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <div className="text-center sm:text-left">
          <p className="font-telugu text-[11px] text-[#64748B]">తేదీ</p>
          <p className="font-telugu text-sm font-semibold text-[#0F172A]">
            {formatQuizDate(completedAt)}
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-wide text-[#B45309]">
            {certificateId}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="rounded border border-[#B45309]/40 bg-white p-1.5">
            <QRCodeSVG
              value={qr}
              size={72}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#0F172A"
              title={`Verify ${certificateId}`}
            />
          </div>
          <p className="font-telugu text-[9px] text-[#64748B]">
            ధృవీకరణ QR
          </p>
        </div>

        <div className="text-center sm:text-right">
          <p className="font-telugu text-[11px] text-[#64748B]">జారీ చేసినవారు</p>
          <p className="font-display-te text-sm font-normal text-[#0F172A]">
            నాయీ సమాఖ్య
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Legal Awareness Desk
          </p>
        </div>
      </div>
    </article>
  );
}
