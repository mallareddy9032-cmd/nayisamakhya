import type { ReactNode } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  ModerationDeskClient,
  type DeskSubmission,
} from "@/components/admin/ModerationDeskClient";
import { ModerationUnlockForm } from "@/components/admin/ModerationUnlockForm";
import {
  deskAuthRequired,
  expectedDeskSecret,
  isDeskUnlocked,
} from "@/lib/moderation/deskAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Search = Promise<{ id?: string; status?: string }>;

function DeskMessage({
  title = "Moderation Desk",
  body,
  detail,
}: {
  title?: string;
  body: ReactNode;
  detail?: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-[#18181B]">{title}</h1>
      <p className="mt-2 text-sm text-[#71717A]">{body}</p>
      {detail ? (
        <p className="mt-2 font-mono text-xs text-rose-700">{detail}</p>
      ) : null}
    </main>
  );
}

function normalizePhotoUrls(row: DeskSubmission): DeskSubmission {
  const urls = Array.isArray(row.photo_urls)
    ? row.photo_urls.filter((u): u is string => typeof u === "string" && !!u)
    : [];
  if (!urls.length && row.photo_url) {
    return { ...row, photo_urls: [row.photo_url] };
  }
  return { ...row, photo_urls: urls };
}

export default async function ModerationDeskPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const focusId = sp.id?.trim();
  const admin = getSupabaseAdmin();

  if (!admin) {
    return (
      <DeskMessage
        body={
          <>
            Configure <code>SUPABASE_SERVICE_ROLE_KEY</code> on{" "}
            <a
              className="underline"
              href="https://vercel.com/ihs4/nayisamakhya/settings/environment-variables"
            >
              Vercel ihs4/nayisamakhya
            </a>{" "}
            to load the desk.
          </>
        }
      />
    );
  }

  const locked = deskAuthRequired() && !(await isDeskUnlocked());
  if (locked) {
    if (!expectedDeskSecret() && process.env.NODE_ENV === "production") {
      return (
        <DeskMessage
          body={
            <>
              Set <code>MODERATION_DESK_SECRET</code> (PIN) in{" "}
              <a
                className="underline"
                href="https://vercel.com/ihs4/nayisamakhya/settings/environment-variables"
              >
                Vercel ihs4/nayisamakhya
              </a>{" "}
              Production, then redeploy, then unlock this page.
            </>
          }
        />
      );
    }
    return <ModerationUnlockForm />;
  }

  const [
    { data: submissions, error: subErr },
    { data: districts },
    { data: mandals },
    { data: ulbs },
  ] = await Promise.all([
    admin
      .from("survey_submissions")
      .select(
        `
          id, sender_name, raw_caption, photo_url, photo_urls, status, created_at,
          district_id, mandal_id, ulb_id, gp_id, moderator_notes, extracted_data,
          districts(id, slug, name_en, name_te),
          mandals(id, slug, name_en, name_te),
          urban_local_bodies(id, slug, name_en, name_te),
          gram_panchayats(id, name_en, name_te)
        `,
      )
      .order("created_at", { ascending: false })
      .limit(150),
    admin
      .from("districts")
      .select("id, slug, name_en, name_te")
      .order("name_en", { ascending: true }),
    admin
      .from("mandals")
      .select("id, district_id, slug, name_en, name_te")
      .order("name_en", { ascending: true }),
    admin
      .from("urban_local_bodies")
      .select("id, district_id, slug, name_en, name_te")
      .order("name_en", { ascending: true }),
  ]);

  if (subErr) {
    // Fallback without photo_urls / ulb columns if migration not applied yet
    const fallback = await admin
      .from("survey_submissions")
      .select(
        `
          id, sender_name, raw_caption, photo_url, status, created_at,
          district_id, mandal_id, gp_id, moderator_notes, extracted_data,
          districts(id, slug, name_en, name_te),
          mandals(id, slug, name_en, name_te),
          gram_panchayats(id, name_en, name_te)
        `,
      )
      .order("created_at", { ascending: false })
      .limit(150);

    if (fallback.error) {
      return (
        <DeskMessage
          body={
            <>
              Could not load submissions. Run{" "}
              <code>create_moderation_desk.sql</code> and{" "}
              <code>005_moderation_desk_v2.sql</code> in Supabase.
            </>
          }
          detail={fallback.error.message || subErr.message}
        />
      );
    }

    const rows = ((fallback.data || []) as unknown as DeskSubmission[]).map(
      normalizePhotoUrls,
    );
    const counts = {
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      rejected: rows.filter((r) => r.status === "rejected").length,
      flagged: rows.filter((r) => r.status === "flagged").length,
      all: rows.length,
    };

    return (
      <main className="min-h-screen bg-[#FBFBF9]">
        <ModerationDeskClient
          initial={rows}
          counts={counts}
          districts={districts || []}
          mandals={mandals || []}
          ulbs={[]}
          focusId={focusId}
        />
      </main>
    );
  }

  const rows = ((submissions || []) as unknown as DeskSubmission[]).map(
    normalizePhotoUrls,
  );
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    flagged: rows.filter((r) => r.status === "flagged").length,
    all: rows.length,
  };

  return (
    <main className="min-h-screen bg-[#FBFBF9]">
      <ModerationDeskClient
        initial={rows}
        counts={counts}
        districts={districts || []}
        mandals={mandals || []}
        ulbs={(ulbs || []) as Array<{
          id: string;
          district_id: string;
          slug: string;
          name_en: string;
          name_te: string;
        }>}
        focusId={focusId}
      />
    </main>
  );
}
