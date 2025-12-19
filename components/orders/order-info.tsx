"use client";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/orders/table-products";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import your tab components
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";
import Details from "./tabs/details";
import Products from "./tabs/products";
import Customer from "./tabs/customer";
import Delivery from "./tabs/delivery";
import WorkInProgress from "../work-in-progress";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { OrderStatus } from "@/enums";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updateOrder } from "@/lib/orders";
import { Button } from "../ui/button";

export default function OrderInfo({
    order,
}: {
    order: {
        orders: SelectOrder;
        customers: SelectCustomer;
        order_items: { product: SelectProduct }[];
    };
}) {
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            let result;
            if (order) {
                // Edit mode
                result = await updateOrder(order.orders.id, formData);
            }

            if (result?.success) {
                toast.success("Product saved successfully.");
            } else {
                toast.error(result?.error || "Failed to save product.");
            }
        } catch (error) {
            toast.error("An error occurred while saving the product.");
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto lg:px-6 my-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Order #{order.orders.id} Information
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Detailed information about order #{order.orders.id}
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Status</Label>
                    <Select name="status" defaultValue={order.orders.status}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.entries(OrderStatus).map(
                                    ([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {key}
                                        </SelectItem>
                                    )
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="self-start">
                    Save Changes
                </Button>
            </form>
            <Tabs defaultValue="products" className="mt-10">
                <TabsList>
                    <TabsTrigger value="products">Ordered Products</TabsTrigger>
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="customer">Customer Details</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery Status</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                    <Products order={order} />
                </TabsContent>

                <TabsContent value="details">
                    <Details order={order} />
                </TabsContent>

                <TabsContent value="customer">
                    <Customer order={order} />
                </TabsContent>

                <TabsContent value="delivery">
                    <Delivery order={order} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
