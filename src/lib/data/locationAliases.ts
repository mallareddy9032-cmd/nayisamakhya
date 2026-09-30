/**
 * Normalize location slugs from live Supabase so duplicate backend rows
 * (e.g. ranga-reddy vs rangareddy) collapse to the canonical directory.
 */

const DISTRICT_SLUG_ALIASES: Record<string, string> = {
  "ranga-reddy": "rangareddy",
};

const MANDAL_SLUG_ALIASES: Record<string, string> = {
  thallada: "tallada",
  kallur: "kalluru",
  chivvemla: "chivemla",
};

export function canonicalDistrictSlug(slug: string): string {
  return DISTRICT_SLUG_ALIASES[slug] || slug;
}

export function canonicalMandalSlug(slug: string): string {
  return MANDAL_SLUG_ALIASES[slug] || slug;
}

/** Reject empty / literal "null" / "undefined" place slugs from bad DB rows. */
export function isUsablePlaceSlug(slug: unknown): slug is string {
  if (typeof slug !== "string") return false;
  const s = slug.trim();
  if (!s) return false;
  const lower = s.toLowerCase();
  return lower !== "null" && lower !== "undefined" && lower !== "none";
}

/**
 * Prefer a real ULB slug; when Supabase returns null, repair known towns
 * to canonical AdminEntity slugs (e.g. Madhira → madhira).
 */
export function repairUlbSlug(
  slug: unknown,
  nameEn: string,
  nameTe: string,
): string | null {
  if (isUsablePlaceSlug(slug)) {
    const s = slug.trim();
    // Normalize known legacy long-form slugs to short canonical forms.
    if (s === "madhira-municipality") return "madhira";
    if (s === "sathupalli-municipality") return "sathupalli";
    if (s === "wyra-municipality") return "wyra";
    if (s === "khammam-municipal-corporation") return "khammam-corp";
    if (s === "kallur-municipality") return "kallur";
    if (s === "yedulapuram-municipality") return "yedulapuram";
    return s;
  }

  const en = String(nameEn || "").trim();
  const te = String(nameTe || "").trim();
  const hay = `${en} ${te}`.toLowerCase();

  if (/madhira/i.test(en) || te.includes("మధిర")) {
    return "madhira";
  }
  if (/sathupalli|satthupalli/i.test(en) || te.includes("సత్తుపల్లి")) {
    return "sathupalli";
  }
  if (/wyra/i.test(en) || te.includes("వైరా")) {
    return "wyra";
  }
  if (
    (/khammam/i.test(en) && /corporation/i.test(en)) ||
    te.includes("ఖమ్మం మున్సిపల్ కార్పొరేషన్")
  ) {
    return "khammam-corp";
  }

  const base = en
    .toLowerCase()
    .replace(/\b(municipality|municipal corporation|nagar panchayat|corporation)\b/gi, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) return null;

  if (/municipal corporation|corporation/i.test(en)) {
    return `${base}-corp`;
  }
  if (/nagar panchayat/i.test(en) || te.includes("నగర పంచాయతీ")) {
    return `${base}-nagar-panchayat`;
  }
  if (/municipality|పురపాలక|మున్సిప/i.test(hay)) {
    return base;
  }
  return base;
}
