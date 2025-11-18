'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { use } from 'react'

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

interface EditMonitorPageProps {
  params: Promise<{ id: string }>
}

export default function EditMonitorPage({ params }: EditMonitorPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [name, setName] = useState('')
  const [intervalSeconds, setIntervalSeconds] = useState(3600)
  const [gracePeriodSeconds, setGracePeriodSeconds] = useState(300)
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('')
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('')
  const [teamsWebhookUrl, setTeamsWebhookUrl] = useState('')
  const [alertEmails, setAlertEmails] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Fetch current monitor data
    fetch(`/api/monitors/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('Failed to load monitor')
        } else {
          setName(data.monitor.name)
          setIntervalSeconds(data.monitor.intervalSeconds)
          setGracePeriodSeconds(data.monitor.gracePeriodSeconds)
          setSlackWebhookUrl(data.monitor.slackWebhookUrl || '')
          setDiscordWebhookUrl(data.monitor.discordWebhookUrl || '')
          setTeamsWebhookUrl(data.monitor.teamsWebhookUrl || '')
          setAlertEmails(data.monitor.alertEmails || '')
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Failed to load monitor')
        setIsLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const res = await fetch(`/api/monitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          intervalSeconds,
          gracePeriodSeconds,
          slackWebhookUrl: slackWebhookUrl || null,
          discordWebhookUrl: discordWebhookUrl || null,
          teamsWebhookUrl: teamsWebhookUrl || null,
          alertEmails: alertEmails || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update monitor')
        setIsSaving(false)
        return
      }

      router.push(`/dashboard/monitors/${id}`)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center text-zinc-600 dark:text-zinc-400">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/dashboard/monitors/${id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ← Back to Monitor
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">
          Edit Monitor
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Update your monitor settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitor Settings</CardTitle>
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
              helperText="A descriptive name for your task"
            />

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Expected Interval
              </label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                How often should this task run?
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
                How long to wait before sending an alert if the task is late?
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

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Notifications (Optional)
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Configure webhook URLs to receive alerts in Slack, Discord, or Teams. Available on STARTER plan and above.
              </p>

              <div className="space-y-4">
                <Input
                  label="Additional Email Addresses"
                  placeholder="team@example.com, alerts@example.com"
                  value={alertEmails}
                  onChange={(e) => setAlertEmails(e.target.value)}
                  helperText="Comma-separated list of emails to notify (in addition to your account email)"
                />

                <Input
                  label="Slack Webhook URL"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  helperText="Get from Slack: App Settings → Incoming Webhooks"
                />

                <Input
                  label="Discord Webhook URL"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  helperText="Get from Discord: Server Settings → Integrations → Webhooks"
                />

                <Input
                  label="Microsoft Teams Webhook URL"
                  placeholder="https://yourorg.webhook.office.com/webhookb2/..."
                  value={teamsWebhookUrl}
                  onChange={(e) => setTeamsWebhookUrl(e.target.value)}
                  helperText="Get from Teams: Channel → ... → Connectors → Incoming Webhook"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
              <Link href={`/dashboard/monitors/${id}`}>
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
