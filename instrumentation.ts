// This file is automatically called by Next.js when the server starts
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Start development cron checker
    const { startDevCron } = await import('./lib/dev-cron')
    startDevCron()
  }
}
