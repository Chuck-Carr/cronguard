-- Add webhook URL columns to Monitor table
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "slackWebhookUrl" TEXT;
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "discordWebhookUrl" TEXT;
