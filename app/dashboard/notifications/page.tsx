import { DataTable } from "@/components/notifications/table";
import WorkInProgress from "@/components/work-in-progress";
import { getNotifications } from "@/lib/notifications";

export default async function Page() {
    const data = await getNotifications();

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <WorkInProgress />

            <DataTable data={data} />
        </div>
    );
}
