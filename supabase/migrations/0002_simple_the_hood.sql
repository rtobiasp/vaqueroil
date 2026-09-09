ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
UPDATE "users"
SET "email" = 'legacy-' || "id"::text || '@invalid.local'
WHERE "email" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");