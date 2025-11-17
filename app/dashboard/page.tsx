import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AutoRefresh } from '@/components/dashboard/auto-refresh'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const [monitors, user] = await Promise.all([
    prisma.monitor.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { pings: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
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

  const healthyCount = monitors.filter(m => m.status === 'HEALTHY').length
  const failedCount = monitors.filter(m => m.status === 'FAILED').length
  const lateCount = monitors.filter(m => m.status === 'LATE').length

  return (
    <div className="space-y-8">
      <AutoRefresh interval={5000} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Welcome back! Here's an overview of your monitors.
          </p>
        </div>
        <Link href="/dashboard/monitors/new">
          <Button>Create Monitor</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Monitors
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
              {user?._count.monitors || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Healthy
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500 mt-2">
              {healthyCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Late
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-2">
              {lateCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Failed
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-500 mt-2">
              {failedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Monitors</CardTitle>
            <Link href="/dashboard/monitors">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {monitors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-zinc-500 dark:text-zinc-400 mb-4">
                No monitors yet. Create your first monitor to get started.
              </div>
              <Link href="/dashboard/monitors/new">
                <Button>Create Monitor</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {monitors.map((monitor) => (
                <Link
                  key={monitor.id}
                  href={`/dashboard/monitors/${monitor.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${monitor.status === 'HEALTHY' ? 'bg-green-500' : ''}
                        ${monitor.status === 'LATE' ? 'bg-yellow-500' : ''}
                        ${monitor.status === 'FAILED' ? 'bg-red-500' : ''}
                      `} />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-white">
                          {monitor.name}
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {monitor._count.pings} pings • 
                          {monitor.lastPingAt 
                            ? ` Last ping ${new Date(monitor.lastPingAt).toLocaleString()}`
                            : ' Never pinged'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {monitor.status}
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
