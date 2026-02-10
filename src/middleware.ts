import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const user = req.auth?.user as { role?: string } | undefined;

    // Admin routes: require ADMIN role
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
        }
        if (user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // Photographer/Resource dashboard: require PHOTOGRAPHER role
    if (pathname.startsWith("/dashboard")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
        }
        if (user.role !== "PHOTOGRAPHER") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // Vendor routes: require VENDOR role
    if (pathname.startsWith("/vendor")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
        }
        if (user.role !== "VENDOR") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // Checkout: require authenticated VENDOR
    if (pathname === "/checkout") {
        if (!user) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/checkout", req.url));
        }
        if (user.role !== "VENDOR") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
        "/vendor/:path*",
        "/checkout",
    ],
};
