import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AccessConfig from "@/configs/access";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user || !session.user.access) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
                <p className="text-center text-muted-foreground w-[30rem]">
                    You do not have permission to access this dashboard. Please
                    contact the administrator if you believe this is an error.
                </p>
            </div>
        );
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}{" "}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
