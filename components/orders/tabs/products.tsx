"use client";
import { DataTable } from "@/components/orders/table-products";
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Products({
    order,
}: {
    order: {
        orders: SelectOrder;
        customers: SelectCustomer;
        order_items: { product: SelectProduct }[];
    };
}) {
    const [priceExclVat, setPriceExclVat] = useState(0);
    const [priceInclVat, setPriceInclVat] = useState(0);
    const [vat, setVat] = useState(0);

    useEffect(() => {
        order.order_items.forEach((item) => {
            setPriceExclVat((prev) => prev + item.product.price);
            const itemVat = item.product.price * 0.21;
            setVat((prev) => prev + itemVat);
            setPriceInclVat((prev) => prev + item.product.price + itemVat);
        });
    }, [order]);

    return (
        <div className="mt-6 flex flex-col gap-10">
            <div className="">
                <DataTable
                    data={order?.order_items.map(
                        (item: { product: SelectProduct }) => item.product
                    )}
                />
                <div className="flex flex-col text-sm gap-2 items-end mt-4 w-fit float-end">
                    <div className="float-right mr-2.5">
                        EXCL VAT: €{" "}
                        {String(priceExclVat.toFixed(2)).replace(".", ",")}
                    </div>
                    <div className="float-right mr-2.5">
                        {" "}
                        21% VAT: € {String(vat.toFixed(2)).replace(".", ",")}
                    </div>
                    <hr className="w-full border border-border" />
                    <div className="float-right mr-2.5">
                        € {String(priceInclVat.toFixed(2)).replace(".", ",")}
                    </div>
                </div>
            </div>
        </div>
    );
}
