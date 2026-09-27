import type { NextRequest } from "next/server";

/**
 * Auth for cron + broadcast routes.
 * Accepts (any one):
 * - Authorization: Bearer <CRON_SECRET | MODERATION_DESK_SECRET>
 * - x-cron-secret: <CRON_SECRET>
 * - x-desk-secret: <MODERATION_DESK_SECRET>
 * - Vercel Cron automatic Authorization: Bearer <CRON_SECRET>
 */
export function authorizeCronOrDesk(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim() || "";
  const deskSecret = process.env.MODERATION_DESK_SECRET?.trim() || "";

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ")
    ? auth.slice("Bearer ".length).trim()
    : "";
  const cronHeader = req.headers.get("x-cron-secret")?.trim() || "";
  const deskHeader = req.headers.get("x-desk-secret")?.trim() || "";

  if (cronSecret && (bearer === cronSecret || cronHeader === cronSecret)) {
    return true;
  }
  if (deskSecret && (bearer === deskSecret || deskHeader === deskSecret)) {
    return true;
  }

  // Local / preview convenience when secrets are unset.
  if (!cronSecret && !deskSecret && process.env.NODE_ENV !== "production") {
    return true;
  }

  return false;
}
