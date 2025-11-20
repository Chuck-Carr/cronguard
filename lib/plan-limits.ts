import { Plan } from './types'

export const PLAN_LIMITS = {
  FREE: {
    monitors: 5,
    history_days: 7,
    instant_alerts: true,
    webhooks: false,
    sms_alerts: false,
  },
  STARTER: {
    monitors: 20,
    history_days: 30,
    instant_alerts: true,
    webhooks: true,
    sms_alerts: false,
  },
  PRO: {
    monitors: 100,
    history_days: 90,
    instant_alerts: true,
    webhooks: true,
    sms_alerts: true,
  },
  ENTERPRISE: {
    monitors: -1, // unlimited
    history_days: 365,
    instant_alerts: true,
    webhooks: true,
    sms_alerts: true,
  },
}

export function canCreateMonitor(plan: Plan, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].monitors
  if (limit === -1) return true
  return currentCount < limit
}

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan]
}
