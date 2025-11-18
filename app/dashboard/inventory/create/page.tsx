import InventoryForm from "@/components/inventory/form";
import { getCategories } from "@/lib/categories";

export default async function Create() {
    const categories = await getCategories();
    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <InventoryForm categories={categories} />
        </div>
    );
}
