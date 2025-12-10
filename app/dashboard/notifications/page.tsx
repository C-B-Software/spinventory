import { DataTable } from "@/components/notifications/table";
import { getNotifications } from "@/lib/notifications";

export default async function Page() {
    const data = await getNotifications();

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
        </div>
    );
}
