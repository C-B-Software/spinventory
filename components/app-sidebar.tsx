"use client";

import * as React from "react";
import {
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
import { BoxIcon, DollarSignIcon } from "lucide-react";

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
        },
        {
            title: "Inventory",
            url: "/dashboard/inventory",
            icon: BoxIcon,
        },
        {
            title: "Categories",
            url: "/dashboard/categories",
            icon: IconFolder,
        },
        {
            title: "Orders",
            url: "/dashboard/orders",
            icon: DollarSignIcon,
        },
        {
            title: "Invoices",
            url: "/dashboard/invoices",
            icon: IconInvoice,
        },
        // {
        //     title: "Users",
        //     url: "/dashboard/users",
        //     icon: IconUsers,
        // },
        {
            title: "Audit Logs",
            url: "/dashboard/audit-logs",
            icon: IconListDetails,
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
                                <IconInnerShadowTop className="!size-5" />
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
