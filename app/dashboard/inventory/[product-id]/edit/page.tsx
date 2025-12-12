import InventoryForm from "@/components/inventory/form";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getLinkedProductIds, getProduct, getProducts } from "@/lib/products";

export default async function Edit({
    params,
}: {
    params: Promise<{ "product-id": string }>;
}) {
    const resolvedParams = await params;
    const categories = await getCategories();
    const product = await getProduct(parseInt(resolvedParams["product-id"]));
    const brands = await getBrands();
    const products = await getProducts();
    if (!product) return null;
    const linkedProducts = await getLinkedProductIds(product.id);

    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <InventoryForm
                categories={categories}
                product={product}
                brands={brands}
                products={products}
                linkedProducts={linkedProducts}
            />
        </div>
    );
}
