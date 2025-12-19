CREATE TABLE "retour_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"retour_id" integer NOT NULL,
	"order_item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "retour_order_items" ADD CONSTRAINT "retour_order_items_retour_id_retours_id_fk" FOREIGN KEY ("retour_id") REFERENCES "public"."retours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retour_order_items" ADD CONSTRAINT "retour_order_items_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE no action ON UPDATE no action;