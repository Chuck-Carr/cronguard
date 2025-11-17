# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CronGuard is a SaaS cron job monitoring service built as a cheaper alternative to Cronitor. Users create monitors, get unique ping URLs, and receive alerts when their scheduled tasks fail or don't run on time. The project is designed for low operational costs with a focus on indie developer-friendly pricing.

**Tech Stack:** Next.js 14 (App Router), Prisma ORM, PostgreSQL (Supabase), NextAuth.js v5, Tailwind CSS, TypeScript

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database Commands
```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio to browse data
npx prisma studio

# Apply migrations in production
npx prisma migrate deploy
```

### Testing Individual Components
```bash
# Test a specific API endpoint
curl http://localhost:3000/api/monitors

# Test ping endpoint (replace <pingUrl> with actual monitor pingUrl)
curl http://localhost:3000/api/ping/<pingUrl>

# Manually trigger the cron checker (requires CRON_SECRET in .env)
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/check-monitors
```

## Architecture & Key Concepts

### Authentication Flow
- Uses NextAuth.js v5 with Credentials provider
- Passwords hashed with bcryptjs
- Session includes user ID and plan tier
- Auth config in `auth.ts`, custom types in `types/next-auth.d.ts`
- Protected routes check session via `await auth()` from `@/auth`

### Core Data Model
The system revolves around four main entities (see `prisma/schema.prisma`):

1. **User** - Accounts with plan tiers (FREE, STARTER, PRO, BUSINESS)
2. **Monitor** - Tracking configuration with unique `pingUrl` (auto-generated CUID)
3. **Ping** - Heartbeat records when monitors are pinged
4. **Alert** - Records of notifications sent (DOWN/RECOVERY via EMAIL/SLACK/SMS)

### Monitor Status Lifecycle
- **HEALTHY** → Monitor received ping within expected interval
- **LATE** → Past `nextExpectedPingAt` but within grace period
- **FAILED** → Grace period expired, alert sent
- **HEALTHY** (recovery) → Ping received after being FAILED, recovery alert sent

### Plan Limits System
Plan restrictions are enforced in `lib/plan-limits.ts`:
- Monitor count limits
- History retention days
- Feature flags (instant_alerts, webhooks, sms_alerts)
- Use `canCreateMonitor()` to check before creating monitors
- Business plan has unlimited monitors (limit: -1)

### Background Monitoring
The cron job checker (`app/api/cron/check-monitors/route.ts`) runs every minute via Vercel Cron (configured in `vercel.json`):
1. Finds monitors where `nextExpectedPingAt <= now`
2. Marks as LATE if within grace period
3. Marks as FAILED and sends alert if grace period expired
4. Detects recoveries and sends RECOVERY alerts

### Path Aliases
All imports use `@/` prefix mapping to project root (configured in `tsconfig.json`):
- `@/lib/prisma` - Prisma client singleton
- `@/auth` - NextAuth configuration
- `@/lib/plan-limits` - Plan limit utilities

## API Structure

All routes follow Next.js App Router conventions in `app/api/`:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login, callback, etc.)

### Monitors
- `GET /api/monitors` - List user's monitors (requires auth)
- `POST /api/monitors` - Create monitor (requires auth, checks plan limits)

### Pings
- `GET|POST /api/ping/[pingUrl]` - Receive heartbeat (public, no auth)
  - Updates `lastPingAt` and `nextExpectedPingAt`
  - Marks monitor as HEALTHY
  - Creates Ping record

### Cron Jobs
- `GET /api/cron/check-monitors` - Background checker (Vercel Cron only)
  - Requires `Authorization: Bearer ${CRON_SECRET}` header
  - Returns statistics: checked, markedLate, markedFailed, alertsSent

## Environment Configuration

Required `.env` variables (see `.env.example`):

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (get from Supabase)

**Auth:**
- `NEXTAUTH_URL` - Application URL (http://localhost:3000 in dev)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

**Not yet implemented (placeholders):**
- `RESEND_API_KEY` / `FROM_EMAIL` - Email alerts (TODO)
- `STRIPE_*` - Payment processing (TODO)
- `CRON_SECRET` - Optional, secures cron endpoint

## Current Implementation Status

### ✅ Implemented
- User registration API
- NextAuth authentication with sessions
- Monitor CRUD (create, list)
- Ping endpoint (GET/POST)
- Background checker for missed pings
- Plan-based limits enforcement
- Alert record creation (DOWN/RECOVERY)

### 🚧 Not Yet Implemented
- Email sending (`sendAlert()` in cron checker is a placeholder)
- Stripe payment integration
- Dashboard UI (login, monitors, activity)
- Webhook notifications (Slack/Discord)
- SMS alerts
- Monitor update/delete endpoints

## Development Workflow

When adding features:
1. **Update schema** - Modify `prisma/schema.prisma` if data model changes
2. **Generate Prisma client** - Run `npx prisma generate`
3. **Create migration** - Run `npx prisma migrate dev --name <description>`
4. **Check plan limits** - Use functions from `lib/plan-limits.ts` if feature is plan-gated
5. **Verify auth** - All user-specific endpoints should call `await auth()` and check session
6. **Test locally** - Use `npm run dev` and curl/Postman to test endpoints
7. **Lint before commit** - Run `npm run lint`

## Deployment Notes

- **Platform:** Vercel (configured with `vercel.json`)
- **Database:** Supabase PostgreSQL (or any PostgreSQL provider)
- **Cron:** Vercel Cron automatically runs `/api/cron/check-monitors` every minute in production
- **Environment:** Set all `.env` variables in Vercel dashboard before deploying
- **Migrations:** Run `npx prisma migrate deploy` after schema changes in production

## Common Patterns

### Creating Protected API Routes
```typescript
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ... your logic
}
```

### Checking Plan Limits
```typescript
import { canCreateMonitor, getPlanLimits } from "@/lib/plan-limits"

const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { _count: { select: { monitors: true } } }
})

if (!canCreateMonitor(user.plan, user._count.monitors)) {
  return NextResponse.json({ error: "Monitor limit reached" }, { status: 403 })
}
```

### Prisma Singleton Pattern
Always import Prisma client from `@/lib/prisma` (never create new instances):
```typescript
import { prisma } from "@/lib/prisma"
```

## Project Philosophy

This is an indie SaaS project optimized for:
- **Low costs** - Target 95%+ profit margins
- **Simplicity** - Zero-config monitoring setup
- **Competitive pricing** - Undercut Cronitor and similar services
- **Fast iteration** - MVP features first, polish later

See `PLAN.md` for complete project roadmap and business strategy.
