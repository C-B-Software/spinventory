"use server";
import { db } from "@/database/connect";
import { SelectUser, usersTable } from "@/database/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { userSchema } from "@/validation/user";
import { logAuditEvent } from "./audit-log";
import { AuditLogAction, UserPermission } from "@/enums";
import { authorized, hasPermissions } from "./security";

export async function getUsers(): Promise<SelectUser[]> {
    await authorized();
    await hasPermissions([UserPermission.ViewUsers]);
    const users = await db.select().from(usersTable);
    return users;
}

export async function getUser(id: string): Promise<SelectUser | null> {
    await authorized();
    await hasPermissions([
        UserPermission.ViewUsers,
        UserPermission.UpdateUsers,
    ]);
    try {
        const validatedId = z.string().parse(id);

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, validatedId))
            .orderBy(desc(usersTable.createdAt));
        return user || null;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid user ID:", error.issues);
            throw new Error("Invalid user ID provided");
        } else {
            console.error("Failed to fetch user:", error);
            throw new Error("Failed to fetch user");
        }
    }
}

export async function deleteUser(id: string) {
    await authorized();
    await hasPermissions([UserPermission.DeleteUsers]);
    try {
        await logAuditEvent(AuditLogAction.Delete, `user: ${id}`);
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "User ID must be a positive integer",
            })
            .parse(id);

        await db
            .delete(usersTable)
            .where(eq(usersTable.id, validatedId.toString()));
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid user ID:", error.issues);
            throw new Error("Invalid user ID provided");
        } else {
            console.error("Failed to fetch user:", error);
            throw new Error("Failed to fetch user");
        }
    }
}

export async function updateUser(id: string, formData: FormData) {
    await authorized();
    await hasPermissions([UserPermission.UpdateUsers]);
    try {
        await logAuditEvent(AuditLogAction.Update, `user: ${id}`);
        const name = formData.get("name") as string;
        const access = formData.get("access") as string;
        let permissions = formData.get("permissions") as
            | string
            | SelectUser["permissions"];
        permissions = String(permissions).split(
            ","
        ) as SelectUser["permissions"];

        await db
            .update(usersTable)
            .set({
                name,
                access: access ? true : false,
                permissions: permissions.filter((p) =>
                    Object.values(UserPermission).includes(p as UserPermission)
                ),
            })
            .where(eq(usersTable.id, String(id)));

        return { success: true, user: null };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, error: "Failed to update user" };
    }
}
