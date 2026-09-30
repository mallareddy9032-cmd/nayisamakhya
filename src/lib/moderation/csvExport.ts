/**
 * 1-click statewide CSV export for the moderation desk.
 *
 * Data sources (browser localStorage — same keys as citizen flows):
 * 1. Surveys (primary): `nayi_statewide_survey_submissions_v1`
 * 2. Reels (optional rows): `reels_db` — best-effort column map
 *
 * Reel → CSV mapping:
 *   id → ID
 *   createdAt → Timestamp
 *   creatorName → Full Name
 *   phone → WhatsApp
 *   districtSlug → District (resolved name when possible)
 *   mandalSlug → Mandal
 *   Sub-Caste / Family Members / G.O. 23 / Grievance / Ref Code → empty
 *   Matrimonial Candidate → No
 */

import { getGeoDistrict } from "@/data/telanganaGeo";
import { GO23_STATUS_OPTIONS, SUB_CASTE_OPTIONS } from "@/lib/survey/options";
import { readLocalReels } from "@/lib/reels/store";
import { REELS_STORAGE_KEY } from "@/types/reels";
import {
  SURVEY_STORAGE_KEY,
  type Go23Status,
  type SurveySubmission,
  type SubCaste,
} from "@/types/survey";
import type { ReelSubmission } from "@/types/reels";

export { SURVEY_STORAGE_KEY };

export const CSV_DOWNLOAD_FILENAME = "nayisamakhya_statewide_data.csv";

/** Exact header order required by ops export. */
export const CSV_HEADERS = [
  "ID",
  "Timestamp",
  "Full Name",
  "WhatsApp",
  "Sub-Caste",
  "District",
  "Mandal",
  "Family Members Count",
  "G.O. 23 Status",
  "Immediate Grievance",
  "Matrimonial Candidate (Yes/No)",
  "Ref Code",
] as const;

export type CsvColumn = (typeof CSV_HEADERS)[number];

export type StatewideCsvRow = Record<CsvColumn, string>;

export type SurveyWithRef = SurveySubmission & {
  refCode?: string;
  referenceId?: string;
};

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

/** RFC-style CSV field escape (quotes, commas, newlines). */
export function escapeCsvField(value: unknown): string {
  const raw = cell(value);
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function rowsToCsv(rows: StatewideCsvRow[]): string {
  const headerLine = CSV_HEADERS.map((h) => escapeCsvField(h)).join(",");
  const body = rows.map((row) =>
    CSV_HEADERS.map((h) => escapeCsvField(row[h])).join(","),
  );
  return [headerLine, ...body].join("\r\n");
}

function resolvePlaceName(districtSlug: string, mandalSlug: string): {
  district: string;
  mandal: string;
} {
  const d = getGeoDistrict(districtSlug);
  const m = d?.mandals.find(
    (x) => x.slug === mandalSlug || x.slug === mandalSlug.toLowerCase(),
  );
  return {
    district: d?.nameEn || districtSlug || "",
    mandal: m?.nameEn || mandalSlug || "",
  };
}

function labelSubCaste(id: string): string {
  const hit = SUB_CASTE_OPTIONS.find((o) => o.id === (id as SubCaste));
  return hit ? hit.label.en : id || "";
}

function labelGo23(id: string): string {
  const hit = GO23_STATUS_OPTIONS.find((o) => o.id === (id as Go23Status));
  return hit ? hit.label.en : id || "";
}

function matrimonialYesNo(survey: SurveySubmission): string {
  if (survey.hasMatrimonialCandidate) return "Yes";
  const members = survey.familyMembers || [];
  if (members.some((m) => m.isMatrimonialCandidate)) return "Yes";
  return "No";
}

function familyCount(survey: SurveySubmission): string {
  if (
    typeof survey.totalFamilyMembers === "number" &&
    Number.isFinite(survey.totalFamilyMembers)
  ) {
    return String(survey.totalFamilyMembers);
  }
  const n = Array.isArray(survey.familyMembers)
    ? survey.familyMembers.length
    : 0;
  return n ? String(n) : "";
}

export function mapSurveyToCsvRow(survey: SurveyWithRef): StatewideCsvRow {
  const { district, mandal } = resolvePlaceName(
    survey.districtSlug || "",
    survey.mandalSlug || "",
  );
  const ref =
    cell(survey.refCode).trim() || cell(survey.referenceId).trim() || "";
  return {
    ID: cell(survey.id),
    Timestamp: cell(survey.timestamp),
    "Full Name": cell(survey.fullName),
    WhatsApp: cell(survey.phone),
    "Sub-Caste": labelSubCaste(cell(survey.subCaste)),
    District: district,
    Mandal: mandal,
    "Family Members Count": familyCount(survey),
    "G.O. 23 Status": labelGo23(cell(survey.go23Status)),
    "Immediate Grievance": cell(survey.immediateGrievance),
    "Matrimonial Candidate (Yes/No)": matrimonialYesNo(survey),
    "Ref Code": ref,
  };
}

/** Best-effort reel → same column set; caption maps to Immediate Grievance. */
export function mapReelToCsvRow(reel: ReelSubmission): StatewideCsvRow {
  const { district, mandal } = resolvePlaceName(
    reel.districtSlug || "",
    reel.mandalSlug || "",
  );
  return {
    ID: cell(reel.id),
    Timestamp: cell(reel.createdAt),
    "Full Name": cell(reel.creatorName),
    WhatsApp: cell(reel.phone),
    "Sub-Caste": "",
    District: district,
    Mandal: mandal,
    "Family Members Count": "",
    "G.O. 23 Status": "",
    "Immediate Grievance": cell(reel.caption),
    "Matrimonial Candidate (Yes/No)": "No",
    "Ref Code": "",
  };
}

function coerceSurvey(raw: unknown): SurveyWithRef | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<SurveyWithRef>;
  if (!s.id && !s.fullName && !s.phone) return null;
  return {
    id: String(s.id || ""),
    timestamp: String(s.timestamp || ""),
    fullName: String(s.fullName || ""),
    phone: String(s.phone || ""),
    subCaste: (s.subCaste || "") as SubCaste,
    districtSlug: String(s.districtSlug || ""),
    areaType: (s.areaType || "rural") as SurveySubmission["areaType"],
    mandalSlug: String(s.mandalSlug || ""),
    wardOrPanchayat: String(s.wardOrPanchayat || ""),
    totalFamilyMembers: Number(s.totalFamilyMembers) || 0,
    studentsCount: Number(s.studentsCount) || 0,
    familyMembers: Array.isArray(s.familyMembers) ? s.familyMembers : [],
    hasMatrimonialCandidate: Boolean(s.hasMatrimonialCandidate),
    matrimonialData: s.matrimonialData,
    primaryProfession:
      (s.primaryProfession || "other") as SurveySubmission["primaryProfession"],
    shopTenancy: (s.shopTenancy || "na") as SurveySubmission["shopTenancy"],
    monthlyRent: s.monthlyRent,
    tradeLicenseStatus:
      (s.tradeLicenseStatus ||
        "na_rural") as SurveySubmission["tradeLicenseStatus"],
    uscno: s.uscno,
    go23Status: (s.go23Status || "na") as Go23Status,
    welfareReceived: Array.isArray(s.welfareReceived) ? s.welfareReceived : [],
    immediateGrievance: String(s.immediateGrievance || ""),
    desiredAction:
      (s.desiredAction ||
        "whatsapp_updates") as SurveySubmission["desiredAction"],
    declarationAccepted: Boolean(s.declarationAccepted),
    refCode: s.refCode ? String(s.refCode) : undefined,
    referenceId: s.referenceId ? String(s.referenceId) : undefined,
  };
}

export function readLocalSurveys(): SurveyWithRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(coerceSurvey)
      .filter((s): s is SurveyWithRef => Boolean(s));
  } catch {
    return [];
  }
}

/**
 * Aggregate statewide CSV rows: surveys first, then reels (no id collisions
 * preferred — if a reel id matches a survey id, reel is skipped).
 */
export function aggregateStatewideCsvRows(options?: {
  includeReels?: boolean;
}): StatewideCsvRow[] {
  const includeReels = options?.includeReels !== false;
  const surveys = readLocalSurveys();
  const rows = surveys.map(mapSurveyToCsvRow);
  const seen = new Set(rows.map((r) => r.ID).filter(Boolean));

  if (includeReels) {
    for (const reel of readLocalReels()) {
      if (reel.id && seen.has(reel.id)) continue;
      rows.push(mapReelToCsvRow(reel));
      if (reel.id) seen.add(reel.id);
    }
  }

  return rows;
}

/**
 * Trigger browser download of `nayisamakhya_statewide_data.csv`.
 * No-ops when `window` is unavailable (SSR).
 */
export function downloadStatewideCsv(options?: {
  includeReels?: boolean;
}): { ok: boolean; rowCount: number; reason?: string } {
  if (typeof window === "undefined") {
    return { ok: false, rowCount: 0, reason: "ssr" };
  }

  const rows = aggregateStatewideCsvRows(options);
  const csv = rowsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = CSV_DOWNLOAD_FILENAME;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return { ok: true, rowCount: rows.length };
}

/** Re-export for docs / tests. */
export { REELS_STORAGE_KEY };
