import { getGeoDistrict, listGeoDistricts } from "@/data/telanganaGeo";
import {
  GRIEVANCE_STORAGE_KEY,
  getGrievanceType,
  type DiscomId,
  type GrievanceFormState,
  type GrievanceRecord,
  type GrievanceTypeId,
} from "@/types/grievance";

export function districtOptions() {
  return listGeoDistricts()
    .slice()
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));
}

export function mandalOptions(districtSlug: string) {
  const d = getGeoDistrict(districtSlug);
  if (!d) return [];
  return d.mandals
    .slice()
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn, "en"));
}

export function districtLabel(slug: string, te = true): string {
  const d = getGeoDistrict(slug);
  if (!d) return slug;
  return te ? d.nameTe || d.nameEn : d.nameEn;
}

export function mandalLabel(
  districtSlug: string,
  mandalSlug: string,
  te = true,
): string {
  const d = getGeoDistrict(districtSlug);
  const m = d?.mandals.find((x) => x.slug === mandalSlug);
  if (!m) return mandalSlug;
  return te ? m.nameTe || m.nameEn : m.nameEn;
}

/** Suggest DISCOM from district zone — North → TGNPDCL; else TGSPDCL. */
export function suggestDiscom(districtSlug: string): DiscomId {
  const d = getGeoDistrict(districtSlug);
  if (d?.zone === "North Telangana") return "TGNPDCL";
  return "TGSPDCL";
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `grv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function generateReferenceId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `NS-GO23-${day}-${n}`;
}

export function formatOfficialDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  try {
    return d.toLocaleDateString("te-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function defaultFormState(): GrievanceFormState {
  const districts = districtOptions();
  const districtSlug = districts.find((d) => d.slug === "suryapet")?.slug
    || districts[0]?.slug
    || "suryapet";
  const mandals = mandalOptions(districtSlug);
  return {
    fullName: "",
    shopName: "",
    mobile: "",
    districtSlug,
    mandalSlug: mandals[0]?.slug || "",
    discom: suggestDiscom(districtSlug),
    uscno: "",
    connectedLoad: "1 kW",
    avgMonthlyUnits: "180",
    grievanceType: "subsidy_not_applied",
    narrative: "",
  };
}

export function readLocalGrievances(): GrievanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GRIEVANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GrievanceRecord[];
    return Array.isArray(parsed) ? parsed.slice(-50) : [];
  } catch {
    return [];
  }
}

export function persistLocalGrievance(record: GrievanceRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = readLocalGrievances();
    list.push(record);
    localStorage.setItem(
      GRIEVANCE_STORAGE_KEY,
      JSON.stringify(list.slice(-50)),
    );
  } catch {
    /* quota */
  }
}

export function buildLocalRecord(
  form: GrievanceFormState,
): GrievanceRecord {
  const type = getGrievanceType(form.grievanceType);
  return {
    ...form,
    id: uid(),
    referenceId: generateReferenceId(),
    createdAt: new Date().toISOString(),
    districtTe: districtLabel(form.districtSlug, true),
    mandalTe: mandalLabel(form.districtSlug, form.mandalSlug, true),
    grievanceLabelTe: `${type.option}. ${type.titleTe}`,
  };
}

export function isValidUscno(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 12;
}

export function isValidMobile(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

export function grievanceTypeLabel(id: GrievanceTypeId): string {
  const t = getGrievanceType(id);
  return `${t.option}. ${t.titleTe} (${t.titleEn})`;
}
