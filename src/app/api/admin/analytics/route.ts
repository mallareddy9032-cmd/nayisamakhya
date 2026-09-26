import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlaceRel = { name_en?: string | null; name_te?: string | null } | null;

type DistrictCounts = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  flagged: number;
};

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

function placeName(rel: PlaceRel | PlaceRel[] | undefined): string {
  const row = Array.isArray(rel) ? rel[0] : rel;
  if (!row) return "";
  return String(row.name_te || row.name_en || "").trim();
}

export async function GET(req: NextRequest) {
  try {
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

    const { data, error } = await supabase
      .from("survey_submissions")
      .select("status, districts(name_en, name_te)");

    if (error) {
      throw error;
    }

    const stats: Record<string, DistrictCounts> = {};
    const unassigned =
      "\u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C02 (Unassigned)";

    for (const sub of data || []) {
      const row = sub as {
        status?: string | null;
        districts?: PlaceRel | PlaceRel[];
      };
      const dist = placeName(row.districts) || unassigned;

      if (!stats[dist]) {
        stats[dist] = {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          flagged: 0,
        };
      }

      stats[dist].total += 1;
      if (row.status === "approved") stats[dist].approved += 1;
      else if (row.status === "pending") stats[dist].pending += 1;
      else if (row.status === "rejected") stats[dist].rejected += 1;
      else if (row.status === "flagged") stats[dist].flagged += 1;
    }

    const sortedAnalytics = Object.entries(stats)
      .map(([district, counts]) => ({ district, ...counts }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({ analytics: sortedAnalytics });
  } catch (err) {
    const message = err instanceof Error ? err.message : "analytics_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
