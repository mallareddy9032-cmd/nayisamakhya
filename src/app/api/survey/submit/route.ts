import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

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
};

function abbr(slug: string, len: number) {
  return slug.replace(/[^a-z0-9]/gi, "").slice(0, len).toUpperCase() || "XX";
}

function buildReferenceId(districtSlug: string, mandalSlug: string) {
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `#${abbr(districtSlug, 4)}-${abbr(mandalSlug, 2)}-${seq}`;
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
    const payload = {
      ...body,
      headName,
      whatsapp,
      gramPanchayat,
      communityWing,
      occupation,
      submittedAt: new Date().toISOString(),
    };

    let persisted = false;
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.from("surveys").insert({
          reference_id: referenceId,
          district_slug: districtSlug,
          mandal_slug: mandalSlug,
          gram_panchayat: gramPanchayat,
          head_name: headName,
          whatsapp,
          community_wing: communityWing,
          occupation,
          payload,
        });
        persisted = !error;
      }
    } catch {
      persisted = false;
    }

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

    return NextResponse.json({
      success: true,
      referenceId,
      persisted: true,
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
