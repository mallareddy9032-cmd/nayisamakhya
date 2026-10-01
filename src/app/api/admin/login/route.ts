import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminAuthConfigured,
  adminSessionCookieOptions,
  createAdminSessionToken,
  expectedAdminPin,
  expectedSessionSecret,
  timingSafeEqualString,
} from "@/lib/admin/sessionAuth";

export const runtime = "nodejs";

const INVALID_PIN_MESSAGE =
  "తప్పుడు పాస్‌వర్డ్ / Invalid Admin Security PIN";

const NOT_CONFIGURED_MESSAGE =
  "సర్వర్ అడ్మిన్ లాగిన్ సెటప్ కాలేదు / Admin auth is not configured. Set ADMIN_SECRET_PIN (or MODERATION_DESK_SECRET) and ADMIN_SESSION_SECRET on Vercel, then redeploy.";

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      {
        success: false,
        code: "not_configured",
        error: NOT_CONFIGURED_MESSAGE,
      },
      { status: 503 },
    );
  }

  let pin = "";
  try {
    const body = (await request.json()) as { pin?: unknown };
    pin = typeof body.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: "invalid_pin",
        error: INVALID_PIN_MESSAGE,
      },
      { status: 401 },
    );
  }

  const expected = expectedAdminPin();
  if (!timingSafeEqualString(pin.trim(), expected)) {
    return NextResponse.json(
      {
        success: false,
        code: "invalid_pin",
        error: INVALID_PIN_MESSAGE,
      },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken(expectedSessionSecret());
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    ...adminSessionCookieOptions(ADMIN_SESSION_MAX_AGE),
  });
  return response;
}
