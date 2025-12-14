import { Label } from "@/components/ui/label";
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";

export default function Details({
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
                <Label>Order ID</Label>
                <span className="opacity-60">{order?.orders.id}</span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Customer ID</Label>
                <span className="opacity-60">{order?.orders.customerId}</span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice ID</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceId || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Method</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryMethod}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Status</Label>
                <span className="opacity-60">
                    {order?.orders.status || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Country</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryCountry || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Firstname</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryFirstname || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Lastname</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryLastname || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Company</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryCompany || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Address</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryAddress || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Postal Code</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryPostalcode || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery City</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryCity || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Delivery Phone Number</Label>
                <span className="opacity-60">
                    {order?.orders.deliveryPhonenumber || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Country</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceCountry}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Firstname</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceFirstname}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Lastname</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceLastname}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Company</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceCompany || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice COC Number</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceCOCNumber || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Address</Label>
                <span className="opacity-60">
                    {order?.orders.invoiceAddress}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Postal Code</Label>
                <span className="opacity-60">
                    {order?.orders.invoicePostalcode}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice City</Label>
                <span className="opacity-60">{order?.orders.invoiceCity}</span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Invoice Phone Number</Label>
                <span className="opacity-60">
                    {order?.orders.invoicePhonenumber || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Created At</Label>
                <span className="opacity-60">
                    {order?.orders.createdAt
                        ? order.orders.createdAt.toISOString()
                        : "N/A"}
                </span>
            </div>
        </div>
    );
}
