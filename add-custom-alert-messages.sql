-- Add custom alert message fields to Monitor table
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "customDownMessage" TEXT;
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "customRecoveryMessage" TEXT;
