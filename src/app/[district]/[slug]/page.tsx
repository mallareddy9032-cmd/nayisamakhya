import { notFound } from "next/navigation";
import {
  entityStaticParams,
  getAdminEntity,
  isUrbanEntityType,
} from "@/data/telanganaGeo";
import { EntityUrbanDesk } from "@/components/EntityUrbanDesk";
import { MandalPortalClient } from "@/components/MandalPortalClient";
import {
  fetchMandalPortal,
  getDirectoryMandal,
} from "@/lib/data/mandalRepository";
import { getMandal } from "@/lib/data/mandals";
import { fetchUrbanPortal } from "@/lib/data/urbanRepository";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";

type Props = {
  params: Promise<{ district: string; slug: string }>;
};

export function generateStaticParams() {
  return entityStaticParams().filter(
    (p) => isUsablePlaceSlug(p.district) && isUsablePlaceSlug(p.slug),
  );
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

  if (isUrbanEntityType(entity.type)) {
    const portalSlug = entity.legacySlug || entity.slug;
    const portal = await fetchUrbanPortal(entity.districtSlug, portalSlug);
    return <EntityUrbanDesk entity={entity} portal={portal ?? null} />;
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

  return <MandalPortalClient mandal={data} />;
}
