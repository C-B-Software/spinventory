import { z } from "zod";

export const brandSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Brand name is required"),
});
