import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabase } from "@/lib/supabase/client";
import type {
  DiscomId,
  GrievanceTypeId,
} from "@/types/grievance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NotifyBody = {
  type?: string;
  fullName?: string;
  shopName?: string;
  uscno?: string;
  mandal?: string;
  district?: string;
  grievanceType?: string;
  grievanceTypeId?: GrievanceTypeId | string;
  discom?: DiscomId | string;
  mobile?: string;
  connectedLoad?: string;
  avgMonthlyUnits?: string;
  narrative?: string;
  districtSlug?: string;
  mandalSlug?: string;
  referenceId?: string;
};

function telegramToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

function warRoomChatId(): string {
  return (
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    process.env.TELEGRAM_ADMIN_CHANNEL_ID?.trim() ||
    ""
  );
}

function clip(value: unknown, max: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

async function sendTelegramAlert(text: string): Promise<{
  ok: boolean;
  skipped?: boolean;
  reason?: string;
}> {
  const token = telegramToken();
  const chatId = warRoomChatId();
  if (!token || !chatId) {
    return { ok: false, skipped: true, reason: "telegram_unset" };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[notify:grievance] telegram", res.status, errText);
      return { ok: false, reason: `telegram_http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[notify:grievance] telegram fetch", err);
    return { ok: false, reason: "telegram_fetch_failed" };
  }
}

function formatWarRoomMessage(body: NotifyBody, referenceId: string): string {
  const stamp = new Intl.DateTimeFormat("te-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    `⚡ <b>G.O.23 ఫిర్యాదు డాకెట్ (#${referenceId})</b>\n` +
    `• పేరు: ${clip(body.fullName, 80) || "—"}\n` +
    `• షాపు: ${clip(body.shopName, 80) || "—"}\n` +
    `• USCNO: ${clip(body.uscno, 20) || "—"}\n` +
    `• మండలం: ${clip(body.mandal, 80) || "—"}\n` +
    `• జిల్లా: ${clip(body.district, 80) || "—"}\n` +
    `• DISCOM: ${clip(body.discom, 16) || "—"}\n` +
    `• రకం: ${clip(body.grievanceType, 160) || "—"}\n` +
    `• సమయం: ${stamp}`
  );
}

async function persistGrievance(
  body: NotifyBody,
  referenceId: string,
): Promise<{ ok: boolean; persisted: boolean; reason?: string }> {
  const row = {
    reference_id: referenceId,
    full_name: clip(body.fullName, 120) || "—",
    shop_name: clip(body.shopName, 120) || "—",
    mobile: clip(body.mobile, 15) || null,
    uscno: clip(body.uscno, 20) || "—",
    district_slug: clip(body.districtSlug || body.district, 80).toLowerCase() || "unknown",
    district_te: clip(body.district, 120) || null,
    mandal_slug: clip(body.mandalSlug || body.mandal, 80).toLowerCase() || "unknown",
    mandal_te: clip(body.mandal, 120) || null,
    discom: clip(body.discom, 16) || "TGSPDCL",
    connected_load: clip(body.connectedLoad, 40) || null,
    avg_monthly_units: clip(body.avgMonthlyUnits, 40) || null,
    grievance_type: clip(body.grievanceTypeId || body.grievanceType, 64) || "subsidy_not_applied",
    grievance_label_te: clip(body.grievanceType, 240) || null,
    narrative: clip(body.narrative, 4000) || null,
    payload: {
      type: "grievance",
      source: "grievance_docket",
      notified_at: new Date().toISOString(),
    },
  };

  const admin = getSupabaseAdmin();
  const client = admin || getSupabase();
  if (!client) {
    return { ok: true, persisted: false, reason: "supabase_unavailable" };
  }

  const { error } = await client.from("grievances").insert(row);
  if (error) {
    // Soft-ok: print still works; War Room may still fire.
    console.error("[notify:grievance] insert", error.message);
    return { ok: true, persisted: false, reason: error.message };
  }
  return { ok: true, persisted: true };
}

/**
 * War Room dispatch + grievance log.
 * Accepts `type: 'grievance'` (and reserved future notify types).
 * Never blocks the client print flow — soft-fails when Telegram / Supabase unset.
 */
export async function POST(req: Request) {
  let body: NotifyBody;
  try {
    body = (await req.json()) as NotifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = clip(body.type, 40) || "grievance";
  if (type !== "grievance") {
    return NextResponse.json(
      { ok: false, error: "unsupported_type", supported: ["grievance"] },
      { status: 400 },
    );
  }

  const fullName = clip(body.fullName, 120);
  const shopName = clip(body.shopName, 120);
  const uscno = clip(body.uscno, 20);
  if (!fullName || !shopName || !uscno) {
    return NextResponse.json(
      { ok: false, error: "missing_required", required: ["fullName", "shopName", "uscno"] },
      { status: 400 },
    );
  }

  const referenceId =
    clip(body.referenceId, 64) ||
    `NS-GO23-${Date.now().toString(36).toUpperCase()}`;

  const telegram = await sendTelegramAlert(
    formatWarRoomMessage({ ...body, fullName, shopName, uscno }, referenceId),
  );
  const db = await persistGrievance(
    { ...body, fullName, shopName, uscno },
    referenceId,
  );

  return NextResponse.json({
    ok: true,
    type: "grievance",
    referenceId,
    telegram,
    database: db,
  });
}
