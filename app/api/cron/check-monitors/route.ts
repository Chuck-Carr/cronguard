import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
          await prisma.$transaction([
            prisma.monitor.update({
              where: { id: monitor.id },
              data: { status: "FAILED" },
            }),
            prisma.alert.create({
              data: {
                monitorId: monitor.id,
                type: "DOWN",
                channel: "EMAIL",
              },
            }),
          ])

          // TODO: Send email alert
          await sendAlert(monitor, "DOWN")
          
          results.markedFailed++
          results.alertsSent++
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
          await prisma.alert.create({
            data: {
              monitorId: monitor.id,
              type: "RECOVERY",
              channel: "EMAIL",
            },
          })

          // TODO: Send recovery email
          await sendAlert(monitor, "RECOVERY")
          results.alertsSent++
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

async function sendAlert(monitor: any, type: "DOWN" | "RECOVERY") {
  // Placeholder for email sending logic
  // TODO: Integrate with Resend or similar email service
  console.log(`Alert: Monitor ${monitor.name} is ${type}`)
  
  // In production, you would:
  // 1. Get user's email from monitor.user
  // 2. Send email via Resend/AWS SES
  // 3. Handle webhooks if configured
}
