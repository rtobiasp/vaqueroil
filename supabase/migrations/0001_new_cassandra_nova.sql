ALTER TABLE "vehicles"
ALTER COLUMN "year" SET DATA TYPE integer
USING EXTRACT(YEAR FROM "year")::integer;