# Stripe Integration - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Get Stripe Test Keys
Go to https://dashboard.stripe.com/test/apikeys and copy:
- **Secret key** (starts with `sk_test_`)

### 2. Create `.env.local`
```bash
cp .env.example .env.local
```

Add your keys:
```bash
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_secret_here"  # From step 4
```

### 3. Create Products in Stripe
Go to https://dashboard.stripe.com/test/products and create:

**TaskAlive Starter** - $9/month
**TaskAlive Pro** - $29/month  
**TaskAlive Business** - $99/month

Copy each **Price ID** and add to `.env.local`:
```bash
STRIPE_PRICE_STARTER_MONTHLY="price_xxx"
STRIPE_PRICE_PRO_MONTHLY="price_xxx"
STRIPE_PRICE_BUSINESS_MONTHLY="price_xxx"
```

### 4. Install Stripe CLI & Forward Webhooks
```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret (starts with `whsec_`) and add to `.env.local`.

### 5. Start Your App
```bash
npm run dev
```

### 6. Test It!
1. Create a test account
2. Go to Settings
3. Click "Upgrade to STARTER"
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify you're upgraded! ✨

## 📝 Test Cards

| Purpose | Card Number |
|---------|------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0027 6000 3184 |

- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## 🔍 Troubleshooting

**App won't start?**
- Check `STRIPE_SECRET_KEY` is set in `.env.local`

**Checkout not working?**
- Verify price IDs in `.env.local` match Stripe Dashboard
- Make sure app is running on http://localhost:3000

**Plan not updating after payment?**
- Check Stripe CLI terminal for webhook events
- Look for `checkout.session.completed` event
- Verify `STRIPE_WEBHOOK_SECRET` is correct

**"No Stripe customer found" error?**
- Only shows after you've completed at least one checkout
- User needs to subscribe before using customer portal

## 📚 Full Documentation

- **Setup Guide**: `STRIPE_SETUP.md` - Detailed setup instructions
- **Implementation**: `STRIPE_IMPLEMENTATION.md` - Technical details
- **Stripe Docs**: https://stripe.com/docs

## 🎯 What's Implemented

✅ Checkout flow for upgrades  
✅ Customer portal for managing subscriptions  
✅ Webhook sync for subscription status  
✅ Automatic plan upgrades/downgrades  
✅ Security (signature verification)  
✅ Error handling  

## 💡 Common Tasks

### View Stripe Events
```bash
stripe events list --limit 10
```

### Trigger Test Webhook
```bash
stripe trigger checkout.session.completed
```

### View Customer
```bash
stripe customers list --limit 5
```

### View Subscriptions
```bash
stripe subscriptions list --limit 5
```

## 🚢 Going to Production

1. Create live products in Stripe (not test mode)
2. Update `.env` on Vercel with live keys
3. Add webhook endpoint in Stripe Dashboard
4. Test with real card (use small amount)
5. Monitor first transactions carefully

See `STRIPE_SETUP.md` for full production checklist.
