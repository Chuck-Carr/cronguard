# Pause and Tags Feature Implementation

This document describes the new pause and tags features added to TaskAlive.

## Features Implemented

### 1. **Pause/Unpause Monitors**
Monitors can now be paused to temporarily stop monitoring without deleting them. When a monitor is paused:
- It will not be checked by the cron job checker
- No alerts will be sent for missed pings
- The `pausedAt` timestamp records when it was paused
- Paused monitors are excluded from both DOWN and RECOVERY alert checks

**Database fields:**
- `paused` (BOOLEAN, default: false)
- `pausedAt` (TIMESTAMP, nullable)

**API Usage:**
```bash
# Pause a monitor
curl -X PATCH http://localhost:3000/api/monitors/{id} \
  -H "Content-Type: application/json" \
  -d '{"paused": true}'

# Unpause a monitor
curl -X PATCH http://localhost:3000/api/monitors/{id} \
  -H "Content-Type: application/json" \
  -d '{"paused": false}'
```

### 2. **Monitor Tags**
Monitors can be tagged for organization and filtering. Tags are stored as an array of strings.

**Database field:**
- `tags` (TEXT[], default: [])

**API Usage:**
```bash
# Create monitor with tags
curl -X POST http://localhost:3000/api/monitors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API",
    "intervalSeconds": 3600,
    "tags": ["production", "api", "critical"]
  }'

# Update monitor tags
curl -X PATCH http://localhost:3000/api/monitors/{id} \
  -H "Content-Type: application/json" \
  -d '{"tags": ["staging", "api"]}'
```

### 3. **Alert Email Changes** (BREAKING CHANGE)
Email alerts are now **only** sent to addresses specified in the `alertEmails` field. The user's account email is **no longer** automatically included.

**Before:**
- Alerts sent to user's account email + any additional emails in `alertEmails`

**After:**
- Alerts only sent to emails in `alertEmails` field
- If `alertEmails` is empty/null, NO email alerts will be sent

**Migration for existing users:**
Existing monitors should have their `alertEmails` field updated to include the user's email if they want to continue receiving alerts.

```sql
-- Add user's email to alertEmails for existing monitors
UPDATE "Monitor" m
SET "alertEmails" = u.email
FROM "User" u
WHERE m."userId" = u.id 
  AND (m."alertEmails" IS NULL OR m."alertEmails" = '');
```

## Database Migration

To apply the database changes, run:

```bash
node run-migration.js
```

Or manually execute the SQL file:

```bash
psql $DATABASE_URL -f add-pause-and-tags.sql
```

## API Reference

### GET /api/monitors
Returns all monitors for the authenticated user, now including `paused`, `pausedAt`, and `tags` fields.

### POST /api/monitors
Create a new monitor with optional `tags` array.

**Request body:**
```json
{
  "name": "My Monitor",
  "intervalSeconds": 3600,
  "gracePeriodSeconds": 300,
  "alertEmails": "alerts@example.com,dev@example.com",
  "tags": ["production", "critical"],
  "slackWebhookUrl": "https://hooks.slack.com/...",
  "discordWebhookUrl": "https://discord.com/api/webhooks/...",
  "teamsWebhookUrl": "https://outlook.office.com/webhook/..."
}
```

### PATCH /api/monitors/[id]
Update a monitor, including pause state and tags.

**Request body (all fields optional):**
```json
{
  "name": "Updated Name",
  "intervalSeconds": 7200,
  "gracePeriodSeconds": 600,
  "alertEmails": "new-email@example.com",
  "paused": true,
  "tags": ["staging", "api"],
  "slackWebhookUrl": null,
  "discordWebhookUrl": "https://discord.com/...",
  "teamsWebhookUrl": null
}
```

## TypeScript Types

The `Monitor` interface has been updated:

```typescript
export interface Monitor {
  // ... existing fields
  paused: boolean
  pausedAt: Date | null
  tags: string[]
  // ... other fields
}
```

## Implementation Notes

1. **Paused monitors** are completely excluded from the cron checker queries using `WHERE m.paused = false`
2. **Tags** are stored as PostgreSQL TEXT[] arrays and validated/sanitized on input
3. **Alert emails** must now be explicitly configured; the account email is no longer a fallback
4. **Index added** on `paused` field for efficient querying

## Use Cases

### Pause Monitors
- Scheduled maintenance windows
- Temporary disabling without losing configuration
- Testing/debugging scenarios
- Monitors for services that are temporarily offline

### Tags
- Organize by environment: `production`, `staging`, `development`
- Organize by service type: `api`, `cron`, `database`, `frontend`
- Organize by priority: `critical`, `high`, `medium`, `low`
- Organize by team: `backend-team`, `frontend-team`, `devops`

## Future Enhancements

Potential improvements to consider:
- UI for managing paused monitors (filter, bulk pause/unpause)
- UI for tag filtering and search
- Auto-pause monitors during scheduled maintenance windows
- Tag-based notification routing (different emails per tag)
- Tag-based dashboards and grouping
