import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  expectedSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin/sessionAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Portal pages under /admin/* except the login screen.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  const secret = expectedSessionSecret();

  // Portal gate inactive until ADMIN_SESSION_SECRET is set in production
  // (dev uses a local fallback secret). Avoid bricking legacy desks pre-env.
  if (!secret) {
    return NextResponse.next();
  }

  const ok = await verifyAdminSessionToken(token, secret);
  if (ok) {
    return NextResponse.next();
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("redirect", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
