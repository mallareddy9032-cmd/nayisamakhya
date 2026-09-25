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

type Search = Promise<{ id?: string }>;

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
              Set <code>MODERATION_DESK_SECRET</code> in{" "}
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
    { data: gps },
  ] = await Promise.all([
    admin
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
      .limit(120),
    admin
      .from("districts")
      .select("id, slug, name_en, name_te")
      .order("name_en", { ascending: true }),
    admin
      .from("mandals")
      .select("id, district_id, slug, name_en, name_te")
      .order("name_en", { ascending: true }),
    admin
      .from("gram_panchayats")
      .select("id, mandal_id, name_en, name_te")
      .order("name_en", { ascending: true }),
  ]);

  if (subErr) {
    return (
      <DeskMessage
        body={
          <>
            Could not load submissions. Run{" "}
            <code>create_moderation_desk.sql</code> in Supabase if the table is
            missing.
          </>
        }
        detail={subErr.message}
      />
    );
  }

  const rows = (submissions || []) as unknown as DeskSubmission[];
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    flagged: rows.filter((r) => r.status === "flagged").length,
  };

  return (
    <main className="min-h-screen bg-[#FBFBF9]">
      <ModerationDeskClient
        initial={rows}
        counts={counts}
        districts={districts || []}
        mandals={mandals || []}
        gps={gps || []}
        focusId={focusId}
      />
    </main>
  );
}
