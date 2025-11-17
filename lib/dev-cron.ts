// Development-only background cron checker
// This runs every minute to check for missed pings

let intervalId: NodeJS.Timeout | null = null

export function startDevCron() {
  // Only run in development
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  // Prevent multiple instances
  if (intervalId) {
    return
  }

  console.log('🔄 Starting development cron checker (runs every 60s)...')

  // Run immediately on start
  checkMonitors()

  // Then run every 60 seconds
  intervalId = setInterval(() => {
    checkMonitors()
  }, 60000)
}

export function stopDevCron() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.log('🛑 Stopped development cron checker')
  }
}

async function checkMonitors() {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] 🔍 Checking monitors...`)

  try {
    const response = await fetch('http://localhost:3000/api/cron/check-monitors', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'replace-with-random-secret'}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Check complete:`, data.results)
    } else {
      console.error('❌ Check failed:', response.status)
    }
  } catch (error) {
    // Server might not be ready yet
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      // Silently ignore connection errors during startup
    } else {
      console.error('❌ Error checking monitors:', error)
    }
  }
}
