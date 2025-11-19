'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plan } from '@/lib/types'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SubscriptionCardProps {
  currentPlan: Plan
  stripeCustomerId: string | null
}

const PLAN_PRICES = {
  FREE: { monthly: 0, yearly: 0 },
  STARTER: { monthly: 9, yearly: 90 },
  PRO: { monthly: 29, yearly: 290 },
  BUSINESS: { monthly: 99, yearly: 990 },
}

const PLAN_FEATURES = {
  FREE: [
    '3 monitors',
    '7 days history',
    'Email alerts',
  ],
  STARTER: [
    '20 monitors',
    '30 days history',
    'Email alerts',
    'Slack & Discord webhooks',
    'Instant alerts',
  ],
  PRO: [
    '100 monitors',
    '90 days history',
    'Email alerts',
    'All webhooks (Slack, Discord, Teams)',
    'SMS alerts',
    'Instant alerts',
  ],
  BUSINESS: [
    'Unlimited monitors',
    '365 days history',
    'Email alerts',
    'All webhooks',
    'SMS alerts',
    'Instant alerts',
    'Priority support',
  ],
}

export function SubscriptionCard({ currentPlan, stripeCustomerId }: SubscriptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async (plan: Plan) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingPeriod: 'monthly' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isLoading}
          className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors -mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">Click to manage subscription</span>
        </button>

        {isExpanded && (
          <>
            {/* Current Plan */}
            <div className="p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Current Plan</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                {currentPlan}
              </div>
              {currentPlan !== 'FREE' && (
                <div className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  ${PLAN_PRICES[currentPlan].monthly}/month
                </div>
              )}
            </div>
            {stripeCustomerId && currentPlan !== 'FREE' && (
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Manage Billing'}
              </Button>
            )}
          </div>
        </div>

        {/* Available Plans */}
        {currentPlan !== 'BUSINESS' && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Upgrade Your Plan
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(['STARTER', 'PRO', 'BUSINESS'] as Plan[])
                  .filter(plan => {
                    const planOrder = { FREE: 0, STARTER: 1, PRO: 2, BUSINESS: 3 }
                    return planOrder[plan] > planOrder[currentPlan]
                  })
                  .map(plan => (
                    <div
                      key={plan}
                      className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                          {plan}
                        </h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                            ${PLAN_PRICES[plan].monthly}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            /month
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {PLAN_FEATURES[plan].map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        onClick={() => handleUpgrade(plan)}
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : `Upgrade to ${plan}`}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

            {/* Downgrade / Cancel */}
            {currentPlan !== 'FREE' && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Want to downgrade or cancel your subscription?
                </p>
                <Button 
                  variant="ghost" 
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {isLoading ? 'Loading...' : 'Manage Subscription'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
