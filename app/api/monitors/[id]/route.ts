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
  const { name, intervalSeconds, gracePeriodSeconds, slackWebhookUrl, discordWebhookUrl, teamsWebhookUrl, alertEmails, paused, tags, customDownMessage, customRecoveryMessage } = body

  // Verify monitor belongs to user
  const [monitor] = await sql<Monitor[]>`
    SELECT * FROM "Monitor" 
    WHERE id = ${id} AND "userId" = ${session.user.id}
  `

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  // Validate and sanitize tags if provided
  const tagArray = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string' && t.trim().length > 0) : undefined

  // Only update fields that are provided
  const updates: Record<string, unknown> = {}
  
  if (name !== undefined) updates.name = name
  if (intervalSeconds !== undefined) updates.intervalSeconds = intervalSeconds
  if (gracePeriodSeconds !== undefined) updates.gracePeriodSeconds = gracePeriodSeconds
  if (slackWebhookUrl !== undefined) updates.slackWebhookUrl = slackWebhookUrl || null
  if (discordWebhookUrl !== undefined) updates.discordWebhookUrl = discordWebhookUrl || null
  if (teamsWebhookUrl !== undefined) updates.teamsWebhookUrl = teamsWebhookUrl || null
  if (alertEmails !== undefined) updates.alertEmails = alertEmails || null
  if (customDownMessage !== undefined) updates.customDownMessage = customDownMessage || null
  if (customRecoveryMessage !== undefined) updates.customRecoveryMessage = customRecoveryMessage || null
  if (paused !== undefined) {
    updates.paused = paused
    updates.pausedAt = paused ? new Date() : null
  }
  if (tagArray !== undefined) updates.tags = tagArray
  
  // Build the SET clause dynamically
  const setClause = Object.keys(updates)
    .map(key => {
      const dbKey = key === 'intervalSeconds' || key === 'gracePeriodSeconds' || 
                    key === 'slackWebhookUrl' || key === 'discordWebhookUrl' || 
                    key === 'teamsWebhookUrl' || key === 'alertEmails' || key === 'pausedAt' ||
                    key === 'customDownMessage' || key === 'customRecoveryMessage'
        ? `"${key}"`
        : key
      return `${dbKey} = $${Object.keys(updates).indexOf(key) + 1}`
    })
    .concat('"updatedAt" = NOW()')
    .join(', ')
  
  const values = Object.values(updates)

  // Update monitor using unsafe with manual parameter binding
  const queryText = `
    UPDATE "Monitor"
    SET ${setClause}
    WHERE id = $${values.length + 1}
    RETURNING *
  `
  
  const [updated] = await sql.unsafe<Monitor[]>(queryText, [...values, id])

  return NextResponse.json({ monitor: updated })
}
