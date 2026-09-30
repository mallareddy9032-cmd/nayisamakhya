import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  entityStaticParams,
  getAdminEntity,
  getGeoDistrict,
  isUrbanEntityType,
} from "@/data/telanganaGeo";
import { EntityUrbanDesk } from "@/components/EntityUrbanDesk";
import { JsonLd } from "@/components/seo/JsonLd";
import { MandalPortalClient } from "@/components/MandalPortalClient";
import {
  fetchMandalPortal,
  getDirectoryMandal,
} from "@/lib/data/mandalRepository";
import { getMandal } from "@/lib/data/mandals";
import { fetchUrbanPortal } from "@/lib/data/urbanRepository";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";
import { placeJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/seo/site";

type Props = {
  params: Promise<{ district: string; slug: string }>;
};

export function generateStaticParams() {
  return entityStaticParams().filter(
    (p) => isUsablePlaceSlug(p.district) && isUsablePlaceSlug(p.slug),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: dRaw, slug: sRaw } = await params;
  const districtSlug = dRaw.trim().toLowerCase();
  const slug = sRaw.trim().toLowerCase();
  const entity = getAdminEntity(districtSlug, slug);
  const district = getGeoDistrict(districtSlug);

  if (entity) {
    const path = `/${entity.districtSlug}/${entity.slug}`;
    return {
      title: `${entity.nameTe} (${entity.nameEn}) — ${entity.districtNameTe}`,
      description: `${entity.nameTe}, ${entity.districtNameTe} — Nayi Samakhya civic service desk.`,
      alternates: { canonical: absoluteUrl(path) },
      openGraph: {
        title: `${entity.nameEn} — Nayi Samakhya`,
        url: path,
      },
    };
  }

  if (!district || !isUsablePlaceSlug(slug)) {
    return { title: "Service desk | Nayi Samakhya" };
  }

  const path = `/${district.slug}/${slug}`;
  return {
    title: `${slug} — ${district.nameTe} | Nayi Samakhya`,
    description: `${district.nameTe} civic service desk.`,
    alternates: { canonical: absoluteUrl(path) },
  };
}

/**
 * Unified entity desk — urban ULB or rural mandal under /[district]/[slug].
 * Legacy /[district]/urban/[ulb] redirects here.
 */
export default async function EntityDeskPage({ params }: Props) {
  const { district: dRaw, slug: sRaw } = await params;
  const district = dRaw.trim().toLowerCase();
  const slug = sRaw.trim().toLowerCase();

  if (!isUsablePlaceSlug(slug)) notFound();

  const entity = getAdminEntity(district, slug);
  if (!entity) {
    // Fallback: legacy rural LGD slug that was not remapped
    let data;
    try {
      data = await fetchMandalPortal(district, slug);
    } catch {
      data = getMandal(district, slug) || getDirectoryMandal(district, slug);
    }
    if (!data) {
      data = getMandal(district, slug) || getDirectoryMandal(district, slug);
    }
    if (!data) notFound();
    return <MandalPortalClient mandal={data} />;
  }

  const jsonLd = (
    <JsonLd
      data={placeJsonLd({
        nameEn: entity.nameEn,
        nameTe: entity.nameTe,
        path: `/${entity.districtSlug}/${entity.slug}`,
        districtNameEn: entity.districtNameEn,
        districtPath: `/districts/${entity.districtSlug}`,
      })}
    />
  );

  if (isUrbanEntityType(entity.type)) {
    const portalSlug = entity.legacySlug || entity.slug;
    const portal = await fetchUrbanPortal(entity.districtSlug, portalSlug);
    return (
      <>
        {jsonLd}
        <EntityUrbanDesk entity={entity} portal={portal ?? null} />
      </>
    );
  }

  // Rural mandal desk — prefer original LGD slug for portal data.
  const ruralLookup =
    slug.endsWith("-rural") || slug.endsWith("-mandal")
      ? slug.replace(/-rural$|-mandal$/, "")
      : slug;

  let data;
  try {
    data =
      (await fetchMandalPortal(district, ruralLookup)) ||
      (await fetchMandalPortal(district, slug));
  } catch {
    data =
      getMandal(district, ruralLookup) ||
      getMandal(district, slug) ||
      getDirectoryMandal(district, ruralLookup) ||
      getDirectoryMandal(district, slug);
  }
  if (!data) {
    data =
      getMandal(district, ruralLookup) ||
      getMandal(district, slug) ||
      getDirectoryMandal(district, ruralLookup) ||
      getDirectoryMandal(district, slug);
  }
  if (!data) notFound();

  return (
    <>
      {jsonLd}
      <MandalPortalClient mandal={data} />
    </>
  );
}
