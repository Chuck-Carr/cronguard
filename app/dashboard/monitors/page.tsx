import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
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

  const [monitors, user] = await Promise.all([
    prisma.monitor.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { pings: true, alerts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: { monitors: true }
        }
      }
    })
  ])

  const planLimits = getPlanLimits(user!.plan)
  const canCreateMore = planLimits.monitors === -1 || user!._count.monitors < planLimits.monitors

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
            {user!._count.monitors} of {planLimits.monitors === -1 ? '∞' : planLimits.monitors} monitors used
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

      {monitors.length === 0 ? (
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
        <div className="grid gap-4">
          {monitors.map((monitor) => (
            <Card key={monitor.id}>
              <CardContent className="p-6">
                <Link href={`/dashboard/monitors/${monitor.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(monitor.status)}`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {monitor.name}
                          </h3>
                          <span className={`
                            px-2 py-0.5 text-xs font-medium rounded
                            ${monitor.status === 'HEALTHY' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                            ${monitor.status === 'LATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                            ${monitor.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                          `}>
                            {monitor.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-zinc-500 dark:text-zinc-400">Interval</div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              Every {formatInterval(monitor.intervalSeconds)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-zinc-500 dark:text-zinc-400">Last Ping</div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {monitor.lastPingAt 
                                ? new Date(monitor.lastPingAt).toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </div>

                          <div>
                            <div className="text-zinc-500 dark:text-zinc-400">Total Pings</div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {monitor._count.pings}
                            </div>
                          </div>

                          <div>
                            <div className="text-zinc-500 dark:text-zinc-400">Alerts Sent</div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {monitor._count.alerts}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      View →
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
