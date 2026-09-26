import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

function usablePhotoUrl(url: unknown): url is string {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return false;
  if (/\/storage\/v1\/object\/public\/survey-photos\/?$/i.test(url)) return false;
  return url.length > 48;
}

function normalizePhotos(row: {
  photo_url?: string | null;
  photo_urls?: unknown;
}): string[] {
  const fromArr = Array.isArray(row.photo_urls)
    ? row.photo_urls.filter(usablePhotoUrl)
    : [];
  if (fromArr.length) return fromArr;
  return usablePhotoUrl(row.photo_url) ? [row.photo_url] : [];
}

/** Public civic feed — approved / verified field intake only. */
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "supabase_not_configured", feed: [] },
        { status: 503 },
      );
    }

    const { data, error } = await supabase
      .from("survey_submissions")
      .select(
        `
        id,
        created_at,
        photo_url,
        photo_urls,
        raw_caption,
        panchayat_name,
        admin_notes,
        districts(id, name_en, name_te),
        mandals(id, name_en, name_te)
      `,
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(60);

    if (error) {
      return NextResponse.json(
        { error: error.message, feed: [] },
        { status: 500 },
      );
    }

    const feed = (data || [])
      .map((row) => {
        const photo_urls = normalizePhotos(row);
        return {
          id: row.id,
          created_at: row.created_at,
          photo_url: photo_urls[0] || row.photo_url || "",
          photo_urls,
          raw_caption: row.raw_caption || "",
          panchayat_name: row.panchayat_name || null,
          admin_notes: row.admin_notes || null,
          districts: row.districts ?? null,
          mandals: row.mandals ?? null,
        };
      })
      .filter((item) => item.photo_urls.length > 0);

    return NextResponse.json(
      { feed },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (err) {
    console.error("GET /api/feed", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "server_error",
        feed: [],
      },
      { status: 500 },
    );
  }
}
