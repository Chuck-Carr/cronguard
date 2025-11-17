# CronGuard - Cron Job Monitoring Service

## Project Overview
A simpler, cheaper alternative to Cronitor for monitoring scheduled tasks and cron jobs.

## Core Features (MVP)

### Dashboard
- Create monitors with name, expected interval (hourly/daily/weekly/custom)
- Get unique ping URL per monitor
- View monitor status (healthy/late/failed)
- Basic activity log (last 10 pings)

### Ping Endpoint
- Simple GET/POST to receive heartbeats
- Record timestamp, optionally accept status message
- Mark monitor as healthy

### Alerting
- Check monitors every minute for missed pings
- Send email alerts when monitors go down
- Send recovery notification when back up
- Optional: Slack/Discord webhooks

### User Management
- Email/password auth
- Stripe integration for subscriptions
- Usage limits based on plan

## Tech Stack (Keep Costs Low)

**Frontend:** Next.js 14 (App Router)
- Free hosting on Vercel
- Fast, modern, SEO-friendly

**Backend:** Next.js API routes + PostgreSQL
- All-in-one deployment
- Vercel serverless functions (free tier = 100k invocations/mo)

**Database:** Supabase (PostgreSQL)
- Free tier: 500MB, 2GB bandwidth
- Upgrade to $25/mo when needed
- Built-in auth option

**Email:** Resend or AWS SES
- Resend: 3k emails/mo free, then $1/10k
- Super cheap for alerts

**Payments:** Stripe
- 2.9% + $0.30 per transaction
- Standard, reliable

**Monitoring Job:** Vercel Cron or Supabase Edge Functions
- Check for missed pings every minute
- Free on Vercel

### Monthly Cost Projection (First 100 customers)
- Hosting: $0 (Vercel free tier)
- Database: $0-25 (Supabase)
- Email: ~$2-5
- Stripe fees: ~$15 (on $500 revenue)
- **Total: $17-45/mo = 95%+ profit margin**

## Pricing Strategy (Undercut Cronitor)

### Free Tier
- 3 monitors
- Email alerts only
- 24-hour alert delay
- Get people hooked

### Starter - $5/mo
- 20 monitors
- Instant email alerts
- 30-day history
- Slack/Discord webhooks

### Pro - $12/mo
- 100 monitors
- SMS alerts (Twilio pay-as-you-go)
- 90-day history
- Multiple team members

### Business - $25/mo
- Unlimited monitors
- Priority support
- 1-year history
- API access

*Compare: Cronitor starts at $10/mo for 10 monitors*

## Competitive Advantages

### 1. Zero Configuration
- No complex setup—create monitor, get URL, done
- Auto-detect interval from first few pings
- Smart defaults everywhere

### 2. Modern UX
- Real-time updates (no page refresh)
- Dark mode
- Mobile-responsive
- Clean, minimal interface

### 3. Developer Experience
- Clear documentation
- Code examples for all languages
- CLI tool for setup
- GitHub Action integration

### 4. Smart Alerting
- Grace periods (don't alert if 2 mins late on daily job)
- Alert escalation (email → Slack → SMS)
- Timezone-aware notifications
- Smart grouping (don't spam if 10 monitors fail at once)

### 5. Indie-Friendly
- Transparent pricing
- No hidden fees
- Generous free tier
- Fast support (you responding = competitive advantage)

## Development Timeline

### Week 1: Core Functionality
- Database schema
- Auth system
- Create/list monitors
- Ping endpoint
- Basic dashboard

### Week 2: Monitoring & Alerts
- Background job to check monitors
- Email alert system
- Monitor status logic
- Alert history

### Week 3: Polish & Payments
- Stripe integration
- Plan limits
- UI polish
- Error handling

### Week 4: Launch Prep
- Documentation
- Landing page
- Test with beta users
- Deploy to production

## Marketing Strategy (Get to $500/mo)

### Launch Channels
- Post on Hacker News "Show HN"
- Reddit: r/selfhosted, r/devops, r/sysadmin
- Product Hunt
- Indie Hackers

### Content Marketing
- "Why we built a cheaper Cronitor alternative"
- Technical blog posts about monitoring
- Tweet storm about the build

### SEO Keywords
- "cronitor alternative"
- "cheap cron monitoring"
- "free cron job monitoring"

**Target: 50 customers @ $10 avg = $500/mo**

## MVP Feature Cut

### Skip for v1:
- Status pages
- Detailed metrics/graphs
- Incident management
- Multiple notification channels per monitor
- Full API (unless trivial)

### Add After First Revenue:
- Advanced metrics and dashboards
- Status pages
- Team collaboration features
- Mobile app
- On-call scheduling

## Database Schema

### Users
- id
- email
- password_hash
- plan (free/starter/pro/business)
- stripe_customer_id
- stripe_subscription_id
- created_at
- updated_at

### Monitors
- id
- user_id
- name
- ping_url (unique)
- interval_seconds
- grace_period_seconds
- status (healthy/late/failed)
- last_ping_at
- next_expected_ping_at
- created_at
- updated_at

### Pings
- id
- monitor_id
- pinged_at
- message (optional)
- ip_address

### Alerts
- id
- monitor_id
- type (down/recovery)
- sent_at
- channel (email/slack/sms)

## Next Steps

1. Initialize Next.js project
2. Set up Prisma + Supabase
3. Build authentication
4. Create monitor CRUD
5. Implement ping endpoint
6. Build checker service
7. Add email alerts
8. Integrate Stripe
9. Deploy to Vercel
10. Launch!
