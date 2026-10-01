"use server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  deskAuthRequired,
  isDeskUnlocked,
} from "@/lib/moderation/deskAuth";
import { mapDbRow as mapReelDbRow } from "@/lib/reels/store";
import type { SurveyWithRef } from "@/lib/moderation/csvExport";
import type { ReelSubmission } from "@/types/reels";
import type {
  AreaType,
  Go23Status,
  Profession,
  ShopTenancy,
  SubCaste,
  SurveySubmission,
} from "@/types/survey";

export type StatewideExportPayload = {
  ok: boolean;
  source: "supabase" | "unavailable";
  mock: boolean;
  surveys: SurveyWithRef[];
  reels: ReelSubmission[];
  error?: string;
};

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function coerceStatewideFromPayload(
  row: Record<string, unknown>,
): SurveyWithRef | null {
  const payload =
    row.payload && typeof row.payload === "object"
      ? (row.payload as Record<string, unknown>)
      : {};
  const schema = cell(payload.schema);
  const isStatewide = schema === "statewide_v1" || Boolean(payload.fullName);

  const id = cell(row.id) || cell(payload.id);
  const fullName =
    cell(payload.fullName).trim() || cell(row.head_name).trim();
  const phone =
    cell(payload.phone).replace(/\D/g, "") ||
    cell(row.whatsapp).replace(/\D/g, "");

  if (!id && !fullName && !phone) return null;

  const familyMembers = Array.isArray(payload.familyMembers)
    ? (payload.familyMembers as SurveySubmission["familyMembers"])
    : [];

  const refCode =
    cell(payload.refCode).trim() ||
    cell(payload.referenceId).trim() ||
    cell(row.reference_id).trim() ||
    undefined;

  if (isStatewide) {
    return {
      id: id || cell(row.reference_id) || fullName,
      timestamp:
        cell(payload.timestamp) ||
        cell(payload.submittedAt) ||
        cell(row.created_at),
      fullName,
      phone,
      subCaste: (cell(payload.subCaste) ||
        cell(row.community_wing) ||
        "") as SubCaste,
      districtSlug:
        cell(payload.districtSlug) || cell(row.district_slug) || "",
      areaType: (cell(payload.areaType) || "rural") as AreaType,
      mandalSlug: cell(payload.mandalSlug) || cell(row.mandal_slug) || "",
      wardOrPanchayat:
        cell(payload.wardOrPanchayat) || cell(row.gram_panchayat) || "",
      totalFamilyMembers:
        Number(payload.totalFamilyMembers) || familyMembers.length || 0,
      studentsCount: Number(payload.studentsCount) || 0,
      familyMembers,
      hasMatrimonialCandidate: Boolean(payload.hasMatrimonialCandidate),
      matrimonialData: payload.matrimonialData as SurveySubmission["matrimonialData"],
      primaryProfession: (cell(payload.primaryProfession) ||
        cell(row.occupation) ||
        "other") as Profession,
      shopTenancy: (cell(payload.shopTenancy) || "na") as ShopTenancy,
      monthlyRent:
        typeof payload.monthlyRent === "number"
          ? payload.monthlyRent
          : undefined,
      tradeLicenseStatus: (cell(payload.tradeLicenseStatus) ||
        "na_rural") as SurveySubmission["tradeLicenseStatus"],
      uscno: payload.uscno ? String(payload.uscno) : undefined,
      go23Status: (cell(payload.go23Status) || "na") as Go23Status,
      welfareReceived: Array.isArray(payload.welfareReceived)
        ? (payload.welfareReceived as string[])
        : [],
      immediateGrievance: cell(payload.immediateGrievance),
      desiredAction: (cell(payload.desiredAction) ||
        "whatsapp_updates") as SurveySubmission["desiredAction"],
      declarationAccepted: Boolean(payload.declarationAccepted),
      refCode,
      referenceId: cell(row.reference_id) || refCode,
    };
  }

  // Legacy mandal field-census row
  return {
    id: id || cell(row.reference_id),
    timestamp: cell(row.created_at),
    fullName,
    phone,
    subCaste: (cell(row.community_wing) || "") as SubCaste,
    districtSlug: cell(row.district_slug),
    areaType: "rural",
    mandalSlug: cell(row.mandal_slug),
    wardOrPanchayat: cell(row.gram_panchayat),
    totalFamilyMembers: Array.isArray(payload.members)
      ? payload.members.length
      : 0,
    studentsCount: 0,
    familyMembers: [],
    hasMatrimonialCandidate: false,
    primaryProfession: (cell(row.occupation) || "other") as Profession,
    shopTenancy: "na",
    tradeLicenseStatus: "na_rural",
    go23Status: "na",
    welfareReceived: [],
    immediateGrievance: "",
    desiredAction: "whatsapp_updates",
    declarationAccepted: true,
    refCode,
    referenceId: cell(row.reference_id) || refCode,
  };
}

/**
 * Desk-authenticated statewide export pull (service role).
 * Returns `source: "unavailable"` + mock flag when Supabase/admin is unset
 * so the client can fall back to localStorage.
 */
export async function fetchStatewideExportData(): Promise<StatewideExportPayload> {
  if (deskAuthRequired() && !(await isDeskUnlocked())) {
    return {
      ok: false,
      source: "unavailable",
      mock: true,
      surveys: [],
      reels: [],
      error: "unauthorized",
    };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: true,
      source: "unavailable",
      mock: true,
      surveys: [],
      reels: [],
      error: "supabase_admin_not_configured",
    };
  }

  try {
    const [surveyRes, reelRes] = await Promise.all([
      admin
        .from("surveys")
        .select(
          "id, reference_id, district_slug, mandal_slug, gram_panchayat, head_name, whatsapp, community_wing, occupation, payload, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(5000),
      admin
        .from("reels")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000),
    ]);

    if (surveyRes.error && reelRes.error) {
      return {
        ok: false,
        source: "unavailable",
        mock: true,
        surveys: [],
        reels: [],
        error: surveyRes.error.message || reelRes.error.message,
      };
    }

    const surveys = (surveyRes.data || [])
      .map((row) => coerceStatewideFromPayload(row as Record<string, unknown>))
      .filter((s): s is SurveyWithRef => Boolean(s));

    const reels = (reelRes.data || []).flatMap((row) => {
      try {
        return [mapReelDbRow(row as Record<string, unknown>)];
      } catch {
        return [];
      }
    });

    return {
      ok: true,
      source: "supabase",
      mock: false,
      surveys,
      reels: reelRes.error ? [] : reels,
      error: surveyRes.error?.message || reelRes.error?.message,
    };
  } catch (err) {
    return {
      ok: false,
      source: "unavailable",
      mock: true,
      surveys: [],
      reels: [],
      error: err instanceof Error ? err.message : "export_fetch_failed",
    };
  }
}
