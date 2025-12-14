"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { UserPermission } from "@/enums";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
        permissions: UserPermission[];
    }[];
}) {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        if (
                            session?.user.permissions &&
                            item.permissions.length > 0 &&
                            item.permissions.every(
                                (permission) =>
                                    !session.user.permissions!.includes(
                                        permission
                                    )
                            )
                        )
                            return;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === item.url ||
                                        (pathname.startsWith(`${item.url}/`) &&
                                            item.url !== "/dashboard")
                                    }
                                    tooltip={item.title}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
