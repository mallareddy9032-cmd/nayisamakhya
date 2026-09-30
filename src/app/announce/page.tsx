import { AnnounceHub } from "@/components/AnnounceHub";

type Search = { blast?: string | string[] };

export default async function CommunityAnnouncePage({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  const resolved: Search = (await searchParams) ?? {};
  const raw = resolved.blast;
  const initialBlast = Array.isArray(raw) ? raw[0] : raw;

  // Server-passed blast — no useSearchParams, so no CSR bailout / stuck loader.
  return <AnnounceHub initialBlast={initialBlast} />;
}
