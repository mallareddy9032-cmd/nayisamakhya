/** Salon Studio Enterprise Hub — shared types */

export type SalonHubRoute = "gateway" | "procure" | "energy" | "loans";

export type ProcureBundleId = "A" | "B" | "C";

export type ProcureLineItem = {
  id: string;
  bundleId: ProcureBundleId;
  nameTe: string;
  nameEn: string;
  unitPriceInr: number;
  unitTe: string;
};

export type ProcureCartLine = {
  itemId: string;
  qty: number;
};

export type SalonHubOrder = {
  id: string;
  createdAt: string;
  name: string;
  whatsapp: string;
  districtSlug: string;
  districtNameTe: string;
  mandalSlug: string;
  mandalNameTe: string;
  payment: "cod" | "upi";
  lines: Array<{
    itemId: string;
    nameTe: string;
    qty: number;
    unitPriceInr: number;
    lineTotalInr: number;
  }>;
  totalInr: number;
};

export type EnergyPlanInput = {
  areaSqft: number;
  hours: number;
  acOn: boolean;
  chairs: number;
};

export type EnergyPlanResult = {
  acDaily: number;
  lightsDaily: number;
  trimmersDaily: number;
  dailyUnits: number;
  monthlyUnits: number;
  withinQuota: boolean;
  recommendationTe: string;
};

export type LoanEquipmentId =
  | "hydraulic_chair"
  | "mirror_station"
  | "sterilizer"
  | "trimmer_set"
  | "hair_dryer"
  | "ac_15"
  | "signage"
  | "water_heater";

export type LoanDprInput = {
  monthlyRevenueInr: number;
  equipmentIds: LoanEquipmentId[];
  applicantName: string;
  phone: string;
  subCaste: string;
  districtSlug: string;
  districtNameTe: string;
  mandalSlug: string;
  mandalNameTe: string;
};

export type LoanDprResult = {
  capitalOutlayInr: number;
  ownContributionInr: number;
  mudraLoanInr: number;
  bcCorpSubsidyInr: number;
  monthlyEmiInr: number;
  annualCashflowInr: number;
  dscr: number;
  equipmentLines: Array<{ id: LoanEquipmentId; nameTe: string; costInr: number }>;
};

export const SALON_HUB_ORDERS_KEY = "salon_hub_orders";

export const HELPLINE_WA = "919032654111";
export const GO23_FREE_UNITS = 250;
