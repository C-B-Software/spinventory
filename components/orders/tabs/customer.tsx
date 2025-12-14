import { Label } from "@/components/ui/label";
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";

export default function Customer({
    order,
}: {
    order: {
        orders: SelectOrder;
        customers: SelectCustomer;
        order_items: { product: SelectProduct }[];
    };
}) {
    return (
        <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
                <Label>Customer ID</Label>
                <span className="opacity-60">{order?.customers.id}</span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Email</Label>
                <span className="opacity-60">{order?.customers.email}</span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Country</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryCountry || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Firstname</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryFirstname || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Lastname</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryLastname || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Address</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryAddress || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery City</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryCity || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Phone Number</Label>
                <span className="opacity-60">
                    {order?.customers.deliveryPhonenumber || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Created At</Label>
                <span className="opacity-60">
                    {order?.customers.createdAt
                        ? order.customers.createdAt.toISOString()
                        : "N/A"}
                </span>
            </div>
        </div>
    );
}
