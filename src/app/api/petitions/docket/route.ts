import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { parseDocketId } from "@/lib/representation/docket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  docket_id?: string;
  category_id?: string;
  category_te?: string;
  district_slug?: string;
  district_te?: string;
  mandal_slug?: string;
  mandal_te?: string;
  statutory_te?: string;
  subject_te?: string;
  applicant_name?: string;
  issued_at?: string;
};

/** Register a docket so /verify/[id] can resolve institutional metadata. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const docketId = String(body.docket_id || "").trim().toUpperCase();
  if (!parseDocketId(docketId)) {
    return NextResponse.json({ ok: false, error: "invalid_docket_id" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    // Soft-ok: letter still printable; verify page falls back to ID parse.
    return NextResponse.json({ ok: true, persisted: false, reason: "supabase_unavailable" });
  }

  const row = {
    docket_id: docketId,
    category_id: String(body.category_id || "power_subsidy").slice(0, 64),
    category_te: String(body.category_te || "").slice(0, 200) || "వినతి",
    district_slug: String(body.district_slug || "").slice(0, 80),
    district_te: String(body.district_te || "").slice(0, 120),
    mandal_slug: String(body.mandal_slug || "").slice(0, 80),
    mandal_te: String(body.mandal_te || "").slice(0, 120),
    statutory_te: String(body.statutory_te || "").slice(0, 2000),
    subject_te: String(body.subject_te || "").slice(0, 500),
    applicant_name: body.applicant_name
      ? String(body.applicant_name).slice(0, 120)
      : null,
    issued_at: body.issued_at || new Date().toISOString(),
  };

  const { error } = await admin.from("petition_dockets").upsert(row, {
    onConflict: "docket_id",
  });

  if (error) {
    console.error("[PetitionDocket:Upsert]", error);
    return NextResponse.json({ ok: true, persisted: false, error: error.message });
  }

  return NextResponse.json({ ok: true, persisted: true, docket_id: docketId });
}
