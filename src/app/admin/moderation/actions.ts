"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  DESK_COOKIE,
  deskAuthRequired,
  deskAuthToken,
  expectedDeskSecret,
  isDeskUnlocked,
} from "@/lib/moderation/deskAuth";

export type ModerateResult = { ok: true; action: string } | { ok: false; error: string };

type Input = {
  id: string;
  action: "approve" | "reject" | "retag";
  notes?: string;
  district_id?: string | null;
  mandal_id?: string | null;
  gp_id?: string | null;
  moderator?: string;
};

export async function unlockModerationDesk(
  secret: string,
): Promise<ModerateResult> {
  const expected = expectedDeskSecret();
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "desk_secret_not_configured" };
    }
    return { ok: true, action: "unlock" };
  }
  if (secret.trim() !== expected) {
    return { ok: false, error: "invalid_secret" };
  }
  const jar = await cookies();
  jar.set(DESK_COOKIE, deskAuthToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return { ok: true, action: "unlock" };
}

export async function moderateSubmission(input: Input): Promise<ModerateResult> {
  if (deskAuthRequired() && !(await isDeskUnlocked())) {
    return { ok: false, error: "unauthorized" };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "supabase_admin_not_configured" };
  }
  if (!input.id || !input.action) {
    return { ok: false, error: "missing_fields" };
  }

  const { data: current, error: loadError } = await admin
    .from("survey_submissions")
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (loadError || !current) {
    return { ok: false, error: "not_found" };
  }

  const now = new Date().toISOString();
  const moderator = input.moderator?.trim() || "desk";

  if (input.action === "retag") {
    const { error } = await admin
      .from("survey_submissions")
      .update({
        district_id: input.district_id ?? current.district_id,
        mandal_id: input.mandal_id ?? current.mandal_id,
        gp_id: input.gp_id ?? current.gp_id,
        moderator_notes: input.notes ?? current.moderator_notes,
      })
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/moderation");
    return { ok: true, action: "retag" };
  }

  if (input.action === "reject") {
    const notes = input.notes?.trim();
    if (!notes) return { ok: false, error: "rejection_reason_required" };
    const { error } = await admin
      .from("survey_submissions")
      .update({
        status: "rejected",
        moderator_notes: notes,
        moderated_by: moderator,
        moderated_at: now,
        district_id: input.district_id ?? current.district_id,
        mandal_id: input.mandal_id ?? current.mandal_id,
        gp_id: input.gp_id ?? current.gp_id,
      })
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/moderation");
    return { ok: true, action: "reject" };
  }

  const districtId = input.district_id ?? current.district_id;
  const mandalId = input.mandal_id ?? current.mandal_id;
  const gpId = input.gp_id ?? current.gp_id;

  const { error: approveError } = await admin
    .from("survey_submissions")
    .update({
      status: "approved",
      moderated_by: moderator,
      moderated_at: now,
      moderator_notes: input.notes ?? current.moderator_notes,
      district_id: districtId,
      mandal_id: mandalId,
      gp_id: gpId,
    })
    .eq("id", input.id);

  if (approveError) return { ok: false, error: approveError.message };

  if (gpId && current.status !== "approved") {
    const { data: gp } = await admin
      .from("gram_panchayats")
      .select("id, households_count, survey_pct")
      .eq("id", gpId)
      .maybeSingle();

    if (gp) {
      const households = Number(gp.households_count) || 0;
      const prevPct = Number(gp.survey_pct) || 0;
      await admin
        .from("gram_panchayats")
        .update({
          households_count: households + 1,
          survey_pct: Math.min(100, Math.max(prevPct + 1, Math.round(prevPct + 0.5))),
        })
        .eq("id", gpId);
    }
  }

  if (mandalId && current.photo_url) {
    const { data: mandal } = await admin
      .from("mandals")
      .select("slug, districts(slug)")
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

  revalidatePath("/admin/moderation");
  return { ok: true, action: "approve" };
}
