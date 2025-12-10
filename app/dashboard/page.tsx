import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { getOrders } from "@/lib/orders";
import { useQRCode } from "next-qrcode";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserPermission } from "@/enums";

export default async function Page() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTableOrders />
        </div>
    );
}

async function DataTableOrders() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.permissions?.includes(UserPermission.ViewOrders)) {
        return (
            <div className="px-4 lg:px-6">
                <div className="w-full h-64 border border-border rounded-xl bg-card flex items-center justify-center text-accent-foreground">
                    You do not have permission to view orders.
                </div>
            </div>
        );
    }
    const data = await getOrders();
    return <DataTable data={data} />;
}
