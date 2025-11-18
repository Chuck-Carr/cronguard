import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { Monitor, User } from '@/lib/types'
import { formatDateTime } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPlanLimits } from '@/lib/plan-limits'
import { AutoRefresh } from '@/components/dashboard/auto-refresh'

export default async function MonitorsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const [monitors, [user]] = await Promise.all([
    sql<(Monitor & { pingCount: number, alertCount: number })[]>`
      SELECT m.*, 
             COUNT(DISTINCT p.id)::int as "pingCount",
             COUNT(DISTINCT a.id)::int as "alertCount"
      FROM "Monitor" m
      LEFT JOIN "Ping" p ON p."monitorId" = m.id
      LEFT JOIN "Alert" a ON a."monitorId" = m.id
      WHERE m."userId" = ${session.user.id}
      GROUP BY m.id
      ORDER BY m."createdAt" DESC
    `,
    sql<(User & { monitorCount: number })[]>`
      SELECT u.*, COUNT(m.id)::int as "monitorCount"
      FROM "User" u
      LEFT JOIN "Monitor" m ON m."userId" = u.id
      WHERE u.id = ${session.user.id}
      GROUP BY u.id
    `
  ])

  // Transform to match expected format
  const monitorsWithCount = monitors.map(m => ({
    ...m,
    _count: { pings: m.pingCount, alerts: m.alertCount }
  }))

  const planLimits = getPlanLimits(user!.plan)
  const canCreateMore = planLimits.monitors === -1 || user!.monitorCount < planLimits.monitors

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-500'
      case 'LATE': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-zinc-500'
    }
  }

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  return (
    <div className="space-y-6">
      <AutoRefresh interval={5000} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Monitors
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {user!.monitorCount} of {planLimits.monitors === -1 ? '∞' : planLimits.monitors} monitors used
          </p>
        </div>
        {canCreateMore ? (
          <Link href="/dashboard/monitors/new">
            <Button>Create Monitor</Button>
          </Link>
        ) : (
          <Button disabled>
            Monitor Limit Reached
          </Button>
        )}
      </div>

      {monitorsWithCount.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="text-zinc-500 dark:text-zinc-400 mb-4">
                No monitors yet. Create your first monitor to start tracking your cron jobs.
              </div>
              <Link href="/dashboard/monitors/new">
                <Button>Create Monitor</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {monitorsWithCount.map((monitor) => (
            <Link
              key={monitor.id}
              href={`/dashboard/monitors/${monitor.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status Icon */}
                      <div className="relative">
                        {monitor.status === 'HEALTHY' && (
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                        {monitor.status === 'LATE' && (
                          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {monitor.status === 'FAILED' && (
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Monitor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate">
                            {monitor.name}
                          </h3>
                          <span className={`
                            px-2 py-0.5 text-xs font-medium rounded-full
                            ${monitor.status === 'HEALTHY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                            ${monitor.status === 'LATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                            ${monitor.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                          `}>
                            {monitor.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>Every {formatInterval(monitor.intervalSeconds)}</span>
                          <span>•</span>
                          <span>
                            {monitor.lastPingAt 
                              ? `Last: ${formatDateTime(monitor.lastPingAt)} ET`
                              : 'Never pinged'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Pings</div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {monitor._count.pings}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Alerts</div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {monitor._count.alerts}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
