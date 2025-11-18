"use server";

import { db } from "@/database/connect";
import { ordersTable } from "@/database/schema";
import { orderSchema } from "@/validation/order";
import { z } from "zod";

export async function getOrders(): Promise<z.infer<typeof orderSchema>[]> {
    const orders = await db.select().from(ordersTable);

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
