import { DataTable } from "@/components/retours/table";
import { getRetours } from "@/lib/retours";

export default async function Page() {
    const data = await getRetours();
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <DataTable data={data} />
            </div>
        </div>
    );
}
