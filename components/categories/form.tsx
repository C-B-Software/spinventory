"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectCategory } from "@/database/schema";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createCategory, updateCategory } from "@/lib/categories";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type CategoryFormProps = {
    category?: SelectCategory;
};

export default function CategoryForm({ category }: CategoryFormProps) {
    const [mainImage, setMainImage] = useState<string | null>(
        category?.imageUrl ?? null
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

        try {
            let result;
            if (category) {
                // Edit mode
                result = await updateCategory(category.id, formData);
            } else {
                // Create mode
                result = await createCategory(formData);
            }

            if (result.success) {
                form.reset();
                if (!category) setMainImage(null);
                toast.success(
                    category
                        ? "Category updated successfully!"
                        : "Category created successfully!"
                );
                router.push("/dashboard/categories");
            } else {
                toast.error(result.error || "Failed to save category.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving the category.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                <input
                    required
                    type="hidden"
                    value={mainImage ?? ""}
                    name="image_url"
                />
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                        required
                        type="text"
                        name="name"
                        placeholder="Category Name"
                        defaultValue={category?.name}
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
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : category
                        ? "Update Category"
                        : "Create Category"}
                </Button>
            </form>
        </div>
    );
}
