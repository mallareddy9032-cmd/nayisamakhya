"use client";

import { useMemo, useState } from "react";
import { Leaf, Printer, AlertTriangle, Zap } from "lucide-react";
import { computeEnergyPlan, formatInr } from "@/lib/salon-hub/catalog";
import { GO23_FREE_UNITS } from "@/types/salon-hub";
import { EnergyCertificate } from "@/components/salon-hub/EnergyCertificate";

export function EnergyClient() {
  const [area, setArea] = useState(150);
  const [hours, setHours] = useState(10);
  const [acOn, setAcOn] = useState(true);
  const [chairs, setChairs] = useState(2);
  const [ownerName, setOwnerName] = useState("");

  const plan = useMemo(
    () =>
      computeEnergyPlan({
        areaSqft: area,
        hours,
        acOn,
        chairs,
      }),
    [area, hours, acOn, chairs],
  );

  return (
    <div className="space-y-6">
      <section className="no-print rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm print:hidden">
        <h2 className="flex items-center gap-2 font-display-te text-lg font-normal text-[#0F172A]">
          <Zap className="h-5 w-5 text-[#B45309]" aria-hidden />
          జీ.ఓ. 23 ఎనర్జీ ప్లానర్
        </h2>
        <p className="mt-1 font-telugu text-sm text-[#64748B]">
          షాప్ విస్తీర్ణం, గంటలు, ఏసీ, చైర్లు — నెలవారీ యూనిట్లు లెక్కించి 250
          ఉచిత కోటాతో పోల్చండి.
        </p>

        <div className="mt-5 space-y-5">
          <SliderField
            id="area"
            label={`విస్తీర్ణం — ${area} sq.ft`}
            min={80}
            max={400}
            step={10}
            value={area}
            onChange={setArea}
          />
          <SliderField
            id="hours"
            label={`రోజువారీ గంటలు — ${hours}`}
            min={6}
            max={14}
            step={1}
            value={hours}
            onChange={setHours}
          />
          <SliderField
            id="chairs"
            label={`కుర్చీలు / ట్రిమ్మర్లు — ${chairs}`}
            min={1}
            max={6}
            step={1}
            value={chairs}
            onChange={setChairs}
          />

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] px-4 font-telugu text-sm font-semibold text-[#0F172A]">
            <input
              type="checkbox"
              checked={acOn}
              onChange={(e) => setAcOn(e.target.checked)}
              className="h-4 w-4 accent-[#B45309]"
            />
            ఏసీ ఉంది (area × hours × 0.18)
          </label>

          <div>
            <label
              className="mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]"
              htmlFor="energy-owner"
            >
              యజమాని పేరు (సర్టిఫికేట్)
            </label>
            <input
              id="energy-owner"
              className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="మీ పేరు"
            />
          </div>
        </div>
      </section>

      <section
        className={`no-print rounded-2xl border p-4 print:hidden ${
          plan.withinQuota
            ? "border-emerald-200 bg-emerald-50/70"
            : "border-amber-300 bg-amber-50/80"
        }`}
      >
        <div className="flex items-start gap-3">
          {plan.withinQuota ? (
            <Leaf className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
          ) : (
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-telugu text-sm font-bold text-[#0F172A]">
              నెలవారీ అంచనా: {plan.monthlyUnits.toFixed(1)} యూనిట్లు
              <span className="ml-1 font-normal text-[#64748B]">
                / {GO23_FREE_UNITS} ఉచితం
              </span>
            </p>
            <ul className="mt-2 space-y-1 font-telugu text-xs text-[#475569]">
              <li>ఏసీ/రోజు: {plan.acDaily.toFixed(2)}</li>
              <li>లైట్లు: {plan.lightsDaily.toFixed(2)}</li>
              <li>ట్రిమ్మర్లు: {plan.trimmersDaily.toFixed(2)}</li>
              <li>రోజువారీ మొత్తం: {plan.dailyUnits.toFixed(2)}</li>
            </ul>
            <p className="mt-3 font-telugu text-sm leading-relaxed text-[#334155]">
              {plan.recommendationTe}
            </p>
            {plan.withinQuota ? (
              <p className="mt-2 font-telugu text-xs text-emerald-800">
                అంచనా బిల్లు సేవింగ్ ≈ {formatInr(plan.monthlyUnits * 7)} (సూచన)
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white sm:w-auto"
        >
          <Printer className="h-4 w-4" aria-hidden />
          గ్రీన్ సెలూన్ ఎనర్జీ సర్టిఫికేట్ ప్రింట్
        </button>
      </section>

      <EnergyCertificate
        ownerName={ownerName.trim() || "సెలూన్ యజమాని"}
        plan={plan}
        area={area}
        hours={hours}
        chairs={chairs}
        acOn={acOn}
      />
    </div>
  );
}

function SliderField({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-telugu text-sm font-medium text-[#0F172A]"
      >
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#B45309]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-[#94A3B8]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
