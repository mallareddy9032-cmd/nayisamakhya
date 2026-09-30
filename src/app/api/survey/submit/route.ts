import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import {
  validateFamilyMembers,
  withDerivedMatrimonial,
} from "@/lib/survey/familyMembers";
import {
  deriveStatus,
  isValidSarathiRef,
  mapDbRow,
  normalizeRefCode,
} from "@/lib/sprint/volunteers";
import type { SurveySubmission } from "@/types/survey";
import type { Volunteer } from "@/types/volunteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MemberPayload = {
  name?: string;
  age?: string | number;
  gender?: string;
  educationRole?: string;
  isVoter?: boolean;
};

type SurveyBody = {
  schema?: string;
  submission?: SurveySubmission;
  districtSlug?: string;
  mandalSlug?: string;
  gramPanchayat?: string;
  headName?: string;
  whatsapp?: string;
  communityWing?: string;
  occupation?: string;
  premiseType?: string;
  powerStatus?: string;
  uscNumber?: string;
  engagementType?: string;
  pensionStatus?: string;
  members?: MemberPayload[];
  /** SARATHI referral from /survey?ref= or sprint share link */
  refCode?: string;
  ref?: string;
};

function abbr(slug: string, len: number) {
  return slug.replace(/[^a-z0-9]/gi, "").slice(0, len).toUpperCase() || "XX";
}

function buildReferenceId(districtSlug: string, mandalSlug: string) {
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `#${abbr(districtSlug, 4)}-${abbr(mandalSlug, 2)}-${seq}`;
}

function isStatewide(body: SurveyBody): body is SurveyBody & {
  submission: SurveySubmission;
} {
  return body.schema === "statewide_v1" && Boolean(body.submission);
}

function validateStatewide(s: SurveySubmission): string | null {
  if (!s.fullName?.trim() || !/^\d{10}$/.test(String(s.phone || "").replace(/\D/g, ""))) {
    return "Full name and 10-digit phone are required";
  }
  if (!s.districtSlug || !s.mandalSlug || !s.wardOrPanchayat?.trim()) {
    return "District, mandal/ULB, and ward/panchayat are required";
  }
  if (!s.subCaste || !s.primaryProfession || !s.go23Status) {
    return "Sub-caste, profession, and G.O. 23 status are required";
  }
  if (!s.declarationAccepted) {
    return "Declaration must be accepted";
  }
  if (!Array.isArray(s.welfareReceived) || s.welfareReceived.length === 0) {
    return "Select at least one welfare option";
  }
  const familyErr = validateFamilyMembers(s.familyMembers || []);
  if (familyErr) return familyErr;
  return null;
}

async function tryPersist(row: {
  referenceId: string;
  districtSlug: string;
  mandalSlug: string;
  gramPanchayat: string;
  headName: string;
  whatsapp: string;
  communityWing: string;
  occupation: string;
  payload: unknown;
}): Promise<boolean> {
  try {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase.from("surveys").insert({
      reference_id: row.referenceId,
      district_slug: row.districtSlug,
      mandal_slug: row.mandalSlug,
      gram_panchayat: row.gramPanchayat,
      head_name: row.headName,
      whatsapp: row.whatsapp,
      community_wing: row.communityWing,
      occupation: row.occupation,
      payload: row.payload,
    });
    return !error;
  } catch {
    return false;
  }
}

function extractRefCode(body: SurveyBody, submission?: SurveySubmission): string | null {
  const candidates = [
    body.refCode,
    body.ref,
    (submission as SurveySubmission & { refCode?: string })?.refCode,
  ];
  for (const c of candidates) {
    if (c && isValidSarathiRef(String(c))) {
      return normalizeRefCode(String(c));
    }
  }
  return null;
}

/** Credit field-champion volunteer when a survey lands with a valid SARATHI ref. */
async function creditVolunteerRef(
  refCode: string,
): Promise<{ credited: boolean; volunteer: Volunteer | null }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { credited: false, volunteer: null };

    const { data: existing, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("ref_code", refCode)
      .maybeSingle();

    if (error || !existing) return { credited: false, volunteer: null };

    const current = mapDbRow(existing as Record<string, unknown>);
    const nextCount = (current.completedCount || 0) + 1;
    const nextStatus = deriveStatus(nextCount);

    const { data: updated, error: updErr } = await supabase
      .from("volunteers")
      .update({
        completed_count: nextCount,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("ref_code", refCode)
      .select("*")
      .maybeSingle();

    if (updErr) return { credited: false, volunteer: current };

    return {
      credited: true,
      volunteer: updated
        ? mapDbRow(updated as Record<string, unknown>)
        : { ...current, completedCount: nextCount, status: nextStatus },
    };
  } catch {
    return { credited: false, volunteer: null };
  }
}

export async function POST(req: Request) {
  try {
    let body: SurveyBody;
    try {
      body = (await req.json()) as SurveyBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    // ── Statewide v1 schema ──────────────────────────────────────────────
    if (isStatewide(body)) {
      const submission = withDerivedMatrimonial({
        ...body.submission,
        familyMembers: body.submission.familyMembers || [],
      });
      const invalid = validateStatewide(submission);
      if (invalid) {
        return NextResponse.json(
          { success: false, error: invalid },
          { status: 400 },
        );
      }

      const phone = String(submission.phone).replace(/\D/g, "");
      const referenceId = buildReferenceId(
        submission.districtSlug,
        submission.mandalSlug,
      );
      const refCode = extractRefCode(body, submission);
      const payload = {
        schema: "statewide_v1",
        ...submission,
        phone,
        familyMembers: submission.familyMembers,
        ...(refCode ? { refCode } : {}),
        submittedAt: new Date().toISOString(),
      };

      const persisted = await tryPersist({
        referenceId,
        districtSlug: submission.districtSlug,
        mandalSlug: submission.mandalSlug,
        gramPanchayat: submission.wardOrPanchayat,
        headName: submission.fullName.trim(),
        whatsapp: phone,
        communityWing: submission.subCaste,
        occupation: submission.primaryProfession,
        payload,
      });

      let credited = false;
      let volunteer: Volunteer | null = null;
      if (refCode) {
        const credit = await creditVolunteerRef(refCode);
        credited = credit.credited;
        volunteer = credit.volunteer;
      }

      // Mock-ok when Supabase is down — client also mirrors to localStorage
      return NextResponse.json({
        success: true,
        referenceId,
        persisted,
        mock: !persisted,
        refCode: refCode || undefined,
        credited,
        volunteer,
      });
    }

    // ── Legacy mandal field-census schema ────────────────────────────────
    const districtSlug = String(body.districtSlug || "").trim();
    const mandalSlug = String(body.mandalSlug || "").trim();
    const headName = String(body.headName || "").trim();
    const whatsapp = String(body.whatsapp || "").replace(/\D/g, "");
    const gramPanchayat = String(body.gramPanchayat || "").trim();
    const communityWing = String(body.communityWing || "").trim();
    const occupation = String(body.occupation || "").trim();

    if (!districtSlug || !mandalSlug) {
      return NextResponse.json(
        { success: false, error: "Missing district or mandal" },
        { status: 400 },
      );
    }
    if (!headName || whatsapp.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Head name and 10-digit WhatsApp are required",
        },
        { status: 400 },
      );
    }
    if (!gramPanchayat || !communityWing || !occupation) {
      return NextResponse.json(
        {
          success: false,
          error: "GP, community wing, and occupation are required",
        },
        { status: 400 },
      );
    }

    const referenceId = buildReferenceId(districtSlug, mandalSlug);
    const refCode = extractRefCode(body);
    const payload = {
      ...body,
      headName,
      whatsapp,
      gramPanchayat,
      communityWing,
      occupation,
      ...(refCode ? { refCode } : {}),
      submittedAt: new Date().toISOString(),
    };

    const persisted = await tryPersist({
      referenceId,
      districtSlug,
      mandalSlug,
      gramPanchayat,
      headName,
      whatsapp,
      communityWing,
      occupation,
      payload,
    });

    if (!persisted) {
      return NextResponse.json(
        {
          success: false,
          referenceId,
          persisted: false,
          error:
            "survey_not_persisted — ensure surveys table exists and Supabase keys are set",
        },
        { status: 503 },
      );
    }

    let credited = false;
    let volunteer: Volunteer | null = null;
    if (refCode) {
      const credit = await creditVolunteerRef(refCode);
      credited = credit.credited;
      volunteer = credit.volunteer;
    }

    return NextResponse.json({
      success: true,
      referenceId,
      persisted: true,
      refCode: refCode || undefined,
      credited,
      volunteer,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
