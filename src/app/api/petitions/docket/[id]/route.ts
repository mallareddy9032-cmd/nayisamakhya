import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";
import { parseDocketId } from "@/lib/representation/docket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public read of a registered petition docket. */
export async function GET(_req: Request, { params }: Props) {
  const { id: raw } = await params;
  const docketId = decodeURIComponent(raw || "").trim().toUpperCase();
  const parsed = parseDocketId(docketId);
  if (!parsed) {
    return NextResponse.json({ ok: false, error: "invalid_docket_id" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const client = admin || publicClient();
  if (!client) {
    return NextResponse.json({
      ok: true,
      found: false,
      format_valid: true,
      docket: { docket_id: parsed.docketId, district_code: parsed.districtCode, year: parsed.year },
    });
  }

  const { data, error } = await client
    .from("petition_dockets")
    .select(
      "docket_id, category_id, category_te, district_slug, district_te, mandal_slug, mandal_te, statutory_te, subject_te, applicant_name, issued_at",
    )
    .eq("docket_id", parsed.docketId)
    .maybeSingle();

  if (error) {
    console.error("[PetitionDocket:Get]", error);
    return NextResponse.json({
      ok: true,
      found: false,
      format_valid: true,
      docket: { docket_id: parsed.docketId, district_code: parsed.districtCode, year: parsed.year },
    });
  }

  if (!data) {
    return NextResponse.json({
      ok: true,
      found: false,
      format_valid: true,
      docket: { docket_id: parsed.docketId, district_code: parsed.districtCode, year: parsed.year },
    });
  }

  return NextResponse.json({ ok: true, found: true, format_valid: true, docket: data });
}
