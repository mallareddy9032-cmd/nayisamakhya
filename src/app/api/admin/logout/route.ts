import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
} from "@/lib/admin/sessionAuth";

export const runtime = "nodejs";

function clearSessionAndRespond(request: Request) {
  const accept = request.headers.get("accept") || "";
  const wantsJson =
    accept.includes("application/json") ||
    request.headers.get("x-requested-with") === "XMLHttpRequest" ||
    request.method === "POST";

  const url = new URL("/admin/login", request.url);

  if (wantsJson && request.method === "POST") {
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
      ...adminSessionCookieOptions(0),
      maxAge: 0,
    });
    return response;
  }

  const response = NextResponse.redirect(url);
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

export async function POST(request: Request) {
  return clearSessionAndRespond(request);
}

export async function GET(request: Request) {
  return clearSessionAndRespond(request);
}
