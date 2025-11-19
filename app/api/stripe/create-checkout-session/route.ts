import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe, getPriceId } from '@/lib/stripe'
import { Plan } from '@/lib/types'

const PLAN_ORDER = { FREE: 0, STARTER: 1, PRO: 2, BUSINESS: 3 }

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { plan, billingPeriod } = body as { 
      plan: Plan
      billingPeriod: 'monthly' | 'yearly' 
    }

    // Validate inputs
    if (!plan || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields: plan, billingPeriod' },
        { status: 400 }
      )
    }

    if (!['STARTER', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be STARTER, PRO, or BUSINESS' },
        { status: 400 }
      )
    }

    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      return NextResponse.json(
        { error: 'Invalid billing period. Must be monthly or yearly' },
        { status: 400 }
      )
    }

    // Get user and check if upgrade is valid
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, plan: true, stripeCustomerId: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent downgrades (can be handled via customer portal instead)
    if (PLAN_ORDER[plan] <= PLAN_ORDER[user.plan]) {
      return NextResponse.json(
        { error: 'Cannot downgrade or switch to same plan. Use customer portal to manage subscription.' },
        { status: 400 }
      )
    }

    const priceId = getPriceId(plan, billingPeriod)
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard/settings?success=true`,
      cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
