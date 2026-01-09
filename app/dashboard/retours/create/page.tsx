import RetourForm from "@/components/retours/form";
import { getOrdersWithCustomersAndOrderItems } from "@/lib/orders";
import { getProducts } from "@/lib/products";

export default async function Create() {
    const orders = await getOrdersWithCustomersAndOrderItems();
    const products = await getProducts();
    return <RetourForm orders={orders} products={products} />;
}
