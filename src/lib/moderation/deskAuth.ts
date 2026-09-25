import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const DESK_COOKIE = "nayi_moderation_desk";

export function expectedDeskSecret() {
  return process.env.MODERATION_DESK_SECRET?.trim() || "";
}

export function deskAuthToken(secret: string) {
  return createHmac("sha256", secret)
    .update("nayi-moderation-desk-v1")
    .digest("hex");
}

/** When no desk secret is configured, allow only outside production. */
export function deskAuthRequired() {
  return Boolean(expectedDeskSecret()) || process.env.NODE_ENV === "production";
}

export async function isDeskUnlocked(): Promise<boolean> {
  const expected = expectedDeskSecret();
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }
  const jar = await cookies();
  const value = jar.get(DESK_COOKIE)?.value || "";
  return value === deskAuthToken(expected);
}
