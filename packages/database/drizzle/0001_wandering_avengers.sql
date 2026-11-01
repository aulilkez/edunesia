ALTER TABLE "users" ADD COLUMN "accept_terms" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accept_terms_at" timestamp with time zone;