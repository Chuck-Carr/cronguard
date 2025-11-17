import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const monitors = await prisma.monitor.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      status: true,
      lastPingAt: true,
      nextExpectedPingAt: true,
      intervalSeconds: true,
      _count: {
        select: { pings: true, alerts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ monitors })
}
