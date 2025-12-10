"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectBrand, SelectCategory, SelectProduct } from "@/database/schema";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createProduct, updateProduct } from "@/lib/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type ProductFormProps = {
    categories: SelectCategory[];
    brands: SelectBrand[];
    product?: SelectProduct;
};

export default function InventoryForm({
    categories,
    brands,
    product,
}: ProductFormProps) {
    const [mainImage, setMainImage] = useState<string | null>(
        product?.imageUrl ?? null
    );
    const [subImages, setSubImages] = useState<string[]>(
        product?.noneMainImagesUrl ? product.noneMainImagesUrl.split(",") : []
    );
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        // Add images to formData
        formData.set("image_url", mainImage ?? "");
        formData.set("images_url", subImages.join(","));

        try {
            let result;
            if (product) {
                // Edit mode
                result = await updateProduct(product.id, formData);
            } else {
                // Create mode
                result = await createProduct(formData);
            }

            if (result.success) {
                form.reset();
                if (!product) setMainImage(null);
                if (!product) setSubImages([]);
                toast.success(
                    product
                        ? "Product updated successfully!"
                        : "Product created successfully!"
                );
                router.push("/dashboard/inventory");
            } else {
                toast.error(result.error || "Failed to save product.");
            }
        } catch (error) {
            toast.error("An error occurred while saving the product.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className="grid xl:grid-cols-2 gap-5">
                <input
                    required
                    type="hidden"
                    value={mainImage ?? ""}
                    name="image_url"
                />
                <input
                    required
                    type="hidden"
                    value={subImages.join(",")}
                    name="images_url"
                />
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                        required
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        defaultValue={product?.name}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Category</Label>
                    <Select
                        required
                        name="category"
                        defaultValue={product?.categoryId.toString()}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Brand</Label>
                    <Select
                        name="brand"
                        defaultValue={product?.brandId?.toString()}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {brands.map((brand) => (
                                    <SelectItem
                                        key={brand.id}
                                        value={brand.id.toString()}
                                    >
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Price</Label>
                    <Input
                        required
                        type="number"
                        name="price"
                        placeholder="Product Price"
                        defaultValue={product?.price}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Description</Label>
                    <Textarea
                        required
                        name="description"
                        placeholder="Product Description"
                        defaultValue={product?.description}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Configuration</Label>
                    <Textarea
                        name="configuration"
                        placeholder="Product Configuration"
                        defaultValue={product?.configuration}
                    />
                </div>
                <div className="flex flex-col gap-3 col-span-2">
                    <Label htmlFor="terms">Front image</Label>
                    <div
                        style={{
                            backgroundImage: mainImage
                                ? `url(${mainImage})`
                                : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="h-[20rem] w-[20rem] border border-border rounded-lg flex items-center justify-center"
                    >
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                setMainImage(res[0].ufsUrl);
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-10 col-span-2">
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="terms">Sub images</Label>
                        <div className="flex gap-10 overflow-x-auto w-full relative">
                            <div className="h-[20rem] w-[20rem] border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        const arr = res.map((r) => r.ufsUrl);
                                        setSubImages((prev) => [
                                            ...prev,
                                            ...arr,
                                        ]);
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                            {subImages.length > 0 &&
                                [...subImages].reverse().map((img, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundImage: `url(${img})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                        className="h-[20rem] w-[20rem] border border-border rounded-lg flex items-center justify-center flex-shrink-0"
                                    />
                                ))}
                        </div>
                    </div>
                </div>
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : product
                        ? "Update Product"
                        : "Create Product"}
                </Button>
            </form>
        </div>
    );
}
