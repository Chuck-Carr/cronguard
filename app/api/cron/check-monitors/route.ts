import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { Monitor, User, Alert } from "@/lib/types"
import { sendEmailAlert, sendDiscordWebhook, sendSlackWebhook, sendTeamsWebhook } from "@/lib/notifications"
import { getPlanLimits } from "@/lib/plan-limits"
import { randomUUID } from "crypto"

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
    const lateMonitors = await sql<(Monitor & { user: User })[]>`
      SELECT m.*, row_to_json(u.*) as user
      FROM "Monitor" m
      JOIN "User" u ON u.id = m."userId"
      WHERE m.status IN ('HEALTHY', 'LATE')
        AND m."nextExpectedPingAt" <= ${now}
    `

    const results = {
      checked: lateMonitors.length,
      markedLate: 0,
      markedFailed: 0,
      alertsSent: 0,
    }

    for (const monitor of lateMonitors) {
      const nextExpected = new Date(monitor.nextExpectedPingAt!)
      const gracePeriodEnd = new Date(
        nextExpected.getTime() + monitor.gracePeriodSeconds * 1000
      )

      console.log(`Monitor ${monitor.name}:`, {
        now: now.toISOString(),
        nextExpected: nextExpected.toISOString(),
        gracePeriodEnd: gracePeriodEnd.toISOString(),
        gracePeriodSeconds: monitor.gracePeriodSeconds,
        shouldFail: now >= gracePeriodEnd,
        status: monitor.status
      })

      if (now >= gracePeriodEnd) {
        // Grace period expired - mark as FAILED and send alert
        if (monitor.status !== "FAILED") {
          await sql`
            UPDATE "Monitor"
            SET status = 'FAILED', "updatedAt" = NOW()
            WHERE id = ${monitor.id}
          `

          // Send alerts (email + webhooks if enabled)
          const sent = await sendAllAlerts(monitor, "DOWN")

          // Record alert rows for channels we actually sent
          const alertPromises = []
          if (sent.email) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'DOWN', 'EMAIL', NOW(), NOW())`)
          if (sent.slack) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'DOWN', 'SLACK', NOW(), NOW())`)
          if (sent.discord) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'DOWN', 'DISCORD', NOW(), NOW())`)
          if (sent.teams) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'DOWN', 'TEAMS', NOW(), NOW())`)
          await Promise.all(alertPromises)

          results.markedFailed++
          results.alertsSent += Number(sent.email) + Number(sent.slack) + Number(sent.discord) + Number(sent.teams)
        }
      } else if (monitor.status === "HEALTHY") {
        // Within grace period - mark as LATE
        await sql`
          UPDATE "Monitor"
          SET status = 'LATE', "updatedAt" = NOW()
          WHERE id = ${monitor.id}
        `
        results.markedLate++
      }
    }

    // Check for recovered monitors (recently pinged after being down)
    const recoveredMonitors = await sql<(Monitor & { user: User, recentDownAlertAt: Date | null })[]>`
      SELECT m.*, 
             row_to_json(u.*) as user,
             (SELECT a."sentAt" 
              FROM "Alert" a 
              WHERE a."monitorId" = m.id 
                AND a.type = 'DOWN' 
                AND a."sentAt" >= ${new Date(now.getTime() - 24 * 60 * 60 * 1000)}
              ORDER BY a."sentAt" DESC 
              LIMIT 1) as "recentDownAlertAt"
      FROM "Monitor" m
      JOIN "User" u ON u.id = m."userId"
      WHERE m.status = 'HEALTHY'
        AND m."updatedAt" >= ${new Date(now.getTime() - 60 * 1000)}
    `

    for (const monitor of recoveredMonitors) {
      // If there was a recent DOWN alert and no RECOVERY alert yet, send recovery
      if (monitor.recentDownAlertAt) {
        const [hasRecentRecovery] = await sql<Alert[]>`
          SELECT * FROM "Alert"
          WHERE "monitorId" = ${monitor.id}
            AND type = 'RECOVERY'
            AND "sentAt" >= ${monitor.recentDownAlertAt}
          LIMIT 1
        `

        if (!hasRecentRecovery) {
          const sent = await sendAllAlerts(monitor, "RECOVERY")
          const alertPromises = []
          if (sent.email) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'RECOVERY', 'EMAIL', NOW(), NOW())`)
          if (sent.slack) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'RECOVERY', 'SLACK', NOW(), NOW())`)
          if (sent.discord) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'RECOVERY', 'DISCORD', NOW(), NOW())`)
          if (sent.teams) alertPromises.push(sql`INSERT INTO "Alert" (id, "monitorId", type, channel, "sentAt", "createdAt") VALUES (${randomUUID()}, ${monitor.id}, 'RECOVERY', 'TEAMS', NOW(), NOW())`)
          await Promise.all(alertPromises)
          results.alertsSent += Number(sent.email) + Number(sent.slack) + Number(sent.discord) + Number(sent.teams)
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
  let teamsSent = false

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
    if (monitor.teamsWebhookUrl) {
      try {
        await sendTeamsWebhook(monitor.teamsWebhookUrl, m as any, type as any)
        teamsSent = true
      } catch (e) {
        console.error('Teams webhook failed:', e)
      }
    }
  }

  return { email: emailSent, slack: slackSent, discord: discordSent, teams: teamsSent }
}
