'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatDateTime } from '@/lib/date-utils'

interface Ping {
  id: string
  pingedAt: Date
  message: string | null
}

interface PingsListProps {
  pings: Ping[]
}

export function PingsList({ pings }: PingsListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (pings.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No pings recorded yet. Send your first ping to test the monitor.
      </div>
    )
  }

  const displayedPings = isExpanded ? pings : pings.slice(0, 1)

  return (
    <div className="space-y-2">
      {displayedPings.map((ping) => (
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
            {formatDateTime(ping.pingedAt)} ET
          </div>
        </div>
      ))}
      
      {pings.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show {pings.length - 1} more ping{pings.length - 1 !== 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </div>
  )
}
