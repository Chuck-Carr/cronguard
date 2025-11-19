# Email & Webhook Notifications Setup

## Status: ✅ Code Complete

All notification code is implemented. Here's what you need to do to enable them:

## 1. Database Setup (REQUIRED)

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "slackWebhookUrl" TEXT;
ALTER TABLE "Monitor" ADD COLUMN IF NOT EXISTS "discordWebhookUrl" TEXT;
```

Or run: `add-webhooks.sql` file in the SQL editor.

## 2. Email Setup (Resend)

### Sign up for Resend
1. Go to https://resend.com
2. Create account (3,000 emails/month FREE)
3. Get your API key from dashboard

### Add to .env
```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
FROM_EMAIL="alerts@yourdomain.com"  # Or use resend's test email
```

**Note**: For testing, you can use Resend's test domain: `onboarding@resend.dev`

## 3. Webhook Setup (Slack/Discord)

### For Users - How to Get Webhook URLs

**Slack:**
1. Go to https://api.slack.com/apps
2. Create New App → From Scratch
3. Add "Incoming Webhooks" feature
4. Create webhook for a channel
5. Copy webhook URL (starts with `https://hooks.slack.com/`)

**Discord:**
1. Go to Server Settings → Integrations → Webhooks
2. Click "New Webhook"
3. Choose channel, copy webhook URL

### For You (Developer)
No setup needed! Webhooks are just HTTP POST requests. Users paste their webhook URLs into TaskAlive.

## 4. Test It

### Test Email
1. Set `RESEND_API_KEY` in .env
2. Let a monitor go FAILED
3. Check email

### Test Webhooks
1. Run SQL to add webhook columns
2. Manually add webhook URL to a monitor in database:
   ```sql
   UPDATE "Monitor" 
   SET "discordWebhookUrl" = 'https://discord.com/api/webhooks/...' 
   WHERE id = 'your-monitor-id';
   ```
3. Let monitor fail or ping it to recover
4. Check Discord/Slack channel

## What's Implemented

✅ Email alerts (DOWN + RECOVERY) with HTML templates
✅ Discord webhooks with colored embeds
✅ Slack webhooks with rich blocks
✅ Plan-based access control (webhooks require STARTER+)
✅ Error handling (failures don't crash cron checker)
✅ Alert tracking in database

## What's NOT Implemented

❌ SMS alerts (Twilio) - Will add later for PRO+ tier
❌ UI for users to configure webhooks - Need to build settings page
❌ Webhook URL validation
❌ Test webhook button

## Next Steps

1. **Add webhook fields to database** (run the SQL above)
2. **Get Resend API key** and add to .env
3. **Build UI** for webhook configuration in monitor settings
4. **Test** with real monitors

## Files Modified

- ✅ `lib/notifications.ts` - Email + webhook functions
- ✅ `app/api/cron/check-monitors/route.ts` - Wired up to send alerts
- ✅ `prisma/schema.prisma` - Added webhook URL fields
- ✅ Installed `resend` package
