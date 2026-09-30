"use client";

import { useMemo, useState } from "react";
import { Leaf, Printer, AlertTriangle, Zap } from "lucide-react";
import { computeEnergyPlan } from "@/lib/salon-hub/catalog";
import { GO23_FREE_UNITS } from "@/types/salon-hub";
import { EnergyCertificate } from "@/components/salon-hub/EnergyCertificate";

export function EnergyClient() {
  const [area, setArea] = useState(120);
  const [hours, setHours] = useState(9);
  const [acHours, setAcHours] = useState(4);
  const [chairs, setChairs] = useState(2);
  const [acOn, setAcOn] = useState(true);
  const [bldcOn, setBldcOn] = useState(true);
  const [clippersOn, setClippersOn] = useState(true);
  const [steamerOn, setSteamerOn] = useState(false);
  const [salonName, setSalonName] = useState("");

  const plan = useMemo(
    () =>
      computeEnergyPlan({
        areaSqft: area,
        hours,
        acHours,
        chairs,
        acOn,
        bldcOn,
        clippersOn,
        steamerOn,
      }),
    [area, hours, acHours, chairs, acOn, bldcOn, clippersOn, steamerOn],
  );

  const gaugePct = Math.min(100, (plan.totalUnits / GO23_FREE_UNITS) * 100);
  const gaugeSafe = plan.withinQuota;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="no-print text-center print:hidden">
        <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 py-1.5 font-telugu text-xs font-semibold tracking-wide text-[#B45309] sm:text-sm">
          <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            జీవో నం. 23 చట్టబద్ధ విద్యుత్ రక్షణ • 250 యూనిట్ల ఉచిత విద్యుత్
          </span>
        </p>
        <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-[#0F172A] sm:text-4xl">
          సెలూన్ విద్యుత్ &amp; ఏసీ లోడ్ ప్లానర్
        </h1>
        <p className="mt-1 font-telugu text-base text-[#64748B] sm:text-lg">
          Salon Energy &amp; Safe-AC Load Calculator
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-telugu text-sm leading-relaxed text-[#475569] sm:text-base">
          మీ సెలూన్‌లో ఇన్వర్టర్ ఏసీ మరియు ఆధునిక మెషీన్లు వాడినా, నెలకు 250
          యూనిట్ల ఉచిత విద్యుత్ పరిధిలోనే ఉండేలా ఖచ్చితమైన విద్యుత్ లోడ్
          ప్రణాళికను సిద్ధం చేసుకోండి.
        </p>
      </header>

      {/* Dual-column calculator */}
      <div className="no-print grid grid-cols-1 gap-5 print:hidden lg:grid-cols-2 lg:items-start">
        {/* LEFT — controls */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-display-te text-lg font-normal text-[#0F172A]">
            లోడ్ ఇన్‌పుట్‌లు
          </h2>
          <p className="mt-1 font-telugu text-xs text-[#64748B]">
            Shop size, hours &amp; efficient equipment — live G.O. 23 check.
          </p>

          <div className="mt-5 space-y-5">
            <SliderField
              id="area"
              labelTe={`సెలూన్ విస్తీర్ణం — ${area} sq.ft`}
              labelEn="Shop size"
              min={60}
              max={300}
              step={10}
              value={area}
              onChange={setArea}
            />
            <SliderField
              id="hours"
              labelTe={`పని వేళలు — ${hours} గం/రోజు`}
              labelEn="Operating hours"
              min={4}
              max={14}
              step={1}
              value={hours}
              onChange={setHours}
            />
            <SliderField
              id="acHours"
              labelTe={`ఇన్వర్టర్ ఏసీ గంటలు — ${acHours}`}
              labelEn="Inverter AC hours"
              min={0}
              max={10}
              step={1}
              value={acHours}
              onChange={setAcHours}
              disabled={!acOn}
            />
            <SliderField
              id="chairs"
              labelTe={`కుర్చీలు / వర్క్‌స్టేషన్లు — ${chairs}`}
              labelEn="Chairs"
              min={1}
              max={5}
              step={1}
              value={chairs}
              onChange={setChairs}
            />

            <fieldset className="space-y-2">
              <legend className="mb-1 font-telugu text-sm font-semibold text-[#0F172A]">
                సామర్థ్య పరికరాలు (Efficiency kit)
              </legend>
              <CheckRow
                checked={acOn}
                onChange={setAcOn}
                label="5-Star Inverter AC (1 Ton)"
              />
              <CheckRow
                checked={bldcOn}
                onChange={setBldcOn}
                label="BLDC Energy-Saver Fans & DC LEDs"
              />
              <CheckRow
                checked={clippersOn}
                onChange={setClippersOn}
                label="Professional Cordless Clippers & Trimmers"
              />
              <CheckRow
                checked={steamerOn}
                onChange={setSteamerOn}
                label="Towel Steamer / UV Sterilizer"
              />
            </fieldset>

            <div>
              <label
                className="mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]"
                htmlFor="energy-salon-name"
              >
                సెలూన్ పేరు (సర్టిఫికేట్)
              </label>
              <input
                id="energy-salon-name"
                className="w-full min-h-[48px] rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                placeholder="ఉదా: శ్రీ నాయీ స్టూడియో"
              />
            </div>
          </div>
        </section>

        {/* RIGHT — live gauge */}
        <section
          className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
            gaugeSafe
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-amber-300 bg-amber-50/80"
          }`}
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {gaugeSafe ? (
              <Leaf className="mt-0.5 h-6 w-6 shrink-0 text-[#059669]" />
            ) : (
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-telugu text-sm font-bold leading-snug text-[#0F172A]">
                {plan.badgeTe}
              </p>
              <p className="mt-1 font-telugu text-xs text-[#64748B]">
                Projected: {plan.totalUnits.toFixed(1)} / {GO23_FREE_UNITS}{" "}
                Units Limit
              </p>
            </div>
          </div>

          {/* Horizontal + radial gauge */}
          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <RadialGauge
              pct={gaugePct}
              value={plan.totalUnits}
              safe={gaugeSafe}
            />
            <div className="w-full flex-1 space-y-2">
              <div
                className="h-4 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-[#E2E8F0]"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={GO23_FREE_UNITS}
                aria-valuenow={Math.round(plan.totalUnits)}
                aria-label="Projected monthly units vs 250"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    gaugeSafe ? "bg-[#059669]" : "bg-[#B45309]"
                  }`}
                  style={{ width: `${gaugePct}%` }}
                />
              </div>
              <div className="flex justify-between font-telugu text-[10px] text-[#94A3B8]">
                <span>0</span>
                <span>Safe ≤ 250</span>
                <span>250+</span>
              </div>
              <p className="font-display-te text-2xl font-normal text-[#0F172A]">
                {plan.totalUnits.toFixed(1)}{" "}
                <span className="text-base text-[#64748B]">యూనిట్లు / నెల</span>
              </p>
              <p
                className={`font-telugu text-sm font-semibold ${
                  gaugeSafe ? "text-[#059669]" : "text-[#B45309]"
                }`}
              >
                అంచనా బిల్లు: {plan.billTe}
              </p>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2 font-telugu text-xs text-[#475569]">
            <li className="rounded-lg bg-white/70 px-2.5 py-2">
              ఏసీ/రోజు: {plan.acDaily.toFixed(2)}
            </li>
            <li className="rounded-lg bg-white/70 px-2.5 py-2">
              BLDC/లైట్లు: {plan.lightsDaily.toFixed(2)}
            </li>
            <li className="rounded-lg bg-white/70 px-2.5 py-2">
              క్లిప్పర్లు: {plan.trimmersDaily.toFixed(2)}
            </li>
            <li className="rounded-lg bg-white/70 px-2.5 py-2">
              స్టీమర్: {plan.steamerDaily.toFixed(2)}
            </li>
          </ul>

          <p className="mt-4 font-telugu text-sm leading-relaxed text-[#334155]">
            {plan.recommendationTe}
          </p>

          <button
            type="button"
            onClick={() => window.print()}
            className="tap mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white hover:bg-[#1E293B]"
          >
            <Printer className="h-4 w-4" aria-hidden />
            📄 గ్రీన్ సెలూన్ లోడ్ సర్టిఫికెట్ డౌన్‌లోడ్ (Print A4)
          </button>
        </section>
      </div>

      <EnergyCertificate
        salonName={salonName.trim() || "సెలూన్ యజమాని"}
        plan={plan}
        area={area}
        hours={hours}
        acHours={acHours}
        chairs={chairs}
        acOn={acOn}
        bldcOn={bldcOn}
        clippersOn={clippersOn}
        steamerOn={steamerOn}
      />
    </div>
  );
}

function RadialGauge({
  pct,
  value,
  safe,
}: {
  pct: number;
  value: number;
  safe: boolean;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, pct) / 100) * c;
  const stroke = safe ? "#059669" : "#B45309";

  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex rotate-0 flex-col items-center justify-center">
        <span className="font-display-te text-xl font-normal text-[#0F172A]">
          {value.toFixed(0)}
        </span>
        <span className="font-telugu text-[10px] text-[#64748B]">/ 250</span>
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-3 font-telugu text-sm font-semibold text-[#0F172A]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-[#B45309]"
      />
      <span className="leading-snug">{label}</span>
    </label>
  );
}

function SliderField({
  id,
  labelTe,
  labelEn,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
}: {
  id: string;
  labelTe: string;
  labelEn: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? "opacity-50" : undefined}>
      <label
        htmlFor={id}
        className="mb-2 flex flex-wrap items-baseline justify-between gap-1 font-telugu text-sm font-medium text-[#0F172A]"
      >
        <span>{labelTe}</span>
        <span className="text-[11px] font-normal text-[#94A3B8]">{labelEn}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full cursor-pointer accent-[#B45309] disabled:cursor-not-allowed"
      />
      <div className="mt-1 flex justify-between text-[10px] text-[#94A3B8]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
