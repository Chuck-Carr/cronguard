import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { Monitor, Ping, Alert } from '@/lib/types'
import { formatDateTime, formatDate } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/copy-button'
import { MonitorActions } from '@/components/monitor-actions'
import { AlertItem } from '@/components/alert-item'
import { PingsList } from '@/components/pings-list'
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

  const [monitor] = await sql<Monitor[]>`
    SELECT * FROM "Monitor"
    WHERE id = ${id} AND "userId" = ${session.user.id}
  `

  if (!monitor) {
    notFound()
  }

  // Fetch pings, alerts, and counts
  const [pings, alerts, [counts]] = await Promise.all([
    sql<Ping[]>`
      SELECT * FROM "Ping"
      WHERE "monitorId" = ${id}
      ORDER BY "pingedAt" DESC
      LIMIT 20
    `,
    sql<Alert[]>`
      SELECT * FROM "Alert"
      WHERE "monitorId" = ${id}
      ORDER BY "sentAt" DESC
      LIMIT 50
    `,
    sql<[{ pingCount: number, alertCount: number }]>`
      SELECT 
        (SELECT COUNT(*)::int FROM "Ping" WHERE "monitorId" = ${id}) as "pingCount",
        (SELECT COUNT(*)::int FROM "Alert" WHERE "monitorId" = ${id}) as "alertCount"
    `
  ])

  // Attach to monitor object
  const monitorWithData = {
    ...monitor,
    pings,
    alerts,
    _count: { pings: counts.pingCount, alerts: counts.alertCount }
  }

  // Group alerts by type and timestamp (within 5 seconds)
  const groupedAlerts = monitorWithData.alerts.reduce((groups: any[], alert) => {
    const lastGroup = groups[groups.length - 1]
    const alertTime = new Date(alert.sentAt).getTime()
    
    if (
      lastGroup && 
      lastGroup.type === alert.type && 
      Math.abs(new Date(lastGroup.sentAt).getTime() - alertTime) < 5000
    ) {
      // Add to existing group
      lastGroup.channels.push(alert.channel)
    } else {
      // Create new group
      groups.push({
        type: alert.type,
        sentAt: alert.sentAt,
        channels: [alert.channel]
      })
    }
    return groups
  }, [])

  // Take only the 10 most recent grouped alerts
  const recentGroupedAlerts = groupedAlerts.slice(0, 10)

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

  const pingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ping/${monitorWithData.pingUrl}`

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/monitors" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ← Back to Monitors
        </Link>
        
        <div className="flex items-start justify-between mt-4">
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(monitorWithData.status)}`} />
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {monitorWithData.name}
              </h1>
              {monitorWithData.paused ? (
                <span className="px-2 py-1 text-xs font-medium rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  PAUSED
                </span>
              ) : (
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(monitorWithData.status)}`}>
                  {monitorWithData.status}
                </span>
              )}
              {monitorWithData.tags && monitorWithData.tags.length > 0 && monitorWithData.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Created {formatDate(monitorWithData.createdAt)} ET
              {monitorWithData.paused && monitorWithData.pausedAt && (
                <span> • Paused {formatDate(monitorWithData.pausedAt)} ET</span>
              )}
            </p>
          </div>
          <MonitorActions monitorId={monitorWithData.id} monitorName={monitorWithData.name} isPaused={monitorWithData.paused} />
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
              Every {formatInterval(monitorWithData.intervalSeconds)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Grace Period</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {formatInterval(monitorWithData.gracePeriodSeconds)}
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Last Ping</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {monitorWithData.lastPingAt 
                  ? `${formatDateTime(monitorWithData.lastPingAt)} ET`
                  : 'Never'
                }
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Next Expected</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {monitorWithData.nextExpectedPingAt 
                  ? `${formatDateTime(monitorWithData.nextExpectedPingAt)} ET`
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
                  {monitorWithData._count.pings}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Alerts</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {monitorWithData._count.alerts}
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
          <CardTitle>Recent Pings ({monitorWithData.pings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PingsList pings={monitorWithData.pings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts ({recentGroupedAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGroupedAlerts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No alerts sent yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentGroupedAlerts.map((alert, index) => (
                <AlertItem
                  key={index}
                  type={alert.type}
                  sentAt={alert.sentAt}
                  channels={alert.channels}
                  monitorName={monitorWithData.name}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
