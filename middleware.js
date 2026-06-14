import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    cookies: {
      sessionToken: {
        name: "next-auth.session-token",
      },
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to the login page
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // Protect all other admin pages
        return token?.role === "admin";
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
