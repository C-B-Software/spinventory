import NotificationForm from "@/components/notifications/form";

export default async function Create() {
    return (
        <div className="flex flex-col gap-3 py-4 md:gap-6 md:py-6">
            <NotificationForm />
        </div>
    );
}
