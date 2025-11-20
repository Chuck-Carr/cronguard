import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { Monitor, User, MonitorStatus } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getPlanLimits } from '@/lib/plan-limits'
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import { MonitorList } from '@/components/dashboard/monitor-list'

interface MonitorsPageProps {
  searchParams: Promise<{ status?: string; tag?: string }>
}

export default async function MonitorsPage({ searchParams }: MonitorsPageProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const params = await searchParams
  const statusFilter = params.status as MonitorStatus | undefined
  const tagFilter = params.tag
  const tagFilters = tagFilter ? (Array.isArray(tagFilter) ? tagFilter : [tagFilter]) : []

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
  let monitorsWithCount = monitors.map(m => ({
    ...m,
    _count: { pings: m.pingCount, alerts: m.alertCount }
  }))

  // Filter by status if specified
  if (statusFilter) {
    monitorsWithCount = monitorsWithCount.filter(m => m.status === statusFilter)
  }

  // Filter by tags if specified (monitors must have ALL selected tags)
  if (tagFilters.length > 0) {
    monitorsWithCount = monitorsWithCount.filter(m => 
      m.tags && tagFilters.every(tag => m.tags.includes(tag))
    )
  }

  // Get all unique tags for filter options
  const allTags = Array.from(new Set(monitors.flatMap(m => m.tags || []))).sort()

  const planLimits = getPlanLimits(user!.plan)
  const canCreateMore = planLimits.monitors === -1 || user!.monitorCount < planLimits.monitors

  const getFilterTitle = () => {
    if (tagFilters.length > 0) return `Tagged: ${tagFilters.join(' + ')}`
    if (!statusFilter) return 'All Monitors'
    return `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Monitors`
  }

  return (
    <div className="space-y-6">
      <AutoRefresh interval={5000} />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {getFilterTitle()}
            </h1>
            {(statusFilter || tagFilters.length > 0) && (
              <Badge 
                variant={
                  statusFilter === 'HEALTHY' ? 'success' :
                  statusFilter === 'LATE' ? 'warning' :
                  statusFilter === 'FAILED' ? 'danger' :
                  'default'
                }
                size="lg"
              >
                {monitorsWithCount.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              {user!.monitorCount} of {planLimits.monitors === -1 ? '∞' : planLimits.monitors} monitors used
            </p>
            {(statusFilter || tagFilters.length > 0) && (
              <>
                <span className="text-zinc-400">•</span>
                <Link 
                  href="/dashboard/monitors"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filter
                </Link>
              </>
            )}
          </div>
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

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Filter by tag:</span>
          {allTags.map(tag => {
            const isSelected = tagFilters.includes(tag)
            const newTagFilters = isSelected
              ? tagFilters.filter(t => t !== tag)
              : [...tagFilters, tag]
            const href = newTagFilters.length > 0
              ? `/dashboard/monitors?${newTagFilters.map(t => `tag=${encodeURIComponent(t)}`).join('&')}`
              : '/dashboard/monitors'
            
            return (
              <Link
                key={tag}
                href={href}
                className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                }`}
              >
                {tag}
              </Link>
            )
          })}
        </div>
      )}

      {monitorsWithCount.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {statusFilter === 'HEALTHY' && (
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {statusFilter === 'LATE' && (
                  <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {statusFilter === 'FAILED' && (
                  <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                )}
                {!statusFilter && (
                  <svg className="w-10 h-10 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                {statusFilter 
                  ? `No ${statusFilter.toLowerCase()} monitors`
                  : 'No monitors yet'
                }
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                {statusFilter
                  ? `You don't have any monitors in ${statusFilter.toLowerCase()} status.`
                  : 'Create your first monitor to start tracking your cron jobs.'
                }
              </p>
              {statusFilter ? (
                <Link href="/dashboard/monitors">
                  <Button variant="outline">View All Monitors</Button>
                </Link>
              ) : (
                <Link href="/dashboard/monitors/new">
                  <Button size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Monitor
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <MonitorList monitors={monitorsWithCount} tagFilters={tagFilters} />
      )}
    </div>
  )
}
