import { SalesInvoice } from "@/types";
import Axios from "axios";
import { authorized } from "./security";
export async function getInvoices(): Promise<SalesInvoice[]> {
    await authorized();
    try {
        const response = await Axios.get(
            "https://api.mollie.com/v2/sales-invoices",
            {
                headers: {
                    Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data._embedded.invoices.sort(
            (a: SalesInvoice, b: SalesInvoice) => {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            }
        );
    } catch (err) {
        console.error("Error fetching invoices:", err);
        throw new Error("Failed to fetch invoices");
    }
}
