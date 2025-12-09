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
    Eye,
    EyeIcon,
    EyeOffIcon,
    LogIn,
    MoreHorizontal,
    Pencil,
    Plus,
    QrCode,
    SquareArrowOutUpRight,
    Trash,
    User,
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
import { auditLogSchema } from "@/validation/auditLog";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { AuditLogAction } from "@/enums";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";

export const columns: ColumnDef<z.infer<typeof auditLogSchema>>[] = [
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.action === AuditLogAction.View && (
                    <EyeIcon className="text-blue-500 dark:text-blue-400 mt-0.5" />
                )}
                {row.original.action === AuditLogAction.Create && (
                    <Plus className="text-green-500 dark:text-green-400 mt-0.5" />
                )}
                {row.original.action === AuditLogAction.Update && (
                    <Pencil className="text-orange-500 dark:text-orange-400 mt-0.5" />
                )}
                {row.original.action === AuditLogAction.Delete && (
                    <Trash className="text-red-500 dark:text-red-400 mt-0.5" />
                )}
                {row.original.action === AuditLogAction.Login && (
                    <LogIn className="text-yellow-500 dark:text-yellow-400 mt-0.5" />
                )}
                {row.original.action === AuditLogAction.Signup && (
                    <User className="text-purple-500 dark:text-purple-400 mt-0.5" />
                )}
                {row.original.action}
            </Badge>
        ),
        filterFn: (row, columnId, filterValue) => {
            // Case-insensitive exact match for action
            return (
                String(row.getValue(columnId)).toLowerCase() ===
                filterValue.toLowerCase()
            );
        },
    },
    {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => <div className="">{row.getValue("entity")}</div>,
        filterFn: (row, columnId, filterValue) => {
            // Case-insensitive includes for entity
            return String(row.getValue(columnId))
                .toLowerCase()
                .includes(filterValue.toLowerCase());
        },
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            const formatted = `${String(date.getDate()).padStart(
                2,
                "0"
            )}/${String(date.getMonth() + 1).padStart(
                2,
                "0"
            )}/${date.getFullYear()} ${String(date.getHours()).padStart(
                2,
                "0"
            )}:${String(date.getMinutes()).padStart(2, "0")}`;
            return <div className="">{formatted}</div>;
        },
        filterFn: (row, columnId, filterValue) => {
            // Filter on formatted date string (dd/mm/yyyy hh:mm)
            const date = new Date(row.getValue(columnId));
            const formatted = `${String(date.getDate()).padStart(
                2,
                "0"
            )}/${String(date.getMonth() + 1).padStart(
                2,
                "0"
            )}/${date.getFullYear()} ${String(date.getHours()).padStart(
                2,
                "0"
            )}:${String(date.getMinutes()).padStart(2, "0")}`;
            return formatted.includes(filterValue);
        },
    },
];

export function DataTable({
    data,
}: {
    data: Array<z.infer<typeof auditLogSchema>>;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filterField, setFilterField] = React.useState<
        "entity" | "action" | "createdAt"
    >("entity");
    const [date, setDate] = useState<Date | undefined>();

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

    // Helper for AuditLogAction options
    const actionOptions = Object.values(AuditLogAction);

    return (
        <div className="w-full px-4 lg:px-6 3xl:mt-10 3xl:w-3/4 mx-auto">
            <div className="flex items-center py-4 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {filterField === "entity"
                                ? "Entity"
                                : filterField === "action"
                                ? "Action"
                                : "Created At"}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setFilterField("entity")}
                            className={
                                filterField === "entity" ? "font-semibold" : ""
                            }
                        >
                            Entity
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setFilterField("action")}
                            className={
                                filterField === "action" ? "font-semibold" : ""
                            }
                        >
                            Action
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setFilterField("createdAt")}
                            className={
                                filterField === "createdAt"
                                    ? "font-semibold"
                                    : ""
                            }
                        >
                            Created At
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {filterField === "entity" && (
                    <Input
                        placeholder="Filter entity..."
                        value={
                            (table
                                .getColumn("entity")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("entity")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
                {filterField === "action" && (
                    <>
                        <Select
                            value={
                                (table
                                    .getColumn("action")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onValueChange={(value) =>
                                table.getColumn("action")?.setFilterValue(value)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                                {actionOptions.map((action) => (
                                    <SelectItem key={action} value={action}>
                                        {action.charAt(0).toUpperCase() +
                                            action.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                table.getColumn("action")?.setFilterValue("")
                            }
                        >
                            Clear
                        </Button>
                    </>
                )}
                {filterField === "createdAt" && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-[240px] justify-start text-left font-normal"
                            >
                                {date
                                    ? format(date, "dd/MM/yyyy")
                                    : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selected) => {
                                    setDate(selected);
                                    table
                                        .getColumn("createdAt")
                                        ?.setFilterValue(
                                            selected
                                                ? format(selected, "dd/MM/yyyy")
                                                : ""
                                        );
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                )}
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
