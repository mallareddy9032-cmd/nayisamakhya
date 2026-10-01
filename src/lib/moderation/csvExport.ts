/**
 * 1-click statewide CSV + Excel export for the moderation desk.
 *
 * CSV downloads go through shared `exportToCSV` (UTF-8 BOM for Telugu in Excel,
 * dated `{prefix}_{YYYY-MM-DD}.csv`, bilingual empty-data alert).
 *
 * Data sources (priority):
 * 1. Supabase via desk server action (`surveys` + `reels`) when service role is set
 * 2. Browser localStorage fallback — `nayi_statewide_survey_submissions_v1` + `reels_db`
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
import { exportToCSV } from "@/lib/exportToCSV";
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

/** Filename prefix; dated as `{prefix}_{YYYY-MM-DD}.csv` via `exportToCSV`. */
export const CSV_DOWNLOAD_FILENAME_PREFIX = "nayisamakhya_statewide_data";
/** @deprecated Prefer dated downloads from `exportToCSV`; kept for callers. */
export const CSV_DOWNLOAD_FILENAME = "nayisamakhya_statewide_data.csv";
export const EXCEL_DOWNLOAD_FILENAME = "nayisamakhya_statewide_data.xls";

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

export type ExportFormat = "csv" | "excel";

export type ExportDownloadResult = {
  ok: boolean;
  rowCount: number;
  source: "supabase" | "localStorage" | "none";
  format: ExportFormat;
  reason?: string;
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

function escapeXml(value: unknown): string {
  return cell(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Excel 2003 XML Spreadsheet — opens natively in Excel / LibreOffice. */
export function rowsToExcelXml(rows: StatewideCsvRow[]): string {
  const cellXml = (value: unknown) =>
    `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
  const rowXml = (values: readonly string[]) =>
    `<Row>${values.map((v) => cellXml(v)).join("")}</Row>`;

  const header = rowXml(CSV_HEADERS);
  const body = rows
    .map((row) => rowXml(CSV_HEADERS.map((h) => row[h])))
    .join("");

  return [
    `<?xml version="1.0"?>`,
    `<?mso-application progid="Excel.Sheet"?>`,
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"`,
    ` xmlns:o="urn:schemas-microsoft-com:office:office"`,
    ` xmlns:x="urn:schemas-microsoft-com:office:excel"`,
    ` xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">`,
    `<Worksheet ss:Name="Statewide">`,
    `<Table>`,
    header,
    body,
    `</Table>`,
    `</Worksheet>`,
    `</Workbook>`,
  ].join("");
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
  surveys?: SurveyWithRef[];
  reels?: ReelSubmission[];
}): StatewideCsvRow[] {
  const includeReels = options?.includeReels !== false;
  const surveys = options?.surveys ?? readLocalSurveys();
  const rows = surveys.map(mapSurveyToCsvRow);
  const seen = new Set(rows.map((r) => r.ID).filter(Boolean));

  if (includeReels) {
    const reels = options?.reels ?? readLocalReels();
    for (const reel of reels) {
      if (reel.id && seen.has(reel.id)) continue;
      rows.push(mapReelToCsvRow(reel));
      if (reel.id) seen.add(reel.id);
    }
  }

  return rows;
}

function triggerBrowserDownload(
  content: string,
  filename: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Trigger browser download of statewide CSV (UTF-8 BOM + dated filename).
 * No-ops when `window` is unavailable (SSR). Empty sets surface a bilingual alert.
 */
export function downloadStatewideCsv(options?: {
  includeReels?: boolean;
  surveys?: SurveyWithRef[];
  reels?: ReelSubmission[];
  source?: ExportDownloadResult["source"];
}): ExportDownloadResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      rowCount: 0,
      source: "none",
      format: "csv",
      reason: "ssr",
    };
  }

  const source = options?.source ?? "localStorage";
  const rows = aggregateStatewideCsvRows(options);
  // Stable column order (Object.keys on row objects follows CSV_HEADERS insertion).
  const ordered = rows.map((row) => {
    const out = {} as StatewideCsvRow;
    for (const h of CSV_HEADERS) out[h] = row[h] ?? "";
    return out;
  });
  const downloaded = exportToCSV(ordered, CSV_DOWNLOAD_FILENAME_PREFIX);

  return {
    ok: downloaded || ordered.length === 0,
    rowCount: ordered.length,
    source,
    format: "csv",
    reason: downloaded || ordered.length === 0 ? undefined : "download_failed",
  };
}

/**
 * Trigger browser download of statewide Excel (.xls SpreadsheetML).
 */
export function downloadStatewideExcel(options?: {
  includeReels?: boolean;
  surveys?: SurveyWithRef[];
  reels?: ReelSubmission[];
  source?: ExportDownloadResult["source"];
}): ExportDownloadResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      rowCount: 0,
      source: "none",
      format: "excel",
      reason: "ssr",
    };
  }

  const source = options?.source ?? "localStorage";
  const rows = aggregateStatewideCsvRows(options);
  triggerBrowserDownload(
    rowsToExcelXml(rows),
    EXCEL_DOWNLOAD_FILENAME,
    "application/vnd.ms-excel;charset=utf-8",
  );

  return { ok: true, rowCount: rows.length, source, format: "excel" };
}

/**
 * Prefer Supabase (desk server action); fall back to localStorage when env/admin
 * is unset or returns no rows.
 */
export async function downloadStatewideExport(
  format: ExportFormat,
  options?: { includeReels?: boolean },
): Promise<ExportDownloadResult> {
  if (typeof window === "undefined") {
    return {
      ok: false,
      rowCount: 0,
      source: "none",
      format,
      reason: "ssr",
    };
  }

  const includeReels = options?.includeReels !== false;
  let surveys: SurveyWithRef[] | undefined;
  let reels: ReelSubmission[] | undefined;
  let source: ExportDownloadResult["source"] = "localStorage";

  try {
    const { fetchStatewideExportData } = await import(
      "@/app/admin/moderation/exportActions"
    );
    const remote = await fetchStatewideExportData();
    if (
      remote.ok &&
      remote.source === "supabase" &&
      (remote.surveys.length > 0 || remote.reels.length > 0)
    ) {
      surveys = remote.surveys;
      reels = includeReels ? remote.reels : [];
      source = "supabase";
    }
  } catch {
    // Fall through to localStorage mock path
  }

  if (format === "excel") {
    return downloadStatewideExcel({
      includeReels,
      surveys,
      reels,
      source,
    });
  }

  return downloadStatewideCsv({
    includeReels,
    surveys,
    reels,
    source,
  });
}

/** Re-export for docs / tests. */
export { REELS_STORAGE_KEY };
