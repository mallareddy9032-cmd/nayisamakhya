import { getSupabase } from "@/lib/supabase/client";
import { listDistricts } from "@/lib/data/districts";
import { listMandalsForDistrict } from "@/lib/data/mandalsDirectory";
import { canonicalDistrictSlug } from "@/lib/data/locationAliases";
import {
  getStaticUlb,
  listStaticUlbsForDistrict,
  type StaticUlb,
} from "@/lib/data/urbanDirectory";

export type DistrictSummary = {
  slug: string;
  name_en: string;
  name_te: string;
};

export type DirectoryLink = {
  slug: string;
  name_en: string;
  name_te: string;
  href: string;
  kind: "urban" | "rural";
  meta_en?: string;
  meta_te?: string;
};

export type UrbanRepresentative = {
  name_en: string;
  name_te: string;
  designation_en: string;
  designation_te: string;
  phone: string;
  photo_url?: string | null;
};

export type UrbanEstablishment = {
  name_en: string;
  name_te: string;
  category_en: string;
  category_te: string;
};

export type UrbanPortal = {
  district: DistrictSummary;
  ulb: {
    slug: string;
    name_en: string;
    name_te: string;
    ulb_type: string;
    town_coordinators_count: number;
    registered_establishments_count: number;
    welfare_support_active: boolean;
  };
  representatives: UrbanRepresentative[];
  establishments: UrbanEstablishment[];
};

function districtSummary(slug: string): DistrictSummary | undefined {
  const dSlug = canonicalDistrictSlug(slug);
  const d = listDistricts().find((x) => x.slug === dSlug);
  if (!d) return undefined;
  return { slug: d.slug, name_en: d.name_en, name_te: d.name_te };
}

function fromStaticUlb(entry: StaticUlb): UrbanPortal | undefined {
  const district = districtSummary(entry.district_slug);
  if (!district) return undefined;
  return {
    district,
    ulb: {
      slug: entry.slug,
      name_en: entry.name_en,
      name_te: entry.name_te,
      ulb_type: entry.ulb_type,
      town_coordinators_count: entry.town_coordinators_count,
      registered_establishments_count: entry.registered_establishments_count,
      welfare_support_active: entry.welfare_support_active,
    },
    representatives: entry.representatives,
    establishments: entry.establishments,
  };
}

function ulbTypeTe(ulbType: string): string {
  if (ulbType === "municipal_corporation") return "మున్సిపల్ కార్పొరేషన్";
  if (ulbType === "nagar_panchayat") return "నగర పంచాయతీ";
  return "మున్సిపాలిటీ";
}

export async function fetchDistrictDirectory(districtSlug: string): Promise<{
  district: DistrictSummary;
  urban: DirectoryLink[];
  rural: DirectoryLink[];
} | null> {
  const district = districtSummary(districtSlug);
  if (!district) return null;

  const rural: DirectoryLink[] = listMandalsForDistrict(district.slug).map(
    (m) => ({
      slug: m.slug,
      name_en: m.name_en,
      name_te: m.name_te,
      href: `/${district.slug}/${m.slug}`,
      kind: "rural" as const,
      meta_en: "Mandal",
      meta_te: "మండలం",
    }),
  );

  let urban: DirectoryLink[] = listStaticUlbsForDistrict(district.slug).map(
    (u) => ({
      slug: u.slug,
      name_en: u.name_en,
      name_te: u.name_te,
      href: `/${district.slug}/urban/${u.slug}`,
      kind: "urban" as const,
      meta_en: u.ulb_type.replace(/_/g, " "),
      meta_te: ulbTypeTe(u.ulb_type),
    }),
  );

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: dRow } = await supabase
        .from("districts")
        .select("id, slug, name_en, name_te")
        .eq("slug", district.slug)
        .maybeSingle();

      if (dRow?.id) {
        const { data: ulbs } = await supabase
          .from("urban_local_bodies")
          .select(
            "slug, name_en, name_te, ulb_type, town_coordinators_count, registered_establishments_count",
          )
          .eq("district_id", dRow.id)
          .order("name_en", { ascending: true });

        if (ulbs?.length) {
          const remote = ulbs.map((u) => ({
            slug: String(u.slug),
            name_en: String(u.name_en),
            name_te: String(u.name_te),
            href: `/${district.slug}/urban/${u.slug}`,
            kind: "urban" as const,
            meta_en: String(u.ulb_type || "municipality").replace(/_/g, " "),
            meta_te: ulbTypeTe(String(u.ulb_type || "municipality")),
          }));
          const map = new Map(urban.map((u) => [u.slug, u]));
          for (const row of remote) map.set(row.slug, row);
          urban = [...map.values()].sort((a, b) =>
            a.name_en.localeCompare(b.name_en),
          );
        }
      }
    }
  } catch {
    // keep static urban list
  }

  return { district, urban, rural };
}

export async function fetchUrbanPortal(
  districtSlug: string,
  ulbSlug: string,
): Promise<UrbanPortal | undefined> {
  const dSlug = canonicalDistrictSlug(districtSlug.trim());
  const uSlug = ulbSlug.trim();
  const fallback = getStaticUlb(dSlug, uSlug);
  const staticPortal = fallback ? fromStaticUlb(fallback) : undefined;

  try {
    const supabase = getSupabase();
    if (!supabase) return staticPortal;

    const { data: dRow } = await supabase
      .from("districts")
      .select("id, slug, name_en, name_te")
      .eq("slug", dSlug)
      .maybeSingle();

    if (!dRow?.id) return staticPortal;

    const { data: ulb, error } = await supabase
      .from("urban_local_bodies")
      .select(
        "id, slug, name_en, name_te, ulb_type, town_coordinators_count, registered_establishments_count, welfare_support_active",
      )
      .eq("district_id", dRow.id)
      .eq("slug", uSlug)
      .maybeSingle();

    if (error || !ulb) return staticPortal;

    const [repsRes, estRes] = await Promise.all([
      supabase
        .from("urban_representatives")
        .select(
          "name_en, name_te, designation_en, designation_te, phone, photo_url, is_active, is_verified, sort_order",
        )
        .eq("ulb_id", ulb.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("urban_establishments")
        .select("name_en, name_te, category_en, category_te, is_active")
        .eq("ulb_id", ulb.id)
        .eq("is_active", true)
        .order("name_en", { ascending: true }),
    ]);

    const representatives = (repsRes.data || [])
      .filter((r) => r.is_verified !== false)
      .map((r) => ({
        name_en: String(r.name_en),
        name_te: String(r.name_te),
        designation_en: String(r.designation_en || "Coordinator"),
        designation_te: String(r.designation_te || "సమన్వయకర్త"),
        phone: String(r.phone),
        photo_url: r.photo_url as string | null,
      }));

    const establishments = (estRes.data || []).map((e) => ({
      name_en: String(e.name_en),
      name_te: String(e.name_te),
      category_en: String(e.category_en || "Salon"),
      category_te: String(e.category_te || "సెలూన్"),
    }));

    return {
      district: {
        slug: String(dRow.slug),
        name_en: String(dRow.name_en),
        name_te: String(dRow.name_te),
      },
      ulb: {
        slug: String(ulb.slug),
        name_en: String(ulb.name_en),
        name_te: String(ulb.name_te),
        ulb_type: String(ulb.ulb_type || "municipality"),
        town_coordinators_count: Number(ulb.town_coordinators_count) || 0,
        registered_establishments_count:
          Number(ulb.registered_establishments_count) || 0,
        welfare_support_active: ulb.welfare_support_active !== false,
      },
      representatives:
        representatives.length > 0
          ? representatives
          : staticPortal?.representatives || [],
      establishments:
        establishments.length > 0
          ? establishments
          : staticPortal?.establishments || [],
    };
  } catch {
    return staticPortal;
  }
}
