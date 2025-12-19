DROP TABLE "retour_products" CASCADE;--> statement-breakpoint
ALTER TABLE "retours" ADD COLUMN "status" "retour_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "retours" ADD COLUMN "note" text;