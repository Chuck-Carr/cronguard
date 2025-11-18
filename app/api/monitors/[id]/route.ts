import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { Monitor } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [monitor] = await sql<Monitor[]>`
    SELECT * FROM "Monitor" 
    WHERE id = ${id} AND "userId" = ${session.user.id}
  `

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  return NextResponse.json({ monitor })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify monitor belongs to user
  const [monitor] = await sql<Monitor[]>`
    SELECT * FROM "Monitor" 
    WHERE id = ${id} AND "userId" = ${session.user.id}
  `

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  // Delete monitor (cascades to pings and alerts)
  await sql`DELETE FROM "Monitor" WHERE id = ${id}`

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, intervalSeconds, gracePeriodSeconds, slackWebhookUrl, discordWebhookUrl, teamsWebhookUrl, alertEmails } = body

  // Verify monitor belongs to user
  const [monitor] = await sql<Monitor[]>`
    SELECT * FROM "Monitor" 
    WHERE id = ${id} AND "userId" = ${session.user.id}
  `

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  // Update monitor (convert empty strings to null)
  const [updated] = await sql<Monitor[]>`
    UPDATE "Monitor"
    SET 
      name = COALESCE(${name}, name),
      "intervalSeconds" = COALESCE(${intervalSeconds}, "intervalSeconds"),
      "gracePeriodSeconds" = COALESCE(${gracePeriodSeconds}, "gracePeriodSeconds"),
      "slackWebhookUrl" = ${slackWebhookUrl !== undefined ? (slackWebhookUrl || null) : sql`"slackWebhookUrl"`},
      "discordWebhookUrl" = ${discordWebhookUrl !== undefined ? (discordWebhookUrl || null) : sql`"discordWebhookUrl"`},
      "teamsWebhookUrl" = ${teamsWebhookUrl !== undefined ? (teamsWebhookUrl || null) : sql`"teamsWebhookUrl"`},
      "alertEmails" = ${alertEmails !== undefined ? (alertEmails || null) : sql`"alertEmails"`},
      "updatedAt" = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  return NextResponse.json({ monitor: updated })
}
