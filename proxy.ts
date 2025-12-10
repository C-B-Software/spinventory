import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { logAuditEvent } from "./lib/audit-log";
import { AuditLogAction } from "./enums";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (request.nextUrl.pathname === "/") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        request.nextUrl.pathname.includes("/dashboard") &&
        process.env.NODE_ENV === "production"
    )
        await logAuditEvent(AuditLogAction.View, request.nextUrl.pathname);

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/", "/dashboard"],
};
