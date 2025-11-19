import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { Monitor, User } from '@/lib/types'
import { formatDateTime } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const [monitors, [user]] = await Promise.all([
    sql<(Monitor & { pingCount: number })[]>`
      SELECT m.*, COUNT(p.id)::int as "pingCount"
      FROM "Monitor" m
      LEFT JOIN "Ping" p ON p."monitorId" = m.id
      WHERE m."userId" = ${session.user.id}
      GROUP BY m.id
      ORDER BY m."createdAt" DESC
      LIMIT 5
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
    _count: { pings: m.pingCount }
  }))

  const healthyCount = monitorsWithCount.filter(m => m.status === 'HEALTHY').length
  const failedCount = monitorsWithCount.filter(m => m.status === 'FAILED').length
  const lateCount = monitorsWithCount.filter(m => m.status === 'LATE').length

  return (
    <div className="space-y-8 animate-fade-in">
      <AutoRefresh interval={5000} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">
            Welcome back! Here's an overview of your monitors.
          </p>
        </div>
        <Link href="/dashboard/monitors/new">
          <Button size="lg" className="group">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Monitor
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Monitors */}
        <Link href="/dashboard/monitors" className="block">
          <Card hover gradient className="group cursor-pointer">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Total Monitors
              </div>
              <div className="text-4xl font-black text-zinc-900 dark:text-white">
                {user?.monitorCount || 0}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Healthy */}
        <Link href="/dashboard/monitors?status=HEALTHY" className="block">
          <Card hover gradient className="group cursor-pointer">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Healthy
              </div>
              <div className="text-4xl font-black text-green-600 dark:text-green-500">
                {healthyCount}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Late */}
        <Link href="/dashboard/monitors?status=LATE" className="block">
          <Card hover gradient className="group cursor-pointer">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Late
              </div>
              <div className="text-4xl font-black text-yellow-600 dark:text-yellow-500">
                {lateCount}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Failed */}
        <Link href="/dashboard/monitors?status=FAILED" className="block">
          <Card hover gradient className="group cursor-pointer">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-950 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Failed
              </div>
              <div className="text-4xl font-black text-red-600 dark:text-red-500">
                {failedCount}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Monitors List */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Monitors</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Your latest monitored tasks</p>
            </div>
            <Link href="/dashboard/monitors">
              <Button variant="ghost" size="sm" className="group">
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {monitorsWithCount.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                No monitors yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                Create your first monitor to start tracking your scheduled tasks.
              </p>
              <Link href="/dashboard/monitors/new">
                <Button size="lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Monitor
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {monitorsWithCount.map((monitor) => (
                <Link
                  key={monitor.id}
                  href={`/dashboard/monitors/${monitor.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 hover:shadow-lg transition-all duration-200 group-hover:scale-[1.01]">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status Indicator */}
                      <div className="relative">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${monitor.status === 'HEALTHY' ? 'bg-green-100 dark:bg-green-950' : ''}
                          ${monitor.status === 'LATE' ? 'bg-yellow-100 dark:bg-yellow-950' : ''}
                          ${monitor.status === 'FAILED' ? 'bg-red-100 dark:bg-red-950' : ''}
                        `}>
                          {monitor.status === 'HEALTHY' && (
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {monitor.status === 'LATE' && (
                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {monitor.status === 'FAILED' && (
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Monitor Info */}
                      <div className="flex-1">
                        <div className="font-bold text-zinc-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {monitor.name}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            {monitor._count.pings} pings
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {monitor.lastPingAt 
                              ? `Last ping ${formatDateTime(monitor.lastPingAt)} ET`
                              : 'Never pinged'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                      <Badge 
                        variant={
                          monitor.status === 'HEALTHY' ? 'success' :
                          monitor.status === 'LATE' ? 'warning' :
                          'danger'
                        }
                        size="md"
                        pulse={monitor.status !== 'HEALTHY'}
                      >
                        {monitor.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
