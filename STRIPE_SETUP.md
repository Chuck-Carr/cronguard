# Stripe Integration Setup Guide

This guide walks you through setting up Stripe for TaskAlive's subscription payments.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Stripe CLI installed (for local webhook testing)

## 1. Get Your Stripe API Keys

### For Testing (Development)
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### For Production
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_live_`)
3. Copy your **Secret key** (starts with `sk_live_`)

## 2. Create Products and Prices in Stripe Dashboard

### Using Test Mode

1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"** for each plan:

#### TaskAlive Starter
- **Name**: TaskAlive Starter
- **Description**: 20 monitors, 30 days history, webhooks
- **Pricing**:
  - **Monthly**: $9.00 USD, recurring monthly
  - **Yearly**: $90.00 USD, recurring yearly (save $18/year)
- After creating, copy the **Price ID** for both monthly and yearly (starts with `price_`)

#### TaskAlive Pro
- **Name**: TaskAlive Pro
- **Description**: 100 monitors, 90 days history, webhooks, SMS alerts
- **Pricing**:
  - **Monthly**: $29.00 USD, recurring monthly
  - **Yearly**: $290.00 USD, recurring yearly (save $58/year)
- Copy the **Price IDs**

#### TaskAlive Business
- **Name**: TaskAlive Business
- **Description**: Unlimited monitors, 365 days history, priority support
- **Pricing**:
  - **Monthly**: $99.00 USD, recurring monthly
  - **Yearly**: $990.00 USD, recurring yearly (save $198/year)
- Copy the **Price IDs**

## 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys (use test keys for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # We'll get this in step 4

# Stripe Price IDs (from step 2)
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_STARTER_YEARLY="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."
STRIPE_PRICE_BUSINESS_MONTHLY="price_..."
STRIPE_PRICE_BUSINESS_YEARLY="price_..."

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 4. Set Up Webhooks

### For Local Development (Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli#install
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`
5. Keep this terminal window running while testing

### For Production (Vercel/Live Site)

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add it to your production environment variables

## 5. Configure Stripe Customer Portal

The customer portal allows users to manage their subscriptions, update payment methods, and view billing history.

1. Go to https://dashboard.stripe.com/test/settings/billing/portal
2. Configure these settings:
   - **Headline**: "Manage your subscription"
   - **Privacy policy**: Link to your privacy policy
   - **Terms of service**: Link to your terms
   - **Allow customers to**:
     - ✅ Update payment methods
     - ✅ Update billing information
     - ✅ Cancel subscriptions
     - ✅ Switch plans (optional)
     - ✅ View invoice history
3. Click **Save changes**

## 6. Testing the Integration

### Start Your Development Server
```bash
npm run dev
```

### Test the Upgrade Flow

1. Create a test user account or login
2. Go to Dashboard → Settings
3. Click "Click to manage subscription"
4. Click "Upgrade to STARTER" (or any plan)
5. You should be redirected to Stripe Checkout
6. Use a test card:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0027 6000 3184`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits
7. Complete the checkout
8. You should be redirected back to settings with `?success=true`
9. Verify your plan was upgraded in the database

### Test Webhooks

While the Stripe CLI is running (`stripe listen`), you should see webhook events in the terminal:
- `checkout.session.completed` - After successful payment
- `customer.subscription.updated` - If subscription changes
- `invoice.payment_succeeded` - After successful billing

### Test Customer Portal

1. After upgrading to a paid plan
2. Click "Manage Billing" in the subscription section
3. You should be redirected to Stripe Customer Portal
4. Try:
   - Updating payment method
   - Canceling subscription
   - Viewing invoice history

### Test Subscription Cancellation

1. In Customer Portal, cancel your subscription
2. The webhook should trigger and downgrade you to FREE plan
3. Verify in the database that your plan is now FREE

## 7. Monitoring

### Check Logs
- **Webhook events**: Check your server logs for `Received webhook: ...`
- **Stripe Dashboard**: View all events at https://dashboard.stripe.com/test/events
- **Database**: Verify `stripeCustomerId`, `stripeSubscriptionId`, and `plan` are updated

### Common Issues

#### "No Stripe customer found"
- User hasn't completed checkout yet
- Check that webhooks are working properly

#### "Invalid signature" on webhook
- `STRIPE_WEBHOOK_SECRET` is incorrect or missing
- Make sure Stripe CLI is running for local dev
- Verify webhook secret matches your endpoint in production

#### Plan not updating after checkout
- Check webhook logs for errors
- Verify price IDs in `lib/stripe.ts` match your Stripe products
- Ensure `checkout.session.completed` webhook is firing

## 8. Going to Production

When you're ready to launch:

1. **Switch to live mode** in Stripe Dashboard
2. **Create products and prices** in live mode (same as step 2)
3. **Update environment variables** with live keys:
   - `STRIPE_SECRET_KEY` (starts with `sk_live_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - Live price IDs
4. **Set up production webhook** (step 4, production section)
5. **Test with real payment methods** (use small amounts)
6. **Monitor carefully** for the first few transactions

## 9. Stripe CLI Commands

```bash
# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger a test webhook
stripe trigger checkout.session.completed

# View recent events
stripe events list --limit 10

# Get details of a specific event
stripe events retrieve evt_xxx

# View customer details
stripe customers retrieve cus_xxx

# View subscription details
stripe subscriptions retrieve sub_xxx
```

## 10. Security Checklist

- ✅ Never commit `.env.local` to git
- ✅ Use test keys for development
- ✅ Verify webhook signatures (implemented in webhook handler)
- ✅ Validate user ownership before creating portal sessions
- ✅ Use HTTPS in production
- ✅ Enable Stripe Radar (fraud detection) in production
- ✅ Monitor webhook delivery and retry failed events
- ✅ Set up alerts for failed payments
- ✅ Implement proper error handling in frontend

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Customer Portal Configuration](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
