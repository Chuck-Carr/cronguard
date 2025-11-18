import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmailAlert, sendDiscordWebhook, sendSlackWebhook } from "@/lib/notifications"
import { getPlanLimits } from "@/lib/plan-limits"

// This endpoint should be called every minute via Vercel Cron or similar
export async function GET(req: NextRequest) {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    // Find monitors that should have pinged by now but haven't
    const lateMonitors = await prisma.monitor.findMany({
      where: {
        status: { in: ["HEALTHY", "LATE"] },
        nextExpectedPingAt: {
          lte: now,
        },
      },
      include: {
        user: true,
      },
    })

    const results = {
      checked: lateMonitors.length,
      markedLate: 0,
      markedFailed: 0,
      alertsSent: 0,
    }

    for (const monitor of lateMonitors) {
      const gracePeriodEnd = monitor.nextExpectedPingAt
        ? new Date(
            monitor.nextExpectedPingAt.getTime() +
              monitor.gracePeriodSeconds * 1000
          )
        : now

      if (now >= gracePeriodEnd) {
        // Grace period expired - mark as FAILED and send alert
        if (monitor.status !== "FAILED") {
          await prisma.monitor.update({
            where: { id: monitor.id },
            data: { status: "FAILED" },
          })

          // Send alerts (email + webhooks if enabled)
          const sent = await sendAllAlerts(monitor, "DOWN")

          // Record alert rows for channels we actually sent
          await prisma.$transaction([
            ...(sent.email ? [prisma.alert.create({ data: { monitorId: monitor.id, type: "DOWN", channel: "EMAIL" } })] : []),
            ...(sent.slack ? [prisma.alert.create({ data: { monitorId: monitor.id, type: "DOWN", channel: "SLACK" } })] : []),
          ])

          results.markedFailed++
          results.alertsSent += Number(sent.email) + Number(sent.slack) + Number(sent.discord)
        }
      } else if (monitor.status === "HEALTHY") {
        // Within grace period - mark as LATE
        await prisma.monitor.update({
          where: { id: monitor.id },
          data: { status: "LATE" },
        })
        results.markedLate++
      }
    }

    // Check for recovered monitors (recently pinged after being down)
    const recoveredMonitors = await prisma.monitor.findMany({
      where: {
        status: "HEALTHY",
        updatedAt: {
          gte: new Date(now.getTime() - 60 * 1000), // Last minute
        },
      },
      include: {
        user: true,
        alerts: {
          where: {
            type: "DOWN",
            sentAt: {
              gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          orderBy: { sentAt: "desc" },
          take: 1,
        },
      },
    })

    for (const monitor of recoveredMonitors) {
      // If there was a recent DOWN alert and no RECOVERY alert yet, send recovery
      if (monitor.alerts.length > 0) {
        const hasRecentRecovery = await prisma.alert.findFirst({
          where: {
            monitorId: monitor.id,
            type: "RECOVERY",
            sentAt: {
              gte: monitor.alerts[0].sentAt,
            },
          },
        })

        if (!hasRecentRecovery) {
          const sent = await sendAllAlerts(monitor, "RECOVERY")
          await prisma.$transaction([
            ...(sent.email ? [prisma.alert.create({ data: { monitorId: monitor.id, type: "RECOVERY", channel: "EMAIL" } })] : []),
            ...(sent.slack ? [prisma.alert.create({ data: { monitorId: monitor.id, type: "RECOVERY", channel: "SLACK" } })] : []),
          ])
          results.alertsSent += Number(sent.email) + Number(sent.slack) + Number(sent.discord)
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    })
  } catch (error) {
    console.error("Error checking monitors:", error)
    return NextResponse.json(
      { error: "Failed to check monitors" },
      { status: 500 }
    )
  }
}

async function sendAllAlerts(monitor: any & { user: { email: string, plan: any } }, type: "DOWN" | "RECOVERY") {
  // Determine feature flags from plan
  const { webhooks } = getPlanLimits(monitor.user.plan)

  // Prepare minimal monitor info for templates
  const m = {
    id: monitor.id,
    name: monitor.name,
    lastPingAt: monitor.lastPingAt,
    intervalSeconds: monitor.intervalSeconds,
  }

  let emailSent = false
  let slackSent = false
  let discordSent = false

  // Email is available on all plans
  // Send to account email
  try {
    await sendEmailAlert({ email: monitor.user.email }, m, type as any)
    emailSent = true
  } catch (e) {
    console.error('Email alert failed for account email:', e)
  }

  // Send to additional emails if configured
  if (monitor.alertEmails) {
    const additionalEmails = monitor.alertEmails
      .split(',')
      .map((email: string) => email.trim())
      .filter((email: string) => email.length > 0)
    
    for (const email of additionalEmails) {
      try {
        await sendEmailAlert({ email }, m, type as any)
      } catch (e) {
        console.error(`Email alert failed for ${email}:`, e)
      }
    }
  }

  // Webhooks (Slack/Discord) only if plan allows and URLs are set
  if (webhooks) {
    if (monitor.slackWebhookUrl) {
      try {
        await sendSlackWebhook(monitor.slackWebhookUrl, m as any, type as any)
        slackSent = true
      } catch (e) {
        console.error('Slack webhook failed:', e)
      }
    }
    if (monitor.discordWebhookUrl) {
      try {
        await sendDiscordWebhook(monitor.discordWebhookUrl, m as any, type as any)
        discordSent = true
      } catch (e) {
        console.error('Discord webhook failed:', e)
      }
    }
  }

  return { email: emailSent, slack: slackSent, discord: discordSent }
}
