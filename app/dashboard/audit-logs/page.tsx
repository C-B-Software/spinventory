import { DataTable } from "@/components/audit-logs/table";
import { getAuditLogs } from "@/lib/audit-log";
import { getProducts } from "@/lib/products";

export default async function Page() {
    const data = await getAuditLogs();

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
        </div>
    );
}
