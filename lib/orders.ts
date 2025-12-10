"use server";

import { db } from "@/database/connect";
import {
    customersTable,
    orderItemsTable,
    ordersTable,
} from "@/database/schema";
import {
    orderSchema,
    orderWithCustomerandOrderItemsSchema,
} from "@/validation/order";
import { z } from "zod";
import { eq, desc, asc } from "drizzle-orm";
import { authorized } from "./security";

export async function getOrders(): Promise<z.infer<typeof orderSchema>[]> {
    await authorized();
    const orders = await db
        .select()
        .from(ordersTable)
        .orderBy(desc(ordersTable.createdAt));
    return orders.reduce<z.infer<typeof orderSchema>[]>(
        (validOrders, order) => {
            const result = orderSchema.safeParse(order);
            if (result.success) {
                validOrders.push(result.data);
            } else {
                console.error("Invalid order data:", result.error);
            }
            return validOrders;
        },
        []
    );
}

export async function getOrdersWithCustomersAndOrderItems(): Promise<
    z.infer<typeof orderWithCustomerandOrderItemsSchema>[]
> {
    await authorized();
    const orders = await db
        .select()
        .from(ordersTable)
        .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
        .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
        .orderBy(desc(ordersTable.createdAt));

    return orders.reduce<
        z.infer<typeof orderWithCustomerandOrderItemsSchema>[]
    >((validOrders, order) => {
        const result = orderWithCustomerandOrderItemsSchema.safeParse(order);
        if (result.success) {
            validOrders.push(result.data);
        } else {
            console.error("Invalid order data:", result.error);
        }
        return validOrders;
    }, []);
    return [];
}
