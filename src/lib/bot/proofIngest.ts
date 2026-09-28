/**
 * Telegram bot proof ingest helpers:
 * - highest-res photo / document download
 * - Supabase Storage upload (desk_proofs → survey-photos fallback)
 * - caption / session staging for incomplete uploads
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export const BOT_HELPLINE_WA = "+91 9032654111";

export const MSG = {
  photoReceivedNoCaption:
    "✅ మీ ఫోటో అందింది! దయచేసి దీనితో పాటు మీ జిల్లా, మండలం మరియు సమస్య వివరాలను టైప్ చేసి పంపండి. (ఉదా: సూర్యాపేట, కోదాడ, విద్యుత్ మీటర్ సమస్య)",
  success: (id: string) =>
    `✅ మీ వివరాలు మరియు ఫోటో అధికారిక పరిశీలన నిమిత్తం నమోదయ్యాయి. మీ రికార్డు ఐడీ: #${id}.`,
  validationIncomplete:
    "⚠️ వివరాలు అసంపూర్ణంగా ఉన్నాయి. దయచేసి మీ మండలం పేరు మరియు సమస్యను ఒకే మెసేజ్‌గా పంపండి.",
  criticalServer:
    `సర్వర్ అనుసంధానంలో సాంకేతిక సమస్య ఎదురైంది. దయచేసి మా సహాయవాణి ${BOT_HELPLINE_WA} కు నేరుగా వాట్సాప్ చేయండి.`,
  uploadRetry:
    "⚠️ ఫోటో సేవ్ కాలేదు. దయచేసి ఒకసారి మళ్లీ పంపండి (కాంప్రెస్ చేసిన జేపీజీ ఉత్తమం).",
  mediaDownloadFailed:
    "⚠️ ఫోటో డౌన్‌లోడ్ కాలేదు. దయచేసి కొత్త ఫోటోగా (compress/JPG) మళ్లీ పంపండి.",
  submitProofPrompt:
    "📸 దయచేసి ఫీల్డ్ ఫోటోను పంపండి. క్యాప్షన్‌లో జిల్లా, మండలం, సమస్య రాయండి — లేదా ఫోటో తర్వాత వివరాలు టైప్ చేయండి.",
} as const;

export const TG_FILE_PREFIX = "tg_file:";

export type ParsedProofCaption = {
  district: string | null;
  mandal: string | null;
  description: string;
  complete: boolean;
};

/** Split caption / follow-up text into district, mandal, remainder. */
export function parseProofCaption(raw: string): ParsedProofCaption {
  const text = (raw || "").trim();
  if (!text) {
    return { district: null, mandal: null, description: "", complete: false };
  }

  // Prefer comma / newline / pipe / " - " separators: "సూర్యాపేట, కోదాడ, విద్యుత్…"
  const parts = text
    .split(/[,|\n]+|(?:\s[-–—]\s)/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const district = parts[0] || null;
    const mandal = parts[1] || null;
    const description = parts.slice(2).join(", ").trim() || parts.slice(1).join(", ");
    const complete = Boolean(district && mandal && description.length >= 3);
    return { district, mandal, description, complete };
  }

  // Single blob — treat whole text as description; incomplete without location tokens.
  const hasLikelyLocation =
    /\u0c1c\u0c3f\u0c32\u0c4d\u0c32\u0c3e|\u0c2e\u0c02\u0c21\u0c32|district|mandal|suryapet|\u0c38\u0c42\u0c30\u0c4d\u0c2f\u0c3e\u0c2a\u0c47\u0c1f|kodad|\u0c15\u0c4b\u0c26\u0c3e\u0c21/i.test(
      text,
    );
  return {
    district: null,
    mandal: null,
    description: text,
    complete: hasLikelyLocation && text.length >= 8,
  };
}

export type DownloadedTelegramFile = {
  buffer: Buffer;
  contentType: string;
  fileUniqueId: string;
  fileId: string;
  ext: string;
};

type TelegramPhotoSize = {
  file_id: string;
  file_unique_id: string;
  width?: number;
  height?: number;
};

type TelegramDocument = {
  file_id: string;
  file_unique_id: string;
  mime_type?: string;
  file_name?: string;
};

type TelegramApiFn = (
  method: string,
  body: Record<string, unknown>,
) => Promise<{
  ok?: boolean;
  description?: string;
  result?: Record<string, unknown>;
} | null>;

const DEFAULT_SUPABASE_URL = "https://pvhnwoukpccgeoqdsevm.supabase.co";

/** Map Telegram/octet-stream responses to a bucket-allowed image MIME. */
export function normalizeProofContentType(
  contentType: string | null | undefined,
  ext?: string,
): string {
  const raw = (contentType || "").split(";")[0].trim().toLowerCase();
  const e = (ext || "").toLowerCase().replace(/^\./, "");

  if (raw === "image/jpeg" || raw === "image/jpg") return "image/jpeg";
  if (raw === "image/png") return "image/png";
  if (raw === "image/webp") return "image/webp";
  if (raw === "application/pdf") return "application/pdf";

  // Telegram file CDN often returns application/octet-stream for photos.
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  if (e === "pdf") return "application/pdf";
  return "image/jpeg";
}

/** Download binary from Telegram by file_id (used for deferred storage uploads). */
export async function downloadTelegramFileById(opts: {
  botToken: string;
  telegramApi: TelegramApiFn;
  fileId: string;
  fileUniqueId?: string;
  hintType?: string;
  ext?: string;
}): Promise<DownloadedTelegramFile | { error: string }> {
  const {
    botToken,
    telegramApi,
    fileId,
    fileUniqueId = "deferred",
    hintType = "image/jpeg",
    ext: hintExt = "jpg",
  } = opts;

  if (!fileId) return { error: "no_media" };

  const fileMeta = await telegramApi("getFile", { file_id: fileId });
  const filePath = fileMeta?.result?.file_path as string | undefined;
  if (!filePath) {
    console.error("[Bot:GetFileError]", { fileId, fileMeta });
    return { error: "getFile_failed" };
  }

  const fileRes = await fetch(
    `https://api.telegram.org/file/bot${botToken}/${filePath}`,
  );
  if (!fileRes.ok) {
    console.error("[Bot:DownloadError]", {
      status: fileRes.status,
      filePath,
    });
    return { error: "download_failed" };
  }

  const MAX = 10 * 1024 * 1024;
  const contentLength = Number(fileRes.headers.get("content-length") || 0);
  if (contentLength > MAX) return { error: "file_too_large" };

  const buffer = Buffer.from(await fileRes.arrayBuffer());
  if (buffer.byteLength > MAX) return { error: "file_too_large" };

  let ext = hintExt;
  const headerType =
    fileRes.headers.get("content-type") || hintType || "image/jpeg";
  if (headerType.includes("png") || hintExt === "png") ext = "png";
  else if (headerType.includes("webp") || hintExt === "webp") ext = "webp";
  else if (headerType.includes("pdf") || hintExt === "pdf") ext = "pdf";
  else if (
    headerType.includes("jpeg") ||
    headerType.includes("jpg") ||
    hintExt === "jpg" ||
    hintExt === "jpeg"
  ) {
    ext = "jpg";
  }

  // Never pass application/octet-stream upstream — Storage buckets reject it.
  const contentType = normalizeProofContentType(headerType, ext);

  return { buffer, contentType, fileUniqueId, fileId, ext };
}

/**
 * Pick highest-resolution photo or document and download binary from Telegram.
 */
export async function downloadTelegramMedia(opts: {
  botToken: string;
  telegramApi: TelegramApiFn;
  photo?: TelegramPhotoSize[];
  document?: TelegramDocument;
}): Promise<DownloadedTelegramFile | { error: string }> {
  const { botToken, telegramApi, photo, document } = opts;

  let fileId = "";
  let fileUniqueId = "";
  let hintType = "image/jpeg";
  let ext = "jpg";

  if (photo && photo.length > 0) {
    const best = [...photo].sort(
      (a, b) =>
        (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0),
    )[0];
    fileId = best.file_id;
    fileUniqueId = best.file_unique_id;
  } else if (document?.file_id) {
    fileId = document.file_id;
    fileUniqueId = document.file_unique_id;
    hintType = document.mime_type || "application/octet-stream";
    const name = document.file_name || "";
    const m = name.match(/\.([a-z0-9]+)$/i);
    ext = m?.[1]?.toLowerCase() || (hintType.includes("png") ? "png" : "jpg");
  } else {
    return { error: "no_media" };
  }

  return downloadTelegramFileById({
    botToken,
    telegramApi,
    fileId,
    fileUniqueId,
    hintType,
    ext,
  });
}

export type StorageUploadResult = {
  bucket: string;
  objectPath: string;
  publicUrl: string | null;
  error?: string;
};

function supabaseEnv(): { url: string; key: string } | null {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL
  ).replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key || url.includes("YOUR_PROJECT")) return null;
  return { url, key };
}

/** Direct Storage REST upload — more reliable than supabase-js Body in Node/Vercel. */
async function uploadViaStorageRest(
  bucket: string,
  objectPath: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<{ ok: true } | { ok: false; message: string; status: number }> {
  const env = supabaseEnv();
  if (!env) {
    return { ok: false, message: "supabase_env_missing", status: 0 };
  }

  // Prefer POST without upsert first (INSERT). Fall back to upsert.
  for (const upsert of [false, true] as const) {
    const res = await fetch(
      `${env.url}/storage/v1/object/${bucket}/${objectPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.key}`,
          apikey: env.key,
          "Content-Type": contentType || "image/jpeg",
          "x-upsert": upsert ? "true" : "false",
          "cache-control": "3600",
        },
        body: Buffer.from(bytes),
      },
    );

    if (res.ok) return { ok: true };

    const message = (await res.text().catch(() => "")).slice(0, 300);
    // Duplicate → treat as success if object already there.
    if (res.status === 400 && /already exists|Duplicate/i.test(message)) {
      return { ok: true };
    }
    console.error("[Bot:StorageRestError]", {
      bucket,
      objectPath,
      status: res.status,
      upsert,
      message,
    });
    if (!upsert) continue;
    return { ok: false, message, status: res.status };
  }
  return { ok: false, message: "upload_exhausted", status: 0 };
}

/**
 * Upload to survey-photos then desk_proofs via REST, with supabase-js fallback.
 */
export async function uploadProofToStorage(
  admin: SupabaseClient,
  opts: {
    buffer: Buffer;
    contentType: string;
    chatId: string | number;
    ext: string;
    fileUniqueId?: string;
  },
): Promise<StorageUploadResult> {
  const ts = Date.now();
  const safeExt = (opts.ext || "jpg").replace(/[^a-z0-9]/gi, "") || "jpg";
  const unique = (opts.fileUniqueId || "img")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 24);
  const objectPath = `submissions/${opts.chatId}_${ts}_${unique}.${safeExt}`;
  const buckets = ["survey-photos", "desk_proofs"] as const;
  const bytes = new Uint8Array(opts.buffer);
  // Telegram CDN often returns application/octet-stream — bucket allowlists reject it.
  const contentType = normalizeProofContentType(opts.contentType, safeExt);
  const errors: string[] = [];

  console.info("[Bot:StorageAttempt]", {
    bytes: bytes.byteLength,
    contentType,
    rawContentType: opts.contentType,
    ext: safeExt,
    supabaseHost: supabaseEnv()?.url?.replace(/^https?:\/\//, "").slice(0, 40),
    hasServiceKey: Boolean(supabaseEnv()?.key),
  });

  for (const bucket of buckets) {
    const rest = await uploadViaStorageRest(
      bucket,
      objectPath,
      bytes,
      contentType,
    );
    if (rest.ok) {
      const { data } = admin.storage.from(bucket).getPublicUrl(objectPath);
      const publicUrl = data?.publicUrl || null;
      if (publicUrl) {
        console.info("[Bot:StorageOk]", {
          bucket,
          objectPath,
          bytes: bytes.byteLength,
          via: "rest",
        });
        return { bucket, objectPath, publicUrl };
      }
      errors.push(`${bucket}:rest_ok_but_no_public_url`);
    } else {
      errors.push(`${bucket}:rest:${rest.status}:${rest.message}`);
    }

    // supabase-js fallback (no upsert — unique path each time)
    try {
      const { error } = await admin.storage.from(bucket).upload(objectPath, bytes, {
        contentType,
        upsert: false,
        cacheControl: "3600",
      });
      if (error && !/already exists/i.test(error.message || "")) {
        console.error("[Bot:StorageSdkError]", {
          bucket,
          message: error.message,
          statusCode: (error as { statusCode?: string }).statusCode,
        });
        errors.push(`${bucket}:sdk:${error.message}`);
        continue;
      }
      const { data } = admin.storage.from(bucket).getPublicUrl(objectPath);
      if (data?.publicUrl) {
        console.info("[Bot:StorageOk]", {
          bucket,
          objectPath,
          bytes: bytes.byteLength,
          via: "sdk",
        });
        return { bucket, objectPath, publicUrl: data.publicUrl };
      }
      errors.push(`${bucket}:sdk_no_public_url`);
    } catch (err) {
      console.error("[Bot:StorageSdkThrow]", { bucket, err });
      errors.push(
        `${bucket}:sdk_throw:${err instanceof Error ? err.message : "err"}`,
      );
    }
  }

  return {
    bucket: "survey-photos",
    objectPath,
    publicUrl: null,
    error: `all_buckets_failed:${errors.join("|")}`,
  };
}

/** Upsert a pending upload session (awaiting caption / follow-up text). */
export async function stageUploadSession(
  admin: SupabaseClient,
  row: {
    chat_id: string;
    user_id?: string | null;
    image_url: string | null;
    object_path?: string | null;
    storage_bucket?: string | null;
    photo_file_unique_id?: string | null;
    sender_name?: string | null;
    intent?: string;
  },
): Promise<{ id: string | null; error?: string }> {
  try {
    // Replace any prior open session for this chat (intent-only or stale photo).
    await admin.from("bot_upload_sessions").delete().eq("chat_id", row.chat_id);

    const { data, error } = await admin
      .from("bot_upload_sessions")
      .insert({
        chat_id: row.chat_id,
        user_id: row.user_id || null,
        image_url: row.image_url,
        object_path: row.object_path || null,
        storage_bucket: row.storage_bucket || null,
        photo_file_unique_id: row.photo_file_unique_id || null,
        sender_name: row.sender_name || null,
        intent: row.intent || "submit_proof",
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("[Bot:SessionStageError]", error);
      return { id: null, error: error.message };
    }
    return { id: data?.id || null };
  } catch (err) {
    console.error("[Bot:SessionStageError]", err);
    return { id: null, error: "session_stage_failed" };
  }
}

export async function getActiveUploadSession(
  admin: SupabaseClient,
  chatId: string,
): Promise<{
  id: string;
  image_url: string | null;
  photo_file_unique_id: string | null;
  sender_name: string | null;
  object_path: string | null;
  storage_bucket: string | null;
} | null> {
  const { data, error } = await admin
    .from("bot_upload_sessions")
    .select(
      "id, image_url, photo_file_unique_id, sender_name, object_path, storage_bucket",
    )
    .eq("chat_id", chatId)
    .gte("expires_at", new Date().toISOString())
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[Bot:SessionLookupError]", error);
    return null;
  }
  return data;
}

export async function clearUploadSession(
  admin: SupabaseClient,
  sessionId: string,
): Promise<void> {
  const { error } = await admin
    .from("bot_upload_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) console.error("[Bot:SessionClearError]", error);
}

export async function markSubmitProofIntent(
  admin: SupabaseClient,
  chatId: string,
  userId?: string | null,
): Promise<void> {
  await stageUploadSession(admin, {
    chat_id: chatId,
    user_id: userId || null,
    image_url: null,
    intent: "submit_proof",
  });
}

export type FieldInsertResult = {
  id: string | null;
  error?: string;
};

/** Insert a pending field_submissions row (image_url may be null). */
export async function insertFieldSubmission(
  admin: SupabaseClient,
  row: {
    user_id?: string | null;
    chat_id: string;
    image_url?: string | null;
    district?: string | null;
    mandal?: string | null;
    description?: string | null;
    status?: string;
    photo_file_unique_id?: string | null;
    telegram_message_id?: string | null;
    sender_name?: string | null;
    survey_submission_id?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<FieldInsertResult> {
  try {
    const { data, error } = await admin
      .from("field_submissions")
      .insert({
        user_id: row.user_id || null,
        chat_id: row.chat_id,
        image_url: row.image_url ?? null,
        district: row.district || null,
        mandal: row.mandal || null,
        description: row.description || null,
        status: row.status || "pending",
        photo_file_unique_id: row.photo_file_unique_id || null,
        telegram_message_id: row.telegram_message_id || null,
        sender_name: row.sender_name || null,
        survey_submission_id: row.survey_submission_id || null,
        metadata: row.metadata || {},
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { id: null, error: "duplicate" };
      }
      console.error("[Bot:FieldInsertError]", error);
      return { id: null, error: error.message };
    }
    return { id: data?.id || null };
  } catch (err) {
    console.error("[Bot:FieldInsertError]", err);
    return { id: null, error: "insert_failed" };
  }
}
