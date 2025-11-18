import { z } from "zod";

export const productSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    name: z.string().min(1, "Product name is required"),
    imageUrl: z.string(),
    noneMainImagesUrl: z.string().nullable(),
    description: z.string().min(1, "Product description is required"),
    configuration: z.string().min(1, "Product configuration is required"),
    price: z.number().int().positive("Price must be a positive integer"),
    createdAt: z.date(),
    quantityInStock: z
        .number()
        .int()
        .min(0, "Quantity in stock cannot be negative"),
});
