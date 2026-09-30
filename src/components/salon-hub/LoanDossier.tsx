"use client";

import { Landmark } from "lucide-react";
import { formatInr } from "@/lib/salon-hub/catalog";
import type { LoanDprResult } from "@/types/salon-hub";

export function LoanDossier({
  applicantName,
  phone,
  subCasteTe,
  districtNameTe,
  mandalNameTe,
  monthlyRevenueInr,
  dpr,
}: {
  applicantName: string;
  phone: string;
  subCasteTe: string;
  districtNameTe: string;
  mandalNameTe: string;
  monthlyRevenueInr: number;
  dpr: LoanDprResult;
}) {
  const dateTe = new Date().toLocaleDateString("te-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div id="salon-loan-dossier" className="space-y-6 print:space-y-0">
      {/* Page 1 */}
      <article className="loan-dpr-page relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-start gap-3 border-b border-[#EAD7B5] pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#B45309] bg-[#B45309]/10 text-[#B45309]">
            <Landmark className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B45309]">
              Nayi Samakhya · Bank DPR Dossier
            </p>
            <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
              సెలూన్ స్టూడియో డీపీఆర్ — పేజీ 1
            </h2>
            <p className="font-telugu text-xs text-[#64748B]">
              ముద్రా + బీసీ కార్పొరేషన్ సబ్సిడీ · {dateTe}
            </p>
          </div>
        </header>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            1. కార్యనిర్వాహక సారాంశం
          </h3>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-[#334155]">
            శ్రీ/శ్రీమతి <strong>{applicantName}</strong> ({subCasteTe}),{" "}
            {mandalNameTe} మండలం, {districtNameTe} జిల్లా — సాంప్రదాయ నాయి బ్రాహ్మణ /
            మంగలి వృత్తి ఆధారిత సెలూన్ స్టూడియో ఆధునీకరణకు {formatInr(dpr.capitalOutlayInr)}{" "}
            మూలధన ప్రతిపాదన. నెలవారీ ఆదాయం {formatInr(monthlyRevenueInr)}. ఈ దస్తావేజు
            ముద్రా (ప్రధాన్ మంత్రి ముద్రా యోజన) మరియు తెలంగాణ బీసీ కార్పొరేషన్ సబ్సిడీ
            మార్గాల కోసం తయారు చేయబడింది.
          </p>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            2. బీసీ-ఎ అర్హత
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-telugu text-sm text-[#334155]">
            <li>ఉపకులం: {subCasteTe} (BC-A సాంప్రదాయ వృత్తి వర్గం)</li>
            <li>సంప్రదాయ వృత్తి: సెలూన్ / హెయిర్ డ్రెస్సింగ్ స్టూడియో</li>
            <li>
              భౌగోళికం: {mandalNameTe}, {districtNameTe}, తెలంగాణ
            </li>
            <li>సంప్రదాయ: {phone} · నాయీ సమాఖ్య డిజిటల్ డెస్క్ సపోర్ట్</li>
            <li>
              జీ.ఓ. 23 ఉచిత విద్యుత్ అర్హత — ఆపరేటింగ్ ఖర్చు తగ్గింపు సహాయం
            </li>
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            3. మూలధన వ్యయం (₹1.5 లక్ష – ₹3 లక్ష)
          </h3>
          <table className="mt-2 w-full border-collapse font-telugu text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-left text-[#64748B]">
                <th className="py-2 pr-2 font-medium">పరికరం</th>
                <th className="py-2 text-right font-medium">అంచనా</th>
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
                <td className="py-2 pr-2">మొత్తం మూలధనం (క్లాంప్)</td>
                <td className="py-2 text-right tabular-nums">
                  {formatInr(dpr.capitalOutlayInr)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <p className="mt-6 text-right font-telugu text-[10px] text-[#94A3B8] print:mt-8">
          Page 1 / 2 · nayisamakhya.org/salon-hub/loans
        </p>
      </article>

      {/* Page 2 */}
      <article className="loan-dpr-page relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
          సెలూన్ స్టూడియో డీపీఆర్ — పేజీ 2
        </h2>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            4. నిధి నిర్మాణం
          </h3>
          <dl className="mt-2 grid grid-cols-1 gap-2 font-telugu text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">స్వంత వాటా (10%)</dt>
              <dd className="font-bold">{formatInr(dpr.ownContributionInr)}</dd>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] bg-[#FBFBFA] p-3">
              <dt className="text-xs text-[#64748B]">బీసీ కార్ప్ సబ్సిడీ (20%)</dt>
              <dd className="font-bold">{formatInr(dpr.bcCorpSubsidyInr)}</dd>
            </div>
            <div className="rounded-lg border border-[#EAD7B5] bg-[#FFFDF9] p-3 sm:col-span-2">
              <dt className="text-xs text-[#64748B]">ముద్రా రుణం (శిష్టం)</dt>
              <dd className="font-bold text-[#B45309]">
                {formatInr(dpr.mudraLoanInr)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            5. నగదు ప్రవాహం &amp; EMI
          </h3>
          <ul className="mt-2 space-y-1 font-telugu text-sm text-[#334155]">
            <li>నెలవారీ ఆదాయం: {formatInr(monthlyRevenueInr)}</li>
            <li>
              సూచిత EMI (9% · 60 నెలలు): {formatInr(dpr.monthlyEmiInr)}
            </li>
            <li>
              వార్షిక నికర నగదు ప్రవాహం (అంచనా):{" "}
              {formatInr(dpr.annualCashflowInr)}
            </li>
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            6. DSCR (Debt Service Coverage Ratio)
          </h3>
          <p className="mt-2 font-telugu text-sm text-[#334155]">
            లెక్కించిన DSCR:{" "}
            <strong className="text-[#0F172A]">{dpr.dscr.toFixed(2)}</strong>
            {dpr.dscr >= 1.25
              ? " — బ్యాంక్ అనుకూల పరిధి (≥ 1.25)."
              : " — అదనపు హామీ / తక్కువ రుణ మొత్తం సిఫార్సు."}
          </p>
        </section>

        <section className="mt-5 rounded-xl border border-[#EAD7B5] bg-[#FFFDF9] p-4">
          <h3 className="font-telugu text-sm font-bold text-[#B45309]">
            7. ముద్రా + బీసీ కార్ప్ సబ్సిడీ నోట్
          </h3>
          <p className="mt-2 font-telugu text-sm leading-relaxed text-[#334155]">
            ఈ ప్రతిపాదన ప్రధాన్ మంత్రి ముద్రా యోజన (కిషోర్/తరుణ్) కింద వర్కింగ్ /
            టర్మ్ క్యాపిటల్‌కు అనుకూలం. తెలంగాణ బీసీ కార్పొరేషన్ సాంప్రదాయ వృత్తి
            యూనిట్లకు సబ్సిడీ / మార్జిన్ మనీ సహాయం అందించవచ్చు. చివరి అనుమతి బ్యాంక్
            మరియు కార్పొరేషన్ విధానాలపై ఆధారపడి ఉంటుంది. నాయీ సమాఖ్య డెస్క్ దస్తావేజు
            సహాయం అందిస్తుంది — రుణ హామీ కాదు.
          </p>
        </section>

        <footer className="mt-8 flex justify-between gap-4 border-t border-[#E2E8F0] pt-4 font-telugu text-xs text-[#475569]">
          <div>
            <p className="font-semibold">{applicantName}</p>
            <p className="mt-6 border-t border-[#0F172A]/40 pt-1">సంతకం</p>
          </div>
          <div className="text-right">
            <p>నాయీ సమాఖ్య తెలంగాణ</p>
            <p className="mt-6 border-t border-[#0F172A]/40 pt-1">డెస్క్ సీల్</p>
          </div>
        </footer>

        <p className="mt-4 text-right font-telugu text-[10px] text-[#94A3B8]">
          Page 2 / 2 · nayisamakhya.org/salon-hub/loans
        </p>
      </article>
    </div>
  );
}
