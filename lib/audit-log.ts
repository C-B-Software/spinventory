"use server";

import { db } from "@/database/connect";
import { auditLogsTable } from "@/database/schema";
import { AuditLogAction, UserPermission } from "@/enums";
import { headers } from "next/headers";
import { auth } from "./auth";
import { eq, lt, and, desc } from "drizzle-orm";
import { auditLogSchema } from "@/validation/auditLog";
import { z } from "better-auth";
import { authorized, hasPermissions } from "./security";

let lastCleanup = 0;
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

export async function logAuditEvent(action: AuditLogAction, entity: string) {
    await authorized();
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        await db.insert(auditLogsTable).values({
            action,
            entity,
            userId: session?.user?.id || "N/A",
        });

        const now = Date.now();
        if (now - lastCleanup > CLEANUP_INTERVAL) {
            lastCleanup = now;
            await db
                .delete(auditLogsTable)
                .where(
                    and(
                        lt(
                            auditLogsTable.createdAt,
                            new Date(now - 24 * 60 * 60 * 1000 * 7)
                        ),
                        eq(auditLogsTable.action, AuditLogAction.View)
                    )
                );
        }

        return { success: true, category: null };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

export async function getAuditLogs(): Promise<
    z.infer<typeof auditLogSchema>[]
> {
    await authorized();
    await hasPermissions([UserPermission.ViewAuditLogs]);
    const logs = await db
        .select()
        .from(auditLogsTable)
        .orderBy(desc(auditLogsTable.createdAt));
    return logs;
}
