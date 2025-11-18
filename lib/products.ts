"use server";

import { db } from "@/database/connect";
import { productsTable, SelectProduct } from "@/database/schema";
import { productSchema } from "@/validation/product";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function getProducts(): Promise<z.infer<typeof productSchema>[]> {
    const products = await db.select().from(productsTable);

    return products.reduce<z.infer<typeof productSchema>[]>(
        (validProducts, product) => {
            const result = productSchema.safeParse(product);
            if (result.success) {
                validProducts.push(result.data);
            } else {
                console.error("Invalid product data:", result.error);
            }
            return validProducts;
        },
        []
    );
}

export async function getProduct(id: number): Promise<SelectProduct | null> {
    try {
        const validatedId = z
            .number()
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: "Product ID must be a positive integer",
            })
            .parse(id);

        const [product] = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.id, validatedId));

        return product || null;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid product ID:", error.issues);
            throw new Error("Invalid product ID provided");
        } else {
            console.error("Failed to fetch product:", error);
            throw new Error("Failed to fetch product");
        }
    }
}

export async function createProduct(formData: FormData) {
    try {
        // Get other form data
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const categoryId = parseInt(formData.get("category") as string);
        const price = parseFloat(formData.get("price") as string);
        const configuration = formData.get("configuration") as string;
        const mainImageUrl = formData.get("image_url") as string;
        const additionalImages = formData.get("images_url") as string;
        await db.insert(productsTable).values({
            categoryId,
            name,
            imageUrl: mainImageUrl,
            noneMainImagesUrl: JSON.stringify(additionalImages.split(",")),
            description,
            configuration,
            price: price,
        });

        return { success: true, product: null };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, error: "Failed to create product" };
    }
}

export async function updateProductStock(
    productId: number,
    quantityChange: number,
    action: "add" | "remove" = "add"
) {
    try {
        const product = await getProduct(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        const newQuantity =
            action === "add"
                ? product.quantityInStock + quantityChange
                : product.quantityInStock - quantityChange;
        if (newQuantity < 0) {
            throw new Error("Insufficient stock");
        }

        await db
            .update(productsTable)
            .set({ quantityInStock: newQuantity })
            .where(eq(productsTable.id, productId));

        return { success: true };
    } catch (error) {
        console.error("Failed to update product stock:", error);
        return { success: false, error: "Failed to update product stock" };
    }
}
