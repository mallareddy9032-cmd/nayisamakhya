import { notFound } from "next/navigation";
import { DistrictDirectoryClient } from "@/components/DistrictDirectoryClient";
import {
  districtStaticParams,
  getGeoDistrict,
  listDistrictEntities,
} from "@/data/telanganaGeo";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";

type Props = {
  params: Promise<{ district: string }>;
};

export function generateStaticParams() {
  return districtStaticParams();
}

export default async function DistrictDirectoryPage({ params }: Props) {
  const { district: raw } = await params;
  const districtSlug = raw.trim().toLowerCase();
  const district = getGeoDistrict(districtSlug);
  if (!district) notFound();

  const { urban, rural } = listDistrictEntities(district.slug);
  const cleanUrban = urban.filter((e) => isUsablePlaceSlug(e.slug));
  const cleanRural = rural.filter((e) => isUsablePlaceSlug(e.slug));

  return (
    <DistrictDirectoryClient
      district={{
        slug: district.slug,
        name_en: district.nameEn,
        name_te: district.nameTe,
      }}
      urban={cleanUrban}
      rural={cleanRural}
    />
  );
}
