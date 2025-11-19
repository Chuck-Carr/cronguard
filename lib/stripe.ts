import Stripe from 'stripe'
import { Plan } from './types'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
})

// TODO: After creating products in Stripe Dashboard, replace these with actual price IDs
// Create products at: https://dashboard.stripe.com/test/products
export const STRIPE_PRICE_IDS = {
  STARTER: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly_placeholder',
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly_placeholder',
  },
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly_placeholder',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly_placeholder',
  },
  BUSINESS: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly_placeholder',
    yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_yearly_placeholder',
  },
}

export function getPriceId(plan: Plan, billingPeriod: 'monthly' | 'yearly'): string | null {
  if (plan === 'FREE') return null
  return STRIPE_PRICE_IDS[plan][billingPeriod]
}

export function getPlanFromPriceId(priceId: string): Plan | null {
  for (const [plan, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return plan as Plan
    }
  }
  return null
}

// Helper to determine if a subscription status should grant access to paid features
export function isSubscriptionActive(status: string): boolean {
  return ['active', 'trialing'].includes(status)
}
