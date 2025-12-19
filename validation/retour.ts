import { z } from "zod";

export const retourSchema = z.object({
    id: z.number(),
    productId: z.number(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    reason: z.string().min(1, "Reason is required"),
});
