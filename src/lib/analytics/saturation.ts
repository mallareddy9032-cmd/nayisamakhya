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
  /** Phase 4 mobile bar — under-represented */
  rose: "#E11D48",
  slateMuted: "#94A3B8",
  stroke: "#334155",
  border: "#E2E8F0",
} as const;

/** Statewide mandal denominator for executive KPI header. */
export const STATEWIDE_MANDAL_TARGET = 589;

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
      return HEATMAP_TOKENS.rose;
  }
}

/** Live saturation bar fill for mobile corridor cards (Phase 4). */
export function saturationBarFill(score: number): string {
  if (score >= SATURATION_THRESHOLDS.high) return HEATMAP_TOKENS.emerald;
  if (score >= SATURATION_THRESHOLDS.active) return HEATMAP_TOKENS.ceremonialGold;
  return HEATMAP_TOKENS.rose;
}

export type ExecutiveSaturationKpis = {
  mandalsReached: number;
  mandalTarget: number;
  stateAverageIndex: number;
  priorityMandal: {
    name_te: string;
    name_en: string;
    district_te: string;
    slug: string;
    index: number;
  } | null;
};

/** Derive executive header KPIs from district saturation rows. */
export function computeExecutiveSaturationKpis(
  districts: DistrictSaturation[],
  pilots: PilotCorridorKpi[] = [],
): ExecutiveSaturationKpis {
  const mandalsReached = districts.reduce((sum, d) => {
    // Count mandals in districts that have any activity signal.
    if (d.verified_uploads > 0 || d.total_representations > 0 || d.active_coordinators > 0) {
      return sum + d.total_mandals;
    }
    return sum;
  }, 0);

  const avg =
    districts.length === 0
      ? 0
      : Math.round(
          districts.reduce((s, d) => s + d.index, 0) / districts.length,
        );

  // Priority action: lowest SI among pilot corridors, else lowest statewide with activity.
  const pilotSorted = [...pilots].sort(
    (a, b) => a.saturation_index - b.saturation_index,
  );
  let priority: ExecutiveSaturationKpis["priorityMandal"] = null;
  if (pilotSorted[0]) {
    const p = pilotSorted[0];
    priority = {
      name_te: p.name_te,
      name_en: p.name_en,
      district_te: p.name_te,
      slug: p.district_slug,
      index: p.saturation_index,
    };
  } else {
    const lowest = [...districts]
      .filter((d) => d.total_mandals > 0)
      .sort((a, b) => a.index - b.index)[0];
    if (lowest) {
      priority = {
        name_te: lowest.name_te,
        name_en: lowest.name_en,
        district_te: lowest.name_te,
        slug: lowest.slug,
        index: lowest.index,
      };
    }
  }

  return {
    mandalsReached: Math.min(STATEWIDE_MANDAL_TARGET, mandalsReached || 0),
    mandalTarget: STATEWIDE_MANDAL_TARGET,
    stateAverageIndex: avg,
    priorityMandal: priority,
  };
}

/** Linear interpolate hex colors (6-digit). */
function lerpHex(a: string, b: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ] as const;
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * clamp);
  const g = Math.round(ag + (bg - ag) * clamp);
  const bl = Math.round(ab + (bb - ab) * clamp);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Continuous 0→100 saturation fill (slate → gold → emerald).
 * Keeps the map lively even when most scores sit in one tier bucket.
 */
export function saturationRampFill(index: number): string {
  const v = Math.max(0, Math.min(100, index));
  if (v < 30) {
    return lerpHex(HEATMAP_TOKENS.slateMuted, HEATMAP_TOKENS.gold, v / 30);
  }
  if (v < 70) {
    return lerpHex(
      HEATMAP_TOKENS.gold,
      HEATMAP_TOKENS.emerald,
      (v - 30) / 40,
    );
  }
  return lerpHex(HEATMAP_TOKENS.emerald, "#047857", (v - 70) / 30);
}

/**
 * Soft blue-slate density tint from mandal counts — used when SI is
 * uniformly near-zero so the choropleth still shows real structure.
 */
export function mandalDensityFill(
  mandals: number,
  minMandals: number,
  maxMandals: number,
): string {
  const span = Math.max(1, maxMandals - minMandals);
  const t = Math.max(0, Math.min(1, (mandals - minMandals) / span));
  // Cool slate → warm bronze hint (still institutional, not rainbow)
  return lerpHex("#CBD5E1", "#94A3B8", t * 0.55 + 0.2);
}

/** True when the statewide index distribution is too flat to read as heat. */
export function isSaturationSparse(districts: DistrictSaturation[]): boolean {
  if (districts.length === 0) return true;
  const max = Math.max(...districts.map((d) => d.index));
  const sum = districts.reduce((acc, d) => acc + d.index, 0);
  return max < 5 && sum < 15;
}

/** Compact English label for on-map annotation. */
export function shortDistrictLabel(nameEn: string): string {
  const map: Record<string, string> = {
    "Bhadradri Kothagudem": "Bhadradri",
    "Jayashankar Bhupalpally": "Bhupalpally",
    "Jogulamba Gadwal": "Gadwal",
    "Kumuram Bheem Asifabad": "Asifabad",
    "Medchal-Malkajgiri": "Medchal",
    "Rajanna Sircilla": "Sircilla",
    "Yadadri Bhuvanagiri": "Yadadri",
  };
  if (map[nameEn]) return map[nameEn];
  if (nameEn.length <= 12) return nameEn;
  return `${nameEn.slice(0, 10)}…`;
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
