"use server";
import { db } from "@/database/connect";
import { categoriesTable, SelectCategory } from "@/database/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { categorySchema } from "@/validation/category";
import { logAuditEvent } from "./audit-log";
import { AuditLogAction } from "@/enums";
import { authorized } from "./security";

export async function getCategories(): Promise<SelectCategory[]> {
    await authorized();
    const categories = await db.select().from(categoriesTable);
    return categories;
}

export async function getCategory(id: number): Promise<SelectCategory | null> {
    await authorized();
    try {
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "Category ID must be a positive integer",
            })
            .parse(id);

        const [category] = await db
            .select()
            .from(categoriesTable)
            .where(eq(categoriesTable.id, validatedId))
            .orderBy(desc(categoriesTable.createdAt));
        return category || null;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid category ID:", error.issues);
            throw new Error("Invalid category ID provided");
        } else {
            console.error("Failed to fetch category:", error);
            throw new Error("Failed to fetch category");
        }
    }
}

export async function deleteCategory(id: number) {
    await authorized();
    try {
        await logAuditEvent(AuditLogAction.Delete, `category: ${id}`);
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "Category ID must be a positive integer",
            })
            .parse(id);

        await db
            .delete(categoriesTable)
            .where(eq(categoriesTable.id, validatedId));
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid category ID:", error.issues);
            throw new Error("Invalid category ID provided");
        } else {
            console.error("Failed to fetch category:", error);
            throw new Error("Failed to fetch category");
        }
    }
}

export async function createCategory(formData: FormData) {
    await authorized();
    try {
        await logAuditEvent(
            AuditLogAction.Create,
            `category: ${formData.get("name")}`
        );
        const name = formData.get("name") as string;
        const mainImageUrl = formData.get("image_url") as string;
        await db.insert(categoriesTable).values({
            name,
            imageUrl: mainImageUrl,
        });

        return { success: true, category: null };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

export async function updateCategory(id: number, formData: FormData) {
    await authorized();
    try {
        await logAuditEvent(AuditLogAction.Update, `category: ${id}`);

        const name = formData.get("name") as string;
        const mainImageUrl = formData.get("image_url") as string;

        await db
            .update(categoriesTable)
            .set({
                name,
                imageUrl: mainImageUrl,
            })
            .where(eq(categoriesTable.id, id));

        return { success: true, category: null };
    } catch (error) {
        console.error("Failed to update category:", error);
        return { success: false, error: "Failed to update category" };
    }
}
