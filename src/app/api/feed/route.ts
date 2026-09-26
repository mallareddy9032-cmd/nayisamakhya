import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public feed must use anon + RLS only — never service role. */
function getFeedSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  if (!supabaseUrl || !anonKey || supabaseUrl.includes("YOUR_PROJECT")) {
    return null;
  }
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getFeedSupabase();
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
        districts(id, name_en, name_te),
        mandals(id, name_en, name_te)
      `,
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(60);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feed: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
