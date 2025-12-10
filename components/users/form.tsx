"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectUser } from "@/database/schema";
import { UploadButton } from "@/utils/uploadthing";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { updateUser } from "@/lib/users";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { UserPermission } from "@/enums";
import { Badge } from "../ui/badge";

type UserFormProps = {
    user?: SelectUser;
};

export default function UserForm({ user }: UserFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [permissions, setPermissions] = useState<UserPermission[]>([]);

    useEffect(() => {
        if (user) {
            setPermissions(user.permissions as UserPermission[]);
        }
    }, [user]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        console.log(formData);
        try {
            let result;
            if (user) {
                // Edit mode
                result = await updateUser(user.id, formData);
            }

            if (result?.success) {
                form.reset();
                toast.success(
                    user
                        ? "User updated successfully!"
                        : "User created successfully!"
                );
                router.push("/dashboard/users");
            } else {
                toast.error(result?.error || "Failed to save user.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while saving the user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 lg:w-3/4 mx-auto  lg:px-6 mt-10">
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                <input
                    type="hidden"
                    name="permissions"
                    value={permissions.toString()}
                />
                <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                        required
                        type="text"
                        name="name"
                        placeholder="User Name"
                        defaultValue={user?.name}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Access</Label>
                    <Checkbox name="access" defaultChecked={user?.access} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Permissions</Label>
                    <div className="w-full flex flex-wrap gap-2">
                        {Object.entries(UserPermission).map(([key, value]) => (
                            <Badge
                                onClick={() => {
                                    if (permissions.includes(value)) {
                                        setPermissions(
                                            permissions.filter(
                                                (perm) => perm !== value
                                            )
                                        );
                                    } else {
                                        setPermissions([...permissions, value]);
                                    }
                                }}
                                key={key}
                                className={
                                    "text-white capitalize cursor-pointer select-none font-semibold tracking-wider " +
                                    (permissions.includes(value)
                                        ? "bg-green-500"
                                        : "bg-red-500")
                                }
                            >
                                {value.replaceAll("_", " ")}
                            </Badge>
                        ))}
                    </div>
                </div>
                <Button className="w-fit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : user
                        ? "Update User"
                        : "Create User"}
                </Button>
            </form>
        </div>
    );
}
