// services/middlewareService.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/assessments/:path*",
    "/dashboard/:path*",
    "/counseling/:path*",
    "/complete-profile/:path*",
  ],
};