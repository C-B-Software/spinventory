import { z } from "zod";

export const auditLogSchema = z.object({
    id: z.number(),
    userId: z.string(),
    action: z.string(),
    entity: z.string(),
});
