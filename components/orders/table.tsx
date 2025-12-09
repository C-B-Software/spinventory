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

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { orderWithCustomerandOrderItemsSchema } from "@/validation/order";
import { Badge } from "../ui/badge";
import { OrderStatus } from "@/enums";
import {
    IconCheck,
    IconLoader,
    IconMoneybag,
    IconTruckDelivery,
    IconWalk,
    IconX,
} from "@tabler/icons-react";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const columns: ColumnDef<
    z.infer<typeof orderWithCustomerandOrderItemsSchema>
>[] = [
    {
        accessorKey: "id",
        header: "Order ID",
        accessorFn: (row) => row.orders.id,
        cell: ({ row }) => (
            <div className="capitalize">#{row.original.orders.id}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
            // Only match exact id (as string or number)
            const value = row.getValue(columnId);
            return String(value) === filterValue;
        },
    },
    {
        accessorKey: "customerEmail",
        header: "Customer Email",
        accessorFn: (row) => row.customers.email,
        cell: ({ row }) => <div>{row.original.customers.email}</div>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.original.orders.createdAt);
            return (
                <div>
                    {date.getUTCDate() - 1}/{date.getUTCMonth() + 1}/
                    {date.getUTCFullYear()}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.orders.status === OrderStatus.Paid && (
                    <IconMoneybag className="fill-yellow-500 dark:fill-yellow-400 mt-0.5" />
                )}
                {row.original.orders.status === OrderStatus.Pending && (
                    <IconLoader className="fill-gray-500 dark:fill-gray-400 mt-0.5" />
                )}
                {row.original.orders.status === OrderStatus.Cancelled && (
                    <IconX className="fill-red-500 dark:fill-red-400 mt-0.5" />
                )}
                {row.original.orders.status === OrderStatus.Shipped && (
                    <IconTruckDelivery className="fill-purple-500 dark:fill-purple-400 mt-0.5" />
                )}
                {row.original.orders.status === OrderStatus.Processing && (
                    <IconWalk className="fill-orange-500 dark:fill-orange-400 mt-0.5" />
                )}
                {row.original.orders.status === OrderStatus.Finished && (
                    <IconCheck className="fill-green-500 dark:fill-green-400 mt-0.5" />
                )}

                {row.original.orders.status}
            </Badge>
        ),
    },
    {
        accessorKey: "deliveryMethod",
        header: "Delivery Method",
        cell: ({ row }) => (
            <div className="lowercase">
                {row.original.orders.deliveryMethod}
            </div>
        ),
    },
];

export function DataTable({
    data,
}: {
    data: Array<z.infer<typeof orderWithCustomerandOrderItemsSchema>>;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filterField, setFilterField] = React.useState<
        "customerEmail" | "id"
    >("customerEmail");

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
        <div className="w-full 3xl:w-3/4 mx-auto 3xl:mt-10 px-4 lg:px-6">
            <div className="flex items-center py-4 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {filterField === "customerEmail"
                                ? "Email"
                                : "Order ID"}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setFilterField("customerEmail")}
                            className={
                                filterField === "customerEmail"
                                    ? "font-semibold"
                                    : ""
                            }
                        >
                            Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setFilterField("id")}
                            className={
                                filterField === "id" ? "font-semibold" : ""
                            }
                        >
                            Order ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder={`Filter ${
                        filterField === "customerEmail" ? "email" : "order ID"
                    }...`}
                    value={
                        (table
                            .getColumn(filterField)
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn(filterField)
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
