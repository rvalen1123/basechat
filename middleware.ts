import NextAuth from "next-auth";

import authConfig from "./auth.config";

// Wrapped middleware option. See https://authjs.dev/guides/edge-compatibility
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth && (req.nextUrl.pathname !== "/sign-in" &&
    req.nextUrl.pathname !== "/sign-up" &&
    req.nextUrl.pathname !== "/reset" &&
    req.nextUrl.pathname !== "/change-password" &&
    !req.nextUrl.pathname.startsWith("/api/auth/callback") &&
    !req.nextUrl.pathname.startsWith("/healthz"))) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    if (req.nextUrl.pathname !== "/") {
      newUrl.searchParams.set("redirectTo", req.nextUrl.toString());
    }
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
