"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createBrand, updateBrand } from "@/lib/brands";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SelectBrand } from "@/database/schema";

type BrandFormProps = {
    brand?: SelectBrand;
};

export default function BrandForm({ brand }: BrandFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            let result;
            if (brand) {
                // Edit mode
                result = await updateBrand(brand.id, formData);
            } else {
                // Create mode
                result = await createBrand(formData);
            }

            if (result.success) {
                form.reset();
                toast.success(
                    brand
                        ? "Brand updated successfully!"
                        : "Brand created successfully!"
                );
                router.push("/dashboard/brands");
            } else {
                toast.error(result.error || "Failed to save brand.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while saving the brand.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                        required
                        type="text"
                        name="name"
                        placeholder="Brand Name"
                        defaultValue={brand?.name}
                    />
                </div>
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : brand
                        ? "Update Brand"
                        : "Create Brand"}
                </Button>
            </form>
        </div>
    );
}
