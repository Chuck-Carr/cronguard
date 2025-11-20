import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { Monitor } from '@/lib/types'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const monitorsData = await sql`
    SELECT 
      m.id,
      m.name,
      m.status,
      m."lastPingAt",
      m."nextExpectedPingAt",
      m."intervalSeconds",
      COUNT(DISTINCT p.id) as "pingCount",
      COUNT(DISTINCT a.id) as "alertCount"
    FROM "Monitor" m
    LEFT JOIN "Ping" p ON p."monitorId" = m.id
    LEFT JOIN "Alert" a ON a."monitorId" = m.id
    WHERE m."userId" = ${session.user.id}
    GROUP BY m.id, m.name, m.status, m."lastPingAt", m."nextExpectedPingAt", m."intervalSeconds"
    ORDER BY m."createdAt" DESC
  `

  // Transform to match expected format with _count
  const monitors = monitorsData.map((m: any) => ({
    id: m.id,
    name: m.name,
    status: m.status,
    lastPingAt: m.lastPingAt,
    nextExpectedPingAt: m.nextExpectedPingAt,
    intervalSeconds: m.intervalSeconds,
    _count: {
      pings: parseInt(m.pingCount),
      alerts: parseInt(m.alertCount)
    }
  }))

  return NextResponse.json({ monitors })
}
