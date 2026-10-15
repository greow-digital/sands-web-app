import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, SESSION_COOKIE } from "@/lib/growthship/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/growthship/login";
  const isSessionApi = pathname === "/api/growthship/session";
  if (isLoginPage || isSessionApi) return NextResponse.next();

  const authorized = await isAuthorized(req.cookies.get(SESSION_COOKIE)?.value);
  if (authorized) return NextResponse.next();

  if (pathname.startsWith("/api/growthship")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/growthship/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/growthship/:path*", "/api/growthship/:path*"],
};
