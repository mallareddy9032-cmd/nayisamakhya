import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lazy client — never instantiate at module scope (build/static analysis safe). */
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const expectedSecret = process.env.MODERATION_DESK_SECRET?.trim() || "";
  if (!expectedSecret) return false;
  return authHeader === `Bearer ${expectedSecret}`;
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  const { data, error } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      created_at,
      sender_name,
      telegram_chat_id,
      photo_url,
      photo_urls,
      raw_caption,
      status,
      district_id,
      mandal_id,
      panchayat_name,
      admin_notes,
      districts(id, name_en, name_te),
      mandals(id, name_en, name_te)
    `,
    )
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    id?: string;
    status?: string;
    district_id?: string | null;
    mandal_id?: string | null;
    panchayat_name?: string | null;
    admin_notes?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { id, status, district_id, mandal_id, panchayat_name, admin_notes } =
    body;

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 },
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("survey_submissions")
    .update({
      status,
      district_id: district_id || null,
      mandal_id: mandal_id || null,
      panchayat_name: panchayat_name || null,
      admin_notes: admin_notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, submission: data });
}
