import { AnnounceHub } from "@/components/AnnounceHub";

type PageProps = {
  searchParams?: Promise<{ blast?: string | string[] }> | { blast?: string | string[] };
};

export default async function CommunityAnnouncePage({ searchParams }: PageProps) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const raw = resolved.blast;
  const initialBlast = Array.isArray(raw) ? raw[0] : raw;

  // Server-passed blast — no useSearchParams, so no CSR bailout / stuck loader.
  return <AnnounceHub initialBlast={initialBlast} />;
}
