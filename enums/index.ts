export enum OrderStatus {
    Pending = "pending",
    Paid = "paid",
    Processing = "processing",
    Shipped = "shipped",
    Cancelled = "cancelled",
    Finished = "finished",
}

export enum DeliveryMethod {
    Delivery = "delivery",
    Pickup = "pickup",
}

export enum AuditLogAction {
    Create = "create",
    Update = "update",
    Delete = "delete",
    View = "view",
    Login = "login",
    Logout = "logout",
    Signup = "signup",
}

export enum NotificationProvider {
    Discord = "discord",
}

export enum NotificationAction {
    OrderCreated = "order_created",
    OrderPaid = "order_paid",
}
