ALTER TABLE "products" ADD COLUMN "qr_code" text;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_qr_code_unique" UNIQUE("qr_code");