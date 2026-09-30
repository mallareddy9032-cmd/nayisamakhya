"use client";

import { useMemo, useState, type FormEvent } from "react";
import { FileText, Printer } from "lucide-react";
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
  LOAN_EQUIPMENT,
} from "@/lib/salon-hub/catalog";
import type { LoanEquipmentId } from "@/types/salon-hub";
import { SUB_CASTE_OPTIONS } from "@/lib/survey/options";

export function LoansClient() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(45000);
  const [equipment, setEquipment] = useState<Record<LoanEquipmentId, boolean>>(
    () => {
      const init = {} as Record<LoanEquipmentId, boolean>;
      for (const e of LOAN_EQUIPMENT) init[e.id] = false;
      init.hydraulic_chair = true;
      init.trimmer_set = true;
      init.mirror_station = true;
      return init;
    },
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subCaste, setSubCaste] = useState("nayi_brahmin");
  const [geo, setGeo] = useGeoSelection();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const equipmentIds = useMemo(
    () =>
      LOAN_EQUIPMENT.filter((e) => equipment[e.id]).map((e) => e.id),
    [equipment],
  );

  const dpr = useMemo(() => {
    if (!ready) return null;
    return computeLoanDpr({
      monthlyRevenueInr: monthlyRevenue,
      equipmentIds,
      applicantName: name,
      phone,
      subCaste,
      districtSlug: geo.districtSlug,
      districtNameTe: geo.districtNameTe,
      mandalSlug: geo.mandalSlug,
      mandalNameTe: geo.mandalNameTe,
    });
  }, [
    ready,
    monthlyRevenue,
    equipmentIds,
    name,
    phone,
    subCaste,
    geo,
  ]);

  const subCasteLabel =
    SUB_CASTE_OPTIONS.find((s) => s.id === subCaste)?.label.te ?? subCaste;

  function generate(e: FormEvent) {
    e.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10) {
      setError("పేరు మరియు సరైన ఫోన్ అవసరం.");
      return;
    }
    if (!geo.districtSlug || !geo.mandalSlug) {
      setError("జిల్లా & మండలం ఎంచుకోండి.");
      return;
    }
    if (equipmentIds.length === 0) {
      setError("కనీసం ఒక పరికరం ఎంచుకోండి.");
      return;
    }
    setReady(true);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={generate}
        className="no-print space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm print:hidden"
      >
        <h2 className="flex items-center gap-2 font-display-te text-lg font-normal text-[#0F172A]">
          <FileText className="h-5 w-5 text-[#B45309]" aria-hidden />
          బ్యాంక్ డీపీఆర్ జనరేటర్
        </h2>
        <p className="font-telugu text-sm text-[#64748B]">
          ముద్రా + బీసీ కార్పొరేషన్ సబ్సిడీ కోసం 2-పేజీ ప్రింట్-రెడీ దస్తావేజు.
        </p>

        <div>
          <label className={labelClass} htmlFor="loan-rev">
            నెలవారీ ఆదాయం (₹) *
          </label>
          <input
            id="loan-rev"
            type="number"
            min={10000}
            max={500000}
            step={1000}
            className={fieldClass}
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value) || 0)}
            required
          />
        </div>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>పరికరాలు *</legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LOAN_EQUIPMENT.map((item) => (
              <li key={item.id}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#F1F5F9] bg-[#FBFBFA] px-3 font-telugu text-sm text-[#0F172A]">
                  <input
                    type="checkbox"
                    checked={equipment[item.id]}
                    onChange={() =>
                      setEquipment((s) => ({ ...s, [item.id]: !s[item.id] }))
                    }
                    className="h-4 w-4 accent-[#B45309]"
                  />
                  <span className="min-w-0 flex-1">{item.nameTe}</span>
                  <span className="shrink-0 text-xs text-[#64748B]">
                    {formatInr(item.costInr)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="loan-name">
            దరఖాస్తుదారు పేరు *
          </label>
          <input
            id="loan-name"
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="loan-phone">
            ఫోన్ *
          </label>
          <input
            id="loan-phone"
            className={fieldClass}
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="loan-caste">
            ఉపకులం *
          </label>
          <select
            id="loan-caste"
            className={fieldClass}
            value={subCaste}
            onChange={(e) => setSubCaste(e.target.value)}
          >
            {SUB_CASTE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label.te}
              </option>
            ))}
          </select>
        </div>

        <DistrictMandalFields value={geo} onChange={setGeo} idPrefix="loan" />

        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-telugu text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="tap inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white hover:bg-[#92400E]"
        >
          డీపీఆర్ తయారు చేయండి
        </button>
      </form>

      {dpr && ready ? (
        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center gap-3 rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] p-4 print:hidden">
            <p className="flex-1 font-telugu text-sm text-[#0F172A]">
              మూలధనం {formatInr(dpr.capitalOutlayInr)} · DSCR{" "}
              <strong>{dpr.dscr.toFixed(2)}</strong> · EMI{" "}
              {formatInr(dpr.monthlyEmiInr)}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="tap inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0F172A] px-4 font-telugu text-sm font-bold text-white"
            >
              <Printer className="h-4 w-4" aria-hidden />
              డౌన్‌లోడ్ / ప్రింట్
            </button>
          </div>
          <LoanDossier
            applicantName={name.trim()}
            phone={phone.replace(/\D/g, "").slice(-10)}
            subCasteTe={subCasteLabel}
            districtNameTe={geo.districtNameTe}
            mandalNameTe={geo.mandalNameTe}
            monthlyRevenueInr={monthlyRevenue}
            dpr={dpr}
          />
        </div>
      ) : null}
    </div>
  );
}
