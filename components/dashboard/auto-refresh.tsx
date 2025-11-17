'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Monitor {
  id: string
  name: string
  status: string
  lastPingAt: Date | null
  nextExpectedPingAt: Date | null
  intervalSeconds: number
  _count: {
    pings: number
    alerts: number
  }
}

export function AutoRefresh({ 
  interval = 5000, // Check every 5 seconds for real-time feel
  onUpdate 
}: { 
  interval?: number
  onUpdate?: (monitors: Monitor[]) => void 
}) {
  const router = useRouter()
  const [lastStatus, setLastStatus] = useState<string>('')

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('/api/monitors/status')
        if (response.ok) {
          const data = await response.json()
          const currentStatus = JSON.stringify(data.monitors.map((m: Monitor) => ({
            id: m.id,
            status: m.status,
            lastPingAt: m.lastPingAt
          })))
          
          // Only refresh if something changed
          if (lastStatus && currentStatus !== lastStatus) {
            console.log('📊 Monitor status changed, refreshing dashboard...')
            router.refresh()
            if (onUpdate) {
              onUpdate(data.monitors)
            }
          }
          
          setLastStatus(currentStatus)
        }
      } catch (error) {
        console.error('Error checking monitor status:', error)
      }
    }

    // Check immediately
    checkForUpdates()

    // Then check periodically
    const intervalId = setInterval(checkForUpdates, interval)

    return () => clearInterval(intervalId)
  }, [router, interval, lastStatus, onUpdate])

  return null
}
