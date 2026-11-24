ALTER TABLE "brands" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "locked_colors" jsonb;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "locked_fonts" jsonb;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "do_not_use" text;--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('generating', 'ready', 'in_review', 'approved', 'changes_requested', 'failed');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"title" text NOT NULL,
	"brief" text NOT NULL,
	"offer" text,
	"headline" text,
	"cta_text" text,
	"formats" jsonb NOT NULL,
	"include_carousel" boolean DEFAULT false NOT NULL,
	"expected_asset_count" integer NOT NULL,
	"job_ids" jsonb NOT NULL,
	"status" "campaign_status" DEFAULT 'generating' NOT NULL,
	"review_token" text NOT NULL,
	"client_note" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_review_token_unique" UNIQUE("review_token")
);--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "campaign_id" uuid;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
