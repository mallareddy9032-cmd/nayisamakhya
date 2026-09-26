import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  id: string;
  action: "approve" | "reject" | "flag" | "retag";
  moderator?: string;
  notes?: string;
  district_id?: string | null;
  mandal_id?: string | null;
  gp_id?: string | null;
};

function assertSecret(req: Request) {
  const expected = process.env.MODERATION_DESK_SECRET?.trim();
  if (!expected) {
    // Allow when secret unset only in development.
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    return true;
  }
  const header = req.headers.get("x-moderation-secret");
  return header === expected;
}

export async function POST(req: Request) {
  if (!assertSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "supabase_admin_not_configured" },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.id || !body.action) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const { data: current, error: loadError } = await admin
    .from("survey_submissions")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  if (loadError || !current) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const moderator = body.moderator?.trim() || "desk";

  if (body.action === "retag") {
    const { error } = await admin
      .from("survey_submissions")
      .update({
        district_id: body.district_id ?? current.district_id,
        mandal_id: body.mandal_id ?? current.mandal_id,
        gp_id: body.gp_id ?? current.gp_id,
        moderator_notes: body.notes ?? current.moderator_notes,
      })
      .eq("id", body.id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: "retag" });
  }

  if (body.action === "reject") {
    const notes = body.notes?.trim() || "dismissed";
    const { error } = await admin
      .from("survey_submissions")
      .update({
        status: "rejected",
        moderator_notes: notes,
        moderated_by: moderator,
        moderated_at: now,
        district_id: body.district_id ?? current.district_id,
        mandal_id: body.mandal_id ?? current.mandal_id,
        gp_id: body.gp_id ?? current.gp_id,
      })
      .eq("id", body.id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: "reject" });
  }

  if (body.action === "flag") {
    const { error } = await admin
      .from("survey_submissions")
      .update({
        status: "flagged",
        moderator_notes: body.notes ?? current.moderator_notes,
        moderated_by: moderator,
        moderated_at: now,
      })
      .eq("id", body.id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: "flag" });
  }

  // approve
  const districtId = body.district_id ?? current.district_id;
  const mandalId = body.mandal_id ?? current.mandal_id;
  const gpId = body.gp_id ?? current.gp_id;

  const { error: approveError } = await admin
    .from("survey_submissions")
    .update({
      status: "approved",
      moderated_by: moderator,
      moderated_at: now,
      moderator_notes: body.notes ?? current.moderator_notes,
      district_id: districtId,
      mandal_id: mandalId,
      gp_id: gpId,
    })
    .eq("id", body.id);

  if (approveError) {
    return NextResponse.json({ ok: false, error: approveError.message }, { status: 500 });
  }

  // Increment GP survey progress when a GP is tagged.
  if (gpId && current.status !== "approved") {
    const { data: gp } = await admin
      .from("gram_panchayats")
      .select("id, households_count, survey_pct")
      .eq("id", gpId)
      .maybeSingle();

    if (gp) {
      const households = Number(gp.households_count) || 0;
      const nextHouseholds = households + 1;
      const prevPct = Number(gp.survey_pct) || 0;
      // Soft bump: +1 household counted, survey_pct nudged toward 100 without exceeding.
      const nextPct = Math.min(100, Math.max(prevPct + 1, Math.round(prevPct + 0.5)));
      await admin
        .from("gram_panchayats")
        .update({
          households_count: nextHouseholds,
          survey_pct: nextPct,
        })
        .eq("id", gpId);
    }
  }

  // Mirror approved photo into published local_updates feed when mandal known.
  if (mandalId && current.photo_url) {
    const { data: mandal } = await admin
      .from("mandals")
      .select("slug, name_en, name_te, districts(slug)")
      .eq("id", mandalId)
      .maybeSingle();

    const districtRel = mandal?.districts as
      | { slug: string }
      | { slug: string }[]
      | null
      | undefined;
    const districtSlug = Array.isArray(districtRel)
      ? districtRel[0]?.slug
      : districtRel?.slug;

    if (mandal && districtSlug) {
      await admin.from("local_updates").insert({
        mandal_id: mandalId,
        district_slug: districtSlug,
        mandal_slug: mandal.slug,
        category: "survey_photo",
        caption_te: current.raw_caption || "ఫీల్డ్ సర్వే ఫోటో",
        caption_en: current.raw_caption || "Field survey photo",
        image_urls: [current.photo_url],
        is_published: true,
        published_at: now,
      });
    }
  }

  return NextResponse.json({ ok: true, action: "approve" });
}
