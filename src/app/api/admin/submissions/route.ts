import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlaceRel = { name_en?: string | null; name_te?: string | null } | null;

/** Lazy client — never instantiate at module scope (build/static analysis safe). */
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const expectedSecret = process.env.MODERATION_DESK_SECRET?.trim() || "";
  if (!expectedSecret) return false;
  return authHeader === `Bearer ${expectedSecret}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Apex 308s break Telegram URL buttons — always prefer www. */
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

function placeName(rel: PlaceRel | PlaceRel[] | undefined): string {
  const row = Array.isArray(rel) ? rel[0] : rel;
  if (!row) return "";
  return String(row.name_te || row.name_en || "").trim();
}

async function sendTelegramMessage(
  chatId: string | number | null | undefined,
  text: string,
  replyMarkup?: Record<string, unknown>,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!botToken || chatId === null || chatId === undefined || chatId === "") {
    return;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        }),
      },
    );
    const json = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
    } | null;
    if (json && json.ok === false) {
      console.error("Telegram status alert failed:", json.description || json);
      // Retry plain text if HTML entities rejected.
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.replace(/<[^>]+>/g, ""),
          reply_markup: replyMarkup,
        }),
      });
    }
  } catch (err) {
    console.error("Failed to dispatch Telegram status alert:", err);
  }
}

const ALLOWED_GET_STATUS = new Set([
  "pending",
  "approved",
  "rejected",
  "flagged",
]);

export async function GET(req: NextRequest) {
  try {
    if (!verifyAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "supabase_not_configured" },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    if (!ALLOWED_GET_STATUS.has(status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }

    let query = supabase
      .from("survey_submissions")
      .select(
        `
      id,
      created_at,
      sender_name,
      telegram_chat_id,
      photo_url,
      photo_urls,
      raw_caption,
      status,
      district_id,
      mandal_id,
      panchayat_name,
      admin_notes,
      districts(id, name_en, name_te, slug),
      mandals(id, name_en, name_te, slug)
    `,
      )
      .order("created_at", { ascending: false })
      .limit(50);

    // Pending queue includes flagged (needs caption/location triage).
    if (status === "pending") {
      query = query.in("status", ["pending", "flagged"]);
    } else {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submissions: data });
  } catch (err) {
    console.error("GET /api/admin/submissions", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "server_error" },
      { status: 500 },
    );
  }
}

const ALLOWED_PATCH_STATUS = new Set([
  "pending",
  "approved",
  "rejected",
  "flagged",
]);

export async function PATCH(req: NextRequest) {
  try {
    if (!verifyAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: {
      id?: string;
      status?: string;
      district_id?: string | null;
      mandal_id?: string | null;
      panchayat_name?: string | null;
      admin_notes?: string | null;
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const { id, status, district_id, mandal_id, panchayat_name, admin_notes } =
      body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 },
      );
    }
    if (!ALLOWED_PATCH_STATUS.has(status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "supabase_not_configured" },
        { status: 503 },
      );
    }

    // Fetch recipient details before update (needed for Telegram notify).
    const { data: existing, error: fetchErr } = await supabase
      .from("survey_submissions")
      .select("telegram_chat_id, sender_name, raw_caption")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("survey_submissions")
      .update({
        status,
        district_id: district_id || null,
        mandal_id: mandal_id || null,
        panchayat_name: panchayat_name || null,
        admin_notes: admin_notes || null,
        reviewed_at: new Date().toISOString(),
        moderated_at: new Date().toISOString(),
        moderated_by: "admin-desk",
      })
      .eq("id", id)
      .select(
        `
      *,
      districts(name_en, name_te, slug),
      mandals(name_en, name_te, slug)
    `,
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Two-way Telegram notification loop (approve / reject only).
    const chatId = existing.telegram_chat_id as string | number | null;
    const recipient = escapeHtml(
      String(existing.sender_name || "").trim() ||
        "\u0C2E\u0C3F\u0C24\u0C4D\u0C30\u0C2E\u0C3E",
    );
    const origin = siteOrigin();
    const notes = admin_notes ? escapeHtml(String(admin_notes)) : "";

    if (status === "approved") {
      const locality = [
        panchayat_name ? escapeHtml(String(panchayat_name)) : "",
        escapeHtml(placeName(data?.mandals as PlaceRel | PlaceRel[])),
        escapeHtml(placeName(data?.districts as PlaceRel | PlaceRel[])),
      ]
        .filter(Boolean)
        .join(", ");

      const approvalMsg =
        `\u2705 <b>\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02 ${recipient} \u0C17\u0C3E\u0C30\u0C41!</b>\n\n` +
        `\u0C2E\u0C40\u0C30\u0C41 \u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02/\u0C38\u0C46\u0C32\u0C42\u0C28\u0C4D \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E <b>\u0C27\u0C4D\u0C30\u0C41\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C4D\u0C21\u0C3E\u0C2F\u0C3F (Approved)</b>.\n\n` +
        `\u{1F4CD} <b>\u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C02:</b> ${locality || "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"}\n` +
        (notes
          ? `\u{1F4DD} <b>\u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D \u0C17\u0C2E\u0C28\u0C3F\u0C15:</b> ${notes}\n`
          : "") +
        `\n\u0C08 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C2A\u0C4D\u0C30\u0C38\u0C4D\u0C24\u0C41\u0C24\u0C02 \u0C2E\u0C28 \u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C24 \u0C2A\u0C2C\u0C4D\u0C32\u0C3F\u0C15\u0C4D \u0C2B\u0C40\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C26\u0C30\u0C4D\u0C36\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C2A\u0C30\u0C3F\u0C37\u0C4D\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C15\u0C42\u0C21\u0C3E \u0C24\u0C2F\u0C3E\u0C30\u0C41\u0C1A\u0C47\u0C38\u0C41\u0C15\u0C4B\u0C35\u0C1A\u0C4D\u0C1A\u0C41.`;

      await sendTelegramMessage(chatId, approvalMsg, {
        inline_keyboard: [
          [
            {
              text: "\u{1F310} \u0C2B\u0C40\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C1A\u0C42\u0C21\u0C02\u0C21\u0C3F (View Feed)",
              url: `${origin}/feed`,
            },
          ],
          [
            {
              text: "\u{1F4C4} \u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C24\u0C2F\u0C3E\u0C30\u0C41\u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
              url: `${origin}/representation`,
            },
          ],
        ],
      });
    } else if (status === "rejected") {
      const rejectionMsg =
        `\u26A0\uFE0F <b>\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02 ${recipient} \u0C17\u0C3E\u0C30\u0C41!</b>\n\n` +
        `\u0C2E\u0C40\u0C30\u0C41 \u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C2B\u0C4B\u0C1F\u0C4B/\u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F. \u0C38\u0C30\u0C48\u0C28 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 (\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E, \u0C2E\u0C02\u0C21\u0C32\u0C02, \u0C38\u0C4D\u0C2A\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C2B\u0C4B\u0C1F\u0C4B) \u0C32\u0C47\u0C15\u0C2A\u0C4B\u0C35\u0C21\u0C02 \u0C35\u0C32\u0C4D\u0C32 \u0C2A\u0C4D\u0C30\u0C38\u0C4D\u0C24\u0C41\u0C24\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C07\u0C26\u0C3F <b>\u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28\u0C32\u0C4B \u0C28\u0C3F\u0C32\u0C3F\u0C2A\u0C3F\u0C35\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F</b>.\n\n` +
        (notes
          ? `\u{1F4DD} <b>\u0C15\u0C3E\u0C30\u0C23\u0C02:</b> ${notes}\n\n`
          : "") +
        `\u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C38\u0C4D\u0C2A\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C24\u0C4B \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C28\u0C41 \u0C2A\u0C02\u0C2A\u0C17\u0C32\u0C30\u0C41.`;

      await sendTelegramMessage(chatId, rejectionMsg);
    }

    return NextResponse.json({ success: true, submission: data });
  } catch (err) {
    console.error("PATCH /api/admin/submissions", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "server_error" },
      { status: 500 },
    );
  }
}
