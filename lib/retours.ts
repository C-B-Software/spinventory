"use server";

import { db } from "@/database/connect";
import {
    retoursTable,
    SelectRetour,
    ordersTable,
    customersTable,
    retourOrderItemsTable,
    orderItemsTable,
    productsTable,
} from "@/database/schema";
import { desc, eq, asc } from "drizzle-orm";
import { authorized, hasPermissions } from "./security";
import { AuditLogAction, UserPermission } from "@/enums";
import { logAuditEvent } from "./audit-log";

export async function getRetours(): Promise<SelectRetour[]> {
    await authorized();
    await hasPermissions([UserPermission.ViewRetours]);
    const retours = await db
        .select()
        .from(retoursTable)
        .orderBy(desc(retoursTable.createdAt));
    return retours;
}

export async function getRetourWithOrderAndItems(retourId: number) {
    await authorized();
    await hasPermissions([UserPermission.ViewRetours]);
    const retours = await db
        .select()
        .from(retoursTable)
        .leftJoin(ordersTable, eq(retoursTable.orderId, ordersTable.id))
        .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
        .where(eq(retoursTable.id, retourId));

    if (!retours || retours.length === 0) {
        return null;
    }

    const retourItems = await db
        .select()
        .from(retourOrderItemsTable)
        .leftJoin(
            orderItemsTable,
            eq(retourOrderItemsTable.orderItemId, orderItemsTable.id)
        )
        .leftJoin(
            productsTable,
            eq(orderItemsTable.productId, productsTable.id)
        )
        .where(eq(retourOrderItemsTable.retourId, retourId))
        .orderBy(asc(retourOrderItemsTable.id));

    const aggregatedRetour = {
        ...retours[0],
        retour_items: retourItems.map((item) => ({
            ...item.retour_order_items,
            order_item: item.order_items,
            product: item.products,
        })),
    };

    return aggregatedRetour;
}

export async function getRetoursWithOrdersAndItems() {
    await authorized();
    await hasPermissions([UserPermission.ViewRetours]);
    const retours = await db
        .select()
        .from(retoursTable)
        .leftJoin(ordersTable, eq(retoursTable.orderId, ordersTable.id))
        .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
        .leftJoin(
            retourOrderItemsTable,
            eq(retoursTable.id, retourOrderItemsTable.retourId)
        )
        .orderBy(desc(retoursTable.createdAt));

    return retours;
}

export async function deleteRetour(retourId: number): Promise<void> {
    await authorized();
    await hasPermissions([UserPermission.DeleteRetours]);
    await logAuditEvent(AuditLogAction.Delete, `retour: ${retourId}`);
    await db.delete(retoursTable).where(eq(retoursTable.id, retourId));
}

export async function createRetour(formData: FormData) {
    await authorized();
    await hasPermissions([UserPermission.CreateRetours]);
    try {
        await logAuditEvent(
            AuditLogAction.Create,
            `retour order: ${formData.get("order_id")}`
        );
        await db.insert(retoursTable).values({
            customerId: Number(formData.get("customer_id")), // Add customerId
            orderId: Number(formData.get("order_id")),
            reason: String(formData.get("reason")),
            note: String(formData.get("note") || ""),
        });
        return { success: true, retour: null };
    } catch (error) {
        console.error("Failed to create retour:", error);
        return { success: false, error: "Failed to create retour" };
    }
}

export async function updateRetour(retourId: number, formData: FormData) {
    await authorized();
    await hasPermissions([UserPermission.UpdateRetours]);
    try {
        await logAuditEvent(
            AuditLogAction.Update,
            `retour order: ${formData.get("order_id")}`
        );

        return { success: true, retour: null };
    } catch (error) {
        console.error("Failed to update retour:", error);
        return { success: false, error: "Failed to update retour" };
    }
}
