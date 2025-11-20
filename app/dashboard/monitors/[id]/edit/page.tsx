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
  const [tags, setTags] = useState('')
  const [customDownMessage, setCustomDownMessage] = useState('')
  const [customRecoveryMessage, setCustomRecoveryMessage] = useState('')
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
          setTags(data.monitor.tags ? data.monitor.tags.join(', ') : '')
          setCustomDownMessage(data.monitor.customDownMessage || '')
          setCustomRecoveryMessage(data.monitor.customRecoveryMessage || '')
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
          tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
          customDownMessage: customDownMessage || null,
          customRecoveryMessage: customRecoveryMessage || null,
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

            <Input
              label="Tags (Optional)"
              placeholder="production, api, critical"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helperText="Comma-separated tags to organize your monitors"
            />

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Alert Notifications
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Configure how you want to be notified when this monitor goes down or recovers.
              </p>

              <div className="space-y-6">
                {/* Custom Alert Messages */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Custom Alert Messages
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                    Personalize your alert messages to provide context for your team.
                  </p>
                  <div className="space-y-3">
                    <Input
                      label="DOWN Alert Message (Optional)"
                      placeholder="e.g., 🚨 Production backup job has failed! Check logs immediately."
                      value={customDownMessage}
                      onChange={(e) => setCustomDownMessage(e.target.value)}
                      helperText="Custom message for failure alerts"
                    />
                    <Input
                      label="RECOVERY Alert Message (Optional)"
                      placeholder="e.g., ✅ Production backup is back online."
                      value={customRecoveryMessage}
                      onChange={(e) => setCustomRecoveryMessage(e.target.value)}
                      helperText="Custom message for recovery alerts"
                    />
                  </div>
                </div>

                {/* Email Notifications */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Email Alerts
                  </h4>
                  <Input
                    label="Email Addresses"
                    placeholder="team@example.com, alerts@example.com"
                    value={alertEmails}
                    onChange={(e) => setAlertEmails(e.target.value)}
                    helperText="Comma-separated list of emails to notify when alerts occur"
                  />
                </div>

                {/* Webhook Notifications */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Webhook Alerts
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                    Send alerts to Slack, Discord, or Microsoft Teams. Available on STARTER plan and above.
                  </p>
                  <div className="space-y-3">
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
