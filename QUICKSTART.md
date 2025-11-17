# Quick Start Guide

Get CronGuard running in under 20 minutes.

## Step 1: Database Setup (5 min)

### Option A: Supabase (Recommended - Free)
1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project" and create an account
3. Create a new project (pick a name, password, region)
4. Wait 2-3 minutes for project to provision
5. Go to Settings > Database
6. Copy the "Connection string" under "Connection pooling"
7. Paste it into `.env` as `DATABASE_URL`

### Option B: Local PostgreSQL
```bash
# Install PostgreSQL if needed (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb cronguard

# Update .env
DATABASE_URL="postgresql://localhost:5432/cronguard"
```

## Step 2: Generate Auth Secret (30 sec)

```bash
openssl rand -base64 32
```

Copy the output and paste it into `.env` as `NEXTAUTH_SECRET`

## Step 3: Run Migrations (2 min)

```bash
cd ~/Projects/cronguard-app
npx prisma migrate dev --name init
npx prisma generate
```

You should see "Your database is now in sync with your schema."

## Step 4: Start Development Server (1 min)

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the landing page!

## Step 5: Test the API (5 min)

### Create a test user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

### Create a monitor

First, get your session by logging in via the app (UI coming soon), or use the API directly.

For now, you can test the ping endpoint without auth:

1. Check the database for a monitor's ping URL:
```bash
npx prisma studio
```

2. Open browser to http://localhost:5555
3. Navigate to Monitor table
4. Copy a `pingUrl` value

5. Test ping:
```bash
curl http://localhost:3000/api/ping/[your-ping-url]
```

You should see: `{"success":true,"message":"Ping received",...}`

## Step 6: What's Next?

Check `NEXT_STEPS.md` for:
- Building the dashboard UI
- Setting up email alerts
- Deploying to Vercel
- Adding Stripe payments

## Troubleshooting

### "Can't connect to database"
- Make sure your DATABASE_URL is correct
- For Supabase, use the "Connection pooling" string, not "Direct connection"
- Check your database is running (if local)

### "Module not found" errors
```bash
npm install
```

### Prisma errors
```bash
npx prisma generate
npx prisma migrate reset  # Warning: deletes all data
```

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

## Need Help?

- Check the README.md
- Review PLAN.md for architecture details
- Read NEXT_STEPS.md for roadmap

---

**Pro tip:** Open `NEXT_STEPS.md` and `PLAN.md` in separate tabs - they have all the context you need!
