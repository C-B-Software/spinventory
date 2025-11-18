"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SelectProduct } from "@/database/schema";
import { getProduct, updateProductStock } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<SelectProduct | null>(null);

    useEffect(() => {
        fetchProduct();
    }, [params]);

    async function fetchProduct() {
        const product = await getProduct(Number(params["product-id"]));
        setProduct(product);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-5 h-full max-w-3/4 mx-auto">
            <Image
                src={product?.imageUrl || "/placeholder.png"}
                alt={product?.name || "Product Image"}
                width={300}
                height={300}
                className="object-cover hidden md:block max-h-[300px] rounded-lg"
            />
            <div className="text-center">
                <h1 className="text-2xl font-bold">{product?.name}</h1>
                <p>{product?.description}</p>
            </div>
            <div className="text-lg underline underline-offset-4 text-center font-semibold  rounded-lg">
                {product?.quantityInStock}x Stock
            </div>
            <div className="flex flex-col md:flex-row gap-5 align flex-wrap items-center justify-center *:w-[20rem] *:md:w-fit">
                <Button
                    onClick={async () => {
                        await updateProductStock(
                            Number(params["product-id"]),
                            1,
                            "add"
                        );
                        fetchProduct();
                    }}
                    variant={"secondary"}
                >
                    Add 1x Stock
                </Button>
                <Button
                    onClick={async () => {
                        await updateProductStock(
                            Number(params["product-id"]),
                            1,
                            "remove"
                        );
                        fetchProduct();
                    }}
                    variant={"secondary"}
                >
                    Remove 1x Stock
                </Button>
                <Link
                    target="_blank"
                    href={"/dashboard/inventory/" + params["product-id"]}
                >
                    <Button className="w-full" variant={"secondary"}>
                        Product Info
                    </Button>
                </Link>
                <Link
                    target="_blank"
                    href={
                        "/dashboard/inventory/" + params["product-id"] + "/edit"
                    }
                >
                    <Button className="w-full" variant={"secondary"}>
                        Edit Product
                    </Button>
                </Link>
            </div>
        </div>
    );
}
