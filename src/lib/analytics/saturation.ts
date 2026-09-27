/**
 * Statewide Saturation Index for NayiSamakhya Admin Desk (Module 1).
 *
 * Index = (Active Submissions + Verified Coordinators) / Total Mandals per District
 *
 * Tiers (absolute thresholds on the index):
 * - high     (≥ 0.75) → High Engagement (Emerald)
 * - active   (≥ 0.25) → Active Rollout (Gold)
 * - critical (< 0.25) → Critical Outreach Needed (Slate/Red)
 */

import { TELANGANA_DISTRICTS } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";

export type SaturationTier = "high" | "active" | "critical";

export const SATURATION_THRESHOLDS = {
  high: 0.75,
  active: 0.25,
} as const;

/** Design tokens for desk heat map (must match product kit). */
export const HEATMAP_TOKENS = {
  warmPaper: "#FBFBFA",
  deepSlate: "#0F172A",
  navy: "#1E293B",
  gold: "#B45309",
  emerald: "#059669",
  emeraldSoft: "#10B981",
  critical: "#9F1239",
  criticalSoft: "#64748B",
  stroke: "#334155",
} as const;

export type DistrictSaturation = {
  slug: string;
  name_en: string;
  name_te: string;
  active_submissions: number;
  verified_coordinators: number;
  total_mandals: number;
  index: number;
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
      return "Active Rollout";
    case "critical":
      return "Critical Outreach Needed";
  }
}

export function tierFill(tier: SaturationTier): string {
  switch (tier) {
    case "high":
      return HEATMAP_TOKENS.emeraldSoft;
    case "active":
      return HEATMAP_TOKENS.gold;
    case "critical":
      return HEATMAP_TOKENS.criticalSoft;
  }
}

export function computeSaturationIndex(
  activeSubmissions: number,
  verifiedCoordinators: number,
  totalMandals: number,
): number {
  if (totalMandals <= 0) return 0;
  return (activeSubmissions + verifiedCoordinators) / totalMandals;
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

  // Prefer English portion when rows are "తెలుగు (English)" or "English".
  const paren = raw.match(/\(([^)]+)\)\s*$/);
  const english = paren ? paren[1] : raw;
  const fromGeo = slugFromGeoDistrictName(english);
  if (fromGeo) return fromGeo;

  const compact = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (TELANGANA_DISTRICTS.some((d) => d.slug === compact)) return compact;

  // Match by name_en / name_te
  const lower = raw.toLowerCase();
  const hit = TELANGANA_DISTRICTS.find(
    (d) =>
      d.name_en.toLowerCase() === english.toLowerCase() ||
      d.name_te === raw ||
      d.slug === compact,
  );
  return hit?.slug ?? (lower.includes("unassigned") ? null : null);
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
      active_submissions: 0,
      verified_coordinators: 0,
      total_mandals: total,
      index,
      tier: tierForIndex(index),
    };
  });
}
