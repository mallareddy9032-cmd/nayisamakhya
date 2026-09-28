"use client";

import React from "react";
import { VerificationQR } from "./VerificationQR";

type DocketHeaderProps = {
  refLabel: string;
  teluguDate: string;
  mandalTe: string;
  districtTe: string;
  recipientLine?: string;
  verifyUrl: string;
  docketId: string;
};

/**
 * Official dispatch docket — reference, Telugu date, recipient routing, QR.
 */
export function DocketHeader({
  refLabel,
  teluguDate,
  mandalTe,
  districtTe,
  recipientLine,
  verifyUrl,
  docketId,
}: DocketHeaderProps) {
  const routing =
    recipientLine ||
    `గౌరవనీయులైన తహసీల్దార్ / జిల్లా కలెక్టర్ / విద్యుత్ ఏడీఈ (ADE) గారి సమక్షంలోకి:\n${mandalTe} / సర్కిల్, ${districtTe} జిల్లా, తెలంగాణ రాష్ట్రం.`;

  return (
    <header className="print-docket-header mb-6 border-b-2 border-civic-ink pb-4 print:mb-2 print:pb-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-left">
          <p className="font-mono text-[10px] font-bold tracking-wide text-civic-ink print:text-[9px]">
            {refLabel}
          </p>
          <p className="mt-1 font-telugu text-xs font-semibold text-slate-700 print:text-[10px]">
            తేదీ: {teluguDate}
          </p>
          <h2 className="mt-3 font-telugu text-lg font-black leading-snug tracking-wide text-civic-ink md:text-xl print:mt-2 print:text-base">
            వినతిపత్రం (REPRESENTATION)
          </h2>
          <p className="mt-0.5 font-telugu text-[11px] font-semibold leading-relaxed text-slate-600 print:text-[9px]">
            నాయి బ్రాహ్మణ, మంగలి &amp; బజంత్రి కమ్యూనిటీ సంక్షేమ మరియు హక్కుల పరిరక్షణ వేదిక
          </p>
          <p className="mt-0.5 font-telugu text-[10px] text-slate-500 print:text-[8px]">
            తెలంగాణ రాష్ట్రం · నాయీ సమఖ్య డిజిటల్ డెస్క్
          </p>
        </div>
        <VerificationQR url={verifyUrl} docketId={docketId} size={72} />
      </div>

      <div className="mt-4 rounded border border-slate-300 bg-slate-50 px-3 py-2 font-telugu text-xs leading-relaxed text-slate-800 print:mt-2 print:px-2 print:py-1.5 print:text-[11px] print:leading-snug">
        <p className="font-bold text-civic-ink">స్వీకర్త / అధికారిక రూటింగ్:</p>
        {routing.split("\n").map((line) => (
          <p key={line} className="whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>
    </header>
  );
}

/**
 * Bottom official receiving stamp — 2-column seal / diary box.
 */
export function ReceivingStampBlock() {
  return (
    <section
      aria-label="స్వీకరించిన అధికారి పరిశీలన ముద్ర"
      className="print-seal-block print-receiving-stamp mt-6 break-inside-avoid border-2 border-slate-800 print:mt-3"
    >
      <p className="border-b border-slate-800 bg-slate-100 px-2 py-1 text-center font-telugu text-[10px] font-bold tracking-wide text-civic-ink print:text-[9px]">
        స్వీకరించిన అధికారి పరిశీలన ముద్ర
      </p>
      <div className="grid grid-cols-1 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="min-h-[4.5rem] p-3 font-telugu text-[11px] leading-relaxed text-slate-800 print:min-h-[3.2rem] print:p-2 print:text-[9px]">
          <p className="font-semibold">
            వినతిపత్రం స్వీకరించిన అధికారి సంతకం &amp; కార్యాలయ ముద్ర (Office Seal):
          </p>
          <p className="mt-6 tracking-widest text-slate-400 print:mt-4">
            ____________________
          </p>
        </div>
        <div className="min-h-[4.5rem] p-3 font-telugu text-[11px] leading-relaxed text-slate-800 print:min-h-[3.2rem] print:p-2 print:text-[9px]">
          <p className="font-semibold">స్వీకరించిన తేదీ:</p>
          <p className="mt-1 tracking-wider">____/____/2026</p>
          <p className="mt-3 font-semibold">డైరీ / కంప్యూటర్ నంబర్:</p>
          <p className="mt-1 tracking-widest text-slate-400">____________</p>
        </div>
      </div>
    </section>
  );
}
