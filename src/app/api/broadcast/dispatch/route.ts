import { NextRequest, NextResponse } from "next/server";
import { authorizeCronOrDesk } from "@/lib/bulletins/auth";
import type {
  BulletinCoordinatorEndpoint,
  CivicBulletin,
} from "@/lib/bulletins/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DispatchBody = {
  bulletin_id?: string;
  dry_run?: boolean;
};

function botToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

function whatsappWebhookUrl() {
  return process.env.WHATSAPP_WEBHOOK_URL?.trim() || "";
}

function siteOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://www.nayisamakhya.org";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    if (u.hostname === "nayisamakhya.org") {
      u.hostname = "www.nayisamakhya.org";
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://www.nayisamakhya.org";
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTelegramMessage(b: CivicBulletin): string {
  const origin = siteOrigin();
  const districts =
    b.target_districts.length > 0
      ? b.target_districts.join(", ")
      : "statewide";
  const link = b.source_url || b.pdf_url || `${origin}/newsletter`;
  return (
    `📢 <b>నాయి సమాఖ్య — పౌర బులెటిన్</b>\n\n` +
    `<b>${escapeHtml(b.title)}</b>\n` +
    `వర్గం: <i>${escapeHtml(b.category)}</i>\n` +
    `జిల్లాలు: ${escapeHtml(districts)}\n\n` +
    `${escapeHtml(b.summary_te)}\n\n` +
    `🔗 <a href="${escapeHtml(link)}">${escapeHtml(link)}</a>\n` +
    `📰 ${escapeHtml(origin)}/newsletter`
  );
}

async function sendTelegram(chatId: string, text: string) {
  const token = botToken();
  if (!token) {
    return { ok: false, skipped: true, reason: "TELEGRAM_BOT_TOKEN unset" };
  }
  // Skip demo placeholders to avoid Telegram API noise.
  if (chatId.startsWith("demo-")) {
    return { ok: true, skipped: true, reason: "demo_chat_id" };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const json = (await res.json().catch(() => null)) as {
    ok?: boolean;
    description?: string;
  } | null;
  return {
    ok: Boolean(json?.ok),
    skipped: false,
    reason: json?.ok ? undefined : json?.description || `http_${res.status}`,
  };
}

async function sendWhatsApp(toE164: string, bulletin: CivicBulletin) {
  const url = whatsappWebhookUrl();
  if (!url) {
    return { ok: false, skipped: true, reason: "WHATSAPP_WEBHOOK_URL unset" };
  }
  if (toE164.startsWith("91900000000")) {
    return { ok: true, skipped: true, reason: "demo_whatsapp" };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WHATSAPP_WEBHOOK_SECRET?.trim()
        ? {
            Authorization: `Bearer ${process.env.WHATSAPP_WEBHOOK_SECRET.trim()}`,
          }
        : {}),
    },
    body: JSON.stringify({
      to: toE164,
      type: "bulletin_dispatch",
      bulletin_id: bulletin.id,
      title: bulletin.title,
      category: bulletin.category,
      summary_te: bulletin.summary_te,
      source_url: bulletin.source_url,
      pdf_url: bulletin.pdf_url,
      target_districts: bulletin.target_districts,
    }),
  });
  return {
    ok: res.ok,
    skipped: false,
    reason: res.ok ? undefined : `http_${res.status}`,
  };
}

/**
 * Dispatch one civic bulletin to coordinators whose district_slug is in
 * bulletin.target_districts — Telegram (@NayiSamakhyaDeskBot) + WhatsApp webhook.
 *
 * Auth: Bearer CRON_SECRET | MODERATION_DESK_SECRET.
 * Body: { bulletin_id: uuid, dry_run?: boolean }
 */
export async function POST(req: NextRequest) {
  if (!authorizeCronOrDesk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: DispatchBody = {};
  try {
    body = (await req.json()) as DispatchBody;
  } catch {
    body = {};
  }

  const bulletinId = body.bulletin_id?.trim();
  if (!bulletinId) {
    return NextResponse.json(
      { error: "bulletin_id_required" },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const { data: bulletin, error: bErr } = await admin
    .from("civic_bulletins")
    .select("*")
    .eq("id", bulletinId)
    .maybeSingle();

  if (bErr || !bulletin) {
    return NextResponse.json(
      { error: bErr?.message || "bulletin_not_found" },
      { status: 404 },
    );
  }

  const row = bulletin as CivicBulletin;
  const districts = (row.target_districts || []).map((d) =>
    d.trim().toLowerCase(),
  );

  if (districts.length === 0) {
    return NextResponse.json(
      {
        error: "no_target_districts",
        hint: "Refusing statewide fan-out without explicit district list",
      },
      { status: 400 },
    );
  }

  const { data: endpoints, error: eErr } = await admin
    .from("bulletin_coordinator_endpoints")
    .select("*")
    .eq("is_active", true)
    .in("district_slug", districts);

  if (eErr) {
    return NextResponse.json({ error: eErr.message }, { status: 500 });
  }

  const targets = (endpoints || []) as BulletinCoordinatorEndpoint[];
  const message = formatTelegramMessage(row);
  const results: {
    district_slug: string;
    name_en: string;
    telegram?: { ok: boolean; skipped?: boolean; reason?: string };
    whatsapp?: { ok: boolean; skipped?: boolean; reason?: string };
  }[] = [];

  if (!body.dry_run) {
    for (const t of targets) {
      const entry: (typeof results)[number] = {
        district_slug: t.district_slug,
        name_en: t.name_en,
      };
      if (t.telegram_chat_id) {
        entry.telegram = await sendTelegram(t.telegram_chat_id, message);
      }
      if (t.whatsapp_e164) {
        entry.whatsapp = await sendWhatsApp(t.whatsapp_e164, row);
      }
      results.push(entry);
    }

    const anyFail = results.some(
      (r) =>
        (r.telegram && !r.telegram.ok && !r.telegram.skipped) ||
        (r.whatsapp && !r.whatsapp.ok && !r.whatsapp.skipped),
    );

    await admin
      .from("civic_bulletins")
      .update({
        broadcast_status: anyFail ? "failed" : "dispatched",
        dispatched_at: new Date().toISOString(),
        dispatch_meta: {
          coordinator_count: targets.length,
          districts,
          results,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", bulletinId);
  }

  return NextResponse.json({
    ok: true,
    dry_run: Boolean(body.dry_run),
    bulletin_id: bulletinId,
    matching_coordinators: targets.length,
    districts,
    results: body.dry_run
      ? targets.map((t) => ({
          district_slug: t.district_slug,
          name_en: t.name_en,
          telegram_chat_id: t.telegram_chat_id,
          whatsapp_e164: t.whatsapp_e164,
        }))
      : results,
  });
}
