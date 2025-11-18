CREATE TYPE "public"."delivery_method" AS ENUM('delivery', 'pickup');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'cancelled', 'finished');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"delivery_method" "delivery_method",
	"delivery_country" text,
	"delivery_firstname" text,
	"delivery_lastname" text,
	"delivery_company" text,
	"delivery_address" text,
	"delivery_postalcode" text,
	"delivery_city" text,
	"delivery_phonenumber" text,
	"invoice_country" text,
	"invoice_firstname" text,
	"invoice_lastname" text,
	"invoice_company" text,
	"invoice_coc_number" text,
	"invoice_address" text,
	"invoice_postalcode" text,
	"invoice_city" text,
	"invoice_phonenumber" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"invoice_id" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"delivery_method" "delivery_method",
	"delivery_country" text,
	"delivery_firstname" text,
	"delivery_lastname" text,
	"delivery_company" text,
	"delivery_address" text,
	"delivery_postalcode" text,
	"delivery_city" text,
	"delivery_phonenumber" text,
	"invoice_country" text NOT NULL,
	"invoice_firstname" text NOT NULL,
	"invoice_lastname" text NOT NULL,
	"invoice_company" text,
	"invoice_coc_number" text,
	"invoice_address" text NOT NULL,
	"invoice_postalcode" text NOT NULL,
	"invoice_city" text NOT NULL,
	"invoice_phonenumber" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"none_main_images_url" text,
	"description" text NOT NULL,
	"configuration" text NOT NULL,
	"price" integer NOT NULL,
	"quantity_in_stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;