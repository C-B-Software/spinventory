"server only";
import { UserPermission } from "@/enums";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function authorized() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user.access) {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function hasPermissions(requiredPermissions: UserPermission[]) {
    const user = await getCurrentUser();
    const userPermissions = user.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
    );
    if (!hasPermission) {
        throw new Error("Forbidden action: " + requiredPermissions.join(", "));
    }
}
