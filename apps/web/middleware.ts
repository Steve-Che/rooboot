import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/workflow/:path*",
    "/store/:path*",
    "/maintenance/:path*",
    "/inspections/:path*",
    "/devices/:path*",
    "/marketplace/:path*",
  ],
};

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const pathname = req.nextUrl.pathname;

    const storeRoutes = ["/store", "/maintenance"];
    const technicianRoutes = ["/inspections"];

    if (
      storeRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      !["store_owner", "operator"].includes(role ?? "")
    ) {
      return NextResponse.redirect(new URL("/workflow", req.url));
    }

    if (
      technicianRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      !["technician", "store_owner", "operator"].includes(role ?? "")
    ) {
      return NextResponse.redirect(new URL("/workflow", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);
