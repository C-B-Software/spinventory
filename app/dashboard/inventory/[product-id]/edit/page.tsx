import InventoryForm from "@/components/inventory/form";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getProduct } from "@/lib/products";

export default async function Edit({
    params,
}: {
    params: Promise<{ "product-id": string }>;
}) {
    const resolvedParams = await params;
    const categories = await getCategories();
    const product = await getProduct(parseInt(resolvedParams["product-id"]));
    const brands = await getBrands();
    if (!product) return null;

    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <InventoryForm
                categories={categories}
                product={product}
                brands={brands}
            />
        </div>
    );
}
