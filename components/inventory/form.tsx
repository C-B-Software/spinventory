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
import { SelectCategory } from "@/database/schema";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createProduct } from "@/lib/products";
import { toast } from "react-toastify";

export default function InventoryForm({
    categories,
}: {
    categories: SelectCategory[];
}) {
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [subImages, setSubImages] = useState<string[]>([]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const result = await createProduct(formData);

            if (result.success) {
                form.reset(); // Reset form on success
                setMainImage(null);
                setSubImages([]);
                toast.success("Product created successfully!");
            } else {
                console.error("Failed to create product:", result.error);
                toast.error("Failed to create product.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while creating the product.");
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-5 flex-col">
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
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Description</Label>
                    <Textarea
                        required
                        name="description"
                        placeholder="Product Description"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Category</Label>
                    <Select required name="category">
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
                    <Label>Price</Label>
                    <Input
                        required
                        type="number"
                        name="price"
                        placeholder="Product Price"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Configuration</Label>
                    <Textarea
                        name="configuration"
                        placeholder="Product Configuration"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="terms">Front image</Label>{" "}
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
                                // Do something with the error.
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="terms">Sub images</Label>{" "}
                        <div className="flex gap-10 overflow-x-auto w-3/4 relative">
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
                                subImages.reverse().map((img, index) => (
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
                <Button type="submit" className="">
                    Create Product
                </Button>
            </form>
        </div>
    );
}
