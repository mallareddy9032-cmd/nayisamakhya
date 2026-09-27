import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";
import { listDistricts } from "@/lib/data/districts";
import {
  canonicalDistrictSlug,
  canonicalMandalSlug,
} from "@/lib/data/locationAliases";
import { listMandalsDirectory } from "@/lib/data/mandalsDirectory";
import { listUrbanDirectory } from "@/lib/data/urbanDirectory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type LocationDistrict = {
  id: string;
  slug: string;
  name_en: string;
  name_te: string;
};

export type LocationMandal = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
};

export type LocationUlb = {
  id: string;
  district_id: string;
  slug: string;
  name_en: string;
  name_te: string;
  ulb_type: string;
};

function staticLocations(): {
  districts: LocationDistrict[];
  mandals: LocationMandal[];
  ulbs: LocationUlb[];
} {
  const districts: LocationDistrict[] = listDistricts()
    .map((d) => ({
      id: d.slug,
      slug: d.slug,
      name_en: d.name_en,
      name_te: d.name_te,
    }))
    .sort((a, b) => a.name_en.localeCompare(b.name_en));

  const mandals: LocationMandal[] = listMandalsDirectory()
    .map((m) => ({
      id: `${m.district_slug}-${m.slug}`,
      district_id: m.district_slug,
      slug: m.slug,
      name_en: m.name_en,
      name_te: m.name_te,
    }))
    .sort((a, b) => a.name_en.localeCompare(b.name_en));

  const ulbs: LocationUlb[] = listUrbanDirectory()
    .map((u) => ({
      id: `${u.district_slug}-${u.slug}`,
      district_id: u.district_slug,
      slug: u.slug,
      name_en: u.name_en,
      name_te: u.name_te,
      ulb_type: u.ulb_type,
    }))
    .sort((a, b) => a.name_en.localeCompare(b.name_en));

  return { districts, mandals, ulbs };
}

function mergeByKey<T>(
  base: T[],
  remote: T[],
  keyFn: (row: T) => string,
): T[] {
  const map = new Map(base.map((row) => [keyFn(row), row]));
  for (const row of remote) {
    map.set(keyFn(row), row);
  }
  return [...map.values()];
}

export async function GET() {
  const fallback = staticLocations();
  let districts = fallback.districts;
  let mandals = fallback.mandals;
  let ulbs = fallback.ulbs;

  try {
    const supabase = getSupabase();
    if (supabase) {
      const [dRes, mRes, uRes] = await Promise.all([
        supabase
          .from("districts")
          .select("id, slug, name_en, name_te")
          .order("name_en", { ascending: true }),
        supabase
          .from("mandals")
          .select("id, district_id, slug, name_en, name_te")
          .order("name_en", { ascending: true }),
        supabase
          .from("urban_local_bodies")
          .select("id, district_id, slug, name_en, name_te, ulb_type")
          .order("name_en", { ascending: true }),
      ]);

      const uuidToSlug = new Map<string, string>();
      if (!dRes.error && dRes.data?.length) {
        for (const row of dRes.data as Array<{
          id: string;
          slug: string;
          name_en: string;
          name_te: string;
        }>) {
          uuidToSlug.set(row.id, canonicalDistrictSlug(row.slug));
        }

        const remoteDistricts: LocationDistrict[] = (
          dRes.data as Array<{
            id: string;
            slug: string;
            name_en: string;
            name_te: string;
          }>
        ).map((row) => {
          const slug = canonicalDistrictSlug(row.slug);
          return {
            id: slug,
            slug,
            name_en: row.name_en,
            name_te: row.name_te,
          };
        });

        districts = mergeByKey(
          fallback.districts,
          remoteDistricts,
          (row) => row.slug,
        ).sort((a, b) => a.name_en.localeCompare(b.name_en));
      }

      if (!mRes.error && mRes.data?.length) {
        const remoteMandals: LocationMandal[] = (
          mRes.data as Array<{
            id: string;
            district_id: string;
            slug: string;
            name_en: string;
            name_te: string;
          }>
        )
          .map((row) => {
            const districtSlug = canonicalDistrictSlug(
              uuidToSlug.get(row.district_id) || row.district_id,
            );
            const slug = canonicalMandalSlug(row.slug);
            return {
              id: row.id,
              district_id: districtSlug,
              slug,
              name_en: row.name_en,
              name_te: row.name_te,
            };
          })
          .filter((row) => Boolean(row.district_id));

        mandals = mergeByKey(
          fallback.mandals,
          remoteMandals,
          (row) => `${row.district_id}::${row.slug}`,
        ).sort((a, b) => a.name_en.localeCompare(b.name_en));
      }

      if (!uRes.error && uRes.data?.length) {
        const remoteUlbs: LocationUlb[] = (
          uRes.data as Array<{
            id: string;
            district_id: string;
            slug: string;
            name_en: string;
            name_te: string;
            ulb_type: string;
          }>
        )
          .map((row) => {
            const districtSlug = canonicalDistrictSlug(
              uuidToSlug.get(row.district_id) || row.district_id,
            );
            return {
              id: row.id,
              district_id: districtSlug,
              slug: row.slug,
              name_en: row.name_en,
              name_te: row.name_te,
              ulb_type: row.ulb_type || "municipality",
            };
          })
          .filter((row) => Boolean(row.district_id));

        ulbs = mergeByKey(
          fallback.ulbs,
          remoteUlbs,
          (row) => `${row.district_id}::${row.slug}`,
        ).sort((a, b) => a.name_en.localeCompare(b.name_en));
      }
    }
  } catch {
    // keep static fallback
  }

  return NextResponse.json(
    {
      districts,
      mandals,
      ulbs,
      meta: {
        district_count: districts.length,
        mandal_count: mandals.length,
        ulb_count: ulbs.length,
        phase: "districts+mandals+ulbs",
      },
    },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
