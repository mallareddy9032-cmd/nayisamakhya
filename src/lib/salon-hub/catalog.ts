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

export const LOAN_EQUIPMENT: {
  id: LoanEquipmentId;
  nameTe: string;
  costInr: number;
}[] = [
  { id: "hydraulic_chair", nameTe: "హైడ్రాలిక్ చైర్", costInr: 35000 },
  { id: "mirror_station", nameTe: "మిర్రర్ స్టేషన్", costInr: 18000 },
  { id: "sterilizer", nameTe: "స్టెరిలైజర్ / UV బాక్స్", costInr: 8000 },
  { id: "trimmer_set", nameTe: "ట్రిమ్మర్ సెట్ (2)", costInr: 12000 },
  { id: "hair_dryer", nameTe: "హెయిర్ డ్రయ్యర్ + స్టైలింగ్", costInr: 10000 },
  { id: "ac_15", nameTe: "ఏసీ 1.5 టన్", costInr: 45000 },
  { id: "signage", nameTe: "సైనేజ్ & బ్రాండింగ్", costInr: 15000 },
  { id: "water_heater", nameTe: "వాటర్ హీటర్", costInr: 12000 },
];

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
  const area = Math.min(400, Math.max(80, input.areaSqft));
  const hours = Math.min(14, Math.max(6, input.hours));
  const chairs = Math.min(6, Math.max(1, input.chairs));

  const acDaily = input.acOn ? area * hours * 0.18 : 0;
  const lightsDaily = 1.2;
  const trimmersDaily = chairs * 0.8;
  const dailyUnits = acDaily + lightsDaily + trimmersDaily;
  const monthlyUnits = dailyUnits * 30;
  const withinQuota = monthlyUnits <= GO23_FREE_UNITS;

  const recommendationTe = withinQuota
    ? "మీ వినియోగం జీ.ఓ. 23 ఉచిత కోటా (250 యూనిట్లు) లోపలే ఉంది. గ్రీన్ సెలూన్ సర్టిఫికేట్ ప్రింట్ చేసుకోండి."
    : "మీ అంచనా 250 యూనిట్లు దాటింది. ఏసీ గంటలు తగ్గించండి, LED లైట్లు వాడండి, ట్రిమ్మర్ స్టాండ్‌బైని ఆపండి — కోటా లోపలికి తీసుకురండి.";

  return {
    acDaily,
    lightsDaily,
    trimmersDaily,
    dailyUnits,
    monthlyUnits,
    withinQuota,
    recommendationTe,
  };
}

export function computeLoanDpr(input: LoanDprInput): LoanDprResult {
  const selected = LOAN_EQUIPMENT.filter((e) =>
    input.equipmentIds.includes(e.id),
  );
  const equipmentSum = selected.reduce((s, e) => s + e.costInr, 0);
  const revenueBand =
    input.monthlyRevenueInr >= 80000
      ? 300000
      : input.monthlyRevenueInr >= 50000
        ? 250000
        : input.monthlyRevenueInr >= 30000
          ? 200000
          : 150000;

  const capitalOutlayInr = Math.min(
    300000,
    Math.max(150000, Math.round((equipmentSum + revenueBand) / 2 / 1000) * 1000),
  );

  const bcCorpSubsidyInr = Math.round(capitalOutlayInr * 0.2);
  const ownContributionInr = Math.round(capitalOutlayInr * 0.1);
  const mudraLoanInr = capitalOutlayInr - bcCorpSubsidyInr - ownContributionInr;

  // Flat 9% / 60 months approximation for dossier EMI
  const monthlyRate = 0.09 / 12;
  const n = 60;
  const monthlyEmiInr =
    mudraLoanInr > 0
      ? Math.round(
          (mudraLoanInr * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1),
        )
      : 0;

  const annualOpsSurplus = Math.max(
    0,
    input.monthlyRevenueInr * 12 * 0.28 - monthlyEmiInr * 12 * 0.15,
  );
  const annualCashflowInr = Math.round(
    input.monthlyRevenueInr * 12 * 0.35 - monthlyEmiInr * 12,
  );
  const debtService = monthlyEmiInr * 12 || 1;
  const dscr = Math.round((annualOpsSurplus / debtService) * 100) / 100;

  return {
    capitalOutlayInr,
    ownContributionInr,
    mudraLoanInr,
    bcCorpSubsidyInr,
    monthlyEmiInr,
    annualCashflowInr,
    dscr: Math.max(0.5, Math.min(3.5, dscr || 1.2)),
    equipmentLines: selected,
  };
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
