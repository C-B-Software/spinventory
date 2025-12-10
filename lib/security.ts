"server only";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function authorized() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user.access) {
        throw new Error("Unauthorized");
    }
    return session;
}
