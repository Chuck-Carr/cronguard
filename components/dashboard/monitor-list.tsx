'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/date-utils'
import { Monitor } from '@/lib/types'

interface MonitorWithCount extends Monitor {
  _count: { pings: number; alerts: number }
}

interface MonitorListProps {
  monitors: MonitorWithCount[]
  tagFilters: string[]
}

export function MonitorList({ monitors, tagFilters }: MonitorListProps) {
  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  return (
    <div className="space-y-3">
      {monitors.map((monitor) => (
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
                    {monitor.paused ? (
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>

                  {/* Monitor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate">
                        {monitor.name}
                      </h3>
                      {monitor.paused ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                          PAUSED
                        </span>
                      ) : (
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${monitor.status === 'HEALTHY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${monitor.status === 'LATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${monitor.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}>
                          {monitor.status}
                        </span>
                      )}
                      {monitor.tags && monitor.tags.length > 0 && monitor.tags.map((tag: string) => {
                        const isSelected = tagFilters.includes(tag)
                        const newTagFilters = isSelected
                          ? tagFilters.filter(t => t !== tag)
                          : [...tagFilters, tag]
                        const href = newTagFilters.length > 0
                          ? `/dashboard/monitors?${newTagFilters.map(t => `tag=${encodeURIComponent(t)}`).join('&')}`
                          : '/dashboard/monitors'
                        
                        return (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.location.href = href
                            }}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                            }`}
                          >
                            {tag}
                          </button>
                        )
                      })}
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
  )
}
