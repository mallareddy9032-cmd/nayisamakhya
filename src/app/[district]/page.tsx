import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DistrictDirectoryClient } from "@/components/DistrictDirectoryClient";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  districtStaticParams,
  getGeoDistrict,
  listDistrictEntities,
} from "@/data/telanganaGeo";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";
import { administrativeAreaJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/seo/site";

type Props = {
  params: Promise<{ district: string }>;
};

export function generateStaticParams() {
  return districtStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: raw } = await params;
  const district = getGeoDistrict(raw.trim().toLowerCase());
  if (!district) {
    return { title: "District not found | Nayi Samakhya" };
  }
  // Prefer the /districts/[slug] hub as the canonical indexable district URL.
  const canonicalPath = `/districts/${district.slug}`;
  return {
    title: `${district.nameTe} జిల్లా డైరెక్టరీ (${district.nameEn})`,
    description: `${district.nameTe} — urban & rural service desks across ${district.mandals.length} mandals.`,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    openGraph: {
      title: `${district.nameEn} District Directory — Nayi Samakhya`,
      url: canonicalPath,
    },
  };
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
    <>
      <JsonLd
        data={administrativeAreaJsonLd({
          nameEn: `${district.nameEn} District`,
          nameTe: `${district.nameTe} జిల్లా`,
          path: `/districts/${district.slug}`,
          containedInName: "Telangana",
        })}
      />
      <DistrictDirectoryClient
        district={{
          slug: district.slug,
          name_en: district.nameEn,
          name_te: district.nameTe,
        }}
        urban={cleanUrban}
        rural={cleanRural}
      />
    </>
  );
}
