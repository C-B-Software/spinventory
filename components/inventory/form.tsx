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
import {
    SelectBrand,
    SelectCategory,
    SelectLinkedProduct,
    SelectProduct,
} from "@/database/schema";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createProduct, updateProduct } from "@/lib/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MultiSelect } from "../ui/multi-select";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Plus } from "lucide-react";

type ProductFormProps = {
    categories: SelectCategory[];
    brands: SelectBrand[];
    product?: SelectProduct;
    products: SelectProduct[];
    linkedProducts?: SelectLinkedProduct[];
};

export default function InventoryForm({
    categories,
    brands,
    product,
    products,
    linkedProducts,
}: ProductFormProps) {
    const [mainImage, setMainImage] = useState<string | null>(
        product?.imageUrl ?? null
    );
    const [subImages, setSubImages] = useState<string[]>(
        product?.noneMainImagesUrl
            ? JSON.parse(String(product?.noneMainImagesUrl)).map(
                  (url: string) => {
                      return url
                          .replaceAll("\\", "")
                          .replaceAll('"', "")
                          .replaceAll("[", "")
                          .replaceAll("]", "");
                  }
              )
            : []
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
                    <Label>Price</Label>
                    <Input
                        required
                        type="number"
                        name="price"
                        placeholder="Product Price"
                        defaultValue={product?.price}
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3 flex-1">
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
                    <Link
                        href="/dashboard/categories/create"
                        className="self-end text-sm text-primary underline"
                        target="_blank"
                        title="Add Category"
                    >
                        {" "}
                        <Button type="button">
                            <Plus />
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3 flex-1">
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
                    <Link
                        href="/dashboard/brands/create"
                        className="self-end text-sm text-primary underline"
                        target="_blank"
                        title="Add Brand"
                    >
                        {" "}
                        <Button type="button">
                            <Plus />
                        </Button>
                    </Link>
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
                <div className="flex flex-col gap-3">
                    <Label>Options Linking</Label>
                    <MultiSelect
                        name="linked_products"
                        options={products.map((p) => {
                            return { label: p.name, value: p.id.toString() };
                        })}
                        defaultSelected={
                            linkedProducts
                                ?.map((lp) => {
                                    const prod = products.find(
                                        (p) => p.id === lp.linkedProductId
                                    );
                                    return prod
                                        ? {
                                              label: prod.name,
                                              value: prod.id.toString(),
                                          }
                                        : null;
                                })
                                .filter(
                                    (
                                        item
                                    ): item is {
                                        label: string;
                                        value: string;
                                    } => item !== null
                                ) || []
                        }
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Stock</Label>
                    <Input
                        required
                        type="number"
                        name="quantity_in_stock"
                        placeholder="Quantity in Stock"
                        defaultValue={product?.quantityInStock}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Hidden</Label>
                    <Checkbox name="hidden" defaultChecked={product?.hidden} />
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
                                [...subImages]
                                    .reverse()
                                    .filter((url: string) => url != "")
                                    .map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSubImages((prev) =>
                                                    prev.filter(
                                                        (url) => url !== img
                                                    )
                                                );
                                            }}
                                            style={{
                                                backgroundImage: `url(${img})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                            className="h-[20rem] w-[20rem] border border-border rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity relative group"
                                        >
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                <span className="text-white font-semibold">
                                                    Click to remove
                                                </span>
                                            </div>
                                        </div>
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
