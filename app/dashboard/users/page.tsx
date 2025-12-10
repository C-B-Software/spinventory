import { DataTable } from "@/components/users/table";
import { getUsers } from "@/lib/users";

export default async function Page() {
    const data = await getUsers();

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
        </div>
    );
}
