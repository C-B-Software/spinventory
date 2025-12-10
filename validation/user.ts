import { z } from "zod";

export const userSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "User name is required"),
});
