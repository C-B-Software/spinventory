import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { SelectProduct } from "@/database/schema";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default function CSVDownload({
    fileName,
    type,
}: {
    fileName: string;
    type: "products";
}) {
    async function downloadCSV() {
        console.log("Downloading CSV...");
        // Convert the data array into a CSV string
        const csvString = await getContent();

        // Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: "text/csv" });

        // Generate a download link and initiate the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "download.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async function getContent(): Promise<string> {
        switch (type) {
            case "products":
                const csvContent: string[] = [
                    "ServerPunt Product Export",
                    "",
                    [
                        "Category",
                        "Name",
                        "Description",
                        "Configuration",
                        "Price",
                        "Stock",
                    ].join(","),
                    "",
                ];
                const products = await getProducts();
                const categories = await getCategories();

                categories.forEach((cat) => {
                    // Add category name as a header
                    csvContent.push(cat.name);

                    // Add product rows
                    products
                        .filter((product) => product.categoryId === cat.id)
                        .forEach((product) => {
                            csvContent.push(
                                [
                                    "",
                                    product.name,
                                    product.description,
                                    product.configuration,
                                    product.price.toString(),
                                    product.quantityInStock.toString(),
                                ].join(",")
                            );
                        });

                    // Add an empty line between categories
                    csvContent.push("");
                });

                // Join all rows with newline characters
                return csvContent.join("\n");

            default:
                return "";
        }
    }

    return (
        <Button
            variant="outline"
            onClick={downloadCSV}
            className="cursor-pointer"
        >
            <Download />{" "}
        </Button>
    );
}
