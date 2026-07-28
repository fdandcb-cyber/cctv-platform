import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Protect admin routes ───
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("connectz_token")?.value
      || request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: Full JWT verification happens server-side in API routes.
    // Proxy provides a fast first-pass check for the presence of a token.
  }

  // ─── Security headers for all routes ───
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  // Run proxy on all routes except static files and API
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|uploads).*)",
  ],
};
