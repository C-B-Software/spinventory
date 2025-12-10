CREATE TYPE "public"."notification_action" AS ENUM('order_created');--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "action" "notification_action" NOT NULL;