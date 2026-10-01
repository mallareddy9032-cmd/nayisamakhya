/**
 * Pure admin session crypto + env helpers (Edge-safe — no next/headers).
 */

/** HTTP-only portal session cookie (7 days). */
export const ADMIN_SESSION_COOKIE = "admin_session";

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const SESSION_PREFIX = "nayi-admin-session-v1";

/** Domain separator for deriving HMAC key from existing ops secrets (not a PIN). */
const SESSION_DERIVE_PREFIX = "nayi-admin-session-hmac-v1";

/** Dev-only fallbacks — never used when NODE_ENV === "production". */
const DEV_PIN_FALLBACK = "nayi-local-admin-pin";
const DEV_SESSION_FALLBACK = "nayi-local-session-secret-dev-only";

/**
 * Prefer ADMIN_SECRET_PIN; else the desk unlock PIN already used in prod
 * (MODERATION_DESK_SECRET). Dev-only placeholder outside production.
 */
export function expectedAdminPin(): string {
  const pin =
    process.env.ADMIN_SECRET_PIN?.trim() ||
    process.env.MODERATION_DESK_SECRET?.trim() ||
    "";
  if (pin) return pin;
  if (process.env.NODE_ENV !== "production") return DEV_PIN_FALLBACK;
  return "";
}

/**
 * Existing project secrets that can back a derived session HMAC key when
 * ADMIN_SESSION_SECRET is unset. Order: desk → cron → Telegram webhook.
 * Values are never hardcoded production PINs — only env material.
 */
function existingOpsSecretMaterial(): string {
  return (
    process.env.MODERATION_DESK_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ||
    ""
  );
}

/**
 * Prefer ADMIN_SESSION_SECRET; else derive a domain-separated HMAC key from
 * well-known existing secrets so portal login works when only desk/cron
 * env is configured. Dev-only placeholder outside production.
 */
export function expectedSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim() || "";
  if (explicit) return explicit;

  const material = existingOpsSecretMaterial();
  if (material) return `${SESSION_DERIVE_PREFIX}:${material}`;

  if (process.env.NODE_ENV !== "production") return DEV_SESSION_FALLBACK;
  return "";
}

export function adminAuthConfigured(): boolean {
  return Boolean(expectedAdminPin() && expectedSessionSecret());
}

/** Constant-time string compare (works in Node + Edge; no node:crypto). */
export function timingSafeEqualString(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  const len = Math.max(bufA.length, bufB.length);
  let diff = bufA.length ^ bufB.length;
  for (let i = 0; i < len; i++) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC/SHA-256 session token: `{issuedAtMs}.{hexSig}` */
export async function createAdminSessionToken(
  sessionSecret = expectedSessionSecret(),
): Promise<string> {
  if (!sessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET_not_configured");
  }
  const issuedAt = String(Date.now());
  const sig = await hmacSha256Hex(
    sessionSecret,
    `${SESSION_PREFIX}:${issuedAt}`,
  );
  return `${issuedAt}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string,
  sessionSecret = expectedSessionSecret(),
): Promise<boolean> {
  if (!token || !sessionSecret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const issuedAt = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!issuedAt || !sig || !/^\d+$/.test(issuedAt)) return false;

  const ageMs = Date.now() - Number(issuedAt);
  if (
    !Number.isFinite(ageMs) ||
    ageMs < 0 ||
    ageMs > ADMIN_SESSION_MAX_AGE * 1000
  ) {
    return false;
  }

  const expected = await hmacSha256Hex(
    sessionSecret,
    `${SESSION_PREFIX}:${issuedAt}`,
  );
  return timingSafeEqualString(sig, expected);
}

export function adminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
