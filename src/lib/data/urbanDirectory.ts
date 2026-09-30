import directory from "@/lib/data/urban-directory.json";

export type StaticUlb = {
  district_slug: string;
  slug: string;
  name_en: string;
  name_te: string;
  ulb_type: "municipality" | "municipal_corporation" | "nagar_panchayat";
  town_coordinators_count: number;
  registered_establishments_count: number;
  welfare_support_active: boolean;
  representatives: Array<{
    name_en: string;
    name_te: string;
    designation_en: string;
    designation_te: string;
    phone: string;
    photo_url?: string | null;
  }>;
  establishments: Array<{
    name_en: string;
    name_te: string;
    category_en: string;
    category_te: string;
    owner_en?: string | null;
    owner_te?: string | null;
    area_en?: string | null;
    area_te?: string | null;
    phone?: string | null;
    photo_url?: string | null;
    verified?: boolean;
  }>;
};

/** Canonical TG ULB set: 12 municipal corporations + 123 municipalities. */
export const EXPECTED_ULB_COUNT = 135;

export const URBAN_DIRECTORY = directory as StaticUlb[];

if (URBAN_DIRECTORY.length !== EXPECTED_ULB_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_ULB_COUNT} Telangana ULBs, got ${URBAN_DIRECTORY.length}`,
  );
}

export function listUrbanDirectory(): StaticUlb[] {
  return URBAN_DIRECTORY;
}

export function listStaticUlbsForDistrict(districtSlug: string): StaticUlb[] {
  return URBAN_DIRECTORY.filter((u) => u.district_slug === districtSlug);
}

export function getStaticUlb(
  districtSlug: string,
  ulbSlug: string,
): StaticUlb | undefined {
  const direct = URBAN_DIRECTORY.find(
    (u) => u.district_slug === districtSlug && u.slug === ulbSlug,
  );
  if (direct) return direct;

  // Canonical short slug → legacy long-form in JSON (e.g. madhira → madhira-municipality)
  const candidates = [
    `${ulbSlug}-municipality`,
    `${ulbSlug}-municipal-corporation`,
    `${ulbSlug}-nagar-panchayat`,
    ulbSlug.replace(/-corp$/, "-municipal-corporation"),
  ];
  return URBAN_DIRECTORY.find(
    (u) =>
      u.district_slug === districtSlug && candidates.includes(u.slug),
  );
}
