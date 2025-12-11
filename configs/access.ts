import { UserPermission } from "@/enums";

export default {
    pages: [
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/invoices",
            permissions: [UserPermission.ViewInvoices],
        },
        {
            validation: (pathname: string) => pathname === "/dashboard/orders",
            permissions: [UserPermission.ViewOrders],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/inventory",
            permissions: [UserPermission.ViewInventory],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/inventory/create",
            permissions: [
                UserPermission.CreateInventory,
                UserPermission.ViewCategories,
                UserPermission.ViewBrands,
            ],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/inventory/") &&
                pathname.endsWith("/edit"),
            permissions: [
                UserPermission.UpdateInventory,
                UserPermission.ViewCategories,
                UserPermission.ViewBrands,
            ],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/inventory/") &&
                pathname.endsWith("/view"),
            permissions: [UserPermission.ViewInventory],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/categories",
            permissions: [UserPermission.ViewCategories],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/categories/create",
            permissions: [UserPermission.CreateCategories],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/categories/") &&
                pathname.endsWith("/edit"),
            permissions: [UserPermission.UpdateCategories],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/categories/") &&
                pathname.endsWith("/view"),
            permissions: [UserPermission.ViewCategories],
        },
        {
            validation: (pathname: string) => pathname === "/dashboard/brands",
            permissions: [UserPermission.ViewBrands],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/brands/create",
            permissions: [UserPermission.CreateBrands],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/brands/") &&
                pathname.endsWith("/edit"),
            permissions: [UserPermission.UpdateBrands],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/brands/") &&
                pathname.endsWith("/view"),
            permissions: [UserPermission.ViewBrands],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/notifications",
            permissions: [UserPermission.ViewNotifications],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/notifications/create",
            permissions: [UserPermission.CreateNotification],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/notifications/") &&
                pathname.endsWith("/edit"),
            permissions: [UserPermission.UpdateNotification],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/notifications/") &&
                pathname.endsWith("/view"),
            permissions: [UserPermission.ViewNotifications],
        },
        {
            validation: (pathname: string) => pathname === "/dashboard/users",
            permissions: [UserPermission.ViewUsers],
        },
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/users/create",
            permissions: [UserPermission.CreateUsers],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/users/") &&
                pathname.endsWith("/edit"),
            permissions: [UserPermission.UpdateUsers],
        },
        {
            validation: (pathname: string) =>
                pathname.includes("/dashboard/users/") &&
                pathname.endsWith("/view"),
            permissions: [UserPermission.ViewUsers],
        },
    ],
};
