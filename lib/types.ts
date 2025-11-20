// Database types

export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'
export type MonitorStatus = 'HEALTHY' | 'LATE' | 'FAILED'
export type AlertType = 'DOWN' | 'RECOVERY'
export type AlertChannel = 'EMAIL' | 'SLACK' | 'DISCORD' | 'TEAMS' | 'SMS'

export interface User {
  id: string
  email: string
  passwordHash: string
  plan: Plan
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  resetToken: string | null
  resetTokenExpiry: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Monitor {
  id: string
  userId: string
  name: string
  pingUrl: string
  intervalSeconds: number
  gracePeriodSeconds: number
  status: MonitorStatus
  lastPingAt: Date | null
  nextExpectedPingAt: Date | null
  paused: boolean
  pausedAt: Date | null
  tags: string[]
  slackWebhookUrl: string | null
  discordWebhookUrl: string | null
  teamsWebhookUrl: string | null
  alertEmails: string | null
  customDownMessage: string | null
  customRecoveryMessage: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Ping {
  id: string
  monitorId: string
  pingedAt: Date
  message: string | null
  ipAddress: string | null
  createdAt: Date
}

export interface Alert {
  id: string
  monitorId: string
  type: AlertType
  channel: AlertChannel
  sentAt: Date
  createdAt: Date
}
