import { DataTable } from "@/components/brands/table";
import { getBrands } from "@/lib/brands";

export default async function Page() {
    const data = await getBrands();

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
        </div>
    );
}
