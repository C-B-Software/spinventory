ALTER TYPE "public"."user_permission" ADD VALUE 'delete_inventory' BEFORE 'view_categories';--> statement-breakpoint
ALTER TYPE "public"."user_permission" ADD VALUE 'delete_categories' BEFORE 'view_brands';--> statement-breakpoint
ALTER TYPE "public"."user_permission" ADD VALUE 'delete_brands' BEFORE 'view_orders';--> statement-breakpoint
ALTER TYPE "public"."user_permission" ADD VALUE 'delete_users' BEFORE 'view_audit_logs';--> statement-breakpoint
ALTER TYPE "public"."user_permission" ADD VALUE 'delete_notification';