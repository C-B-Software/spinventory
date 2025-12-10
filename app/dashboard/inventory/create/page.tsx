import InventoryForm from "@/components/inventory/form";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";

export default async function Create() {
    const categories = await getCategories();
    const brands = await getBrands();
    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <InventoryForm categories={categories} brands={brands} />
        </div>
    );
}
