import type {
  EnergyPlanInput,
  EnergyPlanResult,
  LoanDprInput,
  LoanDprResult,
  LoanEquipmentId,
  ProcureBundleId,
  ProcureLineItem,
  SalonHubOrder,
} from "@/types/salon-hub";
import {
  GO23_FREE_UNITS,
  HELPLINE_WA,
  LOAN_EMI_RATE_PA,
  LOAN_EMI_TENURE_MONTHS,
  LOAN_VARIABLE_COST_RATIO,
  SALON_HUB_ORDERS_KEY,
} from "@/types/salon-hub";

export const PROCURE_BUNDLES: {
  id: ProcureBundleId;
  titleTe: string;
  subtitleTe: string;
}[] = [
  {
    id: "A",
    titleTe: "బండిల్ A — నెలవారీ వినియోగం",
    subtitleTe: "బ్లేడ్, ఫోమ్, పౌడర్, టానిక్, టవల్స్",
  },
  {
    id: "B",
    titleTe: "బండిల్ B — ఎలక్ట్రికల్ టూల్స్",
    subtitleTe: "ట్రిమ్మర్, డ్రయ్యర్, స్ట్రెయిటనర్, స్టెరిలైజర్",
  },
  {
    id: "C",
    titleTe: "బండిల్ C — స్టూడియో స్టార్టర్",
    subtitleTe: "చైర్, మిర్రర్, సైనేజ్, వాటర్ హీటర్",
  },
];

export const PROCURE_CATALOG: ProcureLineItem[] = [
  {
    id: "a-blades",
    bundleId: "A",
    nameTe: "బ్లేడ్ ప్యాక్ (100)",
    nameEn: "Blade pack (100)",
    unitPriceInr: 180,
    unitTe: "ప్యాక్",
  },
  {
    id: "a-foam",
    bundleId: "A",
    nameTe: "షేవింగ్ ఫోమ్ (500ml)",
    nameEn: "Shaving foam (500ml)",
    unitPriceInr: 220,
    unitTe: "బాటిల్",
  },
  {
    id: "a-powder",
    bundleId: "A",
    nameTe: "టాల్కం / పౌడర్",
    nameEn: "Talcum / powder",
    unitPriceInr: 90,
    unitTe: "ప్యాక్",
  },
  {
    id: "a-tonic",
    bundleId: "A",
    nameTe: "హెయిర్ టానిక్ (200ml)",
    nameEn: "Hair tonic (200ml)",
    unitPriceInr: 250,
    unitTe: "బాటిల్",
  },
  {
    id: "a-towels",
    bundleId: "A",
    nameTe: "టవల్ సెట్ (6)",
    nameEn: "Towel set (6)",
    unitPriceInr: 480,
    unitTe: "సెట్",
  },
  {
    id: "b-trimmer",
    bundleId: "B",
    nameTe: "ప్రొఫెషనల్ ట్రిమ్మర్",
    nameEn: "Professional trimmer",
    unitPriceInr: 2499,
    unitTe: "యూనిట్",
  },
  {
    id: "b-dryer",
    bundleId: "B",
    nameTe: "హెయిర్ డ్రయ్యర్",
    nameEn: "Hair dryer",
    unitPriceInr: 1899,
    unitTe: "యూనిట్",
  },
  {
    id: "b-straightener",
    bundleId: "B",
    nameTe: "స్ట్రెయిటనర్",
    nameEn: "Straightener",
    unitPriceInr: 1499,
    unitTe: "యూనిట్",
  },
  {
    id: "b-sterilizer",
    bundleId: "B",
    nameTe: "స్టెరిలైజర్ బాక్స్",
    nameEn: "Sterilizer box",
    unitPriceInr: 1299,
    unitTe: "యూనిట్",
  },
  {
    id: "c-chair",
    bundleId: "C",
    nameTe: "హైడ్రాలిక్ చైర్",
    nameEn: "Hydraulic chair",
    unitPriceInr: 12999,
    unitTe: "యూనిట్",
  },
  {
    id: "c-mirror",
    bundleId: "C",
    nameTe: "మిర్రర్ స్టేషన్",
    nameEn: "Mirror station",
    unitPriceInr: 6499,
    unitTe: "యూనిట్",
  },
  {
    id: "c-signage",
    bundleId: "C",
    nameTe: "సైనేజ్ / బ్రాండింగ్ కిట్",
    nameEn: "Signage / branding kit",
    unitPriceInr: 3499,
    unitTe: "కిట్",
  },
  {
    id: "c-heater",
    bundleId: "C",
    nameTe: "వాటర్ హీటర్ (15L)",
    nameEn: "Water heater (15L)",
    unitPriceInr: 4999,
    unitTe: "యూనిట్",
  },
];

/** Capital checklist — default-all totals ₹1,30,000. */
export const LOAN_EQUIPMENT: {
  id: LoanEquipmentId;
  nameTe: string;
  nameEn: string;
  costInr: number;
}[] = [
  {
    id: "hydraulic_chairs",
    nameTe: "హైడ్రాలిక్ కుర్చీలు (Hydraulic Styling Chairs)",
    nameEn: "Hydraulic Styling Chairs",
    costInr: 35000,
  },
  {
    id: "inverter_ac",
    nameTe: "1-టన్ 5-స్టార్ ఇన్వర్టర్ ఏసీ (5-Star Inverter AC)",
    nameEn: "5-Star Inverter AC (1 Ton)",
    costInr: 32000,
  },
  {
    id: "wash_station",
    nameTe: "హెయిర్ వాష్ స్టేషన్ & బేసిన్ (Hair Wash Station)",
    nameEn: "Hair Wash Station & Basin",
    costInr: 18000,
  },
  {
    id: "uv_tools",
    nameTe: "ప్రొఫెషనల్ యువి స్టెరిలైజర్ & ట్రిమ్మర్లు (UV Sterilizer & Tools)",
    nameEn: "UV Sterilizer & Professional Tools",
    costInr: 15000,
  },
  {
    id: "interior_wiring",
    nameTe: "ఇంటీరియర్ డెకరేషన్ & విద్యుద్దీకరణ (Interior & Wiring)",
    nameEn: "Interior Decoration & Wiring",
    costInr: 30000,
  },
];

/** BC-A traditional trade sub-castes shown on the loans wizard. */
export const LOAN_BC_A_SUBCASTES = [
  { id: "nayi_brahmin", labelTe: "నాయి బ్రాహ్మణ (Nayi Brahmin)" },
  { id: "mangali", labelTe: "మంగలి (Mangali)" },
  { id: "bajantri", labelTe: "భజంత్రి (Bajantri)" },
] as const;

export function reducingBalanceEmi(
  principalInr: number,
  annualRate: number,
  tenureMonths: number,
): number {
  if (principalInr <= 0 || tenureMonths <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return Math.round(principalInr / tenureMonths);
  const factor = Math.pow(1 + r, tenureMonths);
  return Math.round((principalInr * r * factor) / (factor - 1));
}

export function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function isDemandWindowOpen(now = new Date()): boolean {
  const day = now.getDate();
  return day >= 1 && day <= 5;
}

export function computeEnergyPlan(input: EnergyPlanInput): EnergyPlanResult {
  /*
   * G.O. Ms. No. 23 Safe-AC & Energy Planner — documented daily kWh model.
   *
   * Legacy Pillar-2 sketch used `area * hours * 0.18`, which yields multi-thousand
   * monthly units for a typical salon and is not usable against the 250-unit meter.
   * We keep the spirit of that factor but refine it to a 1-ton 5-star inverter model:
   *
   *   AC (if checked):
   *     acHours × 0.90 kWh/hr × (areaSqft / 120)
   *     — 0.90 ≈ mid-band 1T 5-star inverter draw at 24–25°C;
   *       area/120 scales lightly vs a reference 120 sq ft booth.
   *     Equivalent "legacy factor" form: area × acHours × 0.0075
   *       (since 0.90/120 = 0.0075 ≪ 0.18).
   *
   *   BLDC fans & DC LEDs (if checked):
   *     1.2 kWh/day × (hours / 9)  — scales with operating day vs 9-hr reference.
   *     If unchecked: 2.4 × (hours / 9) (conventional fans/lights penalty).
   *
   *   Cordless clippers (if checked):
   *     0.8 kWh/day × (0.7 + chairs × 0.15)  — chairs scale base load lightly.
   *     If unchecked: chairs × 0.45 (mains trimmers draw more).
   *
   *   Steamer / UV (if checked): +0.75 kWh/day (mid of 0.5–1.0 band).
   *
   *   Chair misc base (outlets, tips): chairs × 0.12 kWh/day.
   *
   *   Monthly units = daily × 30. Green zone when monthly ≤ 250 (G.O. 23).
   */
  const area = Math.min(300, Math.max(60, input.areaSqft));
  const hours = Math.min(14, Math.max(4, input.hours));
  const acHours = Math.min(10, Math.max(0, input.acHours));
  const chairs = Math.min(5, Math.max(1, input.chairs));

  const acDaily = input.acOn ? acHours * 0.9 * (area / 120) : 0;
  const lightsDaily = input.bldcOn
    ? 1.2 * (hours / 9)
    : 2.4 * (hours / 9);
  const trimmersDaily = input.clippersOn
    ? 0.8 * (0.7 + chairs * 0.15)
    : chairs * 0.45;
  const steamerDaily = input.steamerOn ? 0.75 : 0;
  const chairBaseDaily = chairs * 0.12;

  const dailyUnits =
    acDaily + lightsDaily + trimmersDaily + steamerDaily + chairBaseDaily;
  const monthlyUnits = dailyUnits * 30;
  const withinQuota = monthlyUnits <= GO23_FREE_UNITS;
  const overageUnits = Math.max(0, monthlyUnits - GO23_FREE_UNITS);

  const badgeTe = withinQuota
    ? "✅ 100% సేఫ్ జోన్ (జీవో 23 రక్షణలో ఉంది)"
    : `⚠️ హెచ్చరిక! 250 యూనిట్లు దాటింది (+${overageUnits.toFixed(1)} యూనిట్లు అదనం)`;

  const billTe = withinQuota ? "₹0 (పూర్తి ఉచితం)" : "కమర్షియల్ స్లాబ్ ప్రమాదం";

  const recommendationTe = withinQuota
    ? "మీ విద్యుత్ వినియోగం జీవో 23 నిబంధనల ప్రకారం 250 యూనిట్లలోపే ఉంది. విద్యుత్ అధికారులు కమర్షియల్ కేటగిరీ కింద మార్చలేరు."
    : "ఏసీని 24°C లేదా 25°C వద్ద నడపండి, లేదా రోజుకు 1 గంట వినియోగం తగ్గిస్తే మళ్లీ ఉచిత విద్యుత్ స్లాబ్‌లోకి వస్తారు.";

  return {
    acDaily,
    lightsDaily,
    trimmersDaily,
    steamerDaily,
    chairBaseDaily,
    dailyUnits,
    totalUnits: monthlyUnits,
    monthlyUnits,
    withinQuota,
    overageUnits,
    recommendationTe,
    badgeTe,
    billTe,
  };
}

/**
 * Bank DPR math (messages[2614]):
 * - Project cost = sum of selected capital items (default ₹1.3L)
 * - Margin money = 10%; bank loan = 90%
 * - EMI = reducing-balance, 36 months @ 9.5% p.a.
 * - NOI = Revenue − Rent/Expenses − (Revenue × 0.45 variable Cos)
 * - DSCR = (monthly NOI × 12) / (EMI × 12); healthy when ≥ 1.5
 *   (defaults ≈ 2.1× on ₹1.17L loan / ₹25k rev / ₹6k expenses)
 */
export function computeLoanDpr(input: LoanDprInput): LoanDprResult {
  const selected = LOAN_EQUIPMENT.filter((e) =>
    input.equipmentIds.includes(e.id),
  );
  const capitalOutlayInr = selected.reduce((s, e) => s + e.costInr, 0);
  const marginMoneyInr = Math.round(capitalOutlayInr * 0.1);
  const bankLoanInr = capitalOutlayInr - marginMoneyInr;

  const monthlyEmiInr = reducingBalanceEmi(
    bankLoanInr,
    LOAN_EMI_RATE_PA,
    LOAN_EMI_TENURE_MONTHS,
  );

  const revenue = Math.max(0, input.monthlyRevenueInr);
  const expenses = Math.max(0, input.monthlyExpensesInr);
  const variableCost = revenue * LOAN_VARIABLE_COST_RATIO;
  const monthlyNoi = Math.max(0, revenue - expenses - variableCost);
  const annualNoiInr = Math.round(monthlyNoi * 12);
  const annualDebtServiceInr = monthlyEmiInr * 12 || 1;
  const dscr =
    Math.round((annualNoiInr / annualDebtServiceInr) * 100) / 100;

  // 3-year projection: modest 8% revenue CAGR, expenses +5%/yr
  const cashflows = [1, 2, 3].map((year) => {
    const revFactor = Math.pow(1.08, year - 1);
    const expFactor = Math.pow(1.05, year - 1);
    const yearRevenue = Math.round(revenue * 12 * revFactor);
    const yearExpenses = Math.round(expenses * 12 * expFactor);
    const yearEmi = monthlyEmiInr * 12;
    return {
      year,
      revenueInr: yearRevenue,
      expensesInr: yearExpenses,
      emiInr: yearEmi,
      netInr: yearRevenue - yearExpenses - yearEmi,
    };
  });

  return {
    capitalOutlayInr,
    marginMoneyInr,
    bankLoanInr,
    monthlyEmiInr,
    annualNoiInr,
    annualDebtServiceInr,
    cashflows,
    dscr,
    dscrHealthy: dscr >= 1.5,
    interestRatePa: LOAN_EMI_RATE_PA,
    tenureMonths: LOAN_EMI_TENURE_MONTHS,
    equipmentLines: selected,
  };
}

export function loanDeskWhatsAppUrl(args: {
  applicantName: string;
  phone: string;
  subCasteTe: string;
  districtNameTe: string;
  mandalNameTe: string;
  unitType: "modernize" | "new";
  dpr: LoanDprResult;
}): string {
  const unitTe =
    args.unitType === "modernize"
      ? "ఉన్న సెలూన్ ఆధునికీకరణ"
      : "కొత్త సెలూన్ ఏర్పాటు";
  const text = [
    "నమస్కారం, నాయీ సమాఖ్య డెస్క్ — బ్యాంక్ DPR / సబ్సిడీ గైడెన్స్ అవసరం.",
    `పేరు: ${args.applicantName}`,
    `వాట్సాప్: ${args.phone}`,
    `ఉపకులం (BC-A): ${args.subCasteTe}`,
    `ప్రాంతం: ${args.mandalNameTe}, ${args.districtNameTe}`,
    `యూనిట్: ${unitTe}`,
    `మూలధనం: ₹${args.dpr.capitalOutlayInr.toLocaleString("en-IN")}`,
    `మార్జిన్ (10%): ₹${args.dpr.marginMoneyInr.toLocaleString("en-IN")}`,
    `బ్యాంక్ రుణం (90%): ₹${args.dpr.bankLoanInr.toLocaleString("en-IN")}`,
    `EMI (~36 నెలలు @ 9.5%): ₹${args.dpr.monthlyEmiInr.toLocaleString("en-IN")}/నెల`,
    `DSCR: ${args.dpr.dscr.toFixed(2)}x`,
    "పథకాలు: PM Vishwakarma / PMEGP / Telangana BC Co-Op Finance Corporation",
    "దయచేసి బ్యాంక్ గైడెన్స్ అందించండి.",
  ].join("\n");
  return `https://wa.me/${HELPLINE_WA}?text=${encodeURIComponent(text)}`;
}

export function loadSalonHubOrders(): SalonHubOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SALON_HUB_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SalonHubOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSalonHubOrder(order: SalonHubOrder): void {
  const prev = loadSalonHubOrders();
  window.localStorage.setItem(
    SALON_HUB_ORDERS_KEY,
    JSON.stringify([order, ...prev].slice(0, 40)),
  );
}

export function mandalDeskWhatsAppUrl(order: SalonHubOrder): string {
  const lines = order.lines
    .map((l) => `• ${l.nameTe} × ${l.qty} = ₹${l.lineTotalInr}`)
    .join("\n");
  const text = [
    "సెలూన్ హబ్ — సమూహ ఇండెంట్ అలర్ట్",
    `ఆర్డర్: ${order.id}`,
    `పేరు: ${order.name}`,
    `వాట్సాప్: ${order.whatsapp}`,
    `మండలం: ${order.mandalNameTe}, ${order.districtNameTe}`,
    `చెల్లింపు: ${order.payment === "cod" ? "COD (మండల హబ్)" : "UPI (మండల హబ్)"}`,
    "వస్తువులు:",
    lines,
    `మొత్తం: ₹${order.totalInr}`,
  ].join("\n");
  return `https://wa.me/${HELPLINE_WA}?text=${encodeURIComponent(text)}`;
}

export function newOrderId(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SH-${stamp}-${rand}`;
}
