"use client";

import { Leaf, Landmark } from "lucide-react";
import type { EnergyPlanResult } from "@/types/salon-hub";
import { GO23_FREE_UNITS } from "@/types/salon-hub";

export function EnergyCertificate({
  ownerName,
  plan,
  area,
  hours,
  chairs,
  acOn,
}: {
  ownerName: string;
  plan: EnergyPlanResult;
  area: number;
  hours: number;
  chairs: number;
  acOn: boolean;
}) {
  const dateTe = new Date().toLocaleDateString("te-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article
      id="salon-energy-certificate"
      className="relative mx-auto hidden w-full max-w-[210mm] overflow-hidden rounded-2xl border-[3px] border-emerald-700 bg-gradient-to-b from-[#F0FDF4] via-white to-[#ECFDF5] p-6 print:block print:max-w-none print:rounded-none print:border-[4px] print:border-emerald-800 print:bg-white print:p-10 print:shadow-none sm:p-8"
      aria-label="గ్రీన్ సెలూన్ ఎనర్జీ సర్టిఫికేట్"
    >
      <div
        className="pointer-events-none absolute inset-2 rounded-xl border border-emerald-700/30 print:inset-3"
        aria-hidden
      />

      <header className="relative flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-700 bg-emerald-700/10 text-emerald-800">
          <Leaf className="h-7 w-7" aria-hidden />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Nayi Samakhya · G.O. Ms. No. 23
        </p>
        <h2 className="font-display-te text-xl font-normal leading-snug text-[#0F172A] sm:text-2xl">
          గ్రీన్ సెలూన్ ఎనర్జీ సర్టిఫికేట్
        </h2>
        <p className="font-telugu text-xs text-[#64748B]">
          Green Salon Energy Certificate · A4
        </p>
      </header>

      <div className="relative my-5 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-emerald-700/40" aria-hidden />
        <Landmark className="h-4 w-4 text-[#B45309]" aria-hidden />
        <span className="h-px w-12 bg-emerald-700/40" aria-hidden />
      </div>

      <p className="relative text-center font-telugu text-sm text-[#475569]">
        ఇది ధృవీకరిస్తుంది —
      </p>
      <p className="relative mt-2 text-center font-display-te text-2xl font-normal text-[#0F172A]">
        {ownerName}
      </p>

      <dl className="relative mt-6 grid grid-cols-2 gap-3 font-telugu text-sm text-[#0F172A]">
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[#64748B]">
            విస్తీర్ణం
          </dt>
          <dd className="font-bold">{area} sq.ft</dd>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[#64748B]">
            గంటలు / రోజు
          </dt>
          <dd className="font-bold">{hours}</dd>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[#64748B]">
            ఏసీ
          </dt>
          <dd className="font-bold">{acOn ? "ఉంది" : "లేదు"}</dd>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <dt className="text-[10px] uppercase tracking-wide text-[#64748B]">
            చైర్లు
          </dt>
          <dd className="font-bold">{chairs}</dd>
        </div>
      </dl>

      <p className="relative mt-6 text-center font-telugu text-base text-[#0F172A]">
        నెలవారీ అంచనా వినియోగం:{" "}
        <strong>{plan.monthlyUnits.toFixed(1)}</strong> యూనిట్లు
      </p>
      <p className="relative mt-1 text-center font-telugu text-sm text-emerald-900">
        జీ.ఓ. 23 ఉచిత కోటా: {GO23_FREE_UNITS} యూనిట్లు ·{" "}
        {plan.withinQuota ? "కోటా లోపల (గ్రీన్)" : "కోటా దాటింది — సిఫార్సు చూడండి"}
      </p>

      <p className="relative mt-6 text-center font-telugu text-xs leading-relaxed text-[#64748B]">
        {plan.recommendationTe}
      </p>

      <footer className="relative mt-8 flex items-end justify-between gap-4 border-t border-emerald-200 pt-4 font-telugu text-xs text-[#475569]">
        <div>
          <p>నాయీ సమాఖ్య తెలంగాణ</p>
          <p className="text-[#94A3B8]">nayisamakhya.org/salon-hub/energy</p>
        </div>
        <div className="text-right">
          <p>{dateTe}</p>
          <p className="mt-4 border-t border-[#0F172A]/30 pt-1">డెస్క్ సీల్</p>
        </div>
      </footer>
    </article>
  );
}
