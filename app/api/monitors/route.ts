import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { sql } from "@/lib/db"
import { Monitor, User } from "@/lib/types"
import { canCreateMonitor } from "@/lib/plan-limits"
import { randomUUID } from "crypto"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monitors = await sql<(Monitor & { pingCount: number })[]>`
      SELECT m.*, COUNT(p.id)::int as "pingCount"
      FROM "Monitor" m
      LEFT JOIN "Ping" p ON p."monitorId" = m.id
      WHERE m."userId" = ${session.user.id}
      GROUP BY m.id
      ORDER BY m."createdAt" DESC
    `

    // Transform to match expected format
    const monitorsWithCount = monitors.map(m => ({
      ...m,
      _count: { pings: m.pingCount }
    }))

    return NextResponse.json({ monitors: monitorsWithCount })
  } catch (error) {
    console.error("Error fetching monitors:", error)
    return NextResponse.json(
      { error: "Failed to fetch monitors" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user and monitor count
    const [user] = await sql<(User & { monitorCount: number })[]>`
      SELECT u.*, COUNT(m.id)::int as "monitorCount"
      FROM "User" u
      LEFT JOIN "Monitor" m ON m."userId" = u.id
      WHERE u.id = ${session.user.id}
      GROUP BY u.id
    `

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check plan limits
    if (!canCreateMonitor(user.plan, user.monitorCount)) {
      return NextResponse.json(
        { error: "Monitor limit reached for your plan" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, intervalSeconds, gracePeriodSeconds, slackWebhookUrl, discordWebhookUrl, teamsWebhookUrl, alertEmails } = body

    if (!name || !intervalSeconds) {
      return NextResponse.json(
        { error: "Name and interval are required" },
        { status: 400 }
      )
    }

    const pingUrl = randomUUID().replace(/-/g, '').substring(0, 25)
    
    const [monitor] = await sql<Monitor[]>`
      INSERT INTO "Monitor" (
        id, "userId", name, "pingUrl", "intervalSeconds", "gracePeriodSeconds",
        "slackWebhookUrl", "discordWebhookUrl", "teamsWebhookUrl", "alertEmails",
        status, "createdAt", "updatedAt"
      )
      VALUES (
        ${randomUUID()}, ${user.id}, ${name}, ${pingUrl}, ${intervalSeconds}, ${gracePeriodSeconds || 300},
        ${slackWebhookUrl || null}, ${discordWebhookUrl || null}, ${teamsWebhookUrl || null}, ${alertEmails || null},
        'HEALTHY', NOW(), NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ monitor }, { status: 201 })
  } catch (error) {
    console.error("Error creating monitor:", error)
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 }
    )
  }
}
