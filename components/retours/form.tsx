"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createBrand, updateBrand } from "@/lib/brands";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SelectBrand, SelectRetour } from "@/database/schema";
import { ordersWithCustomerandOrderItemsSchema } from "@/validation/order";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function RetourForm({
    retour,
    orders,
}: {
    retour?: SelectRetour;
    orders: z.infer<typeof ordersWithCustomerandOrderItemsSchema>[];
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            let result;
            if (retour) {
                // Edit mode
                result = await updateBrand(retour.id, formData);
            } else {
                // Create mode
                result = await createBrand(formData);
            }

            if (result.success) {
                form.reset();
                toast.success(
                    retour
                        ? "Retour updated successfully!"
                        : "Retour created successfully!"
                );
                router.push("/dashboard/retours");
            } else {
                toast.error(result.error || "Failed to save retour.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving the retour.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label>Order</Label>
                    <Select
                        required
                        name="category"
                        defaultValue={retour?.orderId.toString()}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {orders.map((order) => (
                                    <SelectItem
                                        key={order.orders.id}
                                        value={order.orders.id.toString()}
                                    >
                                        {order.orders.id} -{" "}
                                        {order.customers.email}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : retour
                        ? "Update Retour"
                        : "Create Retour"}
                </Button>
            </form>
        </div>
    );
}
