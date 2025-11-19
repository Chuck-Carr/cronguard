# Rebrand: CronGuard → TaskAlive

**Date:** November 19, 2025  
**Reason:** CronGuard name already in use  
**New Brand:** TaskAlive  
**Domain:** taskalive.io (available)

## Changes Made

### Code Files Updated
- ✅ `package.json` - Project name
- ✅ `package-lock.json` - Project name
- ✅ `app/layout.tsx` - Page title and metadata
- ✅ `app/page.tsx` - Landing page branding and example URLs
- ✅ `app/login/page.tsx` - Login page header
- ✅ `app/signup/page.tsx` - Signup page header
- ✅ `app/forgot-password/page.tsx` - Password reset page header
- ✅ `app/reset-password/page.tsx` - Password reset page header
- ✅ `components/dashboard/nav.tsx` - Dashboard sidebar branding
- ✅ `app/api/auth/forgot-password/route.ts` - Password reset email content
- ✅ `lib/notifications.ts` - Email alerts and webhook footers
- ✅ `auth.ts` - TypeScript type fix (Plan type import)
- ✅ `next.config.ts` - Removed deprecated instrumentationHook

### Documentation Files Updated
- ✅ `README.md` - Project name, description, paths
- ✅ `WARP.md` - Project overview
- ✅ `PLAN.md` - All references
- ✅ `PROJECT_STATUS.md` - All references
- ✅ `NEXT_STEPS.md` - All references
- ✅ `QUICKSTART.md` - All references
- ✅ `NOTIFICATIONS-SETUP.md` - All references
- ✅ `setup-db.sh` - Script output messages

## Brand Details

### Old Brand
- **Name:** CronGuard
- **Domain:** cronguard.app (not available)
- **Tagline:** "Simple Cron Job Monitoring"

### New Brand
- **Name:** TaskAlive
- **Domain:** taskalive.io (available ~$30-50/year)
- **Tagline:** "Simple Cron Job Monitoring" (unchanged)
- **Alternative Domain:** gettaskalive.com (also available)

## URLs Updated
- Example ping URLs changed from:
  - `https://cronguard.app/ping/abc123`
  - To: `https://taskalive.io/ping/abc123`

- Email sender changed from:
  - `alerts@cronguard.app`
  - To: `alerts@taskalive.io`

## Verification

✅ Build tested: `npm run build` succeeds  
✅ No remaining "CronGuard" references in code  
✅ No remaining "cronguard" references in code (except folder name)  
✅ TypeScript compilation succeeds  
✅ All routes compile successfully

## Next Steps

1. **Register Domain:**
   - Buy taskalive.io domain ($30-50/year)
   - Optionally buy gettaskalive.com as redirect

2. **Environment Variables:**
   - Update `NEXTAUTH_URL` in production to use new domain
   - Update `FROM_EMAIL` to use @taskalive.io

3. **Deployment:**
   - Update Vercel project settings with new domain
   - Configure DNS settings
   - Update email DNS records (SPF, DKIM) for Resend

4. **Optional - Rename Folder:**
   ```bash
   cd ~/Projects
   mv cronguard-app taskalive-app
   ```

## Notes

- The project folder is still named `cronguard-app` - you can rename it manually if desired
- All internal references have been updated
- The rebrand is complete and ready for deployment
- No breaking changes to database schema or API structure
