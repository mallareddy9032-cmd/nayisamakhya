/**
 * Conversational multi-step state machine for @NayiSamakhyaDeskBot.
 * Persists in bot_upload_sessions (image_url = staged_photo_url).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type BotSessionStep = "IDLE" | "AWAITING_DETAILS";

export type BotSession = {
  id: string;
  chat_id: string;
  step: BotSessionStep;
  staged_photo_url: string | null;
  staged_district: string | null;
  object_path: string | null;
  storage_bucket: string | null;
  photo_file_unique_id: string | null;
  sender_name: string | null;
  user_id: string | null;
  created_at: string;
};

const SESSION_SELECT =
  "id, chat_id, step, image_url, staged_district, object_path, storage_bucket, photo_file_unique_id, sender_name, user_id, created_at";

function mapRow(row: Record<string, unknown>): BotSession {
  const stepRaw = String(row.step || "IDLE");
  const step: BotSessionStep =
    stepRaw === "AWAITING_DETAILS" ? "AWAITING_DETAILS" : "IDLE";
  return {
    id: String(row.id),
    chat_id: String(row.chat_id),
    step,
    staged_photo_url: (row.image_url as string | null) ?? null,
    staged_district: (row.staged_district as string | null) ?? null,
    object_path: (row.object_path as string | null) ?? null,
    storage_bucket: (row.storage_bucket as string | null) ?? null,
    photo_file_unique_id: (row.photo_file_unique_id as string | null) ?? null,
    sender_name: (row.sender_name as string | null) ?? null,
    user_id: (row.user_id as string | null) ?? null,
    created_at: String(row.created_at || new Date().toISOString()),
  };
}

/** Load the active non-expired session for a chat, if any. */
export async function getBotSession(
  admin: SupabaseClient,
  chatId: string,
): Promise<BotSession | null> {
  const { data, error } = await admin
    .from("bot_upload_sessions")
    .select(SESSION_SELECT)
    .eq("chat_id", chatId)
    .gte("expires_at", new Date().toISOString())
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[BotSession:LookupError]", error);
    return null;
  }
  if (!data) return null;
  return mapRow(data as Record<string, unknown>);
}

/** Replace prior session and stage photo awaiting district / details. */
export async function stagePhotoSession(
  admin: SupabaseClient,
  row: {
    chat_id: string;
    user_id?: string | null;
    staged_photo_url: string | null;
    object_path?: string | null;
    storage_bucket?: string | null;
    photo_file_unique_id?: string | null;
    sender_name?: string | null;
    staged_district?: string | null;
  },
): Promise<{ id: string | null; error?: string }> {
  try {
    await admin.from("bot_upload_sessions").delete().eq("chat_id", row.chat_id);

    const { data, error } = await admin
      .from("bot_upload_sessions")
      .insert({
        chat_id: row.chat_id,
        user_id: row.user_id || null,
        image_url: row.staged_photo_url,
        object_path: row.object_path || null,
        storage_bucket: row.storage_bucket || null,
        photo_file_unique_id: row.photo_file_unique_id || null,
        sender_name: row.sender_name || null,
        staged_district: row.staged_district || null,
        step: "AWAITING_DETAILS",
        intent: "submit_proof",
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("[BotSession:StageError]", error);
      return { id: null, error: error.message };
    }
    return { id: data?.id || null };
  } catch (err) {
    console.error("[BotSession:StageError]", err);
    return { id: null, error: "session_stage_failed" };
  }
}

/** Mark intent-only session (/submit_proof) before photo arrives. */
export async function markIdleSubmitIntent(
  admin: SupabaseClient,
  chatId: string,
  userId?: string | null,
): Promise<void> {
  try {
    await admin.from("bot_upload_sessions").delete().eq("chat_id", chatId);
    await admin.from("bot_upload_sessions").insert({
      chat_id: chatId,
      user_id: userId || null,
      image_url: null,
      step: "IDLE",
      intent: "submit_proof",
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[BotSession:IntentError]", err);
  }
}

/** Persist district from inline keyboard; remain AWAITING_DETAILS. */
export async function updateSessionDistrict(
  admin: SupabaseClient,
  sessionId: string,
  district: string,
): Promise<boolean> {
  const { error } = await admin
    .from("bot_upload_sessions")
    .update({
      staged_district: district,
      step: "AWAITING_DETAILS",
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("[BotSession:DistrictUpdateError]", error);
    return false;
  }
  return true;
}

/** Clear session back to IDLE (delete row). */
export async function resetBotSession(
  admin: SupabaseClient,
  sessionId: string,
): Promise<void> {
  const { error } = await admin
    .from("bot_upload_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) console.error("[BotSession:ResetError]", error);
}

/** District picker inline keyboard (Case B). */
export function districtPickerKeyboard(): {
  inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
} {
  return {
    inline_keyboard: [
      [
        {
          text: "సూర్యాపేట (Suryapet)",
          callback_data: "callback_dist_suryapet",
        },
        {
          text: "రంగారెడ్డి (Rangareddy)",
          callback_data: "callback_dist_rangareddy",
        },
      ],
      [
        {
          text: "హైదరాబాద్ (Hyderabad)",
          callback_data: "callback_dist_hyderabad",
        },
        { text: "ఇతర జిల్లాలు", callback_data: "callback_dist_other" },
      ],
    ],
  };
}

export const DISTRICT_CALLBACK_LABELS: Record<string, string> = {
  callback_dist_suryapet: "Suryapet",
  callback_dist_rangareddy: "Rangareddy",
  callback_dist_hyderabad: "Hyderabad",
  callback_dist_other: "Other",
};

export const MSG_DISTRICT_STAGED =
  "✅ మీ ఫోటో సమర్పణ నమోదైంది!\nదయచేసి మీ జిల్లాను ఎంచుకోండి:";

export const MSG_AFTER_DISTRICT = (district: string) =>
  `✅ <b>${district}</b> జిల్లా నమోదైంది.\n\n` +
  `దయచేసి మీ <b>మండలం</b> మరియు <b>సమస్య వివరాలు</b> ఒకే మెసేజ్‌లో పంపండి.\n` +
  `(ఉదా: కోదాడ, విద్యుత్ మీటర్ సమస్య)`;

export const MSG_OTHER_DISTRICT =
  "✅ దయచేసి మీ <b>జిల్లా, మండలం, సమస్య</b> వివరాలను ఒకే మెసేజ్‌లో టైప్ చేసి పంపండి.\n" +
  "(ఉదా: సూర్యాపేట, కోదాడ, విద్యుత్ మీటర్ సమస్య)";
