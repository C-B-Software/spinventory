import { db } from "@/database/connect";
import * as schema from "@/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            access: {
                type: "boolean",
                nullable: false,
                input: false,
            },
            permissions: {
                type: "string[]",
                nullable: false,
                default: [],
                input: false,
            },
        },
    },
});

type Session = typeof auth.$Infer.Session;
