"use client";

import { SURVEY_STEPS } from "@/lib/survey/options";

type Props = {
  step: number;
  total?: number;
};

export function SurveyProgress({ step, total = 4 }: Props) {
  const pct = Math.min(100, Math.round((step / total) * 100));
  const meta = SURVEY_STEPS.find((s) => s.id === step);

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-xs text-[#64748B]">
        <span className="font-telugu font-semibold text-[#0F172A]">
          దశ {step} / {total}
          {meta ? (
            <span className="ml-1.5 font-normal text-[#64748B]">· {meta.te}</span>
          ) : null}
        </span>
        <span>
          Step {step} of {total}
          {meta ? <span className="ml-1 text-[#94A3B8]">· {meta.en}</span> : null}
        </span>
      </div>
      <div
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#F4F4F2]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Survey progress ${pct}%`}
      >
        <div
          className="h-full rounded-full bg-[#B45309] transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-3 flex gap-1">
        {SURVEY_STEPS.map((s) => (
          <li
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s.id <= step ? "bg-[#B45309]" : "bg-[#E2E8F0]"
            }`}
            aria-hidden
          />
        ))}
      </ol>
    </div>
  );
}
