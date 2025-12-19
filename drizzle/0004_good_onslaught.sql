ALTER TYPE "public"."user_permission" ADD VALUE 'update_orders' BEFORE 'view_invoices';--> statement-breakpoint
CREATE TABLE "retour_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"retour_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retours" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "retour_products" ADD CONSTRAINT "retour_products_retour_id_retours_id_fk" FOREIGN KEY ("retour_id") REFERENCES "public"."retours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retour_products" ADD CONSTRAINT "retour_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retours" ADD CONSTRAINT "retours_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;