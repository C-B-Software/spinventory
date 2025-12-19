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

export async function getRetours(): Promise<SelectRetour[]> {
    const retours = await db
        .select()
        .from(retoursTable)
        .orderBy(desc(retoursTable.createdAt));
    return retours;
}

export async function getRetourWithOrderAndItems(retourId: number) {
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
    await db.delete(retoursTable).where(eq(retoursTable.id, retourId));
}
