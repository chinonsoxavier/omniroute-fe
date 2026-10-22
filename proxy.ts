import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isSessionValid, readSessionToken } from "@/lib/auth";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value
  );
  const isAuthenticated = isSessionValid(session);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
