import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { logAuditEvent } from "./lib/audit-log";
import { AuditLogAction, UserPermission } from "./enums";
import { Auth, Session, User } from "better-auth";
import Access from "./configs/access";

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

    if (request.nextUrl.pathname.includes("/dashboard"))
        await logAuditEvent(AuditLogAction.View, request.nextUrl.pathname);

    const access = await pageAccess(request.nextUrl.pathname, {
        ...session.user,
        permissions: session.user.permissions.map(
            (perm) => perm as UserPermission
        ),
    });

    if (!access)
        return NextResponse.redirect(new URL("/dashboard", request.url));

    return NextResponse.next();
}

async function pageAccess(
    pathname: string,
    user: User & { permissions?: UserPermission[] }
) {
    let access = true;
    Access.pages.forEach((page) => {
        if (page.validation(pathname)) {
            const permissions = page.permissions || [];
            const userPermissions = user.permissions || [];
            const hasPermission = permissions.every((perm) =>
                userPermissions.includes(perm)
            );
            if (!hasPermission) {
                return (access = false);
            }
        }
    });
    return access;
}

export const config = {
    matcher: ["/dashboard/:path*", "/", "/dashboard"],
};
