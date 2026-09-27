import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import {
  PILOT_CORRIDORS,
  buildEmptySaturationRows,
  computeSaturationIndex,
  SATURATION_THRESHOLDS,
  slugFromDistrictLabel,
  staticMandalCountBySlug,
  tierForIndex,
  type DistrictSaturation,
  type PilotCorridorKpi,
} from "@/lib/analytics/saturation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlaceRel = {
  name_en?: string | null;
  name_te?: string | null;
  slug?: string | null;
} | null;

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

function placeSlug(rel: PlaceRel | PlaceRel[] | undefined): string | null {
  const row = Array.isArray(rel) ? rel[0] : rel;
  if (!row) return null;
  if (row.slug) {
    const s = String(row.slug).trim().toLowerCase();
    if (TELANGANA_DISTRICTS.some((d) => d.slug === s)) return s;
  }
  return slugFromDistrictLabel(
    String(row.name_en || row.name_te || "").trim(),
  );
}

function mandalSlug(rel: PlaceRel | PlaceRel[] | undefined): string | null {
  const row = Array.isArray(rel) ? rel[0] : rel;
  if (!row) return null;
  if (row.slug) return String(row.slug).trim().toLowerCase();
  const en = String(row.name_en || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return en || null;
}

/** Active pipeline = still in civic flow (exclude rejected). */
function isActiveStatus(status: string | null | undefined): boolean {
  return status === "pending" || status === "approved" || status === "flagged";
}

function isVerifiedUpload(status: string | null | undefined): boolean {
  return status === "approved";
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

    const staticMandals = staticMandalCountBySlug();
    const saturationRows = buildEmptySaturationRows(staticMandals);
    const bySlug = new Map(saturationRows.map((r) => [r.slug, r]));

    const notes: string[] = [];
    let verifiedCoordinatorsSource:
      | "mandal_officers.is_verified"
      | "fallback_zero" = "fallback_zero";

    const statusByDistrict = new Map<
      string,
      { pending: number; rejected: number; petitions: number }
    >();
    const statusByMandal = new Map<
      string,
      { pending: number; rejected: number; petitions: number }
    >();

    const bump = (
      map: Map<string, { pending: number; rejected: number; petitions: number }>,
      key: string,
      status: string | null | undefined,
    ) => {
      const cur = map.get(key) || { pending: 0, rejected: 0, petitions: 0 };
      cur.petitions += 1;
      if (status === "pending" || status === "flagged") cur.pending += 1;
      if (status === "rejected") cur.rejected += 1;
      map.set(key, cur);
    };

    const { data, error } = await supabase
      .from("survey_submissions")
      .select(
        "status, districts(name_en, name_te, slug), mandals(name_en, name_te, slug)",
      );

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
        mandals?: PlaceRel | PlaceRel[];
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

      const slug = placeSlug(row.districts);
      if (slug) {
        bump(statusByDistrict, slug, row.status);
        const sat = bySlug.get(slug);
        if (sat) {
          sat.total_representations += 1;
          if (isVerifiedUpload(row.status)) sat.verified_uploads += 1;
          if (isActiveStatus(row.status)) {
            sat.active_submissions = (sat.active_submissions || 0) + 1;
          }
        }
      }

      const mSlug = mandalSlug(row.mandals);
      if (mSlug) bump(statusByMandal, mSlug, row.status);
    }

    const sortedAnalytics = Object.entries(stats)
      .map(([district, counts]) => ({ district, ...counts }))
      .sort((a, b) => b.total - a.total);

    const mandalIdToDistrictSlug = new Map<string, string>();
    const { data: mandalRows, error: mandalErr } = await supabase
      .from("mandals")
      .select("id, district_id, slug, districts(slug)");

    if (!mandalErr && mandalRows) {
      const liveCounts: Record<string, number> = {};
      for (const m of mandalRows) {
        const row = m as {
          id: string;
          slug?: string | null;
          districts?: PlaceRel | PlaceRel[];
        };
        const slug = placeSlug(row.districts);
        if (!slug) continue;
        liveCounts[slug] = (liveCounts[slug] || 0) + 1;
        mandalIdToDistrictSlug.set(row.id, slug);
      }
      for (const sat of saturationRows) {
        if (liveCounts[sat.slug]) {
          sat.total_mandals = liveCounts[sat.slug];
        }
      }
    } else {
      notes.push(
        "Live mandals table unavailable — using static mandals-directory.json counts (589).",
      );
    }

    const { data: officerRows, error: officerErr } = await supabase
      .from("mandal_officers")
      .select("mandal_id, is_verified, status");

    if (!officerErr && officerRows) {
      verifiedCoordinatorsSource = "mandal_officers.is_verified";
      if (mandalIdToDistrictSlug.size === 0) {
        const { data: m2 } = await supabase
          .from("mandals")
          .select("id, districts(slug)");
        for (const m of m2 || []) {
          const row = m as { id: string; districts?: PlaceRel | PlaceRel[] };
          const slug = placeSlug(row.districts);
          if (slug) mandalIdToDistrictSlug.set(row.id, slug);
        }
      }

      for (const off of officerRows) {
        const row = off as {
          mandal_id: string;
          is_verified?: boolean | null;
          status?: string | null;
        };
        if (row.is_verified === false) continue;
        if (row.status && row.status !== "active") continue;
        const slug = mandalIdToDistrictSlug.get(row.mandal_id);
        if (!slug) continue;
        const sat = bySlug.get(slug);
        if (sat) sat.active_coordinators += 1;
      }
    } else {
      verifiedCoordinatorsSource = "fallback_zero";
      notes.push(
        "Active Coordinators unavailable (mandal_officers missing or query failed) — using 0 per district.",
      );
    }

    const saturation: DistrictSaturation[] = saturationRows
      .map((r) => {
        const index = computeSaturationIndex(
          r.verified_uploads,
          r.active_coordinators,
          r.total_mandals,
        );
        return {
          ...r,
          index,
          tier: tierForIndex(index),
          verified_coordinators: r.active_coordinators,
          active_submissions: r.active_submissions || r.total_representations,
        };
      })
      .sort((a, b) => b.index - a.index || a.name_en.localeCompare(b.name_en));

    const satBySlug = new Map(saturation.map((s) => [s.slug, s]));

    const pilot_corridors: PilotCorridorKpi[] = PILOT_CORRIDORS.map((p) => {
      const counts =
        p.scope === "mandal" && p.mandal_slug
          ? statusByMandal.get(p.mandal_slug) || {
              pending: 0,
              rejected: 0,
              petitions: 0,
            }
          : statusByDistrict.get(p.district_slug) || {
              pending: 0,
              rejected: 0,
              petitions: 0,
            };
      const parent = satBySlug.get(p.district_slug);
      return {
        id: p.id,
        scope: p.scope,
        district_slug: p.district_slug,
        mandal_slug: "mandal_slug" in p ? p.mandal_slug : undefined,
        name_en: p.name_en,
        name_te: p.name_te,
        pending: counts.pending,
        rejected: counts.rejected,
        petitions: counts.petitions,
        saturation_index: parent?.index ?? 0,
        tier: parent?.tier ?? "critical",
      };
    });

    console.info("[analytics]", {
      districts: saturation.length,
      pilots: pilot_corridors.length,
      submissions: (data || []).length,
      coordinators_source: verifiedCoordinatorsSource,
    });

    return NextResponse.json({
      analytics: sortedAnalytics,
      saturation: {
        districts: saturation,
        thresholds: SATURATION_THRESHOLDS,
        formula:
          "min(100, round(((verified_uploads * 1.5) + (active_coordinators * 3)) / total_mandals * 10))",
        verified_definition: "approved survey_submissions (verified uploads)",
        verified_coordinators_source: verifiedCoordinatorsSource,
        notes,
      },
      pilot_corridors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "analytics_failed";
    console.error("[analytics] failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
