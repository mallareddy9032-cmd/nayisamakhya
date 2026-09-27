/**
 * Statewide Saturation Index for NayiSamakhya Admin Desk (Module 1).
 *
 * Saturation Score =
 *   min(100, round(((verified_uploads * 1.5) + (active_coordinators * 3))
 *     / total_mandals * 10))
 *
 * Civic tiers (0–100 score):
 * - high     (≥ 70) → High Engagement (Emerald #059669)
 * - active   (30–69) → Active Pilot Corridor (Gold #D97706)
 * - critical (< 30) → Outreach Deficit (Slate #94A3B8)
 */

import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";

export type SaturationTier = "high" | "active" | "critical";

export const SATURATION_THRESHOLDS = {
  high: 70,
  active: 30,
} as const;

/** Design tokens for desk heat map (must match product kit). */
export const HEATMAP_TOKENS = {
  warmPaper: "#FBFBFA",
  deepSlate: "#0F172A",
  navy: "#1E293B",
  ceremonialGold: "#B45309",
  /** Tier fills (spec) */
  emerald: "#059669",
  gold: "#D97706",
  slateMuted: "#94A3B8",
  stroke: "#334155",
  border: "#E2E8F0",
} as const;

export type DistrictSaturation = {
  slug: string;
  name_en: string;
  name_te: string;
  /** Approved / verified field uploads (representations) feeding the index. */
  verified_uploads: number;
  /** Active pipeline submissions (pending + approved + flagged) — tooltip KPI. */
  total_representations: number;
  active_coordinators: number;
  total_mandals: number;
  /** 0–100 saturation score */
  index: number;
  tier: SaturationTier;
  /** @deprecated alias — prefer verified_uploads */
  active_submissions?: number;
  /** @deprecated alias — prefer active_coordinators */
  verified_coordinators?: number;
};

export type PilotCorridorKpi = {
  id: "suryapet" | "kodad" | "rangareddy";
  scope: "district" | "mandal";
  district_slug: string;
  mandal_slug?: string;
  name_en: string;
  name_te: string;
  pending: number;
  rejected: number;
  petitions: number;
  saturation_index: number;
  tier: SaturationTier;
};

export function tierForIndex(index: number): SaturationTier {
  if (index >= SATURATION_THRESHOLDS.high) return "high";
  if (index >= SATURATION_THRESHOLDS.active) return "active";
  return "critical";
}

export function tierLabel(tier: SaturationTier): string {
  switch (tier) {
    case "high":
      return "High Engagement";
    case "active":
      return "Active Pilot Corridor";
    case "critical":
      return "Outreach Deficit";
  }
}

export function tierFill(tier: SaturationTier): string {
  switch (tier) {
    case "high":
      return HEATMAP_TOKENS.emerald;
    case "active":
      return HEATMAP_TOKENS.gold;
    case "critical":
      return HEATMAP_TOKENS.slateMuted;
  }
}

/**
 * Saturation Score =
 * min(100, round(((verified_uploads * 1.5) + (active_coordinators * 3)) / total_mandals * 10))
 */
export function computeSaturationIndex(
  verifiedUploads: number,
  activeCoordinators: number,
  totalMandals: number,
): number {
  if (totalMandals <= 0) return 0;
  const raw =
    ((verifiedUploads * 1.5 + activeCoordinators * 3) / totalMandals) * 10;
  return Math.min(100, Math.round(raw));
}

/** Static mandal counts from Phase-2 directory (589 mandals / 33 districts). */
export function staticMandalCountBySlug(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of TELANGANA_DISTRICTS) {
    out[d.slug] = listMandalsForDistrict(d.slug).length;
  }
  return out;
}

/**
 * Map TopoJSON / GIS district labels → canonical portal slugs.
 * Source map (udit-001/india-maps-data) still labels Warangal Urban/Rural
 * and older spellings (Komaram Bheem, Bhupalapally, Ranga Reddy).
 */
export const GEO_DISTRICT_NAME_TO_SLUG: Record<string, string> = {
  adilabad: "adilabad",
  "bhadradri kothagudem": "bhadradri-kothagudem",
  hyderabad: "hyderabad",
  jagtial: "jagtial",
  jangaon: "jangaon",
  "jayashankar bhupalapally": "jayashankar-bhupalpally",
  "jayashankar bhupalpally": "jayashankar-bhupalpally",
  "jogulamba gadwal": "jogulamba-gadwal",
  kamareddy: "kamareddy",
  karimnagar: "karimnagar",
  khammam: "khammam",
  "komaram bheem": "kumuram-bheem-asifabad",
  "kumuram bheem": "kumuram-bheem-asifabad",
  "kumuram bheem asifabad": "kumuram-bheem-asifabad",
  mahabubabad: "mahabubabad",
  mahabubnagar: "mahabubnagar",
  mancherial: "mancherial",
  medak: "medak",
  "medchal malkajgiri": "medchal-malkajgiri",
  "medchal-malkajgiri": "medchal-malkajgiri",
  mulugu: "mulugu",
  nagarkurnool: "nagarkurnool",
  nalgonda: "nalgonda",
  narayanpet: "narayanpet",
  nirmal: "nirmal",
  nizamabad: "nizamabad",
  peddapalli: "peddapalli",
  "rajanna sircilla": "rajanna-sircilla",
  "ranga reddy": "rangareddy",
  rangareddy: "rangareddy",
  sangareddy: "sangareddy",
  siddipet: "siddipet",
  suryapet: "suryapet",
  vikarabad: "vikarabad",
  wanaparthy: "wanaparthy",
  /** GIS legacy: Warangal Urban → Hanumakonda */
  "warangal urban": "hanumakonda",
  hanumakonda: "hanumakonda",
  /** GIS legacy: Warangal Rural → Warangal */
  "warangal rural": "warangal",
  warangal: "warangal",
  "yadadri bhuvanagiri": "yadadri-bhuvanagiri",
};

export function slugFromGeoDistrictName(name: string): string | null {
  const key = name.trim().toLowerCase().replace(/\s+/g, " ");
  return GEO_DISTRICT_NAME_TO_SLUG[key] || null;
}

/** Normalize Supabase / UI district display names to portal slug. */
export function slugFromDistrictLabel(label: string): string | null {
  const raw = label.trim();
  if (!raw) return null;

  const paren = raw.match(/\(([^)]+)\)\s*$/);
  const english = paren ? paren[1] : raw;
  const fromGeo = slugFromGeoDistrictName(english);
  if (fromGeo) return fromGeo;

  const compact = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (TELANGANA_DISTRICTS.some((d) => d.slug === compact)) return compact;

  const hit = TELANGANA_DISTRICTS.find(
    (d) =>
      d.name_en.toLowerCase() === english.toLowerCase() ||
      d.name_te === raw ||
      d.slug === compact,
  );
  return hit?.slug ?? null;
}

export function buildEmptySaturationRows(
  mandalCounts: Record<string, number>,
): DistrictSaturation[] {
  return TELANGANA_DISTRICTS.map((d) => {
    const total = mandalCounts[d.slug] || 0;
    const index = computeSaturationIndex(0, 0, total);
    return {
      slug: d.slug,
      name_en: d.name_en,
      name_te: d.name_te,
      verified_uploads: 0,
      total_representations: 0,
      active_coordinators: 0,
      total_mandals: total,
      index,
      tier: tierForIndex(index),
      active_submissions: 0,
      verified_coordinators: 0,
    };
  });
}

export const PILOT_CORRIDORS = [
  {
    id: "suryapet" as const,
    scope: "district" as const,
    district_slug: "suryapet",
    name_en: "Suryapet",
    name_te: "సూర్యాపేట",
  },
  {
    id: "kodad" as const,
    scope: "mandal" as const,
    district_slug: "suryapet",
    mandal_slug: "kodad",
    name_en: "Kodad (Mandal focus)",
    name_te: "కోదాడ",
  },
  {
    id: "rangareddy" as const,
    scope: "district" as const,
    district_slug: "rangareddy",
    name_en: "Rangareddy",
    name_te: "రంగారెడ్డి",
  },
] as const;
