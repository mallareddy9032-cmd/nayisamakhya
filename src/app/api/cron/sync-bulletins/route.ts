import { NextRequest, NextResponse } from "next/server";
import { authorizeCronOrDesk } from "@/lib/bulletins/auth";
import { collectFromAllAdapters } from "@/lib/bulletins/adapters";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Vercel Cron + manual desk trigger: ingest GOs/circulars/welfare notices,
 * generate Telugu auto-summaries, upsert into civic_bulletins.
 *
 * Auth: Bearer CRON_SECRET | MODERATION_DESK_SECRET (or x-cron-secret / x-desk-secret).
 */
export async function GET(req: NextRequest) {
  return syncBulletins(req);
}

export async function POST(req: NextRequest) {
  return syncBulletins(req);
}

async function syncBulletins(req: NextRequest) {
  if (!authorizeCronOrDesk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { notices, adapterReports } = await collectFromAllAdapters();
  const admin = getSupabaseAdmin();

  if (!admin) {
    // Pipeline still "runs" with mock payload when Supabase is unset (local demo).
    return NextResponse.json({
      ok: true,
      mode: "dry_run_no_supabase",
      ingested: notices.length,
      upserted: 0,
      adapterReports,
      sample: notices.slice(0, 3),
    });
  }

  let upserted = 0;
  const errors: string[] = [];

  for (const notice of notices) {
    const { error } = await admin.from("civic_bulletins").upsert(
      {
        title: notice.title,
        category: notice.category,
        target_districts: notice.target_districts,
        source_url: notice.source_url,
        pdf_url: notice.pdf_url,
        summary_te: notice.summary_te,
        published_at: notice.published_at,
        broadcast_status: notice.broadcast_status || "ready",
        source_adapter: notice.source_adapter,
        source_external_id: notice.source_external_id,
        approved_for_newsletter: notice.approved_for_newsletter ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "source_adapter,source_external_id" },
    );

    if (error) {
      // Partial unique index may not expose a named constraint for onConflict —
      // fall back to select-then-insert.
      const existing = await admin
        .from("civic_bulletins")
        .select("id")
        .eq("source_adapter", notice.source_adapter)
        .eq("source_external_id", notice.source_external_id)
        .maybeSingle();

      if (existing.data?.id) {
        const { error: updErr } = await admin
          .from("civic_bulletins")
          .update({
            title: notice.title,
            category: notice.category,
            target_districts: notice.target_districts,
            source_url: notice.source_url,
            pdf_url: notice.pdf_url,
            summary_te: notice.summary_te,
            published_at: notice.published_at,
            approved_for_newsletter: notice.approved_for_newsletter ?? true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.data.id);
        if (updErr) errors.push(updErr.message);
        else upserted += 1;
      } else {
        const { error: insErr } = await admin.from("civic_bulletins").insert({
          title: notice.title,
          category: notice.category,
          target_districts: notice.target_districts,
          source_url: notice.source_url,
          pdf_url: notice.pdf_url,
          summary_te: notice.summary_te,
          published_at: notice.published_at,
          broadcast_status: notice.broadcast_status || "ready",
          source_adapter: notice.source_adapter,
          source_external_id: notice.source_external_id,
          approved_for_newsletter: notice.approved_for_newsletter ?? true,
        });
        if (insErr) errors.push(`${error.message}; ${insErr.message}`);
        else upserted += 1;
      }
    } else {
      upserted += 1;
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    mode: "supabase",
    ingested: notices.length,
    upserted,
    adapterReports,
    errors: errors.slice(0, 8),
  });
}
