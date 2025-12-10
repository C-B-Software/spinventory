"use server";
import { db } from "@/database/connect";
import { brandsTable, SelectBrand } from "@/database/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { logAuditEvent } from "./audit-log";
import { AuditLogAction } from "@/enums";
import { authorized } from "./security";

export async function getBrands(): Promise<SelectBrand[]> {
    await authorized();
    const brands = await db.select().from(brandsTable);
    return brands;
}

export async function getBrand(id: number): Promise<SelectBrand | null> {
    await authorized();
    try {
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "Brand ID must be a positive integer",
            })
            .parse(id);

        const [brand] = await db
            .select()
            .from(brandsTable)
            .where(eq(brandsTable.id, validatedId))
            .orderBy(desc(brandsTable.createdAt));
        return brand || null;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid brand ID:", error.issues);
            throw new Error("Invalid brand ID provided");
        } else {
            console.error("Failed to fetch brand:", error);
            throw new Error("Failed to fetch brand");
        }
    }
}

export async function deleteBrand(id: number) {
    await authorized();
    try {
        await logAuditEvent(AuditLogAction.Delete, `brand: ${id}`);
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "Brand ID must be a positive integer",
            })
            .parse(id);

        await db.delete(brandsTable).where(eq(brandsTable.id, validatedId));
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid brand ID:", error.issues);
            throw new Error("Invalid brand ID provided");
        } else {
            console.error("Failed to fetch brand:", error);
            throw new Error("Failed to fetch brand");
        }
    }
}

export async function createBrand(formData: FormData) {
    await authorized();
    try {
        await logAuditEvent(
            AuditLogAction.Create,
            `brand: ${formData.get("name")}`
        );
        const name = formData.get("name") as string;
        await db.insert(brandsTable).values({
            name,
        });

        return { success: true, brand: null };
    } catch (error) {
        console.error("Failed to create brand:", error);
        return { success: false, error: "Failed to create brand" };
    }
}

export async function updateBrand(id: number, formData: FormData) {
    await authorized();
    try {
        await logAuditEvent(AuditLogAction.Update, `brand: ${id}`);

        const name = formData.get("name") as string;

        await db
            .update(brandsTable)
            .set({
                name,
            })
            .where(eq(brandsTable.id, id));

        return { success: true, brand: null };
    } catch (error) {
        console.error("Failed to update brand:", error);
        return { success: false, error: "Failed to update brand" };
    }
}
