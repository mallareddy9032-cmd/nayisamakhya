import { notFound, redirect } from "next/navigation";
import { resolveCanonicalEntitySlug } from "@/data/telanganaGeo";
import { isUsablePlaceSlug } from "@/lib/data/locationAliases";

type Props = {
  params: Promise<{ district: string; ulb: string }>;
};

/**
 * Legacy urban portal URL — permanent redirect to unified /[district]/[slug].
 */
export default async function UrbanUlbRedirectPage({ params }: Props) {
  const { district, ulb } = await params;
  if (!isUsablePlaceSlug(ulb)) notFound();

  const canonical = resolveCanonicalEntitySlug(district, ulb);
  if (!canonical) notFound();

  redirect(`/${district.trim().toLowerCase()}/${canonical}`);
}
