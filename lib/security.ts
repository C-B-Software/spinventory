"server only";
import { auth } from "./auth";
import { headers } from "next/headers";
import Access from "@/configs/access";

export async function authorized() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user.email || !Access.emails.includes(session.user.email)) {
        throw new Error("Unauthorized");
    }
    return session;
}
