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

type TelegramUpdate = {
  update_id?: number;
  message?: {
    message_id: number;
    caption?: string;
    text?: string;
    photo?: TelegramPhotoSize[];
    from?: { id: number; first_name?: string; last_name?: string; username?: string };
    chat?: { id: number };
  };
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
  return res.json().catch(() => null);
}

async function replyText(
  chatId: number | string,
  text: string,
  replyMarkup?: Record<string, unknown>,
) {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
  });
}

function senderName(from?: TelegramUpdate["message"] extends infer M
  ? M extends { from?: infer F }
    ? F
    : undefined
  : undefined) {
  if (!from || typeof from !== "object") return "Field enumerator";
  const f = from as {
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  const full = [f.first_name, f.last_name].filter(Boolean).join(" ").trim();
  return full || f.username || "Field enumerator";
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

  const message = update.message;
  if (!message?.chat?.id) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const chatId = message.chat.id;
  const photos = message.photo || [];
  if (!photos.length) {
    // Only photo submissions are ingested for Method 3.
    if (message.text) {
      await replyText(
        chatId,
        "📷 దయచేసి ఫోటోతో క్యాప్షన్ పంపండి (District / Mandal / GP).\nPlease send a photo with a caption including District / Mandal / GP.",
      );
    }
    return NextResponse.json({ ok: true, ignored: "no_photo" });
  }

  const best = [...photos].sort(
    (a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0),
  )[0];
  const fileId = best.file_id;
  const fileUniqueId = best.file_unique_id;

  // Duplicate photo guard
  const { data: existing } = await admin
    .from("survey_submissions")
    .select("id")
    .eq("photo_file_unique_id", fileUniqueId)
    .maybeSingle();

  if (existing?.id) {
    await replyText(
      chatId,
      "⚠️ ఈ ఫోటో ఇప్పటికే నమోదు చేయబడింది (This photo has already been submitted).",
    );
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    const fileMeta = await telegramApi("getFile", { file_id: fileId });
    const filePath = fileMeta?.result?.file_path as string | undefined;
    if (!filePath) {
      await replyText(chatId, "❌ ఫోటో డౌన్‌లోడ్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.");
      return NextResponse.json({ ok: false, error: "getFile_failed" }, { status: 502 });
    }

    const fileRes = await fetch(
      `https://api.telegram.org/file/bot${botToken()}/${filePath}`,
    );
    if (!fileRes.ok) {
      await replyText(chatId, "❌ ఫోటో డౌన్‌లోడ్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.");
      return NextResponse.json({ ok: false, error: "download_failed" }, { status: 502 });
    }
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const objectPath = `submissions/${fileUniqueId}.jpg`;

    const { error: uploadError } = await admin.storage
      .from("survey-photos")
      .upload(objectPath, buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError && !/already exists/i.test(uploadError.message)) {
      console.error("storage upload", uploadError);
      await replyText(chatId, "❌ స్టోరేజ్ అప్‌లోడ్ విఫలమైంది. తర్వాత ప్రయత్నించండి.");
      return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 502 });
    }

    const { data: publicUrlData } = admin.storage
      .from("survey-photos")
      .getPublicUrl(objectPath);
    const photoUrl = publicUrlData.publicUrl;

    const [{ data: districts }, { data: mandals }] = await Promise.all([
      admin.from("districts").select("id, slug, name_en, name_te"),
      admin.from("mandals").select("id, district_id, slug, name_en, name_te"),
    ]);

    const caption = message.caption || message.text || "";
    const location = parseCaptionLocations(
      caption,
      districts || [],
      mandals || [],
    );

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
    const name = senderName(message.from);

    const { data: inserted, error: insertError } = await admin
      .from("survey_submissions")
      .insert({
        telegram_chat_id: String(chatId),
        telegram_message_id: String(message.message_id),
        sender_name: name,
        phone: null,
        district_id: refined.district_id || null,
        mandal_id: refined.mandal_id || null,
        gp_id: refined.gp_id || null,
        raw_caption: caption || null,
        extracted_data: {
          matched: refined.matched,
          confidence: refined.confidence,
          district_slug: refined.district_slug || null,
          mandal_slug: refined.mandal_slug || null,
          telegram_username:
            (message.from as { username?: string } | undefined)?.username || null,
        },
        photo_url: photoUrl,
        photo_file_unique_id: fileUniqueId,
        status,
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      if (insertError.code === "23505") {
        await replyText(
          chatId,
          "⚠️ ఈ ఫోటో ఇప్పటికే నమోదు చేయబడింది (This photo has already been submitted).",
        );
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("insert survey_submissions", insertError);
      await replyText(chatId, "❌ నమోదు విఫలమైంది. తర్వాత ప్రయత్నించండి.");
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    }

    const reviewUrl = `${siteOrigin().replace(/\/$/, "")}/admin/moderation?id=${inserted?.id || ""}`;
    await replyText(
      chatId,
      "✅ ఫోటో విజయవంతంగా స్వీకరించబడింది!\nస్థితి: పరిశీలనలో ఉంది (Pending Review)",
      {
        inline_keyboard: [
          [
            {
              text: "🔎 Review / సమీక్ష",
              url: reviewUrl,
            },
          ],
        ],
      },
    );

    return NextResponse.json({
      ok: true,
      id: inserted?.id,
      status,
      confidence: refined.confidence,
    });
  } catch (err) {
    console.error("telegram webhook", err);
    await replyText(chatId, "❌ సర్వర్ లోపం. తర్వాత ప్రయత్నించండి.");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

/** Telegram may probe with GET — acknowledge health. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "telegram-webhook",
    configured: Boolean(botToken() && getSupabaseAdmin()),
  });
}
