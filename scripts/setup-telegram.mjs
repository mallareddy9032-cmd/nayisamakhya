#!/usr/bin/env node
/**
 * Auto-detect TELEGRAM_CHAT_ID from the bot's latest group/channel update,
 * write it into gitignored .env.local, and ping the War Room with a Telugu
 * HTML confirmation.
 *
 * Prerequisites:
 *   1. Set TELEGRAM_BOT_TOKEN in .env.local (see .env.example)
 *   2. Add the bot to the War Room group / channel (admin optional but recommended)
 *   3. Send any message in that group so getUpdates can see the chat id
 *
 * Run:
 *   npm run setup:telegram
 *   # or: node --env-file=.env.local scripts/setup-telegram.mjs
 *
 * Notes:
 *   - Writes only TELEGRAM_CHAT_ID into .env.local (never commits secrets).
 *   - Desk dispatch still reads TELEGRAM_ADMIN_CHANNEL_ID; copy the detected
 *     id there in Vercel if you want live executive-desk forwarding.
 *   - If a webhook is already set, getUpdates is briefly enabled by clearing
 *     the webhook for this probe; re-run `npm run setup:method3` afterward
 *     if production webhook wiring is required.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_LOCAL = resolve(ROOT, ".env.local");
const ENV_FALLBACK = resolve(ROOT, ".env");

const TEST_MESSAGE =
  "🏛️ <b>నాయీ సమాఖ్య వార్ రూమ్ సిస్టమ్ సిద్ధమైంది!</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━\n" +
  "✅ టెలిగ్రామ్ అలర్ట్ డెస్క్ అనుసంధానమైంది.\n" +
  "📍 అన్ని 33 జిల్లాల సమాచారం ఇక్కడికి చేరుతుంది.";

/** Parse KEY=VALUE lines from a dotenv-style file into process.env (no overwrite). */
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(ENV_FALLBACK);
loadEnvFile(ENV_LOCAL);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";

function apiUrl(method) {
  return `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
}

async function telegram(method, body) {
  const opts = body
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    : { method: "GET" };
  const res = await fetch(apiUrl(method), opts);
  const json = await res.json().catch(() => ({}));
  return { httpOk: res.ok, status: res.status, json };
}

function upsertEnvLocal(key, value) {
  const line = `${key}=${value}`;
  let content = existsSync(ENV_LOCAL) ? readFileSync(ENV_LOCAL, "utf8") : "";
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) {
    content = content.replace(re, line);
  } else {
    const needsNewline = content.length > 0 && !content.endsWith("\n");
    content = `${content}${needsNewline ? "\n" : ""}${line}\n`;
  }
  writeFileSync(ENV_LOCAL, content, "utf8");
}

/**
 * Prefer the newest update that has a group/supergroup/channel chat.
 * Falls back to any chat.id on the latest message-bearing update.
 */
function extractChatFromUpdates(updates) {
  if (!Array.isArray(updates) || updates.length === 0) return null;

  const ranked = [];
  for (const update of updates) {
    const message =
      update.message ||
      update.channel_post ||
      update.edited_message ||
      update.edited_channel_post ||
      null;

    if (message?.chat?.id != null) {
      ranked.push({
        updateId: update.update_id,
        chat: message.chat,
        source: "message",
      });
      continue;
    }

    const memberChat =
      update.my_chat_member?.chat || update.chat_member?.chat || null;
    if (memberChat?.id != null) {
      ranked.push({
        updateId: update.update_id,
        chat: memberChat,
        source: "membership",
      });
    }
  }

  if (ranked.length === 0) return null;

  ranked.sort((a, b) => b.updateId - a.updateId);

  const groupTypes = new Set(["group", "supergroup", "channel"]);
  const groupHit = ranked.find((r) => groupTypes.has(r.chat.type));
  return groupHit || ranked[0];
}

function printNoMessagesHelp() {
  console.error(`
No Telegram updates found for this bot yet.

Do this first, then re-run:

  1. Open the War Room group (or channel) in Telegram
  2. Add the bot as a member (admin recommended for channels)
  3. Send any short test message in that group (e.g. "ping")
  4. npm run setup:telegram

Tip: if the bot already has a production webhook, this script clears it
temporarily so getUpdates can run. After setup, restore with:
  npm run setup:method3
`);
}

async function main() {
  console.log("NayiSamakhya — Telegram War Room setup");
  console.log("─────────────────────────────────────");

  if (!BOT_TOKEN) {
    console.error(
      "Missing TELEGRAM_BOT_TOKEN.\n" +
        "Add it to .env.local (gitignored), then re-run:\n" +
        "  TELEGRAM_BOT_TOKEN=123456:ABC-DEF\n" +
        "  npm run setup:telegram",
    );
    process.exit(1);
  }

  // Probe getMe first so bad tokens fail fast with a clear message.
  const me = await telegram("getMe");
  if (!me.json?.ok) {
    console.error(
      "Bot token rejected by Telegram getMe:",
      me.json?.description || `HTTP ${me.status}`,
    );
    process.exit(1);
  }
  const botUser = me.json.result?.username || "(unknown)";
  console.log(`Bot OK: @${botUser}`);

  let webhookCleared = false;
  let updatesRes = await telegram("getUpdates", { limit: 100, timeout: 0 });

  if (
    !updatesRes.json?.ok &&
    String(updatesRes.json?.description || "")
      .toLowerCase()
      .includes("webhook")
  ) {
    console.log(
      "Webhook is active — temporarily clearing it so getUpdates can run…",
    );
    const del = await telegram("deleteWebhook", { drop_pending_updates: false });
    if (!del.json?.ok) {
      console.error(
        "Could not clear webhook:",
        del.json?.description || `HTTP ${del.status}`,
      );
      process.exit(1);
    }
    webhookCleared = true;
    updatesRes = await telegram("getUpdates", { limit: 100, timeout: 0 });
  }

  if (!updatesRes.json?.ok) {
    console.error(
      "getUpdates failed:",
      updatesRes.json?.description || `HTTP ${updatesRes.status}`,
    );
    if (webhookCleared) {
      console.error(
        "Webhook was cleared for this probe — restore with: npm run setup:method3",
      );
    }
    process.exit(1);
  }

  const hit = extractChatFromUpdates(updatesRes.json.result || []);
  if (!hit) {
    printNoMessagesHelp();
    if (webhookCleared) {
      console.error(
        "Webhook was cleared for this probe — restore with: npm run setup:method3",
      );
    }
    process.exit(1);
  }

  const chatId = String(hit.chat.id);
  const title = hit.chat.title || hit.chat.username || hit.chat.first_name || "";
  const chatType = hit.chat.type || "unknown";

  console.log(`Detected Chat ID: ${chatId}`);
  console.log(`Chat type: ${chatType}${title ? ` · ${title}` : ""}`);
  console.log(`Source: latest ${hit.source} update (#${hit.updateId})`);

  upsertEnvLocal("TELEGRAM_CHAT_ID", chatId);
  console.log(`Updated ${ENV_LOCAL} → TELEGRAM_CHAT_ID=${chatId}`);

  const send = await telegram("sendMessage", {
    chat_id: chatId,
    text: TEST_MESSAGE,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  if (!send.json?.ok) {
    console.error(
      "Chat ID saved, but test sendMessage failed:",
      send.json?.description || `HTTP ${send.status}`,
    );
    console.error(
      "Ensure the bot can post in that chat (member + send permissions).",
    );
    if (webhookCleared) {
      console.error(
        "Webhook was cleared for this probe — restore with: npm run setup:method3",
      );
    }
    process.exit(1);
  }

  console.log("Test message sent to War Room (HTML parse_mode).");
  console.log("");
  console.log("Next:");
  console.log(
    "  • Mirror TELEGRAM_CHAT_ID into Vercel as TELEGRAM_ADMIN_CHANNEL_ID",
  );
  console.log("    if you want deskDispatch alerts on the same channel.");
  if (webhookCleared) {
    console.log(
      "  • Restore production webhook: npm run setup:method3",
    );
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error("setup-telegram failed:", err?.message || err);
  process.exit(1);
});
