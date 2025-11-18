// Format dates consistently in Eastern Time (ET)
const TIMEZONE = 'America/New_York'

export function formatDateTime(date: Date | string | null): string {
  if (!date) return 'Never'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  return d.toLocaleString('en-US', {
    timeZone: TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDate(date: Date | string | null): string {
  if (!date) return 'Never'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  return d.toLocaleDateString('en-US', {
    timeZone: TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatTime(date: Date | string | null): string {
  if (!date) return 'Never'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  return d.toLocaleTimeString('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
