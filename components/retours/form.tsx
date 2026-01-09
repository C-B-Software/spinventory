"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createRetour, updateRetour } from "@/lib/retours";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SelectBrand, SelectProduct, SelectRetour } from "@/database/schema";
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
import { Textarea } from "../ui/textarea";
import { Order } from "@/types";

export default function RetourForm({
    retour,
    orders,
    products,
}: {
    retour?: SelectRetour;
    orders: z.infer<typeof ordersWithCustomerandOrderItemsSchema>[];
    products: SelectProduct[];
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<z.infer<
        typeof ordersWithCustomerandOrderItemsSchema
    > | null>(null);
    const [toReturnProducts, setToReturnProducts] = useState<
        Map<number, { product: SelectProduct; quantity: number }>
    >(new Map());

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            let result;
            if (retour) {
                // Edit mode
                result = await updateRetour(retour.id, formData);
            } else {
                // Create mode
                result = await createRetour(formData);
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
                <input type="hidden" name="id" value={retour?.id || ""} />

                <input
                    type="hidden"
                    name="productIds"
                    value={Array.from(toReturnProducts.keys()).join(",")}
                />
                <input
                    type="hidden"
                    name="quantities"
                    value={Array.from(toReturnProducts.values())
                        .map((item) => item.quantity)
                        .join(",")}
                />

                <div className="flex flex-col gap-3">
                    <Label>Order</Label>
                    <Select
                        required
                        name="order_id"
                        defaultValue={retour?.orderId.toString()}
                        onValueChange={(value) => {
                            const selectedOrder = orders.find(
                                (o) => o.orders.id.toString() === value
                            );
                            setSelectedOrder(
                                selectedOrder ? selectedOrder : null
                            );
                            setToReturnProducts(new Map());
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an order" />
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
                <div className="flex flex-col gap-3">
                    <Label>Products to Return</Label>
                    <div className="flex gap-5 flex-wrap">
                        {selectedOrder?.order_items.map(
                            (item: {
                                productId: number;
                                id: number;
                                createdAt: Date;
                                quantity: number;
                            }) => {
                                const product = products.find(
                                    (p) => p.id === item.productId
                                );
                                if (!product) return null;
                                const isSelected = toReturnProducts.has(
                                    product.id
                                );
                                const currentQuantity =
                                    toReturnProducts.get(product.id)
                                        ?.quantity || 1;

                                return (
                                    <div
                                        key={item.createdAt.toString()}
                                        className={`p-3 border rounded-md ${
                                            isSelected
                                                ? "bg-accent text-foreground"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (isSelected) {
                                                    const newMap = new Map(
                                                        toReturnProducts
                                                    );
                                                    newMap.delete(product.id);
                                                    setToReturnProducts(newMap);
                                                } else {
                                                    const newMap = new Map(
                                                        toReturnProducts
                                                    );
                                                    newMap.set(product.id, {
                                                        product,
                                                        quantity: 1,
                                                    });
                                                    setToReturnProducts(newMap);
                                                }
                                            }}
                                        >
                                            <p>{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Ordered: {item.quantity}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div
                                                className="mt-2 flex items-center gap-2"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Label className="text-xs">
                                                    Quantity:
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={item.quantity}
                                                    value={currentQuantity}
                                                    onChange={(e) => {
                                                        const newQuantity =
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1;
                                                        const newMap = new Map(
                                                            toReturnProducts
                                                        );
                                                        newMap.set(product.id, {
                                                            product,
                                                            quantity: Math.min(
                                                                newQuantity,
                                                                item.quantity
                                                            ),
                                                        });
                                                        setToReturnProducts(
                                                            newMap
                                                        );
                                                    }}
                                                    className="w-20 h-8"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Reason</Label>
                    <Textarea
                        required
                        name="reason"
                        placeholder="Reason of Retour"
                        defaultValue={retour?.reason}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Internal Notes</Label>
                    <Textarea
                        required
                        name="internalNotes"
                        placeholder="Internal notes about the Retour"
                        defaultValue={retour?.note ?? ""}
                    />
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
