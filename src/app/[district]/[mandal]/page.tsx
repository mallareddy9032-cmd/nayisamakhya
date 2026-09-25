import { notFound } from "next/navigation";
import {
  fetchMandalPortal,
  getDirectoryMandal,
} from "@/lib/data/mandalRepository";
import { getMandal } from "@/lib/data/mandals";
import { MandalPortalClient } from "@/components/MandalPortalClient";

/** Request-time resolution so Supabase env + mandal_officers roster are used. */
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ district: string; mandal: string }>;
};

/**
 * Dynamic mandal hub — loads portal payload (including verified
 * `mandal_officers` roster when Supabase is configured). Falls back to the
 * Phase-2 directory so all 589 TG mandals resolve.
 */
export default async function MandalHubPage({ params }: Props) {
  const { district, mandal } = await params;

  let data;
  try {
    data = await fetchMandalPortal(district, mandal);
  } catch {
    data =
      getMandal(district, mandal) || getDirectoryMandal(district, mandal);
  }

  if (!data) {
    data =
      getMandal(district, mandal) || getDirectoryMandal(district, mandal);
  }
  if (!data) {
    notFound();
  }

  return <MandalPortalClient mandal={data} />;
}
