import { getUser } from "@/lib/users";
import UserForm from "@/components/users/form";
export default async function Edit({
    params,
}: {
    params: Promise<{ "user-id": string }>;
}) {
    const resolvedParams = await params;
    const user = await getUser(resolvedParams["user-id"]);
    if (!user) return null;

    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <UserForm user={user} />
        </div>
    );
}
