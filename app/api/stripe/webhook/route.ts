import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, getPlanFromPriceId } from '@/lib/stripe'
import { sql } from '@/lib/db'
import { Plan, User } from '@/lib/types'

// Disable body parsing - we need raw body for webhook signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log(`Received webhook: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Payment succeeded for invoice ${invoice.id}`)
        // Optional: Log successful payments or send confirmation emails
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.error(`Payment failed for invoice ${invoice.id}`)
        // Optional: Send notification to user about failed payment
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('=== handleCheckoutCompleted START ===')
  console.log('Session ID:', session.id)
  console.log('Client reference ID:', session.client_reference_id)
  console.log('Metadata:', session.metadata)
  
  const userId = session.client_reference_id || session.metadata?.userId

  if (!userId) {
    console.error('❌ No user ID in checkout session')
    return
  }

  console.log('✓ User ID:', userId)

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  console.log('✓ Customer ID:', customerId)
  console.log('✓ Subscription ID:', subscriptionId)

  // Get subscription details to determine the plan
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id

  console.log('✓ Price ID:', priceId)

  let plan: Plan = 'FREE'
  if (priceId) {
    const detectedPlan = getPlanFromPriceId(priceId)
    console.log('✓ Detected plan from price ID:', detectedPlan)
    if (detectedPlan) {
      plan = detectedPlan
    }
  }

  // Fallback to metadata if price lookup fails
  if (plan === 'FREE' && session.metadata?.plan) {
    plan = session.metadata.plan as Plan
    console.log('✓ Using plan from metadata:', plan)
  }

  console.log('✓ Final plan to set:', plan)

  // Update user with Stripe customer ID, subscription ID, and plan
  try {
    const [updatedUser] = await sql<User[]>`
      UPDATE "User"
      SET "stripeCustomerId" = ${customerId},
          "stripeSubscriptionId" = ${subscriptionId},
          plan = ${plan}
      WHERE id = ${userId}
      RETURNING *
    `
    console.log('✅ User updated successfully:', updatedUser.email, updatedUser.plan)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    throw error
  }

  console.log('=== handleCheckoutCompleted END ===')
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const [user] = await sql<User[]>`
    SELECT * FROM "User" WHERE "stripeCustomerId" = ${customerId}
  `

  if (!user) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  const priceId = subscription.items.data[0]?.price.id
  let plan: Plan = 'FREE'

  if (priceId) {
    const detectedPlan = getPlanFromPriceId(priceId)
    if (detectedPlan) {
      plan = detectedPlan
    }
  }

  // Handle subscription status changes
  const isActive = ['active', 'trialing'].includes(subscription.status)
  
  // If subscription is not active (e.g., past_due, canceled, unpaid), downgrade to FREE
  if (!isActive) {
    plan = 'FREE'
  }

  await sql`
    UPDATE "User"
    SET plan = ${plan},
        "stripeSubscriptionId" = ${subscription.id}
    WHERE id = ${user.id}
  `

  console.log(`Subscription updated: User ${user.id} plan set to ${plan} (status: ${subscription.status})`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const [user] = await sql<User[]>`
    SELECT * FROM "User" WHERE "stripeCustomerId" = ${customerId}
  `

  if (!user) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Downgrade user to FREE plan when subscription is deleted
  await sql`
    UPDATE "User"
    SET plan = 'FREE',
        "stripeSubscriptionId" = NULL
    WHERE id = ${user.id}
  `

  console.log(`Subscription deleted: User ${user.id} downgraded to FREE`)
}
