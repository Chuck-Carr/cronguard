'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const INTERVAL_PRESETS = [
  { label: '1 minute', seconds: 60 },
  { label: '5 minutes', seconds: 300 },
  { label: '15 minutes', seconds: 900 },
  { label: '30 minutes', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
  { label: '6 hours', seconds: 21600 },
  { label: '12 hours', seconds: 43200 },
  { label: '24 hours', seconds: 86400 },
  { label: '1 week', seconds: 604800 },
]

const GRACE_PERIOD_PRESETS = [
  { label: '1 minute', seconds: 60 },
  { label: '5 minutes', seconds: 300 },
  { label: '15 minutes', seconds: 900 },
  { label: '30 minutes', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
]

export default function NewMonitorPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [intervalSeconds, setIntervalSeconds] = useState(3600)
  const [gracePeriodSeconds, setGracePeriodSeconds] = useState(300)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          intervalSeconds,
          gracePeriodSeconds,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create monitor')
        setIsLoading(false)
        return
      }

      router.push(`/dashboard/monitors/${data.monitor.id}`)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/monitors" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ← Back to Monitors
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">
          Create Monitor
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Set up a new cron job monitor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Monitor Name"
              placeholder="e.g., Database Backup, Daily Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              helperText="A descriptive name for your cron job"
            />

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Expected Interval
              </label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                How often should this job run?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTERVAL_PRESETS.map((preset) => (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => setIntervalSeconds(preset.seconds)}
                    className={`
                      px-3 py-2 text-sm rounded-lg border transition-colors
                      ${intervalSeconds === preset.seconds
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Grace Period
              </label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                How long to wait before sending an alert if the job is late?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {GRACE_PERIOD_PRESETS.map((preset) => (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => setGracePeriodSeconds(preset.seconds)}
                    className={`
                      px-3 py-2 text-sm rounded-lg border transition-colors
                      ${gracePeriodSeconds === preset.seconds
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isLoading}>
                Create Monitor
              </Button>
              <Link href="/dashboard/monitors">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
