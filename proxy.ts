import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

function isProtectedPath(pathname: string) {
  return pathname === "/submit" || pathname.startsWith("/platform") || pathname.startsWith("/api");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!env.hasSupabaseAuth) {
    if (pathname === "/submit" || pathname.startsWith("/platform")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      loginUrl.searchParams.set("error", "Supabase Auth is not configured for this environment.");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const { supabase, response } = updateSupabaseSession(request);
  if (!supabase) {
    return response;
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && (pathname === "/submit" || pathname.startsWith("/platform"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user && pathname.startsWith("/api") && request.method !== "GET") {
    return NextResponse.json(
      {
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication is required."
        }
      },
      { status: 401 }
    );
  }

  if (!user && pathname === "/api/profile") {
    return NextResponse.json(
      {
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication is required."
        }
      },
      { status: 401 }
    );
  }

  if (!isProtectedPath(pathname)) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/submit", "/platform/:path*", "/api/:path*"]
};
