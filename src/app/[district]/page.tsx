import { notFound } from "next/navigation";
import { DistrictDirectoryClient } from "@/components/DistrictDirectoryClient";
import { fetchDistrictDirectory } from "@/lib/data/urbanRepository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ district: string }>;
};

export default async function DistrictDirectoryPage({ params }: Props) {
  const { district } = await params;
  const data = await fetchDistrictDirectory(district);
  if (!data) notFound();

  return (
    <DistrictDirectoryClient
      district={data.district}
      urban={data.urban}
      rural={data.rural}
    />
  );
}
