import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  expectedSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin/sessionAuth";

/** Server Components / Route Handlers — reads HTTP-only `admin_session`. */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const secret = expectedSessionSecret();
    if (!secret) return false;
    const jar = await cookies();
    const value = jar.get(ADMIN_SESSION_COOKIE)?.value || "";
    return verifyAdminSessionToken(value, secret);
  } catch {
    return false;
  }
}

export async function clearAdminSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(0),
    maxAge: 0,
  });
}
