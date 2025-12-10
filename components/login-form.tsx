"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { logAuditEvent } from "@/lib/audit-log";
import { AuditLogAction } from "@/enums";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const email = form.email.value;
        const password = form.password.value;

        await authClient.signIn.email(
            {
                /**
                 * The user email
                 */
                email,
                /**
                 * The user password
                 */
                password,
                /**
                 * A URL to redirect to after the user verifies their email (optional)
                 */
                callbackURL: "/dashboard",
            },
            {
                onRequest: (ctx) => {},
                onSuccess: async (ctx) => {
                    await logAuditEvent(
                        AuditLogAction.Login,
                        `login: ${email}`
                    );
                },
                onError: (ctx: any) => {
                    // Handle HTTP error response
                    const errorMessage = `${ctx.error.statusText} (${ctx.error.status})`;
                    alert(errorMessage);
                },
            }
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <a href="/signup">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
