import RetourForm from "@/components/retours/form";
import { getOrdersWithCustomersAndOrderItems } from "@/lib/orders";

export default async function Create() {
    const orders = await getOrdersWithCustomersAndOrderItems();
    return <RetourForm orders={orders} />;
}
