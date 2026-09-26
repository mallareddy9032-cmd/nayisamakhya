import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { parseCaptionLocations } from "@/lib/moderation/parseCaption";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramPhotoSize = {
  file_id: string;
  file_unique_id: string;
  width?: number;
  height?: number;
};

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramMessage = {
  message_id: number;
  caption?: string;
  text?: string;
  photo?: TelegramPhotoSize[];
  media_group_id?: string | number;
  from?: TelegramUser;
  chat?: { id: number };
};

type TelegramCallbackQuery = {
  id: string;
  data?: string;
  from?: TelegramUser;
  message?: { chat?: { id: number }; message_id?: number };
};

type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

function botToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

function siteOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  // Apex redirects → www with 308; prefer www for Telegram review links.
  return "https://www.nayisamakhya.org";
}

async function telegramApi(method: string, body: Record<string, unknown>) {
  const token = botToken();
  if (!token) return null;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as {
    ok?: boolean;
    description?: string;
    result?: Record<string, unknown>;
  } | null;
  if (json && json.ok === false) {
    console.error(`telegram ${method} failed:`, json.description || json);
  }
  return json;
}

async function replyText(
  chatId: number | string,
  text: string,
  replyMarkup?: Record<string, unknown>,
  parseMode: "HTML" | undefined = "HTML",
) {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
  };
  if (parseMode) payload.parse_mode = parseMode;
  const result = await telegramApi("sendMessage", payload);
  // Retry without HTML if Telegram rejects parse_mode (bad entities).
  if (result && result.ok === false && parseMode) {
    await telegramApi("sendMessage", {
      chat_id: chatId,
      text: text.replace(/<[^>]+>/g, ""),
      reply_markup: replyMarkup,
    });
  }
}

function senderName(from?: TelegramUser) {
  if (!from) return "Field enumerator";
  const full = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  return full || from.username || "Field enumerator";
}

/** Normalize /start@BotName and case so greeting detection is reliable. */
function normalizeInboundText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Strip @bot suffix from slash commands: /start@NayiSamakhyaDeskBot → /start
  const cmd = trimmed.match(/^\/([a-zA-Z0-9_]+)(?:@\w+)?(?:\s|$)/);
  if (cmd) {
    const rest = trimmed.slice(cmd[0].trimEnd().length).trim();
    return rest ? `/${cmd[1].toLowerCase()} ${rest}` : `/${cmd[1].toLowerCase()}`;
  }
  return trimmed;
}

function isGreeting(text: string): boolean {
  const normalized = normalizeInboundText(text);
  const key = normalized.toLowerCase();
  const greetings = new Set([
    "/start",
    "hi",
    "hello",
    "namaste",
    "start",
    "help",
    "\u0C28\u0C2E\u0C38\u0C4D\u0C24\u0C47", // నమస్తే
    "\u0C39\u0C3E\u0C2F\u0C4D", // హాయ్
  ]);
  return greetings.has(key) || greetings.has(normalized);
}

async function sendWelcomeMenu(chatId: number | string, name: string) {
  const origin = siteOrigin();
  const welcomeText =
    `\u{1F64F} <b>\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02 ${name} \u0C17\u0C3E\u0C30\u0C41!</b>\n\n` +
    `<b>\u0C28\u0C3E\u0C2F\u0C3F \u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C38\u0C47\u0C35\u0C3E \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D</b> \u0C15\u0C41 \u0C38\u0C4D\u0C35\u0C3E\u0C17\u0C24\u0C02. ` +
    `\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C24\u0C02\u0C17\u0C3E \u0C2E\u0C28 \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C40 \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C32 \u0C2A\u0C30\u0C3F\u0C37\u0C4D\u0C15\u0C3E\u0C30\u0C02, \u0C38\u0C02\u0C15\u0C4D\u0C37\u0C47\u0C2E\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C08 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02 \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.\n\n` +
    `\u0C2E\u0C40\u0C30\u0C41 \u0C15\u0C4D\u0C30\u0C3F\u0C02\u0C26\u0C3F \u0C38\u0C47\u0C35\u0C32\u0C28\u0C41 \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C1A\u0C4D\u0C1A\u0C41:`;

  await replyText(chatId, welcomeText, {
    inline_keyboard: [
      [
        {
          text: "\u{1F4F8} \u0C2B\u0C4B\u0C1F\u0C4B / \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F",
          callback_data: "guide_photo",
        },
        {
          text: "\u{1F4DE} \u0C2E\u0C02\u0C21\u0C32 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F \u0C28\u0C02\u0C2C\u0C30\u0C4D",
          callback_data: "find_officer",
        },
      ],
      [
        {
          text: "\u{1F4C4} \u0C35\u0C3F\u0C28\u0C24\u0C3F\u0C2A\u0C24\u0C4D\u0C30\u0C02 (Representation)",
          url: `${origin}/representation`,
        },
        {
          text: "\u{1F310} \u0C2E\u0C28 \u0C35\u0C46\u0C2C\u0C4D\u200C\u0C38\u0C3E\u0C1F\u0C4D",
          url: origin,
        },
      ],
    ],
  });
}

async function handleCallbackQuery(
  cq: TelegramCallbackQuery,
): Promise<NextResponse> {
  const chatId = cq.message?.chat?.id;
  if (!chatId) return NextResponse.json({ ok: true });

  if (cq.data === "guide_photo") {
    await replyText(
      chatId,
      `\u{1F4F8} <b>\u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C41 \u0C2A\u0C02\u0C2A\u0C47 \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02:</b>\n\n` +
        `1. \u0C2E\u0C40 \u0C38\u0C46\u0C32\u0C42\u0C28\u0C4D \u0C37\u0C3E\u0C2A\u0C4D / \u0C2E\u0C40\u0C1F\u0C3F\u0C02\u0C17\u0C4D / \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C28\u0C41 \u0C07\u0C15\u0C4D\u0C15\u0C21\u0C47 \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F.\n` +
        `2. \u0C2B\u0C4B\u0C1F\u0C4B\u0C24\u0C4B \u0C2A\u0C3E\u0C1F\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C2B\u0C4B\u0C1F\u0C4B \u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C35\u0C46\u0C02\u0C1F\u0C28\u0C47:\n` +
        `   \u2022 <b>\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E</b>\n` +
        `   \u2022 <b>\u0C2E\u0C02\u0C21\u0C32\u0C02 \u0C32\u0C47\u0C26\u0C3E \u0C0A\u0C30\u0C3F \u0C2A\u0C47\u0C30\u0C41</b>\n` +
        `   \u2022 <b>\u0C35\u0C3F\u0C37\u0C2F\u0C02</b>\n` +
        `\u0C2E\u0C46\u0C38\u0C47\u0C1C\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F. \u0C2E\u0C3E \u0C2C\u0C43\u0C02\u0C26\u0C02 \u0C35\u0C46\u0C02\u0C1F\u0C28\u0C47 \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.`,
    );
  } else if (cq.data === "find_officer") {
    await replyText(
      chatId,
      `\u{1F4DE} <b>\u0C2E\u0C02\u0C21\u0C32 \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 \u0C28\u0C02\u0C2C\u0C30\u0C4D \u0C24\u0C46\u0C32\u0C41\u0C38\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F:</b>\n\n` +
        `\u0C2E\u0C40 \u0C2E\u0C02\u0C21\u0C32 \u0C2A\u0C47\u0C30\u0C41\u0C28\u0C41 \u0C07\u0C32\u0C3E \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F:\n` +
        `<code>/officer \u0C2E\u0C40_\u0C2E\u0C02\u0C21\u0C32\u0C02_\u0C2A\u0C47\u0C30\u0C41</code>\n\n` +
        `<i>\u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23: <code>/officer Kodad</code> \u0C32\u0C47\u0C26\u0C3E <code>/officer Madhira</code></i>`,
    );
  }

  if (cq.id) {
    await telegramApi("answerCallbackQuery", { callback_query_id: cq.id });
  }
  return NextResponse.json({ ok: true });
}

async function handleOfficerLookup(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  chatId: number | string,
  text: string,
): Promise<NextResponse> {
  const queryMandal = text.replace(/^\/officer\s*/i, "").trim().toLowerCase();
  if (!queryMandal) {
    await replyText(
      chatId,
      `\u26A0\uFE0F \u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C2E\u0C02\u0C21\u0C32 \u0C2A\u0C47\u0C30\u0C41 \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F. \u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23\u0C15\u0C41: <code>/officer Kodad</code>`,
    );
    return NextResponse.json({ ok: true });
  }

  const { data: mandalData } = await admin
    .from("mandals")
    .select("id, name_en, name_te, districts(name_en)")
    .ilike("name_en", `%${queryMandal}%`)
    .limit(1)
    .maybeSingle();

  if (!mandalData) {
    await replyText(
      chatId,
      `\u{1F50D} <b>"${queryMandal}"</b> \u0C2E\u0C02\u0C21\u0C32\u0C02 \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41. \u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C38\u0C30\u0C48\u0C28 \u0C38\u0C4D\u0C2A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C24\u0C4B \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.`,
    );
    return NextResponse.json({ ok: true });
  }

  const { data: officers } = await admin
    .from("mandal_officers")
    .select("name_en, name_te, role, role_te, phone")
    .eq("mandal_id", mandalData.id);

  const districtRel = mandalData.districts as
    | { name_en?: string }
    | { name_en?: string }[]
    | null;
  const districtName = Array.isArray(districtRel)
    ? districtRel[0]?.name_en || ""
    : districtRel?.name_en || "";

  if (!officers || officers.length === 0) {
    await replyText(
      chatId,
      `\u{1F4CD} <b>${mandalData.name_te || mandalData.name_en} (${districtName})</b>\n\n` +
        `\u0C08 \u0C2E\u0C02\u0C21\u0C32\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24 \u0C28\u0C3F\u0C2F\u0C3E\u0C2E\u0C15\u0C02 \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28\u0C32\u0C4B \u0C09\u0C02\u0C26\u0C3F.\n` +
        `\u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C15\u0C41 \u0C35\u0C46\u0C2C\u0C4D\u200C\u0C38\u0C3E\u0C1F\u0C4D \u0C1A\u0C42\u0C21\u0C02\u0C21\u0C3F: nayisamakhya.org`,
    );
    return NextResponse.json({ ok: true });
  }

  let reply =
    `\u{1F4CD} <b>${mandalData.name_te || mandalData.name_en} \u0C2E\u0C02\u0C21\u0C32 \u0C2A\u0C4D\u0C30\u0C24\u0C3F\u0C28\u0C3F\u0C27\u0C41\u0C32\u0C41:</b>\n\n`;
  officers.forEach((off, idx) => {
    const phoneDigits = String(off.phone || "").replace(/[^0-9]/g, "");
    reply +=
      `${idx + 1}. <b>${off.name_te || off.name_en}</b>\n` +
      `   \u0C39\u0C4B\u0C26\u0C3E: ${off.role_te || off.role}\n` +
      `   \u0C2B\u0C4B\u0C28\u0C4D: <a href="tel:${off.phone}">${off.phone}</a>\n` +
      `   \u0C35\u0C3E\u0C1F\u0C4D\u0C38\u0C3E\u0C2A\u0C4D: <a href="https://wa.me/91${phoneDigits}">\u0C1A\u0C3E\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F</a>\n\n`;
  });
  await replyText(chatId, reply);
  return NextResponse.json({ ok: true });
}

async function ingestPhoto(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  message: TelegramMessage,
  chatId: number,
): Promise<NextResponse> {
  const photos = message.photo || [];
  const best = [...photos].sort(
    (a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0),
  )[0];
  const fileId = best.file_id;
  const fileUniqueId = best.file_unique_id;
  const mediaGroupId = message.media_group_id
    ? String(message.media_group_id)
    : null;
  const caption = (message.caption || "").trim();
  const name = senderName(message.from);

  const { data: existing } = await admin
    .from("survey_submissions")
    .select("id")
    .eq("photo_file_unique_id", fileUniqueId)
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const fileMeta = await telegramApi("getFile", { file_id: fileId });
  const filePath = fileMeta?.result?.file_path as string | undefined;
  if (!filePath) {
    await replyText(
      chatId,
      "\u274C \u0C2B\u0C4B\u0C1F\u0C4B \u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C35\u0C3F\u0C2B\u0C32\u0C2E\u0C48\u0C02\u0C26\u0C3F. \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.",
    );
    return NextResponse.json({ ok: false, error: "getFile_failed" }, { status: 502 });
  }

  const fileRes = await fetch(
    `https://api.telegram.org/file/bot${botToken()}/${filePath}`,
  );
  if (!fileRes.ok) {
    await replyText(
      chatId,
      "\u274C \u0C2B\u0C4B\u0C1F\u0C4B \u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C35\u0C3F\u0C2B\u0C32\u0C2E\u0C48\u0C02\u0C26\u0C3F. \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.",
    );
    return NextResponse.json({ ok: false, error: "download_failed" }, { status: 502 });
  }
  const buffer = Buffer.from(await fileRes.arrayBuffer());
  const objectPath = `submissions/${fileUniqueId}.jpg`;

  const { error: uploadError } = await admin.storage
    .from("survey-photos")
    .upload(objectPath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError && !/already exists/i.test(uploadError.message)) {
    console.error("storage upload", uploadError);
    await replyText(
      chatId,
      "\u274C \u0C38\u0C4D\u0C1F\u0C4B\u0C30\u0C47\u0C1C\u0C4D \u0C05\u0C2A\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C35\u0C3F\u0C2B\u0C32\u0C2E\u0C48\u0C02\u0C26\u0C3F. \u0C24\u0C30\u0C4D\u0C35\u0C3E\u0C24 \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.",
    );
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 502 });
  }

  const { data: publicUrlData } = admin.storage
    .from("survey-photos")
    .getPublicUrl(objectPath);
  const photoUrl = publicUrlData.publicUrl;

  // Silent album batching: append to existing media_group row, no extra ack.
  if (mediaGroupId) {
    const { data: existingGroup } = await admin
      .from("survey_submissions")
      .select("id, photo_urls, raw_caption")
      .eq("media_group_id", mediaGroupId)
      .maybeSingle();

    if (existingGroup?.id) {
      const prevUrls = Array.isArray(existingGroup.photo_urls)
        ? existingGroup.photo_urls
        : [];
      await admin
        .from("survey_submissions")
        .update({
          photo_urls: [...prevUrls, photoUrl],
          last_activity_at: new Date().toISOString(),
          raw_caption: existingGroup.raw_caption || caption || null,
        })
        .eq("id", existingGroup.id);
      return NextResponse.json({ ok: true, album_append: true });
    }
  }

  const [{ data: districts }, { data: mandals }] = await Promise.all([
    admin.from("districts").select("id, slug, name_en, name_te"),
    admin.from("mandals").select("id, district_id, slug, name_en, name_te"),
  ]);

  const location = parseCaptionLocations(caption, districts || [], mandals || []);

  let gps: Array<{
    id: string;
    mandal_id: string;
    name_en: string;
    name_te: string;
  }> = [];
  if (location.mandal_id) {
    const { data: gpRows } = await admin
      .from("gram_panchayats")
      .select("id, mandal_id, name_en, name_te")
      .eq("mandal_id", location.mandal_id);
    gps = gpRows || [];
  }
  const refined = parseCaptionLocations(
    caption,
    districts || [],
    mandals || [],
    gps,
  );

  const status = refined.confidence === "none" ? "flagged" : "pending";

  const payload: Record<string, unknown> = {
    telegram_chat_id: String(chatId),
    telegram_message_id: String(message.message_id),
    sender_name: name,
    phone: null as string | null,
    district_id: refined.district_id || null,
    mandal_id: refined.mandal_id || null,
    gp_id: refined.gp_id || null,
    raw_caption: caption || null,
    extracted_data: {
      matched: refined.matched,
      confidence: refined.confidence,
      district_slug: refined.district_slug || null,
      mandal_slug: refined.mandal_slug || null,
      telegram_username: message.from?.username || null,
    },
    photo_url: photoUrl,
    photo_urls: [photoUrl],
    photo_file_unique_id: fileUniqueId,
    media_group_id: mediaGroupId,
    status,
    reminder_sent: false,
    last_activity_at: new Date().toISOString(),
  };

  let { data: inserted, error: insertError } = await admin
    .from("survey_submissions")
    .insert(payload)
    .select("id")
    .maybeSingle();

  // Retry without columns that may be missing on older schemas.
  if (insertError) {
    const msg = insertError.message || "";
    const legacy = { ...payload };
    if (/photo_urls/i.test(msg)) delete legacy.photo_urls;
    if (/media_group_id/i.test(msg)) delete legacy.media_group_id;
    if (/reminder_sent|last_activity_at/i.test(msg)) {
      delete legacy.reminder_sent;
      delete legacy.last_activity_at;
    }
    if (Object.keys(legacy).length !== Object.keys(payload).length) {
      ({ data: inserted, error: insertError } = await admin
        .from("survey_submissions")
        .insert(legacy)
        .select("id")
        .maybeSingle());
    }
  }

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("insert survey_submissions", insertError);
    await replyText(
      chatId,
      "\u274C \u0C28\u0C2E\u0C4B\u0C26\u0C41 \u0C35\u0C3F\u0C2B\u0C32\u0C2E\u0C48\u0C02\u0C26\u0C3F. \u0C24\u0C30\u0C4D\u0C35\u0C3E\u0C24 \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.",
    );
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }

  // For albums, only ack once (first photo creates the row).
  if (!caption) {
    await replyText(
      chatId,
      `\u2705 <b>\u0C2E\u0C40\u0C30\u0C41 \u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C2B\u0C4B\u0C1F\u0C4B(\u0C32\u0C41) \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C05\u0C02\u0C26\u0C3E\u0C2F\u0C3F!</b>\n\n` +
        `\u0C05\u0C2F\u0C3F\u0C24\u0C47 \u0C35\u0C40\u0C1F\u0C3F\u0C15\u0C3F \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C30\u0C3E\u0C32\u0C47\u0C26\u0C41. \u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C15\u0C4D\u0C30\u0C3F\u0C02\u0C26\u0C3F \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C38\u0C3F \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F:\n\n` +
        `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
        `\u{1F4CD} <b>\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E \u0C2A\u0C47\u0C30\u0C41:</b>\n` +
        `\u{1F3DB}\uFE0F <b>\u0C2E\u0C02\u0C21\u0C32\u0C02 / \u0C2A\u0C1F\u0C4D\u0C1F\u0C23\u0C02:</b>\n` +
        `\u{1F3E1} <b>\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C02 \u0C32\u0C47\u0C26\u0C3E \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C02:</b>\n` +
        `\u{1F4DD} <b>\u0C35\u0C3F\u0C37\u0C2F\u0C02 / \u0C38\u0C2E\u0C38\u0C4D\u0C2F:</b>\n` +
        `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
        `<i>(\u0C2E\u0C40\u0C15\u0C41 \u0C38\u0C2E\u0C2F\u0C02 \u0C32\u0C47\u0C15\u0C2A\u0C4B\u0C24\u0C47 \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C0A\u0C30\u0C41, \u0C2E\u0C02\u0C21\u0C32\u0C02 \u0C2A\u0C47\u0C30\u0C41 \u0C30\u0C3E\u0C38\u0C3F \u0C2A\u0C02\u0C2A\u0C3F\u0C28\u0C3E \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F.)</i>`,
    );
  } else {
    const reviewUrl = `${siteOrigin()}/admin/moderation?id=${inserted?.id || ""}`;
    await replyText(
      chatId,
      `\u2705 <b>\u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C41 \u0C28\u0C2E\u0C4B\u0C26\u0C2F\u0C4D\u0C2F\u0C3E\u0C2F\u0C3F!</b>\n` +
        `\u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28 \u0C05\u0C28\u0C02\u0C24\u0C30\u0C02 \u0C2E\u0C28 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C35\u0C46\u0C2C\u0C4D\u200C\u0C38\u0C3E\u0C1F\u0C4D (\u0C28\u0C3E\u0C2F\u0C3F\u0C38\u0C2E\u0C3E\u0C16\u0C4D\u0C2F.org) \u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C26\u0C30\u0C4D\u0C36\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41!`,
      {
        inline_keyboard: [[{ text: "\u{1F50E} Review / \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37", url: reviewUrl }]],
      },
    );
  }

  return NextResponse.json({
    ok: true,
    id: inserted?.id,
    status,
    confidence: refined.confidence,
  });
}

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  const header = req.headers.get("x-telegram-bot-api-secret-token");
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "webhook_secret_not_configured" },
      { status: 503 },
    );
  }
  if (header !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin || !botToken()) {
    return NextResponse.json(
      { ok: false, error: "telegram_or_supabase_not_configured" },
      { status: 503 },
    );
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  try {
    if (update.callback_query) {
      return await handleCallbackQuery(update.callback_query);
    }

    const message = update.message;
    if (!message?.chat?.id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const chatId = message.chat.id;
    const text = normalizeInboundText(message.text || "");
    const name = senderName(message.from);

    if (text && isGreeting(text)) {
      await sendWelcomeMenu(chatId, name);
      return NextResponse.json({ ok: true, menu: "welcome" });
    }

    if (text.toLowerCase().startsWith("/officer")) {
      return await handleOfficerLookup(admin, chatId, text);
    }

    if (message.photo && message.photo.length > 0) {
      return await ingestPhoto(admin, message, chatId);
    }

    // Follow-up text within 15 minutes links to the latest photo submission.
    if (text && !text.startsWith("/")) {
      const { data: recentSub } = await admin
        .from("survey_submissions")
        .select("id, raw_caption")
        .eq("telegram_chat_id", String(chatId))
        .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentSub?.id) {
        const updatedCaption = recentSub.raw_caption
          ? `${recentSub.raw_caption}\n\n${text}`
          : text;

        await admin
          .from("survey_submissions")
          .update({
            raw_caption: updatedCaption,
            reminder_sent: true,
            last_activity_at: new Date().toISOString(),
          })
          .eq("id", recentSub.id);

        await replyText(
          chatId,
          `\u2705 <b>\u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41 ${name} \u0C17\u0C3E\u0C30\u0C41!</b>\n` +
            `\u0C2E\u0C40\u0C30\u0C41 \u0C2A\u0C02\u0C2A\u0C3F\u0C28 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C2E\u0C41\u0C28\u0C41\u0C2A\u0C1F\u0C3F \u0C2B\u0C4B\u0C1F\u0C4B\u0C32\u0C15\u0C41 \u0C1C\u0C24\u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C4D\u0C21\u0C3E\u0C2F\u0C3F. \u0C2E\u0C3E \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C15\u0C30\u0C4D\u0C24\u0C32 \u0C2A\u0C30\u0C3F\u0C36\u0C40\u0C32\u0C28\u0C32\u0C4B\u0C15\u0C3F \u0C24\u0C40\u0C38\u0C41\u0C15\u0C4B\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.`,
        );
        return NextResponse.json({ ok: true, follow_up: true });
      }

      await sendWelcomeMenu(chatId, name);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: "no_photo" });
  } catch (err) {
    console.error("telegram webhook", err);
    return NextResponse.json({ ok: true });
  }
}

/** Telegram may probe with GET — acknowledge health without touching clients. */
export async function GET() {
  try {
    const hasBot = Boolean(botToken());
    const hasUrl = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT"),
    );
    const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
    return NextResponse.json({
      ok: true,
      service: "telegram-webhook",
      configured: hasBot && hasUrl && hasKey,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        service: "telegram-webhook",
        error: err instanceof Error ? err.message : "health_check_failed",
      },
      { status: 500 },
    );
  }
}
