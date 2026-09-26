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

export type ModerateResult =
  | { ok: true; action: string }
  | { ok: false; error: string };

type Input = {
  id: string;
  action: "approve" | "reject" | "retag";
  notes?: string;
  raw_caption?: string;
  district_id?: string | null;
  mandal_id?: string | null;
  ulb_id?: string | null;
  gp_id?: string | null;
  moderator?: string;
};

function asPhotoUrls(row: {
  photo_url?: string | null;
  photo_urls?: unknown;
}): string[] {
  if (Array.isArray(row.photo_urls)) {
    return row.photo_urls.filter(
      (u): u is string => typeof u === "string" && Boolean(u),
    );
  }
  return row.photo_url ? [row.photo_url] : [];
}

function establishmentNames(caption: string | null | undefined, sender: string | null) {
  const cleaned = (caption || "").trim().replace(/\s+/g, " ");
  const base =
    cleaned.split(/[.\n|]/)[0]?.trim().slice(0, 80) ||
    (sender ? `${sender} establishment` : "Community establishment");
  return { name_en: base, name_te: base };
}

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
  jar.set(DESK_COOKIE, await deskAuthToken(expected), {
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
  const districtId = input.district_id ?? current.district_id;
  const mandalId = input.mandal_id ?? current.mandal_id;
  const ulbId = input.ulb_id ?? current.ulb_id ?? null;
  const gpId = input.gp_id ?? current.gp_id;
  const caption =
    input.raw_caption !== undefined
      ? input.raw_caption
      : current.raw_caption;
  const photos = asPhotoUrls(current);
  const primaryPhoto = photos[0] || current.photo_url || null;

  if (input.action === "retag") {
    const { error } = await admin
      .from("survey_submissions")
      .update({
        district_id: districtId,
        mandal_id: mandalId,
        ulb_id: ulbId,
        gp_id: gpId,
        raw_caption: caption,
        photo_urls: photos.length ? photos : primaryPhoto ? [primaryPhoto] : [],
        moderator_notes: input.notes ?? current.moderator_notes,
      })
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/moderation");
    return { ok: true, action: "retag" };
  }

  if (input.action === "reject") {
    const { error } = await admin
      .from("survey_submissions")
      .update({
        status: "rejected",
        moderator_notes: input.notes?.trim() || current.moderator_notes || "dismissed",
        moderated_by: moderator,
        moderated_at: now,
        district_id: districtId,
        mandal_id: mandalId,
        ulb_id: ulbId,
        gp_id: gpId,
        raw_caption: caption,
      })
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/moderation");
    return { ok: true, action: "reject" };
  }

  // approve & publish
  const { error: approveError } = await admin
    .from("survey_submissions")
    .update({
      status: "approved",
      moderated_by: moderator,
      moderated_at: now,
      moderator_notes: input.notes ?? current.moderator_notes,
      district_id: districtId,
      mandal_id: mandalId,
      ulb_id: ulbId,
      gp_id: gpId,
      raw_caption: caption,
      photo_urls: photos.length ? photos : primaryPhoto ? [primaryPhoto] : [],
    })
    .eq("id", input.id);

  if (approveError) return { ok: false, error: approveError.message };

  if (current.status !== "approved") {
    const names = establishmentNames(caption, current.sender_name);
    const areaLabel = {
      en: "Local area",
      te: "స్థానిక ప్రాంతం",
    };

    // Resolve area labels when possible
    if (ulbId) {
      const { data: ulb } = await admin
        .from("urban_local_bodies")
        .select("name_en, name_te")
        .eq("id", ulbId)
        .maybeSingle();
      if (ulb) {
        areaLabel.en = String(ulb.name_en);
        areaLabel.te = String(ulb.name_te);
      }
    } else if (mandalId) {
      const { data: mandal } = await admin
        .from("mandals")
        .select("name_en, name_te")
        .eq("id", mandalId)
        .maybeSingle();
      if (mandal) {
        areaLabel.en = String(mandal.name_en);
        areaLabel.te = String(mandal.name_te);
      }
    }

    const { error: pubErr } = await admin.from("verified_establishments").insert({
      district_id: districtId,
      mandal_id: ulbId ? null : mandalId,
      ulb_id: ulbId,
      name_en: names.name_en,
      name_te: names.name_te,
      owner_en: current.sender_name,
      owner_te: current.sender_name,
      area_en: areaLabel.en,
      area_te: areaLabel.te,
      phone: current.phone,
      photo_url: primaryPhoto,
      photo_urls: photos.length ? photos : primaryPhoto ? [primaryPhoto] : [],
      category_en: "Salon",
      category_te: "సెలూన్",
      source_submission_id: current.id,
      is_verified: true,
      is_active: true,
    });
    if (pubErr) {
      console.error("verified_establishments insert", pubErr.message);
    }

    if (ulbId && primaryPhoto) {
      const { error: ulbEstErr } = await admin.from("urban_establishments").insert({
        ulb_id: ulbId,
        name_en: names.name_en,
        name_te: names.name_te,
        category_en: "Salon",
        category_te: "సెలూన్",
        is_active: true,
      });
      if (ulbEstErr) {
        console.error("urban_establishments insert", ulbEstErr.message);
      }
    }

    if (mandalId && primaryPhoto && !ulbId) {
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
          caption_te: caption || "ఫీల్డ్ సర్వే ఫోటో",
          caption_en: caption || "Field survey photo",
          image_urls: photos.length ? photos : [primaryPhoto],
          is_published: true,
          published_at: now,
        });
      }
    }

    if (gpId) {
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
            survey_pct: Math.min(
              100,
              Math.max(prevPct + 1, Math.round(prevPct + 0.5)),
            ),
          })
          .eq("id", gpId);
      }
    }
  }

  revalidatePath("/admin/moderation");
  revalidatePath("/");
  return { ok: true, action: "approve" };
}
