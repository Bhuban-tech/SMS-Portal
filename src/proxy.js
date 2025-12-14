// proxy.js
import { NextResponse } from "next/server";
import  { NextRequest } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // If not logged in → redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

// Only run proxy on these routes
export const config = {
  matcher: ["/login", "/dashboard/:path*", "/admin/:path*"],
};
