"use client";

import { Landmark, QrCode } from "lucide-react";
import { formatInr } from "@/lib/salon-hub/catalog";
import type { LoanDprResult, LoanUnitType } from "@/types/salon-hub";

export function LoanDossier({
  applicantName,
  phone,
  subCasteTe,
  districtNameTe,
  mandalNameTe,
  unitType,
  monthlyRevenueInr,
  monthlyExpensesInr,
  dpr,
}: {
  applicantName: string;
  phone: string;
  subCasteTe: string;
  districtNameTe: string;
  mandalNameTe: string;
  unitType: LoanUnitType;
  monthlyRevenueInr: number;
  monthlyExpensesInr: number;
  dpr: LoanDprResult;
}) {
  const dateTe = new Date().toLocaleDateString("te-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const unitTe =
    unitType === "modernize"
      ? "ఉన్న సెలూన్ ఆధునికీకరణ (Existing Salon Modernization)"
      : "కొత్త సెలూన్ ఏర్పాటు (New Salon Setup)";

  return (
    <div id="salon-loan-dossier" className="space-y-6 print:space-y-0">
      {/* Page 1 */}
      <article className="loan-dpr-page relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="border-b border-[#EAD7B5] pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#B45309] bg-[#B45309]/10 text-[#B45309]">
              <Landmark className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B45309]">
                Nayi Samakhya · Bank DPR &amp; Subsidy Dossier
              </p>
              <h2 className="font-display-te text-lg font-normal leading-snug text-[#0F172A] sm:text-xl">
                DETAILED PROJECT REPORT (DPR) FOR SALON ENTERPRISE
                MODERNIZATION
              </h2>
              <p className="mt-1 font-telugu text-xs text-[#64748B]">
                PM Vishwakarma / PMEGP / Telangana BC Co-Op Finance Corporation
                Schemes · {dateTe}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            1. Artisan Bio &amp; Statutory BC-A Classification
          </h3>
          <dl className="mt-2 grid gap-2 font-telugu text-sm text-[#334155] sm:grid-cols-2">
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">దరఖాస్తుదారు</dt>
              <dd className="font-semibold text-[#0F172A]">{applicantName}</dd>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">వాట్సాప్</dt>
              <dd className="font-semibold text-[#0F172A]">{phone}</dd>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">BC-A ఉపకులం</dt>
              <dd className="font-semibold text-[#0F172A]">{subCasteTe}</dd>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">యూనిట్ రకం</dt>
              <dd className="font-semibold text-[#0F172A]">{unitTe}</dd>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3 sm:col-span-2">
              <dt className="text-xs text-[#64748B]">భౌగోళికం</dt>
              <dd className="font-semibold text-[#0F172A]">
                {mandalNameTe} మండలం, {districtNameTe} జిల్లా, తెలంగాణ
              </dd>
            </div>
          </dl>
          <p className="mt-3 font-telugu text-sm leading-relaxed text-[#334155]">
            దరఖాస్తుదారు సాంప్రదాయ నాయి బ్రాహ్మణ / మంగలి / భజంత్రి (BC-A)
            వృత్తి వర్గానికి చెందిన కళాకారుడు. ఈ దస్తావేజు సెలూన్ ఎంటర్‌ప్రైజ్
            ఆధునికీకరణ / కొత్త యూనిట్ కోసం బ్యాంక్ రుణం మరియు ప్రభుత్వ
            సబ్సిడీలకు అనుగుణంగా తయారు చేయబడింది. సాంప్రదాయ వృత్తి
            ధృవీకరణకు నాయీ సమాఖ్య డిజిటల్ డెస్క్ మద్దతు అందిస్తుంది.
          </p>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            2. Equipment Outlay &amp; Cost Breakdown
          </h3>
          <table className="mt-2 w-full border-collapse font-telugu text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[#64748B]">
                <th className="py-2 pr-2 font-medium">పరికరం / అంశం</th>
                <th className="py-2 text-right font-medium">అంచనా వ్యయం</th>
              </tr>
            </thead>
            <tbody>
              {dpr.equipmentLines.map((line) => (
                <tr key={line.id} className="border-b border-[#F1F5F9]">
                  <td className="py-2 pr-2 text-[#0F172A]">{line.nameTe}</td>
                  <td className="py-2 text-right tabular-nums text-[#0F172A]">
                    {formatInr(line.costInr)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-[#0F172A]">
                <td className="py-2 pr-2">మొత్తం ప్రాజెక్ట్ వ్యయం</td>
                <td className="py-2 text-right tabular-nums">
                  {formatInr(dpr.capitalOutlayInr)}
                </td>
              </tr>
            </tbody>
          </table>

          <dl className="mt-3 grid grid-cols-1 gap-2 font-telugu text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">మార్జిన్ మనీ (10%)</dt>
              <dd className="font-bold">{formatInr(dpr.marginMoneyInr)}</dd>
            </div>
            <div className="rounded-lg border border-[#EAD7B5] bg-[#FFFDF9] p-3 sm:col-span-2">
              <dt className="text-xs text-[#64748B]">బ్యాంక్ రుణం (90%)</dt>
              <dd className="font-bold text-[#B45309]">
                {formatInr(dpr.bankLoanInr)}
              </dd>
            </div>
          </dl>
        </section>

        <p className="mt-6 text-right font-telugu text-[10px] text-[#94A3B8] print:mt-8">
          Page 1 / 2 · nayisamakhya.org/salon-hub/loans
        </p>
      </article>

      {/* Page 2 */}
      <article className="loan-dpr-page relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
          3. Projected 3-Year Cash Flows &amp; Debt Viability
        </h2>

        <section className="mt-4">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            నెలవారీ ఆధారాలు &amp; EMI
          </h3>
          <ul className="mt-2 space-y-1 font-telugu text-sm text-[#334155]">
            <li>నెలవారీ ఆదాయం: {formatInr(monthlyRevenueInr)}</li>
            <li>అద్దె / నిర్వహణ: {formatInr(monthlyExpensesInr)}</li>
            <li>
              సూచిత EMI ({(dpr.interestRatePa * 100).toFixed(1)}% ·{" "}
              {dpr.tenureMonths} నెలలు): {formatInr(dpr.monthlyEmiInr)}
            </li>
            <li>
              వార్షిక NOI (అంచనా): {formatInr(dpr.annualNoiInr)} · వార్షిక
              రుణ సేవ: {formatInr(dpr.annualDebtServiceInr)}
            </li>
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            3-సంవత్సరాల నగదు ప్రవాహం
          </h3>
          <table className="mt-2 w-full border-collapse font-telugu text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[#64748B]">
                <th className="py-2 pr-1 font-medium">సం.</th>
                <th className="py-2 pr-1 text-right font-medium">ఆదాయం</th>
                <th className="py-2 pr-1 text-right font-medium">ఖర్చులు</th>
                <th className="py-2 pr-1 text-right font-medium">EMI</th>
                <th className="py-2 text-right font-medium">నికర</th>
              </tr>
            </thead>
            <tbody>
              {dpr.cashflows.map((row) => (
                <tr key={row.year} className="border-b border-[#F1F5F9]">
                  <td className="py-2 pr-1 text-[#0F172A]">Y{row.year}</td>
                  <td className="py-2 pr-1 text-right tabular-nums">
                    {formatInr(row.revenueInr)}
                  </td>
                  <td className="py-2 pr-1 text-right tabular-nums">
                    {formatInr(row.expensesInr)}
                  </td>
                  <td className="py-2 pr-1 text-right tabular-nums">
                    {formatInr(row.emiInr)}
                  </td>
                  <td className="py-2 text-right font-semibold tabular-nums text-[#0F172A]">
                    {formatInr(row.netInr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            DSCR (Debt Service Coverage Ratio)
          </h3>
          <p className="mt-2 font-telugu text-sm text-[#334155]">
            లెక్కించిన DSCR:{" "}
            <strong className="text-[#0F172A]">{dpr.dscr.toFixed(1)}x</strong>
            {dpr.dscrHealthy
              ? " — Healthy (≥ 1.5). బ్యాంక్ అనుకూల పరిధి."
              : " — అదనపు హామీ / తక్కువ రుణ మొత్తం సిఫార్సు."}
          </p>
          <p className="mt-1 font-telugu text-xs text-[#64748B]">
            NOI = ఆదాయం − అద్దె/ఖర్చులు − (ఆదాయం × 45% వేరియబుల్ Cos) · DSCR =
            వార్షిక NOI ÷ వార్షిక EMI.
          </p>
        </section>

        <section className="mt-5 rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] p-4">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            Statutory Scheme Citation
          </h3>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-[#334155]">
            ఈ ప్రతిపాదన{" "}
            <strong>
              PM Vishwakarma / PMEGP / Telangana BC Co-Op Finance Corporation
              Schemes
            </strong>{" "}
            కింద సాంప్రదాయ కళాకారుల సెలూన్ యూనిట్లకు అనుకూలం. మార్జిన్ మనీ
            (10%) దరఖాస్తుదారు వాటా; బ్యాంక్ రుణ భాగం (90%) సంబంధిత పథకం /
            బ్యాంక్ విధానాల ప్రకారం. చివరి అనుమతి బ్యాంక్ మరియు కార్పొరేషన్
            అధికారులపై ఆధారపడి ఉంటుంది. నాయీ సమాఖ్య డెస్క్ దస్తావేజు సహాయం
            అందిస్తుంది — రుణ హామీ కాదు.
          </p>
        </section>

        <section className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[#E2E8F0] pt-4">
          <div className="font-telugu text-xs text-[#475569]">
            <p className="font-semibold text-[#0F172A]">{applicantName}</p>
            <p className="mt-8 border-t border-[#0F172A]/40 pt-1">సంతకం</p>
          </div>

          {/* QR / verification seal placeholder */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div
              className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B45309]/50 bg-[#FBFBFA] text-[#B45309]"
              aria-label="Verification QR code placeholder"
            >
              <QrCode className="h-10 w-10" aria-hidden />
              <span className="mt-1 font-telugu text-[9px] font-semibold">
                QR
              </span>
            </div>
            <p className="max-w-[10rem] font-telugu text-[10px] leading-snug text-[#64748B]">
              Verification Seal &amp; QR — trade authenticity declaration
            </p>
          </div>

          <div className="font-telugu text-xs text-[#475569] text-right">
            <p>నాయీ సమాఖ్య తెలంగాణ</p>
            <p className="mt-8 border-t border-[#0F172A]/40 pt-1">డెస్క్ సీల్</p>
          </div>
        </section>

        <p className="mt-4 text-right font-telugu text-[10px] text-[#94A3B8]">
          Page 2 / 2 · nayisamakhya.org/salon-hub/loans
        </p>
      </article>
    </div>
  );
}
