import { notFound } from "next/navigation";
import { UrbanPortalClient } from "@/components/UrbanPortalClient";
import { fetchUrbanPortal } from "@/lib/data/urbanRepository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ district: string; ulb: string }>;
};

export default async function UrbanUlbPage({ params }: Props) {
  const { district, ulb } = await params;
  const portal = await fetchUrbanPortal(district, ulb);
  if (!portal) notFound();

  return <UrbanPortalClient portal={portal} />;
}
