import OrderInfo from "@/components/orders/order-info";
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";
import { getOrderWithCustomerAndOrderItems } from "@/lib/orders";

export default async function OrderShowPage({
    params,
}: {
    params: { "order-id": string };
}) {
    const { "order-id": orderIdString } = await params;

    const order = await getOrderWithCustomerAndOrderItems(
        parseInt(orderIdString)
    );

    return (
        <OrderInfo
            order={
                order as {
                    orders: SelectOrder;
                    customers: SelectCustomer;
                    order_items: { product: SelectProduct }[];
                }
            }
        />
    );
}
