import { getBrand } from "@/lib/brands";
import BrandForm from "@/components/brands/form";
export default async function Edit({
    params,
}: {
    params: Promise<{ "brand-id": string }>;
}) {
    const resolvedParams = await params;
    const brand = await getBrand(parseInt(resolvedParams["brand-id"]));
    if (!brand) return null;

    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <BrandForm brand={brand} />
        </div>
    );
}
