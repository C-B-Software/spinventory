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

export default function OrderInfo({
    order,
}: {
    order: {
        orders: SelectOrder;
        customers: SelectCustomer;
        order_items: { product: SelectProduct }[];
    };
}) {
    return (
        <div className="px-4 lg:w-3/4 mx-auto lg:px-6 my-10">
            <WorkInProgress />
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
