-- Add pause and tags columns to Monitor table
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "paused" BOOLEAN DEFAULT false;
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP;
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';

-- Add index for paused field for faster queries
CREATE INDEX IF NOT EXISTS "Monitor_paused_idx" ON "Monitor"("paused");
