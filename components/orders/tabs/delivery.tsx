"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { SelectCustomer, SelectOrder, SelectProduct } from "@/database/schema";
import { DeliveryStatus } from "@/enums";
import { Car, ChevronRight, Home, Package, Save } from "lucide-react";
import { useState } from "react";

export default function Delivery({
    order,
}: {
    order: {
        orders: SelectOrder;
        customers: SelectCustomer;
        order_items: { product: SelectProduct }[];
    };
}) {
    const [status, setStatus] = useState<DeliveryStatus>(
        DeliveryStatus.Unknown
    );

    // Helper function to determine the color based on the status
    const getStatusStyles = (stepStatus: DeliveryStatus) => {
        if (status === DeliveryStatus.Failure) {
            // All steps are red for Failure
            return {
                border: "border-red-600",
                background: "bg-red-300/20",
                icon: "text-red-600",
                line: "border-red-600",
            };
        } else if (status === DeliveryStatus.Unknown) {
            // All steps are yellow for Unknown
            return {
                border: "border-yellow-600",
                background: "bg-yellow-300/20",
                icon: "text-yellow-600",
                line: "border-yellow-600",
            };
        } else if (
            status === DeliveryStatus.Delivered &&
            stepStatus === DeliveryStatus.Delivered
        ) {
            // Delivered is always green as it is the final step
            return {
                border: "border-green-600",
                background: "bg-green-300/20",
                icon: "text-green-600",
                line: "border-green-600",
            };
        } else if (status === stepStatus) {
            // Current step is orange
            return {
                border: "border-orange-600",
                background: "bg-orange-300/20",
                icon: "text-orange-600",
                line: "border-orange-600",
            };
        } else if (
            stepStatus === DeliveryStatus.Pending ||
            (Object.values(DeliveryStatus).includes(DeliveryStatus.Unknown) &&
                Object.values(DeliveryStatus).indexOf(status) >
                    Object.values(DeliveryStatus).indexOf(stepStatus))
        ) {
            // Previous steps are green
            return {
                border: "border-green-600",
                background: "bg-green-300/20",
                icon: "text-green-600",
                line: "border-green-600",
            };
        } else {
            // Future steps are muted
            return {
                border: "border-border",
                background: "bg-card",
                icon: "text-muted",
                line: "border-border",
            };
        }
    };

    return (
        <div className="mt-10">
            <div className="w-full flex gap-3">
                <Input className="w-full" placeholder="Tracking Code" />
                <Select value="">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Deliverer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dhl">DHL</SelectItem>
                    </SelectContent>
                </Select>
                <Button>
                    <Save />
                </Button>
            </div>
            <div className="flex items-center justify-center mt-10 gap-2">
                {/* Pre-Transit */}
                <div className="flex flex-col gap-2">
                    <div
                        className={`h-40 w-40 border-2 border-dashed rounded-xl flex items-center justify-center ${
                            getStatusStyles(DeliveryStatus.Pending).border
                        } ${
                            getStatusStyles(DeliveryStatus.Pending).background
                        }`}
                    >
                        <Package
                            className={`scale-260 ${
                                getStatusStyles(DeliveryStatus.Pending).icon
                            }`}
                        />
                    </div>
                    <span className="text-center text-sm opacity-60">
                        Pre-Transit
                    </span>
                </div>

                {/* Connector with Chevron */}
                <div className="flex items-center gap-1 flex-1">
                    <hr
                        className={`border flex-1 border-dashed ${
                            getStatusStyles(DeliveryStatus.Pending).line
                        }`}
                    />
                    <ChevronRight
                        className={`${
                            getStatusStyles(DeliveryStatus.Pending).icon
                        } -mr-2`}
                    />
                </div>

                {/* In Transit */}
                <div className="flex flex-col gap-2">
                    <div
                        className={`h-40 w-40 border-2 rounded-xl border-dashed flex items-center justify-center ${
                            getStatusStyles(DeliveryStatus.Shipped).border
                        } ${
                            getStatusStyles(DeliveryStatus.Shipped).background
                        }`}
                    >
                        <Car
                            className={`scale-260 ${
                                getStatusStyles(DeliveryStatus.Shipped).icon
                            }`}
                        />
                    </div>
                    <span className="text-center text-sm opacity-60">
                        In Transit
                    </span>
                </div>

                {/* Connector with Chevron */}
                <div className="flex items-center gap-1 flex-1">
                    <hr
                        className={`border flex-1 border-dashed ${
                            getStatusStyles(DeliveryStatus.Shipped).line
                        }`}
                    />
                    <ChevronRight
                        className={`${
                            getStatusStyles(DeliveryStatus.Shipped).icon
                        } -mr-2`}
                    />
                </div>

                {/* Delivered */}
                <div className="flex flex-col gap-2">
                    <div
                        className={`h-40 w-40 border-2 rounded-xl border-dashed flex items-center justify-center ${
                            getStatusStyles(DeliveryStatus.Delivered).border
                        } ${
                            getStatusStyles(DeliveryStatus.Delivered).background
                        }`}
                    >
                        <Home
                            className={`scale-260 ${
                                getStatusStyles(DeliveryStatus.Delivered).icon
                            }`}
                        />
                    </div>
                    <span className="text-center text-sm opacity-60">
                        Delivered
                    </span>
                </div>
            </div>
        </div>
    );
}
