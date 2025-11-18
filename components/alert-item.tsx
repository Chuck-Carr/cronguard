'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { formatDateTime } from '@/lib/date-utils'

interface AlertItemProps {
  type: 'DOWN' | 'RECOVERY'
  sentAt: Date
  channels: string[]
  monitorName: string
}

export function AlertItem({ type, sentAt, channels, monitorName }: AlertItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return '📧'
      case 'SLACK': return '💬'
      case 'DISCORD': return '💬'
      case 'TEAMS': return '👥'
      case 'SMS': return '📱'
      default: return '📢'
    }
  }

  return (
    <div className="py-3 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${type === 'DOWN' ? 'bg-red-500' : 'bg-green-500'}`} />
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              {type === 'DOWN' ? `${monitorName} went down` : `${monitorName} recovered`}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {channels.length} channel{channels.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDateTime(sentAt)} ET
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Sent via:
          </div>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <span>{getChannelIcon(channel)}</span>
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
