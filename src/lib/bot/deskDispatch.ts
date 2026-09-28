/**
 * Executive desk dispatch — forward new field_submissions to admin Telegram channel.
 */

type TelegramApiFn = (
  method: string,
  body: Record<string, unknown>,
) => Promise<{ ok?: boolean; description?: string } | null>;

function adminChannelId(): string | null {
  const id = process.env.TELEGRAM_ADMIN_CHANNEL_ID?.trim();
  return id || null;
}

function siteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL?.trim()
      ? `https://${process.env.VERCEL_URL.trim().replace(/^https?:\/\//, "")}`
      : "https://www.nayisamakhya.org");
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

function formatDeskTimestamp(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("te-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

export type DeskDispatchPayload = {
  id: string;
  district: string | null;
  mandal: string | null;
  imageUrl: string | null;
  createdAt?: string;
};

/** Notify state coordination desk with thumbnail + quick review actions. */
export async function dispatchDeskAudit(
  telegramApi: TelegramApiFn,
  submission: DeskDispatchPayload,
): Promise<void> {
  const channelId = adminChannelId();
  if (!channelId) return;

  const ticketShort = submission.id.slice(0, 8);
  const district = submission.district?.trim() || "—";
  const mandal = submission.mandal?.trim() || "—";
  const formattedDate = formatDeskTimestamp(submission.createdAt);
  const origin = siteOrigin();

  const caption =
    `📋 <b>కొత్త ప్రజా వినతి / ఫీల్డ్ నమోదు (#${ticketShort})</b>\n` +
    `• జిల్లా: ${district}\n` +
    `• మండలం: ${mandal}\n` +
    `• సమయం: ${formattedDate}\n` +
    `• స్థితి: పెండింగ్ పరిశీలన`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve",
          callback_data: `admin_approve_${submission.id}`,
        },
        {
          text: "❌ Reject",
          callback_data: `admin_reject_${submission.id}`,
        },
      ],
      [
        {
          text: "🔍 Open Moderation Desk",
          url: `${origin}/admin/desk`,
        },
      ],
    ],
  };

  try {
    if (submission.imageUrl) {
      const photoResult = await telegramApi("sendPhoto", {
        chat_id: channelId,
        photo: submission.imageUrl,
        caption,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
      if (photoResult?.ok !== false) return;
      console.error("[DeskDispatch:PhotoFailed]", photoResult?.description);
    }

    await telegramApi("sendMessage", {
      chat_id: channelId,
      text: caption,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });
  } catch (err) {
    console.error("[DeskDispatch:Error]", err);
  }
}
