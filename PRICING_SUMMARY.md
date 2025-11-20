# TaskAlive Pricing Structure

## Current Pricing (Updated)

| Plan | Price | Monitors | History | Features |
|------|-------|----------|---------|----------|
| **FREE** | $0/mo | 5 | 7 days | Email alerts, Pause/unpause, Tags |
| **STARTER** | $12/mo | 20 | 30 days | + Webhooks (Slack/Discord/Teams), Custom alerts |
| **PRO** | $39/mo | 100 | 90 days | + SMS alerts, Uptime tracking, Priority support |
| **ENTERPRISE** | $119/mo | Unlimited | 365 days | + API access, Team members, Dedicated support |

## Feature Breakdown

### FREE ($0/month)
✅ 5 monitors  
✅ 7-day history  
✅ Email alerts  
✅ Pause/unpause monitors  
✅ Tags/grouping  

### STARTER ($12/month)
✅ 20 monitors  
✅ 30-day history  
✅ Email alerts  
✅ Webhook alerts (Slack, Discord, Microsoft Teams)  
✅ Custom alert messages (DOWN/RECOVERY)  
✅ Pause/unpause monitors  
✅ Tags/grouping  

### PRO ($39/month)
✅ 100 monitors  
✅ 90-day history  
✅ Everything in STARTER  
✅ SMS alerts  
✅ Priority email support  

### ENTERPRISE ($119/month)
✅ Unlimited monitors  
✅ 365-day history  
✅ Everything in PRO  
✅ SLA guarantees  
✅ Dedicated support channel

## Competitive Positioning

**vs. Cronitor:**
- Cronitor: 5 free monitors → TaskAlive: 5 free monitors ✅
- Cronitor: $21/mo for 20 monitors → TaskAlive: $12/mo ✅ (43% cheaper)
- Cronitor: Limited customization → TaskAlive: Custom alerts + tags ✅
- Cronitor: No pause feature → TaskAlive: Pause/unpause ✅

**Key Differentiators:**
1. 43% cheaper than Cronitor on starter tier
2. More generous free tier features (5 monitors)
3. Custom alert messages (addresses pain point)
4. Better pause/unpause functionality
5. Tag-based organization
6. Cleaner, simpler UI

## Stripe Product Setup

When setting up Stripe products, use these prices:

**STARTER:**
- Monthly: $12
- Yearly: $120 (save $24/year)

**PRO:**
- Monthly: $39
- Yearly: $390 (save $78/year)

**ENTERPRISE:**
- Monthly: $119
- Yearly: $1,190 (save $238/year)

## Environment Variables Needed

```bash
# Stripe Price IDs (get from Stripe Dashboard after creating products)
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_YEARLY=price_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxx
```

## Future Features (Not Yet Implemented)

- [ ] Monthly activity reports (STARTER+)
- [ ] Detailed analytics reports (PRO+)
- [ ] Executive reports with CSV export (ENTERPRISE)
- [ ] Response time tracking
- [ ] Team member management
- [ ] API access
- [ ] White-label options
- [ ] SSO/SAML

## SMS Cost Analysis

With Twilio at ~$0.0079 per SMS:
- 100 monitors with 50 failures/month = 100 SMS = **$0.79/month**
- SMS costs are negligible, making PRO pricing very profitable
