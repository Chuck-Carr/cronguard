import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/copy-button'
import { MonitorActions } from '@/components/monitor-actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface MonitorDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MonitorDetailPage({ params }: MonitorDetailPageProps) {
  const { id } = await params
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const monitor = await prisma.monitor.findFirst({
    where: {
      id,
      userId: session.user.id
    },
    include: {
      pings: {
        orderBy: { pingedAt: 'desc' },
        take: 20
      },
      alerts: {
        orderBy: { sentAt: 'desc' },
        take: 10
      },
      _count: {
        select: { pings: true, alerts: true }
      }
    }
  })

  if (!monitor) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-500'
      case 'LATE': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-zinc-500'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'LATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400'
    }
  }

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const pingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ping/${monitor.pingUrl}`

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/monitors" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ← Back to Monitors
        </Link>
        
        <div className="flex items-start justify-between mt-4">
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(monitor.status)}`} />
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {monitor.name}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(monitor.status)}`}>
                {monitor.status}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Created {new Date(monitor.createdAt).toLocaleDateString()}
            </p>
          </div>
          <MonitorActions monitorId={monitor.id} monitorName={monitor.name} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Expected Interval</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                Every {formatInterval(monitor.intervalSeconds)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Grace Period</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {formatInterval(monitor.gracePeriodSeconds)}
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Last Ping</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {monitor.lastPingAt 
                  ? new Date(monitor.lastPingAt).toLocaleString()
                  : 'Never'
                }
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Next Expected</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {monitor.nextExpectedPingAt 
                  ? new Date(monitor.nextExpectedPingAt).toLocaleString()
                  : 'N/A'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Pings</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {monitor._count.pings}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Alerts</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {monitor._count.alerts}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ping URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Add this URL to your cron job to send a heartbeat when it runs successfully:
          </p>
          <div className="flex gap-2">
            <code className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm font-mono text-zinc-900 dark:text-white break-all">
              {pingUrl}
            </code>
            <CopyButton text={pingUrl} />
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Example cron job:
            </p>
            <code className="text-xs text-blue-800 dark:text-blue-400 font-mono">
              0 2 * * * /scripts/backup.sh && curl {pingUrl}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Pings ({monitor.pings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {monitor.pings.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No pings recorded yet. Send your first ping to test the monitor.
            </div>
          ) : (
            <div className="space-y-2">
              {monitor.pings.map((ping) => (
                <div
                  key={ping.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        Ping received
                      </div>
                      {ping.message && (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {ping.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(ping.pingedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts ({monitor.alerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {monitor.alerts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No alerts sent yet.
            </div>
          ) : (
            <div className="space-y-2">
              {monitor.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${alert.type === 'DOWN' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {alert.type === 'DOWN' ? 'Monitor went down' : 'Monitor recovered'}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        via {alert.channel}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(alert.sentAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
