/** Salon Studio Enterprise Hub — shared types */

export type SalonHubRoute = "gateway" | "procure" | "energy" | "loans";

/** Three wholesale package kits on the Group Indent desk. */
export type ProcurePackageId = "barber" | "spa" | "towels";

export type ProcurePackage = {
  id: ProcurePackageId;
  nameTe: string;
  nameEn: string;
  specs: string;
  hubPriceInr: number;
  mrpInr: number;
};

export type ProcureCartLine = {
  packageId: ProcurePackageId;
  qty: number;
};

export type SalonHubOrder = {
  id: string;
  createdAt: string;
  salonName: string;
  ownerName: string;
  whatsapp: string;
  districtSlug: string;
  districtNameTe: string;
  mandalSlug: string;
  mandalNameTe: string;
  payment: "cod_upi_hub";
  lines: Array<{
    packageId: ProcurePackageId;
    nameTe: string;
    qty: number;
    hubPriceInr: number;
    mrpInr: number;
    lineTotalInr: number;
    lineSavingsInr: number;
  }>;
  totalItems: number;
  totalInr: number;
  savingsInr: number;
};

export type EnergyPlanInput = {
  /** Shop floor area in sq ft (60–300). */
  areaSqft: number;
  /** Daily operating hours (4–14). */
  hours: number;
  /** Peak inverter AC run-hours per day (0–10). */
  acHours: number;
  /** Workstations / chairs (1–5). */
  chairs: number;
  /** 5-Star Inverter AC (1 Ton) in use. */
  acOn: boolean;
  /** BLDC fans & DC LEDs. */
  bldcOn: boolean;
  /** Professional cordless clippers & trimmers. */
  clippersOn: boolean;
  /** Towel steamer / UV sterilizer. */
  steamerOn: boolean;
};

export type EnergyPlanResult = {
  acDaily: number;
  lightsDaily: number;
  trimmersDaily: number;
  steamerDaily: number;
  chairBaseDaily: number;
  dailyUnits: number;
  /** Alias used by gauge copy — same as monthlyUnits. */
  totalUnits: number;
  monthlyUnits: number;
  withinQuota: boolean;
  overageUnits: number;
  recommendationTe: string;
  badgeTe: string;
  billTe: string;
};

export type LoanEquipmentId =
  | "hydraulic_chairs"
  | "inverter_ac"
  | "wash_station"
  | "uv_tools"
  | "interior_wiring";

export type LoanUnitType = "modernize" | "new";

export type LoanDprInput = {
  monthlyRevenueInr: number;
  monthlyExpensesInr: number;
  equipmentIds: LoanEquipmentId[];
  applicantName: string;
  phone: string;
  subCaste: string;
  unitType: LoanUnitType;
  districtSlug: string;
  districtNameTe: string;
  mandalSlug: string;
  mandalNameTe: string;
};

export type LoanDprResult = {
  /** Sum of selected capital items (project cost). */
  capitalOutlayInr: number;
  /** Margin money — 10% of project cost (own contribution). */
  marginMoneyInr: number;
  /** Bank loan component — 90% of project cost. */
  bankLoanInr: number;
  /** Reducing-balance EMI, 36 months @ 9.5% p.a. */
  monthlyEmiInr: number;
  /** Annual net operating income used in DSCR. */
  annualNoiInr: number;
  /** Annual debt service (EMI × 12). */
  annualDebtServiceInr: number;
  /** Projected 3-year cashflow rows (revenue − expenses − EMI). */
  cashflows: Array<{
    year: number;
    revenueInr: number;
    expensesInr: number;
    emiInr: number;
    netInr: number;
  }>;
  /** DSCR = annual NOI / annual debt service. Healthy when ≥ 1.5. */
  dscr: number;
  dscrHealthy: boolean;
  interestRatePa: number;
  tenureMonths: number;
  equipmentLines: Array<{
    id: LoanEquipmentId;
    nameTe: string;
    nameEn: string;
    costInr: number;
  }>;
};

/** Standard reducing-balance EMI tenure / rate for salon DPR dossiers. */
export const LOAN_EMI_TENURE_MONTHS = 36;
export const LOAN_EMI_RATE_PA = 0.095;
/** Variable Cos share of revenue used when estimating NOI for DSCR. */
export const LOAN_VARIABLE_COST_RATIO = 0.45;

export const SALON_HUB_ORDERS_KEY = "salon_hub_orders";

export const HELPLINE_WA = "919032654111";
export const GO23_FREE_UNITS = 250;
