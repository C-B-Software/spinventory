"use server";
import { db } from "@/database/connect";
import { notificationsTable, SelectNotification } from "@/database/schema";
import {
    NotificationAction,
    NotificationProvider,
    UserPermission,
} from "@/enums";
import { notificationSchema } from "@/validation/notification";
import { z } from "better-auth";
import { desc, eq } from "drizzle-orm";
import { authorized, hasPermissions } from "./security";

export async function getNotifications(): Promise<
    z.infer<typeof notificationSchema>[]
> {
    await authorized();
    await hasPermissions([UserPermission.ViewNotifications]);

    const notifications = await db
        .select()
        .from(notificationsTable)
        .orderBy(desc(notificationsTable.createdAt));
    return notifications;
}

export async function createNotification(
    data: FormData
): Promise<{ success: boolean; error?: string }> {
    await authorized();
    await hasPermissions([UserPermission.CreateNotification]);
    try {
        const content = data.get("content") as string;
        const provider = data.get("provider") as NotificationProvider;
        const action = data.get("action") as NotificationAction;
        if (!content || !provider) {
            return { success: false, error: "All fields are required." };
        }

        await db.insert(notificationsTable).values({
            content,
            provider,
            action,
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: "Failed to create notification." };
    }
}

export async function updateNotification(
    id: number,
    data: FormData
): Promise<{ success: boolean; error?: string }> {
    await authorized();
    await hasPermissions([UserPermission.UpdateNotification]);

    try {
        const content = data.get("content") as string;
        const provider = data.get("provider") as NotificationProvider;
        const action = data.get("action") as NotificationAction;

        if (!content || !provider) {
            return { success: false, error: "All fields are required." };
        }

        await db
            .update(notificationsTable)
            .set({
                content,
                provider,
                action,
            })
            .where(eq(notificationsTable.id, id));

        return { success: true };
    } catch (error) {
        console.error("Error updating notification:", error);
        return { success: false, error: "Failed to update notification." };
    }
}

export async function deleteNotification(
    id: number
): Promise<{ success: boolean; error?: string }> {
    await authorized();
    await hasPermissions([UserPermission.DeleteNotification]);
    try {
        await db
            .delete(notificationsTable)
            .where(eq(notificationsTable.id, id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting notification:", error);
        return { success: false, error: "Failed to delete notification." };
    }
}

export async function getNotification(
    id: number
): Promise<SelectNotification | null> {
    await authorized();
    await hasPermissions([
        UserPermission.UpdateNotification,
        UserPermission.ViewNotifications,
    ]);
    const notification = await db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.id, id))
        .limit(1)
        .then((res) => res[0] || null);
    return notification;
}
