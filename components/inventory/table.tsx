"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Plus,
    QrCode,
    SquareArrowOutUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { productSchema } from "@/validation/product";
import deleteProduct, { getProducts } from "@/lib/products";
import { z } from "zod";
import Image from "next/image";
import QRCode from "./qr";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CSVDownload from "../csv-download";
import { SelectProduct } from "@/database/schema";

export const columns: ColumnDef<SelectProduct>[] = [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "photo",
        header: "",
        cell: ({ row }) => (
            <Image
                src={row.original.imageUrl || "/placeholder.png"}
                alt={row.original.name}
                width={40}
                height={40}
                className="rounded-md max-h-[40px]"
            />
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "quantityInStock",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Quantity In Stock
                    <ArrowUpDown className="scale-50 -ml-2" />
                </button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("quantityInStock")}x</div>
        ),
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Price
                    <ArrowUpDown className="scale-50 -ml-2" />
                </button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">€ {row.getValue("price")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original;
            const router = useRouter();

            return (
                <div className="float-end flex gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            className="items-center justify-center"
                        >
                            <QrCode />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Inventory Management
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                                <QRCode
                                    data={
                                        process.env
                                            .NEXT_PUBLIC_ADMIN_WEBSITE_URL +
                                        "/dashboard/qr/" +
                                        product.id.toString()
                                    }
                                    width={150}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link
                                    href={
                                        process.env
                                            .NEXT_PUBLIC_ADMIN_WEBSITE_URL +
                                        "/dashboard/qr/" +
                                        product.id.toString()
                                    }
                                    target="_blank"
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Open{" "}
                                        <SquareArrowOutUpRight className="text-white scale-75" />
                                    </Button>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        product.id.toString()
                                    );
                                    toast.success(
                                        "Product ID copied to clipboard"
                                    );
                                }}
                            >
                                Copy product ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link
                                href={
                                    "/dashboard/inventory/" +
                                    product.id +
                                    "/edit"
                                }
                            >
                                <DropdownMenuItem>
                                    Edit product
                                </DropdownMenuItem>
                            </Link>
                            <Link
                                target="_blank"
                                href={
                                    process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL +
                                    "/product/" +
                                    product.id
                                }
                            >
                                <DropdownMenuItem>
                                    Go to product
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                onClick={async () => {
                                    const conf = confirm(
                                        "Are you sure you want to delete this product?"
                                    );
                                    if (conf) {
                                        await deleteProduct(product.id);
                                        toast.success("Product deleted");
                                        router.refresh();
                                    }
                                }}
                            >
                                Delete Product
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export function DataTable({ data }: { data: SelectProduct[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full px-4 lg:px-6 3xl:mt-10 3xl:w-3/4 mx-auto">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter name..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="ml-auto flex items-center justify-center gap-2">
                    <CSVDownload type="products" fileName="products.csv" />
                    <Link href="/dashboard/inventory/create">
                        <Button variant="outline">
                            <Plus /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    There are {table.getFilteredRowModel().rows.length} row(s)
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
