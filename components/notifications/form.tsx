"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "../ui/button";
import { createNotification, updateNotification } from "@/lib/notifications";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SelectNotification } from "@/database/schema";
import { Textarea } from "../ui/textarea";
import { NotificationAction, NotificationProvider } from "@/enums";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { ClipboardCopy } from "lucide-react"; // Optional: for icon

type NotificationFormProps = {
    notification?: SelectNotification;
};

const variables = [
    "customer_email",
    "delivery_method",
    "delivery_country",
    "delivery_firstname",
    "delivery_lastname",
    "delivery_company",
    "delivery_address",
    "delivery_postalcode",
    "delivery_city",
    "delivery_phonenumber",
    "invoice_country",
    "invoice_firstname",
    "invoice_lastname",
    "invoice_company",
    "invoice_address",
    "invoice_postalcode",
    "invoice_city",
    "invoice_phonenumber",
    "invoice_coc_number",
    "created_at",
];

function handleCopyVariable(variable: string) {
    navigator.clipboard.writeText(`{${variable}}`);
    toast.success(`Copied {${variable}} to clipboard`);
}

export default function NotificationForm({
    notification,
}: NotificationFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            let result;
            if (notification) {
                // Edit mode
                result = await updateNotification(notification.id, formData);
            } else {
                // Create mode
                result = await createNotification(formData);
            }

            if (result.success) {
                form.reset();
                toast.success(
                    notification
                        ? "Notification updated successfully!"
                        : "Notification created successfully!"
                );
                router.push("/dashboard/notifications");
            } else {
                toast.error(result.error || "Failed to save notification.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while saving the notification.");
        } finally {
            setLoading(false);
        }
    }

    const providerOptions = Object.values(NotificationProvider);
    const actionOptions = Object.values(NotificationAction);

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label>Provider</Label>
                    <Select
                        name="provider"
                        defaultValue={notification?.provider}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {providerOptions.map((provider) => (
                                <SelectItem key={provider} value={provider}>
                                    {provider.charAt(0).toUpperCase() +
                                        provider.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Action</Label>
                    <Select
                        name="action"
                        defaultValue={notification?.action}
                        required
                    >
                        <SelectTrigger className="w-full">
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
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Content</Label>
                    <Textarea
                        required
                        name="content"
                        placeholder="Notification Content"
                        defaultValue={notification?.content}
                    />
                    <div className="text-muted-foreground flex flex-wrap gap-2">
                        {variables.map((variable) => (
                            <button
                                type="button"
                                key={variable}
                                onClick={() => handleCopyVariable(variable)}
                                className="bg-muted cursor-copy px-2 py-1 rounded text-xs hover:bg-primary/10 transition flex items-center gap-1"
                                title={`Copy {${variable}}`}
                            >
                                {`{${variable}}`}
                                {/* <ClipboardCopy className="w-3 h-3" /> */}
                            </button>
                        ))}
                    </div>
                </div>
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : notification
                        ? "Update Notification"
                        : "Create Notification"}
                </Button>
            </form>
        </div>
    );
}
