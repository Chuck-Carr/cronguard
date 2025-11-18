-- Add alertEmails column to Monitor table
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "alertEmails" TEXT;
