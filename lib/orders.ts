"use server";

import { db } from "@/database/connect";
import {
    customersTable,
    orderItemsTable,
    ordersTable,
    productsTable,
} from "@/database/schema";
import {
    orderSchema,
    ordersWithCustomerandOrderItemsSchema,
    orderWithCustomerandOrderItemsSchema,
} from "@/validation/order";
import { z } from "zod";
import { eq, desc, asc } from "drizzle-orm";
import { authorized, hasPermissions } from "./security";
import { OrderStatus, UserPermission } from "@/enums";

export async function getOrders(): Promise<z.infer<typeof orderSchema>[]> {
    await authorized();
    await hasPermissions([UserPermission.ViewOrders]);
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
    z.infer<typeof ordersWithCustomerandOrderItemsSchema>[]
> {
    await authorized();
    await hasPermissions([UserPermission.ViewOrders]);
    const orders = await db
        .select()
        .from(ordersTable)
        .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
        .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
        .orderBy(desc(ordersTable.createdAt));

    return orders.reduce<
        z.infer<typeof ordersWithCustomerandOrderItemsSchema>[]
    >((validOrders, order) => {
        const result = ordersWithCustomerandOrderItemsSchema.safeParse(order);
        if (result.success) {
            validOrders.push(result.data);
        } else {
            console.error("Invalid order data:", result.error);
        }
        return validOrders;
    }, []);
}

export async function getOrderWithCustomerAndOrderItems(
    orderId: number
): Promise<z.infer<typeof orderWithCustomerandOrderItemsSchema> | null> {
    await authorized();
    await hasPermissions([UserPermission.ViewOrders]);

    const orders = await db
        .select()
        .from(ordersTable)
        .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id)) // Join customersTable
        .where(eq(ordersTable.id, orderId));

    if (!orders || orders.length === 0) {
        return null;
    }

    const orderItems = await db
        .select()
        .from(orderItemsTable)
        .leftJoin(
            productsTable,
            eq(orderItemsTable.productId, productsTable.id)
        )
        .where(eq(orderItemsTable.orderId, orderId))
        .orderBy(asc(orderItemsTable.id));

    const aggregatedOrder = {
        ...orders[0],
        order_items: orderItems.map((item) => ({
            ...item.order_items,
            product: item.products,
        })),
    };

    const result =
        orderWithCustomerandOrderItemsSchema.safeParse(aggregatedOrder);

    if (result.success) {
        return result.data;
    } else {
        console.error("Invalid order data:", result.error);
        return null;
    }
}

export async function updateOrder(
    orderId: number,
    data: FormData
): Promise<{ success: boolean; error?: string }> {
    await authorized();
    await hasPermissions([UserPermission.UpdateOrders]);

    try {
        const status = data.get("status") as OrderStatus;

        await db
            .update(ordersTable)
            .set({
                status,
            })
            .where(eq(ordersTable.id, orderId));

        return { success: true };
    } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, error: "Failed to update order." };
    }
}
