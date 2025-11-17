# CronGuard

A simple, affordable cron job monitoring service built with Next.js 14, Prisma, and PostgreSQL.

## Project Overview

CronGuard is a SaaS application that monitors scheduled tasks (cron jobs) and alerts users when jobs fail or don't run on schedule. It's designed to be a cheaper, simpler alternative to services like Cronitor.

See `PLAN.md` for the complete project breakdown and roadmap.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Email:** Resend (to be integrated)
- **Payments:** Stripe (to be integrated)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone and navigate to the project:
```bash
cd ~/Projects/cronguard-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other configuration:
- Get a free PostgreSQL database from [Supabase](https://supabase.com)
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
cronguard-app/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── monitors/      # Monitor CRUD
│   │   ├── ping/          # Ping endpoint for cron jobs
│   │   └── cron/          # Background checker job
│   └── page.tsx           # Landing page
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── plan-limits.ts     # Plan feature limits
├── prisma/
│   └── schema.prisma      # Database schema
├── auth.ts                # NextAuth config
├── PLAN.md                # Project plan & roadmap
└── README.md              # This file
```

## Core Features

### ✅ Implemented
- Database schema (Users, Monitors, Pings, Alerts)
- User registration API
- NextAuth authentication
- Monitor CRUD API
- Ping endpoint (GET/POST)
- Background checker for missed pings
- Plan-based limits
- Landing page

### 🚧 To Do
- [ ] Login/Signup UI pages
- [ ] Dashboard UI
- [ ] Monitor management UI
- [ ] Email alerts (Resend integration)
- [ ] Stripe payment integration
- [ ] Webhook notifications (Slack/Discord)
- [ ] SMS alerts (Twilio)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Monitors
- `GET /api/monitors` - List user's monitors
- `POST /api/monitors` - Create new monitor

### Pings
- `GET /api/ping/[pingUrl]` - Receive heartbeat (also accepts POST)

### Cron Jobs
- `GET /api/cron/check-monitors` - Check for missed pings (called by Vercel Cron)

## Usage Example

1. Create a monitor via API or dashboard (coming soon)
2. Get your unique ping URL (e.g., `https://yourapp.vercel.app/ping/abc123`)
3. Add it to your cron job:

```bash
# Run backup every day at 2am
0 2 * * * /scripts/backup.sh && curl https://yourapp.vercel.app/ping/abc123
```

4. Get alerted by email if the job fails or doesn't run

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

The cron job checker will automatically run every minute via Vercel Cron (configured in `vercel.json`).

### Database

Use Supabase for PostgreSQL:
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database
3. Add to `DATABASE_URL` in environment variables

## Contributing

This is a personal project for generating passive income. See `PLAN.md` for the development roadmap.

## License

MIT
