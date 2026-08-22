import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "placementiq-dev-secret-key-change-in-production-12345";
const SESSION_COOKIE = "piq_session";

const PUBLIC_PATHS = ["/login", "/register"];

interface SessionPayload {
  sub: number;
  role: string;
}

function verify(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verify(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p);

  if (isPublic) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(session ? "/dashboard" : "/login", req.url));
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && session.role !== "admin" && session.role !== "placement_officer") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/assessment/:path*",
    "/results/:path*",
    "/skills/:path*",
    "/simulator/:path*",
    "/roadmap/:path*",
    "/prep/:path*",
    "/resume/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
