import { z } from "zod";
import { OrderStatus, DeliveryMethod } from "@/enums";
import { productSchema } from "./product";

export const orderSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    invoiceId: z.string().nullable(),
    deliveryMethod: z.enum([DeliveryMethod.Delivery, DeliveryMethod.Pickup]),
    status: z
        .enum([
            OrderStatus.Cancelled,
            OrderStatus.Paid,
            OrderStatus.Pending,
            OrderStatus.Processing,
            OrderStatus.Shipped,
            OrderStatus.Finished,
        ])
        .nullable(),
    deliveryCountry: z.string().nullable(),
    deliveryFirstname: z.string().nullable(),
    deliveryLastname: z.string().nullable(),
    deliveryCompany: z.string().nullable(),
    deliveryAddress: z.string().nullable(),
    deliveryPostalcode: z.string().nullable(),
    deliveryCity: z.string().nullable(),
    deliveryPhonenumber: z.string().nullable(),
    invoiceCountry: z.string(),
    invoiceFirstname: z.string(),
    invoiceLastname: z.string(),
    invoiceCompany: z.string().nullable(),
    invoiceCOCNumber: z.string().nullable(),
    invoiceAddress: z.string(),
    invoicePostalcode: z.string(),
    invoiceCity: z.string(),
    invoicePhonenumber: z.string().nullable(),
    createdAt: z.date(),
});

export const customerSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    deliveryMethod: z.string(),
    deliveryCountry: z.string().nullable(),
    deliveryFirstname: z.string().nullable(),
    deliveryLastname: z.string().nullable(),
    deliveryCompany: z.string().nullable(),
    deliveryAddress: z.string().nullable(),
    deliveryPostalcode: z.string().nullable(),
    deliveryCity: z.string().nullable(),
    deliveryPhonenumber: z.string().nullable(),
    invoiceCountry: z.string(),
    invoiceFirstname: z.string(),
    invoiceLastname: z.string(),
    invoiceCompany: z.string().nullable(),
    invoiceCOCNumber: z.string().nullable(),
    invoiceAddress: z.string(),
    invoicePostalcode: z.string(),
    invoiceCity: z.string(),
    invoicePhonenumber: z.string().nullable(),
    createdAt: z.date(),
});

export const ordersWithCustomerandOrderItemsSchema = z.object({
    orders: orderSchema,
    customers: customerSchema,
    order_items: z.any().nullable(),
});

export const orderWithCustomerandOrderItemsSchema = z.object({
    orders: orderSchema,
    customers: customerSchema,
    order_items: z.any().nullable(),
});
