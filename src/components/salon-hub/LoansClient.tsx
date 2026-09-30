"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircle,
  Printer,
} from "lucide-react";
import {
  DistrictMandalFields,
  fieldClass,
  labelClass,
  useGeoSelection,
} from "@/components/salon-hub/DistrictMandalFields";
import { LoanDossier } from "@/components/salon-hub/LoanDossier";
import {
  computeLoanDpr,
  formatInr,
  LOAN_BC_A_SUBCASTES,
  LOAN_EQUIPMENT,
  loanDeskWhatsAppUrl,
} from "@/lib/salon-hub/catalog";
import type { LoanEquipmentId, LoanUnitType } from "@/types/salon-hub";

const STEPS = [
  {
    id: 1,
    titleTe: "కళాకారుని / దరఖాస్తుదారుని వివరాలు",
    titleEn: "Applicant Profile",
  },
  {
    id: 2,
    titleTe: "కావలసిన పరికరాలు & బడ్జెట్",
    titleEn: "Capital Outlay",
  },
  {
    id: 3,
    titleTe: "ప్రస్తుత / అంచనా ఆదాయం",
    titleEn: "Monthly Financials",
  },
] as const;

function defaultEquipment(): Record<LoanEquipmentId, boolean> {
  const init = {} as Record<LoanEquipmentId, boolean>;
  for (const e of LOAN_EQUIPMENT) init[e.id] = true; // default ≈ ₹1.3L
  return init;
}

export function LoansClient() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [subCaste, setSubCaste] = useState("nayi_brahmin");
  const [unitType, setUnitType] = useState<LoanUnitType>("modernize");
  const [geo, setGeo] = useGeoSelection();
  const [equipment, setEquipment] =
    useState<Record<LoanEquipmentId, boolean>>(defaultEquipment);
  const [monthlyRevenue, setMonthlyRevenue] = useState(25000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(6000);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const equipmentIds = useMemo(
    () => LOAN_EQUIPMENT.filter((e) => equipment[e.id]).map((e) => e.id),
    [equipment],
  );

  const capitalTotal = useMemo(
    () =>
      LOAN_EQUIPMENT.filter((e) => equipment[e.id]).reduce(
        (s, e) => s + e.costInr,
        0,
      ),
    [equipment],
  );

  const subCasteLabel =
    LOAN_BC_A_SUBCASTES.find((s) => s.id === subCaste)?.labelTe ?? subCaste;

  const dpr = useMemo(() => {
    if (!ready) return null;
    return computeLoanDpr({
      monthlyRevenueInr: monthlyRevenue,
      monthlyExpensesInr: monthlyExpenses,
      equipmentIds,
      applicantName: name,
      phone: whatsapp,
      subCaste,
      unitType,
      districtSlug: geo.districtSlug,
      districtNameTe: geo.districtNameTe,
      mandalSlug: geo.mandalSlug,
      mandalNameTe: geo.mandalNameTe,
    });
  }, [
    ready,
    monthlyRevenue,
    monthlyExpenses,
    equipmentIds,
    name,
    whatsapp,
    subCaste,
    unitType,
    geo,
  ]);

  function validateStep(s: number): string {
    if (s === 1) {
      const digits = whatsapp.replace(/\D/g, "");
      if (!name.trim()) return "పూర్తి పేరు నమోదు చేయండి.";
      if (digits.length < 10) return "సరైన వాట్సాప్ నంబర్ అవసరం.";
      if (!geo.districtSlug || !geo.mandalSlug)
        return "జిల్లా & మండలం ఎంచుకోండి.";
    }
    if (s === 2 && equipmentIds.length === 0) {
      return "కనీసం ఒక పరికరం ఎంచుకోండి.";
    }
    if (s === 3) {
      if (monthlyRevenue < 15000 || monthlyRevenue > 60000) {
        return "నెలవారీ ఆదాయం ₹15,000–₹60,000 మధ్య ఉండాలి.";
      }
      if (monthlyExpenses < 0) return "ఖర్చులు సరైనవి కావు.";
    }
    return "";
  }

  function goNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setError("");
    setReady(false);
    setStep((s) => Math.max(1, s - 1));
  }

  function generate() {
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setReady(true);
    requestAnimationFrame(() => {
      document
        .getElementById("salon-loan-dossier")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const waUrl =
    dpr && ready
      ? loanDeskWhatsAppUrl({
          applicantName: name.trim(),
          phone: whatsapp.replace(/\D/g, "").slice(-10),
          subCasteTe: subCasteLabel,
          districtNameTe: geo.districtNameTe,
          mandalNameTe: geo.mandalNameTe,
          unitType,
          dpr,
        })
      : null;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="no-print text-center print:hidden">
        <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 py-1.5 font-telugu text-xs font-semibold tracking-wide text-[#B45309] sm:text-sm">
          <Banknote className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>ముద్రా &amp; బీసీ కార్పొరేషన్ పథకాలు • ఉచిత ప్రాజెక్ట్ రిపోర్ట్</span>
        </p>
        <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-[#0F172A] sm:text-4xl">
          సెలూన్ బ్యాంక్ లోన్ DPR జనరేటర్
        </h1>
        <p className="mt-1 font-telugu text-base text-[#64748B] sm:text-lg">
          Mudra &amp; BC Welfare Subsidized DPR Generator
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-telugu text-sm leading-relaxed text-[#475569] sm:text-base">
          బ్యాంకు రుణాలు మరియు ప్రభుత్వ సబ్సిడీల కోసం నిబంధనలకు అనుగుణంగా
          2-పేజీల వివరణాత్మక ప్రాజెక్ట్ రిపోర్ట్ (DPR) 1 నిమిషంలో మొబైల్‌లోనే
          ఉచితంగా సిద్ధం చేసుకోండి.
        </p>
      </header>

      {/* Step indicator */}
      <nav
        className="no-print flex items-center justify-center gap-2 print:hidden"
        aria-label="Wizard steps"
      >
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done = step > s.id || (ready && s.id === 3);
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (s.id < step || ready) {
                    setReady(false);
                    setStep(s.id);
                    setError("");
                  }
                }}
                className={`tap inline-flex h-9 min-w-9 items-center justify-center rounded-full font-telugu text-xs font-bold transition ${
                  active
                    ? "bg-[#B45309] text-white"
                    : done
                      ? "bg-[#0F172A] text-white"
                      : "border border-[#E2E8F0] bg-white text-[#64748B]"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done && !active ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  s.id
                )}
              </button>
              {i < STEPS.length - 1 ? (
                <span
                  className={`hidden h-px w-6 sm:block ${
                    step > s.id ? "bg-[#0F172A]" : "bg-[#E2E8F0]"
                  }`}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </nav>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) goNext();
          else generate();
        }}
        className="no-print space-y-5 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-6 print:hidden"
      >
        <div>
          <p className="font-telugu text-xs font-semibold uppercase tracking-wide text-[#B45309]">
            దశ {step} / 3
          </p>
          <h2 className="mt-1 font-display-te text-xl font-normal text-[#0F172A]">
            {STEPS[step - 1].titleTe}
          </h2>
          <p className="font-telugu text-sm text-[#64748B]">
            {STEPS[step - 1].titleEn}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="loan-name">
                పూర్తి పేరు (Full Name) *
              </label>
              <input
                id="loan-name"
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="loan-wa">
                వాట్సాప్ నంబర్ (WhatsApp Mobile) *
              </label>
              <input
                id="loan-wa"
                className={fieldClass}
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="10-digit mobile"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="loan-caste">
                కుల ధ్రువీకరణ / ఉప-కులం (BC-A: Nayi Brahmin / Mangali /
                Bajantri) *
              </label>
              <select
                id="loan-caste"
                className={fieldClass}
                value={subCaste}
                onChange={(e) => setSubCaste(e.target.value)}
              >
                {LOAN_BC_A_SUBCASTES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.labelTe}
                  </option>
                ))}
              </select>
            </div>

            <DistrictMandalFields
              value={geo}
              onChange={setGeo}
              idPrefix="loan"
            />

            <fieldset>
              <legend className={`${labelClass} mb-2`}>యూనిట్ రకం *</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label
                  className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 font-telugu text-sm ${
                    unitType === "modernize"
                      ? "border-[#B45309] bg-[#B45309]/10 text-[#0F172A]"
                      : "border-[#E2E8F0] bg-[#FBFBFA] text-[#334155]"
                  }`}
                >
                  <input
                    type="radio"
                    name="unitType"
                    checked={unitType === "modernize"}
                    onChange={() => setUnitType("modernize")}
                    className="accent-[#B45309]"
                  />
                  ✂️ ఉన్న సెలూన్ ఆధునికీకరణ
                </label>
                <label
                  className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 font-telugu text-sm ${
                    unitType === "new"
                      ? "border-[#B45309] bg-[#B45309]/10 text-[#0F172A]"
                      : "border-[#E2E8F0] bg-[#FBFBFA] text-[#334155]"
                  }`}
                >
                  <input
                    type="radio"
                    name="unitType"
                    checked={unitType === "new"}
                    onChange={() => setUnitType("new")}
                    className="accent-[#B45309]"
                  />
                  🆕 కొత్త సెలూన్ ఏర్పాటు
                </label>
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <ul className="grid gap-2">
              {LOAN_EQUIPMENT.map((item) => (
                <li key={item.id}>
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#F1F5F9] bg-[#FBFBFA] px-3 py-2 font-telugu text-sm text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={equipment[item.id]}
                      onChange={() =>
                        setEquipment((s) => ({
                          ...s,
                          [item.id]: !s[item.id],
                        }))
                      }
                      className="h-4 w-4 shrink-0 accent-[#B45309]"
                    />
                    <span className="min-w-0 flex-1 leading-snug">
                      {item.nameTe}
                    </span>
                    <span className="shrink-0 tabular-nums text-xs font-semibold text-[#B45309]">
                      {formatInr(item.costInr)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] px-4 py-3">
              <span className="font-telugu text-sm font-semibold text-[#0F172A]">
                మొత్తం మూలధనం (Total Capital)
              </span>
              <span className="font-telugu text-lg font-bold tabular-nums text-[#B45309]">
                {formatInr(capitalTotal)}
              </span>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="loan-rev"
                className="mb-2 block font-telugu text-sm font-medium text-[#0F172A]"
              >
                సగటు నెలవారీ ఆదాయం (Monthly Footfall Revenue) —{" "}
                {formatInr(monthlyRevenue)}
              </label>
              <input
                id="loan-rev"
                type="range"
                min={15000}
                max={60000}
                step={1000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-[#B45309]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-[#94A3B8]">
                <span>₹15,000</span>
                <span>₹60,000</span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="loan-exp">
                షాపు అద్దె &amp; నిర్వహణ ఖర్చులు (Monthly Shop Rent/Expenses)
              </label>
              <input
                id="loan-exp"
                type="number"
                min={0}
                max={50000}
                step={500}
                className={fieldClass}
                value={monthlyExpenses}
                onChange={(e) =>
                  setMonthlyExpenses(Number(e.target.value) || 0)
                }
              />
            </div>
          </div>
        ) : null}

        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-telugu text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="tap inline-flex min-h-12 flex-1 items-center justify-center gap-1 rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-semibold text-[#0F172A] sm:flex-none"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              వెనుకకు
            </button>
          ) : null}
          {step < 3 ? (
            <button
              type="submit"
              className="tap inline-flex min-h-12 flex-[2] items-center justify-center gap-1 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white hover:bg-[#1E293B]"
            >
              తర్వాత
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              className="tap inline-flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white hover:bg-[#92400E]"
            >
              <FileText className="h-4 w-4" aria-hidden />
              ప్రాజెక్ట్ రిపోర్ట్ సిద్ధం చేయండి ➔
            </button>
          )}
        </div>
      </form>

      {dpr && ready ? (
        <div className="space-y-4">
          <div className="no-print flex flex-col gap-3 rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] p-4 print:hidden sm:flex-row sm:flex-wrap sm:items-center">
            <p className="flex-1 font-telugu text-sm text-[#0F172A]">
              మూలధనం {formatInr(dpr.capitalOutlayInr)} · రుణం{" "}
              {formatInr(dpr.bankLoanInr)} · EMI {formatInr(dpr.monthlyEmiInr)}{" "}
              · DSCR{" "}
              <strong>
                {dpr.dscr.toFixed(1)}x
                {dpr.dscrHealthy ? " (Healthy)" : ""}
              </strong>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="tap inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white"
              >
                <Printer className="h-4 w-4" aria-hidden />
                📄 అధికారిక DPR డౌన్‌లోడ్ చేసుకోండి (Print / Save A4 PDF)
              </button>
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 font-telugu text-sm font-bold text-white hover:bg-[#0E6B60]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  వాట్సాప్ డెస్క్ ద్వారా బ్యాంక్ గైడెన్స్ పొందండి
                </a>
              ) : null}
            </div>
          </div>

          <LoanDossier
            applicantName={name.trim()}
            phone={whatsapp.replace(/\D/g, "").slice(-10)}
            subCasteTe={subCasteLabel}
            districtNameTe={geo.districtNameTe}
            mandalNameTe={geo.mandalNameTe}
            unitType={unitType}
            monthlyRevenueInr={monthlyRevenue}
            monthlyExpensesInr={monthlyExpenses}
            dpr={dpr}
          />
        </div>
      ) : null}
    </div>
  );
}
