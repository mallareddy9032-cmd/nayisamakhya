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
  }>;
};

export const URBAN_DIRECTORY = directory as StaticUlb[];

export function listStaticUlbsForDistrict(districtSlug: string): StaticUlb[] {
  return URBAN_DIRECTORY.filter((u) => u.district_slug === districtSlug);
}

export function getStaticUlb(
  districtSlug: string,
  ulbSlug: string,
): StaticUlb | undefined {
  return URBAN_DIRECTORY.find(
    (u) => u.district_slug === districtSlug && u.slug === ulbSlug,
  );
}
