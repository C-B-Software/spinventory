import NotificationForm from "@/components/notifications/form";
import { getNotification } from "@/lib/notifications";

export default async function Edit({
    params,
}: {
    params: Promise<{ "notification-id": string }>;
}) {
    const resolvedParams = await params;
    const notification = await getNotification(
        parseInt(resolvedParams["notification-id"])
    );
    if (!notification) return null;

    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <NotificationForm notification={notification} />
        </div>
    );
}
