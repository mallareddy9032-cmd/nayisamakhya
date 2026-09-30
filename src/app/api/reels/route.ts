import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import {
  isValidVideoUrl,
  mapDbRow,
  uid,
} from "@/lib/reels/store";
import {
  isReelCategory,
  type ReelCategory,
  type ReelSubmission,
} from "@/types/reels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  creatorName?: string;
  phone?: string;
  districtSlug?: string;
  mandalSlug?: string;
  category?: string;
  videoUrl?: string;
  caption?: string;
  /** @deprecated legacy clients — coerced to caption */
  title?: string;
};

async function listPublicReels(
  category?: ReelCategory | null,
): Promise<{ reels: ReelSubmission[]; persisted: boolean }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { reels: [], persisted: false };

    let query = supabase
      .from("reels")
      .select("*")
      .in("status", ["approved", "featured"])
      .order("created_at", { ascending: false })
      .limit(100);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data) return { reels: [], persisted: Boolean(supabase) };

    const reels = data
      .map((row) => {
        try {
          return mapDbRow(row as Record<string, unknown>);
        } catch {
          return null;
        }
      })
      .filter((r): r is ReelSubmission => Boolean(r));

    return { reels, persisted: true };
  } catch {
    return { reels: [], persisted: false };
  }
}

async function insertReel(
  reel: ReelSubmission,
): Promise<{ ok: boolean; row?: ReelSubmission }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { ok: false };

    const { error } = await supabase.from("reels").insert({
      id: reel.id,
      created_at: reel.createdAt,
      creator_name: reel.creatorName,
      phone: reel.phone,
      district_slug: reel.districtSlug,
      mandal_slug: reel.mandalSlug,
      category: reel.category,
      video_url: reel.videoUrl,
      caption: reel.caption,
      shares_count: reel.sharesCount,
      likes_count: reel.likesCount,
      status: reel.status,
    });

    // Pending rows are not publicly selectable (RLS) — insert success is enough.
    if (error) return { ok: false };
    return { ok: true, row: reel };
  } catch {
    return { ok: false };
  }
}

/** GET ?category= — public gallery (approved + featured). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawCat = String(searchParams.get("category") || "").trim();
  const category = isReelCategory(rawCat) ? rawCat : null;

  const { reels, persisted } = await listPublicReels(category);
  return NextResponse.json({
    success: true,
    reels,
    persisted,
    mock: !persisted,
  });
}

/** POST — submit a new reel entry (starts as pending). */
export async function POST(req: Request) {
  try {
    let body: SubmitBody;
    try {
      body = (await req.json()) as SubmitBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const creatorName = String(body.creatorName || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const districtSlug = String(body.districtSlug || "")
      .trim()
      .toLowerCase();
    const mandalSlug = String(body.mandalSlug || "")
      .trim()
      .toLowerCase();
    const categoryRaw = String(body.category || "").trim();
    const videoUrl = String(body.videoUrl || "").trim();
    const caption = String(body.caption || body.title || "").trim();

    if (!creatorName || creatorName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Creator name is required" },
        { status: 400 },
      );
    }
    if (phone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "10-digit WhatsApp phone is required" },
        { status: 400 },
      );
    }
    if (!districtSlug || !mandalSlug) {
      return NextResponse.json(
        { success: false, error: "District and mandal are required" },
        { status: 400 },
      );
    }
    if (!isReelCategory(categoryRaw)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }
    if (!caption || caption.length < 3) {
      return NextResponse.json(
        { success: false, error: "Caption is required (min 3 characters)" },
        { status: 400 },
      );
    }
    if (!isValidVideoUrl(videoUrl)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Video URL must be Instagram Reel, YouTube Shorts, or Google Drive",
        },
        { status: 400 },
      );
    }

    const reel: ReelSubmission = {
      id: uid(),
      createdAt: new Date().toISOString(),
      creatorName,
      phone,
      districtSlug,
      mandalSlug,
      category: categoryRaw,
      videoUrl,
      caption,
      sharesCount: 0,
      likesCount: 0,
      status: "pending",
    };

    const inserted = await insertReel(reel);
    if (inserted.ok && inserted.row) {
      return NextResponse.json({
        success: true,
        reel: inserted.row,
        persisted: true,
        mock: false,
      });
    }

    return NextResponse.json({
      success: true,
      reel,
      persisted: false,
      mock: true,
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
