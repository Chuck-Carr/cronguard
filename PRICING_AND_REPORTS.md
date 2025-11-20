# Pricing Tiers & Monthly Reports

## Pricing Structure

### FREE ($0/month)
- **5 monitors**
- 7-day history retention
- Email alerts only
- Basic uptime monitoring
- Pause/unpause monitors
- Tags/grouping

### STARTER ($9-12/month)
- **20 monitors**
- 30-day history retention
- Email + Webhook alerts (Slack, Discord, Microsoft Teams)
- Custom alert messages (DOWN/RECOVERY)
- Tags/grouping
- Pause/unpause monitors
- **📊 Monthly Activity Report (email)**

### PRO ($29-39/month)
- **100 monitors**
- 90-day history retention
- Everything in STARTER, plus:
- SMS alerts
- **📊 Detailed Monthly Report with Analytics**
- Uptime percentage tracking
- Response time trends
- Priority email support

### ENTERPRISE ($119/month)
- **Unlimited monitors**
- 365-day history retention
- Everything in PRO, plus:
- **📊 Executive Monthly Summary + Raw Data Export** (FUTURE)
- SLA guarantees
- API access for integrations
- Multiple team members
- Dedicated support channel
- White-label options (future)
- SSO/SAML (future)

---

## Monthly Report Structure

### STARTER Report (Basic Activity Summary)
**Delivered via email on the 1st of each month**

```
Subject: Your TaskAlive Monthly Report - [Month Year]

Hi [User Name],

Here's your activity summary for [Month]:

📊 OVERVIEW
• Total Monitors: X
• Total Pings Received: X,XXX
• Total Alerts Sent: XX

⚠️ INCIDENTS
• Monitors with Failures: X
  - [Monitor Name 1] - X failures
  - [Monitor Name 2] - X failures

⏱️ DOWNTIME
• Total Downtime: Xh XXm

✉️ NOTIFICATIONS
• Email Alerts: XX
• Webhook Alerts: XX

---
Keep your jobs running smoothly!
- The TaskAlive Team
```

### PRO Report (Detailed Analytics)
**Delivered via email + dashboard view**

```
Subject: Your TaskAlive Analytics Report - [Month Year]

Hi [User Name],

Here's your detailed analytics for [Month]:

📊 PERFORMANCE OVERVIEW
• Total Monitors: X
• Active Monitors: X
• Paused Monitors: X
• Average Uptime: XX.X%

🎯 TOP PERFORMERS (Highest Uptime)
1. [Monitor Name] - 100.0% uptime
2. [Monitor Name] - 99.9% uptime
3. [Monitor Name] - 99.8% uptime

⚠️ NEEDS ATTENTION (Most Failures)
1. [Monitor Name] - X failures, XX.X% uptime
2. [Monitor Name] - X failures, XX.X% uptime
3. [Monitor Name] - X failures, XX.X% uptime

📈 TRENDS
• Total Pings: X,XXX (+X% vs last month)
• Failed Checks: XX (-X% vs last month)
• Total Downtime: Xh XXm

📱 NOTIFICATIONS SENT
• Email Alerts: XX
• Webhook Alerts: XX
• SMS Alerts: XX

🏷️ MONITORS BY TAG
• production: XX monitors, XX.X% avg uptime
• staging: XX monitors, XX.X% avg uptime
• critical: XX monitors, XX.X% avg uptime

[View Interactive Dashboard →]

---
Need help improving your uptime?
Reply to this email - we're here to help!

- The TaskAlive Team
```

### ENTERPRISE Report (Executive Summary + Data Export)
**Delivered via email with CSV attachments**

```
Subject: TaskAlive Executive Report - [Month Year]

Hi [User Name],

Your executive summary for [Month]:

📊 EXECUTIVE SUMMARY
• Total Monitors: X
• Organization Uptime: XX.X%
• Cost Savings vs Cronitor: $XXX/month

🎯 KEY METRICS
• Monitors Monitored: X
• Total Health Checks: X,XXX
• Successful Checks: X,XXX (XX.X%)
• Failed Checks: XX (X.X%)
• Average Response Time: XXXms

⚠️ INCIDENT ANALYSIS
• Total Incidents: XX
• Critical Incidents: XX
• Mean Time to Detection: XXm
• Mean Time to Recovery: XXm

📈 MONTH-OVER-MONTH TRENDS
• Uptime Change: +X.X%
• Failure Rate: -X.X%
• New Monitors Added: X

🏢 TEAM ACTIVITY (if applicable)
• Active Users: X
• Monitors per User: X.X avg
• Most Active User: [Name] (XX actions)

📱 NOTIFICATION BREAKDOWN
• Total Alerts: XXX
  - Email: XX (XX%)
  - Webhooks: XX (XX%)
  - SMS: XX (XX%)

🏷️ PERFORMANCE BY TAG/ENVIRONMENT
• production: XX monitors, XX.X% uptime, XX incidents
• staging: XX monitors, XX.X% uptime, XX incidents
• api: XX monitors, XX.X% uptime, XX incidents

💰 ROI SUMMARY
• Prevented Downtime Cost: ~$X,XXX (estimated)
• Monitoring Cost: $XX
• Alerts Delivered: XXX (100% on time)

📎 ATTACHMENTS
• full-report-[month]-[year].csv - Complete data export
• monitor-details-[month]-[year].csv - Per-monitor breakdown
• incidents-[month]-[year].csv - All incidents with timestamps

[View Executive Dashboard →]
[Download All Data →]
[Schedule Custom Report →]

---
Questions about your report? Schedule a call with your dedicated support rep.

- The TaskAlive Team
```

---

## Implementation Notes

### Report Generation
- **Timing**: Generated on the 1st of each month at 00:00 UTC
- **Cron Job**: `/api/cron/generate-monthly-reports`
- **Process**:
  1. Query all users with STARTER+ plans
  2. Calculate metrics for previous month
  3. Generate HTML email template
  4. Send via Resend API
  5. Store report in database (for PRO+ dashboard view)

### Data Required
```typescript
interface MonthlyReportData {
  userId: string
  month: string // YYYY-MM
  totalMonitors: number
  activeMonitors: number
  pausedMonitors: number
  totalPings: number
  successfulPings: number
  failedPings: number
  totalDowntimeMinutes: number
  alertsSent: {
    email: number
    webhook: number
    sms: number
  }
  topPerformers: Array<{
    monitorId: string
    name: string
    uptimePercent: number
  }>
  needsAttention: Array<{
    monitorId: string
    name: string
    failureCount: number
    uptimePercent: number
  }>
  monitorsByTag: Record<string, {
    count: number
    avgUptimePercent: number
    incidents: number
  }>
}
```

### Database Table
```sql
CREATE TABLE "MonthlyReport" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  month TEXT NOT NULL, -- YYYY-MM format
  data JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", month)
);
```

### Future Enhancements
- Custom report scheduling (weekly, bi-weekly)
- Slack/Discord report delivery
- PDF export option
- Comparison reports (YoY, MoM)
- Predictive analytics (failure predictions)
- Cost analysis reports
