import { UserPermission } from "@/enums";

export default {
    pages: [
        {
            validation: (pathname: string) =>
                pathname === "/dashboard/invoices",
            permissions: [UserPermission.ViewInvoices],
        },
    ],
};
