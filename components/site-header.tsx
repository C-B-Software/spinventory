"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import BarcodeScan from "./barcode-scan";

export function SiteHeader() {
    const pathname = usePathname();

    // Extract page title from pathname
    const getPageTitle = (path: string) => {
        const segments = path.split("/").filter(Boolean);
        if (segments.length === 0) return "Dashboard";

        // Capitalize and join all segments
        return segments
            .map(
                (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
            )
            .join(" / ");
    };

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">
                    {getPageTitle(pathname)}
                </h1>
                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
