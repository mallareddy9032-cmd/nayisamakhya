import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin/sessionCookies";

export const DESK_COOKIE = "nayi_moderation_desk";

export function expectedDeskSecret() {
  return process.env.MODERATION_DESK_SECRET?.trim() || "";
}

/** Web Crypto hash — safe in Node and Edge, avoids `node:crypto` import issues. */
export async function deskAuthToken(secret: string) {
  const data = new TextEncoder().encode(`nayi-moderation-desk-v1:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** When no desk secret is configured, allow only outside production. */
export function deskAuthRequired() {
  return Boolean(expectedDeskSecret()) || process.env.NODE_ENV === "production";
}

/**
 * Desk unlock: legacy `nayi_moderation_desk` cookie OR portal `admin_session`
 * (Milestone 1) — one login at `/admin/login` unlocks moderation actions too.
 */
export async function isDeskUnlocked(): Promise<boolean> {
  try {
    if (await isAdminAuthenticated()) {
      return true;
    }
    const expected = expectedDeskSecret();
    if (!expected) {
      return process.env.NODE_ENV !== "production";
    }
    const jar = await cookies();
    const value = jar.get(DESK_COOKIE)?.value || "";
    return value === (await deskAuthToken(expected));
  } catch {
    return false;
  }
}
