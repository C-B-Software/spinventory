"use client";

import * as React from "react";
import {
    IconBell,
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconInvoice,
    IconListDetails,
    IconMenuOrder,
    IconProps,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react";
import BrandingConfig from "@/configs/branding";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BoxIcon, DollarSignIcon, FolderArchive } from "lucide-react";
import Logo from "./logo";
import { UserPermission } from "@/enums";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
            permissions: [],
        },
        {
            title: "Inventory",
            url: "/dashboard/inventory",
            icon: BoxIcon,
            permissions: [UserPermission.ViewInventory],
        },
        {
            title: "Categories",
            url: "/dashboard/categories",
            icon: IconFolder,
            permissions: [UserPermission.ViewCategories],
        },
        {
            title: "Brands",
            url: "/dashboard/brands",
            icon: FolderArchive,
            permissions: [UserPermission.ViewBrands],
        },
        {
            title: "Orders",
            url: "/dashboard/orders",
            icon: DollarSignIcon,
            permissions: [UserPermission.ViewOrders],
        },
        {
            title: "Invoices",
            url: "/dashboard/invoices",
            icon: IconInvoice,
            permissions: [UserPermission.ViewInvoices],
        },
        {
            title: "Login Users",
            url: "/dashboard/users",
            icon: IconUsers,
            permissions: [UserPermission.ViewUsers],
        },
        {
            title: "Audit Logs",
            url: "/dashboard/audit-logs",
            icon: IconListDetails,
            permissions: [UserPermission.ViewAuditLogs],
        },
        {
            title: "Notifications",
            url: "/dashboard/notifications",
            icon: IconBell,
            permissions: [UserPermission.ViewNotifications],
        },
    ],
    // navSecondary: [
    //     {
    //         title: "Settings",
    //         url: "#",
    //         icon: IconSettings,
    //     },
    //     {
    //         title: "Get Help",
    //         url: "#",
    //         icon: IconHelp,
    //     },
    //     {
    //         title: "Search",
    //         url: "#",
    //         icon: IconSearch,
    //     },
    // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <Logo />
                                <span className="text-base font-semibold">
                                    {BrandingConfig.appName}
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <hr className="w-full border border-border" />
                <NavMain
                    items={data.navMain.map((item) => ({
                        ...item,
                        icon: item.icon as unknown as React.FunctionComponent<IconProps>,
                    }))}
                />
                {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
